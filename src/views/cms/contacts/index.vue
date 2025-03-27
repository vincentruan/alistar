<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="listQuery.userName"
            size="small"
            placeholder="姓名"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="listQuery.mobile"
            size="small"
            placeholder="手机号"
          />
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="rangeDate"
            size="small"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="至"
            start-placeholder="邀约开始日期"
            end-placeholder="邀约截至日期"
            value-format="YYYYMMDDHHmmss"
            align="right"
          />
        </el-col>
        <el-col :span="4">
          <el-button
            type="success"
            size="small"
            @click="search"
          >
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="reset"
          >
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-col>
      </el-row>
      <br>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column label="ID">
        <template #default="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="联系人">
        <template #default="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="联系手机">
        <template #default="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column label="email">
        <template #default="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column label="邀约时间">
        <template #default="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template #default="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="listQuery.page"
      v-model:page-size="listQuery.limit"
      :page-sizes="[10, 20, 50, 100, 500]"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changeSize"
      @current-change="fetchPage"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { getList } from '@/api/cms/contacts'

const listQuery = reactive({
  page: 1,
  limit: 20,
  userName: undefined,
  mobile: undefined,
  startDate: undefined,
  endDate: undefined
})

const rangeDate = ref(undefined)
const total = ref(0)
const list = ref(null)
const listLoading = ref(true)
const selRow = ref({})

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

const init = () => {
  fetchData()
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const queryData = { ...listQuery }
    if (rangeDate.value) {
      queryData.startDate = rangeDate.value[0]
      queryData.endDate = rangeDate.value[1]
    }
    const response = await getList(queryData)
    list.value = response.data.records
    total.value = response.data.total
  } finally {
    listLoading.value = false
  }
}

const search = () => {
  fetchData()
}

const reset = () => {
  listQuery.userName = undefined
  listQuery.mobile = undefined
  listQuery.startDate = undefined
  listQuery.endDate = undefined
  rangeDate.value = undefined
  fetchData()
}

const handleCurrentChange = (currentRow) => {
  selRow.value = currentRow
}

const changeSize = (val) => {
  listQuery.limit = val
  fetchData()
}

const fetchPage = (val) => {
  listQuery.page = val
  fetchData()
}

onMounted(() => {
  init()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

