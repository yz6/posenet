<template>
  <div class="fillcontain">
      <div style="position: relative;">
          <head-top style="position: absolute;top: 0"></head-top>
          <router-view ></router-view>
      </div>
      <Footer ></Footer>
  </div>
</template>

<script>
    import {login,getCode} from "../api/getData";
    import Footer from '../components/footer'
    import headTop from '../components/headTop'
    export default {
        components: {
            headTop,
            Footer
        },
        data() {
            return {
                loginForm:{
                    mobile:'',
                    code:'',
                },
                count:0,
                canClick:true,
                pHeight:0
            }
        },
        updated(){

        },
        mounted(){


        },
        created() {

        },
        watch:{
            '$route'(){
                let that = this
                let minH = 450
                that.pHeight = 0
                let a = document.documentElement.clientHeight-170
                that.pHeight =a<minH?minH:a

            }
        },
        methods: {

        },
    }
</script>

<style lang="less">
    @import '../style/mixin';
#particles-js{
   width: 100%;
    position:absolute;
    z-index: 1;
    top:70px;
    left:0;
    border-color:#000 ;
    .particles-js-canvas-el{
        border-color: #000;
    }
}


</style>
