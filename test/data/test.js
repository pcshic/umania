var YAML = require('yamljs');
var obj = require('./translate.json');
/*
var trans = YAML.load('database.yml');
var str = JSON.stringify(trans, 4);
*/

var str = YAML.stringify(obj, 4);

console.log(str);