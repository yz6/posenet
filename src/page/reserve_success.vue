<template>
    <div style="width: 100%;height: 100%" class="margin29">
        <div class="rightTitle">
            <div class="title-left-line"></div>
            <span class="title-words">预约工位</span>
        </div>
        <div class="successBody">
            <div class="content">
                <div class="top">
                    <i class="el-icon-success" style="font-size: 70px;color: #5EB700"></i>
                    <div class="words">
                        <p class="title">工位预约成功</p>
                        <p>请您于 {{seatInfo.signInEndDate.slice(5,16)}} 前签到，避免工位自动释放</p>
                    </div>
                </div>
                <div class="center">
                    <li class="infoItem">
                        <span class="label">工位</span>
                        <span class="value">{{seatInfo.seatCodes}}</span>
                    </li>
                    <li class="infoItem">
                        <span class="label">时间</span>
                        <span class="value">{{seatInfo.startDate}} <span v-show="seatInfo.endDate">- {{seatInfo.endDate}}</span></span>
                    </li>
                    <li class="infoItem">
                        <span class="label">城市</span>
                        <span class="value">{{seatInfo.cityName}}</span>
                    </li>
                    <li class="infoItem">
                        <span class="label">楼宇</span>
                        <span class="value">{{seatInfo.buildingName}}</span>
                    </li>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "reserve_success",
        data(){
            return{
                seatInfo:{
                    seatCodes:'5-156,5-154',
                    signInEndDate:'2019-02-13 17:00:05',
                    startDate:'2019-02-13 16:30:05',
                    endDate:'2019-02-13 17:50:00',
                    cityName:'北京市',
                    buildingName:'融创壹号楼',
                }
            }
        },
        activated(){
            this.seatInfo = this.$route.params.data
        },
        created(){

        },
    }
</script>

<style lang="less">
    .successBody{
        width: 100%;
        background: #fff;
        display: flex;
        justify-content: center;
        padding: 90px 0;
        .content{
            .top{
                display: flex;
                align-items: center;
                .words{
                    margin-left: 50px;
                    .title{
                        font-size: 34px;
                        color: #5EB700;
                    }
                    p{
                        color: #999999;
                        font-size: 16px;
                        margin: 10px 0;
                    }
                }
            }
            .center{
                margin-top: 40px;
                border: 1px #EBF6FB solid ;
                border-radius: 5px;
                padding: 36px 48px;
                .infoItem{
                    font-size: 18px;
                    display: flex;
                    padding-bottom: 20px;
                    .label{
                        color: #666666;
                        margin-right: 40px;
                        width: 50px;
                    }
                    .value{
                        color: #4A494A;
                        width: 100%;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #ebf6fb;
                    }
                }
            }

        }
    }
</style>
