<template>
    <div style="overflow: hidden;height: 100%;position: relative" @mouseup="allMouseup">
        <div class="rightTitle" style="margin: 25px 29px">
            <div class="title-left-line"></div>
            <span class="title-words">工位地图</span>
            <div class="selectBox">
                <span class="selectLabel">楼层</span>
                <span>{{routeParams.floorNumber}} 楼</span>
                <span  class="selectLabel">员工</span>
                <span>{{routeParams.staffName}}</span>
            </div>
        </div>
        <div class="legendBox">
            <div class="item"><img src="../../assets/img/legend02.png" alt="">不可选工位</div>
            <div class="item"><img src="../../assets/img/legend01.png" alt="">可选工位</div>
            <div class="item"><img src="../../assets/img/legend03.png" alt="">已选工位</div>
        </div>

        <div class="fillcontain" id="fillcontain" ref="fillcontain" style="overflow: hidden;" >

            <div class="outer" ref="outer" id="outer" v-loading="outerLoading">
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
                <span @click="item.type==0&&item.status==0?checkSeat(item,index):level==2&&item.id==routeParams.id?actionCurrentStaff(item,index):''"  v-for="(item,index) in seatData"
                      @mouseenter="seatMouseEnter(index)" @mouseleave="seatMouseLeave(index)"
                      class="seatItem"
                      :class="[item.type==2?'bossItem':'',scale==2?'double':scale==1?'':'triple',item.toward == 0?'rightText':item.toward == 1?'bottomText':item.toward==2?'leftText':'topText']"
                      :style="{
                      left:item.pointX*scale+'px',
                      top:item.pointY*scale+'px',
                       backgroundImage:'url('+ (
                     item.toward==0?item.act?rightSeat_act:item.id==routeParams.id?rightSeat_staff:item.type==1?rightSeat_dis:item.status==0?rightSeat:rightSeat_dis:
                      item.toward==1?item.act?topSeat_act:item.id==routeParams.id?topSeat_staff:item.type==1?topSeat_dis:item.status == 0?topSeat:topSeat_dis:
                      item.toward==2?item.act?leftSeat_act:item.id==routeParams.id?leftSeat_staff:item.type==1?leftSeat_dis:item.status == 0?leftSeat:leftSeat_dis:
                      item.act?bottomSeat_act:item.id==routeParams.id?bottomSeat_staff:item.type==1?bottomSeat_dis:item.status == 0?bottomSeat:bottomSeat_dis)+')'
                    }">
                    <span class="textBox noselect">
                        <span class="seatText" :style=" {color:item.act?'#fff':''}">{{item.id == routeParams.id?item.staffName:item.status == 0 && item.type==0?item.code:''}}</span>
                    </span>
                     <!--<el-collapse-transition>-->
                    <!--<div class="seatPopover" v-show="item.type==0&&item.status==0 &&item.showPopover">-->
                        <!--<li class="top">-->
                            <!--<div class="topLeft"> <div class="circle"></div> {{item.code}}</div>-->
                            <!--<div class="topRight">-->
                                 <!--&lt;!&ndash;分配工位&ndash;&gt;<img v-if="item.status == 0" @click="allocationSeatsDia([item])" src="../../assets/img/icon_272@2x.png" alt="">-->
                                <!--&lt;!&ndash;取消使用&ndash;&gt;<img @click="cancelMobileSeat([item])" v-if="item.type==0&&item.status == 1" src="../../assets/img/icon_265@2x.png" alt="">-->
                                <!--&lt;!&ndash;注销工位&ndash;&gt;<img @click="seatLogout([item.id])" v-if="item.type==1 && item.status == 1" src="../../assets/img/icon_268@2x.png" alt="">-->
                                <!--&lt;!&ndash;变更类型&ndash;&gt;<img @click="updateType(item)" src="../../assets/img/icon_270@2x.png" alt="">-->


                             <!--</div>-->
                        <!--</li>-->

                        <!--<li class="bottom">-->
                            <!--<div class="item"> <i class="el-icon-info circle"></i> {{item.staffName?item.staffName+' '+item.staffDepartment:item.staffDepartment?item.staffDepartment:'未分配'}}</div>-->
                            <!--<div class="item"> <i class="el-icon-info circle"></i>{{item.type == 0?'移动工位':item.type == 1?'固定工位':'办公室'}}</div>-->
                            <!--<div class="item"> <i class="el-icon-info circle"></i>{{item.status==0&&item.type==0?'可预约': item.status==1&&item.type==0?'已预约':item.status==0&&item.type==1?'待分配':item.status==1&&item.type==1?'已分配':''}}</div>-->
                        <!--</li>-->
                    <!--</div>-->
                     <!--</el-collapse-transition>-->
                </span>
                </div>
            </div>

        </div>
        <div class="bottomActionBar">
            <div>

            </div>
            <div class="bottomActionBar">
                <div>
                    <span class="countBox">已选工位</span>
                    <el-tag
                        v-for="tag in checkedSeatData"
                        :key="tag.id"
                        closable
                        @close="delCheckSeat(tag)">
                        {{tag.code}}
                    </el-tag>
                </div>
                <div class="barBtn">
                    <el-button  :disabled="!canReserve||checkedSeatData.length==0" type="primary" @click="goReserveSubmit">
                        预约工位
                    </el-button>
                    <el-button v-if="level==2"  :disabled="!canDelete||checkedSeatData.length==0" type="primary" @click="bathSeatLogout">
                        注销工位
                    </el-button>
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
                        <el-button v-if="level==2" slot="reference" style="margin-left: 10px"
                                   :disabled="!canChangeType||checkedSeatData.length==0" type="primary">变更类型
                        </el-button>
                    </el-popover>

                </div>
            </div>
        </div>
        <!--分配工位弹窗-->
        <el-dialog :visible.sync="allocationSeatDiaShow">
            <allocationSeatDia :staffOptions="staffOptions" :DiaData="DiaData"
                               v-on:listenDone="closeCationDia"></allocationSeatDia>

        </el-dialog>
    </div>
</template>

<script>
    import {getMapSeatData, getFloorInfo, getStaffList, updateType,seatLogout,cancelMobileSeat,getCurrentStaff} from "../../api/getData";
    import allocationSeatDia from '@/components/allocation-seat-dia'
    import {getCookie} from "../../api/cookie";

    export default {
        name: 'see_seat_map',
        components: {
            allocationSeatDia
        },
        data() {
            return {
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
                scale: 1,
                outerWidth: '',
                outerHeight: '',
                admin:true,
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
                leftSeat_staff: require('../../assets/img/leftSeat_staff.png'),
                rightSeat_staff: require('../../assets/img/rightSeat_staff.png'),
                topSeat_staff: require('../../assets/img/topSeat_staff.png'),
                bottomSeat_staff: require('../../assets/img/bottomSeat_staff.png'),
                seatData: [],
                level:getCookie("level"),
                checkedSeatData: [],
                drag: false,
                floorId: '',
                allocationSeatDiaShow: false,
                DiaData: [],
                canCheckSeatNum: 3,
                mapBgInfo: {},
                staffOptions: [],
                //底部4个按钮的判断
                canAllocation: true,
                canDelete: true,
                canCancel: true,
                canChangeType: true,
                seatPopoverTimer: false,
                bathPopover:false,
                outerLoading:true,
                canReserve:false,
                routeParams:{}
            }

        },

        computed: {
            floorOptions() {
                return this.$store.state.floorOptions
            }
        },
        created() {

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
            floorOptions(v) {
                console.log(v)
                this.floorId = this.floorOptions[0].value
                console.log(this.floorId)
                this.getMapSeatData()
            },
            checkedSeatData(v) {
                this.checkedSeatData = v


            },
        },
        activated() {
            this.$refs.fillcontain.scrollTop = -this.topFlag
            console.log(this.$route.params)
            if(this.$route.params.id){
                this.routeParams = this.$route.params
            }else{
                this.$router.push('/seat_search')
            }

            this.floorId = this.floorOptions[0].value
            this.getMapSeatData()
        },
        methods: {
            //获取地图数据
            getMapSeatData() {
                this.outerLoading = true
                this.checkedSeatData = []
                getMapSeatData({
                    floorId: this.routeParams.floorId
                }).then(res => {
                    console.log(res)
                    this.seatData = res.result
                    this.outerLoading = false
                })
                this.getFloorInfo()
            },
            //获取楼层信息
            getFloorInfo() {
                getFloorInfo({
                    id: this.routeParams.floorId
                }).then(res => {
                    console.log(res)
                    this.mapBgInfo = res.result
                    this.innerWidth = res.result.mapWidth / 2.5
                    this.innerHeight = res.result.mapHeight / 2.5

                })
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
                            this.getMapSeatData()
                        }else{
                            this.$message.error(res.message)
                        }
                    }).catch(err=>{
                        this.$message.error(err.message)
                    })
                })

            },
            //选择座位
            checkSeat(data, index) {
                console.log()
                if (!this.drag) {

                    if(this.checkedSeatData.length==1 && this.checkedSeatData[0].id==this.routeParams.id){
                        this.checkedSeatData = []
                        this.seatData.forEach((v,i)=>{
                            v.act = false
                        })
                        this.checkedSeatData.push(data)
                        this.seatData[index].act = !this.seatData[index].act
                    }else{
                        let canpush = true
                        if (this.checkedSeatData.length == 0) {
                            this.checkedSeatData.push(data)
                            this.seatData[index].act = !this.seatData[index].act
                        } else {
                            for (var i = 0; i < this.checkedSeatData.length; i++) {
                                if (this.checkedSeatData[i].id == data.id) {
                                    this.checkedSeatData.splice(i, 1)
                                    this.seatData[index].act = !this.seatData[index].act
                                    canpush = false
                                    break
                                } else {
                                    canpush = true
                                }
                            }
                            if (this.checkedSeatData.length < this.canCheckSeatNum) {
                                if (canpush == true) {
                                    this.checkedSeatData.push(data)
                                    this.seatData[index].act = !this.seatData[index].act
                                }
                            } else {
                                this.$alert('最多选择' + this.canCheckSeatNum + '个工位进行预约')
                            }

                        }
                    }
                    this.canReserve = true
                    this.canDelete = false
                    this.canChangeType = false
                }

                console.log(this.checkedSeatData)
            },
            //管理员操作当前座位
            actionCurrentStaff(data,index){
                console.log(data,index)
                this.checkedSeatData = []
                this.seatData.forEach((v,i)=>{
                    v.act  = false
                })
                this.seatData[index].act = !this.seatData[index].act
                this.checkedSeatData.push(data)
                this.canReserve = false
                this.canDelete = true
                this.canChangeType = true

            },
            //多选分配工位
            allocationSeatsDia(data) {
                console.log(data)

                this.DiaData = data

                getStaffList({}).then(res => {
                    this.staffOptions = res.result
                    this.allocationSeatDiaShow = true
                })
            },
            //单个变更工位类型
            updateType(data){
                var typeStr=''
                data.type==0?typeStr='固定':typeStr='移动'
                var that = this
                this.$confirm('是否变更该工位为 '+typeStr+'工位 ', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    updateType({
                        ids:[data.id],
                        type:data.type==0?1:0
                    }).then(res=>{
                        if(res.result){
                            this.getMapSeatData()
                            this.$message.success('工位变更成功')
                        }else{
                            this.$message.error(res.message)
                        }
                    }).catch(err=>{
                        this.$message.success(err.message)
                    })
                })
            },
            //批量变更工位类型
            batchUpdateType(type){
                var ids = []
                this.bathPopover = false
                this.checkedSeatData.forEach(v=>{
                    ids.push(v.id)
                })
                updateType({
                    ids:ids,
                    type:type
                }).then(res=>{
                    if(res.result ){
                        this.$message.success('工位变更成功')
                        this.$router.push('/seat_search')

                    }else{
                        this.$message.error(res.message)
                    }
                }).catch(err=>{
                    this.$message.error(err.message)
                })
            },
            //单个注销工位
            seatLogout(ids){
                this.$confirm('是否注销该工位?', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    showCancelButton:false

                }).then(() => {
                    seatLogout(ids).then(res=>{
                        res.result? this.$message({
                            type: 'success',
                            message: '注销成功!'
                        }):this.$message.error(res.message)
                        this.getMapSeatData()
                    })

                }).catch((err)=>{
                    this.$message.error(err.message)
                })
            },
            //批量注销工位
            bathSeatLogout(){
                var idArr= []
                this.checkedSeatData.forEach(v=>{
                    idArr.push(v.id)
                })
                this.$confirm('是否对所选 '+idArr.length + ' 个工位进行注销操作', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    showCancelButton:false

                }).then(() => {
                    seatLogout(idArr).then(res=>{
                        res.result? this.$message({
                            type: 'success',
                            message: '注销成功!'
                        }):this.$message.error(res.message)
                        this.$router.push('/seat_search')
                    })

                }).catch((err)=>{
                    this.$message.error(err.message)
                })
            },
            //去预约提交页
            goReserveSubmit(){
                getCurrentStaff({}).then(res=>{
                    console.log(res)
                    if(3-res.result.reservationSeatCount >= this.checkedSeatData.length){
                        this.$router.push({name:'reserve_seat_submit',params:{seat:this.checkedSeatData,floorId:this.routeParams.floorId}})
                    }else{
                        this.$alert('最多可预约3个工位，当前已预约'+res.result.reservationSeatCount+'个，还可以预约'+(3-res.result.reservationSeatCount)+'个')
                    }
                })

            },
            //隐藏多选分配工位Dia
            closeCationDia(data) {
                this.allocationSeatDiaShow = false
                if (data) {
                    this.checkedSeatData = []
                    this.getMapSeatData()
                } else {

                }
            },
            delCheckSeat(data) {
                this.checkedSeatData.forEach((v, i) => {
                    if (v.id == data.id) {
                        this.checkedSeatData.splice(i, 1)
                    }
                })
                this.seatData.forEach((v, i) => {
                    if (v.id == data.id) {
                        this.seatData[i].act = false
                    }
                })

            },
            //座位鼠标移入
            seatMouseEnter(index) {
                var that = this
                this.mouseTimer = setTimeout(function () {
                    that.$set(that.seatData[index], 'showPopover', true)
                }, 500)

            },
            //座位鼠标移出
            seatMouseLeave(index) {
                this.$set(this.seatData[index], 'showPopover', false)
                clearTimeout(this.mouseTimer)
            },
            //变更楼层
            changeFloor() {
                this.getMapSeatData()
            },
            //初始化坐标方法
            makeNormalSeat() {
                let w = 34
                let h = 34
                this.seatData.forEach((v, i) => {
                    if (v.seatNum == 3) {//4个座位
                        this.seatData.push({
                            "pointX": v.pointX + w + 3,
                            "pointY": v.pointY + h,
                            'toward': 0
                        }, {
                            "pointX": v.pointX + w + 3,
                            "pointY": v.pointY,
                            'toward': 0
                        }, {
                            "pointX": v.pointX,
                            "pointY": v.pointY + h,
                            'toward': 2
                        })
                    } else if (v.type != 2) { //6个座位
                        this.seatData.push({
                            "pointX": v.pointX + w + 3,
                            "pointY": v.pointY + h,
                            'toward': 0
                        }, {
                            "pointX": v.pointX + w + 3,
                            "pointY": v.pointY,
                            'toward': 0
                        }, {
                            "pointX": v.pointX,
                            "pointY": v.pointY + h,
                            'toward': 2
                        }, {
                            "pointX": v.pointX,
                            "pointY": v.pointY - h,
                            'toward': 2
                        }, {
                            "pointX": v.pointX + w + 3,
                            "pointY": v.pointY - h,
                            'toward': 0
                        })
                    }
                    if (v.type != 2) {
                        if (v.reverse.indexOf('none') == -1) {
                            this.seatData.push(
                                {
                                    "pointX": v.pointX + w / 2 + 1,
                                    "pointY": v.reverse.indexOf('top') != -1 ? v.pointY - h * 2 : v.pointY + h * 2,
                                    'toward': v.reverse.indexOf('top') != -1 ? 1 : 3
                                }
                            )
                            if (v.reverse.indexOf('right') != -1) {
                                this.seatData.push(
                                    {
                                        "pointX": v.pointX + w / 2 + w + 1,
                                        "pointY": v.reverse.indexOf('top') != -1 ? v.pointY - h * 2 : v.pointY + h * 2,
                                        'toward': 0
                                    }
                                )
                            } else if (v.reverse.indexOf('left') != -1) {
                                this.seatData.push(
                                    {
                                        "pointX": v.pointX + w / 2 - w + 2,
                                        "pointY": v.reverse.indexOf('top') != -1 ? v.pointY - h * 2 : v.pointY + h * 2,
                                        'toward': 2
                                    }
                                )
                            }
                        }
                    }
                })

                this.seatData.filter((item, index) => {
                    delete this.seatData[index].reverse
                    delete this.seatData[index].seatNum
                    delete this.seatData[index].seatNum
                    var ind = index + 1
                    var repair = ''
                    if (index < 9) {
                        repair = '00'
                    } else if (index >= 9 && index < 99) {
                        repair = '0'
                    } else {
                        repair = ''
                    }
                    this.seatData[index].code = '10' + repair + ind

                })
                console.log(JSON.stringify(this.seatData))
            },
            //鼠标摁下事件
            mousedown(e) {
                //鼠标左键
                if (e.button == 0) {
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
            allMouseup(e) {
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
                    this.innerLeft = left < 0 ? left > -(this.innerWidth * this.scale - this.outerWidth) ? left : this.innerWidth * this.scale > this.outerWidth ? -(this.innerWidth * this.scale - this.outerWidth) : false : 0
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
                var that = this
                if (v == '+' && this.scale <= 2) {
                    this.scale += 1
                    this.innerLeft = this.innerLeft + (-this.innerWidth / 2)
                    var scrollT = this.innerTop + (this.innerHeight / 2)
                    setTimeout(function () {
                        a.scrollTop = scrollT
                        that.topFlag = -scrollT
                    }, 100)

                } else if (v == '-' && this.scale > 1) {
                    if (this.scale == 2) {
                        this.innerLeft = 0
                        setTimeout(function () {
                            that.topFlag = 0
                            a.scrollTop = 0
                        }, 100)

                    } else {
                        console.log(this.innerLeft)
                        this.innerLeft = this.innerLeft / 2
                        console.log(this.topFlag)
                        setTimeout(function () {
                            a.scrollTop = -that.topFlag / 2
                            that.topFlag = that.topFlag / 2
                        }, 100)
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
