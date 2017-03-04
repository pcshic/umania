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
import yaml from 'js-yaml'
import uHunt from './scripts/uhunt'

window._ = _
window.$ = window.jQuery = $

window.uhunt = uHunt
window.yaml  = yaml

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
        submission: [],
        translate:  {}
      }
    }
  },
  created() {
    const app = this
    // user data
    if (localStorage.username !== 'undefined')
      app.username = localStorage.username
    /**
     *  Initialize data
     */
    // get problems
    uHunt.$
      .uva('/p')
      .then(data => { app.asset.problem = data })
    // get translate data
    uHunt.$
      .getYaml(`${uHunt.config.data}/translate/translate.yml`)
      .then(data => { app.asset.translate = data })
  },
  computed: {
    store() {
      const app   = this
      const asset = app.asset
      /**
       *  Set up Problem data
       *    Wrap Problem instance
       */
      let data = _.map(
        asset.problem,
        (data, i) => new uHunt.Problem(i, data))
      if (data.length > 0) {
        /**
         *  Combine data: submission data
         */
        data = _
          .chain(data)
          // 1. indexed by UVa problem ID
          .keyBy(prob => prob.getId())
          // 2. _.mergeWith will merge data with identical key
          .mergeWith(
            // 2.1. wrap Submission instance & sort
            _.chain(asset.submission)
              .map(data => new uHunt.Submission(data))
              .groupBy(sub => sub.getProbId())
              .mapValues(subs => subs.sort((a, b) => b.getId() - a.getId()))
              .value(),
            // 2.2. merge result
            (target, source) => target.registerSubmissions(source))
          // 3. We don't need keys
          .values()
          // 4. Final result
          .value()
        /*
          Combine data: translate data
        */
        data = _
          .chain(data)
          .keyBy(prob => uHunt.util.getNum(prob))
          .mergeWith(
            _.chain(asset.translate)
              .flatMap((judge, key) =>
                _.map(judge.trans, (link, i) => {
                  return {
                    num: _.isArray(judge.trans) ? link : i,
                    type: key,
                    link: judge.site + link
                  }
                })
              )
              .groupBy(trans => trans.num)
              .value(),
            (target, source) => _.assign(target, { trans: source }) )
          .values()
          .value()
      }
      window.console.log('data', data)
      /**
       *  category
       */
      let _uidnum = _.chain(data).map(it => uHunt.util.getIdNum(it))
      const category = {
        id:     _.keyBy(data, it => uHunt.util.getId(it)),
        num:    _.keyBy(data, it => uHunt.util.getNum(it)),
        volume: _.groupBy(data, it => Math.floor(uHunt.util.getNum(it) / 100)),
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
      uHunt.$
        .uva(`/uname2uid/${app.username}`)
        .then(id => { app.userid = id })
    },
    userid(newUserid) {
      if (newUserid === 0)
        return
      let app = this
      uHunt.$
        .uva(`/subs-user/${app.userid}`)
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
