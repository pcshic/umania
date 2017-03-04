import Vue       from 'vue'
import VueRouter from 'vue-router'

import App       from './App'
import routes    from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

const app = new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
