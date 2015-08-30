var mazeModel = {

  // 2D array = [row][column]
  mazeCells: [],
  borders: [],
  mazeWidth: 30,
  mazeHeight: 20,
  entrance: null,
  exit: null,

  init: function () {
    this.generateMaze();
  },

  generateMaze: function () {
    // Generate maze
    mazeModel.mazeCells = newMaze(mazeModel.mazeWidth, mazeModel.mazeHeight);
    // Set borders
    var cells = mazeModel.mazeCells
    // Top [0][0]... to [0][mazeWidth]
    // Bottom [mazeHeight][0]... to [mazeHeight][mazeWidth]
    for (var yCoord = 0; yCoord < mazeModel.mazeWidth; yCoord++) {
      var topCell = cells[0][yCoord];
      var bottomCell = cells[mazeModel.mazeHeight-1][yCoord];
      topCell.isBorder = true;
      bottomCell.isBorder = true;
      this.borders.push(topCell);
      this.borders.push(bottomCell);
    }
    // Left [0][0]... to [mazeHeight][0]
    // Right [0][MazeWidth]... to [mazeHeight][mazeWidth]
    for (var xCoord = 0; xCoord < mazeModel.mazeHeight; xCoord++) {
      var leftCell = cells[xCoord][0];
      var rightCell = cells[xCoord][mazeModel.mazeWidth-1];
      leftCell.isBorder = true;
      rightCell.isBorder = true;
      this.borders.push(leftCell);
      this.borders.push(rightCell);
    }

    console.log(this.borders)
    console.log(this.borders.length)

  }

}

var view = {

  init: function () {
    this.addMazeBorders();
  },

  addMazeBorders: function() {
    // Shorten the name...
    var cells = mazeModel.mazeCells
    for (var i = 0; i < cells.length; i++) {
      $('#maze tbody').append("<tr>");
      for (var j = 0; j < cells[i].length; j++) {
        var selector = i+"-"+j;
        $('#maze tbody').append("<td id='"+selector+"'>&nbsp;</td>");
        if (cells[i][j].hasTopWall) { $('#'+selector).addClass("wall-top"); }
        if (cells[i][j].hasRightWall) { $('#'+selector).addClass("wall-right"); }
        if (cells[i][j].hasBottomWall) { $('#'+selector).addClass("wall-bottom"); }
        if (cells[i][j].hasLeftWall) { $('#'+selector).addClass("wall-left"); }
      }
      $('#maze tbody').append("</tr>");
    }
  }
}

var controller = {

  init: function () {
    mazeModel.init();
    view.init();
  }
}

$(function() {
  controller.init();
});


