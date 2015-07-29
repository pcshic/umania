/*$('#sidebarTrigger').click(function() {
	$('#sidebar').sidebar('toggle');
});*/
(function() {
  /* none */
  var none = function(o) {
    return typeof(o) === 'undefined';
  }
  /* colors */
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
  /**/
  $('#userinput').click(function () {
    localStorage.uvaname = $('#username').val();
  });
  /**/
  $.getJSON('http://uhunt.felix-halim.net/api/p',
    function (data) {
      if (typeof(data) === 'undefined')
        throw 'error retrieve problem data';
      var res = {};
      $.each(data, function (i, prob) {
        var id = Math.floor(prob[1] / 100);
        if (typeof(res[id]) === 'undefined')
          res[id] = [];
        res[id].push(prob);
      });
      $.each(res, function (i, cat) {
        /* problems */
        var art = [];
        art.push('<article id="volume' + i + '" class="ui justified">');
        art.push('<header><h1 class="ui ' + randomColor({
          'except': ['black', 'green']
          }) + ' icon header">');
        art.push('<i class="circular book icon"></i>');
        art.push('Volume ' + i);
        art.push('</h1></header>');
        $.each(cat, function (j, prob) {
          art.push('<div style="margin: 0.3rem" id="uva' + prob[0] + '" class="ui circular basic button problem">');
          art.push(prob[1]);
          art.push('</div>');
        });
        art.push('</article>');
        $('#problem').append(art.join(''));

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
      /* get username */
      var user = localStorage.uvaname;
      if (typeof(user) === 'undefined') $('#info').append('無');
      else                              $('#info').append(user);
      /*  */
      $.getJSON('http://uhunt.felix-halim.net/api/uname2uid/' + user,
        function (id) {
          $.getJSON('http://uhunt.felix-halim.net/api/subs-user/' + id,
            function (data) {
              $.each(data.subs, function (i, sub) {
                var verdict = $('#uva' + sub[1]).data('verdict');
                if (typeof(verdict) === 'undefined' || verdict < sub[2])
                  verdict = sub[2];
                $('#uva' + sub[1]).data('verdict', verdict);
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

              $.each($('div.problem'), function (i, btn) {
                var verdict = $(btn).data('verdict');
                if (typeof(verdict) !== 'undefined') {
                  $(btn).removeClass('basic').addClass(color[verdict]);
                }
              });
            });
        });
    });
}())