Game
.requires(
	"entities.anchor",
	"entities.block",
	"entities.score",
	"entities.preview",
	"entities.button"
)
.define(
	"Main",
	function() { 
		var that = this;

		this._canvas = Game.getCanvas();

		this._blocks =  [],
		this._nextBlock = null;
		this._currentBlock = null;
		this._gameOver = false;

		this._score = Game.create("Score");
		this._score.init(this._canvas);

		this._preview = Game.create("Preview");
		this._preview.init(this._canvas);

		this._anchor = Game.create("Anchor");
		this._anchor.init(this._canvas);

		this._leftButton = Game.create("Button");
		this._leftButton.init(this._canvas, "left", 20, Game.getCanvas().height-this._leftButton.getHeight()-20);

		this._rightButton = Game.create("Button");
		this._rightButton.init(this._canvas, "right", Game.getCanvas().width-this._rightButton.getWidth()-20, Game.getCanvas().height-this._rightButton.getHeight()-20);

		this._downButton = Game.create("Button");
		this._downButton.init(this._canvas, "down", Game.getCanvas().width-this._downButton.getWidth()-20, this._rightButton.getLocationY()-this._downButton.getHeight()-20);

		this._shapes = [ "yellow", "blue", "grey", "green" ];
		this._directions = [ "n", "s", "e", "w" ];

		this.addScore = function(score) {
			if (that._score) that._score.addScore(score);
		};

		this.update = function() {
			var canvas = Game.getCanvas(),
				currentAnchorDimensions = that._anchor.getCombinedHeight();

			if ((currentAnchorDimensions.startX < 0) || 
				(currentAnchorDimensions.endX > canvas.width) || (
				currentAnchorDimensions.startY < 0) || 
				(currentAnchorDimensions.endY > canvas.height)) {
				that._gameOver = true;
			}
			else {
				var touched = Game.getTouched();

				if (!touched) {
					if (that._currentBlock) that._currentBlock.setDropBlock(false);

					var lastTouched = Game.getLastTouched();

					if (lastTouched) {
						if (that._leftButton.isTouching(lastTouched.x, lastTouched.y)) that._anchor.rotateLeft();
						if (that._rightButton.isTouching(lastTouched.x, lastTouched.y)) that._anchor.rotateRight();

						Game.clearLastTouched();
					}
				}
				else {
					if (this._downButton.isTouching(touched.x, touched.y)) {
						if (that._currentBlock) that._currentBlock.setDropBlock(true);
					}
				}

				that._anchor.update();

				if (!that._currentBlock) {
					if (that._nextBlock) {
						that._currentBlock = that._nextBlock;
					}
					else {
						that._currentBlock = Game.create("Block");
						that._currentBlock.init(this._canvas, that._shapes[Game.getRandomInt(0,3)], that._directions[Game.getRandomInt(0,3)]);
					}

					that._nextBlock = Game.create("Block");
					that._nextBlock.init(this._canvas, that._shapes[Game.getRandomInt(0,3)], that._directions[Game.getRandomInt(0,3)]);

					that._preview.setBlock(that._nextBlock);
				}

				that._currentBlock.update(that._score.getLevel());

				if (that._anchor.isOccupying(that._currentBlock.getDirection(), that._currentBlock.getRelevantX(), that._currentBlock.getRelevantY())) {
					that._anchor.claimBlock(that._currentBlock);
					that._currentBlock = null;
				}
			}
		};

		this.draw = function() {
			that._anchor.draw();	

			if (!that._gameOver) {
				if (that._currentBlock) that._currentBlock.draw();

				that._preview.draw();
			}

			that._score.draw();

			this._leftButton.draw();
			this._rightButton.draw();
			this._downButton.draw();
		};

		return this;
	}
); 