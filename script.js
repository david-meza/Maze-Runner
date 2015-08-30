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
    this.mazeCells = newMaze(this.mazeWidth, this.mazeHeight);
    this.setBorders();
    this.setRandEntranceExit();
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
    // Does not add 4 board corners again
    for (var xCoord = 1; xCoord < this.mazeHeight - 1; xCoord++) {
      var leftCell = cells[xCoord][0];
      var rightCell = cells[xCoord][this.mazeWidth-1];
      leftCell.isBorder = true;
      rightCell.isBorder = true;
      this.borders.push(leftCell);
      this.borders.push(rightCell);
    }

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
      this.exit.hasBottomWall = false;
      view.showEntranceExit("top");

    } else if (entranceVal <= this.mazeWidth * 2 - 2 && entranceVal % 2 === 1) {
      // Entrance value is a bottom border
      var exitVal = Math.floor(Math.random() * this.mazeWidth) * 2;
      this.exit = this.borders[exitVal]
      this.entrance.hasBottomWall = false;
      this.exit.hasTopWall = false;
      view.showEntranceExit("bottom");

    } else if (entranceVal % 2 === 0) {
      // Entrance value is a left border
      var exitVal = Math.floor(Math.random() * this.mazeHeight - 2) * 2 + 60 + 1;
      this.exit = this.borders[exitVal]
      this.entrance.hasLeftWall = false;
      this.exit.hasRightWall = false;
      view.showEntranceExit("left");

    } else if (entranceVal % 2 === 1) {
      // Entrance value is a right border
      var exitVal = Math.floor(Math.random() * this.mazeHeight - 2) * 2 + 60;
      this.exit = this.borders[exitVal]
      this.entrance.hasLeftWall = false;
      this.exit.hasRightWall = false;
      view.showEntranceExit("right");
    };

    console.log(this.entrance);
    console.log(this.exit);
  }

}

var view = {

  init: function () {
    this.addMazeBorders();
    this.showEntranceExit();
  },

  addMazeBorders: function () {
    // To shorten the name...
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
  },

  showEntranceExit: function (entrance) {
    // $entranceCell = $("#" + mazeModel.entrance.id)
    // $exitCell = $("#" + mazeModel.exit.id)
    // console.log($entranceCell);
    // console.log($exitCell);
    // switch(entrance) {
    //   case "top":
    //     $("#entrance").css("left", $entranceCell.position().left);
    //     break;
    //   case "bottom":
    //     $("#entrance").css("left", $entranceCell.position().left)
    //                   .css("top", $entranceCell.position().top);
    //     break;
    // }

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


