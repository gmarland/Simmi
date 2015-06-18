Game
.requires(
	"entities.anchor",
	"entities.block",
	"entities.score",
	"entities.preview",
	"entities.button"
)
.define(
	"Level2",
	function() { 
		var that = this;

		this._canvas = Game.getCanvas();

		this._blocks =  [],
		this._nextBlock = null;
		this._currentBlock = null;
		this._levelComplete = false;
		this._gameOver = false;

		this._shapes = [ "yellow", "green" ];
		this._directions = [ "n", "s", "e", "w" ];

		this._preview = Game.create("Preview");
		this._preview.init(this._canvas);

		this._anchor = Game.create("Anchor");
		this._anchor.init(this._canvas, this);
		this._anchor.setDisabledSides([ "e", "w" ]);

		// Add starting blocks

		var startingBlock1 = Game.create("Block");
		startingBlock1.init(that._canvas, that._shapes[0], "s");
		this._anchor.addBlock(startingBlock1);

		var startingBlock2 = Game.create("Block");
		startingBlock2.init(that._canvas, that._shapes[1], "s");
		this._anchor.addBlock(startingBlock2);

		var startingBlock3 = Game.create("Block");
		startingBlock3.init(that._canvas, that._shapes[0], "s");
		this._anchor.addBlock(startingBlock3);

		this._leftButton = Game.create("Button");
		this._leftButton.init(this._canvas, "left", 20, Game.getCanvas().height-this._leftButton.getHeight()-20);

		this._rightButton = Game.create("Button");
		this._rightButton.init(this._canvas, "right", Game.getCanvas().width-this._rightButton.getWidth()-20, Game.getCanvas().height-this._rightButton.getHeight()-20);

		this._downButton = Game.create("Button");
		this._downButton.init(this._canvas, "down", Game.getCanvas().width-this._downButton.getWidth()-20, this._rightButton.getLocationY()-this._downButton.getHeight()-20);


		this.addScore = function(score) {
			if (that._anchor.getBlocksCleared()) that._levelComplete = true;
		};

		this.update = function() {
			if ((!that._levelComplete) && (!that._gameOver)) {
				var currentAnchorDimensions = that._anchor.getCombinedHeight();

				if ((currentAnchorDimensions.startX < 0) || 
					(currentAnchorDimensions.endX > that._canvas.width) || (
					currentAnchorDimensions.startY < 0) || 
					(currentAnchorDimensions.endY > that._canvas.height)) {
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
							that._currentBlock.init(that._canvas, that._shapes[Game.getRandomInt(0,1)], that._directions[Game.getRandomInt(0,3)]);
						}

						that._nextBlock = Game.create("Block");
						that._nextBlock.init(that._canvas, that._shapes[Game.getRandomInt(0,1)], that._directions[Game.getRandomInt(0,3)]);

						that._preview.setBlock(that._nextBlock);
					}

					that._currentBlock.update(1);

					if (that._anchor.isOccupying(that._currentBlock.getDirection(), that._currentBlock.getRelevantX(), that._currentBlock.getRelevantY())) {
						that._anchor.claimBlock(that._currentBlock);
						that._currentBlock = null;
					}
				}
			}
		};

		this.draw = function() {
			that._anchor.draw();	

			if ((!that._levelComplete) && (!that._gameOver)) {
				if (that._currentBlock) that._currentBlock.draw();

				that._preview.draw();
			}

			this._leftButton.draw();
			this._rightButton.draw();
			this._downButton.draw();
		};

		return this;
	}
); 