var MAZERUNNER = MAZERUNNER || {}

MAZERUNNER.controller = {

  itvl: null,
  currentWidth: 4,
  currentHeight: 4,

  init: function () {
    MAZERUNNER.mazeModel.init(this.currentWidth, this.currentHeight);
    MAZERUNNER.view.init();
    MAZERUNNER.controller.setListeners();
    MAZERUNNER.controller.play();
  },

  setListeners: function () {
    $(window).on("keydown", MAZERUNNER.player.movePlayer);
    $("#play-again").click(MAZERUNNER.controller.createNextMaze);
  },

  finishMaze: function () {
    MAZERUNNER.scores.submitScore();
    MAZERUNNER.view.toggleFinish();
    clearInterval(this.itvl)
    $(window).off();
  },

  play: function () {
    this.itvl = setInterval(function() {
      console.log("counting...")
      MAZERUNNER.scores.increaseTime();
      MAZERUNNER.view.updateTime();
    }, 1000)
  },

  createNextMaze: function() {
    // Completion bonus
    MAZERUNNER.scores.mazesCompleted++;
    MAZERUNNER.scores.currentScore += 1000 * MAZERUNNER.scores.mazesCompleted // Bonus!
    // Reset old maze
    MAZERUNNER.scores.time = 0;
    MAZERUNNER.view.toggleFinish();
    MAZERUNNER.mazeModel.mazeCells = [];
    MAZERUNNER.mazeModel.borders = [];
    $('#maze tbody').empty();
    // Create new one
    if (MAZERUNNER.controller.currentHeight <= 20) MAZERUNNER.controller.currentHeight += 2;
    if (MAZERUNNER.controller.currentWidth <= 32) MAZERUNNER.controller.currentWidth += 2;
    MAZERUNNER.mazeModel.init(MAZERUNNER.controller.currentWidth, MAZERUNNER.controller.currentHeight);
    MAZERUNNER.view.init();
    $(window).on("keydown", MAZERUNNER.player.movePlayer);
    MAZERUNNER.controller.play();
  },
}

$(function() {
  MAZERUNNER.controller.init();
});


