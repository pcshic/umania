<template>
<router-link :to="`/problem/${num}`" id="probdot" :class="`ui ${color} circular label`">{{ num % 100 | leftpad }}</router-link>
</template>

<script>
const setting = require('../submission')

let verdict = {}
setting.forEach((state, i) => {
  verdict[ state[3] ] = i
})

export default {
  name: 'prob-dot',
  props: [ 'num', 'subs' ],
  computed: {
    color() {
      let app = this
      let res = 'basic'
      if (typeof app.subs === 'undefined')
        return res
      let final = app.subs
        .map(sub => verdict[ sub[2] ])
        .reduce((a, b) => Math.min(a, b), setting.length)
      if (final !== setting.length) {
        res = setting[final][4]
      }
      return res
    }
  },
  filters: {
    leftpad(val) {
      if (val < 10)
        return '0' + val
      return val
    }
  }
}
</script>