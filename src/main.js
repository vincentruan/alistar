import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ECharts from 'vue-echarts/components/ECharts.vue'
import '@/styles/index.scss' // global css

import App from './App.vue'
import store from './store'
import router from './router'
import i18n from './lang' // Internationalization
import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

const app = createApp(App)

// set ElementPlus lang to EN
app.use(ElementPlus, { i18n: (key, value) => i18n.global.t(key, value) })

app.component('v-chart', ECharts)
app.config.productionTip = false

app.use(router)
app.use(store)
app.use(i18n)

app.mount('#app')
