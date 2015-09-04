var MAZERUNNER = MAZERUNNER || {};

MAZERUNNER.AIModule = (function () {

  var solution = [];

  var findSolution = function (entrance, exit, maze) {
    var stack = [entrance];
    var stepsTaken = [];

    while (stack.length > 0) {
      currentCell = stack.pop();
      stepsTaken.push(currentCell);
      currentCell.visited = true;

      if (!currentCell.hasTopWall) {
        var topCell = maze[currentCell.row - 1][currentCell.col]
        if (!topCell.visited) stack.push(topCell);
        if (topCell.id == exit.id) {
          solution = stepsTaken;
          return stepsTaken;
        }
      }
      if (!currentCell.hasBottomWall) {
        var bottomCell = maze[currentCell.row + 1][currentCell.col]
        if (!bottomCell.visited) stack.push(bottomCell);
        if (bottomCell.id == exit.id) {
          solution = stepsTaken;
          return stepsTaken;
        }
      }
      if (!currentCell.hasLeftWall) {
        var leftCell = maze[currentCell.row][currentCell.col - 1]
        if (!leftCell.visited) stack.push(leftCell);
        if (leftCell.id == exit.id) {
          solution = stepsTaken;
          return stepsTaken;
        }
      }
      if (!currentCell.hasRightWall) {
        var rightCell = maze[currentCell.row][currentCell.col + 1]
        if (!rightCell.visited) stack.push(rightCell);
        if (rightCell.id == exit.id) {
          solution = stepsTaken;
          return stepsTaken;
        }
      }
    }
    return "No solution found";
  }

  var getSolution = function () {
    return solution;
  }

  return {
    findSolution: findSolution,
    getSolution: getSolution,
  }

})();