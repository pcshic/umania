var probs    = solver.probData,
    collect  = {},
    tags     = {},
    res      = '';

for (var i = 0; i < probs.length; i++) {
  var prob = probs[i],
      num  = prob.getNumber(),
      cate = Math.floor(num / 100);
  if (typeof(collect[cate]) == 'undefined')
    collect[cate] = [];
  collect[cate].push(prob.getStyle());
}

for (var cate in collect) {
  tags[cate] = 'volume-' + cate;
}

var getHeader = function(cate) {
  return '<header class="panel-heading" role="tab" id="heading-' + tags[cate] + '"><h2 class="panel-title" data-toggle="collapse" data-parent="#uva-problems" href="#' + tags[cate] + '" aria-expanded="false" aria-controls="' + tags[cate] + '" class="collapsed">Volume ' + cate + '</h2></header>';
}

var getVolume = function(cate) {
  return '<div id="' + tags[cate] + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-' + tags[cate] + '"><div class="panel-body">' + collect[cate].join('') + '</div></div>';
}

res += '<section id="uva-problems" class="panel-group" role="tablist" aria-multiselectable="true">';
for (var cate in collect) {
  res += '<article class="panel panel-default">' + getHeader(cate) + getVolume(cate) + '</article>';
}
res += '</section>';
$('#result').append(res);

postRender();