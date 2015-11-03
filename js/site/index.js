var postRender = function() {
  $('[data-toggle="tooltip"]').tooltip();
}

$(function () {
  loadPractice();
  loadProblemSet();
  loadBoard();
  postRender();
});