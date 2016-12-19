<template>
<section id="probpage">
  <header class="ui huge header">
    <div class="content">
      UVa {{ $route.params.num }}
      <div class="sub header" v-if="prob">{{ prob[2] }}</div>
    </div>
  </header>
  <h3 v-if="userid" class="ui header">
    <i class="user icon"></i>
    <div class="content">
      使用者狀態
      <div class="sub header">User Status</div>
    </div>
  </h3>
  <article v-if="userid">
    <div v-if="subs.length > 0" class="ui stackable doubling six column grid">
      <div v-for="sub in subs" class="column">
      <section class="ui segment">
        <div :class="`ui ${sub.color} statistic`">
          <div class="value">{{ sub.status }}</div>
        </div>
        <div class="ui list">
          <div class="item" v-if="sub.rank > 0">
            <i class="star icon"></i>
            <div class="content">{{ sub.rank }}</div>
          </div>
          <div class="item">
            <i class="hourglass full icon"></i>
            <div class="content">{{ sub.runtime }} ms</div>
          </div>
          <div class="item">
            <i class="code icon"></i>
            <div class="content">{{ sub.lang }}</div>
          </div>
          <div class="item">
            <i class="time icon"></i>
            <div class="content">{{ sub.time }}</div>
          </div>
        </div>
      </section>
      </div>
    </div>
    <div v-else>
      <div class="column">沒有上傳紀錄。</div>
    </div>
  </article>
  <h3 class="ui header">
    <i class="bar chart icon"></i>
    <div class="content">
      統計<div class="sub header">Statistics</div>
    </div>
  </h3>
  <article v-if="prob" class="ui statistics">
    <div v-for="stat in stats" :class="`${stat.color} statistic`">
      <div class="value">{{ stat.count }}</div>
      <div class="label">{{ stat.label }}</div>
    </div>
  </article>
</section>
</template>

<script>
import moment from 'moment'

window.Moment = moment

const setting = require('../submission')

let verdict = {}
setting.forEach((state, i) => {
  verdict[ state[3] ] = i
})

const language = ['', 'ANSI C', 'Java', 'C++', 'Pascal', 'C++11']

export default {
  name: 'prob-name',
  props: [ 'userid', 'mapper', 'submissions' ],
  data() {
    return {
      setting: setting,
      verdict: verdict
    }
  },
  computed: {
    prob() {
      let app = this
      return app.mapper.num[ app.$route.params.num ]
    },
    subs() {
      let app = this
      const id = app.prob[0]
      return (app.submissions.data[id] || [])
        .sort((a, b) => b[4] - a[4])
        .map(sub => {
          return {
            status: setting[ verdict[sub[2]] ][1],
            color:  setting[ verdict[sub[2]] ][4],
            runtime: sub[3],
            time:   moment.unix(sub[4]).format('YYYY/MM/DD HH:mm:ss'),
            lang:   language[ sub[5] ],
            rank:   sub[6]
          }
        })
    },
    stats() {
      let app = this
      return setting.map(stat => {
        return {
          color: stat[4],
          count: app.prob[ stat[2] ],
          label: stat[1]
        }
      })
    }
  },
  methods: {
    moment: moment
  }
}
</script>