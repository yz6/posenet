<template>
    <div class="products">
        <div class="topBanner">
            <div class="content-main topBg">
                <p >开启校园体测人工智能时代</p>
                <img style="width: 380px" src="../assets/img/编组 18@2x.png" alt="">
            </div>
        </div>
        <div class="top2Bg">
            <div>
                <p>智 慧 体 测</p>
                <p>颠覆性变革创新产品，实现校园体测全流程在线、全过程监控、全平台智能，<br> 引领校园体测设备跨越式发展，开启校园体测人工智能时代。</p>
            </div>
        </div>
        <div class="midContent" style="height: 495px">
            <div class="content">
                <p class="title">九 大 核 心 功 能</p>
                <ul style="overflow: hidden;zoom: 1;clear: both">
                    <li class="funItem" v-for="item in functionData">
                        <img :src="item.img" alt="">
                        {{item.name}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="midContent" style="height: 560px;background:#F8FBFF ">
            <div class="content">
                <p class="title">三 大 优 势</p>
                <div class="advantage">
                    <img src="../assets/img/111@2x.png" alt="">
                    <div class="advItem item1">
                        <p class="name">
                            节省测试时间 防止作假
                        </p>
                        <p class="text">
                            节省识别测试者名字时间、人脸识别、不可作假
                        </p>
                    </div>
                    <div class="advItem item2">
                        <p class="name">
                            智能训练 及时反馈
                        </p>
                        <p class="text">
                            学生体育训练智能即时、屏幕自动反馈成绩，提升学生体育训练兴趣
                        </p>
                    </div>
                    <div class="advItem item3">
                        <p class="name">
                            节省录入时间 支持数据分析
                        </p>
                        <p class="text">
                            节省测试成绩录入时间、支持历史数据分析
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottomContent" style="height: 450px;background: #fff">
        <el-carousel height="450px" style="width:100%" arrow="always">
                <el-carousel-item v-for="item in swiperData" :key="item">
                   <div class="swiperBody">
                       <div class="left">
                           <p class="name">{{item.name}}</p>
                           <p class="text">{{item.text}}</p>
                       </div>
                       <img class="right" :src="item.img" alt="">
                   </div>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script>
    export default {
        name: "products",
        data(){
            return{
                functionData:[
                    {
                        name:'任务智能编排',
                        img:require('../assets/img/排版@2x.png')
                    },
                    {
                        name:'人脸智能认证',
                        img:require('../assets/img/认证@2x.png')
                    },
                    {
                        name:'语音智能播报',
                        img:require('../assets/img/播报@2x.png')
                    },
                    {
                        name:'测试智能评分',
                        img:require('../assets/img/编组 14@2x.png')
                    },
                    {
                        name:'视频智能回放',
                        img:require('../assets/img/回放@2x.png')
                    },
                    {
                        name:'违规智能提示',
                        img:require('../assets/img/提示@2x.png')
                    },
                    {
                        name:'远程智能巡视',
                        img:require('../assets/img/编组 21@2x.png')
                    },
                    {
                        name:'体质智能分析',
                        img:require('../assets/img/分析@2x.png')
                    },
                    {
                        name:'数据智能上报',
                        img:require('../assets/img/上报@2x.png')
                    }
                ],
                swiperData:[
                    {
                        name:'实时人体运动分析与标准测量',
                        text:'测试项目包括：立定跳远、仰卧起坐、坐位体前屈、引体向上、50米，800米，1000米等大中小学生标准体育测试项目。',
                        img:require('../assets/img/体测数据图@2x.png')
                    }
                ]
            }
        }
    }
</script>

<style lang="less">
    .products{
        .top2Bg{
            height: 220px;
            display: flex;
            background: #F8FBFF;
            align-items: center;
            justify-content: center;
            text-align: center;

            p:first-child{
                font-family:PingFangSC-Semibold;
                font-weight:600;
                font-size: 20px;
                color: #001962;
            }
            p:last-child{
                width: 500px;
                line-height: 28px;
                color: #666;
                font-size: 14px;
                margin-top: 15px
            }
        }
        .midContent{

            display: flex;
            align-items: center;
            justify-content: center;
            .content{
                width: 960px;
                margin: 0 auto;
            }
            .title{
                text-align: center;
                font-family:PingFangSC-Semibold;
                font-weight:600;
                color:#001962 ;
                font-size: 18px;
                margin-bottom: 40px;
            }
            .funItem{
                float: left;
                width: 33%;
                color: #001962;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                margin-bottom: 35px;
                letter-spacing: 2px;
                img{
                    width:58px;
                    margin-right: 15px;
                }
            }
            .advantage{
                position: relative;
                text-align: center;
                padding-top: 105px;
                img{
                    width: 650px;
                }
                .advItem{
                    position: absolute;
                    .name{
                        font-size: 14px;
                        color:#001962;
                        letter-spacing: 3px;
                        margin-bottom: 5px;
                        font-weight: 600;
                        text-align: left;
                    }
                    .text{
                        color: #666666;
                        font-size: 12px;
                        line-height: 26px;
                        max-width: 160px;
                        text-align: left;
                    }
                }
                .item1{
                    top: 95px;
                    left: 85px;
                }
                .item2{
                    right: 170px;
                    top: -5px;
                }
                .item3{
                    right: 20px;
                    top: 180px;
                }
                .borderLine{
                    border-radius: 8px;


                }
            }
        }
        .bottomContent{
            display: flex;
            align-items: center;
            justify-content: center;

            .swiperBody{
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                .left{
                    .name{
                        font-weight:600;
                        color:rgba(0,25,98,1);
                        margin-bottom:15px;
                        font-size: 14px;
                        letter-spacing: 3px;
                    }
                    .text{
                        color: #000;
                        font-weight: 400;
                        line-height:28px;
                        font-size: 12px;
                        max-width: 260px;
                    }
                }
                .right{
                    width: 550px;
                    margin-left: 50px;
                }

            }
            .el-carousel__arrow{
                background:rgba(161,160,175,0.1);
                color: #666;
                width: 25px;
                font-weight: bold;
                height: 50px;
                border-radius: 3px;
                font-size: 18px;
            }
            .el-carousel__arrow:hover{
                background:rgba(0,209,102,0.1);
                color: #00D166;
            }
            .el-carousel__arrow--left{
                left: 40px;
            }
            .el-carousel__arrow--right{
                right: 40px;
            }

        }
    }
</style>
