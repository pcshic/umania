/*
	functions
*/
var col = function(sm, md, lg) {
	var res		= [],
		type	= ['sm', 'md', 'lg'],
		num		= [sm, md, lg];
	for (var i = 1; i < num.length; i++)
		if (num[i] == undefined)
			num[i] = num[i - 1];
	for (var i = 0; i < type.length; i++)
		res.push(['col', type[i], num[i]].join('-'));
	return res.join(' ');
}
var postRender = function() {
	$('[data-toggle="tooltip"]').tooltip();
}

/*
	load UPS Custom
*/
var upsName	= 'upsCustom';
var ls		= localStorage;
if (ls[upsName] == undefined)
	ls[upsName] = '{}';
var ups		= JSON.parse(ls[upsName]);

/*
	load head.html
*/
$.ajaxSettings.async = false;
$.get('head.html', '', function(data) {
	$('body').prepend(data);
	$('title, #banner').text('UVa Problem Solver');
});
$.ajaxSettings.async = true;

/*
	get query
*/
var query = (new Query()).getAllArgs();
var args = {
	'type':		query['type'],
	'num':		query['num'],
	'prob':		true,
	'database':	true,
	'user':		ups.master,
	'trans':	true
};
var solver = new Solver(args);