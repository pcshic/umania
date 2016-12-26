var fs   = require('fs'),
    path = require('path'),
    glob = require('glob');

var res = {};

glob('../../source/_posts/*.md', {}, function (err, files) {
  files.map(function (path_to_file) {
    var file = path.parse(path_to_file);
    var name = file.name.match(/^p?(\d+)$/)[1];
    res[name] = file.name + '/';
  })
  fs.writeFile('translate.json', JSON.stringify(res));
})