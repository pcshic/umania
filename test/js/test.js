$.get('data/board.yml', '', function (data) {
	data = YAML.parse(data);
	var decodeObj	= function(obj, args) {
		var res		= {};
		res.ver		= obj['version'];
		res.date	= obj['date'];
		res.cont	= obj['content'];
		res.sum		= obj['summary'];
		res.code	= obj['code'];
		res.des		= obj['description'];
		res.img 	= obj['img'] || 'img/blank.png';
		res.args	= args;
		return res;
	}
	var firstWidth		= {'w': '300px'};
	var secondHeight	= {'h': '50px'};
	var res =
	'<div id="board">\
		<h1>公告</h1><ul class="list-group">';
	for (var i = 0; i < data.length; i++) {
		var obj = decodeObj(data[i], firstWidth);
		res += '<li class="list-group-item">\
					<div class="media">';
		// Start img
		res += '<img class="media-object \
					pull-right" src="' + obj.img + '"';
		if (obj.args.h)
			res += ' height="' + obj.args.h + '"';
		if (obj.args.w)
			res += ' width="' + obj.args.w + '"';
		res += '>';
		// End img
		res += '<div class="media-body">';
		if (obj.code) {
			res +=
				'<h3 class="page-header">版本 ' + obj.code + ' (' + obj.ver + ') <small>' + obj.date + '</small></h3>';
		}
		else {
			res +=
				'<h3 class="page-header">版本 ' + obj.ver + ' <small>' + obj.date + '</small></h3>';
		}
		if (obj.des) {
			res += '<div><p class="paragraph">' + obj.des + '</p></div>';
		}
		if (obj.cont && obj.cont.length) {
			res +=	'<ol><li>' + obj.cont.join('</li><li>') + '</li></ol>';
		}
		if (obj.sum && obj.sum.length) {
			res +=	'<h4>子版本</h4>\
					<table class="table table-hover">';
			for (var j = 0; j < obj.sum.length; j++) {
				var sObj = decodeObj(obj.sum[j], secondHeight);
				res += '<tr>\
							<th>' + sObj.ver + '</th>\
							<td>' + sObj.date + '</td>';
				if (sObj && sObj.cont.length) {
					res +=	'<td><ul><li>' + sObj.cont.join('</li><li>') + '</li></ul></td>';
				}
				res += '<td>';
				if (sObj.img != 'img/blank.png')
					res += '<a href="' + sObj.img + '"><img src="' + sObj.img + '" height="' + sObj.args.h + '"></a>';
				res += '</td></tr>';
			}
			res +=	'</table>';
		}
		res +=		'</div>\
				</div>\
			</li>';
	}
	res += '</ul></div>';
	$('#result').append(res);
});