var UspBoard = function (data) {
  var UpsBoard = this;
  UpsBoard.board_info = data;

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

  var getSubversion = function(subver, code) {
    var res = '';
    var id = 'subver-' + code;
    if (subver) {
      res += '<h4>子版本 <span class="glyphicon glyphicon-folder-open folder" data-toggle="tooltip" data-placement="top" my-target="#' + id + '" title="點此隱藏子版本訊息"></span></h4><table id="' + id + '" class="table table-hover">';
        if (subver.length) {
          for (var i = 0; i < subver.length; i++)
            res += getSubversionInfo(subver[i]);
        }
        else res += getSubversionInfo(subver);
      res += '</table>';
    }
    return res;
  }

  var getTitle = function(info, code) {
    return '<header class="panel-heading" role="tab" id="heading-' + code + '"><h2 class="panel-title collapsed" aria-controls="collapse-' + code + '" aria-expanded="true" href="#collapse-' + code + '" data-parent="#accordion" data-toggle="collapse"><span class="glyphicon glyphicon-send"></span> ' + info.code + ' (' + info.version + ') <small>' + info.date + '</small></h2></header>';
  }

  var getVersionBody = function(info, code) {
    return '<div id="collapse-' + code + '" class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading-' + code + '"><div class="panel-body media">' + getImage(info.image || 'img/blank.png', {'class': 'media-object pull-right', 'width': '300px'}) + '<div class="media-body version-body">' + getDescription(info.description) + getContent(info.content) + getSubversion(info.subversion, info.code) + '</div></div></div>';
  }

  var getVersion = function(info) {
    var code = info.code.replace(/[\s.]+/g, '-');
    return '<article class="panel panel-default">' + getTitle(info, code) + getVersionBody(info, code) + '</article>';
  }

  /* ***************************************************** */
  /*                                                       */
  /*  getBoard 函數                                        */
  /*    公告欄的架構，直接被初始化程式呼叫。               */
  /*                                                       */
  /* ***************************************************** */
  var getBoard = function() {
    var board = UpsBoard.board_info;
    var res = '';
    if (board && board.length) {
      res += '<section id="versions" class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">';
      for (var i in board) {
        res += getVersion(board[i]);
      }
      res += '</section>';
    }
    return res;
  }
  UpsBoard.getBoard = getBoard();
}

/* ***************************************************** */
/*                                                       */
/*  開始初始化公告欄                                     */
/*                                                       */
/* ***************************************************** */
$(function () {
  $.get('data/board.yml', '', function (data) {
    var board = new UspBoard(YAML.parse(data));
    /* ***************************************************** */
    /*                                                       */
    /*  初始化佈告欄排版                                     */
    /*                                                       */
    /* ***************************************************** */
    $('#result').append(board.getBoard());
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
  });
});