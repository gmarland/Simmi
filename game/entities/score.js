Game.define(
	"Score",
	function() {
		var that = this;

		this._score = 0;

		this._canvas = Game.getCanvas();
		
		this.init = function() {
			that._initialized = true;
		};

		this.addScore = function(score) {
			that._score += score;
		};

		this.draw = function() {
			if (that._initialized) {
				var context = that._canvas.getContext('2d');

				context.font="bold 16px sans-serif";
				context.fillText("Score: " + that._score, 20, 30);
			}
		};
	}
);