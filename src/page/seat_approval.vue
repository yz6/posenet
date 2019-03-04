<template>
    <div class="seatApproval margin29">
        <div class="rightTitle">
            <div class="title-left-line"></div>
            <span class="title-words">工位审批</span>
            <div class="selectBox">
                <span class="selectLabel">楼层</span>
                <el-select @change="changeFloor" v-model="floorId" style="width: 120px">
                    <el-option
                        v-for="item in floorOptionsAll"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <span class="selectLabel">部门</span>
                <el-select @change="getApprovalList" v-model="department" style="width: 120px">
                    <el-option
                        v-for="item in depOptions"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <span class="selectLabel">申请时间</span>
                <el-select @change="getApprovalList" v-model="applyTime" style="width: 120px">
                    <el-option
                        v-for="item in timeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <span class="selectLabel">审批状态</span>
                <el-select @change="getApprovalList" v-model="approvalStatus" style="width: 120px">
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="contentBox rightTable">
            <el-table
                ref="mytable"
                :data="tableData"
                v-loadmore='loadMore'
                height="668"
                @selection-change="selectionChange"
                style="width: 100%">
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    label="工位编号">
                    <template slot-scope="scope">{{ scope.row.seatCode }}</template>
                </el-table-column>
                <el-table-column
                    width="100"
                    label="楼层">
                    <template slot-scope="scope">{{ scope.row.floorNumber }} 楼</template>
                </el-table-column>
                <el-table-column
                    prop="staffName"
                    width="80"
                    label="申请人"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="staffDepartment"
                    label="部门"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="createdDate"
                    label="申请时间"
                    width="150"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    width="100"
                    prop="seatType"
                    label="工位类型"
                    show-overflow-tooltip>
                    <template slot-scope="scope"> {{scope.row.seatType==0?'移动工位':scope.row.seatType==1?'固定工位':'办公室'}} </template>
                </el-table-column>
                <el-table-column
                    width="220"
                    prop="description"
                    label="备注描述"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    label="审批状态"
                    show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.status==0?'待审批':scope.row.status==1?'已同意':scope.row.status==2?'已拒绝':'' }}</template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    fixed="right"
                    min-width="130"
                    show-overflow-tooltip>
                    <template slot-scope="scope" >
                        <el-button :disabled="scope.row.status != 0" @click="updateApprovalStatus([scope.row],'agree')" type="text">同意</el-button>
                        <el-button :disabled="scope.row.status != 0" @click="updateApprovalStatus([scope.row],'reject')" type="text">拒绝</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="emptyBg" v-show="tableData.length==0 && !tableLoading">
                <div style="text-align: center">
                    <img src="../assets/img/emptyBg@2x.png" alt="">
                </div>
            </div>
        </div>
        <div class="bottomActionBar">
            <span class="countBox">已选择 <span>{{selectionData.length}}</span> 个工位</span>
            <div class="barBtn">
                <el-button :disabled="selectionData.length==0" type="primary" @click="updateApprovalStatus(selectionData,'agree')">同意</el-button>
                <el-button :disabled="selectionData.length==0" type="primary" @click="updateApprovalStatus(selectionData,'reject')">拒绝</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {getApprovalList,getDepartment,updateApprovalStatus} from "../api/getData";

    export default {
        name: "seat_approval",
        data(){
            return{
                floorId:'',
                department:'全部',
                selectionData:[],
                tableData:[],
                depOptions:[],
                approvalStatus:-1,
                applyTime:-1,
                statusOptions: [
                    {
                        value:-1,
                        label:'全部'
                    },
                    {
                        value:0,
                        label:'待审批'
                    },
                    {
                        value:1,
                        label:'已同意'
                    },
                    {
                        value:2,
                        label:'已拒绝'
                    }
                ],
                currentPage:1,
                pageSize:20,
                loadSign:true,
                total:0,
                timeOptions:[
                    {
                        value:-1,
                        label:'全部'
                    },
                    {
                        value:0,
                        label:'近三天'
                    },
                    {
                        value:1,
                        label:'近一周'
                    },
                    {
                        value:2,
                        label:'一周前'
                    }
                ],
            }
        },

        computed:{
            floorOptionsAll(){
                return this.$store.state.floorOptionsAll


            }
        },
        watch:{
            floorOptionsAll(){
                this.floorId = this.floorOptionsAll[0].value
                this.getDepartment()
            },
        },
        activated(){
            this.floorId = this.floorOptionsAll[0].value
            this.getDepartment()
            this.getApprovalList()

        },
        methods:{
            //多选CheckBox
            selectionChange(v){
                this.selectionData = v;
            },
            changeFloor(){
                this.getDepartment()
            },
            //获取当前楼层部门
            getDepartment(){
                getDepartment({buildingId:20,floorId:this.floorId}).then(res=>{
                    if(res.result){
                        this.depOptions = res.result
                        this.depOptions.unshift('全部')
                        this.department='全部'
                        this.getApprovalList()
                    }

                })
            },
            //变更申请状态
            updateApprovalStatus(data,action){

                var idArr= []
                this.$confirm('是否'+(action=='agree'?' 同意 ':' 拒绝 ')+(data.length>1?'所选工位':'该工位')+'的申请？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    data.forEach((v,i)=>{
                        idArr.push(v.id)
                    })
                    updateApprovalStatus({
                        ids:idArr,
                        action:action
                    }).then(res=>{
                        if(res.result){
                            this.$message.success('操作成功')
                            this.getApprovalList(this.tableData.length)
                        }else{
                            this.$message.error(res.message)
                        }
                    }).catch(err=>{
                            this.$message.error(err.message)

                    }

                    )
                })
            },
            //滚动加载
            loadMore () {
                var that =this
                if (this.loadSign && that.tableData.length <this.total) {
                    this.loadSign = false
                    this.currentPage++
                    getApprovalList({
                        floorId:this.floorId,
                        buildingId:20,
                        pageSize:this.pageSize,
                        pageNo:this.currentPage,
                        status:this.approvalStatus,
                        timeFilter:this.applyTime,
                        department:this.department=='全部'?'':this.department
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
            //获取数据
            getApprovalList(ps){
                let pageSize = ''
                if(!ps||ps>this.pageSize){
                    this.currentPage = 1
                }
                if(ps>this.pageSize){
                    pageSize = ps
                }else{
                    pageSize = 20
                    const selectWrap = document.getElementsByClassName('el-table__body-wrapper')[0]
                    selectWrap.scrollTop = 0
                }
                getApprovalList({
                    floorId:this.floorId,
                    buildingId:20,
                    pageSize:pageSize,
                    pageNo:this.currentPage,
                    status:this.approvalStatus,
                    timeFilter:this.applyTime,
                    department:this.department=='全部'?'':this.department
                }).then(res=>{
                    this.total = res.result.total
                    this.tableData = res.result.rows
                })
            }
        }
    }
</script>

<style lang="less">
    .contentBox{
        padding:18px 15px ;
    }
</style>
