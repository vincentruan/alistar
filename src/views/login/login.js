import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'

export default {
  name: 'login',
  components: { LangSelect },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { t } = useI18n()

    const loginForm = reactive({
      username: '',
      password: ''
    })

    const loading = ref(false)
    const pwdType = ref('password')
    const redirect = ref('/')
    const loginFormRef = ref(null)

    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error(t('login.errorAccount')))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error(t('login.errorPassword')))
      } else {
        callback()
      }
    }

    const loginRules = {
      username: [{ required: true, trigger: 'blur', validator: validateUsername }],
      password: [{ required: true, trigger: 'blur', validator: validatePassword }]
    }

    const init = () => {
      const redirectQuery = route.query.redirect
      console.log('redirect', redirectQuery)
      if (redirectQuery) {
        redirect.value = redirectQuery
      }
    }

    const showPwd = () => {
      if (pwdType.value === 'password') {
        pwdType.value = ''
      } else {
        pwdType.value = 'password'
      }
    }

    const handleLogin = () => {
      loginFormRef.value.validate(valid => {
        if (valid) {
          loading.value = true
          store.dispatch('user/login', loginForm).then(() => {
            loading.value = false
            router.push({ path: redirect.value })
          }).catch((err) => {
            if (err) {
              console.log(err.stack)
            }
            loading.value = false
          })
        } else {
          return false
        }
      })
    }

    onMounted(() => {
      init()
    })

    return {
      loginForm,
      loginRules,
      loading,
      pwdType,
      loginFormRef,
      showPwd,
      handleLogin
    }
  }
}
