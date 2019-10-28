import fetch from '@/config/fetch'
export const getCode = data => fetch('api/user/validateCode', data, 'POST');//获取验证码
export const login = data => fetch('api/user/login', data, 'POST');//登录














