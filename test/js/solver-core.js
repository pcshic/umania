// ==================================================================
//
//	UVaSolver 物件
//
// ==================================================================
var UVaSolver = {}

// ==================================================================
//
//	UVaSolver.Query 類別
//
// ==================================================================
UVaSolver.Query = function(href) {
	var query = this;
	if (typeof(href) === 'undefined')
		href = window.location.href;
	query.vars = {};
	if (href.indexOf('?') >= 0) {
		var hashes = href.slice(href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
			var hash = hashes[i].split('=');
			query.vars[hash[0]] = query.UriToString(hash[1]);
		}
	}
}
/* ***************************************************** */
/*                                                       */
/*	Query.prototype                                      */
/*                                                       */
/* ***************************************************** */
QueryProto = UVaSolver.Query.prototype;
QueryProto.StringToUri	= function(data) {
	return data.toString().replace(/\s/g, '+');
}
QueryProto.UriToString	= function(data) {
	return decodeURI(data).replace(/\+/g, ' ');
}
QueryProto.addArgs		= function(args) {
	var query = this;
	for (var key in args)
		if (typeof(args[key]) !== undefined)
			query.vars[key] = args[key];
	return query;
}
QueryProto.removeArgs	= function(keys) {
	var query = this;
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		delete query.vars[key];
	}
	return query;
}
QueryProto.getSubQuery	= function(keys) {
	var res = new UVaSolver.Query(''),
		args = {},
		query = this;
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		args[key] = query.vars[key];
	}
	res.addArgs(args);
	return res;
}
QueryProto.getAllArgs	= function() {
	var res = {};
	var query = this;
	for (var key in query.vars) {
		res[key] = query.vars[key];
	}
	return res;
}
QueryProto.toString		= function() {
	var res = [];
	var query = this;
	console.log(JSON.stringify(query.vars));
	for (var key in query.vars) {
		console.log(key, query.vars[key]);
		var value = query.StringToUri(query.vars[key]);
		console.log('done', key)
		res.push([key, value].join('='));
	}
	return res.join('&');
}
delete QueryProto;

// ==================================================================
//
//
//
// ==================================================================
var none = function(obj) {
	return obj == undefined || obj == '';
}

// ==================================================================
//
//	UVaSolver.Util 物件
//
// ==================================================================
UVaSolver.Util = {}
UVaSolver.Util.transLang	= function(type) {
	return Util.lang[type];
}
UVaSolver.Util.transVerdit	= function(verd) {
	return Util.verdit[verd];
}
UVaSolver.Util.lang			= [
	'', 'ANSI C', 'Java', 'C++', 'Pascal', 'C++11'
];
UVaSolver.Util.verdit		= {
	0:	'沒有資料',
	10:	'系統錯誤 (System Error)',
	15:	'無法評定 (Cannot be Judged)',
	20:	'正在佇列中 (In Queue)',
	30:	'編譯錯誤 (Compilation Error)',
	35:	'使用禁用函式 (Restricted Function)',
	40:	'執行時期錯誤 (Runtime Error)',
	45:	'超出輸出限制 (Output Limit Exceeded)',
	50:	'超出時間限制 (Time Limit Exceeded)',
	60:	'超出記憶體限制 (Memory Limit Exceeded)',
	70:	'錯誤答案 (Wrong Answer)',
	80:	'格式錯誤 (Presentation Error)',
	90:	'正確 (Accepted)',
};
UVaSolver.Util.btnStyle		= {
	0: 'default',	10: 'info',		15: 'info',		20: 'info',
	30: 'warning',	35: 'info',		40: 'primary',	45: 'primary',
	50: 'primary',	60: 'primary',	70: 'danger',	80: 'warning',
	90: 'success'
}

// ==================================================================
//
//	UVaSolver.Submit 類別
//
// ==================================================================
UVaSolver.Submit = function(data) {
	this.sub	= data;
	this.sub[4]	= new Date(this.sub[4] * 1000);
}
var SubmitProto = UVaSolver.Submit.prototype;
SubmitProto.getSid			= function() { return this.sub[0]; }
SubmitProto.getPid			= function() { return this.sub[1]; }
SubmitProto.getVerdit		= function() { return this.sub[2]; }
SubmitProto.getRuntime		= function() { return this.sub[3]; }
SubmitProto.getTime			= function() { return this.sub[4]; }
SubmitProto.getLang			= function() { return this.sub[5]; }
SubmitProto.getRank			= function() { return this.sub[6]; }
SubmitProto.transVerdit		= function() {
	return UVaSolver.Util.transVerdit(this.sub[2]);
}
SubmitProto.transLang		= function() {
	return UVaSolver.Util.transLang(this.sub[5]);
}
SubmitProto.transRuntime	= function() {
	var res = '0.';
	for (var i = 100; i > 1; i /= 10) {
		if (this.sub[3] < i)
			res += '0';
	}
	res += this.sub[3];
	return res;
}
SubmitProto.transTime		= function() {
	var date = this.sub[4];
	var tmp = -date.getTimezoneOffset();
	var aff = ['', '', 'GMT' + ((tmp < 0)? '-': '+')];
	if (tmp < 0) tmp = -tmp;
	var sep = ['-', ':', ''];
	var time = [
		[date.getFullYear(),
		 date.getMonth() + 1,
		 date.getDate()],
		[date.getHours(),
		 date.getMinutes(),
		 date.getSeconds()],
		[Math.floor(tmp / 60),
		 tmp % 60]
	];
	for (var i in time) {
		for (var j in time[i]) {
			time[i][j] = time[i][j].toString();
			while (time[i][j].length < 2)
				time[i][j] = '0' + time[i][j];
		}
		time[i] = aff[i] + time[i].join(sep[i]);
	}
	return time.join(' ');
}
delete SubmitProto;

// ==================================================================
//
//	UVaSolver.Problem 類別
//
// ==================================================================
UVaSolver.Problem = function(data) {
	var problem = this;
	if (data['pid'] != undefined) {
		var attr = [
			'pid',		'num',		'title',	'dacu',		'mrun',
			'mmem',		'nover',	'sube',		'noj',		'inq',
			'ce',		'rf',		're',		'ole',		'tle',
			'mle',		'wa',		'pe',		'ac',		'rtl',
			'status'];
		problem.prob = [];
		for (var i = 0; i < attr.length; i++)
			problem.prob.push(data[attr[i]]);
	}
	else problem.prob = data;
	problem.prob.push(	[],		// category
						[],		// submit
						0,		// verdit
						0,		// last stamp
						0,		// rank
						[]);	// translate
}
var ProbProto = UVaSolver.Problem.prototype;
ProbProto.getPid		= function() { return this.prob[0]; }
ProbProto.getNumber		= function() { return this.prob[1]; }
ProbProto.getTitle		= function() { return this.prob[2]; }
ProbProto.getCE			= function() { return this.prob[10]; }
ProbProto.getRF			= function() { return this.prob[11]; }
ProbProto.getRE			= function() { return this.prob[12]; }
ProbProto.getOLE		= function() { return this.prob[13]; }
ProbProto.getTLE		= function() { return this.prob[14]; }
ProbProto.getMLE		= function() { return this.prob[15]; }
ProbProto.getWA			= function() { return this.prob[16]; }
ProbProto.getPE			= function() { return this.prob[17]; }
ProbProto.getAC			= function() { return this.prob[18]; }
ProbProto.getCategory	= function() { return this.prob[21]; }
ProbProto.getSubmit		= function() { return this.prob[22]; }
ProbProto.getVerdit		= function() { return this.prob[23]; }
ProbProto.getTime		= function() { return this.prob[24]; }
ProbProto.getRank		= function() { return this.prob[25]; }
ProbProto.getTranslate	= function() { return this.prob[26]; }
ProbProto.setVerdit		= function(verd) {
	this.prob[23] = verd;
}
ProbProto.setTime		= function(stmp) {
	this.prob[24] = stmp;
}
ProbProto.setRank		= function(rank) {
	this.prob[25] = rank;
}
ProbProto.getStyle		= function(args) {
	var res = '';
	var prob = this;
	var val = prob.getNumber();
	var query = (new UVaSolver.Query()).addArgs({
			'type': 'single',
			'num': val
		}).getSubQuery(['user', 'type', 'num']);
	if (args == undefined)
		args = 'tc';
	// 設定題號顏色
	var btnAttr = 'btn-' + UVaSolver.Util.btnStyle[ prob.getVerdit() ];
	res += '<a id="uva' + val + '" href="problem.html?' + query + '" type="button" class="btn ' + btnAttr + '" target="_blank">' + val + ' ';
	// 設定翻譯
	if (args.indexOf('t') >= 0) {
		var trans = prob.getTranslate();
		for (var i = 0; i < trans.length; i++) {
			res += '<span class="glyphicon glyphicon-transfer" data-toggle="tooltip" data-original-title="' + trans[i] + '"></span>';
		}
	}
	// 設定章節
	if (args.indexOf('c') >= 0) {
		var tags = prob.getCategory();
		for (var i = 0; i < tags.length; i++) {
			res += '<span class="glyphicon glyphicon-tag" data-toggle="tooltip" data-original-title="' + tags[i] + '"></span>';
		}
	}
	// 結尾
	res += '</a>'
	return res;
}
delete ProbProto;

// ==================================================================
//
//	UVaSolver.Solver 物件
//
// ==================================================================
/*
var title = [
	'id',					'編號',					'標題',
	'DACU',					'Best Runtime',			'Best Memory',
	'No Verdict Given',		'Submission Error',		'Can\'t be Judged',
	'In Queue',				'Compilation Error',	'Restricted Function',
	'Runtime Error',		'Output Limit Exceeded','Time Limit Exceeded',
	'Memory Limit Exceeded','Wrong Answer',			'Presentation Error',
	'Accepted',				'時間限制(毫秒)',		'狀態'];
*/
UVaSolver.Solver = function(args) {
	/* ***************************************************** */
	/*                                                       */
	/*	開頭設置變數、常數                                   */
	/*                                                       */
	/* ***************************************************** */
	var solver = this;
	// 變數
	solver.userId = 0;
	solver.probData = undefined;
	solver.dbData = undefined;
	solver.userData = undefined;
	solver.transData = undefined;

	/* ***************************************************** */
	/*                                                       */
	/*	對應表                                               */
	/*                                                       */
	/* ***************************************************** */
	var rePid = {};
	var reNum = {};
	solver.reversePid		= function(pid) { return rePid[pid]; }
	solver.reverseNumber	= function(num) { return reNum[num]; }
	solver.transPidToNum	= function(pid) { return rePid[pid].getNumber(); }
	solver.transNumToPid	= function(num) { return reNum[num].getPid(); }

	/* ***************************************************** */
	/*                                                       */
	/*	設定 args 預設值:                                    */
	/*		'type'		- 'all'                              */
	/*		'prob'		- true                               */
	/*		'database'	- true                               */
	/*		'user'		- undefined                          */
	/*		'trans'		- true                               */
	/*                                                       */
	/* ***************************************************** */
	if (args == undefined)
		args = {};
	if (args.type == undefined)
		args.type = 'all';
	if (args.prob == undefined)
		args.prob = true;
	if (args.database == undefined)
		args.database = true;
	if (args.trans == undefined)
		args.trans = true;

	/* ***************************************************** */
	/*                                                       */
	/*	初始化原始資料                                       */
	/*                                                       */
	/* ***************************************************** */
	var loadData = function(args) {
		var apiUrl			= 'http://uhunt.felix-halim.net/api';
		var probUrl			= apiUrl + '/p';
		var probNumUrl		= apiUrl + '/p/num';
		var nameToPidUrl	= apiUrl + '/uname2uid';
		var subUserUrl		= apiUrl + '/subs-user';
		var subUserProbUrl	= apiUrl + '/subs-nums';
		$.ajaxSettings.async = false;
		if (args['user']) {
			$.getJSON(nameToPidUrl + '/' + args['user'], '',
				function(data) { solver.userId = data; });
		}
		if (args['type'] == 'all' || args['type'] == 'part') {
			if (args['prob']) {
				$.getJSON(probUrl, '',
					function(data) { solver.probData = data; });
			}
			if (solver.userId != 0) {
				$.getJSON(subUserUrl + '/' + solver.userId, '',
					function(data) { solver.userData = data; });
			}
		}
		else if (args['type'] == 'single') {
			if (args['num']) {
				$.getJSON(probNumUrl + '/' + args['num'], '',
					function(data) { solver.probData = [data]; });
			}
			if (solver.userId != 0) {
				var tmp = solver.userId + '/' + args['num'] + '/0';
				$.getJSON(subUserProbUrl + '/' + tmp, '',
					function(data) { solver.userData = data[solver.userId]; });
			}
		}
		if (args['database']) {
			$.getJSON('data/database.json', '',
				function(data) { solver.dbData = data; });
		}
		if (args['trans']) {
			$.getJSON('data/translate.json', '',
				function(data) { solver.transData = data; });
		}
	}
	loadData(args);
	$.ajaxSettings.async = true;
	/* ***************************************************** */
	/*                                                       */
	/*	處理 probData                                        */
	/*                                                       */
	/* ***************************************************** */
	if (solver.probData != undefined) {
		var probs = solver.probData;
		// 建立 Problem 物件
		for (var i = 0; i < probs.length; i++) {
			probs[i] = new UVaSolver.Problem(probs[i]);
		}
		// 依照 problem number 遞增排序
		probs.sort(function(left, right) {
			return left.getNumber() - right.getNumber();
		});
		// 建立 id, number 對應表
		for (var i = 0; i < probs.length; i++) {
			var prob = probs[i];
			rePid[prob.getPid()] = prob;
			reNum[prob.getNumber()] = prob;
		}
	}
	/* ***************************************************** */
	/*                                                       */
	/*	建立題單對應分類                                     */
	/*                                                       */
	/* ***************************************************** */
	if (solver.dbData != undefined) {
		var db = solver.dbData;
		for (var cate in db) {
			for (var chap in db[cate]) {
				for (var sect in db[cate][chap]) {
					var pNum = db[cate][chap][sect];
					for (var i = 0; i < pNum.length; i++) {
						var prob = reNum[ pNum[i] ];
						if (prob != undefined) {
							var res = cate + ' ' + chap + ' ' + sect;
							prob.getCategory().push(res);
						}
					}
				}
			}
		}
	}
	/* ***************************************************** */
	/*                                                       */
	/*	設定翻譯                                             */
	/*                                                       */
	/* ***************************************************** */
	if (solver.transData != undefined) {
		for (var name in solver.transData) {
			var trans = solver.transData[name]['trans'];
			for (var num in trans) {
				var prob = reNum[num];
				if (prob != undefined) {
					prob.getTranslate().push(name);
				}
			}
		}
	}

	// ==================================================================
	//
	//	設定上傳分類
	//
	// ==================================================================
	if (solver.userData != undefined) {
		var subs = solver.userData['subs'];
		// 建立 Submit 物件
		for (var i = 0; i < subs.length; i++) {
			subs[i] = new UVaSolver.Submit(subs[i]);
		}
		// 對時間遞減排序
		subs.sort(function(left, right) {
			return right.getTime() - left.getTime();
		});
		for (var i = 0; i < subs.length; i++) {
			var sub = subs[i];
			var sVerd = sub.getVerdit();
			var sTime = sub.getTime();
			var sRank = sub.getRank();
			var prob = rePid[sub.getPid()];
			if (prob != undefined) {
				var verd = prob.getVerdit();
				var stmp = prob.getTime();
				var rnk = prob.getRank();
				prob.getSubmit().push(sub);
				if (verd < sVerd || (verd == sVerd && stmp > sTime)) {
					prob.setVerdit(sVerd);
					prob.setTime(sTime);
				}
				if (verd == 90 && (rnk == 0 || rnk > sRank)) {
					prob.setTime(sTime);
					prob.setRank(sRank);
				}
			}
		}
	}
}

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
var query = (new UVaSolver.Query()).getAllArgs();
var args = {
	'type':		query['type'],
	'num':		query['num'],
	'prob':		true,
	'database':	true,
	'user':		ups.master,
	'trans':	true
};
var solver = new UVaSolver.Solver(args);