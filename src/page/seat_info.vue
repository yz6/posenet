<template>
    <div  class="seat_info margin29" >
        <div class="rightTitle">
            <div class="title-left-line"></div>
            <span class="title-words">工位信息</span>
            <div class="selectBox" v-if="level==2">
                <span class="selectLabel">楼层</span>
                <el-select v-model="floor" @change="changeFloor" style="width: 120px">
                    <el-option
                        v-for="item in floorOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <span class="selectLabel">部门</span>
                <el-select v-model="department" @change="changeDepartment" style="width: 120px">
                    <el-option
                        v-for="item in depOptions"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <span class="selectLabel">工位类别</span>
                <el-select v-model="seatType" @change="changeType" style="width: 120px">
                    <el-option
                        v-for="item in seatTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <span class="selectLabel">工位状态</span>
                <el-select v-model="seatStatus" @change="changeStatus" style="width: 120px">
                    <el-option
                        v-for="item in seatStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div v-else class="selectBox">
                <span class="selectLabel">部门</span>
                <span  style="color: #000">{{currentStaffInfo.department}}</span>
                <span class="selectLabel">楼层</span>
                <el-select v-model="floor" @change="changeFloor" style="width: 120px">
                    <el-option
                        v-for="item in floorOptionsAll"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="tableBox rightTable">
            <el-table
                ref="mytable"
                v-loadmore='loadMore'
                height="668"
                :data="tableData"

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
                    prop="floorNumber"
                    label="楼层"
                    width="90">
                </el-table-column>
                <el-table-column
                    prop="staffName"
                    label="员工"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="staffDepartment"
                    label="部门"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column

                    label="工位类别"
                    show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.type==0?'移动工位': scope.row.type==1?'固定工位':'移动工位' }}</template>
                </el-table-column>
                <el-table-column
                    label="工位状态"
                    show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.status==0&&scope.row.type==0?'可预约': scope.row.status==1&&scope.row.type==0?'使用中':scope.row.status==0&&scope.row.type==1?'待分配':scope.row.status==1&&scope.row.type==1?'已分配':'' }}</template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="240"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button  type="text" v-if="!scope.row.staffName" @click="allocationSeatsDia([scope.row])">分配工位</el-button>
                        <el-button v-if="scope.row.type==1 && scope.row.status == 1" type="text" @click="seatLogout([scope.row.id])">注销工位</el-button>
                        <el-popover v-if="level==2"
                            v-model="typePopover[scope.$index]"
                            placement="top"
                            width="80"
                            trigger="hover"
                            :open-delay="500"
                            popper-class="tablePopover">
                            <div>
                                <li v-if="scope.row.type==0" @click="updateType([scope.row.id],1,scope.$index)">固定工位</li>
                                <li v-if="scope.row.type==1" @click="updateType([scope.row.id],0,scope.$index)">移动工位</li>
                            </div>
                            <el-button slot="reference" type="text" >变更类型</el-button>
                        </el-popover>

                        <el-button  v-if="scope.row.type==0&&scope.row.status == 1 && level==2" type="text" @click="cancelMobileSeat([scope.row])">取消使用</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--<div class="tableLoadingBox" v-show="tableLoading"><i class="el-icon-loading"></i></div>-->
        </div>

        <div class="bottomActionBar">
            <span class="countBox">已选择 <span>{{selectionData.length}}</span> 个工位</span>
            <div class="barBtn">
                <el-button :disabled="!canAllocation||selectionData.length==0" type="primary" @click="allocationSeatsDia(selectionData)">分配工位</el-button>
                <el-button :disabled="!canDelete||selectionData.length==0" type="primary" @click="bathSeatLogout">注销工位</el-button>
                <el-button v-if="level==2" :disabled="!canCancel||selectionData.length==0" type="primary" @click="cancelMobileSeat(selectionData)">取消使用</el-button>
                <el-popover
                    placement="top"
                    width="80"
                    trigger="click"
                    v-model="bathPopover"
                    popper-class="tablePopover">
                    <div>
                        <li @click="batchUpdateType(1)">固定工位</li>
                        <li @click="batchUpdateType(0)">移动工位</li>
                    </div>
                    <el-button v-if="level==2"  slot="reference" style="margin-left: 10px" :disabled="!canChangeType||selectionData.length==0" type="primary">变更类型</el-button>
                </el-popover>

            </div>
        </div>
        <!--分配工位弹窗-->
        <el-dialog  :visible.sync="allocationSeatDiaShow">
            <allocationSeatDia :staffOptions="staffOptions" :DiaData="DiaData" v-on:listenDone="closeCationDia"></allocationSeatDia>

        </el-dialog>

    </div>
</template>

<script>
    import allocationSeatDia from '@/components/allocation-seat-dia'
    import {getDepartment,getSeatData,seatLogout,updateType,getStaffList,cancelMobileSeat,getCurrentStaff} from "../api/getData";
    import {seatTypeOpt,seatStatusOptions} from "../api/optionsData";
    import {getCookie} from "../api/cookie";

    export default {
        name: "seat_info",
        components:{
            allocationSeatDia
        },
        data(){
            return{
                floor:'',
                department:'全部',
                depOptions:[],
                seatType:-1,
                seatTypeOptions:seatTypeOpt,
                seatStatus:-1,
                seatStatusOptions:seatStatusOptions,
                tableData:[],
                selectionData:[],
                allocationSeatDiaShow:false,
                DiaData:[],
                pageSize:20,
                currentPage:1,
                tableLoading:true,
                typePopover:[],
                total:0,
                box:'',
                loadSign:true,
                bathPopover:false,
                staffOptions:[],
                //底部4个按钮的判断
                canAllocation:true,
                canDelete:true,
                canCancel:true,
                canChangeType:true,
                level:getCookie('level'),
                currentStaffInfo:{}

            }
        },
        computed:{
            floorOptions(){
              return this.$store.state.floorOptions
          },

        },
        watch:{
            floorOptions(){
                this.floor = this.floorOptions[0].value
                this.getDepartment()
            },
        },
        mounted() {


        },
        activated(){
            // this.getSeatData()
            this.floor = this.floorOptions[0].value
            this.currentPage = 1
            this.getDepartment()
        },
        created(){
            this.level==2?'':this.getCurrentStaff()
        },
        methods:{
            //获取当前员工
            getCurrentStaff(){
                getCurrentStaff({

                }).then(res=>{
                    console.log(res)
                    this.currentStaffInfo = res.result
                })
            },
            //多选CheckBox
            selectionChange(v){
                this.selectionData = v;
               if(JSON.stringify(v).indexOf('"type":0')!=-1 || JSON.stringify(v).indexOf('"status":0')!=-1){
                    this.canDelete = false
                }else{
                   this.canDelete = true
               }
                if(JSON.stringify(v).indexOf("staffName")!=-1){
                    this.canAllocation = false
                }else{
                    this.canAllocation = true
                }
                if(JSON.stringify(v).indexOf('"status":0')!=-1 || JSON.stringify(v).indexOf('"type":1')!=-1){
                    this.canCancel = false
                }else{
                    this.canCancel = true
                }

            },
            //分配工位弹窗
            allocationSeatsDia(data){

                this.DiaData = data

                getStaffList({

                }).then(res=>{
                    this.staffOptions = res.result
                    this.allocationSeatDiaShow = true
                })
            },
            //隐藏多选分配工位Dia
            closeCationDia(data){
                this.allocationSeatDiaShow = false
                if(data){
                    this.$refs.mytable.clearSelection();
                    this.selectionData = []
                    this.currentPage = 1
                    this.getSeatData(this.tableData.length+1)

                }else{

                }
            },
            //取消移动工位
            cancelMobileSeat(data){
                console.log(data)
                var idArr = []
                data.forEach((v,i)=>{
                    idArr.push(v.id)
                })
                this.$confirm('是否取消'+(idArr.length>1?idArr.length+'个':'该')+'移动工位的使用状态', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    showCancelButton:false
                }).then(()=>{
                    cancelMobileSeat(idArr).then(res=>{
                        if(res.result){
                            this.$message.success('取消成功')
                            this.currentPage = 1
                            this.getSeatData(this.tableData.length+1)
                        }else{
                            this.$message.error(res.message)
                        }
                    }).catch(err=>{
                        this.$message.error(err.message)
                    })
                })

            },
            //单个注销工位
            seatLogout(ids){
                this.$confirm('此操作将注销该工位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    showCancelButton:false

                }).then(() => {
                    seatLogout(ids).then(res=>{
                        res.result? this.$message({
                            type: 'success',
                            message: '注销成功!'
                        }):this.$message.error(res.message)
                        this.currentPage = 1
                        this.getSeatData(this.tableData.length+1)
                    })

                }).catch(()=>{

                })
            },
            //批量注销工位
            bathSeatLogout(data){
                var ids =[]
                this.selectionData.forEach((v,i)=>{
                    ids.push(v.id)
                })
                this.$confirm('此操作将批量注销工位, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',

                }).then(() => {
                    seatLogout(ids).then(res=>{
                        res.result? this.$message({
                            type: 'success',
                            message: '注销成功!'
                        }):this.$message.error(res.message)
                        this.getSeatData(this.tableData.length+1)
                    })

                })
            },
            //切换楼层
            changeFloor(v){
                this.currentPage = 1
                this.getDepartment()
            },
            //切换部门
            changeDepartment(){
                this.currentPage = 1
                this.getSeatData()
            },
            //切换工位类别
            changeType(){
                this.currentPage = 1
                this.seatStatus = -1
                this.getSeatData()
            },
            //切换状态
            changeStatus(v){
                this.currentPage = 1
                if(v==-1){

                }else if(v<=1){
                    this.seatType = 0
                }else{
                    this.seatType = 1
                }
                this.getSeatData()
            },
            //单个变更工位类型
            updateType(ids,type,popoverInd){
                var that = this
                this.typePopover.splice(popoverInd,1)
                updateType({
                    ids:ids,
                    type:type
                }).then(res=>{
                    if(res.result=='SUCCESS'){
                        that.$set(that.tableData[popoverInd],'type',type)
                        this.$message.success('变更成功')
                    }else{
                        this.$message.error(res.message)
                    }
                    this.$refs.mytable.clearSelection();
                }).catch(err=>{
                    this.$message.error(err.message)
                })
            },
           //批量变更工位类型
            batchUpdateType(type){
                var ids = []
                var inds = []
                this.bathPopover = false
                this.selectionData.forEach(v=>{
                    ids.push(v.id)
                })
                updateType({
                    ids:ids,
                    type:type
                }).then(res=>{
                   if(res.result == 'SUCCESS'){
                       this.selectionData.forEach((v,i)=>{
                           this.tableData.forEach((vv,ii)=>{
                               if(v.id == vv.id){
                                   inds.push(ii)
                               }
                           })
                       })
                       inds.forEach((v,i)=>{
                           this.$set(this.tableData[v],'type',type)
                       })
                       this.$message.success('批量变更成功')
                       this.$refs.mytable.clearSelection();

                   }else{
                       this.$message.error(res.message)
                   }
                }).catch(err=>{
                    this.$message.error(err.message)
                })
            },
            //获取当前楼层部门
            getDepartment(){
                getDepartment({buildingId:20,floorId:this.floor}).then(res=>{
                    console.log(res)
                    if(res.result){

                        this.depOptions = res.result
                        this.depOptions.unshift('全部')
                        this.department='全部'
                        this.getSeatData()
                    }
                })
            },
            //获取座位数据
            getSeatData(ps){
                var pageSize = ''
                if(ps>this.pageSize){
                    pageSize = ps
                }else{
                    pageSize = this.pageSize
                    const selectWrap = document.getElementsByClassName('el-table__body-wrapper')[0]
                    selectWrap.scrollTop = 0
                }

                getSeatData({
                    floorId:this.floor,
                    pageSize:pageSize,
                    pageNo:this.currentPage,
                    department: this.department=='全部'?'':this.department,
                    type:this.seatType,
                    status:this.seatStatus
                }).then(res=>{
                    if(res.result){
                        this.tableData = res.result.rows
                        this.total = res.result.total
                    }else{
                        this.$message.error(res.message)
                    }
                })
            },
            //滚动加载
            loadMore () {
                var that =this
                if (this.loadSign && that.tableData.length <this.total) {
                    this.loadSign = false
                    this.currentPage++
                    getSeatData({
                        floorId:this.floor,
                        pageSize:this.pageSize,
                        pageNo:this.currentPage,
                        department: this.department=='全部'?'':this.department,
                        type:this.seatType,
                        status:this.seatStatus
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
            }
        }
    }
</script>

<style lang="less">
    .seat_info{
        .tableBox{
            padding:18px 15px ;
            background: #fff;
        }
    }
</style>
