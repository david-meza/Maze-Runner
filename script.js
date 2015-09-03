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
    view.updateRunnerPos(oldCell, this.currentCell);
  };
};

Runner.prototype.moveDown = function() {
  if (!this.currentCell.hasBottomWall && this.currentCell.row + 1 < mazeModel.mazeHeight) {
    var oldCell = this.currentCell
    this.currentCell = mazeModel.mazeCells[this.currentCell.row + 1][this.currentCell.col]
    this.stepsTaken++;
    view.updateRunnerPos(oldCell, this.currentCell);
  };
};

Runner.prototype.moveLeft = function() {
  if (!this.currentCell.hasLeftWall && this.currentCell.col - 1 >= 0) {
    var oldCell = this.currentCell
    this.currentCell = mazeModel.mazeCells[this.currentCell.row][this.currentCell.col - 1]
    this.stepsTaken++;
    view.updateRunnerPos(oldCell, this.currentCell);
  };
};

Runner.prototype.moveRight = function() {
  if (!this.currentCell.hasRightWall && this.currentCell.col + 1 < mazeModel.mazeWidth) {
    var oldCell = this.currentCell
    this.currentCell = mazeModel.mazeCells[this.currentCell.row][this.currentCell.col + 1]
    this.stepsTaken++;
    view.updateRunnerPos(oldCell, this.currentCell);
  };
};

var player;


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

var view = {

  init: function () {
    this.buildMazeWalls();
    this.placeEntranceCell();
    this.showEntranceExit();
    this.$highscores = $("#highscores");
  },

  buildMazeWalls: function () {
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

  placeEntranceCell: function () {
    var $entranceCell = $("#" + mazeModel.entrance.id)
    $entranceCell.addClass("player");
  },

  showEntranceExit: function () {
    var entrancePoint = mazeModel.entrance.entrancePoint
    var $entranceCell = $("#" + mazeModel.entrance.id)
    var $exitCell = $("#" + mazeModel.exit.id)
    console.log($entranceCell.position());
    console.log($exitCell.position());
    console.log(entrancePoint);
    switch(entrancePoint) {
      case "top":
        $("#entrance").addClass("glyphicon-menu-down").css("left", $entranceCell.position().left - $entranceCell.width() / 2);
        $("#exit").addClass("glyphicon-menu-up").css({
          "left": $exitCell.position().left - $exitCell.width() * 1.5,
          "top": $exitCell.position().top + $exitCell.height()
        });
        break;

      case "bottom":
        $("#entrance").addClass("glyphicon-menu-up").css({
          "left": $entranceCell.position().left - $entranceCell.width() / 2,
          "top": $entranceCell.position().top + $entranceCell.width() / 2
        });
        $("#exit").addClass("glyphicon-menu-down").css("left", $exitCell.position().left - $exitCell.width() * 1.5);
        break;

      case "left":
        $("#entrance").addClass("glyphicon-menu-right").css({
          "left": $entranceCell.position().left - $entranceCell.width() * 1.5,
          "top": $entranceCell.position().top - $entranceCell.height() / 2
        });
        $("#exit").addClass("glyphicon-menu-left").css({
          "left": $exitCell.position().left,
          "top": $exitCell.position().top
        });
        break;

      case "right":
        $("#entrance").addClass("glyphicon-menu-left").css({
          "left": $entranceCell.position().left + $entranceCell.width() / 2,
          "top": $entranceCell.position().top - $entranceCell.height() / 2
        });
        $("#exit").addClass("glyphicon-menu-right").css({
          "left": $exitCell.position().left - $exitCell.width() * 3,
          "top": $exitCell.position().top + $exitCell.height() / 2
        });
        break;
    }

  },

  updateRunnerPos: function(oldCell, newCell) {
    $("#" + oldCell.id).removeClass("player");
    $("#" + newCell.id).addClass("player");
  },

  toggleFinish: function() {
    this.updateHighScores(scores.top());
    $("#finish").toggleClass("hidden");
  },

  updateTime: function () {
    $("#minutes").text( (Math.floor(scores.time / 60) < 10) ? "0" + Math.floor(scores.time / 60) : Math.floor(scores.time / 60) )
    $("#seconds").text( (scores.time % 60 < 10) ? "0" + scores.time % 60 : scores.time % 60)
    $("#score").text( scores.currentScore)
  },

  updateHighScores: function(scores){
    console.log(this.$highscores)
    this.$highscores.empty();
    scores.forEach(function(score){
      view.$highscores.append("<li>" + score + "</li>");
    })
  },
}

var scores = {

  all: [],
  time: 0,
  currentScore: 1000,
  mazesCompleted: 0,

  sortNum: function (a, b) {
    return b-a;
  },

  top: function(){
    return this.all.sort(this.sortNum).slice(0,Math.min(this.all.length, 5));
  },

  increaseTime: function() {
    console.log(this.time)
    this.time++;
    this.currentScore -= Math.floor(this.time * (Math.pow(this.time, 1/5)));
    if (this.currentScore < 0) this.currentScore = 0;
  },

  submitScore: function() {
    this.all.push(this.currentScore)
  },

}

var controller = {

  itvl: null,
  currentWidth: 4,
  currentHeight: 4,

  init: function () {
    mazeModel.init(this.currentWidth, this.currentHeight);
    view.init();
    controller.setListeners();
    controller.play();
  },

  setListeners: function () {
    $(window).on("keydown", player.movePlayer);
    $("#play-again").click(controller.createNextMaze);
  },

  finishMaze: function () {
    scores.submitScore();
    view.toggleFinish();
    clearInterval(this.itvl)
    $(window).off();
  },

  play: function () {
    this.itvl = setInterval(function() {
      console.log("counting...")
      scores.increaseTime();
      view.updateTime();
    }, 1000)
  },

  createNextMaze: function() {
    // Completion bonus
    scores.mazesCompleted++;
    scores.currentScore += 1000 * scores.mazesCompleted // Bonus!
    // Reset old maze
    scores.time = 0;
    view.toggleFinish();
    mazeModel.mazeCells = [];
    mazeModel.borders = [];
    $('#maze tbody').empty();
    // Create new one
    if (controller.currentHeight <= 20) controller.currentHeight += 2;
    if (controller.currentWidth <= 40) controller.currentWidth += 2;
    mazeModel.init(controller.currentWidth, controller.currentHeight);
    view.init();
    $(window).on("keydown", player.movePlayer);
    controller.play();
  },
}

$(function() {
  controller.init();
});


