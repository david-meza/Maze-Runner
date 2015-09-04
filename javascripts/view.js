var MAZERUNNER = MAZERUNNER || {}

MAZERUNNER.view = {

  init: function () {
    this.buildMazeWalls();
    this.placeEntranceCell();
    this.showEntranceExit();
    this.$highscores = $("#highscores");
  },

  buildMazeWalls: function () {
    // To shorten the name...
    var cells = MAZERUNNER.mazeModel.mazeCells
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
    var $entranceCell = $("#" + MAZERUNNER.mazeModel.entrance.id)
    $entranceCell.addClass("player player-down");
  },

  showEntranceExit: function () {
    var entrancePoint = MAZERUNNER.mazeModel.entrance.entrancePoint
    var $entranceCell = $("#" + MAZERUNNER.mazeModel.entrance.id).addClass("entrance")
    var $exitCell = $("#" + MAZERUNNER.mazeModel.exit.id).addClass("exit")
    console.log($entranceCell.position());
    console.log($exitCell.position());
    console.log(entrancePoint);
    switch(entrancePoint) {
      case "top":
        $("#entrance").addClass("glyphicon-menu-down").css("left", $entranceCell.position().left);
        $("#exit").addClass("glyphicon-menu-up").css({
          "left": $exitCell.position().left,
          "top": $exitCell.position().top
        });
        break;

      case "bottom":
        $("#entrance").addClass("glyphicon-menu-up").css({
          "left": $entranceCell.position().left,
          "top": $entranceCell.position().top
        });
        $("#exit").addClass("glyphicon-menu-down").css("left", $exitCell.position().left - $exitCell.width() * 1.5);
        break;

      case "left":
        $("#entrance").addClass("glyphicon-menu-right").css({
          "left": $entranceCell.position().left,
          "top": $entranceCell.position().top
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
    $("#" + newCell.id).addClass(newClass);
  },

  updateAIPos: function(oldCell, newCell, newClass) {
    $("#" + oldCell.id).removeClass("ai ai-right ai-left ai-up ai-down");
    $("#" + newCell.id).addClass(newClass);
  },

  toggleFinish: function() {
    this.updateHighScores(MAZERUNNER.scores.top());
    $("#finish").toggleClass("hidden");
  },

  showGameOver: function() {
    $("#best-score").append("<li>" + (MAZERUNNER.scores.top()[0] || 0) + "</li>");
    $("#game-over").removeClass("hidden");
  },

  updateTime: function () {
    $("#minutes").text( (Math.floor(MAZERUNNER.scores.time / 60) < 10) ? "0" + Math.floor(MAZERUNNER.scores.time / 60) : Math.floor(MAZERUNNER.scores.time / 60) )
    $("#seconds").text( (MAZERUNNER.scores.time % 60 < 10) ? "0" + MAZERUNNER.scores.time % 60 : MAZERUNNER.scores.time % 60)
    $("#score").text( MAZERUNNER.scores.currentScore)
  },

  updateHighScores: function(scores){
    console.log(this.$highscores)
    this.$highscores.empty();
    scores.forEach(function(score){
      MAZERUNNER.view.$highscores.append("<li>" + score + "</li>");
    })
  },
}