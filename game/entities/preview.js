Game.define(
	"Preview",
	function() {
		var that = this;

		this._canvas = null;

		this._previewContainer = new Image();
		that._previewContainer.src = "libs/images/previewContainter.png?" + new Date();

		that._block = null;

		this.init = function(canvas) {
			this._canvas = canvas;
		};
		
		this.setBlock = function(block) {
			that._block = block;
		};

		this.draw = function() {
			if (that._block) {
				var context = that._canvas.getContext('2d');

				context.drawImage(that._previewContainer, that._canvas.width-135, 15);
				context.drawImage(that._block.getHorizontalImage(), that._canvas.width-145+70-(that._block.getWidth()/2), 25);
			}
		};
	}
);