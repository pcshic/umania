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
        :store="store"
        :userid="userid">
      </router-view>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import $ from 'jquery'
import uHunt from './scripts/uhunt'

window._ = _
window.$ = window.jQuery = $

require('semantic-ui-css/semantic.css')
require('semantic-ui-css/semantic.js')

export default {
  name: 'app',
  data() {
    return {
      username: undefined,
      userid: 0,
      user: {
        subs: []
      },
      asset: {
        problem:    [],
        submission: []
      }
    }
  },
  created() {
    let app = this
    // user data
    if (localStorage.username !== 'undefined')
      app.username = localStorage.username
    // get problems
    uHunt.uva('/p')
      .then(data => { app.asset.problem = data })
  },
  computed: {
    store() {
      const app   = this
      const asset = app.asset
      /*
        Combine data
          problem & submission data
      */
      const data = _
        // problem data
        //   1. we index by UVa problem ID
        .chain(
          _.chain(asset.problem)
            // 1.1. wrap Submission instance
            .map((data, i) => new uHunt.Problem(i, data))
            .keyBy(prob => prob.getId()) // key by problem id
            .value())
        // submission data
        //   2. _.mergeWith will merge with identical key
        .mergeWith(
          _.chain(asset.submission)
            // 2.1. wrap Submission instance
            .map(data => new uHunt.Submission(data))
            .groupBy(sub => sub.getProbId()) // group by problem id
            .mapValues(subs => subs.sort((a, b) => b.getId() - a.getId()))
            .value(),
          // 2.2. merge result
          (target, source) => target.registerSubmissions(source)
        )
        // 3. We don't need keys
        .values()
        // 4. Final result
        .value()
      /*
        category
      */
      let _uidnum = _.chain(data).map(it => it.getIdNum())
      const category = {
        id:     _.keyBy(data, it => it.getId()),
        num:    _.keyBy(data, it => it.getNum()),
        volume: _.groupBy(data, it => Math.floor(it.getNum() / 100)),
        id2num: _uidnum.fromPairs().value(),
        num2id: _uidnum.reverse().fromPairs().value()
      }
      return {
        data: data,
        category: category
      }
    }
  },
  watch: {
    username(newUsername) {
      let app = this
      if (typeof newUsername === 'undefined') {
        app.userid = 0
        return
      }
      uHunt.uva('/uname2uid/' + app.username)
        .then(id => { app.userid = id })
    },
    userid(newUserid) {
      if (newUserid === 0)
        return
      let app = this
      uHunt.uva('/subs-user/' + app.userid)
        .then(data => {
          app.user = data
          app.asset.submission = data.subs
        })
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
