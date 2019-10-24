import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    sidebar: {
      opened: false
    },
    urlApi: 'http://60.247.62.110:10040',
    clientId:process.env.NODE_ENV === 'development' ? 'manager_yanhao' : 'manager_online_yanhao',
    userName: null,
    token: null,
    sidebarStatus: null,
  },
  getters: {
    getUserInfo (state) {
      let userName = state.userName
      if (!userName) {
        userName = sessionStorage.getItem('userName')
      }
      return userName
    },
    getToken (state) {
      let token = state.token
      if (!token) {
        token = sessionStorage.getItem('token')
      }
      return token
    },
    getSideBar: (state) => {
      let sidebarStatus = state.sidebarStatus
      if (!sidebarStatus) {
        sidebarStatus = sessionStorage.getItem('sidebarStatus')
      }
      return sidebarStatus
    }
  },
  mutations: {
    setUserInfo (state, userName) {
      state.userName = userName
      sessionStorage.setItem('userName', userName)
    },
    setToken (state, token) {
      state.userName = token
      sessionStorage.setItem('token', token)
    },
    ToggleSideBar: (state, data) => {
      sessionStorage.setItem('sidebarStatus', data)
    }
  },
  actions: {}
})
