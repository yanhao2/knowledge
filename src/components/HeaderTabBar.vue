<template>
    <div>
        <el-header style="height: 50px;">
            <div class="rows center">
                <div class="cols title" style="margin-left: 30px;">
                </div>
                <div class="rows center">
<!--                    <div style="cursor: pointer;position: relative;margin-right: 50px;margin-top: 2px;" @click="changePoint">-->
<!--                        <i class="el-icon-bell" style="color: #ffffff;font-size: 16px;font-weight: 900"></i>-->
<!--                        <span class="btn-bell-badge" v-show="point"></span>-->
<!--                    </div>-->
                    <el-dropdown class="avatar-container" trigger="click">
                        <div class="avatar-wrapper" style="cursor: pointer;">
                            <span style="line-height: 40px;font-size: 14px">{{userName}}</span>
                            <i class="el-icon-caret-bottom" style="line-height: 40px"/>
                        </div>
                        <el-dropdown-menu slot="dropdown" class="user-dropdown">
<!--                            <router-link to="/example">-->
<!--                                <el-dropdown-item>-->
<!--                                    设置中心-->
<!--                                </el-dropdown-item>-->
<!--                            </router-link>-->
<!--                            <router-link to="/condition">-->
<!--                                <el-dropdown-item>-->
<!--                                    查询收藏-->
<!--                                </el-dropdown-item>-->
<!--                            </router-link>-->
<!--                            <router-link to="/creatCondition">-->
<!--                                <el-dropdown-item>-->
<!--                                    操作收藏-->
<!--                                </el-dropdown-item>-->
<!--                            </router-link>-->
                            <el-dropdown-item divided>
                                <span style="display:block;" @click="logout">退出登陆</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-header>
        <div style="padding: 10px;background-color: #f5f5f5">
            <router-view/>
        </div>

    </div>

</template>

<script>
  import Keycloak from 'keycloak-js'
  export default {
    data () {
      return {
        point: true
      }
    },
    computed: {
      userName () {
        return this.$store.getters.getUserInfo
      },
      clientId () {
        return this.$store.state.clientId
      }
    },
    methods: {
      changePoint () {
        this.point = !this.point
      },
      logout () {
        let _this = this
        let keycloaks = null
        keycloaks = Keycloak({
          url: 'http://u.xlmediawatch.com/auth',
          realm: 'xlplatform',
          clientId: _this.clientId,
        })
        keycloaks.init({ onLoad: 'login-required' }).success(
          function (authenticated) {
            sessionStorage.clear()
            keycloaks.logout();
            console.log('退出登录')
          }).error(function () {
          alert('初始化失败')
        })
        this.$router.go(0)
      }
    },
    created () {
    }
  }
</script>

<style scoped>

</style>
