var MAZERUNNER = MAZERUNNER || {}

MAZERUNNER.scores = {

  all: [],
  time: 0,
  currentScore: 1000,
  mazesCompleted: 0,
  frames: 0,

  sortNum: function (a, b) {
    return b-a;
  },

  top: function(){
    return this.all.sort(this.sortNum).slice(0,Math.min(this.all.length, 5));
  },

  increaseTime: function() {
    this.frames++;
    if (this.frames % 60 == 0) {
      this.time++;
      this.currentScore -= Math.floor(this.time * (Math.pow(this.time, 1/(this.mazesCompleted + 1))));
      if (this.currentScore < 0) this.currentScore = 0;
    };
  },

  submitScore: function() {
    this.all.push(this.currentScore)
  },

}