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
    if (typeof(prob.UVa) !== 'undefined')
         obj = res.probs['uva_num' + prob.UVa];
    else obj = new ProblemObject();
    if (typeof(prob.ZJ) !== 'undefined') {
      obj.judges.ZJ     = new JudgeObject();
      obj.judges.ZJ.id  = prob.ZJ;
      obj.judges.ZJ.num = prob.ZJ;
      if (typeof(prob.title) !== 'undefined')
        obj.judges.ZJ.title = prob.title;
      res.probs['ZJ_' + prob.ZJ] = obj;
      if (obj.config.main !== 'uva')
        obj.config.main = 'ZJ';
    }
    return obj;
  },
  componentDidMount: function() {
    // init
    $('.tabular.menu .item').tab();
    $('.ui.accordion').accordion();
    // app component
    var app          = this;
    // urls
    var problemUrl   = 'http://uhunt.felix-halim.net/api/p';
    var translateUrl = './data/translate.yml';
    var practiceUrl  = 'http://m80126colin.github.io/icomalgo/book/problem/problem.yml';
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
          var iter = data[name].trans || [];
          if (name !== 'uniDog')
            iter = Object.keys(iter);
          iter.map(function (num) {
            var link = [];
            if (name === 'uniDog')
              link.push(num);
            else
              link.push(data[name].trans[num]);
            app.addUVaTranslate(res.probs['uva_num' + num], {
              name: name,
              link: link
            })
          });
        });
        app.setState(res);
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
    <section id="problem" className={"ui active bottom attached " + loading + "tab accordion segment"} data-tab="home">
    {
      Object.keys(volume).map(function (vol) {
        return (
        <article id={"volume" + vol} className="ui list">
        <div className="ui title item">
          <i className="huge folder icon"></i>
          <div className="content">
            <header className="header"><h1>Volume {vol}</h1></header>
            <div className="description">
            {
              volume[vol].map(function (prob) {
                return <ProblemDot prob={prob} />
              })
            }
            </div>
          </div>
        </div>
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
        {
          volume[vol].section.map(function (sect) {
            return (
            <div className="relaxed list">
            <div className="item">
              <i className="big folder icon"></i>
              <div className="content">
                <h2 className="header">{sect.title}</h2>
                <div className="description">
                {
                  sect.exercises.map(function (prob) {
                    return <ProblemDot prob={prob} />
                  })
                }
                {
                  sect.others.map(function (prob) {
                    return <ProblemDot prob={prob} />
                  })
                }
                </div>
              </div>
            </div>
            <div className="content">
              <div className="ui doubling six column grid">
              {
                sect.exercises.map(function (prob) {
                  return <ProblemCard prob={prob} />
                })
              }
              {
                sect.others.map(function (prob) {
                  return <ProblemCard prob={prob} />
                })
              }
              </div>
            </div>
            </div>
            )
          })
        }
        </div>
        </article>
        )
      })
    }
    </section>
    )
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
        <div className="meta">{prob.getJudgeTitle()}</div>
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
  'ZJ': {
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