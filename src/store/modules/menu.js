import { listForRouter } from '@/api/system/menu'
import { traverseRoutes } from '@/utils/route'
import { constantRoutes } from '@/router'

export default {
  namespaced: true,
  state: () => ({
    routes: [],
    addRoutes: []
  }),
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    getSideMenus({ commit }) {
      return new Promise((resolve, reject) => {
        listForRouter().then(response => {
          const menus = response.data
          const remoteroutes = traverseRoutes(menus)
          commit('SET_ROUTES', remoteroutes)
          resolve(remoteroutes)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
