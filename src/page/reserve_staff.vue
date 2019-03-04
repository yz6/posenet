<template>
    <div class="reserveStaff margin29">
        <div class="rightTableTopTab">
            <div class="labelItem" :class="currentTab==0?'act':''" @click="switchTab(0)">预约中</div>
            <div class="labelItem" :class="currentTab==1?'act':''" @click="switchTab(1)">使用中</div>
            <div class="labelItem" :class="currentTab==2?'act':''" @click="switchTab(2)">历史预约</div>
        </div>
        <div class="rightTitle">
            <div class="selectBox">
                <span class="selectLabel">楼层</span>
                <el-select @change="floorChange" v-model="floorId" style="width: 120px">
                    <el-option
                        v-for="item in floorOptionsAll"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <span class="selectLabel">部门</span>
                <el-select @change="changeDepartment"  v-model="department" style="width: 120px">
                    <el-option
                        v-for="item in depOptions"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <span class="selectLabel" v-if="currentTab!=1">预约时间</span>
                <el-radio-group v-if="currentTab!=1"  @change="dateTypeChange" style="margin-right: 10px;" v-model="dateType">
                    <el-radio-button style="box-shadow: none" label="1">按日</el-radio-button>
                    <el-radio-button style="box-shadow: none" label="2">按月</el-radio-button>
                </el-radio-group>
                <el-date-picker v-if="currentTab!=1"
                    style="width: 160px"
                    @change="getStaffReservation"
                    v-show="dateType=='1'"
                    v-model="dayDate"
                    type="date"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                    placeholder="选择预约时间">
                </el-date-picker>
                <el-date-picker
                    :picker-options="pickerOptions"
                    @change="getStaffReservation"
                    v-show="dateType=='2'"
                    style="width: 160px"
                    v-model="monthDate"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="选择预约时间">
                </el-date-picker>
            </div>
        </div>
        <div class="contentBox rightTable">
            <el-table
                :data="tableData"
                ref="mytable"
                v-loadmore='loadMore'
                height="668"
                @selection-change="selectionChange"
                style="width: 100%">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    label="工位编号"
                    width="120">
                    <template slot-scope="scope">{{ scope.row.code }}</template>
                </el-table-column>
                <el-table-column
                    prop="floor"
                    label="楼层">
                    <template slot-scope="scope">{{ scope.row.floorNumber +'楼' }}</template>
                </el-table-column>
                <el-table-column
                    prop="repairDate"
                    label="预约时间"
                    width="350"
                    show-overflow-tooltip>
                    <template slot-scope="scope">{{getDateString(scope.row.startDate,scope.row.endDate)}}</template>

                </el-table-column>
                <el-table-column
                    prop="staffName"
                    label="预约人"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="staffDepartment"
                    label="部门"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    label="操作"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button v-if="currentTab==0" type="text" @click="cancelReservation([scope.row])">取消预约</el-button>
                        <el-button v-if="currentTab==1" type="text" @click="logoutReservation([scope.row])">注销工位</el-button>
                        <el-button v-if="currentTab==2" type="text" @click="reReserve(scope.row.id)">再次预约</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
        <!--<div class="bottomActionBar" v-if="currentTab!=2">-->
            <!--<span class="countBox">已选择 <span>{{selectionData.length}}</span> 个工位</span>-->
            <!--<div class="barBtn">-->
                <!--<el-button v-if="currentTab==0" :disabled="selectionData.length==0" type="primary" @click="cancelReservation(selectionData)">取消预约</el-button>-->
                <!--<el-button v-if="currentTab==1" :disabled="selectionData.length==0" type="primary">注销工位</el-button>-->
            <!--</div>-->
        <!--</div>-->
    </div>
</template>

<script>
    import {getStaffReservation,getDepartment,cancelReservationSeat,staffLogout} from "../api/getData";
    import {getDateString} from "../api/optionsData";

    export default {
        name: "reserve_staff",
        data(){
            return{
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                currentPage:1,
                currentTab:0,
                dateType:'1',
                monthDate:'',
                dayDate:'',
                tableData:[],
                selectionData:[],
                department:'',
                floorId:'',
                depOptions:[],
                pageSize:20,
                loadSign:true,
                total:0,
            }
        },
        created(){
            this.getStaffReservation()
        },
        watch:{
            floorOptionsAll(){
                this.floorId = this.floorOptionsAll[0].value
                this.getDepartment()
            }
        },
        computed:{
            floorOptionsAll(){
                return this.$store.state.floorOptionsAll
            }
        },
        activated(){
            this.floorId = this.floorOptionsAll[0].value
            this.currentPage = 1
            this.getDepartment()
            this.getStaffReservation()
        },
        methods:{
            getDateString:getDateString,
            //切换顶部
            switchTab(v){
                this.tableData=[]
                this.currentTab = v
                this.getStaffReservation()
            },
            //多选CheckBox
            selectionChange(v){
                this.selectionData = v;
            },
            //获取当前楼层部门
            getDepartment(){
                getDepartment({buildingId:20,floorId:this.floorId}).then(res=>{
                    if(res.result){
                        this.depOptions = res.result
                        this.depOptions.unshift('全部')
                        this.department='全部'
                    }
                })
            },
            //切换部门
            changeDepartment(){
                this.currentPage = 1
                this.getStaffReservation()
            },
            //员工预约列表
            getStaffReservation(ps){
                var pageSize = ''
                if(ps){
                    pageSize = ps
                }else{
                    pageSize = this.pageSize
                    const selectWrap = document.getElementsByClassName('el-table__body-wrapper')[0]
                    selectWrap.scrollTop = 0
                }
                this.currentPage = 1
                getStaffReservation({
                    buildingId:20,
                    filterType:this.currentTab,
                    pageNo:this.currentPage,
                    pageSize:pageSize>20?pageSize:20,
                    filterDate:this.dateType==1?this.dayDate==null?'':this.dayDate:this.monthDate==null?'':this.monthDate,
                    department:this.department=='全部'?'':this.department,
                    floorId:this.floorId
                }).then(res=>{
                    console.log(res)
                    this.tableData = res.result.rows
                    this.total = res.result.total
                })
            },
            //切换楼层
            floorChange(v){
                this.currentPage = 1
                this.getStaffReservation()
            },
            //日期类型改变
            dateTypeChange(){
                this.dayDate = ''
                this.monthDate = ''
            },
            //滚动加载
            loadMore () {
                var that =this
                if (this.loadSign && that.tableData.length <this.total) {
                    this.loadSign = false
                    this.currentPage++
                    getStaffReservation({
                        buildingId:20,
                        filterType:this.currentTab,
                        pageNo:this.currentPage,
                        pageSize:this.pageSize,
                        filterDate:this.dateType==1?this.dayDate==null?'':this.dayDate:this.monthDate==null?'':this.monthDate,
                        department:this.department=='全部'?'':this.department,
                        floorId:this.floorId
                    }).then(res=>{
                        if(res.result){
                            setTimeout(() => {
                                res.result.rows.forEach((v,i)=>{
                                    that.tableData.push(v)
                                })
                                this.total = res.result.total
                                if(that.currentPage <=res.result.total/that.pageSize){
                                    that.loadSign = true
                                }else{
                                    this.loadSign = true
                                }

                            }, 500)


                        }else{
                            this.$message.error(res.message)
                        }
                    })
                }
            },
            //再次预约
            reReserve(id){
                console.log(id)
                this.$router.push({path:'/reReserve_seat',query:{id:id}})
            },
            //取消预约
            cancelReservation(data){
                console.log(data)
                this.$confirm('是否取消 '+data.length+' 个工位的预约?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    cancelReservationSeat({
                        id:data[0].id,
                        seatIds:[data[0].id]
                    }).then(res=>{
                        if(res.result){
                            this.$message.success('已取消预约')
                            this.getStaffReservation(this.tableData.length)
                        }else{
                            this.$message.error(res.message)
                        }
                    }).catch(err=>{
                        this.$message.error(err.message)
                    })
                })
            },
            //注销工位
            logoutReservation(data){
                console.log(data)
                this.$confirm('是否注销'+data.length+' 个工位的使用', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    staffLogout({
                        buildingId:20,
                        code:data[0].code
                    }).then(res=>{
                        if(res.result){
                            this.$message.success('已注销使用')
                            this.getStaffReservation(this.tableData.length)
                        }else{
                            this.$message.error(res.message)
                        }
                    }).catch(err=>{
                        this.$message.error(err.message)
                    })
                })
            }
        }
    }
</script>

<style lang="less">
    .reserveStaff{
        .contentBox{
            padding: 18px 15px;
        }

    }
</style>
