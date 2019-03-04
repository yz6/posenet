<template>
    <div class="reserveSeat margin29">
        <div class="rightTitle">
            <div class="title-left-line"></div>
            <span class="title-words">再次预约</span>
        </div>
        <div class="contentBox rightTable" v-loading="loading">
            <el-form label-position="left" label-width="130px" :model="form">
                <el-form-item label="工位编号">
                    <span style="font-size: 17px;color: #000">{{reservedData.seatCodes?reservedData.seatCodes.replace(/,/g,'、'):''}}</span>
                </el-form-item>
                <el-form-item label="所在城市">
                    北京市
                    <!--<el-select v-model="form.city"-->
                    <!--style="width: 150px"-->
                    <!--@change="getBuilding()"-->
                    <!--placeholder="请选择">-->
                    <!--<el-option-->
                    <!--v-for="item in cityOptions"-->
                    <!--:key="item.name"-->
                    <!--:label="item.name"-->
                    <!--:value="item.name">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
                <el-form-item label="所在楼宇">
                    融创一号楼
                    <!--<el-select v-model="form.buildingId" style="width: 200px" placeholder="请选择">-->
                    <!--<el-option-->
                    <!--v-for="item in buildingOption"-->
                    <!--:key="item.id"-->
                    <!--:label="item.name"-->
                    <!--:value="item.id">-->
                    <!--</el-option>-->
                    <!--</el-select>-->
                </el-form-item>
                <el-form-item label="预约人">
                    <div class="switchType">
                        <span class="label" @click="switchType(1)">
                            <i class="switchIcon" :class="form.type==1?'act':''"></i>为自己预约
                        </span>
                        <span class="label" @click="switchType(2)">
                            <i class="switchIcon" :class="form.type==2?'act':''"></i>为他人预约
                        </span>
                    </div>
                </el-form-item>
                <el-form-item v-if="form.type==2" label="使用人/工位数">
                    <el-input style="width: 200px;margin-right: 10px" v-model="form.userName"
                              placeholder="输入使用人姓名"></el-input>
                    <el-input style="width: 200px;margin-right: 10px" v-model="form.userPhone"
                              placeholder="输入使用人电话"></el-input>
                    <el-select v-model="form.seatNum" style="width: 140px" placeholder="工位数量">
                        <el-option
                            v-for="item in seatNumOption"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预约时间">
                    <el-radio-group style="margin-right: 20px" v-model="form.dayType">
                        <el-radio-button style="box-shadow: none" :label="1">一天</el-radio-button>
                        <el-radio-button style="box-shadow: none" :label="2">多天</el-radio-button>
                    </el-radio-group>
                    <el-date-picker
                        :picker-options="firstOptions"
                        style="width: 150px"
                        v-model="firstDate"
                        type="date"
                        :clearable="false"
                        @change="changeFirstDate"
                        value-format="timestamp"
                        placeholder="选择日期">
                    </el-date-picker>
                    <el-select
                        v-if="firstDate"
                        v-model="form.firstTime"
                        style="width: 100px"
                        placeholder="时间段"
                        @change="changeFirstTime">
                        <el-option

                            v-for="item in firstTimeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>

                    <span v-show="form.dayType==2">
                            至
                        <el-date-picker
                            :picker-options="secondOptions"
                            @change="changeSecondDate"
                            value-format="timestamp"
                            style="width: 150px"
                            v-model="secondDate"
                            type="date"
                            :clearable="false"
                            placeholder="选择日期">
                    </el-date-picker>
                    <el-select
                        v-if="secondDate"
                        v-model="form.secondTime"
                        style="width: 100px"
                        @change="changeSecondTime"
                        placeholder="时间段">
                        <el-option
                            v-for="item in secondTimeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                        </span>
                </el-form-item>
                <el-form-item label="预约楼层">
                    <el-select disabled @change="getDepartment" v-model="form.floorId" style="width: 200px"
                               placeholder="请选择">
                        <el-option
                            v-for="item in floorOptions"
                            :key="item.value"
                            :label="item.label +' 楼 ('+item.availableCount+'个可预约工位)'"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <p style="margin-top: 20px;color: #666666;display: flex;align-items: center" v-if="form.floorId">
                        <i class="el-icon-info" style="font-size: 18px;margin-right: 10px;color: #FF816A">
                        </i> {{floorNum}}楼共有{{floorDetail.length}}个部门 <span v-show="floorDetail.length>0">：{{floorDetail.join('、')}}</span>
                        。
                    </p>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button :disabled="!canChoice" @click="goMap" type="primary">
                        <span style="padding:3px 40px;display: block;font-size: 18px">
                            选择工位
                        </span>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {getBuilding, getFloor, getDepartment, reservedDetail,getCurrentStaff} from "../api/getData";
    import {stampToString, getWeek} from "../api/optionsData";

    export default {
        name: "reserve_seat",
        data() {
            return {
                firstOptions: {
                    disabledDate(time) {
                        return time.getTime() <= new Date(new Date() - 24 * 60 * 60 * 1000);
                    },
                },
                secondOptions: {
                    disabledDate(time) {
                        return time.getTime() <= new Date(new Date() - 12 * 60 * 60 * 1000);
                    },
                },
                reserveDate: '',
                firstDate: '',
                secondDate: '',
                firstTime: '',
                secondTime: '',
                canChoice: false,
                form: {
                    type: 1,
                    floorId: '',
                    userName: '',
                    userPhone: '',
                    seatNum: '',
                    dayType: 1,
                    firstTime: '',
                    secondTime: ''
                },
                seatNumOption: [{
                    label: '1个工位',
                    value: 1
                }, {
                    label: '2个工位',
                    value: 2
                }, {
                    label: '3个工位',
                    value: 3
                }],
                firstTimeOptions: [{
                    label: '上午',
                    value: 1,
                    disabled: false
                }, {
                    label: '下午',
                    value: 2,
                    disabled: false
                }, {
                    label: '全天',
                    value: 3,
                    disabled: false
                }],
                secondTimeOptions: [{
                    label: '上午',
                    value: 1
                }, {
                    label: '下午',
                    value: 2
                }, {
                    label: '全天',
                    value: 3
                }],
                buildingOption: [],
                mapShow: false,
                startDateTime: '',
                oneDayEndDateTime: '',
                manDayEndDateTime: '',
                today: new Date(new Date().toLocaleDateString()).getTime(),
                nowHours: new Date().getHours(),
                floorDetail: [],
                nowTime: (new Date()).valueOf(),
                floorNum: '',
                reservedId: '',
                reservedData: []
            }
        },
        created() {

        },
        computed: {
            cityOptions() {
                return this.$store.state.cityOptions
            },
            floorOptions() {
                return this.$store.state.floorOptions
            }
        },
        watch: {
            form: {
                handler(newV, oldV) {
                    if (newV.type == 2) {
                        if (newV.dayType == 2) {
                            for (var key in newV) {
                                if (!newV[key]) {
                                    this.canChoice = false
                                    break
                                } else {
                                    this.canChoice = true
                                }
                            }
                        } else {
                            for (var key in newV) {
                                if (!newV[key]) {
                                    if (key != 'secondTime') {
                                        this.canChoice = false
                                        break
                                    } else {
                                        this.canChoice = true
                                    }
                                }

                            }
                        }
                    } else {
                        if (newV.dayType == 2) {
                            for (var key in newV) {
                                if (!newV[key]) {
                                    if (key == 'floorId' || key == 'firstTime' || key == 'secondTime') {
                                        this.canChoice = false
                                        break
                                    } else {
                                        this.canChoice = true
                                    }
                                }

                            }
                        } else {
                            for (var key in newV) {
                                if (!newV[key]) {
                                    if (key == 'floorId' || key == 'firstTime') {
                                        this.canChoice = false
                                        break
                                    } else {
                                        this.canChoice = true
                                    }
                                }

                            }
                        }
                    }
                },
                deep: true
            }
        },
        activated() {
            this.firstOptions = {
                disabledDate(time) {
                    return time.getTime() <= new Date(new Date() - 24 * 60 * 60 * 1000);
                },

            }
            this.secondOptions = {
                disabledDate(time) {
                    return time.getTime() <= new Date(new Date() - 12 * 60 * 60 * 1000);
                },
            }
            this.form = {
                type: 1,
                floorId: '',
                userName: '',
                userPhone: '',
                seatNum: '',
                dayType: 1,
                firstTime: '',
                secondTime: ''
            }
            this.firstDate = ''
            this.secondDate = ''
            this.reservedId = this.$route.query.id
            this.reservedDetail()

        },
        methods: {
            switchType(v) {
                this.form.type = v
            },
            //获取再次预约数据
            reservedDetail() {
                this.loading = true
                reservedDetail({
                    id: this.reservedId
                }).then(res => {
                    console.log(res)
                    this.reservedData = res.result
                    this.form.floorId = this.reservedData.seats[0].floorId
                    this.floorNum = this.reservedData.floorNumber
                    this.reservedData.name == '' ? this.form.type = 1 : this.form.type = 2
                    this.form.userName = this.reservedData.name
                    this.form.userPhone = this.reservedData.mobile
                    this.form.seatNum = this.reservedData.seats.length
                    this.getDepartment()
                })
            },
            // //获取楼栋选项
            // getBuilding() {
            //     this.buildingOption = []
            //     this.form.buildingId = ''
            //     getBuilding({
            //         cityName: this.form.city
            //     }).then(res => {
            //         this.buildingOption = res.result
            //     })
            // },
            // //获取楼层
            // getFloor() {
            //     this.buildingOption = []
            //     this.form.buildingId = ''
            //     getFloor({})
            // },
            floorLabel(val) {
                let obj = {};
                obj = this.floorOptions.find((item) => {
                    return item.value === val;
                });
                this.floorNum = obj.label;
            },
            //去地图页
            goMap() {
                getCurrentStaff({}).then(res => {
                    if (3 - res.result.reservationSeatCount >= (this.form.type == 1 ? 1 : this.form.seatNum)) {
                        this.mapShow = true
                        var params = {}
                        params = {
                            reserveId: this.reservedData.id,
                            seatNum: this.form.type == 1 ? 1 : this.form.seatNum,
                            startString: this.form.dayType == 1 ? (stampToString(this.firstDate) + getWeek(new Date(stampToString(this.firstDate))) + (this.form.firstTime == 1 ? ' 上午' : this.form.firstTime == 2 ? ' 下午' : ' 全天')) :
                                (stampToString(this.firstDate) + getWeek(new Date(stampToString(this.firstDate))) + (this.form.firstTime == 1 ? ' 上午' : this.form.firstTime == 2 ? ' 下午' : ' 全天')),
                            endString: this.form.dayType == 1 ? '' : stampToString(this.secondDate) + getWeek(new Date(stampToString(this.secondDate))) + (this.form.secondTime == 1 ? ' 上午' : this.form.secondTime == 2 ? ' 下午' : ' 全天'),
                            startDate: this.startDateTime,
                            endDate: this.form.dayType == 1 ? this.oneDayEndDateTime : this.manyDayEndDateTime,
                            time: this.form.firstTime,
                            floorId: this.form.floorId,
                            userName: this.form.type == 1 ? "" : this.form.userName,
                            userPhone: this.form.type == 1 ? "" : this.form.userPhone,
                            floorNum: this.floorNum
                        }
                        console.log(params)
                        console.log(this.manyDayEndDateTime)

                        this.$router.push({name: 'reserve_seat_map', params})
                    }else{
                        this.$alert('当前最多可选择三个工位')
                    }
                })

            },
            //第一个日期选择
            changeFirstDate(v) {
                if (v != null) {
                    this.secondOptions = {
                        disabledDate(time) {
                            return time.getTime() < v + 12 * 60 * 60 * 1000 || time.getTime() >= v + 7 * 24 * 60 * 60 * 1000;
                        },
                    }
                } else {
                    this.secondOptions = {
                        disabledDate(time) {
                            return time.getTime() <= new Date(new Date() - 12 * 60 * 60 * 1000);
                        },
                    }
                }
                if (v == this.today) {
                    this.form.firstTime = ''
                    this.startDateTime = ''
                    this.manyDayEndDateTime = ''
                    console.log(this.nowHours)
                    if (this.nowHours >= 9 && this.nowHours < 13) {

                    } else if (this.nowHours >= 13 && this.nowHours < 19) {
                        this.firstTimeOptions[0].disabled = true
                    } else if (this.nowHours >= 19) {
                        this.firstTimeOptions[0].disabled = true
                        this.firstTimeOptions[1].disabled = true
                    }
                } else {
                    this.firstTimeOptions.forEach((v, i) => {
                        v.disabled = false
                    })
                }
                var startTime = 0
                var endTime = 0
                if (this.form.firstTime) {
                    if (this.form.firstTime == 1) {
                        startTime = 9 * 3600000
                        endTime = 13 * 3600000
                    } else if (this.form.firstTime == 2) {
                        startTime = 13 * 3600000
                        endTime = 19 * 3600000
                    } else {
                        startTime = 9 * 3600000
                        endTime = 24 * 3599000
                    }
                    this.startDateTime = v + startTime
                    this.oneDayEndDateTime = v + endTime


                }
            },
            //第一个时间选择
            changeFirstTime(v) {
                var startTime = 0
                var endTime = 0
                if (this.firstDate) {
                    if (v == 1) {
                        startTime = 9 * 3600000
                        endTime = 13 * 3600000
                    } else if (v == 2) {
                        startTime = 13 * 3600000
                        endTime = 19 * 3600000
                    } else {
                        startTime = 9 * 3600000
                        endTime = 24 * 3599000
                    }
                    this.startDateTime = this.firstDate + startTime
                    this.oneDayEndDateTime = this.firstDate + endTime
                }
                console.log(this.form.dayType, this.form.floorId)
            },
            //第二个日期选择
            changeSecondDate(v) {
                if (v != null) {
                    this.firstOptions = {
                        disabledDate(time) {
                            return time.getTime() >= v || time.getTime() <= v - 7 * 24 * 60 * 60 * 1000 || time.getTime() <= new Date(new Date() - 24 * 60 * 60 * 1000)
                            console.log(v)
                        },
                    }
                    console.log(this.firstOptions)
                } else {
                    this.firstOptions = {
                        disabledDate(time) {
                            return time.getTime() <= new Date(new Date() - 24 * 60 * 60 * 1000);
                        },
                    }
                }
                if (this.form.secondTime) {
                    var endTime = 0
                    if (this.form.secondTime) {
                        if (this.form.secondTime == 1) {
                            endTime = 13 * 3600000
                        } else if (this.form.secondTime == 2) {
                            endTime = 19 * 3600000
                        } else {
                            endTime = 24 * 3599000
                        }
                        this.manyDayEndDateTime = v + endTime
                    }
                }
                console.log(this.manDayEndDateTime)
            },
            //第二个时间选择
            changeSecondTime(v) {
                var startTime = 0
                var endTime = 0
                if (this.secondDate) {
                    if (v == 1) {
                        startTime = 9 * 3600000
                        endTime = 13 * 3600000
                    } else if (v == 2) {
                        startTime = 13 * 3600000
                        endTime = 19 * 3600000
                    } else {
                        startTime = 9 * 3600000
                        endTime = 24 * 3599000
                    }
                    this.manyDayEndDateTime = this.secondDate + endTime
                }
                console.log(this.manyDayEndDateTime)
            },
            //获取部门
            getDepartment(v) {

                getDepartment({
                    floorId: this.form.floorId
                }).then(res => {
                    this.loading = false
                    console.log(res)

                    this.floorDetail = res.result
                    this.floorLabel(v)

                })
            },


        }
    }
</script>

<style lang="less">
    .reserveSeat {
        color: #4A494A;
        font-size: 15px;
        .contentBox {
            padding: 18px 15px;
            padding-left: 50px;
            padding-top: 40px;
            background: #fff;
        }
        .el-form-item__label {
            font-size: 17px;
            color: #666666;

        }
        .switchType {
            display: flex;

            .label {
                line-height: 41px;
                display: flex;
                align-items: center;
                margin-right: 50px;
                cursor: pointer;
                i {
                    width: 24px;
                    margin-right: 10px;
                }
            }
        }
        .el-input__suffix {
            border: none !important;
        }
    }

</style>
