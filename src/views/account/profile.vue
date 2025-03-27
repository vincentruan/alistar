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
        <el-form label-width="80px">
          <h3>基本信息</h3>
          <el-form-item label="名称">
            <span>{{ user.name }}</span>
          </el-form-item>
          <el-form-item label="性别">
            <span>{{ user.sex === 1 ? '男' : '女' }}</span>
          </el-form-item>
          <el-form-item label="生日">
            <span>{{ user.birthday }}</span>
          </el-form-item>
          <h3>联系信息</h3>
          <el-form-item label="手机">
            <span>{{ user.phone }}</span>
          </el-form-item>
          <el-form-item label="邮箱">
            <span>{{ user.email }}</span>
          </el-form-item>
          <el-form-item label="地址">
            <span>浦东大道290弄</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Phone, Message, CircleCheck, Location } from '@element-plus/icons-vue'

const router = useRouter()
const activeName = ref('profile')

const user = reactive({
  name: 'Admin',
  dept: '研发部',
  roles: '超级管理员',
  phone: '13800138000',
  email: 'admin@example.com',
  status: '1',
  sex: 1,
  birthday: '1990-01-01'
})

const handleClick = (tab) => {
  if (tab.props.name === 'timeline') {
    router.push('/account/timeline')
  } else if (tab.props.name === 'updatePwd') {
    router.push('/account/updatePwd')
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

