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
import {Popup} from 'vue-ydui/dist/lib.px/popup';
import {Radio, RadioGroup} from 'vue-ydui/dist/lib.px/radio';
import {Button, ButtonGroup} from 'vue-ydui/dist/lib.px/button';
/* 使用px：import {ActionSheet} from 'vue-ydui/dist/lib.px/actionsheet'; */

Vue.component(Popup.name, Popup);
Vue.component(Radio.name, Radio);
Vue.component(RadioGroup.name, RadioGroup);
Vue.component(Button.name, Button);
Vue.component(ButtonGroup.name, ButtonGroup);
import 'vue-ydui/dist/ydui.base.css';
// import 'vue-ydui/dist/ydui.rem.css';

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
