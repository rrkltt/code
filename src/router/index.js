import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/users/users.vue'
import roles from '../components/roles/role.vue'
import rights from '../components/roles/rights.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    redirect: 'login',
  },
  {
    path: '/home',
    redirect: '/welcome',
    component: home,
    children: [
      {path: '/welcome',component: welcome},
      {path: '/users',component: users},
      {path:'/roles',component: roles},
      {path:'/rights',component: rights},
    ],
  }

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  if (to.path === '/login') return next();
  let tokenlogin = window.sessionStorage.getItem('token');
  if (tokenlogin) return next();
  next('/login')
})

export default router
