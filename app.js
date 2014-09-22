window.Game = {
	global: window,
	_fps: 60,
	_awaitingScriptLoads: 0,
	_modules: {},
	_gameLocation: "game/",
	_main: null,
	_keyPressed: null,
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

	getDropBlock: function() {
		return this._dropBlock;
	},

	getKeyPressed: function() {
		return this._keyPressed;
	},

	clearKeyPressed: function() {
		this._keyPressed = null;
	},

	addScore: function(score) {
		if (this._main) this._main.addScore(score);
	},

	init: function() {
		var that = this;

		this._canvas = document.getElementById("game-canvas");

		this.loadScript("Main");

		var scriptLoader = setInterval(function() {
			if (that._awaitingScriptLoads === 0) {
          		window.clearInterval(scriptLoader);

				that._main = new that._modules["Main"]();

	  			document.addEventListener("keydown", function(e) {
	  				e.preventDefault();
					e.stopPropagation();

					if ((e.keyCode == 40) || (e.keyCode == 38)) that._dropBlock = true;

	  				if (e.keyCode == 32) that._keyPressed = "space";
	  				if (e.keyCode == 37) that._keyPressed = "left";
	  				if (e.keyCode == 39) that._keyPressed = "right";
	  			});

	  			document.addEventListener("keyup", function(e) {
					if ((e.keyCode == 40) || (e.keyCode == 38)) that._dropBlock = false;
	  			});

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
		this._main.update();
	},

	draw: function() {
		this._canvas.getContext("2d").clearRect(0,0,this._canvas.width,this._canvas.height);
		this._main.draw();
	}
};

window.onload = function() {
	Game.init();
}