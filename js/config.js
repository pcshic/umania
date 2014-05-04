$('title').text('UVa Problem Solver');

$.ajaxSettings.async = false;
$.get('template.html', '', function(data) {
	$('body').prepend(data);
});
$.ajaxSettings.async = true;

var query = (new Query()).getAllArgs();
var args = {
	'type': query['type'],
	'num': query['num'],
	'prob': true,
	'database': true,
	'user': query['user'],
	'trans': true
};
var solver = new Solver(args);

var col = function(num) {
	var res = [];
	var type = ['sm', 'md', 'lg'];
	for (var i = 0; i < type.length; i++)
		res.push(['col', type[i], num].join('-'));
	return res.join(' ');
}
var makeRow = function(options) {
	var res = ['<div class="row">'];
	for (var i = 0; i < options.length; i++) {
		res.push('<div class="' + col(options[i][0]) + '">' + options[i][1] + '</div>');
	}
	res.push('</div>');
	return res.join('');
}

var postRender = function() {
	$('#tooltip').tooltip();
	$('#popover').popover();
}