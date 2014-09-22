Game
.requires(
	"entities.anchor",
	"entities.block",
	"entities.score",
	"entities.preview"
)
.define(
	"Main",
	function() { 
		var that = this;

		this._blocks =  [],
		this._nextBlock = null;
		this._currentBlock = null;
		this._gameOver = false;

		this._score = Game.create("Score");
		this._score.init();

		this._preview = Game.create("Preview");
		this._preview.init();

		this._anchor = Game.create("Anchor");
		this._anchor.init();

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
				that._anchor.update();

				if (!that._currentBlock) {
					if (that._nextBlock) {
						that._currentBlock = that._nextBlock;
					}
					else {
						that._currentBlock = Game.create("Block");
						that._currentBlock.init(that._shapes[Game.getRandomInt(0,3)], that._directions[Game.getRandomInt(0,3)]);
					}

					that._nextBlock = Game.create("Block");
					that._nextBlock.init(that._shapes[Game.getRandomInt(0,3)], that._directions[Game.getRandomInt(0,3)]);

					that._preview.setBlock(that._nextBlock);
				}

				that._currentBlock.update(that._nextBlock);

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
		};

		return this;
	}
); 