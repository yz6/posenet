import {getAllFloorNumbers,getStaffList,getOpenCity} from "./getData";
import store from "../store";

var seatTypeOpt=[
    {
        value:-1,
        label:'全部'
    },
    {
        value:0,
        label:'移动工位'
    },
    {
        value:1,
        label:'固定工位'
    },
    {
        value:2,
        label:'办公室'
    }
]
  var seatStatusOptions =  [
    {
        label:'全部',
        value:-1
    },
        {
            label:'可预约',
            value:0
        },
        {
            label:'不可预约',
            value:1
        },
        {
            label:'待分配',
            value:2
        },
        {
            label:'已分配',
            value:3
        },
    
    ]
//楼层
getAllFloorNumbers({
    buildingId:20
}).then(res=>{
    
    var a = JSON.stringify(res.result).replace(/id/g, "value").replace(/number/g, "label");
    let arr = JSON.parse(a)
    arr.unshift({value:-1,label:'全部'})
    arr.forEach((v,i)=>{
        if(v.value !=-1){
            v.label = v.label + '楼'
        }
       
    })
    let arr2 = JSON.parse(a)
    arr2.forEach((v,i)=>{
        v.label = v.label + ' 楼'
    })
    store.dispatch('upDateFloorOptions',arr2)
    store.dispatch('upDateFloorOptionsAll',arr)
    
})
//员工
getStaffList({

}).then(res=>{
    console.log(res.result)
    store.dispatch('upDateStaffOptions',res.result)
})
//城市
getOpenCity({

}).then(res=>{
    console.log(res)
    store.dispatch('upDateCityOptions',res.result)
})
//根据楼层id找楼层数
//时间戳转YY-mm-dd
function stampToString(timeStamp) {
    if(timeStamp){
        var date = new Date();
        date.setTime(timeStamp)
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        return y + '/' + m + '/' + d + ' '
    }else{
        return ''
    }
   
}
//判断周几
function getWeek(timedat) {  //timedat参数格式：   getWeek（new Date("2017/10/27" )）
    var week;
        
          if(timedat.getDay() == 0) week = " 周日 "
          if(timedat.getDay() == 1) week = " 周一 "
          if(timedat.getDay() == 2) week = " 周二 "
          if(timedat.getDay() == 3) week = " 周三 "
          if(timedat.getDay() == 4) week = " 周四 "
          if(timedat.getDay() == 5) week = " 周五 "
          if(timedat.getDay() == 6) week = " 周六 "
      return week;
}
//转换带周几的日期格式
function getDateString(date1,date2) { //date参数格式：   2019-02-19 09:00:00
    var dateStr;
    var time1;
    var time2;
    var startH = parseInt(date1.slice(11,13))
    var endH = parseInt(date2.slice(11,13))
    // var startM = date1.slice(14)
    // var endM = date2.slice(14)
    if(date1.slice(0,10) == date2.slice(0,10)){//一天
        if(startH>=13){
            time1 = '下午'
        }else if(endH==13){
            time1 = '上午'
        }else if(endH>19){
            time1 = '全天'
        }
        dateStr = date1.slice(5,10) + getWeek(new Date(date1.slice(0,10))) + time1
        
    }else{
        if(startH>=13){
            time1 = '下午'
        }else if(startH==0){
            time1 = '全天'
        }else{
            time1 = '上午'
        }
        if(endH==23||endH ==0) {
            time2 = '全天'
        }else if(endH==13){
            time2 = '上午'
        }else if(endH==19 || endH==18){
            time2 = '下午'
        }
        
        dateStr = date1.slice(5,10) + getWeek(new Date(date1.slice(0,10).replace(/-/g,'/'))) + time1 +' — ' + date2.slice(5,10) + getWeek(new Date(date2.slice(0,10))) + time2
    }
    return dateStr
}
export {
    seatStatusOptions,
    seatTypeOpt,
    stampToString,
    getWeek,
    getDateString
}
