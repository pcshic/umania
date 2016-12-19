<template>
  <div id="app" class="ui centered grid">
    <nav class="ui top fixed labeled icon menu">
      <router-link to="/" class="item">
        <i class="home icon"></i>
        主頁
      </router-link>
      <div class="right menu">
      <div class="item">
        <div class="ui transparent icon input">
          <input type="text" v-model="username">
          <i class="user icon"></i>
        </div>
      </div>
      </div>
    </nav>
    <div id="content" class="fourteen wide column">
      <router-view
        :userid="userid"
        :mapper="mapper"
        :volumes="volumes"
        :submissions="submissions">
      </router-view>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

window.$ = window.jQuery = $
require('semantic-ui-css/semantic.css')
require('semantic-ui-css/semantic.js')

class UVa {
  static endpoint(ep) {
    const domain = 'http://uhunt.felix-halim.net/api'
    return $.getJSON(domain + ep)
  }
}

Array.prototype.unique = function() {
  return this.reduce((uni, item) => {
    if ( !uni.some(uItem => item === uItem) )
      uni.push(item)
    return uni
  }, [])
}

const categorizer = (arr, keyMapper) => {
  let res = {}
  // gen key list
  res.list = arr.map(keyMapper).unique().sort((a, b) => a - b)
  // initialize data
  res.data = {}
  res.list.forEach(key => {
    res.data[key] = []
  })
  // categorize
  arr.forEach(item => {
    res.data[keyMapper(item)].push(item)
  })
  // return
  return res
}

export default {
  name: 'app',
  data() {
    return {
      username: undefined,
      userid: 0,
      user: {
        subs: []
      },
      problems: []
    }
  },
  created() {
    let app = this
    // user data
    if (localStorage.username !== 'undefined')
      app.username = localStorage.username
    // get problems
    UVa.endpoint('/p')
      .then(data => { app.problems = data })
  },
  computed: {
    volumes() {
      let app = this
      return categorizer(app.problems, it => Math.floor(it[1] / 100))
    },
    submissions() {
      let app = this
      return categorizer(app.user.subs, it => it[1])
    },
    mapper() {
      let res = {
        id: {},
        num: {}
      }
      let app = this
      app.problems.forEach(item => {
        res.id[ item[0] ]  = item
        res.num[ item[1] ] = item
      })
      return res
    }
  },
  watch: {
    username(newUsername) {
      let app = this
      if (typeof newUsername === 'undefined') {
        app.userid = 0
        return
      }
      UVa.endpoint('/uname2uid/' + app.username)
        .then(id => { app.userid = id })
    },
    userid(newUserid) {
      if (newUserid === 0)
        return
      let app = this
      UVa.endpoint('/subs-user/' + app.userid)
        .then(data => { app.user = data })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif, '微軟正黑體', '標楷體';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 8rem;
}
</style>
