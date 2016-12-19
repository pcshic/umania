<template>
<section id="index" class="ui stackable doubling four column grid">
  <article v-for="vol in volumes.list" class="column">
    <h2 class="ui top attached header">Volume {{ vol }}</h2>
    <div class="ui bottom attached segment">
      <prob-dot
        v-for="prob in volumes.data[vol]"
        :pid="prob[0]"
        :subs="submissions.data[ prob[0] ]"
        :num="prob[1]">
      </prob-dot>
    </div>
  </article>
</section>
</template>

<script>
import ProbDot from './ProbDot'

export default {
  name: 'index',
  props: [ 'volumes', 'submissions' ],
  components: {
    ProbDot
  },
  methods: {
    rowGrouping(vol, n) {
      let app  = this
      let data = app.volumes.data[vol]
      return [...Array(data.length).keys()]
        .filter(x => x % n == 0)
        .map(x => data.slice(x, x + n))
    }
  }
}
</script>