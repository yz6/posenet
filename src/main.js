import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import './element-#0D74DA/index.css';
import 'babel-polyfill'
import echarts from 'echarts'
import axios from 'axios'
import fileDownload from'js-file-download'

require('es6-promise').polyfill();
import 'fetch-detector';
import 'fetch-ie8';
Vue.prototype.$echarts = echarts
Vue.prototype.$ajax = axios
Vue.config.productionTip = false;
Vue.use(ElementUI);
import VueQriously from 'vue-qriously';
Vue.use(VueQriously);
Vue.directive('loadmore', {
    bind(el, binding) {
        const selectWrap = el.querySelector('.el-table__body-wrapper')
        selectWrap.addEventListener('scroll', function() {
            let sign = 100
            const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
            if (scrollDistance <= sign) {
                binding.value()
            }
        })
    }
})
new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
