var mazeModel = {

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
    console.log(this.mazeCells)
  },

  generateMaze: function () {
    // Generate maze
    console.log(this.mazeWidth)
    console.log(this.mazeHeight)
    this.mazeCells = newMaze(this.mazeWidth, this.mazeHeight);
    this.setBorders();
    this.setRandEntranceExit();
  },

  createPlayers: function () {
    // Global obj
    player = new Runner(this.entrance, this.exit)
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
      this.entrance.hasTopWall = false;
      this.entrance.entrancePoint = "top";
      this.exit.hasBottomWall = false;

    } else if (entranceVal <= this.mazeWidth * 2 - 2 && entranceVal % 2 === 1) {
      // Entrance value is a bottom border
      var exitVal = Math.floor(Math.random() * this.mazeWidth) * 2;
      this.exit = this.borders[exitVal]
      this.entrance.hasBottomWall = false;
      this.exit.hasTopWall = false;
      this.entrance.entrancePoint = "bottom";

    } else if (entranceVal % 2 === 0) {
      // Entrance value is a left border
      var exitVal = Math.floor(Math.random() * this.mazeHeight) * 2 + this.mazeWidth * 2 + 1;
      this.exit = this.borders[exitVal]
      this.entrance.hasLeftWall = false;
      this.exit.hasRightWall = false;
      this.entrance.entrancePoint = "left";

    } else if (entranceVal % 2 === 1) {
      // Entrance value is a right border
      var exitVal = Math.floor(Math.random() * this.mazeHeight) * 2 + this.mazeWidth * 2;
      this.exit = this.borders[exitVal]
      this.entrance.hasRightWall = false;
      this.exit.hasLeftWall = false;
      this.entrance.entrancePoint = "right";
    };
    console.log(entranceVal);
    console.log(exitVal);
    console.log(this.entrance);
    console.log(this.exit);
  }

}