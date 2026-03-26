import { ref, type Ref, onUnmounted } from 'vue'

interface SpeechRecognitionOptions {
	lang?: Ref<string> | string
	onResult?: (text: string) => void
}

export function useSpeechRecognition(options?: SpeechRecognitionOptions) {
	const isListening = ref(false)
	const transcript = ref('')
	const interimTranscript = ref('')
	const duration = ref(0)
	const audioLevel = ref(0)

	let recognition: any = null
	let durationTimer: ReturnType<typeof setInterval> | null = null
	let audioContext: AudioContext | null = null
	let analyser: AnalyserNode | null = null
	let mediaStream: MediaStream | null = null
	let animationFrame: number | null = null

	const isSupported = typeof window !== 'undefined' &&
		('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

	// Map short locale codes to BCP 47 tags for Web Speech API
	const LOCALE_MAP: Record<string, string> = {
		zh: 'zh-CN', en: 'en-US', ja: 'ja-JP', ko: 'ko-KR',
		es: 'es-ES', fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR',
	}

	function resolveLang(): string {
		const raw = options?.lang
		const code = raw ? (typeof raw === 'string' ? raw : raw.value) : ''
		if (!code) return navigator.language || 'zh-CN'
		return LOCALE_MAP[code] || code
	}

	function setupAudioAnalysis(stream: MediaStream) {
		mediaStream = stream
		audioContext = new AudioContext()
		analyser = audioContext.createAnalyser()
		analyser.fftSize = 256
		analyser.smoothingTimeConstant = 0.7
		const source = audioContext.createMediaStreamSource(stream)
		source.connect(analyser)

		const dataArray = new Uint8Array(analyser.frequencyBinCount)

		function updateLevel() {
			if (!analyser || !isListening.value) return
			analyser.getByteFrequencyData(dataArray)
			let sum = 0
			for (let i = 0; i < dataArray.length; i++) {
				sum += dataArray[i]!
			}
			audioLevel.value = sum / dataArray.length / 255
			animationFrame = requestAnimationFrame(updateLevel)
		}
		updateLevel()
	}

	function stopAudioAnalysis() {
		if (animationFrame !== null) {
			cancelAnimationFrame(animationFrame)
			animationFrame = null
		}
		if (mediaStream) {
			mediaStream.getTracks().forEach((t) => t.stop())
			mediaStream = null
		}
		if (audioContext) {
			audioContext.close()
			audioContext = null
		}
		analyser = null
		audioLevel.value = 0
	}

	function start() {
		if (!isSupported) return

		// Show UI immediately
		isListening.value = true
		duration.value = 0
		transcript.value = ''
		interimTranscript.value = ''

		// Start audio analysis in background (for waveform visualization)
		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			if (!isListening.value) { stream.getTracks().forEach((t) => t.stop()); return }
			setupAudioAnalysis(stream)
		}).catch(() => { /* mic denied — waveform won't work but recognition may still function */ })

		// Speech recognition
		const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
		recognition = new SpeechRecognitionAPI()
		recognition.continuous = true
		recognition.interimResults = true
		recognition.lang = resolveLang()

		recognition.onresult = (event: any) => {
			let finalText = ''
			let interimText = ''
			for (let i = 0; i < event.results.length; i++) {
				const result = event.results[i]
				if (result.isFinal) {
					finalText += result[0].transcript
				} else {
					interimText += result[0].transcript
				}
			}
			transcript.value = finalText
			interimTranscript.value = interimText
		}

		recognition.onerror = (event: any) => {
			if (event.error === 'aborted' || event.error === 'no-speech') return
			console.error('Speech recognition error:', event.error)
			stop()
		}

		recognition.onend = () => {
			// Auto-restart if still listening (browser stops after silence timeout)
			if (isListening.value) {
				try { recognition?.start() } catch { /* ignore */ }
			}
		}

		try {
			recognition.start()
		} catch (e) {
			console.error('Failed to start speech recognition:', e)
			stopAudioAnalysis()
			return
		}

		durationTimer = setInterval(() => {
			duration.value++
		}, 1000)
	}

	function stop() {
		isListening.value = false

		if (durationTimer) {
			clearInterval(durationTimer)
			durationTimer = null
		}

		if (recognition) {
			recognition.onend = null
			recognition.onresult = null
			recognition.onerror = null
			try { recognition.stop() } catch { /* ignore */ }
			recognition = null
		}

		// Stop audio analysis AFTER recognition to avoid releasing mic too early
		stopAudioAnalysis()
	}

	function confirm(): string {
		const final = transcript.value
		const interim = interimTranscript.value
		const result = (final + interim).trim()
		stop()
		options?.onResult?.(result)
		return result
	}

	function cancel() {
		stop()
		transcript.value = ''
		interimTranscript.value = ''
	}

	function formatDuration(seconds: number): string {
		const m = Math.floor(seconds / 60)
		const s = seconds % 60
		return `${m}:${String(s).padStart(2, '0')}`
	}

	onUnmounted(() => {
		stop()
	})

	return {
		isSupported,
		isListening,
		transcript,
		interimTranscript,
		duration,
		audioLevel,
		start,
		stop,
		confirm,
		cancel,
		formatDuration,
	}
}
