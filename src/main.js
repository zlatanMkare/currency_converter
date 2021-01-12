import Vue from 'vue'
import App from './App.vue'
import About from './About.vue'
import Home from './Home.vue'
import store from '@/store'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'

require('../src/css/main.css')

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueRouter)
Vue.config.productionTip = false

const routes = [
     { path: '/about', component: About },
     { path: '/', component: Home }
];

const router = new VueRouter ({
     routes,
     mode: 'history'
});

new Vue({
     store,
     router,
     render: h => h(App),
}).$mount('#app')
