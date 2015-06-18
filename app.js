window.Game = {
	global: window,
	_fps: 60,
	_awaitingScriptLoads: 0,
	_modules: {},
	_gameLocation: "game/",
	_soundEffects: {
		"rotateAnchor": new Audio("libs/sounds/anchor-move.mp3"),
		"collectBlock": new Audio("libs/sounds/block-collect.mp3"),
		"clearBlocks": new Audio("libs/sounds/block-clear.mp3")
	},
	_loaded: null,
	_backgroundImage: null,
	_touchX: null,
	_touchY: null,
	_lastTouchedX: null,
	_lastTouchedY: null,
	_dropBlock: false,

	$: function( selector ) {
		return selector.charAt(0) == '#' ? document.getElementById( selector.substr(1) ) : document.getElementsByTagName( selector );
	},

	$new: function(name) {
		return document.createElement(name);
	},

	getRandomInt: function(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	getCanvas: function() {
		return this._canvas;
	},

	create: function(name) {
		return new this._modules[name]();
	},

	getTouched: function() {
		if (this._touchX && this._touchY) {
			return {
				x: this._touchX,
				y: this._touchY
			};
		}
		else return null;
	},

	getLastTouched: function() {
		return {
			x: this._lastTouchedX,
			y: this._lastTouchedY
		};
	},

	clearLastTouched: function() {
		this._lastTouchedX = null;
		this._lastTouchedY = null;
	},

	addScore: function(score) {
		if (this._loaded) this._loaded.addScore(score);
	},

	init: function() {
		var that = this;

		this._canvas = document.getElementById("game-canvas");

		this._backgroundImage = new Image();
		this._backgroundImage.src = "libs/images/background.png?" + new Date();

		var iOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false,
			android = navigator.userAgent.match(/Android/i) ? true : false;

		this.loadScript("level4");

		var scriptLoader = setInterval(function() {
			if (that._awaitingScriptLoads === 0) {
          		window.clearInterval(scriptLoader);

				that._loaded = new that._modules["Level4"]();

				if (iOS || android) {
					that._canvas.addEventListener("touchstart", function(e) {
						e.preventDefault();

						that._touchX = e.targetTouches[0].pageX;
						that._touchY = e.targetTouches[0].pageY;
					}, false);

					that._canvas.addEventListener("touchend", function(e) {
						e.preventDefault();

						that._touchX = null;
						that._touchY = null;

						that._lastTouchedX = e.pageX;
						that._lastTouchedY = e.pageY;
					}, false);
				}
				else {
					that._canvas.addEventListener("mousedown", function(e) {
						that._touchX = e.pageX;
						that._touchY = e.pageY;
					});

					that._canvas.addEventListener("mouseup", function(e) {
						that._touchX = null;
						that._touchY = null;

						that._lastTouchedX = e.pageX;
						that._lastTouchedY = e.pageY;
					});
				}

				setInterval(that.run(), 0);
			}
		}, 0);
	},

	loadScript: function(name) {
		var that = this
		
		this._awaitingScriptLoads++;

		var path = this._gameLocation + name.replace(/\./g, "/") + ".js?" + Date.now();

		var script = this.$new("script");
		script.type = "text/javascript";
		script.src = path;

		script.onload = function() {
			that._awaitingScriptLoads--;

		};
		script.onerror = function() {
			that._awaitingScriptLoads--;
			console.log("Failed to load module " + name + " at " + path);
		};

		this.$("head")[0].appendChild(script);
	},

	requires: function() {
		if (arguments != null) {
			for (var i=0, max = arguments.length; i<max; i += 1) {
				this.loadScript(arguments[i]);
			}
		}

		return Game;
	},

	define: function(name, module) {
		if (this._modules[name] == null) this._modules[name] = module;
	},

	run: function() {
		var that = this,
			loops = 0, 
			skipTicks = 1000 / this._fps,
			maxFrameSkip = 10,
			nextGameTick = (new Date).getTime(),
			lastGameTick;

		return function() {
			loops = 0;

			while ((new Date).getTime() > nextGameTick) {
				that.update();
				nextGameTick += skipTicks;
				loops++;
			}

			if (!loops) {
				that.draw((nextGameTick - (new Date).getTime()) / skipTicks);
			} else {
				that.draw(0);
			}
		};
	},

	update: function() {
		this._loaded.update();
	},

	draw: function() {
		var context = this._canvas.getContext("2d");

		context.clearRect(0,0,this._canvas.width,this._canvas.height);
		context.drawImage(this._backgroundImage,0,0);

		this._loaded.draw();
	},

	playSound: function(soundFile) {
		if (this._soundEffects[soundFile]) {
			var that = this;

			setTimeout(function() {
				that._soundEffects[soundFile].currentTime = 0;
				that._soundEffects[soundFile].play();
			}, 0);
		}
	}
};

window.onload = function() {
	Game.init();
}