import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
Vue.use(Router)

const manage = r => require.ensure([], () => r(require('@/page/manage')), 'index');
const index = r => require.ensure([], () => r(require('@/page/index')), 'index');
const products = r => require.ensure([], () => r(require('@/page/products')), 'products');
const about = r => require.ensure([], () => r(require('@/page/about')), 'about');

const routes = [
	{
		path: '/',
		component: manage,
        meta: ['首页'],
        redirect: '/index',
        children:[
            {
                path:'/index',
                meta: ['首页'],
                name:'index',
                component: index,
            },
            {
                path:'/products',
                meta: ['产品介绍'],
                name:'products',
                component: products,
            },
            {
                path:'/about',
                name:'about',
                meta: ['关于我们'],
                component: about,
            }
        ]
	}
]

export default new Router({
    scrollBehavior(to,from,savePosition) { // 在点击浏览器的“前进/后退”，或者切换导航的时候触发。
         // to：要进入的目标路由对象，到哪里去
        // from：离开的路由对象，哪里来
        // savePosition：会记录滚动条的坐标，点击前进/后退的时候记录值{x:?,y:?}
        if (savePosition) {
            return savePosition;
        } else {
            return {x: 0, y: 0}
        }
    },
        routes,
	strict: process.env.NODE_ENV !== 'production',
})
