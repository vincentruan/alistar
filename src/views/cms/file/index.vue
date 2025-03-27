<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="listQuery.originalFileName"
            size="small"
            placeholder="文件名"
          />
        </el-col>

        <el-col :span="6">
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
      <el-table-column label="文件名">
        <template #default="scope">
          {{ scope.row.originalFileName }}
        </template>
      </el-table-column>
      <el-table-column label="上传日期">
        <template #default="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="下载">
        <template #default="scope">
          <el-button
            size="small"
            @click="download(scope.row.id, scope.row.originalFileName)"
          >
            <el-icon><Download /></el-icon>
            下载
          </el-button>
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
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { getList } from '@/api/cms/fileInfo'
import { getApiUrl } from '@/utils/utils'

const listQuery = reactive({
  page: 1,
  limit: 20,
  originalFileName: undefined
})

const total = ref(0)
const list = ref(null)
const listLoading = ref(true)
const selRow = ref({})
const downloadUrl = ref('')

const init = () => {
  downloadUrl.value = getApiUrl() + '/file/download?idFile='
  fetchData()
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const response = await getList(listQuery)
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
  listQuery.originalFileName = ''
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

const download = (id, fileName) => {
  window.location.href = downloadUrl.value + id + '&fileName=' + fileName
}

onMounted(() => {
  init()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>

