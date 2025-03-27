<template>
  <div class="app-container">
    <div class="user">
      <strong>{{ user.name }}</strong><br>
      <small>{{ user.dept }} &nbsp;&nbsp; {{ user.roles }}</small>
    </div>
    <el-row
      class="user-content"
      style=""
    >
      <el-col
        :span="6"
        class="profile"
      >
        <img
          class="user-avatar"
          src="@/assets/img/avatar.gif"
        ><br>
        <p><span class="title"><el-icon><Phone /></el-icon>&nbsp;&nbsp;{{ user.phone }}</span></p>
        <p><span class="title"><el-icon><Message /></el-icon>&nbsp;&nbsp;{{ user.email }}</span></p>
        <p><span class="title"><el-icon><CircleCheck /></el-icon>&nbsp;&nbsp;{{ user.status == '1'?'启用' : '禁用' }}</span></p>
        <p><span class="title"><el-icon><Location /></el-icon>&nbsp;&nbsp;上海市浦东大道290弄</span></p>
      </el-col>
      <el-col
        :span="18"
        style="padding-left:10px;"
      >
        <el-tabs
          v-model="activeName"
          @tab-click="handleClick"
        >
          <el-tab-pane
            label="个人资料"
            name="profile"
          />
          <el-tab-pane
            label="最近活动"
            name="timeline"
          />
          <el-tab-pane
            label="修改密码"
            name="updatePwd"
          />
        </el-tabs>
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="150px"
        >
          <el-row>
            <el-col :span="24">
              <el-form-item label="原密码" prop="oldPassword">
                <el-input
                  v-model="form.oldPassword"
                  type="password"
                  show-password
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label="新密码"
                prop="password"
              >
                <el-input
                  v-model="form.password"
                  type="password"
                  show-password
                  minlength="5"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="重复密码" prop="rePassword">
                <el-input
                  v-model="form.rePassword"
                  type="password"
                  show-password
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button
              type="primary"
              @click="updatePwd"
            >
              提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Phone, Message, CircleCheck, Location } from '@element-plus/icons-vue'
import { updatePwd } from '@/api/user'

const router = useRouter()
const formRef = ref(null)
const activeName = ref('updatePwd')

const user = reactive({
  name: 'Admin',
  dept: '研发部',
  roles: '超级管理员',
  phone: '13800138000',
  email: 'admin@example.com',
  status: '1'
})

const form = reactive({
  oldPassword: '',
  password: '',
  rePassword: ''
})

const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (form.rePassword !== '') {
      formRef.value?.validateField('rePassword')
    }
    callback()
  }
}

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' },
    { min: 5, message: '密码长度不能小于5位', trigger: 'blur' }
  ],
  rePassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ]
}

const handleClick = (tab) => {
  if (tab.props.name === 'profile') {
    router.push('/account/profile')
  } else if (tab.props.name === 'timeline') {
    router.push('/account/timeline')
  }
}

const updatePwd = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    await updatePwd(form)
    ElMessage({
      message: '密码修改成功',
      type: 'success'
    })
    form.oldPassword = ''
    form.password = ''
    form.rePassword = ''
  } catch (error) {
    console.error('Update password failed:', error)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

