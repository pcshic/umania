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
    res += '<p class="paragraph">' + des + '</p>';
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
  res += '<tr><th>' + subinfo.version + '</th><td>' + subinfo.date + '</td><td>' + getContent(subinfo.content) + '</td><td>';
  if (subinfo.image) {
    res += '<a href="' + subinfo.image + '">' +
        getImage(subinfo.image, { 'height': '50px' }) +
        '</a>';
  }
  res += '</td></tr>';
  return res;
}

var getSubversion = function(subver, code, compress) {
  var res = '';
  var id = 'subver-' + code;
  if (subver) {
    res += '\
      <h4>子版本 <span class="glyphicon glyphicon-folder-open folder' + ((compress)?' subver-close':'') + '" data-toggle="tooltip" data-placement="top" my-target="#' + id + '" title="點此隱藏子版本訊息"></span></h4>\
      <table id="' + id + '" class="table table-hover">';
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

var getVersionInfo = function(info, compress) {
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
        res += getSubversion(info.subversion, info.code, compress);
  res += '\
        </div>\
      </div>\
    </li>';
  return res;
}

var getBoardList = function(list, compress) {
  var res = '';
  res += '<ul class="list-group">';
  if (list.length) {
    for (var i in list)
      res += getVersionInfo(list[i], compress);
  }
  else res += getVersionInfo(list, compress);
  res += '</ul>';
  return res;
}

var getBoard = function(board) {
  var res = '';
  if (board) {
    res += '\
      <div id="board">\
        <h1>現在版本</h1>';
    res += getBoardList(board.current, false);
    res += '<h1>歷史版本 \
          <small>[<a id="hisTrigger">展開</a>]</small>\
        </h1>';
    res += '<div id="history">' +
          getBoardList(board.history, true) +
        '<div>';
    res += '\
      </div>';
  }
  return res;
}

$(function() {
  $.get('data/board.yml', '', function (data) {
    var board = YAML.parse(data);
    $('#result').append(getBoard(board));
    $('.folder')
    .tooltip()
    .click(function (e) {
      var args = {
        'hideClass': 'glyphicon-folder-close',
        'showClass': 'glyphicon-folder-open',
        'titleMsg': '點此隱藏子版本訊息'
      };
      if ($(this).hasClass('glyphicon-folder-open')) {
        args = {
          'hideClass': 'glyphicon-folder-open',
          'showClass': 'glyphicon-folder-close',
          'titleMsg': '點此顯示子版本訊息'
        };
      }
      $(this)
      .removeClass(args.hideClass)
      .addClass(args.showClass)
      .tooltip('hide')
      .attr('data-original-title', args.titleMsg)
      .tooltip('fixTitle');
      $($(this).attr('my-target')).toggle();
    });
    $('.subver-close')
    .click()
    .removeClass('subver-close');
    $('#hisTrigger')
    .click(function (e) {
      var str = '展開';
      if ($(this).val() == '展開')
        str = '隱藏';
      $(this).text(str);
      $('#history').toggle();
    })
    .click();
  });
});