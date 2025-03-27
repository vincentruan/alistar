<template>
  <div class="app-container">
    <div class="block">
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
      <el-table-column label="名称">
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="编码">
        <template #default="scope">
          {{ scope.row.code }}
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
              label="名称"
              prop="name"
            >
              <el-input
                v-model="form.name"
                minlength="1"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="编码"
              prop="code"
            >
              <el-input
                v-model="form.code"
                minlength="1"
              />
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { remove, getList, save } from '@/api/cms/channel'

const formVisible = ref(false)
const formTitle = ref('添加栏目')
const deptList = ref([])
const isAdd = ref(true)
const form = reactive({
  id: '',
  name: '',
  code: ''
})
const list = ref(null)
const listLoading = ref(true)
const selRow = ref({})

const rules = computed(() => ({
  name: [
    { required: true, message: '名称不能为空', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '编码不能为空', trigger: 'blur' }
  ]
}))

const init = () => {
  fetchData()
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const response = await getList()
    list.value = response.data
  } finally {
    listLoading.value = false
  }
}

const handleCurrentChange = (currentRow) => {
  selRow.value = currentRow
}

const resetForm = () => {
  Object.assign(form, {
    id: '',
    name: '',
    code: ''
  })
}

const add = () => {
  resetForm()
  formTitle.value = '添加栏目'
  formVisible.value = true
  isAdd.value = true
}

const save = async () => {
  try {
    await save({
      id: form.id,
      name: form.name,
      code: form.code
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

const edit = () => {
  if (checkSel()) {
    isAdd.value = false
    Object.assign(form, selRow.value)
    formTitle.value = '编辑栏目'
    formVisible.value = true
  }
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

onMounted(() => {
  init()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
