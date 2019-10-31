import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import axios from 'axios'
import Keycloak from 'keycloak-js'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '/',
        component: () => import('../views/Media.vue')
      },
      {
        path: '/index',
        component: () => import('../views/Media.vue')
      },
      {
        path: '/mediaEdit',
        component: () => import('../components/MediaEdit.vue')
      },
      {
        path: '/emotional',
        component: () => import('../views/Emotional.vue')
      },
    ]
  }
]

const router = new VueRouter({
  routes
})


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router







