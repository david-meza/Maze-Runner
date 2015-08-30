function Cell(id) {
  this.id = id;
  this.hasTopWall = true;
  this.hasRightWall = true;
  this.hasBottomWall = true;
  this.hasLeftWall = true;
  this.isBorder = false;
}

function newMaze(x, y) {

  // Establish variables and starting grid
  var totalCells = x*y;
  var cells = new Array();
  var unvisited = new Array();
  for (var i = 0; i < y; i++) {
    cells[i] = new Array();
    unvisited[i] = new Array();
    for (var j = 0; j < x; j++) {
      cells[i][j] = new Cell(i + "-" + j);
      unvisited[i][j] = true;
    }
  }

  // Set a random position to start from
  var currentCell = [Math.floor(Math.random()*y), Math.floor(Math.random()*x)];
  var path = [currentCell];
  unvisited[currentCell[0]][currentCell[1]] = false;
  var visited = 1;

  // Loop through all available cell positions
  while (visited < totalCells) {
    // Determine neighboring cells
    var pot = [ [currentCell[0]-1,  currentCell[1],   "hasTopWall",    "hasBottomWall"],
                [currentCell[0],    currentCell[1]+1, "hasRightWall",  "hasLeftWall"],
                [currentCell[0]+1,  currentCell[1],   "hasBottomWall", "hasTopWall"],
                [currentCell[0],    currentCell[1]-1, "hasLeftWall",   "hasRightWall"] ];
    var neighbors = new Array();

    // Determine if each neighboring cell is in game grid, and whether it has already been checked
    for (var l = 0; l < 4; l++) {
      if (pot[l][0] > -1 &&
          pot[l][0] < y &&
          pot[l][1] > -1 &&
          pot[l][1] < x &&
          unvisited[pot[l][0]][pot[l][1]]) {
        neighbors.push(pot[l]);
      }
    }

    // If at least one active neighboring cell has been found
    if (neighbors.length) {
        // Choose one of the neighbors at random
        next = neighbors[Math.floor(Math.random()*neighbors.length)];

        // Remove the wall between the current cell and the chosen neighboring cell
        cells[currentCell[0]][currentCell[1]][next[2]] = false;
        cells[next[0]][next[1]][next[3]] = false;

        // Mark the neighbor as visited, and set it as the current cell
        unvisited[next[0]][next[1]] = false;
        visited++;
        currentCell = [next[0], next[1]];
        path.push(currentCell);
      }
    // Otherwise go back up a step and keep going
    else {
      currentCell = path.pop();
    }
  }
  console.log(cells);
  return cells;
}
