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
    $("#next-maze").click(MAZERUNNER.controller.createNextMaze);
    $("#game-over").click(MAZERUNNER.controller.refreshGame);
  },

  refreshGame: function () {
    location.reload();
  },

  finishMaze: function () {
    MAZERUNNER.scores.submitScore();
    MAZERUNNER.view.toggleFinish();
    clearInterval(this.itvl)
    $(window).off();
  },

  play: function () {
    this.itvl = setInterval(function() {
      MAZERUNNER.scores.increaseTime();
      MAZERUNNER.view.updateTime();
      MAZERUNNER.ai.moveAI();
    }, 1000 / 60)
  },

  gameOver: function () {
    MAZERUNNER.view.showGameOver();
    clearInterval(this.itvl)
    $(window).off();
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
    if (MAZERUNNER.controller.currentHeight <= 18) MAZERUNNER.controller.currentHeight += 2;
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


