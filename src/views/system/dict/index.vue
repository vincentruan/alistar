<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="listQuery.name"
            size="small"
            placeholder="请输入字典名称"
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
      <el-table-column label="详情">
        <template #default="scope">
          {{ scope.row.detail }}
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="formVisible"
      :title="formTitle"
      width="60%"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item
          label="名称"
          prop="name"
        >
          <el-input
            v-model="form.name"
            minlength="1"
          />
        </el-form-item>
        <el-form-item
          v-for="(rec, index) in form.details"
          :key="rec.key"
          :label="'字典' + (index+1)"
          :prop="'details.' + index + '.value'"
          :rules="{
            required: true, message: '不能为空', trigger: 'blur'
          }"
        >
          <el-col :span="10">
            <el-input
              v-model="rec.key"
              placeholder="值"
            />
          </el-col>
          <el-col
            class="line"
            :span="1"
          >
&nbsp;
          </el-col>
          <el-col :span="10">
            <el-input
              v-model="rec.value"
              placeholder="名称"
            />
          </el-col>
          <el-col :span="3">
            <el-button
              type="danger"
              link
              @click="removeDetail(rec)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </el-col>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="save"
          >
            提交
          </el-button>
          <el-button @click="addDetail">
            新增字典
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import { getList, save, remove } from '@/api/system/dict'

const formRef = ref(null)
const formVisible = ref(false)
const formTitle = ref('添加字典')
const listLoading = ref(true)
const list = ref([])
const selRow = ref({})

const listQuery = reactive({
  name: undefined
})

const form = reactive({
  id: '',
  name: '',
  details: []
})

const rules = {
  name: [
    { required: true, message: '请输入字典名称', trigger: 'blur' },
    { min: 1, message: '长度不能小于1个字符', trigger: 'blur' }
  ]
}

const fetchData = async () => {
  listLoading.value = true
  try {
    const response = await getList(listQuery)
    list.value = response.data
  } catch (error) {
    console.error('Failed to fetch dictionary list:', error)
  } finally {
    listLoading.value = false
  }
}

const search = () => {
  fetchData()
}

const reset = () => {
  listQuery.name = ''
  fetchData()
}

const handleCurrentChange = (currentRow) => {
  selRow.value = currentRow
}

const add = () => {
  formTitle.value = '添加字典'
  Object.assign(form, {
    id: '',
    name: '',
    details: []
  })
  formVisible.value = true
}

const edit = () => {
  if (!selRow.value || !selRow.value.id) {
    ElMessage({
      message: '请选择一条记录',
      type: 'warning'
    })
    return
  }
  formTitle.value = '编辑字典'
  Object.assign(form, selRow.value)
  formVisible.value = true
}

const save = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    await save(form)
    ElMessage({
      message: '操作成功',
      type: 'success'
    })
    formVisible.value = false
    await fetchData()
  } catch (error) {
    console.error('Save failed:', error)
  }
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
    await ElMessageBox.confirm('确认删除该字典吗？', '提示', {
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

const addDetail = () => {
  form.details.push({
    key: '',
    value: ''
  })
}

const removeDetail = (rec) => {
  const index = form.details.indexOf(rec)
  if (index !== -1) {
    form.details.splice(index, 1)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/common.scss";
</style>
