/*
	設定題單
*/
if (query['category']) {
	var cates = [];
	if (query['category'] == 'all') {
		for (var key in solver.dbData)
			cates.push(key);
	}
	else {
		cates.push(query['category']);
	}
	var db = solver.dbData;
	for (var pid = 0; pid < cates.length; pid++) {
		var part = cates[pid];
		var partId = 'part' + pid;
		var partSelect = '#part' + pid;
		$('#result').append('<div id="' + partId + '"></div>');
		$(partSelect).append('<div class="page-header"><h2>' + part + '</h2></div>');
		var cid = 0;
		for (var chap in db[part]) {
			var chapId = 'chapter' + cid;
			var chapSelect = partSelect + ' #' + chapId;
			$(partSelect).append('<div id="' + chapId + '"></div>');
			$(chapSelect).append('<h3>' + chap + '</h3>');
			var sid = 0;
			for (var sect in db[part][chap]) {
				var sectId = 'section' + sid;
				var sectSelect = chapSelect + ' #' + sectId;
				if (sid % 4 == 0) {
					var bid = Math.floor(sid / 4);
					var blockId = 'block' + bid;
					var blockSelect = chapSelect + ' #' + blockId;
					$(chapSelect).append('<div id="' + blockId + '" class="row"></div>');
					for (var i = 0; i < 4; i++) {
						var tmpSectId = 'section' + (sid + i);
						$(blockSelect).append('<div id="' + tmpSectId + '" class="' + col(3) + '"></div>');
					}
				}
				$(sectSelect).append('<h4>' + sect + '</h4>');
				var probs = db[part][chap][sect]['volume'];
				for (var i = 0; i < probs.length; i++) {
					var prob = probs[i];
					$(sectSelect).append(prob.getStyle('t'));
				}
				sid++;
			}
			cid++;
		}
	}
}
else {
	;
}
postRender();