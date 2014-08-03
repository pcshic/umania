
var makeRow = function(row) {
	var res = '<div class="row">';
	for (var i = 0; i < row.length; i++) {
		res += '<div class="' + col(row[i][0]) + '">' +
					row[i][1] + '</div>';
	}
	res += '</div>';
	return res;
}
var makeRowTable = function(rows) {
	var res = '';
	for (var i = 0; i < rows.length; i++)
		res += makeRow(rows[i]);
	return res;
}

if (query.type) {
	if (query.type == 'single') {
		var prob	= solver.probData[0],
			pid		= prob.getPid(),
			num		= prob.getNumber(),
			title	= prob.getTitle(),
			cate	= Math.floor(num / 100),
			res		= '';
		// 題目資訊
		var info	= [
[[2, '<strong>題目名稱</strong>'],	[10, title]],
[[2, '<strong>題目編號</strong>'],	[2, num],
[2, '<strong>題目 ID</strong>'],	[2, pid]]
			],
			stat	= [
[[2, '<strong>AC 數</strong>'],		[2, prob.getAC()],
[2, '<strong>WA 數</strong>'],		[2, prob.getWA()],
[2, '<strong>PE 數</strong>'],		[2, prob.getPE()]],
[[2, '<strong>TLE 數</strong>'],	[2, prob.getTLE()],
[2, '<strong>OLE 數</strong>'],		[2, prob.getOLE()],
[2, '<strong>MLE 數</strong>'],		[2, prob.getMLE()]],
[[2, '<strong>CE 數</strong>'],		[2, prob.getCE()],
[2, '<strong>RE 數</strong>'],		[2, prob.getRE()],
[2, '<strong>RF 數</strong>'],		[2, prob.getRF()]]
			];
		// 原文參數
		var uvastyle	= ['btn-info', 'btn-warning'],
			view		= ['UVa 原文', 'external'],
			src			= ['http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=' + pid, 'http://uva.onlinejudge.org/external/' + cate + '/' + num + '.html'];
		// 翻譯參數
		var trans		= prob.getTranslate(),
			transtyle	= {
			'luckycat': 'btn-primary',
			'ruby 兔': 'btn-success',
			'unfortunate 狗': 'btn-danger'
			};
		// 開頭
		res += '<div class="page-header">\
				<h1>' + num + ' <small>' + title + '</small>\
				</h1></div>';
		// 第一部分
		res += '<div class="row">\
				<div id="info" class="' + col(8) + '">';
		// 題目資訊
		res += '<h3>題目資訊 <small>Information</small></h3>\
				<div>' + makeRowTable(info) + '</div>';
		// 統計
		res += '<h3>統計 <small>Statistics</small></h3>\
				<div>' + makeRowTable(stat) + '</div>';
		// 第一部分收尾
		res += '</div>';
		// 第二部分
		res += '<div class="' + col(4) + '">\
				<h3>原文 <small>Origin</small></h3>\
				<div>';
		// UVa 原文
		for (var i = 0; i < src.length; i++)
			res += '<a href="' + src[i] + '" class="btn ' + uvastyle[i] + '" target="_blank">' + view[i] + '</a>';
		res += '</div>';
		// 題目翻譯
		res += '<h3>翻譯 <small>Translations</small></h3>\
				<div>';
		for (var i = 0; i < trans.length; i++) {
			var transDb	= solver.transData[trans[i]],
				link	= transDb['site'] +
							transDb['trans'][num];
			res += '<a href="' + link + '" class="btn ' + transtyle[trans[i]] + '" target="_blank">' + trans[i] + '</a>';
		}
		res += '</div>';
		// 第二部分收尾
		res += '</div>';
		// 收尾
		res += '</div>';
		$('#result').append(res);
		/*
			個人上傳記錄
		*/
		// 上傳紀錄
		var subs = prob.getSubmit();
		if (subs.length) {
			$('#result').append('<div id="subs"></div>');
			$('#subs').append('<h2>上傳紀錄 <small>Submissions</small></h2>');
			$('#subs').append('<table id="subs" class="table table-condensed table-hover"><thead></thead><tbody></tbody></table>');
			var tmp = ['上傳編號', '結果', '語言', '上傳時間', '執行時間(秒)', '排名'];
			$('#subs thead').append('<tr><th>' + tmp.join('</th><th>') + '</th></tr>');
			for (var i = 0; i < subs.length; i++) {
				var sub = subs[i];
				tmp = [	sub.getSid(),
						sub.transVerdit(),
						sub.transLang(),
						sub.transTime(),
						sub.transRuntime(),
						sub.getRank()
						];
				$('#subs tbody').append('<tr><td>' + tmp.join('</td><td>') + '</td></tr>');
			}
		}
	}
	else if (query.type == 'all') {
		var probs = solver.probData;
		for (var i = 0; i < probs.length; i++) {
			var prob = probs[i];
			var num = prob.getNumber();
			var cate = Math.floor(num / 100);
			if (num % 100 == 0) {
				$('#result').append('<div id="' + cate + '"></div>');
				$('#' + cate).append('<h2>Volume ' + cate + '</h2>').append('<div id="part' + cate + '"></div>');
			}
			$('#part' + cate).append(prob.getStyle());
		}
	}
}
postRender();