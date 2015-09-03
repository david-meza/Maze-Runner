var player;

function Runner (start, goal) {
  this.start = start;
  this.currentCell = start;
  this.goal = goal;
  this.stepsTaken = 0;
}

Runner.prototype.movePlayer = function (event) {
  var KEY = { ESC: 27, SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 };
  if (player.currentCell.id === player.goal.id) {
    controller.finishMaze();
    return;
  };
  switch(event.keyCode) {
    case KEY.LEFT:   player.moveLeft();        break;
    case KEY.RIGHT:  player.moveRight();       break;
    case KEY.UP:     player.moveUp();          break;
    case KEY.DOWN:   player.moveDown();        break;
    case KEY.ESC:    controller.gameOver();    break;
  }
};

Runner.prototype.moveUp = function() {
  if (!this.currentCell.hasTopWall && this.currentCell.row - 1 >= 0) {
    var oldCell = this.currentCell
    this.currentCell = mazeModel.mazeCells[this.currentCell.row - 1][this.currentCell.col]
    this.stepsTaken++;
    view.updateRunnerPos(oldCell, this.currentCell, "player-up");
  };
};

Runner.prototype.moveDown = function() {
  if (!this.currentCell.hasBottomWall && this.currentCell.row + 1 < mazeModel.mazeHeight) {
    var oldCell = this.currentCell
    this.currentCell = mazeModel.mazeCells[this.currentCell.row + 1][this.currentCell.col]
    this.stepsTaken++;
    view.updateRunnerPos(oldCell, this.currentCell, "player-down");
  };
};

Runner.prototype.moveLeft = function() {
  if (!this.currentCell.hasLeftWall && this.currentCell.col - 1 >= 0) {
    var oldCell = this.currentCell
    this.currentCell = mazeModel.mazeCells[this.currentCell.row][this.currentCell.col - 1]
    this.stepsTaken++;
    view.updateRunnerPos(oldCell, this.currentCell, "player-left");
  };
};

Runner.prototype.moveRight = function() {
  if (!this.currentCell.hasRightWall && this.currentCell.col + 1 < mazeModel.mazeWidth) {
    var oldCell = this.currentCell
    this.currentCell = mazeModel.mazeCells[this.currentCell.row][this.currentCell.col + 1]
    this.stepsTaken++;
    view.updateRunnerPos(oldCell, this.currentCell, "player-right");
  };
};
