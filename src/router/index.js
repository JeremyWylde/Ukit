import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'cats',
    component: ()=> import('../views/ListOfCats')
  },
  {
    path: '/cat',
    name: 'cat',
    component: ()=> import('../views/Cat')
  },
  {
    path: '/cat/:id',
    name: 'editCat',
    component: ()=> import('../views/Cat')
  },
/*  {
    path: '/cats',
    name: 'cats',
    component: ()=> import('../views/ListOfCats')
  },*/
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
