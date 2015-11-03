var App = React.createClass({
  getInitialState: function() {
    return {
      title: 'uMania'
    }
  },
  componentDidMount: function() {
    $('.tabular.menu .item').tab();
    document.title = this.state.title;
  },
  render: function() {
    return (
    <div id="content" className="fourteen wide column">
      <nav id="menu" className="ui top attached tabular labeled icon menu">
        <a className="active item" data-tab="home"><i className="grid layout icon"></i> uMania</a>
        <a className="item" data-tab="practice"><i className="puzzle icon"></i> Practice</a>
        <div className="right menu">
          <a className="ui simple dropdown item">
          <i className="setting icon"></i>
          </a>
        </div>
      </nav>
      <ProblemSection />
      <PracticeSection />
    </div>
    )
  }
});

var Dimmer = React.createClass({
  render: function() {
    return (
      <div className="content"><div className="center">
      <div className="ui centered grid">
        <div className="fourteen wide column">
          <article id="umania-problem-content" className="ui segment" style="color: black">
          </article>
        </div>
      </div>
      </div></div>
    )
  }
});

var ProblemSection = React.createClass({
  getInitialState: function() {
    return {
      loading: true,
      volume: {}
    }
  },
  componentDidMount: function() {
    var prob_sec = this;
    var problemUrl = 'http://uhunt.felix-halim.net/api/p';
    $.getJSON(problemUrl, function (data) {
      var res = {};
      $.each(data, function (i, prob) {
        var num = Math.floor(prob[1] / 100);
        if ( typeof(res[num]) === 'undefined' )
          res[num] = [];
        res[num].push(prob);
      });
      prob_sec.setState({
        loading: !prob_sec.state.loading,
        volume: res
      });
    })
  },
  render: function() {
    var loading = this.state.loading ? 'loading ' : '';
    var volume  = this.state.volume;
    return (
      <section id="problem" className={"ui center aligned active bottom attached " + loading + "tab segment"} data-tab="home">
      {
        Object.keys(volume).map(function (vol) {
          return (
            <article id={"volume" + vol} className="ui justified">
            <header><h1 className="ui icon header">
              <i className="circular book icon"></i> Volume {vol}
            </h1></header>
            {
              volume[vol].map(function (prob) {
                return <Problem judge="uva" id={prob[0]} num={prob[1]} />
              })
            }
            </article>
          )
        })
      }
      </section>
    )
  }
});

var PracticeSection = React.createClass({
  render: function() {
    return (
      <section id="practice" className="ui center aligned bottom attached tab segment" data-tab="practice">
      </section>
    )
  }
});

var Problem = React.createClass({
  render: function() {
    var problemStyle = {
      margin: "0.3rem"
    }
    return (
      <div style={problemStyle} className={"ui circular basic button umania-problem-class " + this.props.judge + this.props.id}>
      {this.props.num}
      </div>
    )
  }
});

$(document).ready(function() {
  ReactDOM.render(<App />, $('#main')[0]);
});