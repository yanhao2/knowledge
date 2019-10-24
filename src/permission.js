import router from './router'
import Keycloak from 'keycloak-js'

router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('token')
  if (!token) {
    /*
   * 判断有没有token
   * 如果没有token这边跳转登录
   * */
    let keycloaks = null
    keycloaks = Keycloak({
      url: 'http://u.xlmediawatch.com/auth',
      realm: 'xlplatform',
      clientId: 'manager_yanhao'
    })
    keycloaks.init({ onLoad: 'login-required' }).success(
      function (authenticated) {
        if (!authenticated) {
          sessionStorage.clear()
          keycloaks.logout();
        } else {
          keycloaks.loadUserProfile().success(data => {
            let username = data.firstName + data.lastName
            sessionStorage.setItem('userName', username)
            sessionStorage.setItem('token', keycloaks.token)
            next({path: '/index'})
          })
        }
      }).error(function () {
      alert('初始化失败')
    })
  } else {
    next()
      /*
      * 如果token已经过期了
      * 跳转登录
      * */
  }
})
