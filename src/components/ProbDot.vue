<template>
<router-link
  :to="`/problem/${item.getNum()}`"
  :class="`ui ${item.getColor()} circular label`"
  id="probdot">{{ probNum }}</router-link>
</template>

<script>
import _ from 'lodash'
import uHunt from '../scripts/uhunt'

export default {
  name: 'prob-dot',
  props: [ 'item' ],
  computed: {
    probNum() {
      return _.padStart(this.item.getNum() % 100, 2, '0')
    }
  }
}
</script>