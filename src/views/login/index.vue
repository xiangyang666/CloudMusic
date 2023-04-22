<template>
  <div id="container">
    <div class="box">
      <!-- 二维码 -->
      <img class="qrcode" @click="qrcodeLogin"
        :src="qrcode ? 'https://static.leetcode.cn/cn-mono-assets/production/assets/computer.1f1441b7.svg' : 'https://static.leetcode.cn/cn-mono-assets/production/assets/qrcode_v2.3cae98c4.svg'"
        alt="">
      <div class="computer" v-if="!qrcode">
        <!-- 网易云logo -->
        <div class="cloudMusic">
          <img class="text" src="@/assets/images/cloudMusic.png" />
        </div>
        <!-- 表单 -->
        <div class="form_box">
          <el-form ref="ruleFormRef" class="from" :rules="rules" :model="user">
            <!-- 手机号 -->
            <div class="phone_box">
              <label for="phone">手机号</label>
              <el-form-item prop="phone">
                <el-input id="phone" v-model="user.phone" autocomplete="off" />
              </el-form-item>
            </div>
            <!-- 密码 -->
            <div class="password_box" v-if="mode === 'phone'">
              <label for="password">密码</label>
              <el-form-item prop="password">
                <el-input v-model="user.password" type="password" autocomplete="off" />
              </el-form-item>
            </div>
            <!-- 验证码 -->
            <div class="code_box" v-else>
              <label for="password">验证码</label>
              <div class="code_container">
                <el-form-item prop="code">
                  <el-input maxlength="4" v-model="user.code" autocomplete="off" />
                </el-form-item>
                <el-button :disabled="isDisabled" type="danger" @click="getCode">{{ codeBtnText }}</el-button>
              </div>
            </div>
            <el-button type="primary" @click="handleLogin(ruleFormRef)">登录</el-button>
          </el-form>
        </div>

        <!-- 验证码登录或密码登录 -->
        <div class="code">
          <a @click="goCode" href="javascript:;">{{ mode === 'phone' ? '验证码登录' : '密码登录' }}</a>
          <br />
        </div>

        <!-- 游客模式 -->
        <div class="visitor">
          <!-- <a href="javascript:;">游客模式</a> -->
          <el-button type="danger" @click="visitorMode">游客模式</el-button>
        </div>

        <!-- 用户/隐私协议 -->
        <div class="protocol" :class="inAnimation ? 'shake' : ''">
          <input type="checkbox" :checked="checkbox" @click="handleCheckbox">
          <span class="agree">同意网易云音乐<a class="user" href="javascript:;">《用户协议》</a>和<a class="protocolText"
              href="javascript:;">《隐私协议》</a></span>
        </div>

      </div>
      <!-- 二维码容器 -->
      <div class="qrcode_container" v-else>
        <div class="qrlogin">扫码登录</div>
        <img ref="qrcodeImg" src="" alt="">
        <h1 class="qrstatus" style="text-align:center;">{{ qrStatusInfo }}</h1>
        <div class="point">
          <p>打开<span>网易云音乐APP</span></p>
          <p>使用「首页」侧边栏右上方扫一扫登录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- 网易云主题色： D80000 -->

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { phoneLogin, codeLogin, regCode, getKey, qrcodeCreate, testQrcodeStatus } from '@/api/login'
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user'

// 引入生成二维码库
import QRCode from 'qrcode'
import { trim } from 'lodash';

// 路由实例对象
const router = useRouter()

// 创建user实例
const store = useUserStore()

const ruleFormRef = ref(null)

// DOM元素加载完毕(干一些事情)
onMounted(() => {
  ElMessage({
    type: 'error',
    message: '仅支持二维码登录，第三方登录暂不支持...',
    duration: 5000
  })
})


// 用户账户信息
let user = reactive({
  // 手机号
  phone: '',
  // 密码
  password: '',
  // 验证码
  code: ''
})

// 设置个变量（判断是密码登录还是验证码登录）---默认登录
let mode = ref('code')

// 用户是否同意协议（默认不同意）
let checkbox = ref(false)

// 是否播放动画（为true播放动画，否则不播放）
let inAnimation = ref(false)

// 是否是扫码登录（首次是pc端登录，不是二维码）
let qrcode = ref(false)

// 自定义验证规则
const phoneRules = (rule, value, callback) => {
  let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  // 值为空
  if (!value) {
    callback(new Error('手机号不能为空'))
  } else if (!reg.test(value)) {
    // 如果表达式为假，就提示
    callback(new Error('手机号不正确'))
  } else {
    callback()
  }
}
const passwordRules = (rule, value, callback) => {
  // 值为空
  if (!value) {
    callback(new Error('密码不能为空'))
  } else {
    callback()
  }
}
const codeRules = (rule, value, callback) => {
  // 值为空
  if (!value) {
    callback(new Error('验证码不能为空'))
  } else {
    callback()
  }
}

const rules = reactive({
  phone: [{ validator: phoneRules, trigger: 'blur' }],
  password: [{ validator: passwordRules, trigger: 'blur' }],
  code: [{ validator: codeRules, trigger: 'blur' }]
})

// 登录按钮
const handleLogin = (formEl) => {
  // 判断是否同意协议
  if (checkbox.value) {
    // 用户同意了协议
    // 判断用户是什么模式登录
    // 当前为手机号登录
    if (mode.value === 'phone') {
      let data = {
        phone: user.phone,
        password: user.password
      }
      // 手机号登录
      phoneLogin(data).then((res) => {
        const { data } = res
        if (data.code === 200) {
          ElMessage.success('登录成功！')
          // 1. 存储token
          store.updataToken(data.token)
          // 2. 将获取到的用户信息存储到起来
          store.updataUserInfo(data)
          // 3. 跳转页面
          router.push({
            path: '/layout'
          })
        } else {
          ElMessage.error('账号或密码错误！')
        }
      }).catch((error) => {
        // ElMessage.error('网络太拥挤，请稍后重试')
        ElMessage.error('密码登录暂不开放!')
      })
    } else {
      // 验证码登录(这里对整个表单进行验证)
      formEl.validate((valid) => {
        /**
         * valid返回true或false
         * 输入框符合规范就返回true，反之
        */
        if (valid) {
          regCode({
            phone: user.phone,
            captcha: user.code
          }).then(res => {
            if (res.data.code !== 200) {
              ElMessage.error('验证码错误！')
            } else {
              ElMessage.error('验证码登录暂不开放!')
              // ElMessage.success('登录成功!')
              // 跳转页面
              // router.push({
              //   path: '/layout'
              // })
            }
          }).catch(() => {
            ElMessage.error('验证码错误！')
          })
        } else {
          ElMessage.error('表单错误！')
          return false
        }
      })
    }
  } else {
    // 将动画的设置为true，播放动画
    inAnimation.value = true
    // 500毫秒后，动画状态设置为false，下次点击又能设置为true了，又可以播放动画了，你要是不把他改为true，下次还是true，因为true已经播放动画了
    setTimeout(() => {
      inAnimation.value = false
    }, 500)
    // 用户没同意
    ElMessage.error('请先同意协议！')
  }
}

let isDisabled = ref(false)
let codeBtnText = ref('获取验证码')
let countDown = ref(60)
let timer = ref(null);
// 这里只是---获取验证码
const getCode = () => {
  let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  if (!trim(user.phone)) {
    ElMessage.error('手机号不能为空！')
  } else if (!reg.test(user.phone)) {
    ElMessage.error('手机号不合法！')
  } else {
    codeLogin({
      phone: user.phone
    }).then(res => {
      // 判断验证码是否发送成功
      if (res.data.code !== 200) {
        // 发送失败
        ElMessage.error('验证码发送失败，请稍后重试！')
      } else {
        // 发送成功
        ElMessage.success('验证码发送成功，请注意查收！')
      }
    }).catch((error) => {
      console.log(error)
      ElMessage.error('网络太拥挤，请稍候再试！')
    })

    isDisabled.value = true
    // 倒计时60秒
    timer.value = setInterval(() => {
      countDown.value--;
      codeBtnText.value = `${countDown.value}s后重新发送`
      if (countDown.value < 1) {
        resetGetCode()
      }
    }, 1000)
  }
}

function resetGetCode() {
  clearInterval(timer.value)
  isDisabled.value = false
  countDown.value = 60
  codeBtnText.value = '获取验证码'
}

// 验证码登录或手机号登录按钮（来回切换）
const goCode = () => {
  if (mode.value === 'phone') {
    // 验证码登录
    mode.value = 'code'
    ElNotification.success({
      title: '状态',
      message: '验证码登录中',
      showClose: false, // 设置为false就能定时关闭这个消息弹框
      duration: 1000  // 多久后消息弹框消失
    })
  } else {
    // 手机号登录
    mode.value = 'phone'
    ElNotification.success({
      title: '状态',
      message: '手机号登录中',
      showClose: false,
      showClose: false, // 设置为false就能定时关闭这个消息弹框
      duration: 1000  // 多久后消息弹框消失
    })
  }
}

// 协议
const handleCheckbox = () => {
  checkbox.value = !checkbox.value
}

// 存储二维码状态信息
let qrStatusInfo = ref('等待扫码')
// 二维码的src地址
let qrcodeImg = ref(null)
// 定时器的唯一标识
const timerId = ref(null)
// 二维码登录
const qrcodeLogin = async () => {
  resetGetCode()
  // 二维码 key 生成接口
  // 1. 生成key（调用接口）
  const { data } = await getKey()
  const key = data.data.unikey

  // console.log('key为：', key)

  // 密码登录和二维码登录切换
  qrcode.value = !qrcode.value
  // 必须是扫码状态才发请求
  if (qrcode.value) {
    // 2. 利用key，生成二维码
    const qrcodeBase = await qrcodeCreate(key)
    // console.log('二维码图片base64地址', qrcodeBase.data.data.qrimg)
    qrcodeImg.value.src = qrcodeBase.data.data.qrimg

    // 轮询二维码的扫描状态
    timerId.value = setInterval(async () => {
      const { data } = await testQrcodeStatus(key)

      // 二维码状态   801：等待扫码  
      const status = data.code
      // 根据状态做出相应操作
      if (status === 801) {
        code801(data)
      } else if (status === 800) {
        code800(data)
      } else if (status === 802) {
        code802(data)
      } else if (status === 803) {
        code803(data)
      } else {
        console.log('网易云音乐API接口错误！！！')
      }
      console.log("二维码状态：", data)
    }, 1000)
  } else {
    // 离开二维码登录页面，清楚定时器
    clearInterval(timerId.value)
  }
}
// 二维码已过期
function code800(data) {
  qrStatusInfo.value = data.message
}
// 等待用户扫码
function code801(data) {
  qrStatusInfo.value = data.message
}
// 授权中（等待用户点击确定）
function code802(data) {
  qrStatusInfo.value = data.message

  // 先存储简单信息，名字和头像，进入user组件后，会自动修改store中的userInfo数据
  store.updataUserInfo({
    userName: data.nickname,
    userLogo: data.avatarUrl
  })
}
// 登录成功
function code803(data) {
  qrStatusInfo.value = data.message
  console.log('登录成功！', data)

  // 对从服务器获取到的cookie进行一次加密
  // const cookie = encodeURIComponent(data.cookie)
  // console.log('加密后的：', cookie)

  // 存储token
  store.updataToken(data.cookie)

  // 提示消息
  ElMessage.success(`${store.userInfo.userName}-登录成功`)


  // 跳转到首页
  router.replace({
    name: 'layout'
  })
  // 关闭定时器（停止轮询二维码状态）
  clearInterval(timerId.value)
}

// 游客模式
const visitorMode = () => {
  ElMessage({
    type: 'success',
    message: '已进入游客模式',
    duration: 2500
  })
  router.push('/layout')
}

</script>

<style lang="scss" scoped>
#container {
  height: 100%;
  width: 100%;
  background-image: url('~@/assets/images/login-compress.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .box {
    width: 380px;
    height: 500px;
    padding: 40px 30px;
    background-color: rgba(0, 0, 0, .3);
    border-radius: 20px;
    box-shadow: 0px 0px 30px 10px #fff;
    position: relative;

    .cloudMusic {
      width: 100%;
      height: auto;
      margin-bottom: 20px;

      .text {
        width: 200px;
        margin-left: 20px;
      }
    }

    .form_box {
      .from {

        .phone_box,
        .password_box,
        .code_box {
          margin-top: 25px;

          label {
            color: #ffffff;

          }

          input {
            margin-top: 10px;
          }
        }

        .phone_box,
        .password_box {
          .el-form-item {
            margin-top: 10px;
          }
        }

        .code_box {
          .code_container {
            margin-top: 10px;
          }
        }

        .code_box {
          .code_container {
            display: flex;
            justify-content: space-between;

            .el-button {
              width: 30%;
            }
          }
        }
      }
    }

    // 按钮
    .el-button {
      width: 100%;
    }

    // 验证码
    .code {
      text-align: center;
      margin-top: 30px;

      a {
        color: #fff;
        border-bottom: 1px solid #fff;
        font-size: 20px;
        font-family: "楷体";

        &:hover {
          color: rgb(238, 74, 74);
        }
      }
    }

    // 协议
    .protocol {
      position: absolute;
      bottom: 30px;
      display: flex;
      align-items: center;

      input {
        zoom: 150%;
        cursor: pointer;
      }

      span {
        color: rgb(192, 191, 191);
        font-size: 15px;
      }

      .user,
      .protocolText {
        color: #000;

        &:hover {
          border-bottom: 1px solid #fff;
        }
      }
    }

    // 二维码容器
    .qrcode_container {
      display: flex;
      flex-direction: column;
      align-items: center;

      .qrstatus {
        color: #00a1ff;
        margin-top: 10px;
      }

      .qrlogin {
        text-align: center;
        margin-top: 40px;
        font-size: 30px;
        color: #fff;
      }

      // 二维码图片
      img {
        margin-top: 10px;
        width: 200px;
        border-radius: 20px;
      }

      // 提示
      .point {
        position: absolute;
        bottom: 30px;

        p {
          text-align: center;
          color: #fff;
          margin-bottom: 5px;

          span {
            color: #D80000;
            margin-left: 3px;
          }
        }
      }
    }
  }
}

// 游客模式
.visitor {
  width: 100%;
  margin-top: 40px;
  display: flex;
  justify-content: center;

  button {
    font-size: 25px;
  }
}

.qrcode {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}

// 协议为同意，产生晃动动画
.shake {
  animation: shake .5s linear 0s 3;
}

// 摇动css动画
@keyframes shake {
  0% {
    transform: translateX(-5%);
  }

  20% {
    transform: translateX(5%);
  }

  40% {
    transform: translateX(-5%);
  }

  60% {
    transform: translateX(5%);
  }

  80% {
    transform: translateX(-5%);
  }

  100% {
    transform: translateX(0%);
  }
}
</style>