<template>
    <div class="manage_page fillcontain">

        <head-top></head-top>

        <div class="menuBox" style="width: 100%;height: calc(100% - 70px)">
            <div class="leftMenu noselect"
                 style="min-height: 100%; background-color:#fff;min-width: 200px">
                <div style="width: 100%" class="topLogo"><img src="../assets/img/zu25@2x.png" alt="">
                    <p>智能⼯位预约系统</p></div>
                <el-menu
                    v-if="level != 0"
                    class="el-menu-vertical"
                    :default-active="currentTabName"
                    unique-opened
                    router>
                    <el-submenu index="seat_manage">
                        <template slot="title">
                            <i class="menu-title-icon title1" ></i><span style="font-size: 15px">工位管理</span>
                        </template>
                            <el-menu-item  index="/seat_info">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                工位信息
                            </el-menu-item>
                            <el-menu-item :index="level==2?'/seat_map':'/seat_map_department'">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                工位地图
                            </el-menu-item>
                            <el-menu-item index="/seat_department">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                部门工位
                            </el-menu-item>
                            <el-menu-item index="/seat_search">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                工位查询
                            </el-menu-item>
                            <el-menu-item index="/seat_approval" v-if="level==2">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                工位审批
                            </el-menu-item>
                            <el-menu-item index="/seat_repair" v-if="level==2">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                工位报修
                            </el-menu-item>
                    </el-submenu>
                    <el-submenu index="reserve_manage">
                        <template slot="title">
                            <i class="menu-title-icon title2"  ></i><span style="font-size: 15px">预约管理</span>
                        </template>
                            <el-menu-item index="/reserve_staff">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                员工预约
                            </el-menu-item>
                            <el-menu-item index="/reserve_seat">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                预约工位
                            </el-menu-item>
                            <el-menu-item index="/reserve_my">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                我的预约
                            </el-menu-item>
                    </el-submenu>
                    <el-submenu index="statistics_manage" v-if="level == 2">
                        <template slot="title">
                            <i class="menu-title-icon title3" ></i><span style="font-size: 15px">统计信息</span>
                        </template>
                            <el-menu-item index="/sta_overview">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                统计概况
                            </el-menu-item>
                            <el-menu-item index="/sta_used">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                已分配工位统计
                            </el-menu-item>
                            <el-menu-item index="/sta_move">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                移动工位统计
                            </el-menu-item>
                            <el-menu-item index="/sta_office">
                                <div class="menu-item-icon"><img class="itemIcon" src="../assets/img/177@2x.png" alt=""></div>
                                办公室统计
                            </el-menu-item>
                    </el-submenu>

                </el-menu>
                <el-menu
                    v-else
                    class="el-menu-vertical"
                    :default-active="currentTabName"
                    unique-opened
                    router>
                    <el-menu-item index="/reserve_seat">
                        <i class="menu-title-icon title1" ></i>
                        预约工位
                    </el-menu-item>
                    <el-menu-item index="/reserve_my">
                        <i class="menu-title-icon title2" ></i>
                        我的预约
                    </el-menu-item>
                    <el-menu-item index="/seat_search">
                        <i class="menu-title-icon title4" ></i>
                        工位查询
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="rightContent" id="rightContentBox" style="width: calc(100% - 200px)">

                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script>
    import headTop from '@/components/headTop'
    import {getAllFloorNumbers} from "../api/getData";
    import {getCookie, delCookie} from "../api/cookie";
    import {educationR} from "../api/optionsData";

    export default {
        data() {
            return {
                screenWidth: "",
                collapse: false,
                currentTabName: "/" + this.$route.path.replace('/', ''),
                iconPath: {
                    menuIcon1:require('../assets/img/299@2x.png'),
                    menuIcon1_act:require('../assets/img/300@2x.png'),
                    menuIcon2:require('../assets/img/297@2x.png'),
                    menuIcon2_act:require('../assets/img/298@2x.png'),
                    menuIcon3:require('../assets/img/301@2x.png'),
                    menuIcon3_act:require('../assets/img/302@2x.png'),
                },
                packageData: {},
                hiddenBadge: true,
                level:getCookie('level')
            }
        },
        created() {
            var that = this
            console.log(this.level)

        },
        activated() {

        },
        components: {
            headTop,
        },

        computed: {


        },
        watch: {
            '$route'(v) {
                this.currentTabName = "/"+this.$route.path.replace('/', '')
            },
        },
        methods: {
            currentTab(e) {
                console.log(e)
                this.currentTabName = e
                if (e == 'chat') {
                    this.hiddenBadge = true
                    // window.location.reload()
                }
            },
        },


    }
</script>


<style lang="less">
    @import '../style/mixin';

    .menuBox .leftMenu .newMessage {
        .is-dot {
            right: 0px;
            top: 15px;
            border: none;
        }
    }
    .el-submenu{
        .el-menu-item{
            color: #666666;
        }

    }
        .menu-title-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-right: 15px;
            background-size: contain;
            border: none;
            background-repeat: no-repeat;
        }
        .el-submenu.is-active{
            .menu-title-icon.title1{
                background-image: url("../assets/img/300@2x.png");
            }
            .menu-title-icon.title2{
                background-image: url("../assets/img/298@2x.png");
            }
            .menu-title-icon.title3{
                background-image: url("../assets/img/302@2x.png");
            }
        }
    .menu-title-icon.title1{
        background-image: url("../assets/img/299@2x.png");
    }
    .menu-title-icon.title2{
        background-image: url("../assets/img/297@2x.png");
    }
    .menu-title-icon.title3{
        background-image: url("../assets/img/301@2x.png");
    }
    .menu-title-icon.title4{
        background-image: url("../assets/img/chaxun@2x.png");
    }
    .menuBox .el-menu-item.is-active{
        .title1{
            background-image: url("../assets/img/300@2x.png");;
        }
        .title2{
            background-image: url("../assets/img/298@2x.png");;
        }
        .title4{
            background-image: url("../assets/img/chaxunact@2x.png");
        }
    }

    .loadingBox {
        min-height: 600px;

    }

    .perfectTips {
        min-width: 1100px;
        margin: 0 auto;
        height: 46px;
        position: fixed;
        z-index: 100;
        background: #E7F8FF;
        border: 1px solid #A0E4FE;
        border-radius: 4px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        .left {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #666666;
            letter-spacing: 0;
            line-height: 20px;
            margin-left: 16px;
            i {
                margin-right: 4px;
            }
        }
        .right {
            margin-right: 10px;
            .el-button {
                padding: 6px 10px;
                font-size: 12px;
            }
            .typea {
                background: #4C8DEB;
                color: #fff;
                border: 1px solid #4C8DEB;
            }
        }
    }
</style>

