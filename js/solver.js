// ===================================================================
//
//	
//
// ===================================================================
var Util = function() {}
Util.transLang		= function(type) { return Util.lang[type]; }
Util.transVerdit	= function(verd) { return Util.verdit[verd]; }
Util.lang = ['', 'ANSI C', 'Java', 'C++', 'Pascal', 'C++11'];
Util.verdit = {
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
Util.btnStyle = {
	0: 'default',	10: 'info',		15: 'info',		20: 'info',
	30: 'warning',	35: 'info',		40: 'primary',	45: 'primary',
	50: 'primary',	60: 'primary',	70: 'danger',	80: 'warning',
	90: 'success'
}

// ===================================================================
//
//	Submit 物件
//
// ===================================================================
var Submit = function(data) {
	this.sub = data;
	this.sub[4] = new Date(this.sub[4] * 1000);
}
Submit.prototype = {
	getSid:			function() { return this.sub[0]; },
	getPid:			function() { return this.sub[1]; },
	getVerdit:		function() { return this.sub[2]; },
	getRuntime:		function() { return this.sub[3]; },
	getTime:		function() { return this.sub[4]; },
	getLang:		function() { return this.sub[5]; },
	getRank:		function() { return this.sub[6]; },
	transVerdit:	function() { return Util.transVerdit(this.sub[2]); },
	transLang:		function() { return Util.transLang(this.sub[5]); },
	transRuntime:	function() {
		var res = '0.';
		for (var i = 100; i > 1; i /= 10) {
			if (this.sub[3] < i)
				res += '0';
		}
		res += this.sub[3];
		return res;
	},
	transTime:		function() {
		var date = this.sub[4];
		var tmp = -date.getTimezoneOffset();
		var aff = ['', '', 'GMT' + ((tmp < 0)? '-': '+')];
		if (tmp < 0) tmp = -tmp;
		var sep = ['-', ':', ''];
		var time = [
			[date.getFullYear(),	date.getMonth() + 1,	date.getDate()],
			[date.getHours(),		date.getMinutes(),		date.getSeconds()],
			[Math.floor(tmp / 60),	tmp % 60]
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
};

// ===================================================================
//
//	Problem 物件
//
// ===================================================================
var Problem = function(data) {
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
Problem.prototype = {
	getPid:			function() { return this.prob[0]; },
	getNumber:		function() { return this.prob[1]; },
	getTitle:		function() { return this.prob[2]; },
	getCE:			function() { return this.prob[10]; },
	getRF:			function() { return this.prob[11]; },
	getRE:			function() { return this.prob[12]; },
	getOLE:			function() { return this.prob[13]; },
	getTLE:			function() { return this.prob[14]; },
	getMLE:			function() { return this.prob[15]; },
	getWA:			function() { return this.prob[16]; },
	getPE:			function() { return this.prob[17]; },
	getAC:			function() { return this.prob[18]; },
	getCategory:	function() { return this.prob[21]; },
	getSubmit:		function() { return this.prob[22]; },
	getVerdit:		function() { return this.prob[23]; },
	getTime:		function() { return this.prob[24]; },
	getRank:		function() { return this.prob[25]; },
	getTranslate:	function() { return this.prob[26]; },
	setVerdit:		function(verd) { this.prob[23] = verd; },
	setTime:		function(stmp) { this.prob[24] = stmp; },
	setRank:		function(rank) { this.prob[25] = rank; },
	getStyle:		function(args) {
		var res = '';
		var prob = this;
		var val = prob.getNumber();
		var query = (new Query()).addArgs({
				'type': 'single',
				'num': val
			}).keepArgs(['user', 'type', 'num']);
		if (args == undefined)
			args = 'tc';
		// 設定題號顏色
		var btnAttr = 'btn-' + Util.btnStyle[ prob.getVerdit() ];
		res += '<a id="uva' + val + '" href="problem.html?' + query + '" type="button" class="btn ' + btnAttr + '" target="_blank">' + val + ' ';
		// 設定翻譯
		if (args.indexOf('t') >= 0) {
			var trans = prob.getTranslate();
			for (var i = 0; i < trans.length; i++) {
				res += '<span id="tooltip" class="glyphicon glyphicon-transfer" data-toggle="tooltip" data-original-title="' + trans[i] + '"></span>';
			}
		}
		// 設定章節
		if (args.indexOf('c') >= 0) {
			var tags = prob.getCategory();
			for (var i = 0; i < tags.length; i++) {
				res += '<span id="tooltip" class="glyphicon glyphicon-tag" data-toggle="tooltip" data-original-title="' + tags[i] + '"></span>';
			}
		}
		// 結尾
		res += '</a>'
		return res;
	}
};

// ===================================================================
//
//	Solver 物件
//
// ===================================================================
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
var Solver = function(args) {
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
	if (args['type'] == undefined)
		args['type'] = 'all';
	if (args['prob'] == undefined)
		args['prob'] = true;
	if (args['database'] == undefined)
		args['database'] = true;
	if (args['trans'] == undefined)
		args['trans'] = true;

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

	// ===================================================================
	//
	//	處理 probData
	//
	// ===================================================================
	if (solver.probData != undefined) {
		var probs = solver.probData;
		// 建立 Problem 物件
		for (var i = 0; i < probs.length; i++) {
			probs[i] = new Problem(probs[i]);
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

	// ===================================================================
	//
	//	建立題單對應分類
	//
	// ===================================================================
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

	// ===================================================================
	//
	//	設定翻譯
	//
	// ===================================================================
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

	// ===================================================================
	//
	//	設定上傳分類
	//
	// ===================================================================
	if (solver.userData != undefined) {
		var subs = solver.userData['subs'];
		// 建立 Submit 物件
		for (var i = 0; i < subs.length; i++) {
			subs[i] = new Submit(subs[i]);
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