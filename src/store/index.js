import Vue from 'vue'
import Vuex from 'vuex'



Vue.use(Vuex)

const state = {
    floorOptions:[],
    staffOptions:[],
    cityOptions:[],
    floorOptionsAll:[]
    
}
const mutations = {
    upDateFloorOptions (state,value) {
        state.floorOptions = value
    },
    upDateStaffOptions (state,value) {
        state.staffOptions = value
    },
    upDateCityOptions(state,value) {
        state.cityOptions = value
    },
    upDateFloorOptionsAll(state,value){
        state.floorOptionsAll=value
    },
}

const actions= {
    upDateFloorOptions(context, value) {
        context.commit('upDateFloorOptions', value)
    },
    upDateStaffOptions(context, value) {
        context.commit('upDateStaffOptions', value)
    },
    upDateCityOptions(context, value){
        context.commit('upDateCityOptions', value)
    },
    upDateFloorOptionsAll(context, value){
        context.commit('upDateFloorOptionsAll', value)
    }
    
}



export default new Vuex.Store({
	state,
    mutations,
    actions
})
