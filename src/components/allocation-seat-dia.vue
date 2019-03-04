<template>
    <div class="allocationSeatDia">
        <div class="title">
            <p>分配工位</p>
            <p>对 <span>{{DiaData.length}}</span> 个座位进行分配</p>
        </div>
        <div class="DiaBody">
            <table class="diaTable">
                <tr >
                    <th v-if="level==2">部门</th>
                    <th>员工</th>
                </tr>
                <tr >
                    <td v-if="level==2">
                        <ul style="height: 278px;overflow: auto;">
                            <li v-for="(item,ind) in departmentData" :class="currentDep==item.name?'act':''"
                                @click="changeDep(item,ind)">{{item.name}}
                            </li>

                        </ul>
                    </td>
                    <td>
                        <el-input style="width: 100%" v-model="staffName"
                                  placeholder="输入员工姓名进行搜索">
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                        <div class="staffCheckbox">
                            <div style="height: 240px;overflow: auto;" class="customScr">
                                <el-checkbox-group @change="checkChange" v-model="checkList" :max="DiaData.length">
                                    <el-checkbox v-for="item in staffNameOptions" v-show="item.show" :key="item.id"
                                                 :disabled="item.seatType==1" :label="item.id">{{item.name}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
        <div style="display: flex;justify-content: space-between;align-items: center">
            <p><span v-if="staffNameArr.length>0 || level==2">分配{{DiaData.length}}个工位至：</span> <span v-if="level==2" style="color: #3a8ee6">{{currentDep}}</span><span style="color: #333" v-show="staffNameArr.length>0">（{{staffNameArr.slice(0,3).join('、')}}{{staffNameArr.length>3?' 等':''}}）</span></p>
            <div style="margin-top: 10px;text-align: right">
                <el-button @click="$emit('listenDone',false)">取 消</el-button>
                <el-button type="primary" :disabled="!currentDep||(staffNameArr.length>0&&staffNameArr.length!=DiaData.length)||(level!=2 && staffNameArr.length!=DiaData.length)" @click="seatAssign()">确 定</el-button>
            </div>
        </div>

    </div>
</template>

<script>
    import {seatAssign,getStaffList,getCurrentStaff} from "../api/getData";
    import {getCookie} from "../api/cookie";

    export default {
        name: "allocation-seat-dia",
        props: {
            DiaData: Array,
            staffOptions:Array
        },
        data() {
            return {
                staffName: '',
                checkList: [],
                staffNameOptions: [],
                departmentData: [],
                currentDep: '',
                staffNameArr:[],
                currentStaffInfo:{},
                level:getCookie('level')
            }
        },
        computed: {
        },
        created() {
            console.log(this.staffOptions)
            this.level==2?this.setData():this.getCurrentStaff()
        },
        watch: {
            staffOptions(v){
                console.log(v)
                this.level==2?this.setData():this.getCurrentStaff()
            },
            staffName(v) {
                if (v) {
                    if (/[^\x00-\xff]/g.test(v)) {
                        this.staffNameOptions.forEach((vv, i) => {
                            if (vv.name.indexOf(v) == -1) {
                                vv.show = false
                            } else {
                                vv.show = true
                            }
                        })
                    } else {
                        this.staffNameOptions.forEach((vv, i) => {
                            if (vv.namePinyin.indexOf(v) == -1) {
                                vv.show = false
                            } else {
                                vv.show = true
                            }
                        })
                    }
                } else {
                    this.staffNameOptions.forEach((v, i) => {
                        v.show = true
                    })
                }
            },
        },
        methods: {
            //切换部门
            changeDep(item, ind) {
                this.checkList = []
                this.staffNameArr = []
                this.currentDep = item.name
                this.staffNameOptions = this.staffOptions[ind].staffs
                console.log(this.staffNameOptions)
            },
            //获取当前员工信息
            getCurrentStaff(){
                getCurrentStaff({

                }).then(res=>{
                    console.log(res)
                    this.currentStaffInfo = res.result
                    this.currentDep = this.currentStaffInfo.department
                    console.log( this.staffOptions)
                    this.staffOptions.forEach((v,i)=>{
                        if(v.department==this.currentDep){
                            console.log(v.staffs)
                            v.staffs.forEach((vv,ii)=>{
                                vv.show = true
                            })
                            this.staffNameOptions = v.staffs
                        }
                    })
                    console.log(this.staffNameOptions)
                })
            },
            //切换姓名
            checkChange(data) {
                // this.currentDep = ''
                console.log(data)
                this.staffNameArr = []
                this.staffNameOptions.forEach((v,i)=>{
                    data.forEach((vv,ii)=>{
                        if(v.id == vv){
                            this.staffNameArr.push(v.name)
                        }
                    })
                })
            },
            //分配工位提交
            seatAssign() {
                var seatIds = []
                this.DiaData.forEach((v, i) => {
                    seatIds.push(v.id)
                })
                var form = {}
                console.log(this.checkList)
                this.checkList.length<=0 ? form = {department: this.currentDep, seatIds: seatIds} : form = {staffIds: this.checkList,  seatIds: seatIds
                }
                seatAssign(form).then(res => {

                    if (res.result) {
                        this.$emit('listenDone',true)
                        getStaffList({

                        }).then(res=>{
                            console.log(res.result)
                            this.$message.success('分配成功')
                            this.checkList=[]
                            this.staffNameOptions=[]
                        })
                    } else {
                        this.$message.error(res.message)
                        this.$emit('listenDone',false)
                    }
                    console.log(res)
                })
            },
            //处理数据
            setData(){
                this.departmentData = []
                this.staffOptions.forEach(v => {
                    this.departmentData.push({name: v.department, add: false})
                    v.staffs.forEach((vv,ii)=>{
                        vv.show = true
                    })
                })
                this.staffNameOptions = this.staffOptions[0].staffs
                this.currentDep = this.staffOptions[0].department
            }
        },
    }
</script>

<style lang="less">
    .allocationSeatDia {
        .title {
            text-align: center;
            margin-bottom: 10px;
            p:first-child {
                color: #666;
                font-size: 17px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            p:last-child {
                color: #666;
                font-size: 13px;
                span {
                    color: red;
                }
            }
        }
        .diaTable {
            width: 100%;
            border: 1px solid #EBF6FB;
            /*text-indent: 16px;*/
            table-layout: fixed;
            .el-checkbox__inner {
                width: 18px;
                height: 18px;
                border-color: #BBE9FD;
            }
            .el-input {
                border-color: #EBF6FB;
            }
            .el-input__inner {
                background: #EBF6FB;
                border: 1px solid #EBF6FB;
                height: 34px;
                border-radius: 50px;
            }
            tr:last-child {
                max-height: 278px;
            }
            tr {
                text-align: left;
                th:first-child {
                    border-right: 1px solid #EBF6FB;

                }
                td {
                    width: 50%;
                    height: 278px;
                    vertical-align: top;
                    li {
                        padding: 7.5px 0px;
                        cursor: pointer;
                        padding-left: 16px;
                    }
                    li.act {
                        background: #EBF6FB;
                    }
                }
                th {
                    border-bottom: 1px solid #EBF6FB;
                    font-weight: bold;
                    padding-left: 16px;
                    line-height: 30px;
                }
                td:first-child {
                    border-right: 1px solid #EBF6FB;
                }
                td:last-child {
                    position: relative;
                }
            }
            .staffCheckbox {
                margin-top: 10px;
                .el-checkbox {

                }
                .el-checkbox {
                    margin: 7.5px 0;
                    margin-left: 21px;
                    min-width: 85px;
                }
            }
        }
    }
</style>
