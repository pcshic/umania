(function() {
  var DEBUG = 1;
  // ================================================================
  //
  // function: none
  //
  // ================================================================
  var none = function(o) {
    return typeof(o) === 'undefined';
  }
  // ================================================================
  // ================================================================
  var isFunction = function(f) {
    var g = {};
    return f && g.toString.call(f) === '[object Function]';
  }
  // ================================================================
  // ================================================================
  function savingBox() {
  }
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
    if ( !none(options) ) {
      if ( !none(options.except) ) {
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
    }
    return res[Math.floor(Math.random() * res.length)];
  }
  // ================================================================
  // ================================================================
  var addTab = function(prob) {
    if (DEBUG)
      console.log('start add tab.');
    var id  = $(prob).data('id'),
        num = $(prob).data('num');
    /* add tab */
    var tab = [];
    tab.push('<a class="item" data-tab="uva' + id + '">');
    tab.push('<i class="tag icon"></i>');
    tab.push('UVa ' + num);
    tab.push('</a>');
    if ( $('#menu .right.menu').length ) {
      $('#menu .right.menu').before(tab.join(''));
    }
    else $('#menu').append(tab.join(''));
    /* add content */
    var content = [];
    content.push('<section id="problem" class="ui bottom attached loading tab segment" data-tab="uva' + id + '"></section>');
    $('#content').append(content.join(''));
    /* loading problem */
    $.getJSON('')
    /* toogle tab */
    $('.tabular.menu .item').tab();
  }
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
      if (name !== '') localStorage.uvaname = name;
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
    $('.problem').click(function (e) {
      if (DEBUG)
        console.log($(this));
      addTab(this);
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
      if ( none(data) )
        throw 'error retrieve problem data';
      preProblemInitialize();
      var res = {};
      /* --------------------------------------------------------- */
      /*  rearrange problems by problem number                     */
      /* --------------------------------------------------------- */
      $.each(data, function (i, prob) {
        var num = Math.floor(prob[1] / 100);
        if ( none(res[num]) )
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
          art.push('<div style="margin: 0.3rem" id="uva' + prob[0] + '" class="ui circular basic button problem">');
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

        /* nav */
        /*
        var nav = [];
        nav.push('<li class="item">');
        nav.push('<a href="' + '#volume' + i + '">');
        nav.push(i);
        nav.push('</a>');
        nav.push('</li>');
        $('#category').append(nav.join(''));
        */
      });
      /* --------------------------------------------------------- */
      /*  get username
      /* --------------------------------------------------------- */
      var user = localStorage.uvaname;
      if ( none(user) ) $('#info').append('無');
      else              $('#info').append(user);
      /* --------------------------------------------------------- */
      /*  get submission
      /* --------------------------------------------------------- */
      $.getJSON('http://uhunt.felix-halim.net/api/uname2uid/' + user,
        function (id) {
          $.getJSON('http://uhunt.felix-halim.net/api/subs-user/' + id,
            function (data) {
              $.each(data.subs, function (i, sub) {
                var state = $('#uva' + sub[1]).data('state');
                if (none(state) || state < sub[2])
                  state = sub[2];
                $('#uva' + sub[1]).data('state', state);
              });

              var color = {
                10 : 'purple', //Submission error
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
              /* add state */
              $.each($('div.problem'), function (i, btn) {
                var state = $(btn).data('state');
                if ( !none(state) ) {
                  $(btn).removeClass('basic').addClass(color[state]);
                }
              });
            });
        });
      postProblemInitialize();
    });
}())