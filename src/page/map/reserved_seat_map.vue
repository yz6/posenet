<template>
    <div style="overflow: hidden;height: 100%;position: relative" @mouseup="allMouseup">
        <div class="rightTitle " style="margin: 25px 29px">
            <div class="title-left-line"></div>
            <span class="title-words">预约中的工位</span>
            &nbsp; &nbsp; &nbsp;
            <span>预约时间&nbsp;{{reservedData.startDate?getDateString(reservedData.startDate,reservedData.endDate):''}}&nbsp;&nbsp;&nbsp;&nbsp;
                预约楼层 {{reservedData.floorNumber}} 层</span>
        </div>
        <div class="legendBox">
            <div class="item"><img src="../../assets/img/legend01.png" alt="">可选工位</div>
            <div class="item"><img src="../../assets/img/legend02.png" alt="">不可选工位</div>
            <div class="item"><img src="../../assets/img/legend03.png" alt="">已选工位</div>
        </div>

        <div class="fillcontain" id="fillcontain" ref="fillcontain" style="overflow: hidden;">

            <div class="outer" ref="outer" id="outer">
                <div class="scaleControler">
                    <div @click="scaleChange('+')" class="btn"> +</div>
                    <div @click="scaleChange('-')" class="btn"> -</div>
                </div>
                <div ref="inner"
                     :style="{
                     left: innerLeft + 'px',top:innerTop + 'px',width:innerWidth*scale + 'px',height:innerHeight*scale + 'px',
                     backgroundImage:'url('+ ( mapBgInfo.mapUrl )+')'
                     }"
                     class="inner" @mousemove="mousemove($event)" @mousedown="mousedown" @mouseup="mouseup">
                <span  v-for="(item,index) in seatData" class="seatItem"
                      :class="[item.type==2?'bossItem':'',scale==2?'double':scale==1?'':'triple',item.toward == 0?'rightText':item.toward == 1?'bottomText':item.toward==2?'leftText':'topText']"
                      :style="{
                      left:item.pointX*scale+'px',
                      top:item.pointY*scale+'px',

                       backgroundImage:'url('+ (
                      item.toward==0?item.type==1?rightSeat_dis:item.act?rightSeat_act:item.status==0?rightSeat:rightSeat_dis:
                      item.toward==1?item.type==1?topSeat_dis:item.act?topSeat_act:item.status == 0?topSeat:topSeat_dis:
                      item.toward==2?item.type==1?leftSeat_dis:item.act?leftSeat_act:item.status == 0?leftSeat:leftSeat_dis:
                      item.type==1?rightSeat_dis:item.act?bottomSeat_act:item.status == 0?bottomSeat:bottomSeat_dis)+')'
                    }">
                    <span class="textBox noselect">
                        <span class="seatText" :style=" {color:item.act?'#fff':''}">{{item.act?item.code:''}}</span>
                    </span>
                    <!--<div class="seatPopover">-->
                        <!--<li class="top">-->
                            <!--<div class="topLeft"> <div class="circle"></div> {{item.code}}</div>-->
                            <!--<div class="topRight">-->
                                 <!--&lt;!&ndash;分配工位&ndash;&gt;<img v-if="item.status == 0" src="../../assets/img/icon_272@2x.png" alt="">-->
                                <!--&lt;!&ndash;取消预约&ndash;&gt;<img v-if="item.type==0&&item.status == 1" src="../../assets/img/icon_265@2x.png" alt="">-->
                                <!--&lt;!&ndash;注销工位&ndash;&gt;<img v-if="item.type==1 && item.status == 1"  src="../../assets/img/icon_268@2x.png" alt="">-->
                                <!--&lt;!&ndash;变更类型&ndash;&gt;<img src="../../assets/img/icon_270@2x.png" alt="">-->
                             <!--</div>-->
                        <!--</li>-->
                        <!--<li class="bottom">-->
                            <!--<div class="item"> <i class="el-icon-info circle"></i>{{item.staffName?item.staffName+' '+item.staffDepartment:'未分配'}}</div>-->
                            <!--<div class="item"> <i class="el-icon-info circle"></i>{{item.type == 0?'移动工位':'固定工位'}}</div>-->
                            <!--<div class="item"> <i class="el-icon-info circle"></i>{{item.status==0&&item.type==0?'可预约': item.status==1&&item.type==0?'已预约':item.status==0&&item.type==1?'待分配':item.status==1&&item.type==1?'已分配':''}}</div>-->
                        <!--</li>-->
                    <!--</div>-->
                </span>
                </div>
            </div>
        </div>
        <div class="bottomActionBar">
            <div>
                <div>
                    <span class="countBox">已选工位</span>
                    <el-tag
                        v-for="tag in checkedSeatData"
                        :key="tag.seatId"
                        closable><!---->

                        {{tag.seatName}}
                    </el-tag>
                </div>
            </div>
            <div class="barBtn">
                <el-button :disabled="checkedSeatData.length==0" type="primary" @click="cancelReserve">取消预约</el-button>
            </div>
        </div>
        <el-dialog
            title="取消预约"
            :visible.sync="cancelDiaShow"
            width="560px"
            center>
            <div class="diaTagBox">
                <div class="tagsBox">
                    <div class="diaTag" @click="clickCancelSeat(ind)" :class="item.act?'act':''" v-for="(item,ind) in cancelSeatData">{{item.seatName}}</div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
    <el-button @click="cancelDiaShow = false">取 消</el-button>
    <el-button type="primary" :disabled="cancelDis"  @click="cancelSeat">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    import {getMapSeatData,reservedDetail,cancelReservation,cancelReservationSeat,getFloorInfo} from "../../api/getData";
    import {getDateString} from "../../api/optionsData";

    export default {
        name: 'reserved_seat_map',
        data() {
            return {
                cancelDiaShow:false,
                mouseDownFlag: false,
                startX: 0,
                startY: 0,
                innerLeft: 0,
                innerTop: 0,
                leftFlag: 0,
                topFlag: 0,
                // innerWidth: 1040,
                innerWidth: 1680,
                innerHeight: 480,
                scale: 2,
                outerWidth: '',
                outerHeight: '',
                leftSeat: require('../../assets/img/seatLeft.png'),
                rightSeat: require('../../assets/img/seatRight.png'),
                topSeat: require('../../assets/img/seatTop.png'),
                bottomSeat: require('../../assets/img/seatBottom.png'),
                leftSeat_dis: require('../../assets/img/leftDisabled.png'),
                rightSeat_dis: require('../../assets/img/rightDisabled.png'),
                topSeat_dis: require('../../assets/img/topDisabled.png'),
                bottomSeat_dis: require('../../assets/img/bottomDisabled.png'),
                leftSeat_act: require('../../assets/img/leftAct.png'),
                rightSeat_act: require('../../assets/img/rightAct.png'),
                topSeat_act: require('../../assets/img/topAct.png'),
                bottomSeat_act: require('../../assets/img/bottomAct.png'),
                leftSeat_move: require('../../assets/img/leftMove.png'),
                rightSeat_move: require('../../assets/img/rightMove.png'),
                topSeat_move: require('../../assets/img/topMove.png'),
                bottomSeat_move: require('../../assets/img/bottomMove.png'),
                leftSeat_resv: require('../../assets/img/leftReserve.png'),
                rightSeat_resv: require('../../assets/img/rightReserve.png'),
                topSeat_resv: require('../../assets/img/topReserve.png'),
                bottomSeat_resv: require('../../assets/img/bottomReserve.png'),
                seatData: [],
                checkedSeatData: [],
                drag: false,
                floorId:'',
                allocationSeatDiaShow:false,
                DiaData:[],
                canCheckSeatNum:20,
                reservedData:[],
                cancelSeatData:[],
                mapBgInfo:{},
                cancelDis:true
            }

        },
        computed:{

        },
        created() {
        },
        activated() {
            this.$refs.fillcontain.scrollTop = -this.topFlag
            this.reservedDetail()
            this.resetPosition()
        },
        mounted() {
            var that = this
            that.outerWidth = document.getElementById("outer").clientWidth
            that.outerHeight = document.getElementById("outer").clientHeight
            window.onresize = () => {
                that.outerWidth = document.getElementById("outer").clientWidth
                that.outerHeight = document.getElementById("outer").clientHeight
            };
        },
        watch: {

        },

        methods: {
            getDateString:getDateString,
            //获取地图数据
            getMapSeatData() {
                getMapSeatData({
                    floorId: this.floorId
                }).then(res => {
                    console.log(res)
                    this.seatData = res.result
                    this.reservedData.seats.forEach((v,i)=>{
                        this.checkedSeatData.push({seatId:v.id,seatName:v.code})
                        this.seatData.forEach((vv,ii)=>{
                            if(vv.id == v.id){
                                vv.act = true
                            }
                        })
                    })
                })
                this.getFloorInfo()

                },
            //获取楼层信息
            getFloorInfo(){
                getFloorInfo({
                    id:this.floorId
                }).then(res=>{
                    console.log(res)
                    this.mapBgInfo = res.result
                    this.innerWidth = res.result.mapWidth/2.5
                    this.innerHeight = res.result.mapHeight/2.5

                })
            },
            //地图位置初始化
            resetPosition(){
                this.startX= 0
                this.startY=0
                this.innerLeft=0
                this.innerTop=0
                this.leftFlag= 0
                this.topFlag= 0
            },
            //获取详情数据
            reservedDetail(){
                this.checkedSeatData= []
                reservedDetail({
                    id:this.$route.query.id
                }).then(res=>{
                    if(res.result){
                        this.reservedData = res.result
                        this.floorId = res.result.seats[0].floorId
                        console.log(this.reservedData)
                        this.getMapSeatData()
                    }
                })
            },
            //取消预约dia
            cancelReserve(){
                this.cancelDiaShow = true
                this.cancelDis =true
                this.cancelSeatData = this.checkedSeatData
                this.cancelSeatData.forEach((v,i)=>{
                    this.$set(this.cancelSeatData[i],'act',false)
                })
            },
            //选择取消的工位
            clickCancelSeat(i){
                this.$set(this.cancelSeatData[i],'act',!this.cancelSeatData[i].act)
                this.cancelDis = JSON.stringify(this.cancelSeatData).indexOf('"act":true') == -1

            },
            //取消工位预约
            cancelSeat(){
                let seatIds = [];
                this.cancelSeatData.forEach((v,i)=>{
                    if(v.act){
                        seatIds.push(v.seatId)
                    }
                })
                this.cancelDiaShow = false
                cancelReservationSeat({
                    id:this.reservedData.id,
                    seatIds:seatIds
                }).then(res=>{
                    if(res.result){
                        this.$message.success('取消成功')
                        this.$router.push({path:'/reserve_my'})
                    }else{
                        this.$message.success(res.message)
                    }
                }).catch(err=>{
                    this.$message.success(err.message)
                })
            },
            //选择座位
            checkSeat(data, index) {
                if (!this.drag) {
                    let canpush = true
                    if (this.checkedSeatData.length == 0) {
                        this.checkedSeatData.push({seatId: data.id, seatName: data.code})
                        this.seatData[index].act = !this.seatData[index].act
                    } else {
                        for (var i = 0; i < this.checkedSeatData.length; i++) {
                            if (this.checkedSeatData[i].seatId == data.id) {
                                this.checkedSeatData.splice(i, 1)
                                this.seatData[index].act = !this.seatData[index].act
                                canpush = false
                                break
                            } else {
                                canpush = true
                            }
                        }
                        if(this.checkedSeatData.length<this.canCheckSeatNum){
                            if (canpush == true) {
                                this.checkedSeatData.push({seatId: data.id, seatName: data.code})
                                this.seatData[index].act = !this.seatData[index].act
                            }
                        }else{
                            alert('最多选择'+this.canCheckSeatNum+'个')
                        }

                    }
                }
                console.log(this.checkedSeatData)
            },
            delCheckSeat(data){
                this.checkedSeatData.forEach((v,i)=>{
                    if(v.seatId == data.seatId){
                        this.checkedSeatData.splice(i,1)
                    }
                })
                this.seatData.forEach((v,i)=>{
                    if(v.id == data.seatId){
                        this.seatData[i].act = false
                    }
                })

            },
            //初始化坐标方法
            //鼠标摁下事件
            mousedown(e) {
                //鼠标左键
                if(e.button == 0){
                    this.drag = false
                    this.mouseDownFlag = true
                    this.startX = e.pageX
                    this.startY = e.pageY
                }



            },
            //鼠标抬起事件
            mouseup(e) {
                this.mouseDownFlag = false
                this.leftFlag = this.innerLeft
                this.topFlag = -(this.$refs.fillcontain.scrollTop)
            },
            allMouseup(e){
                this.mouseDownFlag = false
                this.leftFlag = this.innerLeft
                this.topFlag = -(this.$refs.fillcontain.scrollTop)
            },
            //鼠标移动事件
            mousemove(e) {

                var that = this
                var left = this.leftFlag + (e.pageX - this.startX)
                var top = this.topFlag + (e.pageY - this.startY)
                if (this.mouseDownFlag && this.innerLeft <= 0) {
                    this.innerLeft = left < 0 ? left > -(this.innerWidth * this.scale - this.outerWidth) ? left : this.innerWidth*this.scale>this.outerWidth?-(this.innerWidth * this.scale - this.outerWidth):false: 0
                    setTimeout(function () {
                        if (left != 0 || top != 0) {
                            that.drag = true
                        }
                    }, 100)
                }
                if (this.mouseDownFlag && document.getElementById('outer').scrollTop <= 0) {
                    var a = this.$refs.fillcontain
                    a.scrollTop = -top
                    setTimeout(function () {
                        if (left != 0 || top != 0) {
                            that.drag = true
                        }
                    }, 100)
                }

            },
            //缩放比例变化
            scaleChange(v) {
                var a = this.$refs.fillcontain
                var that =this
                if (v == '+' && this.scale <= 2) {
                    this.scale += 1
                    this.innerLeft = this.innerLeft + (-this.innerWidth / 2)
                    var scrollT = this.innerTop + (this.innerHeight / 2)
                    setTimeout(function () {
                        a.scrollTop = scrollT
                        that.topFlag = -scrollT
                    },100)

                } else if (v == '-' && this.scale > 1) {
                    if (this.scale == 2) {
                        this.innerLeft = 0
                        setTimeout(function () {
                            that.topFlag = 0
                            a.scrollTop = 0
                        },100)

                    } else {
                        console.log(this.innerLeft)
                        this.innerLeft = this.innerLeft / 2
                        console.log(this.topFlag)
                        setTimeout(function () {
                            a.scrollTop = -that.topFlag / 2
                            that.topFlag = that.topFlag / 2
                        },100)
                    }
                    this.scale -= 1
                }
                this.leftFlag = this.innerLeft
            },

        }
    }
</script>

<style lang="less">
    @import '../../style/mixin';


</style>
