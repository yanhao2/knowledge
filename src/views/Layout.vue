<template>
    <div class="Layout" style="display: flex">
        <el-container style="height: calc(100%)">
            <el-aside :style="{'width': isActive ? '200px' : '54px'}" class="scrollbar">
                <div style="padding-top: 10px;text-align: center">
                    <img src="../assets/normaoLogo.png" alt="" style="height: 40px;">
                </div>
                <div class="toggleOpend" :style="{'justify-content': isActive ? 'center' : 'center', }">
                    <svg
                            :class="{ 'is-active': isActive}"
                            class="hamburger"
                            viewBox="0 0 1024 1024"
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="64"
                            @click="toggleClick">
                        <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z" fill="#ffffff"/>
                    </svg>
                </div>
                <div class="menu">
                  <el-menu
                    :collapse="!isActive"
                    :default-active="String($route.path)"
                    router
                    class="el-menu-vertical-demo"
                    @select="handleSelect" v-for="( item, i ) in routers" :key="i">
                    <el-menu-item :index="String(item.path)" v-if="item.children.length === 0">
                      <i class="el-icon-menu"></i>
                      <span slot="title">{{item.title}}</span>
                    </el-menu-item>
                    <el-submenu :index="String(item.path)"  v-else v-for="(items, index) in item.children" :key="index">
                      <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item.title}}</span>
                      </template>
                      <el-menu-item :index="String(items.path)">
                        <span style="padding-left: 10px">{{items.title}}</span>
                      </el-menu-item>
                    </el-submenu>
                  </el-menu>
                </div>
            </el-aside>
            <HeaderTabBar :isActive="isActive" :style="{'width': isActive ? 'calc(100% - 200px)' : 'calc(100% - 54px)'}"/>
        </el-container>
    </div>
</template>
<script>
  import HeaderTabBar from '../components/HeaderTabBar' // 头部TabBar
  // import Item from '../components/Item'
  export default {
    components: {
      HeaderTabBar
    },
    data () {
      return {
        point: true,
        userInfo: '',
        isActive: false,
        windows: window.innerWidth,
        activeIndex: '/',
        routers: [
          { title: '自媒体', icon: 'el-icon-help', path: '/' , children: []},
          {
            title: '词典管理',
            icon: 'el-icon-help',
            children: [
              {
                title: '情感词库',
                path: '/emotional',
                children: []
              }
            ]
          },
        ]
      }
    },
    computed: {
      sidebar () {
        return this.$store.getters.getSideBar
      },
      routerUrl () {
        return this.$route.path
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        this.activeIndex = key
      },
      toggleClick () {
        this.isActive = !this.isActive
        this.$store.commit('ToggleSideBar', this.isActive)
      },
      onActive () {
        let activeIndex = localStorage.getItem('activeIndex')
        if (!activeIndex) {
          localStorage.setItem('activeIndex', 0)
          this.activeIndex = Number(activeIndex)
        } else {
          this.activeIndex = Number(activeIndex)
        }
        this.isActive = this.sidebar
      },
      // 路由跳转
      onClickRouter (record, index) {
        this.activeIndex = index
        localStorage.setItem('activeIndex', this.activeIndex)
        this.$router.push({ path: record.path })
      }
    },
    mounted () {
      const that = this
      if (window.innerWidth < 1200) {
        that.isActive = false
        that.$store.commit('ToggleSideBar', this.isActive)
      } else {
        that.isActive = true
        that.$store.commit('ToggleSideBar', this.isActive)
      }
    },
    created () {
      this.onActive()
    }
  }
</script>
<style lang="scss">
    @import "../css/reset.css";
    .Layout, .el-container{
        width: 100%;
        height: 100%;


        .el-header {
            background: #fff;
        }
        .el-aside, .el-menu{
            background: #20222a;
        }
        .center{
            align-items: center;
            height: 100%;
        }
        .btn-bell-badge {
            position: absolute;
            right: -3px;
            top: -5px;
            width: 6px;
            height: 6px;
            border-radius: 4px;
            background: #f56c6c;
            color: #fff;
        }
        .hamburger{
            display: inline-block;
            cursor: pointer;
            width: 20px;
            height: 20px;
        }
        .hamburger.is-active {
            -webkit-transform: rotate(180deg);
            transform: rotate(180deg);
        }
        .toggleOpend{
            height: 50px;
            background: #20222a;
            cursor: pointer;
            display: flex;
            align-items: center;
        }
        .menu{
            height: calc(100% - 106px);
            .menuUl {
                .menuLi {
                    display: flex;
                    align-items: center;
                    height: 50px;
                    padding-left: 20px;
                    color: #fff;
                    i {
                        font-size: 15px;
                        font-weight: 500;
                    }
                    .text{
                        padding-left: 15px;
                        font-size: 14px;
                    }
                }
                .children{
                  .text{
                    padding-left: 40px;
                  }
                }
                .is-active {
                    background-color: #0077CB;
                }
                li{
                    cursor: pointer;
                }
                .menuLi:hover{
                    background-color: #0077CB;
                }
            }
        }
        .el-menu-item, .el-menu-item i, .el-submenu__title, .el-submenu__title i{
          color: #fff;
        }
        .el-menu-item:focus, .el-menu-item:hover, .el-submenu__title:hover {
          background-color: #0077CB;
        }
        .el-menu-item.is-active{
          background-color: #0077CB;
        }

        .ivu-menu-light{
          background: #20222a;
        }
        .ivu-menu{
          color: #fff;
        }
        .el-menu--collapse{
            width: 54px;
        }
        .el-menu{
            border-right: 0px;
        }
        .el-menu-item{
            padding: 0;
            display: flex;
            align-items: center;
        }
        .el-tooltip{
            padding: 0!important;
        }
        .el-menu--collapse{
          .el-submenu__title {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .el-menu-item, .el-tooltip {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            .el-icon-menu{
              margin-left: 12px;
            }
          }
        }
    }
</style>
