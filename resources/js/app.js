require('./bootstrap');

window.Vue = require('vue').default;
import Vue from "vue";
import VueRouter from "vue-router";
import {routes} from "./routes";
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

Vue.use(ViewUI);
Vue.use(VueRouter);

import Toaster from 'v-toaster'

import 'v-toaster/dist/v-toaster.css'

Vue.use(Toaster, {timeout: 5000})

import Swal from 'sweetalert2'
window.Swal = Swal

const router = new VueRouter({
    mode: 'history',
    routes: routes
});


function loggedIn(){
    return localStorage.getItem('token');
}

router.beforeEach((to, from, next) => {
    if(to.matched.some(record => record.meta.requiresAuth)){
        if(!loggedIn()){
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
        }else {
            next()
        }
    }else if(to.matched.some(record => record.meta.guest)){
        if(loggedIn()){
            next({
                path: '/',
                query: { redirect: to.fullPath }
            })
        }else {
            next()
        }
    }else{
        next()
    }
})

Vue.component('welcome-component', require('./components/WelcomeComponent.vue').default);
Vue.component('home-component', require('./components/HomeComponent.vue').default);



const app = new Vue({
    el: '#app',
    router: router
});
