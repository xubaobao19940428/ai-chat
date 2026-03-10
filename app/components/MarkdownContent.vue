<template>
    <div class="markdown-content" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '../utils/markdown'

const props = defineProps<{
    content: string
}>()

// Use computed to memoize the rendering result
// Vue will only re-evaluate this if props.content changes
const renderedContent = computed(() => {
    return renderMarkdown(props.content)
})
</script>

<style lang="scss">
/* We use global-ish styles or deep selectors because v-html content is not scoped */
.markdown-content {
    @apply prose dark:prose-invert prose-neutral max-w-none break-words relative;

    /* Inherit text styles from parent if needed */
    color: inherit;
    font-size: inherit;
    line-height: inherit;

    p {
        margin-bottom: 1rem;

        &:last-child {
            margin-bottom: 0;
        }
    }

    /* Code block styles are already defined in the main page or globally, 
     but we can ensure they are covered here if needed. */
}
</style>
