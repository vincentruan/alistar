<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="listQuery.title"
            size="small"
            placeholder="标题"
          />
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="listQuery.author"
            size="small"
            placeholder="作者"
          />
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="rangeDate"
            size="small"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="至"
            start-placeholder="发布起始日期"
            end-placeholder="发布截至日期"
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
      <el-row>
        <el-col :span="24">
          <el-button
            type="success"
            size="small"
            @click="add"
          >
            <el-icon><Plus /></el-icon>
            添加
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="edit"
          >
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="remove"
          >
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </el-col>
      </el-row>
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
      <el-table-column label="标题">
        <template #default="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="发布日期">
        <template #default="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="作者">
        <template #default="scope">
          {{ scope.row.author }}
        </template>
      </el-table-column>
      <el-table-column label="文章配图">
        <template #default="scope">
          <img
            :src="scope.row.img"
            style="width:200px;"
          >
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getList, remove } from '@/api/cms/article'

const router = useRouter()
const listLoading = ref(true)
const list = ref([])
const total = ref(0)
const selRow = ref({})
const rangeDate = ref([])

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

const listQuery = reactive({
  page: 1,
  limit: 20,
  title: undefined,
  author: undefined,
  startTime: undefined,
  endTime: undefined
})

const fetchData = async () => {
  listLoading.value = true
  try {
    const response = await getList(listQuery)
    list.value = response.data.records
    total.value = response.data.total
  } catch (error) {
    console.error('Failed to fetch article list:', error)
  } finally {
    listLoading.value = false
  }
}

const search = () => {
  if (rangeDate.value && rangeDate.value.length === 2) {
    listQuery.startTime = rangeDate.value[0]
    listQuery.endTime = rangeDate.value[1]
  } else {
    listQuery.startTime = undefined
    listQuery.endTime = undefined
  }
  listQuery.page = 1
  fetchData()
}

const reset = () => {
  listQuery.title = undefined
  listQuery.author = undefined
  rangeDate.value = []
  listQuery.startTime = undefined
  listQuery.endTime = undefined
  listQuery.page = 1
  fetchData()
}

const handleCurrentChange = (currentRow) => {
  selRow.value = currentRow
}

const add = () => {
  router.push('/cms/article/edit')
}

const edit = () => {
  if (!selRow.value || !selRow.value.id) {
    ElMessage({
      message: '请选择一条记录',
      type: 'warning'
    })
    return
  }
  router.push('/cms/article/edit?id=' + selRow.value.id)
}

const remove = async () => {
  if (!selRow.value || !selRow.value.id) {
    ElMessage({
      message: '请选择一条记录',
      type: 'warning'
    })
    return
  }

  try {
    await ElMessageBox.confirm('确认删除该文章吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await remove(selRow.value.id)
    ElMessage({
      message: '操作成功',
      type: 'success'
    })
    await fetchData()
  } catch (error) {
    console.error('Remove failed:', error)
  }
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
  fetchData()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
