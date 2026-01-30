<template>
	<div class="flex-1 flex flex-col h-full bg-[var(--background-gray-main)] relative overflow-hidden">
        
		<!-- Main Content Centered -->
		<div class="flex-1 flex flex-col items-center px-4 pt-[18vh]">
			<div id="chat-home-view-container" class="w-full max-w-full sm:max-w-[768px] sm:min-w-[390px] mx-auto">
                <div class="relative w-full flex flex-col items-center gap-[40px]">
                    <!-- Title using conditional text -->
                    <h1 class="text-[var(--text-primary)] text-center w-full font-serif text-[36px] mb-[34px] tracking-tight animate-fade-in-up" style="animation-delay: 0.2s; animation-fill-mode: forwards;">
                        <span v-if="activeTool && activeTool !== 'website'" class="opacity-0">What can I do for you?</span>
                        <span v-else>What can I do for you?</span>
                    </h1>
                </div>

                <!-- Input Card Area -->
                <div class="flex flex-col gap-1 w-full  animate-fade-in-up" style="animation-delay: 0.3s; animation-fill-mode: forwards;">
                    <div class="flex flex-col w-full">
                        <div class="relative  bg-[var(--fill-tsp-gray-main)] rounded-[22px]">
                            <!-- Main Input Box with dynamic padding if tool is active -->
                            <div class="flex flex-col gap-3 rounded-[22px] relative bg-[var(--fill-input-chat)] py-3 w-full z-[20] shadow-[0px_12px_32px_0px_rgba(0,0,0,0.02)] border border-black/5 dark:border-[var(--border-main)] focus-within:border-black/10 transition-all duration-300">
                                <!-- Text Area -->
                                <div class="overflow-auto ps-4 pe-2 bg-transparent pt-[1px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full placeholder:text-[var(--text-disable)] text-[15px] leading-[24px] min-h-[50px] max-h-[216px]">
                                    <TiptapEditorContent :editor="editor" class="w-full" />
                                </div>

                                <!-- Toolbar -->
                                <div class="px-3">
                                    <div class="flex gap-2 items-center">
                                        <div class="flex gap-2 items-center flex-shrink-0">
                                            <!-- Plus -->
                                            <button class="rounded-full border border-[var(--border-main)] inline-flex items-center justify-center gap-1 clickable cursor-pointer text-xs text-[var(--text-secondary)] hover:bg-[var(--fill-tsp-gray-main)] w-8 h-8 p-0 shrink-0 transition-colors">
                                                <PlusIcon class="w-[18px] h-[18px]" />
                                            </button>
                                            
                                            <!-- Browser/Globe Icon Pill -->
                                            <div v-if="!activeTool" class="flex items-center gap-[4px] p-[6px] px-[8px] cursor-pointer rounded-[100px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-gray-main)] transition-colors">
                                                <GlobeAltIcon class="w-4 h-4 text-[var(--text-secondary)]" />
                                                <span class="text-[12px] text-[var(--text-secondary)] font-medium">My Browser</span>
                                            </div>
                                            
                                            <!-- Tool Pill (Active Mode) -->
                                            <div v-if="activeTool" class="flex items-center gap-[6px] pl-[10px] pr-[12px] py-[6px] cursor-pointer rounded-full bg-blue-50 text-blue-600 border border-blue-100 transition-colors group">
                                                <button @click.stop="activeTool = null" class="hover:bg-blue-100 rounded-full p-0.5 transition-colors">
                                                    <XMarkIcon class="w-3.5 h-3.5" />
                                                </button>
                                                <span class="text-[13px] font-medium leading-none pb-[1px]">{{ currentTool?.name }}</span>
                                            </div>
                                        </div>

                                        <div class="min-w-0 flex gap-2 ml-auto flex-shrink items-center">
                                            <div class="flex items-center gap-1">
                                                <!-- Model Selection -->
                                                <ModelSelector variant="pill" :icon="ChatBubbleOvalLeftEllipsisIcon" :show-icon="false" />
                                                
                                                <button class="flex items-center justify-center cursor-pointer hover:bg-[var(--fill-tsp-gray-main)] size-8 flex-shrink-0 rounded-full transition-colors">
                                                    <MicrophoneIcon class="w-4 h-4 text-[var(--text-secondary)]" />
                                                </button>
                                            </div>

                                            <!-- Send Button -->
                                            <button 
                                                @click="() => handleSendMessage()" 
                                                :disabled="!hasContent" 
                                                class="flex items-center justify-center w-8 h-8 rounded-full transition-all bg-[var(--text-primary)] text-white disabled:bg-[var(--fill-tsp-white-dark)] disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                                            >
                                                <ArrowUpIcon class="w-[18px] h-[18px] stroke-[2.5]" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- "Connect your tools" Banner (Matches user screenshot) -->
                            <div v-if="!activeTool" class="mx-3 mt-1 mb-1 py-2 px-3 flex items-center justify-between group animate-fade-in-up" style="animation-delay: 0.1s;">
                                <div class="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="w-4 h-4 text-[var(--text-tertiary)]" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M5 12h2" />
                                        <path d="M17 12h2" />
                                        <path d="M11 2v2" />
                                        <path d="M11 20v2" />
                                        <path d="M5 12a6 6 0 0 1 6-6" />
                                        <path d="M11 6a6 6 0 0 1 6 6" />
                                        <path d="M11 18a6 6 0 0 1-6-6" />
                                        <path d="M17 12a6 6 0 0 1-6 6" />
                                    </svg>
                                    <span class="text-[13px] text-[var(--text-secondary)] font-medium">Connect your tools to Manus</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="flex items-center -space-x-1">
                                        <img src="/other.png" alt="" class="h-[22px]">
                                    </div>
                                    <button class="text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors p-1">
                                        <XMarkIcon class="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Suggestions / Home View -->
                <div v-if="!activeTool" class="mt-8 flex flex-wrap justify-center gap-2 animate-fade-in-up" style="animation-delay: 0.4s; animation-fill-mode: forwards;">
                    <!-- Create slides -->
                    <button @click="handleToolSelect('slides')" class="h-10 px-[14px] py-[7px] rounded-full border border-[var(--border-main)] flex justify-center items-center gap-2 clickable hover:bg-[var(--fill-tsp-white-light)] transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="18" height="18" class="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">
                            <path d="M6.99976 5.9974V4.26406C6.99976 3.38041 7.7161 2.66406 8.59976 2.66406H15.3998C16.2834 2.66406 16.9998 3.38041 16.9998 4.26406V5.9974" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5.00024 10V8C5.00024 6.89543 5.89567 6 7.00024 6H17.0002C18.1048 6 19.0002 6.89543 19.0002 8V10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M19 10H5C3.89543 10 3 10.8954 3 12V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V12C21 10.8954 20.1046 10 19 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="text-[var(--text-primary)] text-[14px]">Create slides</span>
                    </button>

                    <!-- Build website -->
                    <button @click="handleToolSelect('website')" class="h-10 px-[14px] py-[7px] rounded-full border border-[var(--border-main)] flex justify-center items-center gap-2 clickable hover:bg-[var(--fill-tsp-white-light)] transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" width="18" height="18" class="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">
                            <path d="M15 1.5H3C2.17157 1.5 1.5 2.33947 1.5 3.375V14.625C1.5 15.6605 2.17157 16.5 3 16.5H15C15.8284 16.5 16.5 15.6605 16.5 14.625V3.375C16.5 2.33947 15.8284 1.5 15 1.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 5H16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M7 9L5.5 10.5L7 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M11 9L12.5 10.5L11 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="text-[var(--text-primary)] text-[14px]">Build website</span>
                    </button>

                    <!-- Develop apps -->
                    <button @click="handleToolSelect('app')" class="h-10 px-[14px] py-[7px] rounded-full border border-[var(--border-main)] flex justify-center items-center gap-2 clickable hover:bg-[var(--fill-tsp-white-light)] transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="18" height="18" class="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                            <path d="M12 18h.01" />
                        </svg>
                        <span class="text-[var(--text-primary)] text-[14px]">Develop apps</span>
                    </button>

                    <!-- Design -->
                    <button @click="handleToolSelect('design')" class="h-10 px-[14px] py-[7px] rounded-full border border-[var(--border-main)] flex justify-center items-center gap-2 clickable hover:bg-[var(--fill-tsp-white-light)] transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" width="18" height="18" class="text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)] transition-colors">
                            <path d="M3.457 8.86C3.98 8.58 4.576 8.465 5.166 8.524c.59.06 1.15.293 1.608.67.458.378.793.882.965 1.45.17.568.169 1.174-.004 1.741-.173.568-.511 1.071-.97 1.447-.46.375-1.02.606-1.61.663-2.323.224-2.583.27-2.816 1.396" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13.348 1.275c.5 0 .983.2 1.337.554.354.354.553.835.553 1.336 0 .502-.2 1.982-.553 2.337l-7.351 7.35-1.895-.99" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="text-[var(--text-primary)] text-[14px]">Design</span>
                    </button>

                    <button class="h-10 px-[14px] text-sm py-[7px] rounded-full border border-[var(--border-main)] flex justify-center items-center clickable hover:bg-[var(--fill-tsp-white-light)] text-[var(--text-primary)] transition-colors">
                        More
                    </button>
                </div>
                
                <!-- Expanded Tool View -->
                <div v-if="activeTool && currentTool" class="mt-8 flex flex-col gap-8 w-full animate-fade-in-up">
                    
                    <!-- Website Layout -->
                    <div v-if="activeTool === 'website'" class="flex flex-col gap-6 w-full">
                        <ToolChips 
                            title="What would you like to build?" 
                            :chips="currentTool.chips || []"
                            :links="currentTool.links || []"
                            @select="handlePromptSelect"
                        />
                        
                        <ToolIntegrations v-if="currentTool.showIntegrations" />
                    </div>

                    <!-- Default Tool Layout (Slides, App, Design) -->
                    <div v-else class="flex flex-col gap-8 w-full">
                        <SamplePrompts 
                            v-if="currentTool.prompts && currentTool.prompts.length" 
                            :prompts="currentTool.prompts" 
                            @select="handlePromptSelect" 
                        />
                        
                        <TemplateSelector 
                            v-if="currentTool.templates && currentTool.templates.length" 
                            :templates="currentTool.templates" 
                        />
                    </div>
                </div>

                <!-- Footer Promo Cards -->
                <div v-if="!activeTool" class="mt-20 flex gap-3 overflow-x-auto pb-4 scrollbar-none animate-fade-in-up" style="animation-delay: 0.5s; animation-fill-mode: forwards;">
                    <div class="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.33%-8px)] min-h-[92px] p-4 rounded-[12px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] clickable transition-colors">
                        <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                             <PuzzlePieceIcon class="w-6 h-6 text-blue-600" />
                        </div>
                        <p class="text-[var(--text-primary)] text-sm font-medium leading-tight">Get new capabilities with custom skills</p>
                    </div>
                    <div class="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.33%-8px)] min-h-[92px] p-4 rounded-[12px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] clickable transition-colors">
                        <div class="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-2">
                             <EnvelopeIcon class="w-6 h-6 text-red-600" />
                        </div>
                        <p class="text-[var(--text-primary)] text-sm font-medium leading-tight">Stay updated with the latest news</p>
                    </div>
                    <div class="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(33.33%-8px)] min-h-[92px] p-4 rounded-[12px] border border-[var(--border-main)] hover:bg-[var(--fill-tsp-white-light)] clickable transition-colors">
                        <div class="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-2">
                             <GlobeAltIcon class="w-6 h-6 text-green-600" />
                        </div>
                        <p class="text-[var(--text-primary)] text-sm font-medium leading-tight">Explore the global community</p>
                    </div>
                </div>
			</div>
		</div>
	</div>

</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConversationStore } from '../stores/conversation'
import { useUserStore } from '../stores/user'
import { useModelStore } from '../stores/models'
import { useEditor, EditorContent as TiptapEditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { 
    PlusIcon, 
    GlobeAltIcon, 
    PuzzlePieceIcon, 
    XMarkIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    MicrophoneIcon,
    ArrowUpIcon,
    LinkIcon,
    EnvelopeIcon
} from '@heroicons/vue/24/outline'
import ModelSelector from './ModelSelector.vue'
import SamplePrompts from './SamplePrompts.vue'
import TemplateSelector from './TemplateSelector.vue'
import ToolChips from './ToolChips.vue'
import ToolIntegrations from './ToolIntegrations.vue'
import {
    DocumentTextIcon,
    ChartBarIcon,
    BriefcaseIcon,
    BuildingOfficeIcon,
    CloudIcon,
    UserIcon,
    LinkIcon as LinkIconSolid,
    PhotoIcon
} from '@heroicons/vue/24/solid'

// --- Types ---
type ToolType = 'slides' | 'website' | 'app' | 'design' | null

interface ToolConfig {
    id: ToolType
    name: string
    icon: any
    color: string
    placeholder: string
    prompts?: Array<{ text: string }>
    templates?: Array<any>
    chips?: Array<{ text: string, icon?: any }>
    links?: Array<{ text: string, icon?: any }>
    showIntegrations?: boolean
}

const router = useRouter()
const conversationStore = useConversationStore()
const userStore = useUserStore()
const emit = defineEmits(['send-message'])

const props = defineProps<{
    mode?: string,
    isLoading?: boolean
}>()

// --- State ---
const activeTool = ref<ToolType>(null)
const hasContent = ref(false)

// --- Tool Configurations ---
const tools: Record<string, ToolConfig> = {
    slides: {
        id: 'slides',
        name: 'Slides',
        icon: null, // Dynamic in template
        color: 'text-blue-500',
        placeholder: 'Describe the presentation you want to create...',
        prompts: [
            { text: 'Create a presentation on the impact of AI on the future of work' },
            { text: 'Create a sales presentation for a B2B software solution' },
            { text: 'Design a pitch deck for a startup seeking funding' },
            { text: 'Prepare a training module on cybersecurity best practices' }
        ],
        templates: [
            { id: 't1', name: 'The Golden Age of Jazz', image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&h=300&fit=crop' },
            { id: 't2', name: 'Future of AI', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=300&fit=crop' },
            { id: 't3', name: 'A Journey Begins', image: 'https://images.unsplash.com/photo-1478720568477-152d9b167518?w=400&h=300&fit=crop' }
        ]
    },
    website: {
        id: 'website',
        name: 'Website',
        icon: GlobeAltIcon,
        color: 'text-purple-500',
        placeholder: 'Describe the website you want to build...',
        chips: [
            { text: 'Landing page', icon: DocumentTextIcon },
            { text: 'Dashboard', icon: ChartBarIcon },
            { text: 'Portfolio', icon: BriefcaseIcon },
            { text: 'Corporate', icon: BuildingOfficeIcon },
            { text: 'SaaS', icon: CloudIcon },
            { text: 'Link in bio', icon: UserIcon }
        ],
        links: [
            { text: 'Add website reference', icon: LinkIcon },
            { text: 'Import from Figma', icon: PhotoIcon }
        ],
        showIntegrations: true,
        prompts: [],
        templates: []
    },
    app: {
        id: 'app',
        name: 'App',
        icon: null,
        color: 'text-green-500',
        placeholder: 'Describe the app functionality...',
        prompts: [
            { text: 'Develop a todo list app with local storage' },
            { text: 'Create a weather dashboard using public API' },
            { text: 'Build a pomodoro timer with notifications' },
            { text: 'Design a chat interface for customer support' }
        ],
        templates: []
    },
    design: {
        id: 'design',
        name: 'Design',
        icon: null,
        color: 'text-pink-500',
        placeholder: 'Describe what you want to design...',
        prompts: [
            { text: 'Design a modern logo for a tech startup' },
            { text: 'Create social media posts for a product launch' },
            { text: 'Design a dashboard UI for analytics' },
            { text: 'Create an infographic about climate change' }
        ],
        templates: []
    }
}

const currentTool = computed(() => activeTool.value ? tools[activeTool.value] : null)

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: 'Assign a task or ask anything',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'tiptap ProseMirror w-full bg-transparent border-none focus:ring-0 p-0 text-[16px] leading-[26px] text-[var(--text-primary)] font-normal resize-none custom-scrollbar min-h-[60px] outline-none',
      enterkeyhint: 'enter',
      translate: 'no',
    },
  },
  onUpdate: ({ editor }) => {
    hasContent.value = !editor.isEmpty
  },
})

// Update placeholder when tool changes
watch(currentTool, (tool) => {
    if (editor.value) {
        // We can't easily update placeholder dynamically with this setup, 
        // but typically you'd reconfigure the extension.
        // For now, we'll keep the generic one or assume simple text update.
    }
})

const modelStore = useModelStore()

function handleSendMessage(directContent?: string) {
    const content = directContent || editor.value?.getText() || ''
	if (!content.trim()) return
	try {
        const modelId = modelStore.selectedModelId?.includes(':') 
            ? modelStore.selectedModelId.split(':')[1] 
            : modelStore.selectedModelId || 'manus-1.6-lite'
            
        emit('send-message', content, modelId)
        editor.value?.commands.clearContent()
        
        // Reset tool after sending
        activeTool.value = null
	} catch (e) {
		console.error('Failed to start chat:', e)
	}
}

// Handle clicking a tool suggestion
function handleToolSelect(toolId: ToolType) {
    activeTool.value = toolId
    // Clear content when switching tools if needed
    editor.value?.commands.focus()
}

// Handle clicking a sample prompt
function handlePromptSelect(text: string) {
    if (!editor.value) return
    editor.value.commands.setContent(text)
    editor.value.commands.focus()
    editor.value.commands.setTextSelection(text.length)
}

// Set up key handler when editor is ready
watch(editor, (instance) => {
    if (instance) {
        instance.setOptions({
            editorProps: {
                handleKeyDown: (view, event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                        event.preventDefault()
                        handleSendMessage()
                        return true
                    }
                    return false
                }
            }
        })
    }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped lang="scss">
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-up {
    opacity: 0;
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.custom-scrollbar {
	scrollbar-width: thin;
	scrollbar-color: rgba(156, 163, 175, 0.1) transparent;

	&::-webkit-scrollbar {
		width: 4px;
	}

	&::-webkit-scrollbar-thumb {
		background-color: rgba(156, 163, 175, 0.1);
		border-radius: 10px;
	}
}

// Hide scrollbar but keep functionality
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

<style lang="scss">
/* Tiptap Styles */
.tiptap {
    outline: none !important;
}

.tiptap p.is-editor-empty:first-child::before {
  color: var(--text-tertiary);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
