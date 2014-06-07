// ===================================================================
//
//	Query 物件
//
// ===================================================================
var Query = function(href) {
	var query = this;
	if (href == undefined)
		href = window.location.href;
	query.vars = {};
	if (href.indexOf('?') >= 0) {
		var hashes = href.slice(href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
			var hash = hashes[i].split('=');
			query.vars[hash[0]] = query.decodeStep(hash[1]);
		}
	}
}
Query.prototype = {
	encodeStep:	function(data) {
		return data.toString().replace(/\s/g, '+');
	},
	decodeStep:	function(data) {
		return decodeURI(data).replace(/\+/g,' ');
	},
	toString:	function() {
		var res = [];
		var query = this;
		for (var key in query.vars) {
			var value = query.encodeStep(query.vars[key]);
			res.push([key, value].join('='));
		}
		return res.join('&');
	},
	addArgs:	function(args) {
		var query = this;
		for (var key in args) {
			if (args[key] != undefined)
				query.vars[key] = args[key];
		}
		return query;
	},
	removeArgs:	function(keys) {
		var query = this;
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			delete query.vars[key];
		}
		return query;
	},
	keepArgs:	function(keys) {
		var rev = {};
		var query = this;
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			rev[key] = true;
		}
		for (var key in query.vars) {
			if (rev[key] != true)
				delete query.vars[key];
		}
		return query;
	},
	getArg:		function(key) {
		return this.vars[key];
	},
	getArgs:	function(keys) {
		return this.keepArgs(keys).getAllArgs();
	},
	getAllArgs:	function() {
		var res = {};
		var query = this;
		for (var key in query.vars) {
			res[key] = query.vars[key];
		}
		return res;
	}
}
// ===================================================================
//
//
//
// ===================================================================
var none = function(obj) {
	return obj == undefined || obj == '';
}