import fetch from '@/config/fetch'

/**
 * 登陆
 */
//获取所有楼层编号
export const getAllFloorNumbers = data => fetch('api/floor/summary/list', data, 'GET');
//获取员工列表
export const getStaffList = data => fetch('api/staff/list', data, 'GET');
//分配工位
export const seatAssign = data => fetch('api/seat/assign', data, 'POST');
//注销工位
export const seatLogout = data => fetch('api/seat/logout', data, 'POST');
//变更工位类型
export const updateType = data => fetch('api/seat/updateType', data, 'PUT');
//查询员工工位
export const getStaffSeats = data => fetch('api/staff/seats', data, 'GET');

//根据部门获取工位列表
export const departmentSeats = data => fetch('api/seat/departmentSeats', data, 'GET');
//根据员工获取工位
export const staffIdSeats = data => fetch('api/seat/staffId/'+data.id, data, 'GET');
//获取开放城市
export const getOpenCity = data => fetch('api/city/openList', data, 'GET');
//获取楼栋
export const getBuilding = data => fetch('api/building/nameList', data, 'GET');
//获取楼层
export const getFloor = data => fetch('api/building/nameList', data, 'GET');
//获取楼层信息
export const getFloorInfo = data => fetch('api/floor/'+data.id, data, 'GET');
//取消移动工位
export const cancelMobileSeat = data => fetch('api/seat/cancel', data, 'POST');
//获取报修列表
export const getRepairList = data => fetch('api/repair/list', data, 'GET');
//修改报修状态
export const updateRepair = data => fetch('api/repair/updateStatus', data, 'POST');
//获取维修类型列表
export const getRepairTypeList = data => fetch('api/repair/type/list', data, 'GET');
//添加维修人
export const addRepairWorker = data => fetch('api/repair/addWorker', data, 'POST');
//获取审批列表
export const getApprovalList = data => fetch('api/approval/list', data, 'GET');
//获取统计概况
export const getOverviewData = data => fetch('api/analysis/summary', data, 'GET');
//移动工位趋势
export const getMobileChart = data => fetch('api/analysis/mobileSeatChart', data, 'GET');
//根据楼层获取可分配的固定工位列表
export const getFixedList = data => fetch('api/seat/staffSeatList', data, 'GET');
//申请工位
export const applySeat = data => fetch('api/approval/apply', data, 'POST');
//变更申请状态
export const updateApprovalStatus = data => fetch('api/approval/updateStatus', data, 'POST');
//设为管理员
export const setAdmin = data => fetch('api/staff/admin', data, 'POST');
//获取员工预约列表
export const getStaffReservation = data => fetch('api/reservation/list', data, 'GET');
//登录
export const login = data => fetch('api/staff/login', data, 'POST');
//获取当前员工信息
export const getCurrentStaff = data => fetch('api/staff/info', data, 'GET');







//预约工位
export const reservation = data => fetch('api/reservation', data, 'POST');
//获取员工预约
export const staffReservation= data => fetch('api/staff/reservationList', data, 'GET');
//取消预约
export const cancelReservation = data => fetch('api/reservation/cancel', data, 'POST');
//获取预约详情
export const reservedDetail= data => fetch('api/staff/reservation/'+data.id, data, 'GET');
//取消工位预约
export const cancelReservationSeat = data => fetch('api/reservation/seat/cancel', data, 'POST');
//员工注销
export const staffLogout = data => fetch('api/staff/reservation/logout', data, 'POST');
//工位统计列表
export const getStatisticsList= data => fetch('api/report/seats', data, 'GET');
//导出报表
export const reportExport= data => fetch('api/report/seats/export', data, 'GET');


//根据楼层编号获取部门
export const getDepartment = data => fetch('api/seat/departmentNames', data, 'GET');
//根据部门ID获取座位表格
export const getSeatData = data => fetch('api/seat/list', data, 'GET');

//获取地图数据
export const getMapSeatData = data => fetch('api/seat/mapList', data, 'GET');
//注册



















