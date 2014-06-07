var getImage = function(image, option) {
	res = '<img src="' + image + '"';
	for (var attr in option)
		res += ' ' + attr + '="' + option[attr] + '"';
	res += '>';
	return res;
}

var getTitle = function(code, version, date) {
	res = '<h3 class="page-header">版本 ';
	if (code)
		res += code + ' (' + version + ')';
	else
		res += version;
	res += ' <small>' + date + '</small></h3>';
	return res;
}

var getDescription = function(des) {
	res = '';
	if (des)
		res += '<div><p class="paragraph">' + des + '</p></div>';
	return res;
}

var getContent = function(content) {
	res = '';
	if (content) {
		res += '<ol><li>';
		if (content.length)
			res += content.join('</li><li>');
		else res += content;
		res += '</li></ol>';
	}
	return res;
}

var getSubversionInfo = function(subinfo) {
	res = '';
	res += '\
		<tr>\
			<th>' + subinfo.version + '</th>\
			<td>' + subinfo.date + '</td>\
			<td>' + getContent(subinfo.content) + '</td>';
	res += '<td>'
			if (subinfo.image) {
				res += '<a href="' + subinfo.image + '">' +
				getImage(subinfo.image, { 'height': '50px' }) +
				'</a>';
			}
	res += '\
			</td>\
		</tr>';
	return res;
}

var getSubversion = function(subver) {
	var res = '';
	if (subver) {
		res += '\
			<h4>子版本</h4>\
			<table class="table table-hover">';
			if (subver.length) {
				for (var i = 0; i < subver.length; i++)
					res += getSubversionInfo(subver[i]);
			}
			else res += getSubversionInfo(subver);
		res += '\
			</table>';
	}
	return res;
}

var getVersionInfo = function(info) {
	var res = '';
	res += '\
		<li class="list-group-item">\
			<div class="media">';
			res += getImage(info.image || 'img/blank.png', {
				'class': 'media-object pull-right',
				'width': '300px'
			});
			res += '\
				<div class="media-body">';
				res += getTitle(info.code, info.version, info.date);
				res += getDescription(info.description);
				res += getContent(info.content);
				res += getSubversion(info.subversion);
	res += '\
				</div>\
			</div>\
		</li>';
	return res;
}

var getBoard = function(board) {
	var res = '';
	if (board) {
		res += '\
			<div id="board">\
				<h1>公告</h1>\
				<ul class="list-group">';
				if (board.length) {
					for (var i in board)
						res += getVersionInfo(board[i]);
				}
				else res += getVersionInfo(board);
		res += '\
				</ul>\
			</div>';
	}
	return res;
}

$(function() {
	$.get('data/board.yml', '', function (data) {
		var board = YAML.parse(data);
		$('#result').append(getBoard(board));
	});
});