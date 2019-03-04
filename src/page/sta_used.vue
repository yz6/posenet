<template>
    <div class="staUsed margin29">
        <div class="rightTitle">
            <div class="title-left-line"></div>
            <span class="title-words">已分配工位</span>
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
                <el-select @change="getStatisticsList()" v-model="department" style="width: 120px">
                    <el-option
                        v-for="item in depOptions"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="contentBox rightTable">
            <el-table
                ref="mytable"
                v-loadmore='loadMore'
                height="668"
                :data="tableData"

                @selection-change="selectionChange"
                style="width: 100%">
                <el-table-column
                    label="工位编号">
                    <template slot-scope="scope">{{ scope.row.code }}</template>
                </el-table-column>
                <el-table-column
                    prop="floorNumber"
                    label="楼层"
                    show-overflow-tooltip>
                    <template slot-scope="scope">{{ scope.row.floorNumber  }}</template>
                </el-table-column>
                <el-table-column
                    prop="staffName"
                    label="员工">
                </el-table-column>
                <el-table-column
                    prop="staffDepartment"
                    label="部门"
                    show-overflow-tooltip>
                </el-table-column>

            </el-table>
        </div>
        <div class="bottomActionBar">
            <span class="countBox"></span>
            <div class="barBtn">
                <el-button @click="reportExport" type="primary">导出报表</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {getStatisticsList,getDepartment,reportExport} from "../api/getData";
    import {getCookie} from "../api/cookie";

    export default {
        name: "sta_used",
        data(){
            return{
                tableData:[],
                floorId:'',
                department:'',
                depOptions:[],
                selectionData:[],
                pageSize:30,
                currentPage:1,
                total:0,
                loadSign:true
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
            }
        },
        activated(){
            this.floorId = this.floorOptionsAll[0].value
            this.getDepartment()
        },
        methods:{
            //获取当前楼层部门
            getDepartment(){

                getDepartment({buildingId:20,floorId:this.floorId}).then(res=>{
                    if(res.result){
                        this.depOptions = res.result
                        this.depOptions.unshift('全部')
                        this.department='全部'
                    }
                })
                this.getStatisticsList()
            },
            //获取table数据
            getStatisticsList(){

                this.currentPage = 1
                getStatisticsList({
                    buildingId:20,
                    floorId:this.floorId,
                    department:this.department=='全部'?'':this.department,
                    type:1,
                    pageSize:this.pageSize,
                    pageNo:this.currentPage
                }).then(res=>{
                    if(res.result){
                        this.tableData = res.result.rows
                        this.total = res.result.total
                    }else{
                        this.$message.error(res.message)
                    }
                })
            },
            changeFloor(){
                this.department = '全部'
                this.getDepartment()
            },
            //滚动加载
            loadMore () {
                var that =this
                if (this.loadSign && that.tableData.length <this.total) {
                    this.loadSign = false
                    this.currentPage++
                    getStatisticsList({
                        buildingId:20,
                        floorId:this.floorId,
                        pageSize:this.pageSize,
                        pageNo:this.currentPage,
                        department: this.department=='全部'?'':this.department,
                        type:1,
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
            reportExport() {
                var fileDownload = require('js-file-download')
                let url_post = 'api/report/seats/export?buildingId=20&type=1&floorId='+this.floorId+'&department='+(this.department=='全部'?'':this.department)

                this.$ajax.get(url_post,{headers: {"token":getCookie('token')},responseType: 'arraybuffer'}).then((res) => {

                    let fileName = res.headers['content-disposition'].slice(res.headers['content-disposition'].indexOf('filename="')+10).replace('"','');


                    fileDownload(res.data,decodeURI(fileName));  //如果用方法一 ，这里需要安装 npm install js-file-download --save ,然后引用 var fileDownload = require('js-file-download')，使用详情见github;
                    // let blob = new Blob([res.data], {type: "application/vnd.ms-excel"});

                    // let objectUrl = URL.createObjectURL(blob);

                    // window.location.href = objectUrl;

                }).catch(function (res) {});
            },

        }
    }
</script>

<style lang="less">
    .staUsed{
        .contentBox{
            padding:18px 15px ;
            display: flex;
            background: #fff;
        }
    }
</style>
