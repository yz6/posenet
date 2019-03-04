<template>
        <div style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center">
            <div class="loginBox">
                <el-form  :model="loginForm">
                    <el-form-item label="用户名">
                        <el-input v-model="loginForm.user" placeholder="请输入账号"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="login">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
</template>

<script>
    import {login} from "../api/getData";
    import {mapActions, mapState,mapMutations} from 'vuex'
    import {setCookie,getCookie,delCookie} from "../api/cookie";
    import md5 from 'js-md5';

    export default {
        data() {
            return {
                loginForm:{
                    user:'13100678853',
                    password:'dabai521',
                }
            }
        },

        mounted() {

        },
        created() {

        },
        watch:{

        },
        methods: {
            //登录
            login(){
                login({
                    mobile:this.loginForm.user,
                    password:this.loginForm.password
                }).then(res=>{
                    if(res.result){
                        this.$message.success('登录成功')
                        setCookie('token',res.result.token)
                        setCookie('level',res.result.level)
                        if(res.result.level>0){
                            this.$router.push('/seat_info')
                        }else{
                            this.$router.push('/reserve_seat')
                        }


                    }else{
                        this.$message.error(res.message)
                    }
                    console.log(res)
                }).catch(err=>{
                    this.$message.error(err.message)
                })
            },
            //生成10位随机数
            randomWord(randomFlag, min, max) {
                var str = "",
                    range = min,
                    arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
                    pos = "";
                // 随机产生
                if (randomFlag) {
                    range = Math.round(Math.random() * (max - min)) + min;
                }
                for (var i = 0; i < range; i++) {
                    pos = Math.round(Math.random() * (arr.length - 1));
                    str += arr[pos];
                }
                this.random10 = str

            },
            manager(){
                this.$router.push({path:'/seat_info'})
            }
        },
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .loginBox{
        text-align: center;
        img{
            width: 185px;
        }
        .titleName{
            margin: 25px 0 30px 0;
            font-size: 23px;
            color: #272727;
        }
        .userTypeBtn{
            width: 350px;
            height: 68px;
            line-height: 68px;
            background: #0D74DA;
            color: #fff;
            border-radius: 10px;
            margin: 28px 0;
            font-size: 25px;
            text-align: center;
            cursor: pointer;
        }
    }



</style>
