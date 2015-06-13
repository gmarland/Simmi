Game.define(
	"Anchor",
	function() { 
		var that = this;

		this._canvas = Game.getCanvas();

		this._images = [ new Image(), new Image(), new Image(), new Image() ];
		this._imagePosition = 0;

		this._width = 100;
		this._height = 100;

		this._x = (this._canvas.width/2) - (this._width/2);
		this._y = (this._canvas.height/2) - (this._height/2);

		this._sides = [[],[],[],[]];

		this.init = function() {
			that._initialized = true;

			that._images[0].src = "libs/images/anchor0.png?" + new Date();
			that._images[1].src = "libs/images/anchor90.png?" + new Date();
			that._images[2].src = "libs/images/anchor180.png?" + new Date();
			that._images[3].src = "libs/images/anchor270.png?" + new Date();
		};

		this.rotateLeft = function() {
			var n = that._sides[0];
			var e = that._sides[1];
			var s = that._sides[2];
			var w = that._sides[3];

			that._sides = [e, s, w, n];

			if (that._imagePosition == 0) that._imagePosition = 3;
			else that._imagePosition -= 1;

			that.orderBlockPositions();
		};

		this.rotateRight = function() {
			var n = that._sides[0];
			var e = that._sides[1];
			var s = that._sides[2];
			var w = that._sides[3];

			that._sides = [w, n, e, s];

			if (that._imagePosition == 3) that._imagePosition = 0;
			else that._imagePosition += 1;

			that.orderBlockPositions();
		}

		this.orderBlockPositions = function() {
			var previousHeight = 0;

			for (var i=0; i<that._sides[0].length; i += 1) {
				previousHeight = 0;


				for (var j=0; j<=i; j++) {
					previousHeight += that._sides[0][j].getHeight();
				}

				that._sides[0][i].setDirection("n");
				that._sides[0][i].setX(that._x + (that._width/2) - (that._sides[0][i].getWidth()/2));
				that._sides[0][i].setY(that._y - previousHeight);
			}

			for (var i=0; i<that._sides[1].length; i += 1) {
				previousHeight = 0;

				for (var j=0; j<i; j++) {
					previousHeight += that._sides[1][j].getHeight();
				}

				that._sides[1][i].setDirection("e");
				that._sides[1][i].setX(that._x + that._width + previousHeight);
				that._sides[1][i].setY((that._y + (that._height/2)) - (that._sides[1][i].getWidth()/2));
			}

			for (var i=0; i<that._sides[2].length; i += 1) {
				previousHeight = 0;

				for (var j=0; j<i; j++) {
					previousHeight += that._sides[2][j].getHeight();
				}

				that._sides[2][i].setDirection("s");
				that._sides[2][i].setX(that._x + (that._width/2) - (that._sides[2][i].getWidth()/2));
				that._sides[2][i].setY(that._y + that._height + previousHeight);
			}

			for (var i=0; i<that._sides[3].length; i += 1) {
				previousHeight = 0;

				for (var j=0; j<=i; j++) {
					previousHeight += that._sides[3][j].getHeight();
				}

				that._sides[3][i].setDirection("w");
				that._sides[3][i].setX(that._x - previousHeight);
				that._sides[3][i].setY((that._y + (that._height/2)) - (that._sides[3][i].getWidth()/2));
			}
		};

		this.clearSymmetry = function() {
			var nsSymCount = 0,
				maxns = (that._sides[0].length > that._sides[2].length) ? that._sides[0].length : that._sides[2].length,
				ewSymCount = 0,
				maxew = (that._sides[1].length > that._sides[3].length) ? that._sides[1].length : that._sides[3].length;

			for (var i=0; i<maxns; i++) {
				if (((that._sides[0].length - 1 - i) >= 0) && ((that._sides[2].length - 1 - i) >= 0)) {
					if (that._sides[0][(that._sides[0].length - 1 - i)].getType() == that._sides[2][(that._sides[2].length - 1 - i)].getType()) nsSymCount += 1;
					else break;
				}
			}

			for (var i=0; i<maxew; i++) {
				if (((that._sides[1].length - 1 - i) >= 0) && ((that._sides[3].length - 1 - i) >= 0)) {
					if (that._sides[1][(that._sides[1].length - 1 - i)].getType() == that._sides[3][(that._sides[3].length - 1 - i)].getType()) ewSymCount += 1;
					else break;
				}
			}

			var totalScore = 0;
			var nsScore = 0;
			var ewScore = 0;

			if (nsSymCount >= 3) {
				that._sides[0].splice(that._sides[0].length-nsSymCount, nsSymCount);
				that._sides[2].splice(that._sides[2].length-nsSymCount, nsSymCount);
			
				nsScore = (nsSymCount*2)*100;
			}

			if (ewSymCount >= 3) {
				that._sides[1].splice(that._sides[1].length-ewSymCount, ewSymCount);
				that._sides[3].splice(that._sides[3].length-ewSymCount, ewSymCount);
			
				ewScore = (ewSymCount*2)*100;
			}

			if ((nsScore > 0) || (ewScore > 0)) {
				if ((nsScore > 0) && (ewScore > 0)) totalScore = (nsScore + ewScore)*2;
				else totalScore = nsScore + ewScore;

				Game.addScore(totalScore);
			}
		}

		this.getCombinedHeight = function() {
			var combinedStartX = this._x,
				combinedStartY = this._y,
				combinedEndX = this._x+this._width,
				combinedEndY = this._y+this._height;
			
			// Adding north side
			for (var i=0; i < this._sides[0].length; i += 1) {
				combinedStartY -= this._sides[0][i].getHeight();
			}

			// Adding east side
			for (var i=0; i < this._sides[1].length; i += 1) {
				combinedEndX +=  this._sides[1][i].getHeight();
			}

			// Adding south side
			for (var i=0; i < this._sides[2].length; i += 1) {
				combinedEndY +=  this._sides[2][i].getHeight();
			}

			// Adding west side 
			for (var i=0; i < this._sides[3].length; i += 1) {
				combinedStartX -= this._sides[3][i].getHeight();
			}

			return {
				startX: combinedStartX,
				startY: combinedStartY,
				endX: combinedEndX,
				endY: combinedEndY
			};
		},

		this.isOccupying = function(direction,x,y) {
			var combinedDimensions = that.getCombinedHeight();

			if ((direction == "n") && (y >= combinedDimensions.startY)) return true;
			else if ((direction == "s") && (y <= combinedDimensions.endY)) return true;
			else if ((direction == "e") && (x <= combinedDimensions.endX)) return true;
			else if((direction == "w") &&  (x >= combinedDimensions.startX)) return true;

			return false;
		};

		this.claimBlock = function(block) {
			var direction = block.getDirection();

			if (direction == "n") {
				block.setY(that._y-(that._sides[0].length*block.getHeight())-block.getHeight());
				that._sides[0].push(block);
			}
			else if (direction == "e") {
				block.setX((that._x+that._width)+(that._sides[1].length*block.getHeight()));
				that._sides[1].push(block);
			}
			else if (direction == "s") {
				block.setY((that._y+that._height)+(that._sides[2].length*block.getHeight()));
				that._sides[2].push(block);
			}
			else if (direction == "w") {
				block.setX(that._x-(that._sides[3].length*block.getHeight())-block.getHeight());
				that._sides[3].push(block);
			}
		};

		this.update = function() {
			if (that._initialized) {
				var keyPressed = Game.getKeyPressed();

				if (keyPressed) {
					Game.clearKeyPressed();

					if (keyPressed == "left") that.rotateLeft();
					else if (keyPressed == "right") that.rotateRight();
					else if (keyPressed == "space") that.clearSymmetry();
				}
			}
		};

		this.draw = function() {
			if (that._initialized) {
				var context = that._canvas.getContext('2d');

				context.drawImage(that._images[that._imagePosition], that._x, that._y);

				for (var i=0, sideCount=this._sides.length; i<sideCount; i += 1) {
					for (var j=0, blockCount=this._sides[i].length; j<blockCount; j += 1) {
						this._sides[i][j].draw();
					}
				}
			}
		};
	}
);