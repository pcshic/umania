var probs    = solver.probData,
    collect  = {},
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
  res += '<section id="volume' + cate + '"><h2>Volume ' + cate + '</h2><div>' + collect[cate].join('') + '</div></section>';
}
$('#result').append(res);

postRender();