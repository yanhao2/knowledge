<template>
    <div>
        <el-header style="height: 50px;">
            <div class="rows center">
                <div class="cols title" style="margin-left: 30px;">
                </div>
                <div class="rows center">
                    <el-dropdown class="avatar-container" trigger="click">
                        <div class="avatar-wrapper" style="cursor: pointer;">
                            <span style="line-height: 40px;font-size: 14px">{{userName}}</span>
                            <i class="el-icon-caret-bottom" style="line-height: 40px"/>
                        </div>
                        <el-dropdown-menu slot="dropdown" class="user-dropdown">
                            <el-dropdown-item divided>
                                <span style="display:block;" @click="logout">退出登陆</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-header>
        <div :style="{padding: '10px', 'backgroundColor': '#f5f5f5', height: 'calc(100vh - 50px)', overflow: 'auto'}" class="bodyContent">
            <router-view :isActive="isActive"/>
        </div>

    </div>

</template>

<script>
  import Cookies from "js-cookie"
  export default {
    props: ['isActive'],
    data () {
      return {
        point: true
      }
    },
    computed: {
      userName () {
        return Cookies.get("userInfo");
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
        console.log('退出登陆')
        console.log(this.$router)
        Cookies.set("logout", "1");
        this.$router.push({path: '/index'});
      }
    },
    created () {
    }
  }
</script>

<style scoped>

</style>
