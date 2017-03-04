import _ from 'lodash'
import $ from 'jquery'
import yaml from 'js-yaml'
import moment from 'moment'

/**
 *  configs
 */
const config = {
  data: './static/uva.data'
}

/**
 *  [0] => state name
 *  [1] => brief state name
 *  [2] => position in problem API
 *  [3] => verdict ID
 *  [4] => color
 */
const _state_info = [
  ['Accepted',              'AC',  18, 90, 'green' ],
  ['Presentation Error',    'PE',  17, 80, 'olive' ],
  ['Wrong Answer',          'WA',  16, 70, 'red'   ],
  ['Compilation Error',     'CE',  10, 30, 'yellow'],
  ['Runtime Error',         'RE',  12, 40, 'teal'  ],
  ['Time Limit Exceeded',   'TLE', 14, 50, 'blue'  ],
  ['Output Limit Exceeded', 'OLE', 13, 45, 'purple'],
  ['Memory Limit Exceeded', 'MLE', 15, 60, 'violet'],
  ['Restricted Function',   'RF',  11, 35, 'pink'  ],
  ['Submission Error',      'SE',  7,  10, 'black' ],
  ['Can\'t be Judged',      'NJ',  8,  15, 'brown' ],
  ['In Queue',              'InQ', 9,  20, 'gray'  ]
]
const _rev_verdict = _.keyBy(_state_info, info => info[3])
const _lang_list   = [undefined, 'ANSI C', 'Java', 'C++', 'Pascal', 'C++11']

class Submission {
  constructor(sub) {
    this.data = sub || []
    this.info = _rev_verdict[this.getVer()] || []
  }
  getData()       { return this.data }
  getId()         { return this.data[0] }
  getProbId()     { return this.data[1] }
  getVer()        { return this.data[2] }
  getRuntime()    { return this.data[3] }
  getTime()       { return moment.unix(this.data[4]) }
  getLang()       { return _lang_list[this.data[5]] || 'unknown' }
  getRank()       { return this.data[6] }
  getFullStatus() { return this.info[0] || 'unknown' }
  getStatus()     { return this.info[1] || 'unknown' }
  getColor()      { return this.info[4] || 'basic' }
}

const noneSub = new Submission(Array(6))

class Problem {
  constructor(id, prob) {
    this.id   = id
    this.prob = prob
    this.info = []
  }
  registerSubmissions(subs) {
    this.subs = subs
    // find first state that # of submission is NOT zero
    const compare = _.countBy(subs, sub => sub.getVer())
    this.info = _
      .chain(_state_info)
      .find(state => compare[ state[3] ])
      .value()
    return this
  }
  getData()       { return this.prob }
  getId()         { return this.prob[0] }
  getNum()        { return this.prob[1] }
  getHeader()     { return this.prob[2] }
  getIdNum()      { return this.prob.slice(0, 2) }
  getSubs()       { return this.subs }
  getSubsProbId() { return _.map(this.subs, sub => sub.getProbId()) }
  getSubsVer()    { return _.map(this.subs, sub => sub.getVer()) }
  getColor()      { return this.info[4] || 'basic' }
  getTrans()      { return this.trans || [] }
  getStats() {
    const p = this
    return _state_info.map(stat => {
      return {
        label: stat[1],
        color: stat[4],
        count: p.prob[ stat[2] ]
      }
    })
  }
}

class Util {
  static getId(obj)     { return obj.prob[0] }
  static getNum(obj)    { return obj.prob[1] }
  static getHeader(obj) { return obj.prob[2] }
  static getIdNum(obj)  { return obj.prob.slice(0, 2) }
}

/**
 *  ajax helpers
 */

const uvaAPI = endpoint => $
  .getJSON(`http://uhunt.felix-halim.net/api${endpoint}`)

const getYaml = path_to_file => $
  .get(path_to_file)
  .then(data => yaml.load(data))

export default {
  util:   Util,
  config: config,
  '$': {
    uva:     uvaAPI,
    getYaml: getYaml
  },
  Submission: Submission,
  Problem:    Problem
}