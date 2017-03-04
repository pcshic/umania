<template>
<section id="probpage">
  <header class="ui huge header">
    <div class="content">
      UVa {{ $route.params.num }}
      <div class="sub header" v-if="problem">{{ setting.util.getHeader(problem) }}</div>
    </div>
  </header>
  <h3 v-if="trans.length > 0" class="ui header">
    <i class="coffee icon"></i>
    <div class="content">
      翻譯
      <div class="sub header">Translates</div>
    </div>
  </h3>
  <article v-if="trans.length > 0">
    <a class="ui primary button"
      target="_blank"
      v-for="tran in trans"
      :href="tran.link">{{ tran.type }}</a>
  </article>
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
          <div v-if="sub.rank > 0" class="item">
            <i class="star icon"></i>
            <div class="content">{{ sub.rank }}</div>
          </div>
          <div v-for="other in sub.others" class="item">
            <i :class="`${other[0]} icon`"></i>
            <div class="content">{{ other[1] }}</div>
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
      const id  = uHunt.util.getId(app.problem)
      return _
        .chain(app.problem.getSubs())
        .map(sub => {
          return {
            status:  sub.getStatus(),
            color:   sub.getColor(),
            rank:    sub.getRank(),
            others: [
              ['hourglass full', sub.getRuntime() + ' ms'                    ],
              ['code',           sub.getLang()                               ],
              ['time',           sub.getTime().format('YYYY/MM/DD HH:mm:ss') ]
            ]
          }
        })
        .value()
    },
    stats() {
      const app = this
      return app.problem.getStats()
    },
    trans() {
      const app = this
      return app.problem.getTrans()
    }
  }
}
</script>