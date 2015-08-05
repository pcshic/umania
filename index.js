(function() {

  var DEBUG = 1;

/* ******************************************************************** */
/*                                                                      */
/*  class: Utility                                                      */
/*  member functions:                                                   */
/*    none(o)                                                           */
/*    isFunction(f)                                                     */
/*                                                                      */
/* ******************************************************************** */

  function Utility() {}

  // ================================================================
  //
  //  function: none
  //
  // ================================================================
  Utility.prototype.none = function(o) {
    return typeof(o) === 'undefined';
  }
  // ================================================================
  //
  //  function: isFunction
  //
  // ================================================================
  Utility.prototype.isFunction = function(f) {
    var g = {};
    return f && g.toString.call(f) === '[object Function]';
  }
  var UNIT = new Utility();

/* ******************************************************************** */
/* ******************************************************************** */

  function UserManager() {}

  UserManager.prototype.current = 'umania-current-user';
  UserManager.prototype.setting = 'umania-user-setting';
  UserManager.prototype.checkSetting = function(name) {
    var mgr = this, res;
    if ( UNIT.none(localStorage[mgr.setting]) ) {
      res = {};
    }
    else {
      res = JSON.parse(localStorage[mgr.setting]);
    }
    if ( UNIT.none(res[name]) )
      res[name] = {};
    localStorage[mgr.setting] = JSON.stringify(res);
  }
  UserManager.prototype.getCurrentUser = function() {
    return localStorage[this.current];
  }
  UserManager.prototype.setCurrentUser = function(name) {
    var mgr = this;
    if (!UNIT.none(name) && name !== '') {
      localStorage[mgr.current] = name;
      mgr.checkSetting(name);
      return true;
    }
    return false;
  }
  UserManager.prototype.getUserId = function(name, cb) {
    var mgr     = this;
    mgr.checkSetting(name);
    var setting = JSON.parse(localStorage[mgr.setting]);
    if ( UNIT.none(setting[name]['id']) ) {
      $.getJSON('http://uhunt.felix-halim.net/api/uname2uid/' + name, function (id) {
          if (DEBUG) {
            console.log('user id: ' + id);
          }
          if ( UNIT.isFunction(cb) ) cb(id);
          setting[name]['id'] = id;
          localStorage[mgr.setting] = JSON.stringify(setting);
      });
    }
    else {
      if (DEBUG) {
        console.log('user id: ' + setting[name]['id']);
      }
      if ( UNIT.isFunction(cb) ) cb(setting[name]['id']);
    }
  }
  var BOX = new UserManager();

/* ******************************************************************** */
/* ******************************************************************** */

  // ================================================================
  //
  //  function: randomColor
  //  arguments:
  //    options - some options to control the behavior of this
  //              function
  //  return: a color name
  //  description:
  //    get a color name can be seen as a class used in semantic UI
  //
  // ================================================================
  var randomColor = function(options) {
    var colors = [
      'red', 'orange', 'yellow', 'olive', 'green', 'teal',
      'blue', 'purple', 'violet', 'pink', 'brown', 'grey'];
    var res = [];
    if ( !UNIT.none(options) ) {
      if ( !UNIT.none(options.except) ) {
        for (var i in colors) {
          var flag = 1;
          for (var j in options.except) {
            if (options.except[j] === colors[i])
              flag = 0;
          }
          if (flag)
            res.push(colors[i]);
        }
      }
      else if ( !UNIT.none(options.all) ) {
        if (DEBUG) {
          console.log('return all colors.');
        }
        return colors;
      }
    }
    return res[Math.floor(Math.random() * res.length)];
  }
  // ================================================================
  // ================================================================
  var getJudgeColor = function(code) {
    var colors = {
      10 : 'purple', // Submission error
      15 : 'black',  // Can't be judged
      20 : 'black',  // In queue
      30 : 'yellow', // Compile error
      35 : 'orange', // Restricted function
      40 : 'teal',   // Runtime error
      45 : 'blue',   // Output limit
      50 : 'blue',   // Time limit
      60 : 'blue',   // Memory limit
      70 : 'red',    // Wrong answer
      80 : 'pink',   // PresentationE
      90 : 'green'   // Accepted
    }
    return colors[code];
  }
  var getJudgeString = function(code) {
    var str = {
      10 : 'SE', // Submission error
      15 : 'others',  // Can't be judged
      20 : 'Inq',  // In queue
      30 : 'CE', // Compile error
      35 : 'RF', // Restricted function
      40 : 'RE',   // Runtime error
      45 : 'OLE',   // Output limit
      50 : 'TLE',   // Time limit
      60 : 'MLE',   // Memory limit
      70 : 'WA',    // Wrong answer
      80 : 'PE',   // PresentationE
      90 : 'AC'   // Accepted
    }
    return str[code];
  }

/* ******************************************************************** */
/* ******************************************************************** */

  // ================================================================
  // ================================================================
  /*
  var addTab = function(prob) {
    if (DEBUG)
      console.log('start add tab.');
    var id  = $(prob).data('id'),
        num = $(prob).data('num');
    // add tab
    var tab = [];
    tab.push('<a id="tab-uva' + id + '" class="item" data-tab="uva' + id + '">');
    tab.push('<i class="tag icon"></i>');
    tab.push('UVa ' + num);
    tab.push('</a>');
    if ( $('#menu .right.menu').length ) {
      $('#menu .right.menu').before(tab.join(''));
    }
    else $('#menu').append(tab.join(''));
    // add content
    var content = [];
    content.push('<section id="problem-uva' + id + '" class="ui bottom attached loading tab segment" data-tab="uva' + id + '"></section>');
    $('#content').append(content.join(''));
    // loading problem
    $.getJSON('http://uhunt.felix-halim.net/api/p/id/' + id,
      function (data) {
        var art = [];
        art.push('<article>');
        art.push('XDDDDD');
        art.push('</article>');
        $('#problem-uva' + id).removeClass('loading').append(art.join(''));
    });
    // toogle tab
    $('.tabular.menu .item').tab();
  }
  */
  // ================================================================
  // ================================================================
  var getSubmission = function() {
    var user = BOX.getCurrentUser();
    if (DEBUG) {
      console.log('start loading submissions.');
      console.log('current user: ' + user);
    }
    BOX.getUserId(user, function (id) {
      var url = 'http://uhunt.felix-halim.net/api/subs-user/' + id;
      $.getJSON(url, function (data) {
        /* process submissions */
        $.each(data.subs, function (i, sub) {
          var state = $('#uva' + sub[1]).data('state');
          if (UNIT.none(state) || state < sub[2])
            state = sub[2];
          $('#uva' + sub[1]).data('state', state);
        });
        /* add state */
        $.each($('.umania-problem-class'), function (i, btn) {
          var state = $(btn).data('state');
          if ( !UNIT.none(state) ) {
            $(btn).removeClass('basic').addClass( getJudgeColor(state) );
          }
        });
      });
    });
  }

/* ******************************************************************** */
/* ******************************************************************** */

  // ================================================================
  //
  //  function: preProblemInitialize
  //  arguments: none
  //  description:
  //    Do something after loading UVa problem data but before
  //    processing.
  //
  // ================================================================
  var preProblemInitialize = function() {
    /* --------------------------------------------------------- */
    /* --------------------------------------------------------- */
    if (DEBUG) {
      console.log('problem data loading complete.');
      console.log('start pre-processing ...');
    }
    /* --------------------------------------------------------- */
    /* --------------------------------------------------------- */
    $('#userform').submit(function (e) {
      e.preventDefault();
      var name = $('#username').val();
      if ( BOX.setCurrentUser(name) ) {
        // clean user data
        $('.umania-problem-class').removeClass( randomColor({all: 1}).join(' ') ).addClass('basic').data('state', 0);
        // update user
        $('#info').text(name);
        getSubmission();
      }
    });
    /* --------------------------------------------------------- */
    /*  remove 'loading' class after data is loaded              */
    /* --------------------------------------------------------- */
    $('#problem').removeClass('loading');
    /* --------------------------------------------------------- */
    /* --------------------------------------------------------- */
    if (DEBUG) {
      console.log('pre-processing complete.');
    }
  }
  // ================================================================
  //
  //  function: postProblemInitialize
  //  arguments: none
  //  description:
  //    Do something after processing UVa problem data.
  //
  // ================================================================
  var postProblemInitialize = function() {
    /* --------------------------------------------------------- */
    /* --------------------------------------------------------- */
    if (DEBUG) {
      console.log('start post-processing ...');
    }
    /* --------------------------------------------------------- */
    /* enable tabular menu                                       */
    /* --------------------------------------------------------- */
    $('.tabular.menu .item').tab();
    /* --------------------------------------------------------- */
    /* --------------------------------------------------------- */
    $('.umania-problem-class').click(function (e) {
      var btn = this;
      if (DEBUG)
        console.log($(btn));
      var id    = $(btn).data('id'),
          num   = $(btn).data('num'),
          state = $(btn).data('state');
      $('#umania-problem-content').addClass('loading');
      $('.dimmer').dimmer('show');
      var art = [];
      art.push('<header><div class="ui huge dividing header">UVa ' + num + '</div></header>');
      art.push('<div class="ui ' + getJudgeColor(state) + ' huge statistic">');
      art.push('<div class="label">狀態</div>');
      art.push('<div class="value">' + getJudgeString(state) + '</div>');
      art.push('</div>');
      art.push('</div>');
      $('#umania-problem-content').html(art.join(''));
      $('#umania-problem-content').removeClass('loading');
      /*
      if ( !tab.length )
        addTab(btn);
      */
    });
    /* --------------------------------------------------------- */
    /* --------------------------------------------------------- */
    if (DEBUG) {
      console.log('post-processing complete.');
    }
  }
  // ================================================================
  //
  //  initialize uva problems
  //
  // ================================================================
  $.getJSON('http://uhunt.felix-halim.net/api/p',
    function (data) {
      if ( UNIT.none(data) )
        throw 'error retrieve problem data';
      preProblemInitialize();
      var res = {};
      /* --------------------------------------------------------- */
      /*  rearrange problems by problem number                     */
      /* --------------------------------------------------------- */
      $.each(data, function (i, prob) {
        var num = Math.floor(prob[1] / 100);
        if ( UNIT.none(res[num]) )
          res[num] = [];
        res[num].push(prob);
      });
      /* --------------------------------------------------------- */
      /* --------------------------------------------------------- */
      $.each(res, function (i, cat) {
        /* problems */
        var art = [];
        art.push('<article id="volume' + i + '" class="ui justified">');
        /* volume header */
        art.push('<header><h1 class="ui ' + randomColor({
          'except': ['black', 'green']
          }) + ' icon header">');
        art.push('<i class="circular book icon"></i>');
        art.push('Volume ' + i);
        art.push('</h1></header>');
        /* add problems in same volume */
        $.each(cat, function (j, prob) {
          art.push('<div style="margin: 0.3rem" id="uva' + prob[0] + '" class="ui circular basic button umania-problem-class">');
          art.push(prob[1]);
          art.push('</div>');
        });
        art.push('</article>');
        /* append volume */
        $('#problem').append(art.join(''));
        /* add problem id and number */
        $.each(cat, function (j, prob) {
          $('#uva' + prob[0]).data('id', prob[0]).data('num', prob[1]);
        });
      });
      $.get('./data/translate.yml', function (str) {
        var data     = YAML.parse(str),
            indexing = [];
        if (DEBUG)
          console.log(data);
        /**/
        $('.umania-problem-class').each(function (i, prob) {
          indexing[$(prob).data('num')] = prob;
        });
        for (var name in data) {
          if (name === 'Unfortunate 狗') {
            $.each(data[name].trans, function (j, num) {
              $(indexing[num])
                .addClass('right labeled icon')
                .data('link-source', name)
                .data('link', data[name].site + Math.floor(num / 100) + '/p' + num + '/')
                .append('<i class="plane icon"></i>');
            });
          }
          else {
            for (var num in data[name].trans) {
              $(indexing[num])
                .addClass('umania-popup right labeled icon')
                .data('link-source', name)
                .data('link', data[name].site + data[name].trans[num])
                .append('<i class="plane icon"></i>');
            }
          }
        }
      });
      /* --------------------------------------------------------- */
      /*  get username
      /* --------------------------------------------------------- */
      var user = BOX.getCurrentUser();
      if ( UNIT.none(user) || !user ) $('#info').text('無');
      else {
        $('#info').text(user);
        /* get submission */
        getSubmission();
      }
      postProblemInitialize();
    });
}())