import router from './router'
import store from './store'
import Keycloak from 'keycloak-js'
import Cookies from 'js-cookie'
import api from './api/api'

router.beforeEach((to, from, next) => {
  //http://u.xlmediawatch.com/auth/protocol/openid-connect/userinfo
  if (Cookies.get("permission") == undefined || Cookies.get("permission") == ''
    || Cookies.get("logout") == '1') {

    let keycloak = null;
    keycloak = Keycloak({
      url: 'http://u.xlmediawatch.com/auth',
      realm: 'xlplatform',
      clientId: store.state.clientId
    });

    keycloak.init({ onLoad: 'login-required' }).success(function (authenticated) {
      if (!authenticated) {
        alert('登陆失败')
      } else {
        if (Cookies.get("logout") == '1') {
          Cookies.set('logout', '');
          Cookies.set('permission', '');
          //退出系统
          keycloak.logout();
        }
        else {
          //登陆成功
          keycloak.loadUserProfile().success(data => {
            let username = data.firstName + data.lastName
            Cookies.set("userInfo", username)
            Cookies.set('permission', keycloak.token)
            next({ path: "/" })
          })
        }
      }
    }).error(function () {
      alert('认证中心异常');
    });
  } else {
    LoadMediaIndustryList(next)
  }
})
// 行业 接口
async function LoadMediaIndustryList (next) {
  try {
    let record = {
      pageNum: 1,
      pageSize: 50,
      tableName: 'dic_industry',
      isDeleteFlag: true,
      pid: 0,
    }
    let data = await api.MediaIndustryList(record)
    if (data.code === 200) {
      next()
    } else {
      let keycloak = null;
      keycloak = Keycloak({
        url: 'http://u.xlmediawatch.com/auth',
        realm: 'xlplatform',
        clientId: store.state.clientId
      });

      keycloak.init({ onLoad: 'login-required' }).success(function (authenticated) {
        if (!authenticated) {
          alert('登陆失败')
        } else {
          if (Cookies.get("logout") == '1') {
            Cookies.set('logout', '');
            Cookies.set('permission', '');
            //退出系统
            keycloak.logout();
          }
          else {
            //登陆成功
            keycloak.loadUserProfile().success(data => {
              let username = data.firstName + data.lastName
              Cookies.set("userInfo", username)
              Cookies.set('permission', keycloak.token)
              next({ path: "/" })
            })
          }
        }
      }).error(function () {
        alert('认证中心异常');
      });
    }
  }
  catch (e) {
    console.log(e)
  }
}

