<template>
    <div class="seatRepair margin29">
        <div class="rightTitle">
            <div style="display: flex;align-items: center">
                <div class="title-left-line"></div>
                <span class="title-words">工位报修</span>
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
                    <span class="selectLabel">报修类型</span>
                    <el-select @change="repairTypeChange" v-model="repairType" style="width: 120px">
                        <el-option
                            v-for="item in repairTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <span class="selectLabel">报修状态</span>
                    <el-select @change="repairStatusChange" v-model="repairStatus" style="width: 120px">
                        <el-option
                            v-for="item in repairStatusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <router-link :to="{path:'/seat_repair_setting'}">
                <el-button type="primary" >
                    <div style="display: flex;align-items: center">
                        <img style="width: 18px;margin-right: 3px" src="../assets/img/weixiu@2x.png" alt="">维修配置
                    </div>
                </el-button>
            </router-link>

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
                    width="100"
                    label="工位编号">
                    <template slot-scope="scope">{{ scope.row.code }}</template>
                </el-table-column>
                <el-table-column
                    label="楼层"
                    width="100">
                    <template slot-scope="scope">{{ scope.row.floorNumber + '楼' }}</template>
                </el-table-column>
                <el-table-column
                    prop="staffName"
                    label="报修人"
                    width="100"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="createdDate"
                    label="报修时间"
                    width="150"
                    show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.createdDate?scope.row.createdDate.slice(0,scope.row.createdDate.length-3).replace(/-/g,'/'):'' }}</template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    width="100"
                    label="报修类型"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="description"
                    min-width="150"
                    label="报修描述"
                    show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                    prop="floor"
                    label="报修状态"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{scope.row.status == 0?'待处理':scope.row.status == 1?'处理中':scope.row.status ==2 ?'已处理':''}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="150"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-popover
                            v-model="typePopover[scope.$index]"
                            placement="top"
                            width="80"
                            trigger="hover"
                            :open-delay="500"
                            popper-class="tablePopover">
                            <div>
                                <li v-show="scope.row.status !=2" @click="updateRepair([scope.row],'done',scope.$index)">已处理</li>
                                <li v-show="scope.row.status !=0" @click="updateRepair([scope.row],'todo',scope.$index)">待处理</li>
                                <li v-show="scope.row.status !=1" @click="updateRepair([scope.row],'doing',scope.$index)">处理中</li>
                            </div>
                            <el-button slot="reference" type="text" >变更状态</el-button>
                        </el-popover>
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
                <el-popover
                    placement="top"
                    width="80"
                    trigger="click"
                    popper-class="tablePopover">
                    <div>
                        <li   @click="updateRepair(selectionData,'todo')">待处理</li>
                        <li   @click="updateRepair(selectionData,'doing')">处理中</li>
                        <li   @click="updateRepair(selectionData,'done')">已完成</li>
                    </div>
                    <el-button :disabled="selectionData.length==0" slot="reference" type="primary" >变更状态</el-button>
                </el-popover>

            </div>
        </div>
    </div>
</template>

<script>
    import {getRepairList,updateRepair,getRepairTypeList} from "../api/getData";

    export default {
        name: "seat_repair",
        data(){
            return{
                tableData:[],
                selectionData:[],
                floorId:'',
                typePopover:[],
                repairType:'',
                seatType:'',
                repairStatus:-1,
                pageSize:20,
                currentPage:1,
                loadSign:true,
                total:0,
                repairStatusOptions:[
                    {
                        label:'全部',
                        value:-1
                    }
                    ,
                    {
                        label:'待处理',
                        value:0,
                    },
                    {
                        label:'处理中',
                        value:1,
                    },
                    {
                        label:'已处理',
                        value:2
                    }
                ],
                repairTypeOptions:[]
            }
        },
        computed:{
            floorOptionsAll(){
                return this.$store.state.floorOptionsAll
            }
        },
        watch:{
            floorOptionsAll(v){
              this.floorId = v[0].value
              this.getRepairList()
          },
        },
        created(){
          this.getRepairTypeList()
        },
        activated(){
            this.floorId = this.floorOptionsAll[0].value
          this.floorId?this.getRepairList():''
        },
        methods:{
            //获取维修数据
            getRepairList(ps){
                let pageSize = ''
                if(ps>this.pageSize){
                    pageSize = ps
                }else{
                    pageSize = 20
                    const selectWrap = document.getElementsByClassName('el-table__body-wrapper')[0]
                    selectWrap.scrollTop = 0
                }
                if(!ps || ps>this.pageSize){
                    this.currentPage = 1
                }
                getRepairList({
                    pageSize:pageSize,
                    pageNo:this.currentPage,
                    buildingId:20,
                    floorId:this.floorId,
                    status:this.repairStatus,
                    type:this.repairType,
                }).then(res=>{
                    this.tableData = res.result.rows
                    this.total = res.result.total
                })
            },
            //滚动加载
            loadMore () {
                var that =this
                if (this.loadSign && that.tableData.length <this.total) {
                    this.loadSign = false
                    this.currentPage++
                    getRepairList({
                        pageSize:this.pageSize,
                        pageNo:this.currentPage,
                        buildingId:20,
                        floorId:this.floorId,
                        status:this.repairStatus,
                        type:this.repairType,
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
            //获取维修type选项
            getRepairTypeList(){
                getRepairTypeList({
                    buildingId:20
                }).then(res=>{
                    this.repairTypeOptions.push({value:'',label:'全部'})
                    res.result.forEach((v,i)=>{
                        this.repairTypeOptions.push({value:v.title})
                    })
                })
            },
            //切换楼层
            floorChange(v){
                this.getRepairList()
            },
            //切换类型
            repairTypeChange(v){
                this.getRepairList()
            },
            repairStatusChange(){
                this.getRepairList()
            },
            //多选CheckBox
            selectionChange(v){
                this.selectionData = v;

            },
            //更新状态
            updateRepair(data,action,index){
                var idArr = []
                this.$confirm('是否确定更改'+(index || index ==0?'该':data.length+'个')+'工位的报修状态', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    index||index ==0?this.typePopover.splice(index,1):''
                    data.forEach((v,i)=>{
                        idArr.push(v.id)
                    })
                    updateRepair({
                        ids:idArr,
                        action:action
                    }).then(res=>{
                        if(res.result){
                            this.$message.success('维修状态变更成功')
                            index||index ==0?this.$set(this.tableData[index],'status',action=='todo'?0:action=='done'?2:1):this.getRepairList(this.tableData.length)
                        }else{
                            this.$message.error(res.message)
                        }
                    }).catch(err=>{
                        this.$message.error(err.message)
                    })
                })

            },
        },
    }
</script>

<style lang="less">
    .seatRepair{
        .rightTitle{
            display: flex;
            justify-content: space-between;
        }
        .repairSetting{
            display: flex;
            align-items: center;
            margin-right: 10px;
            cursor: pointer;
            img{
                width: 28px;
                margin-right: 10px;
            }
            span{
                color: #0D74DA;
                font-size: 16px;
            }
        }
    }


</style>
