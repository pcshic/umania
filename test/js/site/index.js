/* ***************************************************** */
/*                                                       */
/*  getImage 函數                                        */
/*    設定圖片。                                         */
/*                                                       */
/* ***************************************************** */
var getImage = function(image, option) {
  res = '<img src="' + image + '"';
  for (var attr in option)
    res += ' ' + attr + '="' + option[attr] + '"';
  res += '>';
  return res;
}

var getTitle = function(code, version, date) {
  res = '<h3 class="page-header">版本 ';
  if (code) res += code + ' (' + version + ')';
  else      res += version;
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
  res = '<tr><th>' + subinfo.version + '</th><td>' + subinfo.date + '</td><td>' + getContent(subinfo.content) + '</td><td>';
  if (subinfo.image) {
    res += '<a href="' + subinfo.image + '">' +
      getImage(subinfo.image, { 'height': '50px' }) + '</a>';
  }
  res += '</td></tr>';
  return res;
}

var getSubversion = function(subver, code, compress) {
  var res = '';
  var id = 'subver-' + code;
  if (subver) {
    res += '<h4>子版本 <span class="glyphicon glyphicon-folder-open folder' + ((compress)?' subver-close':'') + '" data-toggle="tooltip" data-placement="top" my-target="#' + id + '" title="點此隱藏子版本訊息"></span></h4><table id="' + id + '" class="table table-hover">';
      if (subver.length) {
        for (var i = 0; i < subver.length; i++)
          res += getSubversionInfo(subver[i]);
      }
      else res += getSubversionInfo(subver);
    res += '</table>';
  }
  return res;
}

var getVersionInfo = function(info, compress) {
  var res =
    '<li class="list-group-item"><article class="media">' +
      getImage(info.image || 'img/blank.png', {
        'class': 'media-object pull-right',
        'width': '300px'
      }) +
    '<div class="media-body">' +
    '<header class="version-title">' + getTitle(info.code, info.version, info.date) + '</header>' +
    '<div class="version-body">' +
      getDescription(info.description) +
      getContent(info.content) +
      getSubversion(info.subversion, info.code, compress) +
    '</div></div></article></li>';
  return res;
}
/* ***************************************************** */
/*                                                       */
/*  getBoardList 函數:                                   */
/*    列出版本號，分成現在版本 (current) 和歷史版本      */
/*    (history)，compress 預設是否合起。                 */
/*                                                       */
/* ***************************************************** */
var getBoardList = function(list, compress) {
  var res = '<ul class="list-group">';
  if (list.length) {
    for (var i in list)
      res += getVersionInfo(list[i], compress);
  }
  else res += getVersionInfo(list, compress);
  res += '</ul>';
  return res;
}
/* ***************************************************** */
/*                                                       */
/*  getBoard 函數                                        */
/*    公告欄的架構，直接被初始化程式呼叫。               */
/*                                                       */
/* ***************************************************** */
var getBoard = function(board) {
  var res = '';
  if (board) {
    res +=
    '<section id="current-version"><header><h1>現在版本</h1></header>' + getBoardList(board.current, false) + '</section>' +
    '<section id="history-version"><header><h1>歷史版本 <small>[<a id="hisTrigger">隱藏</a>]</small></h1></header><div id="history-list">' + getBoardList(board.history, true) + '</div>' +
    '</section>';
  }
  return res;
}

/* ***************************************************** */
/*                                                       */
/*  開始初始化公告欄                                     */
/*                                                       */
/* ***************************************************** */
$(function () {
  $.get('data/board.yml', '', function (data) {
    var board = YAML.parse(data);
    /* ***************************************************** */
    /*                                                       */
    /*  初始化佈告欄排版                                     */
    /*                                                       */
    /* ***************************************************** */
    $('#result').append(getBoard(board));
    /* ***************************************************** */
    /*                                                       */
    /*  初始化子版本縮放                                     */
    /*                                                       */
    /* ***************************************************** */
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
    /* ***************************************************** */
    /*                                                       */
    /*  預設子版本關閉狀態                                   */
    /*                                                       */
    /* ***************************************************** */
    $('.subver-close')
    .click()
    .removeClass('subver-close');
    $('#hisTrigger')
    .click(function (e) {
      var str = '隱藏';
      if ($(this).text() == '隱藏')
        str = '展開';
      $(this).text(str);
      $('#history-list').toggle();
    })
    .click();
  });
});