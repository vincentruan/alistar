<template>
  <div class="app-container">
    <div class="block">
      <el-form
        ref="formRef"
        :model="form"
      >
        <el-input
          ref="content"
          v-model="form.content"
          type="hidden"
        />
        <el-row :gutter="20">
          <el-col :span="24">
            <el-button
              type="primary"
              size="small"
              @click="save"
            >
              <el-icon><Check /></el-icon>
              提交
            </el-button>
            <el-button
              size="small"
              @click="back"
            >
              <el-icon><Back /></el-icon>
              返回
            </el-button>
          </el-col>
          <el-col :span="12">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-input
                  v-model="form.title"
                  minlength="1"
                  placeholder="文章标题"
                  style="font-size: 1.2rem;margin:.2rem 0rem;"
                />
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="8">
                <el-select
                  v-model="form.idChannel"
                  placeholder="选择栏目"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col :span="16">
                <el-input
                  v-model="form.author"
                  minlength="1"
                  placeholder="作者"
                  style="margin-bottom:.2rem;"
                />
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="ifUpload"
              label="题图"
            >
              <el-upload
                class="upload-demo"
                drag
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
            <img
              v-if="!ifUpload"
              :src="articleImg"
              style="height:8rem;"
            >
            <el-button
              v-if="!ifUpload"
              @click="uploadImg"
            >
              <el-icon><Edit /></el-icon>
              修改题图
            </el-button>
          </el-col>
        </el-row>
        <br>
      </el-form>
      <div
        :class="{fullscreen:fullscreen}"
        class="tinymce-container editor-container"
      >
        <textarea
          :id="tinymceId"
          class="tinymce-textarea"
        />
        <div class="editor-custom-btn-container">
          <editorImage
            color="#1890ff"
            class="editor-upload-btn"
            @successCBK="imageSuccessCBK"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onActivated, onDeactivated, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { Check, Back, Upload, Edit } from '@element-plus/icons-vue'
import editorImage from '@/components/Tinymce'
import plugins from './plugins'
import toolbar from './toolbar'
import { save, get } from '@/api/cms/article'
import { getList } from '@/api/cms/channel'
import { getApiUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'

const store = useStore()
const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const content = ref(null)
    
const uploadUrl = ref('')
const uploadFileId = ref('')
const uploadHeaders = reactive({
  'Authorization': ''
})
const loadingInstance = ref(null)
const form = reactive({
  title: '',
  author: '',
  idChannel: '1',
  content: '',
  img: ''
})
const articleImg = ref('')
const ifUpload = ref(true)
const options = ref([])
const hasChange = ref(false)
const hasInit = ref(false)
const tinymceId = ref('vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''))
const fullscreen = ref(false)
const languageTypeList = {
  'en': 'en',
  'zh': 'zh_CN'
}

const language = computed(() => {
  return languageTypeList[store.getters.language]
})

watch(() => form.content, (val) => {
  if (!hasChange.value && hasInit.value) {
    window.tinymce.get(tinymceId.value).setContent(val || '')
  }
})

watch(language, () => {
  destroyTinymce()
  initTinymce()
})

const init = async () => {
  uploadUrl.value = getApiUrl() + '/file'
  uploadHeaders['Authorization'] = getToken()
  const id = route.query.id
  if (id) {
    const response = await get(id)
    Object.assign(form, response.data)
    setContent(response.data.content)
    articleImg.value = uploadUrl.value + '/getImgStream?idFile=' + response.data.img
    ifUpload.value = false
  }
  const listResponse = await getList()
  options.value = listResponse.data
}

const initTinymce = () => {
  window.tinymce.init({
    value: 'aaaaaa',
    language: language.value,
    selector: `#${tinymceId.value}`,
    height: 360,
    body_class: 'panel-body ',
    object_resizing: false,
    toolbar: toolbar,
    menubar: 'file edit insert view format table',
    plugins: plugins,
    end_container_on_empty_block: true,
    powerpaste_word_import: 'clean',
    code_dialog_height: 450,
    code_dialog_width: 1000,
    advlist_bullet_styles: 'square',
    advlist_number_styles: 'default',
    imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
    default_link_target: '_blank',
    link_title: false,
    nonbreaking_force_tab: true,
    init_instance_callback: editor => {
      if (form.content) {
        editor.setContent(form.content)
      }
      hasInit.value = true
      editor.on('NodeChange Change KeyUp SetContent', () => {
        hasChange.value = true
        const content = editor.getContent()
        form.content = content
      })
    },
    setup(editor) {
      editor.on('FullscreenStateChanged', (e) => {
        fullscreen.value = e.state
      })
    }
  })
}

const destroyTinymce = () => {
  const tinymce = window.tinymce.get(tinymceId.value)
  if (fullscreen.value) {
    tinymce.execCommand('mceFullScreen')
  }

  if (tinymce) {
    tinymce.destroy()
  }
}

const setContent = (value) => {
  window.tinymce.get(tinymceId.value).setContent(value)
}

const getContent = () => {
  window.tinymce.get(tinymceId.value).getContent()
}

const imageSuccessCBK = (arr) => {
  arr.forEach(v => {
    window.tinymce.get(tinymceId.value).insertContent(`<img class="wscnph" src="${v.url}" >`)
  })
}

const save = async () => {
  const content = form.content.split('%').join('%25')
  try {
    await save({
      id: form.id,
      title: form.title,
      author: form.author,
      idChannel: form.idChannel,
      content: content,
      img: form.img
    })
    ElMessage({
      message: '操作成功',
      type: 'success'
    })
    router.go(-1)
  } catch (error) {
    console.error('Save failed:', error)
  }
}

const back = () => {
  router.go(-1)
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
    form.img = response.data.id
  } else {
    ElMessage({
      message: '上传失败',
      type: 'error'
    })
  }
}

const uploadImg = () => {
  ifUpload.value = !ifUpload.value
}

onMounted(() => {
  init()
  initTinymce()
})

onActivated(() => {
  initTinymce()
})

onDeactivated(() => {
  destroyTinymce()
})

onBeforeUnmount(() => {
  destroyTinymce()
})
</script>

<style scoped>
  .tinymce-container {
    position: relative;
    line-height: normal;
  }

  .tinymce-container :deep(.mce-fullscreen) {
    z-index: 10000;
  }

  .tinymce-textarea {
    visibility: hidden;
    z-index: -1;
  }

  .editor-custom-btn-container {
    position: absolute;
    right: 4px;
    top: 4px;
  }

  .fullscreen .editor-custom-btn-container {
    z-index: 10000;
    position: fixed;
  }

  .editor-upload-btn {
    display: inline-block;
  }
</style>
