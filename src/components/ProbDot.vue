<template>
<router-link
  :to="`/problem/${item.getNum()}`"
  :class="`ui ${item.getColor()} label`"
  id="probdot">
  <i class="coffee icon" v-if="item.getTrans().length > 0"></i>{{ probNum }}
</router-link>
</template>

<script>
import _ from 'lodash'
import uHunt from '../scripts/uhunt'

export default {
  name: 'prob-dot',
  props: [ 'item' ],
  computed: {
    probNum() {
      return _.padStart(uHunt.util.getNum(this.item) % 100, 2, '0')
    }
  }
}
</script>