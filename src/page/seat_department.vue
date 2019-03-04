<template>
    <div class="department margin29">
        <div class="rightTitle" style="position: relative">
            <div class="title-left-line"></div>
            <span class="title-words">部门工位</span>
            <div class="selectBox">
                <span class="selectLabel">工位状态</span>
                <el-select v-model="floor" style="width: 120px">
                    <el-option
                        v-for="item in workStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div style="position: absolute;right: 0;top: 5px">
                <el-button type="primary" @click="bathApplayDia" v-if="level==1">申请工位</el-button>
            </div>
        </div>
        <div class="contentBox">
            <div class="leftTab">
                <el-autocomplete style="width: 227px"
                                 v-model="searchName"
                                 popper-class="my-autocomplete"
                          placeholder="输入员工姓名进行搜索"
                          :fetch-suggestions="querySearch"
                          @select="selectStaffName"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.name }}</div>
                        <span class="dep">{{ item.department }}</span>
                    </template>
                </el-autocomplete>
                <div class="choiceStaffBox">
                    <div class="departmentItem" v-for="(v,i) in departmentData">
                        <div class="departmentLabel" :style="{color:(v.close?'':'#0D74DA')}" @click="handleDepartmenLabel(v,i)">
                            <i style="color: #0D74DA" :class="v.close?'el-icon-caret-right':'el-icon-caret-bottom'"></i> {{v.department}}
                        </div>
                        <transition name="el-zoom-in-top">
                        <div >
                            <div class="departmentStaff" :class="currentStaff==vv.id?'act' :''" @click="checkStaff(vv)" v-for="(vv,ii) in v.staffs.slice(0,10)"  v-show="!v.close">
                                {{vv.name}}
                            </div>
                        </div>
                        </transition>
                    </div>
                </div>
            </div>
            <div class=" tableBox rightTable">
                <el-table
                    :data="tableData"

                    @selection-change="selectionChange"
                    style="width: 100%">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column
                        label="员工"
                        width="200">
                        <template slot-scope="scope">{{ scope.row.staffName?scope.row.staffName:'未分配' }}<el-tag class="tableTag" v-if="scope.row.adminLevel && scope.row.adminLevel!=0" type="danger">{{scope.row.adminLevel==1?'管理员':'系统管理员'}}</el-tag></template>
                    </el-table-column>
                    <el-table-column
                        prop="staffDepartment"
                        label="部门">
                    </el-table-column>
                    <el-table-column
                        prop="code"
                        label="工位编号"
                        show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column
                        label="楼层"
                        show-overflow-tooltip>
                        <template slot-scope="scope">{{scope.row.floorNumber?scope.row.floorNumber + '楼':''}}</template>
                    </el-table-column>
                    <el-table-column
                        label="工位状态"
                        show-overflow-tooltip>
                        <template slot-scope="scope">{{scope.row.code?'已分配':'待分配'}}</template>
                    </el-table-column>
                    <el-table-column
                        v-if="(level==2) || (level!=2 && currentStaffInfo.department==currentDep)"
                        label="操作"
                        width="320">
                        <template slot-scope="scope">
                            <el-button type="text" v-if="scope.row.code" @click="logoutSeat(scope.row)">注销工位</el-button>
                            <el-button type="text" v-if="!scope.row.code && level!=2" @click="applySeatDia(scope.row)">申请工位</el-button>
                            <el-button type="text" v-if="(!scope.row.code &&level ==2)|| !scope.row.staffName" @click="assignDia([scope.row],scope.row.code?true:false)">分配工位</el-button>
                            <el-button type="text" v-if="scope.row.staffId && level==2" @click="setAdmin(scope.row.staffId,scope.row.adminLevel && scope.row.adminLevel==1?'cancel':'add',scope.$index)">{{scope.row.adminLevel==1?'取消管理员':'设为管理员'}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="bottomActionBar">
                <span class="countBox">已选择 <span>{{selectionData.length}}</span> 个工位</span>
                <div class="barBtn">
                    <el-button :disabled="selectionData.length==0 || !canAssign" type="primary" @click="assignDia(selectionData,assignSeat)">分配工位</el-button>
                    <el-button :disabled="!canLogout || selectionData.length==0" type="primary" @click="bathLogoutSeat(selectionData)">注销工位</el-button>
                </div>
            </div>
        </div>
        <!--批量申请工位dia-->
        <el-dialog
            title="申请工位"
            :visible.sync="bathApplyDiaShow"
            width="560px"
            center>
            <div v-if="bathApplySeats.length>0" style="margin-bottom: 10px">
                <p>已选工位：</p>
                <div style="margin-top: 10px">
                    <el-tag
                        style="margin: 5px"
                        v-for="(tag,ind) in bathApplySeats"
                        :key="tag.id"
                        closable
                        type="success"
                        @close="delCheckSeat(tag,ind)">
                        {{tag.code}}
                    </el-tag>
                </div>
            </div>
            <div class="diaTagBox">
                楼层：<el-select @change="getFixedList" v-model="floorId" style="width: 100px;margin-bottom: 10px" placeholder="请选择">
                    <el-option
                        v-for="item in floorOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div class="tagsBox">
                    <div class="diaTag" @click="checkBathApply(item,ind)" :class="item.act?'act':''"
                         v-for="(item,ind) in fixedData">{{item.code}}
                    </div>
                </div>

            </div>
            <el-input
                style="margin-top: 20px;border-color: #EBF6FB"
                type="textarea"
                :rows="2"
                :maxLength="15"
                resize="none"
                placeholder="输入申请理由"
                v-model="description">
            </el-input>
            <span slot="footer" class="dialog-footer">
    <el-button @click="bathApplyDiaShow = false">取 消</el-button>
    <el-button type="primary" @click="applySeat(bathApplySeats)" :disabled="bathApplySeats.length<=0">确 定</el-button>
  </span>
        </el-dialog>
        <!--为员工申请工位dia-->
        <el-dialog
            title="申请工位"
            :visible.sync="applyDiaShow"
            width="560px"
            center>
            <div class="diaTagBox">
                <el-select @change="getFixedList" v-model="floorId" style="width: 100px;margin-bottom: 10px" placeholder="请选择">
                    <el-option
                        v-for="item in floorOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div class="tagsBox">
                    <div class="diaTag" @click="checkFixedSeat(item)" :class="item.id==fixedCurrentId?'act':''"
                         v-for="(item,ind) in fixedData">{{item.code}}
                    </div>
                </div>

            </div>
            <el-input
                style="margin-top: 20px;border-color: #EBF6FB"
                type="textarea"
                :rows="2"
                :maxLength="15"
                resize="none"
                placeholder="输入申请理由"
                v-model="description">
            </el-input>
            <span slot="footer" class="dialog-footer">
    <el-button @click="applyDiaShow = false">取 消</el-button>
    <el-button type="primary" @click="applySeat([fixedCurrentId])" :disabled="!fixedCurrentId">确 定</el-button>
  </span>
        </el-dialog>
        <!--分配工位dia（分配工位给人）-->
        <el-dialog
            title="分配工位"
            :visible.sync="distributionDiaShow"
            width="560px"
            center>
            <div class="diaTagBox">
                <el-select @change="getFixedList" v-model="floorId" style="width: 100px;margin-bottom: 10px" placeholder="请选择">
                    <el-option
                        v-for="item in floorOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <div v-if="bathAssign" class="tagsBox">
                    <div  class="diaTag" @click="distriArr.length<selectionData.length?checkDisItem(ind):cancelItem(ind)" :class="item.act?'act':''" v-for="(item,ind) in fixedData">{{item.code}}</div>

                </div>
                <div v-else class="tagsBox">
                    <div  class="diaTag" @click="checkFixedSeat(item)" :class="item.id==fixedCurrentId?'act':''"  v-for="(item,ind) in fixedData">{{item.code}}</div>
                </div>

            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="distributionDiaShow = false">取 消</el-button>
    <el-button type="primary" @click="subAssign" :disabled="bathAssign?distriArr.length<selectionData.length:!fixedCurrentId" >确 定</el-button>
  </span>
        </el-dialog>
        <!--分配工位弹窗-->
        <el-dialog  :visible.sync="allocationSeatDiaShow">
            <allocationSeatDia :staffOptions="staffOptions" :DiaData="DiaData" v-on:listenDone="closeCationDia"></allocationSeatDia>

        </el-dialog>
    </div>
</template>

<script>
    import allocationSeatDia from '@/components/allocation-seat-dia'
    import {getStaffList,departmentSeats,staffIdSeats,seatLogout,getFixedList,applySeat,setAdmin,seatAssign,getCurrentStaff} from "../api/getData";
    import {getCookie} from "../api/cookie";

    export default {
        components:{
            allocationSeatDia
        },
        name: "seat_department",
        data(){
            return{
                workStatusOptions:[],
                departmentData:[
                    {
                        departmentName:'产品设计部',
                        close:true,
                        staff:[{
                            id:1,
                            name:'苏晓伟'
                        },{
                            id:2,
                            name:'周杰伦'
                        },{
                            id:3,
                            name:'张三'
                        },],
                    },{
                        close:true,
                        departmentName:'销售部',
                        staff:[{
                            id:4,
                            name:'刘巍'
                        }],
                    }
                ],
                searchName:'',
                floorId:'',
                applyDiaShow:false,
                distributionDiaShow:false,
                fixedCurrentId:'',
                selectionData:[],
                tableData:[],
                currentStaff:'',
                staffNameOptions:[],
                DiaData:[],
                description:'',
                staffOptions:[],
                allocationSeatDiaShow:false,
                //底部按钮状态判断
                canLogout:false,
                canApply:false,
                canAssign:false,
                assignSeat:false,
                fixedData:[],
                level:getCookie('level'),
                distriArr:[],
                bathAssign:true,
                assignData:[],
                applyStaffId:'',
                currentStaffInfo:{},
                currentDep:'',
                bathFloorId:'',
                bathApplyDiaShow:false,
                bathApplySeats:[],
            }
        },
        computed:{
            floorOptions(){
                return this.$store.state.floorOptions
            }
        },
        created(){

            this.getCurrentStaff()
        },
        methods: {
            //获取当前员工信息
            getCurrentStaff(){
                getCurrentStaff({

                }).then(res=>{
                    console.log(res)
                    this.currentStaffInfo = res.result
                    this.getStaffList()
                })
            },
            //多选CheckBox
            selectionChange(v) {
                console.log(v)
                this.selectionData = v;
                if(JSON.stringify(v).indexOf('"code"')!=-1 && JSON.stringify(v).indexOf('"staffId"')!=-1){
                    this.canAssign = false

                }else if(JSON.stringify(v).indexOf('"code"')!=-1 && JSON.stringify(v).indexOf('"staffId"')==-1){
                    this.canAssign = true
                    this.assignSeat = true

                }else if(JSON.stringify(v).indexOf('"code"')==-1 && JSON.stringify(v).indexOf('"staffId"')!=-1){
                    if(this.level ==2 ){
                        this.canAssign = true
                    }else{
                        this.canAssign = false
                    }
                    this.assignSeat = false
                }
                console.log(JSON.stringify(v).indexOf('"status"'))
                if(JSON.stringify(v).indexOf('"status"')!=-1){
                    this.canLogout = true
                }else{
                    this.canLogout = false
                }
            },
            //选择部门
            handleDepartmenLabel(v,i){
                this.departmentData.forEach((v,i)=>{
                    v.close = true
                })
                this.currentStaff = ''
                this.departmentData[i]['close'] = !this.departmentData[i]['close']
                this.departmentSeats(v.department)
                console.log(this.departmentData)
                this.currentDep = this.departmentData[i].department
            },
            //选择员工
            checkStaff(v){
                console.log(v)
                this.currentStaff = v.id
                this.staffIdSeats(v)
            },
            //获取部门和员工列表
            getStaffList(){
                getStaffList({

                }).then(res=>{
                    console.log(res)
                    this.departmentData = res.result
                    this.departmentSeats(this.currentStaffInfo.department)
                    this.currentDep = this.currentStaffInfo.department
                    console.log(this.departmentData)
                    this.departmentData.forEach((v,i)=>{
                        v.department==this.currentDep?'':this.$set(this.departmentData[i],'close',true)
                       v.staffs.forEach((vv,ii)=>{
                           vv.department = v.department
                           this.staffNameOptions.push(vv)
                       })
                    })
                    console.log(this.staffNameOptions)
                })
            },
            //批量申请选择
            checkBathApply(data,ind){
                this.fixedData[ind].act = !this.fixedData[ind].act
                let canPush = true
                let index = ''
                for(var i=0;i<this.bathApplySeats.length;i++){
                    if(this.bathApplySeats[i].id == data.id){
                        canPush = false
                        index = i
                        break
                    }else{
                        canPush = true
                    }
                }
                if(canPush){
                    this.bathApplySeats.push(data)
                }else{
                    this.bathApplySeats.splice(index,1)
                }

            },
            //批量申请取消
            delCheckSeat(item,ind){
                console.log(item)
                this.bathApplySeats.splice(ind,1)
                this.fixedData.forEach((v,i)=>{
                    if(v.id==item.id){
                        v.act = false
                    }
                })
            },
            //员工姓名搜索
            querySearch(queryString, cb) {
                var staffNameOptions = this.staffNameOptions;
                var results = queryString ? staffNameOptions.filter(this.createFilter(queryString)) : staffNameOptions;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0 || restaurant.namePinyin.toLowerCase().indexOf(queryString.toLowerCase()) === 0 );
                };
            },
            //根据部门获取table数据
            departmentSeats(depName){
                departmentSeats({
                    department:depName
                }).then(res=>{
                    console.log(res)
                    this.tableData = res.result
                })
            },
            //申请工位Dia
            applySeatDia(data){

                this.fixedCurrentId = ''
                this.floorId = this.floorOptions[0].value
                this.applyDiaShow = true
                this.applyStaffId = data.staffId
                this.getFixedList()
            },
            //批量申请Dia
            bathApplayDia(){
                this.floorId =   this.floorOptions[0].value
                console.log( this.bathFloorId)
                this.bathApplyDiaShow = true
                this.bathApplySeats = []
                this.getFixedList()
            },
            //获取固定工位
            getFixedList(){
                this.fixedData = []
                getFixedList({
                    floorId:this.floorId
                }).then(res=>{
                    console.log(res)
                    this.fixedData = res.result
                    this.fixedData.forEach((v,i)=>{
                        this.$set(this.fixedData[i],'act',false)
                    })
                    this.fixedData.forEach((v,i)=>{
                        this.bathApplySeats.forEach((vv,ii)=>{
                            if(v.id == vv.id){
                                v.act = true
                            }
                        })
                    })
                })
            },
            //选择固定工位
            checkFixedSeat(item){
                this.fixedCurrentId = item.id
            },
            //分配工位给员工
            subAssign(){
                var seatIds = []
                var staffIds = []
                console.log(this.assignData)
                this.assignData.forEach((v,i)=>{
                    staffIds.push(v.staffId)
                })
                if(this.bathAssign){//多选
                    this.distriArr.forEach((v,i)=>{
                        seatIds.push(v.id)
                    })
                }else{//单选
                    seatIds.push(this.fixedCurrentId)
                }
                this.distributionDiaShow = false
                seatAssign({
                    staffIds:staffIds,
                    seatIds:seatIds,
                }).then(res=>{
                    console.log(res)
                    if(res.result){
                        this.$message.success('分配成功')

                        this.departmentData.forEach((v,i)=>{
                            if(!v.close){
                                this.departmentSeats(v.department)
                            }
                        })
                    }else{
                        this.$message.error(res.message)
                    }
                }).catch(err=>{
                    this.$message.error(err.message)
                })
            },
            //多选
            checkDisItem(ind){
                    this.distriArr = []
                    this.$set(this.fixedData[ind],'act',!this.fixedData[ind].act)
                    this.fixedData.forEach((v,i)=>{
                        if(v.act){
                            this.distriArr.push(v)
                        }
                    })
            },
            //取消多选
            cancelItem(ind){
                this.distriArr = []
                this.$set(this.fixedData[ind],'act',false)
                this.fixedData.forEach((v,i)=>{
                    if(v.act){
                        this.distriArr.push(v)
                    }
                })
            },
            //分配工位
            assignDia(data,type){//type为true时表示把工位分配给人，反之则把人分配给工位
                this.fixedCurrentId = ''
                this.distriArr = []
                    if(type){
                        this.DiaData = data
                        getStaffList({

                        }).then(res=>{
                            this.staffOptions = res.result
                            this.allocationSeatDiaShow = true
                        })
                    }else{
                        this.floorId = this.floorOptions[0].value
                        this.distributionDiaShow = true
                        this.assignData = data
                        if (data.length>1){
                            this.bathAssign = true
                        } else{
                            this.bathAssign = false
                        }
                        this.getFixedList()
                    }

            },
            //隐藏多选分配工位Dia
            closeCationDia(data){
                this.allocationSeatDiaShow = false
                if(data){
                    this.selectionData = []
                    this.currentPage = 1
                    this.departmentData.forEach((v,i)=>{
                        if(!v.close){
                            this.departmentSeats(v.department)
                        }
                    })
                }else{

                }
            },
            //申请工位
            applySeat(data){
                console.log(data)

                let seatCode = ''

                this.applyDiaShow = false
                this.bathApplyDiaShow = false
                console.log(this.applyStaffId)
                var params = {}
                if(data.length>1){
                    let seatIds = []
                    data.forEach((v)=>{
                        seatIds.push(v.id)
                    })
                    params = {
                        seatIds:seatIds,
                        description:this.description
                    }
                    let seatCodeArr = []
                    this.bathApplySeats.forEach((v,i)=>{
                        seatCodeArr.push(v.code)
                    })
                    seatCode = seatCodeArr.join('、')
                }else{
                    params = {
                        seatIds:data,
                        staffId:this.applyStaffId,
                        description:this.description
                    }
                    this.fixedData.forEach((v,i)=>{
                        if(v.id == data[0]){
                            seatCode = v.code
                        }
                    })
                }
                applySeat(params).then(res=>{
                    if(res.result){
                        this.$message.success('您的工位申请已提交，请等待审核，工位编号：'+seatCode)
                    }else{
                        this.$message.error(res.message)
                    }
                }).catch(err=>{
                    this.$message.error(rrr.message)
                })
            },
            //根据员工获取table数据
            staffIdSeats(v){
                var id = v.id
                staffIdSeats({id}).then(res=>{
                    if(res.result){
                        this.tableData = [res.result]
                    }else{
                        console.log(v)
                        this.tableData=[{
                            staffName:v.name,
                            id:v.id,
                            staffDepartment:v.department,
                            status:0
                        }]
                    }


                })
            },
            //单个注销工位
            logoutSeat(data){
                console.log(this.currentStaff)
                this.$confirm('是否注销该工位？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    seatLogout([data.id]).then(res=>{
                        if(res.result){
                            this.$message.success('注销成功')
                            if(this.currentStaff){//判断是员工or部门列表
                                this.tableData=[{
                                    staffName:data.staffName,
                                    id:data.id,
                                    staffDepartment:data.staffDepartment,
                                    status:0
                                }]
                            }else{
                                this.departmentData.forEach((v,i)=>{
                                    if(!v.close){
                                        this.departmentSeats(v.department)
                                    }
                                })
                            }
                        }
                    }).catch(err=>{
                        this.$message.success(err.message)
                    })
                })
            },
            //批量注销工位
            bathLogoutSeat(){
                var idArr = []
                this.$confirm('是否注销所选工位？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    this.selectionData.forEach((v,i)=>{
                        idArr.push(v.id)
                    })
                    seatLogout(idArr).then(res=>{
                        if(res.result){
                            this.$message.success('注销成功')
                            this.departmentData.forEach((v,i)=>{
                                if(!v.close){
                                    this.departmentSeats(v.department)
                                }
                            })
                        }else{
                            this.$message.success(res.message)
                        }
                    }).catch(err=>{
                        this.$message.success(err.message)
                    })
                })

            },
            //设置管理员
            setAdmin(id,action,ind){
                console.log(ind)
                this.$confirm(action=='add'?'是否将该员工设为管理员?':'是否取消管理员身份?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    setAdmin({
                        id:id,
                        action:action
                    }).then(res=>{
                        if(res.result){
                            this.$message.success('操作成功')
                            this.$set(this.tableData[ind],'adminLevel',action=='add'?1:0)
                        }else{
                            this.$message.error(res.message)
                        }
                    }).catch(err=>{
                        this.$message.error(err.message)
                    })
                })

            },
            selectStaffName(v){
                this.searchName = v.name
                this.currentStaff = ''
                this.staffIdSeats(v)
            },
        }
    }
</script>

<style lang="less">
    .department{
        .el-table{
            .el-tag{
                background: #FFBA00;
                color: #fff;
                border: none;
                height: 20px;
                line-height: 20px;
                font-size: 12px;
                padding: 0 5px;
                position: absolute;
                right: 0px;
                top: 15px;
            }
        }

    }


    .my-autocomplete {
        li {
            line-height: normal;
            padding:  7px 20px;

            .name {
                text-overflow: ellipsis;
                overflow: hidden;
            }
            .dep {
                font-size: 12px;
                color: #b4b4b4;
            }

            .highlighted .dep {
                color: #ddd;
            }
        }
    }
    .department{
        .contentBox{
            padding:18px 15px ;
            display: flex;
            background: #fff;
            min-height: 100%;

            .leftTab{
                width: 250px;
                .el-input{
                    border-color: #EBF6FB;
                }
                .el-input__inner{
                    background: #EBF6FB;
                    border: 1px solid #EBF6FB;
                    height: 34px;
                    border-radius: 50px;
                }
                .choiceStaffBox{
                    padding-top: 10px;
                    .departmentItem{
                        font-size: 15px;
                        color: #666666;
                        cursor: pointer;
                        i{
                            margin: 0 5px;
                        }
                        .departmentLabel{
                            font-size: 15px;
                            padding: 14px 0;
                        }
                        .departmentStaff{
                            font-size: 14px;
                            margin: 5px 0;
                            padding-left: 30px;
                            height: 34px;
                            line-height: 34px;

                        }
                        .departmentStaff:hover{
                            background: #EBF6FB;
                        }
                        .departmentStaff.act{
                            background: #EBF6FB;
                        }
                    }

                }
            }
            .rightTable{
                width: calc(~ '100% - 250px');
            }
        }
    }
</style>
