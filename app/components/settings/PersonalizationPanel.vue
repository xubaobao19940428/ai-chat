<template>
	<div class="w-full space-y-8 pb-8">
		<!-- Basic style and tone -->
		<div class="pb-8 border-b border-[var(--border-light)]">
			<div class="flex items-start justify-between">
				<div class="pr-8">
					<div class="text-[17px] font-semibold text-[var(--text-primary)] mb-1">{{ $t('settings.personalization_tab.basic_style_tone') }}</div>
					<div class="text-[14px] text-[var(--text-tertiary)] leading-relaxed">{{ $t('settings.personalization_tab.basic_style_tone_desc') }}</div>
				</div>
				<div class="relative shrink-0">
					<Listbox v-model="selectedStyleTone">
						<div class="relative z-10">
							<ListboxButton class="flex items-center gap-2 bg-[var(--background-white-main)] hover:bg-[var(--fill-tsp-gray-main)] border border-[var(--border-main)] transition-colors rounded-xl px-4 py-2 text-[15px] font-medium text-[var(--text-primary)] outline-none cursor-pointer">
								<span>{{ styleTones.find((s) => s.value === selectedStyleTone)?.title }}</span>
								<ChevronDown :size="16" class="text-[var(--text-secondary)]" />
							</ListboxButton>
							<transition enter-active-class="transition duration-100 ease-out" enter-from-class="opacity-0 translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-75 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-2">
								<ListboxOptions class="absolute right-0 mt-2 z-50 w-[240px] bg-[var(--background-white-main)] backdrop-blur-3xl border border-[var(--border-main)] rounded-2xl shadow-[var(--shadow-L)] overflow-hidden outline-none py-2">
									<ListboxOption v-for="tone in styleTones" :key="tone.value" :value="tone.value" v-slot="{ active, selected }">
										<li :class="['relative cursor-pointer select-none py-2.5 px-4 transition-colors', active ? 'bg-[var(--fill-tsp-gray-main)]' : '']">
											<div class="flex items-center justify-between">
												<div>
													<div :class="['text-[15px]', selected ? 'font-semibold text-[var(--text-primary)]' : 'text-[var(--text-primary)]']">{{ tone.title }}</div>
													<div class="text-[13px] text-[var(--text-tertiary)] mt-0.5">{{ tone.desc }}</div>
												</div>
												<Check v-if="selected" class="w-4 h-4 text-[var(--text-primary)] shrink-0" />
											</div>
										</li>
									</ListboxOption>
								</ListboxOptions>
							</transition>
						</div>
					</Listbox>
				</div>
			</div>

			<div class="mt-8">
				<div class="text-[15px] font-semibold text-[var(--text-primary)] mb-1">{{ $t('settings.personalization_tab.characteristics') }}</div>
				<div class="text-[14px] text-[var(--text-tertiary)] leading-relaxed mb-6">{{ $t('settings.personalization_tab.characteristics_desc') }}</div>

				<div class="space-y-4">
					<CharacteristicRow v-for="(char, idx) in characteristics" :key="char.key" :label="$t(char.labelKey)" :options="char.options" v-model="personalization[char.key]" :z-index="characteristics.length - idx" />
				</div>
			</div>

			<div class="mt-10">
				<div class="text-[15px] font-semibold text-[var(--text-primary)] mb-3">{{ $t('settings.personalization_tab.custom_instructions') }}</div>
				<textarea v-model="personalization.custom_instructions" :placeholder="$t('settings.personalization_tab.custom_inst_placeholder')" class="w-full h-[80px] p-4 text-[15px] bg-transparent border border-[var(--border-main)] rounded-xl outline-none focus:border-[var(--border-blue)] focus:ring-1 focus:ring-[var(--border-blue)] resize-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"></textarea>
			</div>
		</div>

		<!-- About you -->
		<div class="pb-8 border-b border-[var(--border-light)]">
			<div class="text-[20px] font-semibold text-[var(--text-primary)] mb-6">{{ $t('settings.personalization_tab.about_you') }}</div>

			<div class="space-y-6">
				<div>
					<div class="text-[15px] text-[var(--text-primary)] mb-2">{{ $t('settings.personalization_tab.nickname') }}</div>
					<input type="text" v-model="personalization.nickname" :placeholder="$t('settings.personalization_tab.nickname_placeholder')" class="w-full px-4 py-3 text-[15px] bg-transparent border border-[var(--border-main)] rounded-xl outline-none focus:border-[var(--border-blue)] focus:ring-1 focus:ring-[var(--border-blue)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]" />
				</div>
				<div>
					<div class="text-[15px] text-[var(--text-primary)] mb-2">{{ $t('settings.personalization_tab.occupation') }}</div>
					<div class="relative">
						<input type="text" v-model="personalization.occupation" class="w-full px-4 py-3 text-[15px] bg-transparent border border-[var(--border-main)] rounded-xl outline-none focus:border-[var(--border-blue)] focus:ring-1 focus:ring-[var(--border-blue)] text-[var(--text-primary)]" />
						<!-- Carousel placeholder overlay -->
						<div v-if="!personalization.occupation" class="absolute left-4 top-1/2 -translate-y-1/2 h-[20px] overflow-hidden pointer-events-none">
							<div :class="occupationNoTransition ? '' : 'transition-transform duration-400 ease-in-out'" :style="{ transform: occupationTransitioning ? 'translateY(-50%)' : 'translateY(0)' }">
								<div class="h-[20px] flex items-center text-[15px] text-[var(--text-tertiary)]">{{ currentOccupationPlaceholder }}</div>
								<div class="h-[20px] flex items-center text-[15px] text-[var(--text-tertiary)]">{{ nextOccupationPlaceholder }}</div>
							</div>
						</div>
					</div>
				</div>
				<div>
					<div class="text-[15px] text-[var(--text-primary)] mb-2">{{ $t('settings.personalization_tab.your_details') }}</div>
					<textarea v-model="personalization.your_details" :placeholder="$t('settings.personalization_tab.your_details_placeholder')" class="w-full h-[80px] p-4 text-[15px] bg-transparent border border-[var(--border-main)] rounded-xl outline-none focus:border-[var(--border-blue)] focus:ring-1 focus:ring-[var(--border-blue)] resize-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"></textarea>
				</div>
			</div>
		</div>

		<!-- Memory -->
		<div class="pb-8 border-b border-[var(--border-light)]">
			<div class="flex items-center justify-between mb-6">
				<div class="flex items-center gap-2">
					<div class="text-[20px] font-semibold text-[var(--text-primary)]">{{ $t('settings.personalization_tab.memory') }}</div>
					<CircleHelp :size="16" class="text-[var(--text-tertiary)] cursor-pointer" />
				</div>
				<button class="px-4 py-1.5 rounded-full border border-[var(--border-main)] text-[14px] font-medium text-[var(--text-primary)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors">{{ $t('settings.personalization_tab.manage') }}</button>
			</div>

			<div class="space-y-6">
				<div class="flex items-start justify-between">
					<div class="pr-8">
						<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.ref_saved_mem') }}</div>
						<div class="text-[14px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.personalization_tab.ref_saved_mem_desc') }}</div>
					</div>
					<Switch v-model="personalization.ref_saved_mem" :class="personalization.ref_saved_mem ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1">
						<span :class="personalization.ref_saved_mem ? 'translate-x-3.5' : 'translate-x-0.5'" class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform" />
					</Switch>
				</div>
				<div class="flex items-start justify-between">
					<div class="pr-8">
						<div class="text-[15px] text-[var(--text-primary)]">{{ $t('settings.personalization_tab.ref_chat_history') }}</div>
						<div class="text-[14px] text-[var(--text-tertiary)] mt-1">{{ $t('settings.personalization_tab.ref_chat_history_desc') }}</div>
					</div>
					<Switch v-model="personalization.ref_chat_history" :class="personalization.ref_chat_history ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1">
						<span :class="personalization.ref_chat_history ? 'translate-x-3.5' : 'translate-x-0.5'" class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform" />
					</Switch>
				</div>
			</div>
			<div class="mt-8 text-[13px] text-[var(--text-tertiary)]">
				{{ $t('settings.personalization_tab.memory_footer').replace('{link}', '') }}
				<a href="#" class="underline hover:text-[var(--text-primary)] ml-1">{{ $t('settings.personalization_tab.learn_more') }}</a>
			</div>
		</div>

		<!-- Advanced (hidden) -->
		<div v-if="false" class="pb-12">
			<button @click="isAdvancedOpen = !isAdvancedOpen" class="flex items-center gap-2 text-[20px] font-semibold text-[var(--text-primary)] mb-6 hover:opacity-80 transition-opacity outline-none">
				{{ $t('settings.personalization_tab.advanced') }}
				<ChevronUp v-if="isAdvancedOpen" :size="20" class="text-[var(--text-primary)]" />
				<ChevronDown v-else :size="20" class="text-[var(--text-primary)]" />
			</button>

			<div v-show="isAdvancedOpen" class="space-y-6 pt-2">
				<div v-for="adv in advancedItems" :key="adv.key" class="flex items-start justify-between pb-6 border-b border-[var(--border-light)]">
					<div class="pr-8">
						<div class="text-[15px] text-[var(--text-primary)]">{{ $t(adv.labelKey) }}</div>
						<div class="text-[14px] text-[var(--text-tertiary)] mt-1">{{ $t(adv.descKey) }}</div>
					</div>
					<Switch v-model="personalization[adv.key]" :class="personalization[adv.key] ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-dark)]'" class="relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none shrink-0 mt-1">
						<span :class="personalization[adv.key] ? 'translate-x-3.5' : 'translate-x-0.5'" class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform" />
					</Switch>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { Switch, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { ChevronDown, ChevronUp, Check, CircleHelp } from 'lucide-vue-next'
import CharacteristicRow from './CharacteristicRow.vue'

const { t, tm, rt } = useI18n()

const personalization = reactive({
	gentle_considerate: 'default',
	passionate: 'default',
	titles_lists: 'default',
	emojis: 'default',
	custom_instructions: '',
	nickname: '',
	occupation: '',
	your_details: '',
	ref_saved_mem: true,
	ref_chat_history: true,
	web_search: true,
	canvas: true,
	voice: true,
	adv_voice: true,
	connector_search: false,
} as Record<string, any>)

const isAdvancedOpen = ref(false)
const selectedStyleTone = ref('default')

const styleTones = computed(() => [
	{ value: 'default', title: t('settings.personalization_tab.style_tones.default.title'), desc: t('settings.personalization_tab.style_tones.default.desc') },
	{ value: 'professional', title: t('settings.personalization_tab.style_tones.professional.title'), desc: t('settings.personalization_tab.style_tones.professional.desc') },
	{ value: 'friendly', title: t('settings.personalization_tab.style_tones.friendly.title'), desc: t('settings.personalization_tab.style_tones.friendly.desc') },
	{ value: 'direct', title: t('settings.personalization_tab.style_tones.direct.title'), desc: t('settings.personalization_tab.style_tones.direct.desc') },
	{ value: 'creative', title: t('settings.personalization_tab.style_tones.creative.title'), desc: t('settings.personalization_tab.style_tones.creative.desc') },
	{ value: 'practical', title: t('settings.personalization_tab.style_tones.practical.title'), desc: t('settings.personalization_tab.style_tones.practical.desc') },
	{ value: 'tech', title: t('settings.personalization_tab.style_tones.tech.title'), desc: t('settings.personalization_tab.style_tones.tech.desc') },
	{ value: 'sarcastic', title: t('settings.personalization_tab.style_tones.sarcastic.title'), desc: t('settings.personalization_tab.style_tones.sarcastic.desc') },
])

function makeOptions(category: string) {
	return computed(() => [
		{ value: 'increase', title: t(`settings.personalization_tab.characteristics_options.${category}.increase.title`), desc: t(`settings.personalization_tab.characteristics_options.${category}.increase.desc`) },
		{ value: 'default', title: t(`settings.personalization_tab.characteristics_options.${category}.default.title`), desc: '' },
		{ value: 'decrease', title: t(`settings.personalization_tab.characteristics_options.${category}.decrease.title`), desc: t(`settings.personalization_tab.characteristics_options.${category}.decrease.desc`) },
	])
}

const characteristics = computed(() => [
	{ key: 'gentle_considerate', labelKey: 'settings.personalization_tab.gentle_considerate', options: makeOptions('gentle').value },
	{ key: 'passionate', labelKey: 'settings.personalization_tab.passionate', options: makeOptions('passionate').value },
	{ key: 'titles_lists', labelKey: 'settings.personalization_tab.titles_lists', options: makeOptions('titles_lists').value },
	{ key: 'emojis', labelKey: 'settings.personalization_tab.emojis', options: makeOptions('emojis').value },
])

const advancedItems = [
	{ key: 'web_search', labelKey: 'settings.personalization_tab.web_search', descKey: 'settings.personalization_tab.web_search_desc' },
	{ key: 'canvas', labelKey: 'settings.personalization_tab.canvas', descKey: 'settings.personalization_tab.canvas_desc' },
	{ key: 'voice', labelKey: 'settings.personalization_tab.voice', descKey: 'settings.personalization_tab.voice_desc' },
	{ key: 'adv_voice', labelKey: 'settings.personalization_tab.adv_voice', descKey: 'settings.personalization_tab.adv_voice_desc' },
	{ key: 'connector_search', labelKey: 'settings.personalization_tab.connector_search', descKey: 'settings.personalization_tab.connector_search_desc' },
]

// Occupation placeholder carousel
const occupationPlaceholderIndex = ref(0)
const occupationTransitioning = ref(false)
const occupationNoTransition = ref(false)
let occupationTimer: ReturnType<typeof setInterval> | null = null

const occupationPlaceholders = computed((): string[] => {
	const list = tm('settings.personalization_tab.occupation_placeholders') as any
	if (!Array.isArray(list)) return []
	return list.map((item: any) => rt(item))
})

const currentOccupationPlaceholder = computed(() => {
	const list = occupationPlaceholders.value
	if (!list.length) return ''
	return list[occupationPlaceholderIndex.value % list.length]
})

const nextOccupationPlaceholder = computed(() => {
	const list = occupationPlaceholders.value
	if (!list.length) return ''
	return list[(occupationPlaceholderIndex.value + 1) % list.length]
})

function startOccupationCarousel() {
	if (occupationTimer) return
	occupationTimer = setInterval(() => {
		occupationTransitioning.value = true
		setTimeout(() => {
			occupationNoTransition.value = true
			occupationTransitioning.value = false
			occupationPlaceholderIndex.value = (occupationPlaceholderIndex.value + 1) % occupationPlaceholders.value.length
			requestAnimationFrame(() => {
				occupationNoTransition.value = false
			})
		}, 400)
	}, 3000)
}

function stopOccupationCarousel() {
	if (occupationTimer) {
		clearInterval(occupationTimer)
		occupationTimer = null
	}
}

onMounted(() => {
	startOccupationCarousel()
})

onUnmounted(() => {
	stopOccupationCarousel()
})
</script>
