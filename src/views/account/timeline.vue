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
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.createTime"
          >
            {{ activity.logname }}
          </el-timeline-item>
        </el-timeline>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Phone, Message, CircleCheck, Location } from '@element-plus/icons-vue'

const router = useRouter()
const activeName = ref('timeline')
const reverse = ref(true)

const user = reactive({
  name: 'Admin',
  dept: '研发部',
  roles: '超级管理员',
  phone: '13800138000',
  email: 'admin@example.com',
  status: '1'
})

const activities = ref([
  {
    content: '创建了项目',
    createTime: '2024-01-01 12:00:00',
    logname: '创建了项目'
  },
  {
    content: '更新了项目',
    createTime: '2024-01-02 12:00:00',
    logname: '更新了项目'
  }
])

const handleClick = (tab) => {
  if (tab.props.name === 'profile') {
    router.push('/account/profile')
  } else if (tab.props.name === 'updatePwd') {
    router.push('/account/updatePwd')
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

