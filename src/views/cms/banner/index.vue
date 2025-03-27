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
      <el-table-column label="类别">
        <template #default="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column label="url">
        <template #default="scope">
          {{ scope.row.url }}
        </template>
      </el-table-column>
      <el-table-column label="图片">
        <template #default="scope">
          <img
            :src="scope.row.img"
            style="width:200px;"
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="formVisible"
      :title="formTitle"
      width="70%"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="标题"
              prop="title"
            >
              <el-input
                v-model="form.title"
                minlength="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="url"
              prop="url"
            >
              <el-input
                v-model="form.url"
                minlength="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select
                v-model="form.type"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="banner图片">
              <el-upload
                class="upload-demo"
                drag
                :multiple="false"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :before-upload="handleBeforeUpload"
                :on-success="handleUploadSuccess"
              >
                <el-icon class="el-icon--upload"><Upload /></el-icon>
                <div class="el-upload__text">
                  上传图片
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button
            type="primary"
            @click="save"
          >
            提交
          </el-button>
          <el-button @click="formVisible = false">
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Delete, Upload } from '@element-plus/icons-vue'
import { remove, getList, save } from '@/api/cms/banner'
import { getToken } from '@/utils/auth'
import { getApiUrl } from '@/utils/utils'

const router = useRouter()
const uploadUrl = ref('')
const uploadFileId = ref('')
const uploadHeaders = reactive({
  'Authorization': ''
})
const loadingInstance = ref(null)
const formVisible = ref(false)
const formTitle = ref('添加banner')
const deptList = ref([])
const isAdd = ref(true)
const options = ref([
  { label: '首页', value: 'index' },
  { label: '新闻', value: 'news' },
  { label: '产品', value: 'product' },
  { label: '解决方案', value: 'solution' },
  { label: '案例', value: 'case' }
])
const form = reactive({
  id: '',
  title: '',
  url: '',
  img: '',
  idFile: '',
  type: 'index'
})
const listQuery = reactive({
  title: undefined
})
const list = ref(null)
const listLoading = ref(true)
const selRow = ref({})

const rules = computed(() => ({
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' }
  ],
  url: [
    { required: true, message: 'URL不能为空', trigger: 'blur' }
  ]
}))

const init = async () => {
  uploadUrl.value = getApiUrl() + '/file'
  uploadHeaders['Authorization'] = getToken()
  await fetchData()
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const response = await getList(listQuery)
    list.value = response.data
    for (const item of list.value) {
      item.img = getApiUrl() + '/file/getImgStream?idFile=' + item.idFile
    }
  } finally {
    listLoading.value = false
  }
}

const search = () => {
  fetchData()
}

const reset = () => {
  listQuery.title = ''
  fetchData()
}

const handleFilter = () => {
  fetchData()
}

const handleCurrentChange = (currentRow) => {
  selRow.value = currentRow
}

const resetForm = () => {
  Object.assign(form, {
    id: '',
    title: '',
    url: '',
    idFile: uploadFileId.value,
    type: ''
  })
}

const add = () => {
  resetForm()
  formTitle.value = '添加banner'
  formVisible.value = true
  isAdd.value = true
}

const save = async () => {
  try {
    await save({
      id: form.id,
      title: form.title,
      url: form.url,
      idFile: uploadFileId.value,
      type: form.type
    })
    ElMessage({
      message: '操作成功',
      type: 'success'
    })
    await fetchData()
    formVisible.value = false
  } catch (error) {
    console.error('Save failed:', error)
  }
}

const checkSel = () => {
  if (selRow.value && selRow.value.id) {
    return true
  }
  ElMessage({
    message: '请选择一条记录',
    type: 'warning'
  })
  return false
}

const remove = async () => {
  if (checkSel()) {
    try {
      await ElMessageBox.confirm('确认删除该记录吗？', '提示', {
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
}

const handleBeforeUpload = () => {
  if (uploadFileId.value !== '') {
    ElMessage({
      message: '请选择一条记录',
      type: 'warning'
    })
    return false
  }
  loadingInstance.value = ElLoading.service({
    lock: true,
    text: '上传中',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

const handleUploadSuccess = (response) => {
  loadingInstance.value.close()
  if (response.code === 20000) {
    uploadFileId.value = response.data.id
    form.fileName = response.data.originalFileName
  } else {
    ElMessage({
      message: '上传失败',
      type: 'error'
    })
  }
}

onMounted(() => {
  init()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
