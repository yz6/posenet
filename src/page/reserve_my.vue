<template>
    <div class="reserveMy margin29" >
        <div class="rightTableTopTab">
            <div class="labelItem" :class="currentTab==0?'act':''" @click="switchTab(0)">预约中</div>
            <div class="labelItem" :class="currentTab==1?'act':''" @click="switchTab(1)">使用中</div>
            <div class="labelItem" :class="currentTab==2?'act':''" @click="switchTab(2)">历史预约</div>
        </div>
        <div class="rightTitle" v-if="currentTab==2">
            <div class="selectBox">
                <span class="selectLabel">预约时间</span>
                <el-date-picker
                    style="width: 140px"
                    v-model="date"
                    type="month"
                    format="yyyy MM 月"
                    @change="changeDate"
                    value-format="yyyy-MM"
                    placeholder="选择月">
                </el-date-picker>
            </div>
        </div>
        <div class="rightTable contentBox" v-loading="loading">
            <div class="emptyBgBox" v-if="listData.length<=0 && currentTab !=2">
                <img src="../assets/img/emptyBg@2x.png" alt="">
            </div>
            <div v-if="currentTab!=2">
                <div class="repairItem" v-for="item in listData">
                    <div class="itemTitle" @click="goDetail(item)">
                        <img src="../assets/img/seat–1@2x.png" alt="">

                        <div style="color: #4A4A4A;position: relative">
                            <p style="font-size: 17px;font-weight: bold">{{item.seatCodes.replace(/,/g,"、")}}</p>
                            <p style="font-size: 14px">{{getDateString(item.startDate,item.endDate)}}</p>
                            <i class="el-icon-arrow-right"></i>
                        </div>
                    </div>
                    <div class="repairBtn">
                            <span v-if="currentTab==0">
                                <el-button type="none" @click="cancelReservation(item.id,item.seatCodes)">取消预约</el-button>
                            </span>
                            <span  v-else>
                                <el-button type="primary" @click="reReserve(item.id)">再次预约</el-button>
                                <el-button type="none" @click="logoutSeat(item.id,item.seatCodes)">取消使用</el-button>
                            </span>
                    </div>
                </div>

            </div>
            <div v-else>
                <el-table
                    :data="listData"
                    style="width: 100%">
                    <el-table-column
                        prop="seatCodes"
                        label="工位编号"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="楼层"
                        width="100">
                    </el-table-column>

                    <el-table-column
                        prop="name"
                        label="历史预约时间">
                        <template slot-scope="scope">
                            <span> {{getDateString(scope.row.startDate,scope.row.endDate)}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="操作"
                        show-overflow-tooltip>
                        <template slot-scope="scope">
                            <el-button type="text" @click="reReserve(scope.row.id)">再次预约</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="paginationBox">
                    <el-pagination
                        layout="prev, pager, next"
                        :total="total"
                        :page-size="pageSize"
                        :current-page="currentPage"
                        @current-change="pageChange">
                    </el-pagination>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
    import {staffReservation,cancelReservation,staffLogout} from "../api/getData";
    import {getWeek,getDateString,stampToString} from "../api/optionsData";

    export default {
        name: "reserve_my",
        data() {
            return {
                currentTab: 0,
                date:'',
                pageSize:20,
                listData:[],
                loading:true,
                total:0,
                currentPage:1
            }
        },
        activated(){
            this.staffReservation()
        },
        methods: {
            stampToString:stampToString,
            getDateString:getDateString,
            switchTab(v) {
                this.listData = []
                this.currentTab = v
                this.date = ''
                this.currentPage = 1
                this.staffReservation()
            },
            cancelReservation(id,seat){
                this.$confirm('是否取消工位 '+seat+' 的预约?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    cancelReservation([id]).then(res=>{
                        console.log(res)
                        if(res.result){
                            this.$message.success('您已取消预约')
                            this.staffReservation()
                        }else{
                            this.$message.error(res.message)
                        }
                    }).catch(err=>{
                        this.$message.error(err.message)
                    })
                })

            },
            //分页
            pageChange(v){
                console.log(v)
                this.currentPage = v
                this.staffReservation()
            },
            //根据日期筛选
            changeDate(){

                this.staffReservation()
            },
            //去地图详情
            goDetail(item){
                if(this.currentTab==0){
                    this.$router.push({path:'/reserved_seat_map',query:{id:item.id}})
                }else if(this.currentTab == 1){
                    this.$router.push({path:'/using_seat_map',query:{id:item.id}})
                }

            },
            //获取员工预约数据
            staffReservation(){
                staffReservation({
                    filterType:this.currentTab,
                    filterDate:this.date?this.date:'',
                    pageSize:this.pageSize,
                    pageNo:this.currentPage
                }).then(res=>{
                    this.listData = res.result.rows
                    console.log(this.listData)
                    this.total = res.result.total
                    this.loading = false
                }).catch(err=>{
                    this.loading = false
                })
            },
            //再次预约
            reReserve(id){
                console.log(id)
                this.$router.push({path:'/reReserve_seat',query:{id:id}})
            },

            //注销工位
            logoutSeat(id,seat){
                this.$confirm('是否取消使用中的 '+seat.split(',').length+' 个工位?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    staffLogout({
                        id:id
                    }).then(res=>{
                        console.log(res)
                        if(res.result){
                            this.$message.success('工位注销成功')
                            this.staffReservation()
                        }else{
                            this.$message.error(res.message)
                        }
                    }).catch(err=>{
                        this.$message.error(res.message)
                    })
                })
            },
        }
    }
</script>

<style lang="less">
    .reserveMy {
        .contentBox {
            padding: 18px 15px;
            margin: 0 auto;
        }
        .repairItem {
            width: 31%;
            height: 138px;
            margin: 0 1%;
            margin-bottom: 10px;
            background: #fff;
            float: left;
            border: 1px solid #EBF6FB;
            position: relative;
            .itemTitle {
                margin-top: 11px;
                width: 100%;
                cursor: pointer;
                i {
                    position: absolute;
                    right: 10px;
                    top: 30%;
                }
                img {
                    width: 48px;
                    margin: 0 10px;
                    float: left;
                }
                p {
                    line-height: 27px;
                    margin: 5px 0;
                }
            }
            .repairBtn {
                position: absolute;
                right: 10px;
                bottom: 10px;
            }
        }
    }

</style>
