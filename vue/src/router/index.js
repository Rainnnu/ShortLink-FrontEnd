import Vue from 'vue'
import VueRouter from 'vue-router'
import CreateShortLink from '../views/CreateShortLink.vue'
import Layout from "@/views/Layout.vue";
import LinkDetail from "@/views/LinkDetail.vue";
import ShortLinkList from "@/views/ShortLinkList.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect:'/create',

    children:[
      {
        path: '/create',
        name: 'CreateShortLink',
        component: CreateShortLink,
      },
      {
        path: '/list',
        name: 'ShortLinkList',
        component: ShortLinkList,
      },
      {
        path: '/detail',
        name: 'LinkDetail',
        component: LinkDetail,
      }
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
