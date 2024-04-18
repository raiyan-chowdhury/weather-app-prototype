import { createRouter, createWebHistory } from 'vue-router'

import LoginPage from '../pages/LoginPage.vue';
import SignUpPage from '../pages/SignUpPage.vue';
import HomePage from '../pages/HomePage.vue';
import LocationsPage from '../pages/LocationsPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';

const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        { path: '/', redirect: { name: 'Login Page' } },
        { path: '/login/', name: 'Login Page', component: LoginPage },
        { path: '/signup/', name: 'Sign Up Page', component: SignUpPage },
        { path: '/home/', name: 'Home Page', component: HomePage, meta: { requiresAuth: true } },
        { path: '/locations/', name: 'Locations Page', component: LocationsPage, meta: { requiresAuth: true } },
        { path: '/profile/', name: 'Profile Page', component: ProfilePage, meta: { requiresAuth: true } },
    ]
});

// Check authentication status before each route navigation
router.beforeEach((to, from, next) => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");

    // Check if the route requires authentication and the user is not authenticated
    if (to.path === '/' && isAuthenticated) {
        next({ name: 'Home Page' });
    } else if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'Login Page' });
    } else {
        next();
    }
});

export default router
