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
    $entranceCell.addClass("player player-down");
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

  updateRunnerPos: function(oldCell, newCell, newClass) {
    $("#" + oldCell.id).removeClass("player player-right player-left player-up player-down");
    $("#" + newCell.id).addClass("player " + newClass);
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
    if (controller.currentWidth <= 32) controller.currentWidth += 2;
    mazeModel.init(controller.currentWidth, controller.currentHeight);
    view.init();
    $(window).on("keydown", player.movePlayer);
    controller.play();
  },
}

$(function() {
  controller.init();
});


