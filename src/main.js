// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue       from 'vue'
import VueRouter from 'vue-router'
import App       from './App'

Vue.use(VueRouter)

const routes = require('./routes')

const router = new VueRouter({
  routes
})

const app = new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
