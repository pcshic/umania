var UManiaApp = React.createClass({
  getInitialState: function() {
    return {
      title: 'uMania',
      probs: null,
      prob_categories: null,
      practice_categories: null
    }
  },
  addUVaObject: function(obj, prob) {
    obj.config.main = 'uva';
    obj.judges.uva  = new JudgeObject();
    // judges
    obj.judges.uva.id    = prob[0];
    obj.judges.uva.num   = prob[1];
    obj.judges.uva.title = prob[2];
    obj.judges.uva.stats = {
      SE:  prob[7],
      CE:  prob[10],
      RF:  prob[11],
      RE:  prob[12],
      OLE: prob[13],
      TLE: prob[14],
      MLE: prob[15],
      WA:  prob[16],
      AC:  prob[17]
    }
    return obj;
  },
  addUVaTranslate: function(obj, trans) {
    obj.translate[trans.name] = trans.link;
    return obj;
  },
  addPracticeProblem: function(res, prob) {
    var obj = null;
    if (typeof(prob.uva) !== 'undefined')
         obj = res.probs['uva_num' + prob.uva];
    else obj = new ProblemObject();
    if (typeof(prob.zj) !== 'undefined') {
      obj.judges.zj     = new JudgeObject();
      obj.judges.zj.id  = prob.zj;
      obj.judges.zj.num = prob.zj;
      if (typeof(prob.title) !== 'undefined')
        obj.judges.zj.title = prob.title;
      res.probs['zj_' + prob.zj] = obj;
      if (obj.config.main !== 'uva')
        obj.config.main = 'zj';
    }
    return obj;
  },
  componentDidMount: function() {
    // init
    $('.tabular.menu .item').tab();
    $('.ui.accordion').accordion();
    // app component
    var app          = this;
    // ----------------------------------------------------
    // urls
    // ----------------------------------------------------
    var   problemUrl = 'http://uhunt.felix-halim.net/api/p';
    var  practiceUrl = './uva.data/problem/problem.list.yml';
    var translateUrl = './uva.data/translate/translate.yml';
    var transJsonUrl = './uva.data/translate/translate.json';
    // ----------------------------------------------------
    // get problems
    // ----------------------------------------------------
    $.getJSON(problemUrl, function (data) {
      var res = {
        probs: {},
        prob_categories: {},
        practice_categories: {}
      };
      data.map(function (prob) {
        var num = Math.floor(prob[1] / 100);
        var obj = new ProblemObject();
        obj = app.addUVaObject(obj, prob);
        res.probs['uva_id'  + obj.judges.uva.id]  = obj;
        res.probs['uva_num' + obj.judges.uva.num] = obj;
        if ( typeof(res.prob_categories[num]) === 'undefined' )
          res.prob_categories[num] = [];
        res.prob_categories[num].push(obj);
      });
      app.setState(res);
      // ----------------------------------------------------
      // get translations
      // ----------------------------------------------------
      $.get(translateUrl, function (str) {
        var data = YAML.parse(str);
        Object.keys(data).map(function (name) {
          if (name === 'uniDog')
            return ;
          var iter = data[name].trans || [];
          iter = (name !== 'uniDog')? Object.keys(iter): iter;
          iter.map(function (num) {
            app.addUVaTranslate(res.probs['uva_num' + num], {
              name: name,
              link: (name === 'uniDog')? num: data[name].trans[num]
            })
          });
        });
        $.getJSON(transJsonUrl, function (json) {
          Object.keys(json).map(function (num) {
            app.addUVaTranslate(res.probs['uva_num' + num], {
              name: 'uniDog',
              link: [ json[num] ]
            })
          })
          app.setState(res);
        });
      });
      // ----------------------------------------------------
      // get practice problems
      // ----------------------------------------------------
      $.get(practiceUrl, function (str) {
        var data = YAML.parse(str);
        Object.keys(data).map(function (chap) {
          res.practice_categories[chap] = {
            title: data[chap].title,
            section: []
          };
          var sections = res.practice_categories[chap].section;
          data[chap].section.map(function (sect) {
            var obj = {
              title:     sect.title,
              exercises: [],
              others:    []
            };

            var property = ['exercises', 'others'];
            property.map(function (str) {
              if (typeof(sect[str]) !== 'undefined') {
                sect[str].map(function (prob) {
                  var po = app.addPracticeProblem(res, prob);
                  po.practice.push(data[chap].title + ' - ' + sect.title);
                  obj[str].push(po);
                })
              }
            })

            sections.push(obj);
          });
        });
        app.setState(res);
      });
    })
  },
  componentDidUpdate: function() {
    document.title = this.state.title;
  },
  render: function() {
    var probs = this.state.probs;
    return (
    <div id="main" className="ui centered grid">
    <div id="content" className="fourteen wide column">
      <nav id="menu" className="ui top attached tabular labeled icon menu">
        <a className="active item" data-tab="home">
          <i className="grid layout icon"></i> uMania
        </a>
        <a className="item" data-tab="practice">
          <i className="puzzle icon"></i> Practice
        </a>
        <div className="right menu">
          <UserApp />
        </div>
      </nav>
      <ProblemSection  categories={this.state.prob_categories}     />
      <PracticeSection categories={this.state.practice_categories} />
    </div>
    </div>
    )
  }
});

var UserApp = React.createClass({
  getInitialState: function() {
    return {
      current: '',
      content: []
    }
  },
  handleChange: function(event) {
    console.log(event.target.value);
  },
  componentDidMount: function() {
    if (typeof(localStorage.current) === 'undefined')
      localStorage.current = '';
    if (typeof(localStorage.content) === 'undefined')
      localStorage.content = JSON.stringify([]);
    var res = {
      current: localStorage.current,
      content: JSON.parse(localStorage.content)
    };
    $('.ui.search.selection.dropdown').dropdown();
    $('.ui.search.selection.dropdown .search').on('change', this.handleChange);
    this.setState(res);
  },
  render: function() {
    return (
    <div className="item">
    <div className="ui search selection dropdown">
      <input type="hidden" name="user" />
      <i className="dropdown icon"></i>
      <div className="default text">Username</div>
      <div className="menu">
      {
        this.state.content.map(function (user) {
          return <div className="item" data-value={user.id}>{user.name}</div>
        })
      }
      </div>
    </div>
    </div>
    )
  }
});

var ProblemSection = React.createClass({
  render: function() {
    var volume  = this.props.categories || {};
    var loading = this.props.categories ? '' : 'loading ';
    return (
    <section id="problem" className={"ui active bottom attached " + loading + "tab segment"} data-tab="home">
    <div className="ui styled fluid accordion">
    {
      Object.keys(volume).map(function (vol) {
        return (
        <article id={"volume" + vol} className="title">
          <i className="huge folder icon"></i>
          <header className="header"><h1>Volume {vol}</h1></header>
          <div className="content">
            <div className="ui doubling six column grid">
            {
              volume[vol].map(function (prob) {
                return <ProblemCard prob={prob} />
              })
            }
            </div>
          </div>
        </article>
        )
      })
    }
    </div>
    </section>
    )
  }
});

var PracticeSection = React.createClass({
  componentDidUpdate: function() {
    $('.ui.accordion').accordion();
  },
  render: function() {
    var volume  = this.props.categories || {};
    return (
    <section id="practice" className={"ui bottom attached tab accordion segment"} data-tab="practice">
    {
      Object.keys(volume).map(function (vol) {
        return (
        <article className="ui list">
        <div className="ui title item">
          <i className="huge book icon"></i>
          <div className="content">
            <header className="ui header"><h1>{volume[vol].title}</h1></header>
          </div>
        </div>
        <div className="content">
        <div className="ui doubling four column grid">
        {
          volume[vol].section.map(function (sect) {
            return (
            <div className="column">
            <div className="ui raised segments">
              <div className="ui segment">
                <h3 className="ui header">{sect.title}</h3>
              </div>
              <div className="ui segment">
                <table className="ui celled table">
                <tbody>
                {
                  sect.exercises.map(function (prob) {
                    return <tr><td>{prob.getJudgeName()}</td></tr>
                  })
                }
                </tbody>
                </table>
              </div>
              <div className="ui segment">
                <table className="ui celled table">
                <tbody>
                {
                  sect.others.map(function (prob) {
                    return <tr><td>{prob.getJudgeName()}</td></tr>
                  })
                }
                </tbody>
                </table>
              </div>
            </div>
            </div>
            )
          })
        }
        </div>
        </div>
        </article>
        )
      })
    }
    </section>
    )
  }
});

var ProblemItem = React.createClass({
  render: function() {
    var prob = this.props.prob || dummyProb;
    return <div className="column">{prob.getJudgeName()}</div>
  }
});

var ProblemDot = React.createClass({
  render: function() {
    var prob = this.props.prob || dummyProb;
    return <div className={"ui " + prob.getStatusColor() + " empty circular label"}></div>
  }
});

var ProblemCard = React.createClass({
  render: function() {
    var prob      = this.props.prob || dummyProb;
    var translate = prob.translate;
    var practice  = prob.practice;
    var color     = prob.getStatusColor();
    if (color === 'basic') color = '';
    return (
    <div className="column">
    <div className={"ui left aligned " + color + " items segment"}>
      <div className="item">
      <div className="content">
        <a className="header" href={prob.getJudgeUrl()} target="_blank">
          {prob.getJudgeName()}
        </a>
        <div className="description">
          <div className="ui list">
          {
            Object.keys(translate).map(function (trans) {
              return (
              <div className="item">
                <i className="world icon"></i>
                <div className="content">
                  <a href={prob.getTranslateUrl(trans)} target="_blank">{trans}</a>
                </div>
              </div>
              )
            })
          }
          {
            practice.map(function (prat) {
              return (
              <div className="item">
                <i className="write icon"></i>
                <div className="content">{prat}</div>
              </div>
              )
            })
          }
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>
    )
  }
});

var JudgeObject = function() {
  var jo = this;
  jo.id     = 0;
  jo.num    = 0;
  jo.title  = '';
  jo.status = 0;
}
JudgeObject.prototype.colorCode = {
  0:   'basic',  // default
  10 : 'black',  // Submission error
  15 : 'brown',  // Can't be judged
  20 : 'yellow', // In queue
  30 : 'orange', // Compile error
  35 : 'olive',  // Restricted function
  40 : 'purple', // Runtime error
  45 : 'violet', // Output limit
  50 : 'blue',   // Time limit
  60 : 'teal',   // Memory limit
  70 : 'red',    // Wrong answer
  80 : 'pink',   // PresentationE
  90 : 'green'   // Accepted
}
JudgeObject.prototype.getStatusColor = function() {
  return this.colorCode[this.status];
}

var ProblemObject = function() {
  var po = this;
  po.config    = { main: '_' };
  po.judges    = { '_': new JudgeObject() };
  po.translate = {};
  po.practice  = [];
}
ProblemObject.prototype.judgeConfig = {
  '_': {
    'name': '',
    'url': ''
  },
  'uva': {
    'name': 'UVa',
    'url': 'https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=\\1'
  },
  'zj': {
    'name': 'ZeroJudge',
    'url': 'http://zerojudge.tw/ShowProblem?problemid=\\1'
  }
}
ProblemObject.prototype.translateConfig = {
  '':               '',
  'luckycat':       'http://luckycat.kshs.kh.edu.tw/homework/\\1',
  'ruby 兔':        'http://rubyacm.blogspot.tw/\\1',
  'unfortunate 狗': 'http://unfortunatedog.blogspot.tw/\\1',
  'uniDog': 'http://pcshic.github.io/uniDog/problem/\\1'
}
ProblemObject.prototype.__validJudgeId = function(jid) {
  if (typeof(jid)              === 'undefined' ||
      typeof(this.judges[jid]) === 'undefined')
    return this.config.main;
  return jid;
}
ProblemObject.prototype.getStatusColor = function(jid) {
  jid = this.__validJudgeId(jid);
  return this.judges[jid].getStatusColor();
}
ProblemObject.prototype.getJudgeName = function(jid) {
  jid = this.__validJudgeId(jid);
  return this.judgeConfig[jid].name + ' ' + this.judges[jid].num;
}
ProblemObject.prototype.getJudgeTitle = function(jid) {
  jid = this.__validJudgeId(jid);
  return this.judges[jid].title;
}
ProblemObject.prototype.getJudgeUrl = function(jid) {
  jid = this.__validJudgeId(jid);
  return this.judgeConfig[jid].url.replace(/\\1/, this.judges[jid].id);
}
ProblemObject.prototype.getTranslateUrl = function(tid) {
  if (typeof(tid)                 === 'undefined' ||
      typeof(this.translate[tid]) === 'undefined')
    return '';
  var res  = this.translateConfig[tid];
  var args = this.translate[tid];
  for (var i = 0; i < args.length; i++) {
    var j = i + 1;
    res = res.replace(new RegExp("\\\\" + j), args[i]);
  }
  return res;
}
var dummyProb = new ProblemObject();

$(document).ready(function() {
  ReactDOM.render(<UManiaApp />, document.body);
});