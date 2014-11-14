var postRender = function() {
  $('[data-toggle="tooltip"]').tooltip();
  $('body').scrollspy({ target: '#menu' });
}

$(function () {
  loadPractice();
  loadProblemSet();
  loadBoard();
  postRender();
});