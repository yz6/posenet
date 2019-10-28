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
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)
const i18n = new VueI18n({
    // locale: LangStorage.getLang('zh'),  // 语言标识，后面会用做切换和将用户习惯存储到本地浏览器
    locale: 'en', // 语言标识
    messages: {
        'zh': require('../static/lang/zh'),
        'en': require('../static/lang/en')
    }})
new Vue({
	el: '#app',
	router,
	store,
    i18n:i18n,
	template: '<App/>',
	components: { App }
})
