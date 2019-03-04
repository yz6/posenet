<template>
    <div class="seatRepairSetting margin29">
        <div class="rightTitle">
            <div style="display: flex;align-items: center">
                <div class="title-left-line"></div>
                <span class="title-words">报修配置</span>
                <div class="selectBox">
                    <span class="selectLabel">城市</span>
                    <el-select disabled v-model="city" style="width: 120px">

                    </el-select>
                    <span class="selectLabel">楼宇</span>
                    <el-select disabled v-model="buildingId" style="width: 150px">

                    </el-select>
                </div>
            </div>
        </div>
        <div class="contentBox rightTable">
                <div class="repairItem" v-for="item in setItemData">
                    <div class="itemTitle">
                        <img src="../assets/img/56–1@2x.png" alt="">
                        <div style="color: #4A4A4A;">
                            <p style="font-size: 17px;font-weight: bold">{{item.title}}</p>
                            <p style="font-size: 14px">{{item.name?item.name+' '+item.mobile:'尚未添加维修人'}}</p>

                        </div>
                    </div>
                    <div class="repairBtn">
                        <el-button v-if="!item.name" type="primary" @click="setWorker(item)">添加维修人</el-button>
                        <el-button v-else  @click="setWorker(item)">更改维修人</el-button>
                    </div>
                </div>
        </div>
        <el-dialog  width="380px" center title="维修人配置" :visible.sync="setWorkerShow">
            <el-form  :model="form" :rules="rules" ref="rules">
                <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
                    <el-input v-model="form.mobile" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setWorkerShow = false">取 消</el-button>
                <el-button type="primary" @click="setWorkerSub('rules')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getRepairTypeList,addRepairWorker} from "../api/getData";
    export default {
        name: "seat_repair_setting",
        data(){
            return{
                formLabelWidth:'70px',
                setItemData:[],
                buildingId:'融创一号楼',
                setWorkerShow:false,
                city:'北京',
                setWorkerId:'',
                form:{
                    name:'',
                    mobile:''
                },
                rules:{
                    name:[
                        { max:4, minx:2, required: true, message: '输入正确的姓名', trigger: 'change' }
                    ],
                    mobile:[
                        { pattern:/^1[346578]\d{9}$/, message: '输入正确的手机号码',required: true, trigger: 'change'}
                    ]
                }
            }
        },
        created(){
          this.getRepairTypeList()
        },
        methods:{
            //获取维修类型
            getRepairTypeList(){
                getRepairTypeList({
                    buildingId:20
                }).then(res=>{
                    console.log(res)
                    this.setItemData=res.result
                })
            },
            //设置维修人
            setWorker(data){

               this.form.name = data.name
                this.form.mobile = data.mobile
                this.setWorkerId = data.id
                this.setWorkerShow = true
            },
            setWorkerSub(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        addRepairWorker({
                            id:this.setWorkerId,
                            name:this.form.name,
                            mobile:this.form.mobile
                        }).then(res=>{
                            if(res.result){
                                this.$message.success('操作成功')
                                this.getRepairTypeList()
                                this.setWorkerShow = false
                            }else{
                                this.$message.error(res.message)
                            }
                        }).catch(err=>{
                            this.$message.error(err.message)
                        })
                    } else {
                        return false;
                    }
                });


                console.log(this.setWorkerId)
            },
        },
    }
</script>

<style lang="less">
    .seatRepairSetting{
        .contentBox{
            padding:18px 15px;
            margin: 0 auto;
        }
        .repairItem{
            width: 31%;
            height: 138px;
            margin: 0 1%;
            margin-bottom: 10px;
            background: #fff;
            float: left;
            border: 1px solid #EBF6FB;
            position: relative;
            .itemTitle{
                margin-top: 11px;
                width: 100%;

                img{
                    width: 54px;
                    margin: 0 14px;
                    float: left;
                }
                p{
                    line-height: 27px;
                    margin: 5px 0;
                }
            }
            .repairBtn{
                position: absolute;
                right: 10px;
                bottom: 10px;
            }
        }
    }

</style>
