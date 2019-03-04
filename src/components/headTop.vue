<template>
    <div class="header_container" >
       <div class="topLogoBox">
           <img class="topLogo" src="../assets/img/logo@2x.png" alt="">
       </div>
        <div class="topUserBox">

            <el-popover
                placement="bottom"
                width="60px"
                v-model="logOutPop">
                <div class="logOutBtn" @click="logOut">退出</div>
                <div style="cursor: pointer;display: flex;align-items: center" slot="reference"><div class="userAvatar"></div>{{currentStaffInfo.name}}</div>
            </el-popover>

        </div>
    </div>
</template>

<script>
	import {mapActions, mapState} from 'vuex'
    import {getCookie,delCookie,setCookie} from "../api/cookie";
	import {getCurrentStaff} from "../api/getData";

    export default {

    	data(){
    		return {
                logOutPop:false,
                currentStaffInfo:{}
    		}
    	},
        mounted () {


        },
        watch: {

        },
        activated(){

        },
    	created(){
            this.getCurrentStaff()

    	},
    	computed: {
            topUserInfo(){
    		    return this.$store.state.topUserInfo
            }
    	},
		methods: {
			...mapActions(['getAdminData']),
            logOut(){
			  this.$router.push({path:'/'})
                this.delCookie('token')
                this.delCookie('level')
            },
            //获取当前员工
            getCurrentStaff(){
                getCurrentStaff({

                }).then(res=>{
                    console.log(res)
                    this.currentStaffInfo = res.result
                })
            },

		},

    }
</script>

<style lang="less">
	@import '../style/mixin';
	.header_container{
		background-color: #fff;
		height: 70px;
        min-width: 1358px;

        color: #fff;
        box-shadow: 0 3px 6px  rgba(0,0,0,.1);
        position: relative;
        z-index: 10;

	}
	.avator{
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 37px;
	}

    .topLogoBox{
        float: left;
        min-width: 200px;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        .topLogo{
            width: 150px;
        }
    }
    .topUserBox{
        float: right;
        width:calc(~ '100% - 258px');
        padding: 0 29px;
        display: flex;
        min-width: 1100px;
        height: 100%;
        background: #fff;
        align-items: center;
        justify-content: flex-end;
        color: #000;
        font-size: 12px;
        .userAvatar{
            width:40px;
            height: 40px;
            background: url("../assets/img/zu25@2x.png") center  no-repeat;
            margin-right: 12px;
            border-radius: 50%;
        }
    }
    .logOutBtn{
        cursor: pointer;
    }
    .logOutBtn:hover{

        color: #0D74DA;
    }


</style>
