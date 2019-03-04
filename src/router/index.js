import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'
Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const seat_info = r => require.ensure([], () => r(require('@/page/seat_info')), 'seat_info');
const seat_map = r => require.ensure([], () => r(require('@/page/map/seat_map')), 'seat_map');
const seat_map_department = r => require.ensure([], () => r(require('@/page/map/seat_map_department')), 'seat_map_department');//工位地图（部门经理）
const seat_department = r => require.ensure([], () => r(require('@/page/seat_department')), 'seat_department');
const seat_search = r => require.ensure([], () => r(require('@/page/seat_search')), 'seat_search');
const seat_approval = r => require.ensure([], () => r(require('@/page/seat_approval')), 'seat_approval');
const seat_repair = r => require.ensure([], () => r(require('@/page/seat_repair')), 'seat_repair');
const seat_repair_setting = r => require.ensure([], () => r(require('@/page/seat_repair_setting')), 'seat_repair_setting');
const sta_overview = r => require.ensure([], () => r(require('@/page/sta_overview')), 'sta_overview');
const reserve_staff = r => require.ensure([], () => r(require('@/page/reserve_staff')), 'reserve_staff');
const reserve_seat = r => require.ensure([], () => r(require('@/page/reserve_seat')), 'reserve_seat');
const reserve_my = r => require.ensure([], () => r(require('@/page/reserve_my')), 'reserve_my');
const sta_used = r => require.ensure([], () => r(require('@/page/sta_used')), 'sta_used');
const sta_move = r => require.ensure([], () => r(require('@/page/sta_move')), 'sta_move');
const sta_office = r => require.ensure([], () => r(require('@/page/sta_office')), 'sta_office');
const reserve_seat_map = r => require.ensure([], () => r(require('@/page/map/reserve_seat_map')), 'reserve_seat_map');
const reserve_success = r => require.ensure([], () => r(require('@/page/reserve_success')), 'reserve_success');
const reserved_seat_map = r => require.ensure([], () => r(require('@/page/map/reserved_seat_map')), 'reserved_seat_map');
const using_seat_map = r => require.ensure([], () => r(require('@/page/map/using_seat_map')), 'using_seat_map');
const reReserve_seat = r => require.ensure([], () => r(require('@/page/reReserve_seat')), 'reReserve_seat');
const see_seat_map = r => require.ensure([], () => r(require('@/page/map/see_seat_map')), 'see_seat_map');
const reserve_seat_submit = r => require.ensure([], () => r(require('@/page/reserve_seat_submit')), 'reserve_seat_submit');


const routes = [
	{
		path: '/',
		component: login,
        meta: ['登录']
	}, {
		path: '/manage',
		component: manage,
		name: '',
		children: [{
			path: '/seat_info',
			component: seat_info,
			meta: ['工位信息'],
            name:'seat_info'
		},{
            path: '/seat_map',
            component: seat_map,
            meta: ['工位地图'],
            name:'seat_map'
        },{
            path:'/seat_map_department',
            component:seat_map_department,
            meta:['工位地图'],
            name:'seat_map_department'
        },{
            path: '/seat_department',
            component: seat_department,
            meta: ['部门工位'],
            name:'seat_department'
        },{
            path: '/seat_search',
            component: seat_search,
            meta: ['工位查询'],
            name:'seat_search'
        },{
            path: '/seat_approval',
            component: seat_approval,
            meta: ['工位审批'],
            name:'seat_approval'
        },{
            path: '/seat_repair',
            component: seat_repair,
            meta: ['工位报修'],
            name:'seat_repair'
            
        },{
            path: '/reserve_staff',
            component: reserve_staff,
            meta: ['员工预约'],
            name:'reserve_staff'
        },{
            path: '/reserve_seat',
            component: reserve_seat,
            meta: ['工位预约'],
            name:'reserve_seat',
            
        },{
            path: '/reReserve_seat',
            component: reReserve_seat,
            meta: ['再次预约'],
            name:'reReserve_seat',
            
        },{
		    path:'/reserve_seat_map',
            component: reserve_seat_map,
            meta:['工位预约地图'],
            name:'reserve_seat_map'
           
        },{
            path:'/reserved_seat_map',
            component:reserved_seat_map,
            meta:['预约中的工位地图'],
            name:'reserve_seat_map'
         
        },{
            path:'/using_seat_map',
            component:using_seat_map,
            meta:['使用中的工位地图'],
            name:'using_seat_map'
            
        },{ path:'/see_seat_map',
            component:see_seat_map,
            meta:['查看工位'],
            name:'see_seat_map'
            
        },{
            path:'/reserve_success',
            component: reserve_success,
            meta:['预约成功'],
            name:'reserve_success'
            
        },{
            path:'/reserve_seat_submit',
            component: reserve_seat_submit,
            meta:['预约工位'],
            name:'reserve_seat_submit'
            
        },{
		    path:'/reserve_my',
            component: reserve_my,
            meta: ['我的预约'],
            name:'reserve_my'
        },{
            path: '/sta_overview',
            component: sta_overview,
            meta: ['统计概况'],
            name:'sta_overview'
            
        },{
            path: '/sta_used',
            component: sta_used,
            meta: ['已分配的工位统计'],
            name:'sta_used'
            
        },{
            path: '/sta_move',
            component: sta_move,
            meta: ['移动工位统计'],
            name:'sta_move'
            
        },{
            path: '/sta_office',
            component: sta_office,
            meta: ['办公室统计'],
            name:'sta_office'
            
        },{
            path: '/seat_repair_setting',
            component:     seat_repair_setting,
            meta: ['办公室统计'],
            name:'seat_repair_setting'
        
        }]
	}
]

export default new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})
