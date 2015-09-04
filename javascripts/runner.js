var MAZERUNNER = MAZERUNNER || {};

MAZERUNNER.RunnerModule = (function () {

  function Runner (start, goal, sol) {
    this.start = start;
    this.currentCell = start;
    this.goal = goal;
    this.stepsTaken = 0;
    this.solution = sol || [];
  }

  Runner.prototype.movePlayer = function (event) {
    var KEY = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
    switch(event.keyCode) {
      case KEY.LEFT:   MAZERUNNER.player.moveLeft();        break;
      case KEY.RIGHT:  MAZERUNNER.player.moveRight();       break;
      case KEY.UP:     MAZERUNNER.player.moveUp();          break;
      case KEY.DOWN:   MAZERUNNER.player.moveDown();        break;
      case KEY.ESC:    MAZERUNNER.controller.gameOver();    break;
    }
    if (MAZERUNNER.player.currentCell.id === MAZERUNNER.player.goal.id) {
      MAZERUNNER.controller.finishMaze();
    };
  };

  Runner.prototype.moveAI = function () {
    if (MAZERUNNER.scores.frames % Math.min((30 + MAZERUNNER.scores.mazesCompleted * 2), 60) != 0) return;
    var oldCell = this.currentCell
    console.log(this.solution)
    if (this.solution.length > 0) {
      this.currentCell = this.solution.shift();
    } else {
      MAZERUNNER.controller.gameOver();
    };
    this.stepsTaken++;
    MAZERUNNER.view.updateAIPos(oldCell, this.currentCell, "ai");
  };

  Runner.prototype.moveUp = function() {
    if (!this.currentCell.hasTopWall && this.currentCell.row - 1 >= 0) {
      var oldCell = this.currentCell
      this.currentCell = MAZERUNNER.mazeModel.mazeCells[this.currentCell.row - 1][this.currentCell.col]
      this.stepsTaken++;
      MAZERUNNER.view.updateRunnerPos(oldCell, this.currentCell, "player player-up");
    };
    if (this.currentCell.bonus) {
      // MAZERUNNER.scores.applyBonus();
      MAZERUNNER.view.removeBonusClass(this.currentCell);
    };
  };

  Runner.prototype.moveDown = function() {
    if (!this.currentCell.hasBottomWall && this.currentCell.row + 1 < MAZERUNNER.mazeModel.mazeHeight) {
      var oldCell = this.currentCell
      this.currentCell = MAZERUNNER.mazeModel.mazeCells[this.currentCell.row + 1][this.currentCell.col]
      this.stepsTaken++;
      MAZERUNNER.view.updateRunnerPos(oldCell, this.currentCell, "player player-down");
    };
    if (this.currentCell.bonus) {
      // MAZERUNNER.scores.applyBonus();
      MAZERUNNER.view.removeBonusClass(this.currentCell);
    };
  };

  Runner.prototype.moveLeft = function() {
    if (!this.currentCell.hasLeftWall && this.currentCell.col - 1 >= 0) {
      var oldCell = this.currentCell
      this.currentCell = MAZERUNNER.mazeModel.mazeCells[this.currentCell.row][this.currentCell.col - 1]
      this.stepsTaken++;
      MAZERUNNER.view.updateRunnerPos(oldCell, this.currentCell, "player player-left");
    };
    if (this.currentCell.bonus) {
      // MAZERUNNER.scores.applyBonus();
      MAZERUNNER.view.removeBonusClass(this.currentCell);
    };
  };

  Runner.prototype.moveRight = function() {
    if (!this.currentCell.hasRightWall && this.currentCell.col + 1 < MAZERUNNER.mazeModel.mazeWidth) {
      var oldCell = this.currentCell
      this.currentCell = MAZERUNNER.mazeModel.mazeCells[this.currentCell.row][this.currentCell.col + 1]
      this.stepsTaken++;
      MAZERUNNER.view.updateRunnerPos(oldCell, this.currentCell, "player player-right");
    };
    if (this.currentCell.bonus) {
      // MAZERUNNER.scores.applyBonus();
      MAZERUNNER.view.removeBonusClass(this.currentCell);
    };
  };

  return {
    Runner: Runner,
  }

})();
