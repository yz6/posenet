import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import './element-#228BFE/index.css';
import 'babel-polyfill'
require('es6-promise').polyfill();
import 'fetch-detector';
import 'fetch-ie8';
Vue.config.productionTip = false;
Vue.use(ElementUI);
import VueQriously from 'vue-qriously';
Vue.use(VueQriously);
import particles from 'particles.js'

Vue.use(particles)
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
