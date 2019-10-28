<template>
    <div id="app" >
		    <router-view ></router-view>
    </div>
</template>

<script>
    import store from './store/';
    export default {
        data(){
            return{
                sessionList: [],
            }
        },
        computed: {
        },

        created(){



        },
        methods:{
            routeChange(){
                document.title= this.$route.meta[0]
            },
            IEVersion() {

            }

        },
        watch:{

    }

    }
</script>

<style lang="less">
	@import './style/common';
    *{
        font-family: PingFangSC-Regular;
        margin: 0;
        padding: 0;
        list-style: none;
    }

</style>
