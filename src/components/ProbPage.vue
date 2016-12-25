<template>
<section id="probpage">
  <header class="ui huge header">
    <div class="content">
      UVa {{ $route.params.num }}
      <div class="sub header" v-if="problem">{{ problem.getHeader() }}</div>
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
  <article v-if="problem" class="ui statistics">
    <div v-for="stat in stats" :class="`${stat.color} statistic`">
      <div class="value">{{ stat.count }}</div>
      <div class="label">{{ stat.label }}</div>
    </div>
  </article>
</section>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import uHunt from '../scripts/uhunt'

window.Moment = moment

export default {
  name: 'prob-name',
  props: [ 'store', 'userid' ],
  data() {
    return {
      setting: uHunt
    }
  },
  computed: {
    problem() {
      const app = this
      return app.store.category.num[ app.$route.params.num ]
    },
    subs() {
      const app = this
      const id  = app.problem.getId()
      return _
        .chain(app.problem.getSubs())
        .map(sub => {
          return {
            status:  sub.getStatus(),
            color:   sub.getColor(),
            runtime: sub.getRuntime(),
            time:    sub.getTime().format('YYYY/MM/DD HH:mm:ss'),
            lang:    sub.getLang(),
            rank:    sub.getRank()
          }
        })
        .value()
    },
    stats() {
      let app = this
      return app.problem.getStats()
    }
  },
  methods: {
    moment: moment
  }
}
</script>