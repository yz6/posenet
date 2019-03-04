<template>
    <div class="staOverview margin29">
        <div class="rightTitle" style="position: relative">
            <div class="title-left-line"></div>
            <span class="title-words">统计概况</span>
            <router-link to="/seat_info">
                <el-button type="primary" style="position: absolute;right: 0; top: -5px;margin: 0;cursor: pointer;">
                    <div style="display: flex;align-items: center;">
                        <img style="width: 18px;margin-right: 3px" src="../assets/img/gongwei@2x.png" alt="">工位管理</div>
                </el-button>

            </router-link>
        </div>
        <div class="contentBox ">
            <p class="overviewTie">当前工位使用情况</p>
            <div class="overviewBody">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <div class="grid-content">
                            <div>
                                <p>{{seatTotalData.total}}</p>
                                <p>工位总数量</p>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content">
                            <div>
                                <p style="color:#0D74DA">{{seatTotalData.staffSeatCount}}</p>
                                <p>固定工位总数</p>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content">
                            <div>
                                <p style="color:#40A0FF">{{seatTotalData.mobileSeatCount}}</p>
                                <p>移动工位总数</p>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content">
                            <div>
                                <p style="color:#40A0FF">{{seatTotalData.reservationSeatCount}}</p>
                                <p>已预约移动工位</p>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content">
                            <div>
                                <p style="color:#FF816A">{{seatTotalData.todoApprovalSeatCount}}</p>
                                <p>待审批工位</p>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content">
                            <div>
                                <p style="color:#FFCF74">{{seatTotalData.todoRepairSeatCount}}</p>
                                <p>待维修工位</p>
                            </div>
                        </div>
                    </el-col>

                </el-row>
            </div>
            <el-row :gutter="10">
                <el-col :span="12">
                    <p class="overviewTie">当前固定工位使用率</p>
                    <div class="overviewBody pieBox">
                        <div class="chartBox" id="myChart1" :style="{width: '160px', height: '160px'}"></div>
                        <div class="right">
                            <div class="item">
                                <div style="display: flex;align-items: center"><i class="point"></i> 已使用固定工位</div>
                                <div class="percentNum">{{fixedUsed}}%</div>
                            </div>
                            <div class="item">
                                <div style="display: flex;align-items: center"><i class="point other"></i>剩余固定工位</div>
                                <div class="percentNum">{{100 - fixedUsed}}%</div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <p class="overviewTie">当前移动工位使用率</p>
                    <div class="overviewBody pieBox">
                        <div class="chartBox" id="myChart2" :style="{width: '160px', height: '160px'}"></div>
                        <div class="right">
                            <div class="item">
                                <div style="display: flex;align-items: center"><i class="point"></i> 已使用移动工位</div>
                                <div class="percentNum">{{mobileUsed}}%</div>
                            </div>
                            <div class="item">
                                <div style="display: flex;align-items: center"><i class="point other"></i>剩余移动工位</div>
                                <div class="percentNum">{{100-this.mobileUsed}}%</div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="overviewTie">移动工位预约使用趋势 <span>
                <el-select @change="getMobileChart" v-model="timeType" style="width: 120px" placeholder="请选择">
                    <el-option
                        v-for="item in timeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </span></div>
            <div class="overviewBody">
                <el-row >
                    <el-col :span="24">
                        <div class="lineBox" style="width: 100%">
                            <div  id="myChart3" style="width: 100%;height: 262px;"></div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import {getOverviewData,getMobileChart} from "../api/getData";

    export default {
        name: "sta_overview",
        data() {
            return {
                seatTotalData:{},
                fixedUsed:0,
                mobileUsed:0,
                chart3: {
                    xData: ['2018.10.16', '2018.10.17', '2018.10.18', '2018.10.19', '2018.10.20', '2018.10.21', '2018.10.22'],
                    yData: [20, 18, 38, 66, 81, 42, 53]
                },
                timeType:"day",
                timeOptions:[
                    {
                        value:'day',
                        label:'按天展示'
                    },
                    {
                        value:'week',
                        label:'按周展示',
                    },
                    {
                        value:'month',
                        label:'按月展示'
                    }
                ]
            }
        },
        mounted() {


            window.addEventListener("resize",this.resize);

        },
        computed(){


        },
        activated(){
            this.getOverviewData()
            this.getMobileChart()
        },
        methods: {
            //获取统计概览
            getOverviewData(){
                getOverviewData({
                    buildingId:20
                }).then(res=>{
                    this.seatTotalData = res.result
                    this.fixedUsed = Math.floor(res.result.assignSeatCount/res.result.staffSeatCount*100)
                    this.mobileUsed = Math.floor(res.result.reservationSeatCount/res.result.mobileSeatCount*100)
                    this.makeChart('myChart1',this.fixedUsed ,100- this.fixedUsed )
                    this.makeChart('myChart2', this.mobileUsed, 100-this.mobileUsed,)
                })
            },
            //获取echarts数据
            getMobileChart(){
                getMobileChart({
                    buildingId: 20,
                    type:this.timeType
                }).then(res=>{
                    res.result.date.forEach((v,i)=>{
                        res.result.date[i] = v.slice(0,10)
                    })
                    this.makeLine('myChart3',1300,300,res.result.date,res.result.count)
                })
            },
            resize(){
                    let myChart = this.$echarts.init(document.getElementById('myChart3'))
                    console.log(1234)
                    myChart.resize();

            },
            makeChart(id, data1, data2) {
                // 初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById(id))
                // 绘制图表
                myChart.setOption({
                    backgroundColor: '#F0FAFF',
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            data: [
                                {value: data1, name: '已使用', itemStyle: {color: '#40A0FF'}},
                                {value: data2, name: '剩余', itemStyle: {color: '#70D800'}},
                            ],

                            label: {
                                show: false
                            },
                        }
                    ],
                    tooltip : {
                        trigger: 'item',
                        formatter: "{b} : {d}%"
                    },
                    grid: {
                        width: 160,
                        height: 160,
                        containLabel: false,
                    },
                });
            },
            makeLine(id, width, height, xData,yData) {
                // 初始化echarts实例
                let myChart = this.$echarts.init(document.getElementById(id))
                // 绘制图表
                myChart.setOption({
                    backgroundColor: '#F0FBFF',
                    xAxis: {
                        boundaryGap:false,
                        type: 'category',
                        data: xData,
                        splitLine: {
                            interval:0,
                            show: true,
                            lineStyle: {
                                type:'solid',
                                shadowBlur:{
                                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                                    shadowBlur: 10
                                }
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#666666'
                            }
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#FFF6E5'
                            }
                        },

                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#666666'
                            }
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#fff6e5'
                            }
                        }
                    },

                    series: [{
                        name:'预约工位数',
                        data:yData,
                        type: 'line',
                        symbolSize: 8,
                        itemStyle: {
                            splitLine: {
                                show: true
                            },
                            normal: {
                                show:false,
                                color: "#40A0FF",
                                lineStyle: {
                                    color: "#40A0FF",
                                    width:3,
                                }
                            }
                        }
                    }],
                    tooltip: {
                        trigger: 'axis',
                        // position:function (point, params, dom, rect, size) {
                        //     // 固定在顶部
                        //     return [point[0]>280?point[0]-size.contentSize[0]:point[0], '5%'];
                        // }
                    },
                    grid: {
                        containLabel: true,
                        show: true,
                        backgroundColor:'#F0FBFF',
                        x:20,
                        x2:40,
                        y2:20,
                        y:20
                    },
                });
            },
        }
    }
</script>

<style lang="less">
    .staOverview {
        .contentBox {
            padding: 18px 30px;
            background: #fff;
        }
        .overviewTie {
            color: #333333;
            font-size: 16px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .overviewBody {
            margin: 10px 0 20px 0;
            .grid-content {
                height: 136px;
                background: #F0FBFF;
                border-radius: 5px;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666666;
                p:first-child {
                    font-size: 40px;
                    font-weight: bold;
                    margin-bottom: 16px;
                }
                p:last-child {
                    font-size: 15px;
                }
            }
        }
        .pieBox {
            height: 180px;
            background: #F0FBFF;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            .chartBox {
                margin-right: 35px;
            }
            .right {
                width: 300px;
                .item {
                    .point {
                        display: inline-block;
                        border-radius: 50%;
                        width: 15px;
                        height: 15px;
                        background: #40A0FF;
                        margin-right: 10px;
                    }
                    .point.other {
                        background: #70D800;
                    }
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin: 40px 0;
                    font-size: 16px;
                    color: #666;
                    .percentNum {
                        font-size: 30px;
                    }
                }
            }
        }
    }
</style>
