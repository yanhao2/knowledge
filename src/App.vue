<template>
  <div id="app" ref="app">
    <router-view/>
  </div>
</template>
<script>
  import Keycloak from 'keycloak-js'
  import router from './router'
  export default {
    name: 'app',
    data () {
      return {
      }
    },
    computed: {
      clientId () {
        return this.$store.state.clientId
      },
      routerUrl () {
        return this.$route
      }
    },
    methods: {
      LoadData () {
        let token = sessionStorage.getItem('token')
        if (!token) {
          this.getKeycloak()
          console.log(1111)
        } else {
          this.getKeycloak()
          console.log(2222)
        }

      },
      getKeycloak () {
        let keycloaks = null
        let _this = this
        keycloaks = Keycloak({
          url: 'http://u.xlmediawatch.com/auth',
          realm: 'xlplatform',
          clientId: _this.clientId,
        })
        keycloaks.init({ onLoad: 'login-required' }).success(
          function (authenticated) {
            console.log('authenticated====App', authenticated)
            if (!authenticated) {
              sessionStorage.clear()
              keycloaks.logout();
            } else {
              keycloaks.loadUserProfile().success(data => {
                let username = data.firstName + data.lastName
                sessionStorage.setItem('userName', username)
                sessionStorage.setItem('token', keycloaks.token)
                let path = _this.$route.path
                console.log(_this.$route.path)
                if (path === '/')
                router.push({path: '/'})
              })
            }
        }).error(function () {
            alert('初始化失败')
        })
      }
    },
    created () {
      // this.LoadData();
    },
    mounted () {

    },
    updated () {
    }
  }
</script>

<style lang="scss">
*{
  font-family: PingFang SC,Lantinghei SC,Lucida Grande,Microsoft YaHei,FreeSans,WenQuanYi Micro Hei,Hiragino Sans GB,Hiragino Sans GB W3,SimSun,sans-serif,tahoma,arial
}
#app, body, html{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
</style>
