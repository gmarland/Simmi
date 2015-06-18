Game.define(
	"Score",
	function() {
		var that = this;

		this._levelMultiplier = 1000;

		this._score = 0;

		this._level = 1;
		this._nextLevel = that._levelMultiplier;

		this._canvas = null;
		
		this.init = function(canvas) {
			this._canvas = canvas

			that._initialized = true;
		};

		this.addScore = function(score) {
			that._score += score;

			if (that._score > that._nextLevel) {
				this._level++;

				that._nextLevel = that._score + (this._level*that._levelMultiplier)
			}
		};

		this.getLevel = function() {
			return that._level;
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