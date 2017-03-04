<template>
<section id="index" class="ui stackable doubling two column grid">
  <article v-for="(items, vol) in volumes" class="column">
    <header class="ui top attached segment"><h2 class="header">Volume {{ vol }}</h2></header>
    <div class="ui bottom attached segment circular labels">
      <prob-dot v-for="item in items" :item="item"></prob-dot>
    </div>
  </article>
</section>
</template>

<script>
import _ from 'lodash'
import ProbDot from './ProbDot'

export default {
  name: 'index',
  props: [ 'store' ],
  components: {
    ProbDot
  },
  computed: {
    volumes() {
      return this.store.category.volume
    }
  }
}
</script>