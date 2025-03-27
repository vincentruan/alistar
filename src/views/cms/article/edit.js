import { ref, reactive, computed, watch, onMounted, onActivated, onDeactivated, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import editorImage from '@/components/Tinymce'
import plugins from './plugins'
import toolbar from './toolbar'
import { save, get } from '@/api/cms/article'
import { getList } from '@/api/cms/channel'
import { getApiUrl } from '@/utils/utils'
import { getToken } from '@/utils/auth'

export default {
  name: 'Tinymce',
  components: { editorImage },
  props: {
    id: {
      type: String,
      default: () => 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
    },
    value: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      required: false,
      default: () => []
    },
    menubar: {
      type: String,
      default: 'file edit insert view format table'
    },
    height: {
      type: Number,
      required: false,
      default: 360
    }
  },
  setup(props, { emit }) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    
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
    const tinymceId = ref(props.id)
    const fullscreen = ref(false)
    const languageTypeList = {
      'en': 'en',
      'zh': 'zh_CN'
    }

    const language = computed(() => {
      return languageTypeList[store.getters.language]
    })

    watch(() => props.value, (val) => {
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
        height: props.height,
        body_class: 'panel-body ',
        object_resizing: false,
        toolbar: props.toolbar.length > 0 ? props.toolbar : toolbar,
        menubar: props.menubar,
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
          if (props.value) {
            editor.setContent(props.value)
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

    return {
      form,
      options,
      uploadUrl,
      uploadHeaders,
      articleImg,
      ifUpload,
      handleBeforeUpload,
      handleUploadSuccess,
      uploadImg,
      save,
      back
    }
  }
}
