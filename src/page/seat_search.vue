<template>
    <div class="seatSearch margin29">
        <div class="rightTitle">
            <div class="title-left-line"></div>
            <span class="title-words">工位搜索</span>
            <div class="selectBox">
                <el-input style="width: 227px" v-model="searchWord" placeholder="输入员工姓名进行搜索">
                    <i slot="suffix" @click="getStaffSeats" style="color: #fff;cursor: pointer" class="el-input__icon el-icon-search"></i>
                </el-input>
            </div>
        </div>
        <div class="contentBox rightTable">
            <el-table
                ref="table"
                :data="tableData"

                @selection-change="selectionChange"
                style="width: 100%">
                <el-table-column
                    label="员工">
                    <template slot-scope="scope">{{ scope.row.staffName }}</template>
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
                    <template slot-scope="scope">{{ scope.row.floorNumber }}</template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    min-width="150"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" @click="seeSeat(scope.row)">查看工位</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="emptyBg" v-show="tableData.length==0 && !tableLoading">
                <div style="text-align: center">
                    <img src="../assets/img/emptyBg@2x.png" alt="">
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {getStaffSeats} from "../api/getData";

    export default {
        name: "seat_search",
        data(){
            return{
                tableData:[],
                selectionData:[],
                searchWord:''
            }
        },
        watch:{

        },
        activated(){
            this.tableData = []
            this.selectionData = []
            this.searchWord = ''
        },
        methods:{
            //多选CheckBox
            selectionChange(v){
                console.log(v)
                this.selectionData = v;
            },
            //查询
            getStaffSeats(){
                console.log(this.searchWord.length)
                getStaffSeats({
                    name:this.searchWord
                }).then(res=>{
                    if(res.result){
                       this.tableData = res.result
                    }
                })
            },
            //查看座位
            seeSeat(data){
                console.log(data)
                this.$router.push({name:'see_seat_map',params:data})
            },
        }
    }
</script>

<style lang="less">
    .seatSearch{
        .selectBox{
            .el-input{
                border-color: #EBF6FB;
            }
            .el-input__suffix{
                border-left: none;
            }
            .el-input__inner{
                background: #0D74DA;
                border: 1px solid #EBF6FB;
                height: 34px;
                border-radius: 50px;
                color: #fff;
            }
        }
        .contentBox{
            padding:18px 15px ;
            background: #fff;
        }
    }
</style>
