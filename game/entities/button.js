Game.define(
	"Button",
	function() {
		var that = this;

		this._canvas = null;

		this._image = new Image();

		this._type = null;
		this._width = 48;
		this._height = 48;
		this._locationX = null;
		this._locationY = null;

		this.init = function(canvas, type, locationX, locationY) {
			this._canvas = canvas;

			that._type = type;

			that._image.src = "libs/images/" + type + "Button.png?" + new Date();

			that._locationX = locationX;
			that._locationY = locationY;

			that._initialized = true;
		};

		this.getLocationX = function() {
			return that._locationX;
		};

		this.getLocationY = function() {
			return that._locationY;
		};

		this.getHeight = function() {
			return that._height;
		};

		this.getWidth = function() {
			return that._width;
		};

		this.isTouching = function(xPos, yPos) {
			if (((xPos >= that._locationX) && (xPos <=(that._locationX+that._width))) && ((yPos >= that._locationY) && (yPos <=(that._locationY+that._height)))) return true;
			else return false;	
		};

		this.draw = function() {
			if (that._initialized) {
				var context = that._canvas.getContext('2d');

				context.drawImage(that._image, that._locationX, that._locationY);
			}
		};
	}
);