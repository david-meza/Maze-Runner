var MAZERUNNER = MAZERUNNER || {}

MAZERUNNER.mazeModel = {

  // 2D array = [row][column]
  mazeCells: [],
  borders: [],
  mazeWidth: null,
  mazeHeight: null,
  entrance: null,
  exit: null,

  init: function (w, h) {
    this.mazeWidth = w;
    this.mazeHeight = h;
    this.generateMaze();
    this.createPlayers();
  },

  generateMaze: function () {
    this.mazeCells = MAZERUNNER.MazeGenerator.newMaze(this.mazeWidth, this.mazeHeight);
    this.setBorders();
    this.setRandEntranceExit();
    this.generateRandomBonuses();
  },

  generateRandomBonuses: function () {
    // Places freebies according to maze size
    var freebies = ["purple-rupee", "cyan-rupee", "blue-rupee", "pink-rupee", "green-rupee", "gold-rupee", "red-rupee"]
    var targetCells = MAZERUNNER.getRandomSubarray(this.mazeCells[Math.floor(Math.random() * this.mazeHeight)], Math.floor(this.mazeWidth / 2))
    console.log(targetCells)
    for (var i = 0; i < targetCells.length; i++) {
      targetCells[i].bonus = freebies[Math.floor(Math.random() * 6)]
    };
    console.log(targetCells)
  },

  createPlayers: function () {
    // Namespace obj
    MAZERUNNER.player = new MAZERUNNER.RunnerModule.Runner(this.entrance, this.exit)
    var sol = MAZERUNNER.AIModule.findSolution(this.entrance, this.exit, this.mazeCells)
    MAZERUNNER.ai = new MAZERUNNER.RunnerModule.Runner(this.entrance, this.exit, sol)
  },

  setBorders: function () {
    var cells = this.mazeCells
    // Top [0][0]... to [0][mazeWidth]
    // Bottom [mazeHeight][0]... to [mazeHeight][mazeWidth]
    for (var yCoord = 0; yCoord < this.mazeWidth; yCoord++) {
      var topCell = cells[0][yCoord];
      var bottomCell = cells[this.mazeHeight-1][yCoord];
      topCell.isBorder = true;
      bottomCell.isBorder = true;
      this.borders.push(topCell);
      this.borders.push(bottomCell);
    }
    // Left [0][0]... to [mazeHeight][0]
    // Right [0][MazeWidth]... to [mazeHeight][mazeWidth]
    for (var xCoord = 0; xCoord < this.mazeHeight; xCoord++) {
      var leftCell = cells[xCoord][0];
      var rightCell = cells[xCoord][this.mazeWidth-1];
      leftCell.isBorder = true;
      rightCell.isBorder = true;
      this.borders.push(leftCell);
      this.borders.push(rightCell);
    }

    console.log(this.borders)

  },

  setRandEntranceExit: function () {
    var perimeter = this.borders.length
    var entranceVal = Math.floor(Math.random() * perimeter)
    this.entrance = this.borders[entranceVal];

    if (entranceVal < 0 || entranceVal >= perimeter) {
      console.log("Errr... Fix your entrance value. It was" + entranceVal);

    } else if (entranceVal <= this.mazeWidth * 2 - 2 && entranceVal % 2 === 0) {
      // Entrance value is a top border
      var exitVal = Math.floor(Math.random() * this.mazeWidth) * 2 + 1;
      this.exit = this.borders[exitVal]
      // this.entrance.hasTopWall = false;
      this.entrance.entrancePoint = "top";
      // this.exit.hasBottomWall = false;

    } else if (entranceVal <= this.mazeWidth * 2 - 2 && entranceVal % 2 === 1) {
      // Entrance value is a bottom border
      var exitVal = Math.floor(Math.random() * this.mazeWidth) * 2;
      this.exit = this.borders[exitVal]
      // this.entrance.hasBottomWall = false;
      // this.exit.hasTopWall = false;
      this.entrance.entrancePoint = "bottom";

    } else if (entranceVal % 2 === 0) {
      // Entrance value is a left border
      var exitVal = Math.floor(Math.random() * this.mazeHeight) * 2 + this.mazeWidth * 2 + 1;
      this.exit = this.borders[exitVal]
      // this.entrance.hasLeftWall = false;
      // this.exit.hasRightWall = false;
      this.entrance.entrancePoint = "left";

    } else if (entranceVal % 2 === 1) {
      // Entrance value is a right border
      var exitVal = Math.floor(Math.random() * this.mazeHeight) * 2 + this.mazeWidth * 2;
      this.exit = this.borders[exitVal]
      // this.entrance.hasRightWall = false;
      // this.exit.hasLeftWall = false;
      this.entrance.entrancePoint = "right";
    };
    console.log(entranceVal);
    console.log(exitVal);
    console.log(this.entrance);
    console.log(this.exit);
  }

}

MAZERUNNER.getRandomSubarray = function(arr, size) {
  var shuffled = arr.slice(0), i = arr.length, temp, index;
  while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}