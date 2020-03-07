// 用户验证
export let nameVaild = [{
  required: true,
  message: '请输入用户名',
  trigger: 'blur'
}, {
  min: 3,
  max: 5,
  message: '长度在 3 到 5 个字符',
  trigger: 'blur'
}]
//密码验证
export let passwordVaild = [{
  required: true,
  message: '请输入密码',
  trigger: 'blur'
}, {
  min: 6,
  max: 15,
  message: '长度在 6 到 15 个字符',
  trigger: 'blur'

}]