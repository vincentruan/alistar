import { createStore } from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import tagsView from './modules/tagsView'
import menu from './modules/menu'
// import permission from './modules/permission'

const store = createStore({
  modules: {
    app,
    settings,
    user,
    tagsView,
    menu
  },
  getters
})

export default store
