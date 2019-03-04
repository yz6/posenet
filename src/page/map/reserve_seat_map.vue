<template>
    <div  style="overflow: hidden;height: 100%;position: relative" @mouseup="allMouseup">
        <div class="rightTitle" style="margin: 25px 29px">
            <div class="title-left-line"></div>
            <span class="title-words">工位地图</span>
            <p style="color: #666666;font-size: 14px">
                <span>预约时间 {{routeParams.startString}} </span><span v-show="routeParams.endString"> 至 {{routeParams.endString}}</span> &nbsp;&nbsp;&nbsp;&nbsp;<span>
                预约楼层 {{routeParams.floorNum}} 楼</span>
            </p>
        </div>
        <div class="legendBox">
            <div class="item"><img src="../../assets/img/legend01.png" alt="">可选工位</div>
            <div class="item"><img src="../../assets/img/legend02.png" alt="">不可选工位</div>
            <div class="item"><img src="../../assets/img/legend03.png" alt="">已选工位</div>
        </div>
        <div class="fillcontain" id="fillcontain" ref="fillcontain" style="overflow: hidden;">

            <div class="outer" ref="outer" id="outer">
                <div class="scaleControler">
                    <div @click="scaleChange('+')" class="btn">+</div>
                    <div @click="scaleChange('-')" class="btn">-</div>
                </div>
                <div ref="inner"
                     :style="{
                     left: innerLeft + 'px',top:innerTop + 'px',width:innerWidth*scale + 'px',height:innerHeight*scale + 'px',
                      backgroundImage:'url('+ ( mapBgInfo.mapUrl )+')'
                     }"
                     class="inner" @mousemove="mousemove($event)" @mousedown="mousedown" @mouseup="mouseup">
                <span @click="item.type==0&&item.status==0?checkSeat(item,index):''" v-for="(item,index) in seatData" class="seatItem"
                      @mouseenter="seatMouseEnter(index)" @mouseleave="seatMouseLeave(index)"
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
                        <span class="seatText" :style=" {color:item.act?'#fff':''}">{{item.type==0 && item.status == 0?item.code:''}}</span>
                    </span>
                    <!--<el-collapse-transition>-->
                   <!--<div class="seatPopover" v-show="item.showPopover">-->
                        <!--<li class="top">-->
                            <!--<div class="topLeft"> <div class="circle"></div> {{item.code}}</div>-->
                            <!--<div class="topRight">-->
                                 <!--&lt;!&ndash;分配工位&ndash;&gt;<img v-if="item.status == 0" src="../../assets/img/icon_272@2x.png" alt="">-->
                                <!--&lt;!&ndash;取消预约&ndash;&gt;<img v-if="item.type==0&&item.status == 1" src="../../assets/img/icon_265@2x.png" alt="">-->
                                <!--&lt;!&ndash;注销工位&ndash;&gt;<img v-if="item.type==1 && item.status == 1"  src="../../assets/img/icon_268@2x.png" alt="">-->
                                <!--&lt;!&ndash;变更类型&ndash;&gt;<img src="../../assets/img/icon_270@2x.png" alt="">-->
                             <!--</div>-->
                        <!--</li>-->
                        <!--<div class="bottom">-->
                            <!--<li class="item"><i class="el-icon-info circle"></i>{{item.staffName?item.staffName+' '+item.staffDepartment:'未分配'}}</li>-->
                            <!--<li class="item"><i class="el-icon-info circle"></i>{{item.type == 0?'移动工位':'固定工位'}}</li>-->
                            <!--<li class="item"><i class="el-icon-info circle"></i>{{item.status==0&&item.type==0?'可预约': item.status==1&&item.type==0?'已预约':item.status==0&&item.type==1?'待分配':item.status==1&&item.type==1?'已分配':''}}</li>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--</el-collapse-transition>-->
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
                        closable
                        @close="delCheckSeat(tag)">
                        {{tag.seatName}}
                    </el-tag>
                </div>
            </div>
            <div class="barBtn">
                <el-button :disabled="checkedSeatData.length!=routeParams.seatNum" type="primary" @click="reserveSeat">确定</el-button>
            </div>
        </div>
    </div>

</template>

<script>
    import {getMapSeatData,reservation,reservedDetail,getFloorInfo} from "../../api/getData";

    export default {
        name: 'reserve_seat_map',
        data() {
            return {
                mouseDownFlag: false,
                reserveSuccess:false,
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
                floor:'',
                allocationSeatDiaShow:false,
                DiaData:[],
                canCheckSeatNum:20,
                routeParams:{},
                reservedData:[],
                mapBgInfo:{}

            }

        },
        computed:{
            floorOptions(){
                return this.$store.state.floorOptions
            }
        },
        created() {

            // this.routeParams = this.$route.params
        },
        mounted() {
            var that = this
            that.outerWidth = document.getElementById("outer").clientWidth
            that.outerHeight = document.getElementById("outer").clientHeight
            window.onresize = () => {
                that.outerWidth = document.getElementById("outer").clientWidth
                that.outerHeight = document.getElementById("outer").clientHeight
            };
            // this.makeNormalSeat()
        },
        watch: {
            // routeParams:{
            //     handler(){
            //         this.getMapSeatData()
            //     },
            //     deep:true
            // },
        },
        activated() {
            this.resetPosition()
            this.$refs.fillcontain.scrollTop = -this.topFlag
            this.routeParams = this.$route.params
            this.getMapSeatData()
            //每次进页面重置
            this.resetSeat()
            console.log(this.$route.params)

            if(JSON.stringify(this.routeParams) == "{}"){
                this.$router.push({path:'/reserve_seat'})
            }else if(this.routeParams.reserveId){

            }else{

            }
        },
        methods: {

            //获取地图数据
            getMapSeatData() {
                getMapSeatData({
                    floorId: this.routeParams.floorId
                }).then(res => {
                    console.log(res)
                    this.seatData = res.result
                    if(this.routeParams.reserveId){//再次预约
                        this.reservedDetail()
                    }
                })
                this.getFloorInfo()
            },
            //获取楼层信息
            getFloorInfo(){
                getFloorInfo({
                    id:this.routeParams.floorId
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
            //座位鼠标移入
            seatMouseEnter(index) {
                var that = this
                this.mouseTimer = setTimeout(function () {
                    that.$set(that.seatData[index], 'showPopover', true)
                    console.log(that.seatData[index])
                }, 800)

            },
            //座位鼠标移出
            seatMouseLeave(index) {
                this.$set(this.seatData[index], 'showPopover', false)
                clearTimeout(this.mouseTimer)
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
                        if(this.checkedSeatData.length<this.routeParams.seatNum){
                            if (canpush == true) {
                                this.checkedSeatData.push({seatId: data.id, seatName: data.code})
                                this.seatData[index].act = !this.seatData[index].act
                            }
                        }else{
                            this.$alert('您最多可以选择 '+this.routeParams.seatNum+' 个座位')
                        }

                    }
                }
                console.log(this.checkedSeatData)
            },
            //获取再次预约详情
            reservedDetail(){
                //被占用的座位
                var banSeat = []
                reservedDetail({
                    id:this.routeParams.reserveId
                }).then(res=>{
                    console.log(res)
                    if(res.result){
                        this.reservedData = res.result
                        this.reservedData.seats.forEach((v,i)=>{
                            if(this.routeParams.seatNum>=i+1){//已选座位数大于历史预约座位数时遍历 push
                                this.seatData.forEach((vv,ii)=>{
                                    if(vv.id == v.id){
                                        console.log(vv)
                                        if(vv.status == 0){//当前日期为可预约状态
                                            vv.act = true
                                            this.checkedSeatData.push({seatId:v.id,seatName:v.code})

                                        }else{//不可预约
                                            banSeat.push(vv.code)
                                        }
                                    }
                                })
                            }
                        })
                        banSeat.length>0?this.$alert('工位 '+banSeat+' 被占用，请选择其他工位进行预约。' ):''
                    }else{
                        this.$message.error(res.message)
                    }
                }).catch(err=>{
                    this.$message.error(err)
                })
            },
            //所有选择设置为空状态
            resetSeat(){
                this.seatData.forEach((v,i)=>{
                        this.seatData[i].act = false
                })
                this.checkedSeatData = []
            },
            //确定预约
            reserveSeat(){
                var nameArr= []
                var idArr = []
                var params = {}
                console.log(this.checkedSeatData)
                console.log(this.routeParams)
                this.checkedSeatData.forEach((v,i)=>{
                    nameArr.push(v.seatName)
                    idArr.push(v.seatId)
                })
                if(this.routeParams.userName && this.routeParams.userPhone){
                    if(this.routeParams.startDate<(new Date()).valueOf()){
                        params = {
                            name:this.routeParams.userName,
                            mobile:this.routeParams.userPhone,
                            seatIds:idArr,
                            endDate:this.routeParams.endDate
                        }
                    }else{
                        params = {
                            name:this.routeParams.userName,
                            mobile:this.routeParams.userPhone,
                            seatIds:idArr,
                            startDate:this.routeParams.startDate,
                            endDate:this.routeParams.endDate
                        }
                    }

                }else{
                    if(this.routeParams.startDate<(new Date()).valueOf()){
                        params = {
                            seatIds:idArr,
                            endDate:this.routeParams.endDate
                        }
                    }else{
                        params = {
                            seatIds:idArr,
                            startDate:this.routeParams.startDate,
                            endDate:this.routeParams.endDate
                        }
                    }

                }
                this.$confirm('确定预约工位：'+nameArr.join(), '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log(params)
                    reservation(params).then(res=>{
                        if(res.result){
                            this.$router.push({name:'reserve_success',params:{data:{
                                        seatCodes:res.result.seatCodes,
                                        startDate:this.routeParams.startString,
                                        endDate:this.routeParams.endString,
                                        cityName:res.result.cityName,
                                        buildingName:res.result.buildingName,
                                        signInEndDate:res.result.signInEndDate
                                    }}})
                        }else{
                            this.$message.error(res.message)
                        }
                    }).catch(res=>{
                        this.$message.error(res.message)
                    })

                })
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
            // makeNormalSeat() {
            //     let w = 34
            //     let h = 34
            //     this.seatData.forEach((v, i) => {
            //
            //         if (v.seatNum == 3) {
            //             this.seatData.push({
            //                 "pointX": v.pointX + w + 3,
            //                 "pointY": v.pointY + h,
            //                 'toward': 0
            //             }, {
            //                 "pointX": v.pointX + w + 3,
            //                 "pointY": v.pointY,
            //                 'toward': 0
            //             }, {
            //                 "pointX": v.pointX,
            //                 "pointY": v.pointY + h,
            //                 'toward': 2
            //             })
            //         } else {
            //             this.seatData.push({
            //                 "pointX": v.pointX + w + 3,
            //                 "pointY": v.pointY + h,
            //                 'toward': 0
            //             }, {
            //                 "pointX": v.pointX + w + 3,
            //                 "pointY": v.pointY,
            //                 'toward': 0
            //             }, {
            //                 "pointX": v.pointX,
            //                 "pointY": v.pointY + h,
            //                 'toward': 2
            //             }, {
            //                 "pointX": v.pointX,
            //                 "pointY": v.pointY - h,
            //                 'toward': 2
            //             }, {
            //                 "pointX": v.pointX + w + 3,
            //                 "pointY": v.pointY - h,
            //                 'toward': 0
            //             })
            //         }
            //         if (v.reverse.indexOf('none') == -1) {
            //             this.seatData.push(
            //                 {
            //                     "pointX": v.pointX + w / 2 + 1,
            //                     "pointY": v.reverse.indexOf('top') != -1 ? v.pointY - h * 2 : v.pointY + h * 2,
            //                     'toward': v.reverse.indexOf('top') != -1 ? 1 : 3
            //                 }
            //             )
            //             if (v.reverse.indexOf('right') != -1) {
            //                 this.seatData.push(
            //                     {
            //                         "pointX": v.pointX + w / 2 + w + 1,
            //                         "pointY": v.reverse.indexOf('top') != -1 ? v.pointY - h * 2 : v.pointY + h * 2,
            //                         'toward': 0
            //                     }
            //                 )
            //             } else if (v.reverse.indexOf('left') != -1) {
            //                 this.seatData.push(
            //                     {
            //                         "pointX": v.pointX + w / 2 - w + 2,
            //                         "pointY": v.reverse.indexOf('top') != -1 ? v.pointY - h * 2 : v.pointY + h * 2,
            //                         'toward': 2
            //                     }
            //                 )
            //             }
            //         }
            //
            //
            //     })
            //
            //     this.seatData.filter((item, index) => {
            //         delete this.seatData[index].reverse
            //         delete this.seatData[index].seatNum
            //         delete this.seatData[index].seatNum
            //         this.seatData[index].code = '6-' + index
            //
            //     })
            //     console.log( JSON.stringify(this.seatData))
            // },
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
