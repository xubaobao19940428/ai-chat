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
    // Login/Register routes removed in favor of Modal
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    // We cannot import store here directly if Pinia isn't active, but store is active when router is used.
    // However, it's safer to import inside.
    const publicPages = ['/home'];
    const authRequired = !publicPages.includes(to.path);
    const token = localStorage.getItem('token');

    if (authRequired && !token) {
        // Instead of redirecting to /login, we stop navigation (or allow it but show modal? 
        // For 'chat' apps, usually you redirect to Home or show Modal OVER current view. 
        // Let's redirect to Home AND show modal.
        
        // Dynamically import store to avoid early init issues
        import('@/store/ui').then(({ useUIStore }) => {
            const uiStore = useUIStore()
            uiStore.openLoginModal()
        })
        
        return next('/home');
    }
    next();
});
export default router

