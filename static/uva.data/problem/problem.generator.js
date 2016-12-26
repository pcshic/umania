var is      = require('is'),
    fs      = require('fs'),
    YAML    = require('yamljs'),
    sprintf = require('sprintf-js').sprintf;

var defaultHref = function(id) { return id }

function OnlineJudge() {
  this.list = { '': { name: '', href: defaultHref } }
}
OnlineJudge.prototype.register = function(judge, data) {
  var oj = this;
  if ( is.string(judge) && is.object(data) && is.string(data.name) ) {
    if ( is.undef(data.href) )
      data.href = defaultHref;
    oj.list[judge] = data;
  }
  else {
    if ( is.undef(judge) )
      console.error('In register: judge type is undefined.');
    if ( is.undef(data) )
      console.error('In register: data is undefined.');
    else if ( is.undef(data.name) )
      console.error('In register: judge name is undefined.');
  }
  return oj;
}
OnlineJudge.prototype.makeProblemTitle = function(prob) {
  var oj      = this;
  var ids     = [];
  var content = [];
  if ( is.object(prob) ) {
    Object.keys(prob).map(function (key) {
      if (key === 'title' || key === 'description')
        return '';
      // get judge and id
      var id    = '',
          judge = oj.list[''];
      if ( is.undef(oj.list[key]) ) {
        console.warn('Unknown judge type: ' + key);
      }
      else {
        id    = prob[key];
        judge = oj.list[key];
      }
      //
      var msg = sprintf('\\href{%s}{%s}', judge.href(id), id);
      ids.push(judge.name + ' ' + id);
      content.push(judge.name + ' ' + msg);
    })
  }
  else {
    console.error('Error: prob is not object. prob: ' + JSON.stringify(prob));
  }
  if ( is.undef(prob.title) ) {
    prob.title = '';
    console.warn('Problem no title: ' + ids.join(' / '));
  }
  return sprintf('\\textbf{\\textit{%s: %s}}', content.join(' / '), prob.title);
}

/*
uva: UVa
zj: ZeroJudge
pku: PKU
hdu: HDU
ural: Ural
*/
var JUDGE = new OnlineJudge();

JUDGE
.register('uva', {
  name: 'UVa',
  href: function(id) {
    return sprintf('http://uva.onlinejudge.org/external/%d/%d.html',
      Math.floor(id / 100), id)
  }
})
.register('zj', {
  name: 'ZeroJudge',
  href: function(id) { return 'http://zerojudge.tw/ShowProblem?problemid=' + id }
})
.register('ural', {
  name: 'Ural',
  href: function(id) { return 'http://acm.timus.ru/problem.aspx?num=' + id }
})
.register('pku', {
  name: 'POJ',
  href: function(id) { return 'http://poj.org/problem?id=' + id }
})
.register('hdu', {
  name: 'HDOJ',
  href: function(id) { return 'http://acm.hdu.edu.cn/showproblem.php?pid=' + id }
})
.register('spoj', {
  name: 'SPOJ',
  href: function(id) { return 'http://www.spoj.com/problems/' + id }
})

var generateFile = function(file) {
  Object.keys(file).map(function (chap) {
    var sections = file[chap].section;
    sections.map(function (sect) {
      var eMsg, fileName;
      // filename
      if (is.undef(sect.title)) {
        sect.title = '';
        eMsg = sprintf('Error: no section title. Chapter: %s', chap);
        console.error(eMsg);
      }
      if (is.undef(sect.file)) {
        eMsg = sprintf('Error: no file name. Chapter: %s, section: %s', chap, sect.title);
        console.error(eMsg);
      }
      fileName = 'store/' + sprintf('%s-%s.tex', chap, sect.file);

      var content = [];
      // exercises
      if ( !is.undef(sect.exercises) ) {
        content.push('\\subsubsection*{練習題}');
        content.push('\\begin{itemize}[label={\\Checkmark}]');
        sect.exercises.map(function (prob) {
          content.push( sprintf('\\item %s\\\\', JUDGE.makeProblemTitle(prob)) );
          if ( is.undef(prob.description) ) {
            prob.description = '';
            console.warn('No problem description: ' + JSON.stringify(prob));
          }
          content.push(prob.description);
        });
        content.push('\\end{itemize}');
      }
      // others
      if ( !is.undef(sect.others) ) {
        content.push('\\subsubsection*{更多練習題}');
        content.push('\\begin{itemize}[label={\\PencilLeftDown}]');
        sect.others.map(function (prob) {
          content.push('\\item ' + JUDGE.makeProblemTitle(prob));
        });
        content.push('\\end{itemize}');
      }

      fs.writeFile(fileName, content.join('\n'), function (e) {
        if (e) { console.error(e); }
        else {   console.log('File saved!'); }
      });
    })
  })
}

generateFile( YAML.load('problem.list.yml') );
generateFile( YAML.load('basic.problem.list.yml') );