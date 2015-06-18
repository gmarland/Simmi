Game.define(
	"Block",
	function() { 
		var that = this;

		this._canvas = null;

		this._dropBlock = false;

		this._imageHor = new Image();
		this._imageVert = new Image();
			
		this._blockType = null;
		this._direction = null;

		this._height = 10;

		this._falling = true;
		this._ticks = 0;

		this.init = function(canvas, type, direction) {
			this._canvas = canvas;

			that._blockType = type;
			that._direction = direction;

			switch (that._blockType) {
				case "yellow":
					that._imageHor.src = "libs/images/yellow.png?" + new Date();
					that._imageVert.src = "libs/images/yellow.vert.png?" + new Date();
					that._width = 80;
					break;
				case "blue":
					that._imageHor.src = "libs/images/blue.png?" + new Date();
					that._imageVert.src = "libs/images/blue.vert.png?" + new Date();
					that._width = 70;
					break;
				case "grey":
					that._imageHor.src = "libs/images/grey.png?" + new Date();
					that._imageVert.src = "libs/images/grey.vert.png?" + new Date();
					that._width = 50;
					break;
				case "green":
					that._imageHor.src = "libs/images/green.png?" + new Date();
					that._imageVert.src = "libs/images/green.vert.png?" + new Date();
					that._width = 100;
					break;
			}

			switch (that._direction) {
				case "n":
					that._x = (that._canvas.width/2) - (that._width/2);
					that._y = 0;
					break;
				case "s":
					that._x = (that._canvas.width/2) - (that._width/2);
					that._y = that._canvas.height-that._height;
					break;
				case "e":
					that._x = that._canvas.width-that._width;
					that._y = (that._canvas.height/2) - (that._width/2);
					break;
				case "w":
					that._x = 0;
					that._y = (that._canvas.height/2) - (that._width/2);
					break;
			}

			that._initialized = true;
		};

		this.getHorizontalImage = function() {
			return that._imageHor;
		};

		this.getRelevantX = function() {
			switch (that._direction) {
				case "n": return null;
				case "s": return null;
				case "e": return that._x;
				case "w": return that._x + that._height;
			}
		}

		this.getRelevantY = function() {
			switch (that._direction) {
				case "n": return that._y + that._height;
				case "s": return that._y;
				case "e": return null;
				case "w": return null;
			}
		},

		this.setDropBlock = function(value) {
			this._dropBlock = value;
		},

		this.setDirection = function(direction) {
			that._direction = direction;
		};

		this.getDirection = function() {
			return that._direction;
		};

		this.setX = function(x) {
			that._x = x;
		}

		this.setY = function(y) {
			that._y = y;
		}

		this.getWidth = function() {
			return that._width;
		};

		this.getHeight = function() {
			return that._height;
		};

		this.getType = function() {
			return that._blockType;
		};
		
		this.update = function(level) {
			if (that._initialized) {
				that._ticks += 1;

				if (that._falling) {
					var dropTick = 11-level;
					if ((dropTick < 0) || (this._dropBlock)) dropTick = 1;

					if ((that._ticks % dropTick) === 0) {
						switch (that._direction) {
							case "n":
								that._y += 5;
								break;
							case "s":
								that._y -= 5;
								break;
							case "e":
								that._x -= 5;
								break;
							case "w":
								that._x += 5;
								break;
						}
					}
				}
			}
		};

		this.draw = function() {
			if (that._initialized) {
				var context = that._canvas.getContext('2d');

				context.beginPath();

				if ((that._direction == "n") || (that._direction == "s")) context.drawImage(that._imageHor, that._x, that._y);
				else context.drawImage(that._imageVert, that._x, that._y);

				context.fillStyle = that._color;
				context.fill();
				
				context.stroke();
			}
		};

		return this;
	}
);