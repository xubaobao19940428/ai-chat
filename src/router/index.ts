import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@/components/layouts/MainLayout.vue'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: MainLayout,
        redirect: '/chat',
        children: [
            {
                path: 'chat',
                name: 'ChatEmpty',
                component: () => import('@/views/ChatView.vue'),
            },
            {
                path: 'chat/:id',
                name: 'ChatView',
                component: () => import('@/views/ChatView.vue'),
            },
            {
                path: 'image-generation',
                name: 'ImageGeneration',
                component: () => import('@/views/ImageGeneration.vue'),
            },
            {
                path: 'ai-search',
                name: 'AISearchEngine',
                component: () => import('@/views/AISearchEngine.vue'),
            },
            {
                path: 'explore',
                name: 'ExploreBots',
                component: () => import('@/views/ExploreView.vue'),
            },
        ],
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router

