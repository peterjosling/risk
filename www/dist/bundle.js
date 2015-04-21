/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	__webpack_require__(8);
	var View = __webpack_require__(2);
	var Game = __webpack_require__(3);
	var ConnectionView = __webpack_require__(4);
	var LobbyView = __webpack_require__(5);
	var GameView = __webpack_require__(6);
	var Toast = __webpack_require__(7);
	var App = (function (_super) {
	    __extends(App, _super);
	    function App() {
	        _super.apply(this, arguments);
	        this.template = __webpack_require__(10);
	    }
	    App.prototype.setView = function (view) {
	        if (this.view) {
	            this.view.destroy();
	        }
	        this.view = view;
	        this.$('.view-container').html(this.view.render().el);
	    };
	    // Show the connection view and allow the user to join a game.
	    App.prototype.init = function () {
	        this.game = new Game();
	        var view = new ConnectionView({ model: this.game });
	        view.listenTo(this.game, 'connected', this.gameConnected.bind(this));
	        app.setView(view);
	        // Show toast notifications as they occur.
	        this.listenTo(this.game, 'toast', this.showToast);
	    };
	    // Joined an existing game (or created one). Go to the lobby view.
	    App.prototype.gameConnected = function () {
	        this.game.showToast('Connected to host');
	        var view = new LobbyView({ model: this.game });
	        view.listenTo(this.game, 'gameStart', this.gameStart.bind(this));
	        app.setView(view);
	    };
	    // Game started. Go to main game view.
	    App.prototype.gameStart = function () {
	        this.game.showToast('Game starting');
	        var view = new GameView({ model: this.game });
	        app.setView(view);
	    };
	    App.prototype.showToast = function (message, persistent) {
	        var toast = new Toast({
	            message: message,
	            persistent: persistent
	        });
	        this.$('.toast-container').append(toast.render().el);
	    };
	    return App;
	})(View);
	var app = new App();
	window.addEventListener('load', function () {
	    document.body.appendChild(app.render().el);
	    app.init();
	});
	module.exports = app;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	/// <reference path="../../lib/backbone/backbone.d.ts" />
	var Backbone = __webpack_require__(24);
	var View = (function (_super) {
	    __extends(View, _super);
	    function View(options) {
	        _super.call(this, options);
	        this.template = function (context, data) {
	        };
	        this.childViews = [];
	        this.listViews = [];
	    }
	    View.prototype.render = function (data) {
	        // Render this view's template.
	        this.$el.html(this.template(this.getRenderData(), { data: data }));
	        // Render out all child views.
	        this.childViews.forEach(function (view) {
	            this.$(view.el).html(view.view.render().el);
	        }, this);
	        return this;
	    };
	    View.prototype.getRenderData = function () {
	        var model = this.model || this.collection;
	        if (model) {
	            return model.toJSON();
	        }
	        return {};
	    };
	    View.prototype.destroy = function () {
	        this.childViews.forEach(function (view) { return view.view.destroy(); });
	        this.listViews.forEach(function (view) { return view.destroy(); });
	    };
	    return View;
	})(Backbone.View);
	module.exports = View;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var Model = __webpack_require__(11);
	var Player = __webpack_require__(12);
	var PlayerList = __webpack_require__(13);
	var Map = __webpack_require__(14);
	var CardList = __webpack_require__(15);
	var defaultMapJson = __webpack_require__(25);
	var HOST = 'ws://localhost:7574';
	var Game = (function (_super) {
	    __extends(Game, _super);
	    function Game(options) {
	        _super.call(this, options);
	        this.map = new Map();
	        this.playerCards = new CardList();
	        this._phase = 'setup';
	        this.cardsTradedIn = 0;
	        this.playerList = new PlayerList();
	        this.map.fromJSON(defaultMapJson);
	        this.set('currentPlayer', -1);
	    }
	    // Whether the game is running as a host or not.
	    Game.prototype.isHost = function () {
	        return this._isHost;
	    };
	    // Get the Player instance whose turn it currently is.
	    Game.prototype.getCurrentPlayer = function () {
	        var playerId = this.get('currentPlayer');
	        return this.playerList.get(playerId);
	    };
	    // Get the ID of the player whose turn it currently is.
	    Game.prototype.getCurrentPlayerId = function () {
	        return this.get('currentPlayer');
	    };
	    // Get the current game phase. 'setup', 'cards', 'deploy', 'attack' or 'defend'.
	    Game.prototype.getPhase = function () {
	        return this._phase;
	    };
	    // Set the current game phase.
	    Game.prototype.setPhase = function (phase) {
	        var validPhases = ['setup', 'cards', 'deploy', 'attack', 'defend'];
	        if (validPhases.indexOf(phase) === -1) {
	            throw new Error('Invalid phase specified');
	        }
	        this._phase = phase;
	    };
	    // Advance to the next (active) player's turn.
	    Game.prototype.nextTurn = function () {
	        var player;
	        do {
	            var id = this.getCurrentPlayerId() + 1;
	            if (id === this.playerList.length) {
	                id = 0;
	            }
	            player = this.playerList.get(id);
	        } while (!player.isActive);
	        // Exit the setup phase if all armies have been assigned.
	        if (this._phase === 'setup') {
	            var activePlayers = this.playerList.getActivePlayerCount();
	            var armyCount = 50 - activePlayers * 5;
	            var allArmiesAssigned = this.playerList.every(function (player) { return player.getArmies() === armyCount; });
	            if (allArmiesAssigned) {
	                this._phase = 'cards';
	            }
	        }
	        this.cardDrawn = false;
	        this.set('currentPlayer', id);
	    };
	    // Calculate how many new armies the player is going to receive.
	    Game.prototype.getNewPlayerArmies = function () {
	        var _this = this;
	        // Calculate the number of armies received for territories.
	        var territoryCount = this.self.getTerritories();
	        var armies = Math.floor(territoryCount / 3);
	        // Calculate the number of armies received for continents.
	        this.map.continents.forEach(function (continent) {
	            var continentOwned = continent.territories.every(function (territory) {
	                return territory.getOwner() === _this.self;
	            });
	            if (continentOwned) {
	                armies += continent.getValue();
	            }
	        });
	        // Each player always receives a minimum of 3 armies.
	        if (armies < 3) {
	            armies = 3;
	        }
	        return armies;
	    };
	    // Calculate how many new armies are received for the nth set of cards traded.
	    Game.prototype.getCardArmies = function () {
	        var n = ++this.cardsTradedIn;
	        if (n < 6) {
	            return 2 * n + 2;
	        }
	        return 5 * n - 15;
	    };
	    // Connect to a host server on the specified host and port.
	    Game.prototype.connect = function (name, host, port, ai) {
	        var _this = this;
	        this._isHost = false;
	        this.self = new Player({
	            isActive: true,
	            name: name
	        });
	        this.playerList.add(this.self);
	        return new Promise(function (resolve, reject) {
	            // Connect to Game server and attempt to join a game.
	            _this.socket = new WebSocket(HOST);
	            _this.socket.onmessage = _this.messageReceived.bind(_this);
	            _this.socket.onopen = function () {
	                _this.sendMessage({
	                    command: 'server_connect',
	                    payload: {
	                        name: name,
	                        hostname: host,
	                        port: port,
	                        ai: ai
	                    }
	                });
	            };
	            _this.socket.onerror = function (error) {
	                reject(error);
	            };
	            _this.once('acceptJoinGame', function (message) {
	                _this.off('rejectJoinGame');
	                _this.trigger('connected');
	                resolve(message);
	            });
	            _this.once('rejectJoinGame', function (message) {
	                _this.off('acceptJoinGame');
	                reject(message);
	            });
	        });
	    };
	    // Start a host server on the specified port.
	    Game.prototype.startServer = function (name, port) {
	        var _this = this;
	        this._isHost = true;
	        this.self = new Player({
	            player_id: 0,
	            isActive: true,
	            name: name
	        });
	        this.playerList.add(this.self);
	        return new Promise(function (resolve, reject) {
	            _this.socket = new WebSocket(HOST);
	            _this.socket.onmessage = _this.messageReceived.bind(_this);
	            _this.socket.onopen = function () {
	                _this.sendMessage({
	                    command: 'server_start',
	                    payload: {
	                        name: name,
	                        port: port
	                    }
	                });
	                // TODO check the host could actually listen on that port before resolving.
	                _this.trigger('connected');
	                resolve();
	            };
	            _this.socket.onerror = function (error) {
	                reject(error);
	            };
	        });
	    };
	    // Show a toast-style text message to the user.
	    Game.prototype.showToast = function (message, persistent) {
	        this.trigger('toast', message, persistent);
	    };
	    // Read army/territory counts from every territory and update each player's count.
	    Game.prototype.updateArmyCounts = function () {
	        // Initialise array of army/territory counts to 0.
	        var armyCounts = this.playerList.map(function (player) {
	            return 0;
	        });
	        var territoryCounts = armyCounts.slice(0);
	        // Sum up counts from every territory.
	        this.map.territories.forEach(function (territory) {
	            var player = territory.getOwner();
	            if (!player) {
	                return;
	            }
	            territoryCounts[player.id]++;
	            armyCounts[player.id] += territory.getArmies();
	        });
	        // Update counts on each player.
	        this.playerList.forEach(function (player) {
	            player.setArmies(armyCounts[player.id]);
	            player.setTerritories(territoryCounts[player.id]);
	        });
	    };
	    // Handle a message received from the websocket.
	    Game.prototype.messageReceived = function (event) {
	        var message = JSON.parse(event.data);
	        switch (message.command) {
	            case 'join_game':
	                this.joinGameMessageReceived(message);
	                break;
	            case 'accept_join_game':
	                this.acceptJoinGameMessageReceived(message);
	                break;
	            case 'reject_join_game':
	                this.rejectJoinGameMessageReceived(message);
	                break;
	            case 'players_joined':
	                this.playersJoinedMessageReceived(message);
	                break;
	            case 'ping':
	                this.pingMessageReceived(message);
	                break;
	            case 'initialise_game':
	                this.initialiseGameMessageReceived(message);
	                break;
	            case 'setup':
	                this.setupMessageReceived(message);
	                break;
	            case 'attack':
	                this.attackMessageReceived(message);
	                break;
	            case 'defend':
	                this.defendMessageReceived(message);
	                break;
	            case 'attack_capture':
	                this.attackCaptureMessageReceived(message);
	                break;
	            case 'deploy':
	                this.deployMessageReceived(message);
	                break;
	            case 'roll_result':
	                this.rollResultMessageReceived(message);
	                break;
	            case 'fortify':
	                this.fortifyMessageReceived(message);
	                break;
	            case 'play_cards':
	                this.playCardsMessageReceived(message);
	                break;
	        }
	    };
	    // Send a message down the websocket.
	    Game.prototype.sendMessage = function (json) {
	        this.socket.send(JSON.stringify(json));
	    };
	    Game.prototype.joinGameMessageReceived = function (message) {
	        this.trigger('playerJoinRequested', message);
	    };
	    Game.prototype.acceptJoinGameMessageReceived = function (message) {
	        this.self.set('player_id', message.payload.player_id);
	        this.trigger('acceptJoinGame', message);
	    };
	    Game.prototype.rejectJoinGameMessageReceived = function (message) {
	        this.trigger('rejectJoinGame', message);
	    };
	    Game.prototype.playersJoinedMessageReceived = function (message) {
	        var _this = this;
	        message.payload.forEach(function (playerInfo) {
	            var player = new Player({
	                player_id: playerInfo[0],
	                name: playerInfo[1]
	            });
	            _this.playerList.add(player);
	        }, this);
	    };
	    Game.prototype.pingMessageReceived = function (message) {
	        // Ignore pings from non-player hosts.
	        if (message.player_id === null) {
	            return;
	        }
	        var player = this.playerList.get(message.player_id);
	        player.isActive = true;
	    };
	    Game.prototype.initialiseGameMessageReceived = function (message) {
	        this.set({
	            version: message.payload.version,
	            features: message.payload.supported_features
	        });
	        this.trigger('gameStart');
	    };
	    Game.prototype.setupMessageReceived = function (message) {
	        var player = this.playerList.get(message.player_id);
	        var territory = this.map.territories.get(message.payload);
	        // Tell the user what happened.
	        var toast = player.name + ' claimed ' + territory.getName();
	        if (territory.getOwner()) {
	            toast = player.name + ' reinforced ' + territory.getName();
	        }
	        this.showToast(toast);
	        this.handleSetupMessage(message);
	        this.nextTurn();
	    };
	    Game.prototype.handleSetupMessage = function (message) {
	        var player = this.playerList.get(message.player_id);
	        var territory = this.map.territories.get(message.payload);
	        // Claim/reinforce the specified territory.
	        territory.setOwner(player);
	        territory.addArmies(1);
	        this.updateArmyCounts();
	        // Trigger change to update the map view.
	        this.trigger('change:map');
	    };
	    Game.prototype.attackMessageReceived = function (message) {
	        var sourceId = message.payload[0];
	        var destId = message.payload[1];
	        var armyCount = message.payload[2];
	        var source = this.map.territories.get(sourceId);
	        var dest = this.map.territories.get(destId);
	        var sourcePlayer = this.playerList.get(message.player_id);
	        var destPlayer = dest.getOwner();
	        var destPlayerName = destPlayer.name;
	        if (destPlayer === this.self) {
	            destPlayerName = 'you';
	        }
	        this.showToast(sourcePlayer.name + ' is attacking ' + dest.getName() + ' (' + destPlayerName + ') from ' + source.getName() + ' with ' + armyCount + ' armies!');
	        this.handleAttackMessage(message, destPlayer === this.self);
	    };
	    Game.prototype.handleAttackMessage = function (message, isLocalPlayer) {
	        if (isLocalPlayer) {
	            this.trigger('defend', message.payload);
	        }
	        this.attackDetails = {
	            attack: message,
	            defend: null,
	            rolls: []
	        };
	    };
	    Game.prototype.defendMessageReceived = function (message) {
	        var player = this.playerList.get(message.player_id);
	        this.showToast(player.name + ' is defending with ' + message.payload + ' armies.');
	        this.handleDefendMessage(message);
	    };
	    Game.prototype.handleDefendMessage = function (message) {
	        this.attackDetails.defend = message;
	    };
	    Game.prototype.attackCaptureMessageReceived = function (message) {
	        var player = this.playerList.get(message.player_id);
	        var source = this.map.territories.get(message.payload[0]);
	        var dest = this.map.territories.get(message.payload[1]);
	        var armies = message.payload[2];
	        this.showToast(player.name + ' captured ' + dest.getName() + ' and moved in ' + armies + ' from ' + source.getName());
	        this.handleAttackCaptureMessage(message);
	    };
	    Game.prototype.handleAttackCaptureMessage = function (message) {
	        var source = this.map.territories.get(message.payload[0]);
	        var dest = this.map.territories.get(message.payload[1]);
	        var armies = message.payload[2];
	        source.addArmies(-armies);
	        dest.addArmies(armies);
	        this.trigger('change:map');
	    };
	    Game.prototype.deployMessageReceived = function (message) {
	        var _this = this;
	        var player = this.playerList.get(message.player_id);
	        message.payload.forEach(function (deployment) {
	            var territory = _this.map.territories.get(deployment[0]);
	            _this.showToast(player.name + ' has deployed ' + deployment[1] + ' armies to ' + territory.getName());
	        });
	        this.handleDeployMessage(message);
	    };
	    Game.prototype.handleDeployMessage = function (message) {
	        var _this = this;
	        message.payload.forEach(function (deployment) {
	            var territory = _this.map.territories.get(deployment[0]);
	            territory.addArmies(deployment[1]);
	        });
	        // Update the UI.
	        this.trigger('change:map');
	        this.updateArmyCounts();
	    };
	    Game.prototype.rollResultMessageReceived = function (message) {
	        // Handle first roll to set initial player as a special case.
	        if (!this.getCurrentPlayer()) {
	            this.set('currentPlayer', message.payload);
	            var player = this.getCurrentPlayer();
	            this.showToast(player.name + ' to play first');
	        }
	        else if (!this.map.deck.shuffled) {
	            this.map.deck.shuffleWithNumber(message.payload);
	        }
	        else {
	            this.attackDetails.rolls.push(message);
	            var attackRollCount = this.attackDetails.attack.payload[2];
	            var defendRollCount = this.attackDetails.defend.payload;
	            // If we've got all the dice rolls, calculate the result.
	            if (this.attackDetails.rolls.length === attackRollCount + defendRollCount) {
	                var rolls = this.attackDetails.rolls;
	                var attackRolls = [];
	                var defendRolls = [];
	                for (var i = 0; i < rolls.length; i++) {
	                    var value = rolls[i].payload;
	                    if (i < attackRollCount) {
	                        attackRolls.push(value);
	                    }
	                    else {
	                        defendRolls.push(value);
	                    }
	                }
	                attackRolls.sort();
	                defendRolls.sort();
	                // Calculate win/lose for each pair of dice.
	                var rollNumber = 1;
	                while (attackRolls.length && defendRolls.length) {
	                    var attackMax = attackRolls.pop();
	                    var defendMax = defendRolls.pop();
	                    var losingTerritory;
	                    // Decide which territory won. Defender always wins in a tie.
	                    if (attackMax > defendMax) {
	                        losingTerritory = this.attackDetails.attack.payload[1];
	                    }
	                    else {
	                        losingTerritory = this.attackDetails.attack.payload[0];
	                    }
	                    // Remove one army from the losing territory.
	                    var territory = this.map.territories.get(losingTerritory);
	                    territory.addArmies(-1);
	                    // Show the result.
	                    this.showToast('Roll ' + rollNumber + ': ' + territory.getName() + ' lost an army');
	                    rollNumber++;
	                }
	                // Update the UI.
	                this.trigger('change:map');
	                this.updateArmyCounts();
	                // Let the game view create an attack_capture command if the local player won the attack.
	                var defendingTerritory = this.map.territories.get(this.attackDetails.attack.payload[1]);
	                var attackingPlayer = this.playerList.get(this.attackDetails.attack.payload[0]);
	                if (attackingPlayer === this.self && defendingTerritory.getArmies() === 0) {
	                    this.trigger('attackCapture', this.attackDetails.attack);
	                }
	                // Take a card for this player if they won the attack.
	                if (defendingTerritory.getArmies() === 0 && !this.cardDrawn) {
	                    this.cardDrawn = true;
	                    var card = this.map.deck.first();
	                    if (card) {
	                        this.map.deck.remove(card);
	                        if (attackingPlayer === this.self) {
	                            this.playerCards.add(card);
	                        }
	                    }
	                }
	                // Clear stored attack details.
	                this.attackDetails = null;
	            }
	        }
	    };
	    Game.prototype.fortifyMessageReceived = function (message) {
	        var player = this.playerList.get(message.player_id);
	        var toastMessage;
	        if (message.payload) {
	            var source = this.map.territories.get(message.payload[0]);
	            var dest = this.map.territories.get(message.payload[1]);
	            var armies = message.payload[2];
	            toastMessage = player.name + ' moved ' + armies + ' armies from ' + source.getName() + ' to ' + dest.getName();
	        }
	        else {
	            toastMessage = player.name + ' has chosen not to fortify';
	        }
	        this.showToast(toastMessage);
	        this.handleFortifyMessage(message);
	    };
	    Game.prototype.handleFortifyMessage = function (message) {
	        if (message.payload === null) {
	            return;
	        }
	        var source = this.map.territories.get(message.payload[0]);
	        var dest = this.map.territories.get(message.payload[1]);
	        var armies = message.payload[2];
	        source.addArmies(armies);
	        dest.addArmies(-armies);
	        // Update the UI.
	        this.trigger('change:map');
	        this.updateArmyCounts();
	    };
	    Game.prototype.playCardsMessageReceived = function (message) {
	        var player = this.playerList.get(message.player_id);
	        if (message.payload !== null) {
	            this.showToast(player.name + ' traded in ' + message.payload.cards.length + ' sets of cards');
	        }
	        this.handlePlayCardsMessage(message);
	    };
	    Game.prototype.handlePlayCardsMessage = function (message) {
	        if (message.payload !== null) {
	            this.cardsTradedIn += message.payload.cards.length;
	        }
	    };
	    return Game;
	})(Model);
	module.exports = Game;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var View = __webpack_require__(2);
	var ConnectionView = (function (_super) {
	    __extends(ConnectionView, _super);
	    function ConnectionView(options) {
	        _super.call(this, options);
	        this.template = __webpack_require__(16);
	    }
	    Object.defineProperty(ConnectionView.prototype, "className", {
	        get: function () {
	            return 'connection-view';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ConnectionView.prototype, "events", {
	        get: function () {
	            return {
	                'click .connect-button': 'connectButtonClick',
	                'click .host-button': 'hostButtonClick'
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ConnectionView.prototype.connectButtonClick = function (e) {
	        var _this = this;
	        if (!this.$('.connect-form')[0].checkValidity()) {
	            return true;
	        }
	        var hostname = this.$('#connection-host').val(), port = this.$('#connection-port').val(), ai = this.$('#connection-ai')[0].checked, name = this.$('#player-name').val();
	        this.disableInputs();
	        this.model.showToast('Connecting...');
	        this.model.connect(name, hostname, port, ai).catch(function (message) {
	            var toastText = 'Failed to connect to WebSocket server.';
	            if (message.command && message.command === 'reject_join_game') {
	                toastText = 'Join rejected: "' + message.payload + '".';
	            }
	            _this.model.showToast(toastText);
	            _this.enableInputs();
	        });
	        // TODO show loading indicator.
	        return false;
	    };
	    ConnectionView.prototype.hostButtonClick = function (e) {
	        var _this = this;
	        if (!this.$('.host-form')[0].checkValidity()) {
	            return true;
	        }
	        var port = +this.$('#host-port').val(), name = this.$('#host-player-name').val();
	        this.disableInputs();
	        this.model.showToast('Starting server...');
	        this.model.startServer(name, port).catch(function () {
	            _this.model.showToast('Failed to start server.');
	            _this.enableInputs();
	        });
	        // TODO show loading indicator.
	        return false;
	    };
	    ConnectionView.prototype.disableInputs = function () {
	        this.$('input, button').prop('disabled', true);
	    };
	    ConnectionView.prototype.enableInputs = function () {
	        this.$('input, button').prop('disabled', false);
	    };
	    return ConnectionView;
	})(View);
	module.exports = ConnectionView;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var View = __webpack_require__(2);
	var Player = __webpack_require__(12);
	var LobbyView = (function (_super) {
	    __extends(LobbyView, _super);
	    function LobbyView(options) {
	        _super.call(this, options);
	        this.template = __webpack_require__(17);
	        this.listenTo(this.model.playerList, 'add', this.render);
	        this.listenTo(this.model, 'playerJoinRequested', this.playerJoinRequested);
	        this.requestedPlayers = [];
	    }
	    Object.defineProperty(LobbyView.prototype, "events", {
	        get: function () {
	            return {
	                'click .start-game-button': 'startGameButtonClick'
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    LobbyView.prototype.getRenderData = function () {
	        return {
	            players: this.model.playerList.toJSON(),
	            isHost: this.model.isHost()
	        };
	    };
	    LobbyView.prototype.playerJoinRequested = function (message) {
	        //this.requestedPlayers.push(message);
	        // TODO get confirmation from user.
	        var response;
	        if (this.model.playerList.length === 6) {
	            response = ({
	                command: 'reject_join_game',
	                payload: 'Game full'
	            });
	        }
	        else {
	            var player = new Player({
	                player_id: this.model.playerList.length,
	                name: message.payload.name
	            });
	            this.model.playerList.push(player);
	            response = ({
	                command: 'accept_join_game',
	                payload: {
	                    player_id: player.id,
	                    acknowledgement_timeout: 0,
	                    move_timeout: 0
	                }
	            });
	        }
	        this.model.sendMessage(response);
	    };
	    LobbyView.prototype.startGameButtonClick = function () {
	        if (this.model.playerList.length < 3) {
	            this.model.showToast('Not enough players');
	            return;
	        }
	        // TODO host will already be sending this. Probably want to send something else instead to trigger game start.
	        var pingCommand = ({
	            command: 'ping',
	            player_id: this.model.self.id,
	            payload: this.model.playerList.length
	        });
	        this.model.sendMessage(pingCommand);
	        this.$('.start-game-button').remove();
	    };
	    return LobbyView;
	})(View);
	module.exports = LobbyView;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var View = __webpack_require__(2);
	var PlayerListView = __webpack_require__(18);
	var MapView = __webpack_require__(19);
	var CardSelectView = __webpack_require__(20);
	var ArmyCountSelectView = __webpack_require__(21);
	var GameView = (function (_super) {
	    __extends(GameView, _super);
	    function GameView(options) {
	        _super.call(this, options);
	        this.template = __webpack_require__(22);
	        this.deployableArmies = 0;
	        var playerListView = new PlayerListView({ model: this.model });
	        var mapView = new MapView({ model: this.model });
	        this.cardSelectView = new CardSelectView({ collection: this.model.playerCards });
	        this.armyCountSelectView = new ArmyCountSelectView();
	        this.listenTo(mapView, 'territorySelect', this.territorySelected);
	        this.listenTo(this.model, 'change:currentPlayer', this.currentPlayerChange);
	        this.listenTo(this.model, 'defend', this.startDefend);
	        this.listenTo(this.model, 'attackCapture', this.getAttackCapture);
	        this.childViews = [
	            {
	                view: playerListView,
	                el: '#player-list'
	            },
	            {
	                view: mapView,
	                el: '#map'
	            },
	            {
	                view: this.armyCountSelectView,
	                el: '#army-count-select'
	            },
	            {
	                view: this.cardSelectView,
	                el: '#card-select'
	            }
	        ];
	    }
	    Object.defineProperty(GameView.prototype, "className", {
	        get: function () {
	            return 'game';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(GameView.prototype, "events", {
	        get: function () {
	            return {
	                'click #attack-end-button': 'endAttackPhase',
	                'click #no-fortify-button': 'noFortifyButtonClick'
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    GameView.prototype.currentPlayerChange = function () {
	        this.clearHighlightedTerritories();
	        var player = this.model.getCurrentPlayer();
	        if (player === this.model.self) {
	            this.startTurn();
	        }
	        else {
	            // TODO end turn
	            this.model.showToast(player.name + '\'s turn', true);
	        }
	    };
	    GameView.prototype.startTurn = function () {
	        var _this = this;
	        this.model.showToast('Your turn!');
	        if (this.model.getPhase() === 'setup') {
	            var allTerritoriesClaimed = this.model.map.territories.every(function (territory) {
	                return territory.getOwner() !== null;
	            });
	            var toastMessage;
	            if (allTerritoriesClaimed) {
	                toastMessage = 'Select a territory to reinforce...';
	            }
	            else {
	                toastMessage = 'Select a territory to claim...';
	            }
	            this.model.showToast(toastMessage, true);
	        }
	        else {
	            this.model.setPhase('cards');
	            this.deployableArmies = this.model.getNewPlayerArmies();
	            if (this.model.playerCards.canTradeInCards()) {
	                var playCardsMessage = {
	                    command: 'play_cards',
	                    payload: {
	                        cards: [],
	                        armies: -1
	                    },
	                    player_id: this.model.self.id
	                };
	                this.cardSelectView.show();
	                this.cardSelectView.off('trade');
	                this.cardSelectView.off('close');
	                // Add each set of cards to the command.
	                this.cardSelectView.on('trade', function (cards) {
	                    _this.model.playerCards.remove(cards);
	                    playCardsMessage.payload.cards.push(cards);
	                });
	                this.cardSelectView.on('close', function () {
	                    var cards = playCardsMessage.payload.cards;
	                    if (cards.length === 0) {
	                        playCardsMessage.payload = null;
	                    }
	                    else {
	                        for (var i = 0; i < cards.length; i++) {
	                            _this.deployableArmies += _this.model.getCardArmies();
	                        }
	                        // Check if any of the cards traded in match an owned territory.
	                        var bonusTerritory = null;
	                        cards.forEach(function (set) {
	                            set.forEach(function (card) {
	                                var territory = card.getTerritory();
	                                if (territory.getOwner() === _this.model.self) {
	                                    bonusTerritory = territory;
	                                }
	                            });
	                        });
	                        // Automatically deploy bonus armies to one of the matched territories.
	                        if (bonusTerritory) {
	                            _this.message = ({
	                                command: 'deploy',
	                                payload: [[bonusTerritory.id, 2]],
	                                player_id: _this.model.self.id
	                            });
	                            bonusTerritory.addArmies(2);
	                            _this.model.trigger('change:map');
	                        }
	                    }
	                    _this.model.sendMessage(playCardsMessage);
	                    _this.startDeployPhase();
	                });
	            }
	            else {
	                var playCardsMessage = {
	                    command: 'play_cards',
	                    payload: null,
	                    player_id: this.model.self.id
	                };
	                this.model.sendMessage(playCardsMessage);
	                this.startDeployPhase();
	            }
	        }
	        this.highlightSelectableTerritories();
	    };
	    GameView.prototype.territorySelected = function (id) {
	        var _this = this;
	        var territory = this.model.map.territories.get(id);
	        // Only perform an action on the correct turn.
	        // TODO also allow actions to be performed when defending.
	        if (this.model.getCurrentPlayer() !== this.model.self) {
	            return;
	        }
	        var phase = this.model.getPhase();
	        if (phase === 'setup') {
	            // Check this territory can be selected.
	            var allTerritoriesClaimed = this.model.map.territories.every(function (territory) {
	                return territory.getOwner() !== null;
	            });
	            // Check this territory can be selected.
	            if (!allTerritoriesClaimed && territory.getOwner() !== null) {
	                this.model.showToast('This territory has already been claimed.');
	                return;
	            }
	            else if (allTerritoriesClaimed && territory.getOwner() !== this.model.self) {
	                this.model.showToast('You do not own this territory.');
	                return;
	            }
	            var message = {
	                command: 'setup',
	                payload: id,
	                player_id: this.model.self.id
	            };
	            this.model.handleSetupMessage(message);
	            this.model.sendMessage(message);
	            // Turn complete.
	            this.model.nextTurn();
	        }
	        else if (phase === 'deploy') {
	            // Check this territory can be selected.
	            if (territory.getOwner() !== this.model.self) {
	                this.model.showToast('You do not own this territory.');
	                return;
	            }
	            if (!this.message || this.message.command !== 'deploy') {
	                this.message = ({
	                    command: 'deploy',
	                    payload: [],
	                    player_id: this.model.self.id
	                });
	            }
	            // Get how many armies to deploy, add this deployment to the message payload
	            this.armyCountSelectView.setMin(1);
	            this.armyCountSelectView.setMax(this.deployableArmies);
	            this.armyCountSelectView.off('select');
	            this.armyCountSelectView.on('select', function (armies) {
	                _this.message.payload.push([id, armies]);
	                _this.deployableArmies -= armies;
	                // Update map.
	                var territory = _this.model.map.territories.get(id);
	                territory.addArmies(armies);
	                _this.model.trigger('change:map');
	                _this.model.showToast('Select one or more territories to deploy your new armies to. You have ' + _this.deployableArmies + ' armies.', true);
	                if (_this.deployableArmies === 0) {
	                    _this.model.sendMessage(_this.message);
	                    _this.model.setPhase('attack');
	                    _this.startAttackPhase();
	                }
	            });
	            this.armyCountSelectView.show();
	        }
	        else if (phase === 'attack') {
	            if (this.message === null) {
	                // Check this territory can be selected.
	                if (territory.getOwner() !== this.model.self) {
	                    this.model.showToast('You do not own this territory');
	                    return;
	                }
	                if (territory.getArmies() < 2) {
	                    this.model.showToast('This territory doesn\'t contain enough armies to attack');
	                    return;
	                }
	                this.message = ({
	                    command: 'attack',
	                    payload: [id],
	                    player_id: this.model.self.id
	                });
	                this.model.showToast('Select a territory to attack', true);
	                this.highlightSelectableTerritories();
	            }
	            else {
	                // Check this territory can be selected.
	                if (territory.getOwner() === this.model.self) {
	                    this.model.showToast('You cannot attack your own territory');
	                    return;
	                }
	                var sourceId = this.message.payload[0];
	                var sourceTerritory = this.model.map.territories.get(sourceId);
	                if (!territory.connections.get(sourceTerritory)) {
	                    this.model.showToast('This territory is not connected to yours.');
	                    return;
	                }
	                // TODO add deselect button.
	                this.message.payload.push(id);
	                // Get number of armies to attack with.
	                var maxArmies = Math.min(3, sourceTerritory.getArmies() - 1);
	                this.armyCountSelectView.setMin(1);
	                this.armyCountSelectView.setMax(maxArmies);
	                this.armyCountSelectView.off('select');
	                this.armyCountSelectView.on('select', function (armies) {
	                    _this.message.payload.push(armies);
	                    _this.model.handleAttackMessage(_this.message, false);
	                    _this.model.sendMessage(_this.message);
	                    _this.message = null;
	                    // TODO show roll result view.
	                });
	                this.armyCountSelectView.show(true);
	            }
	        }
	        else if (phase === 'fortify') {
	            if (!this.message) {
	                // Check this territory can be selected.
	                if (territory.getOwner() !== this.model.self) {
	                    this.model.showToast('You do not own this territory');
	                    return;
	                }
	                if (territory.getArmies() < 2) {
	                    this.model.showToast('This territory doesn\'t contain enough armies to fortify');
	                    return;
	                }
	                this.message = ({
	                    command: 'fortify',
	                    payload: [id],
	                    player_id: this.model.self.id
	                });
	                this.model.showToast('Select a territory to fortify', true);
	                this.highlightSelectableTerritories();
	            }
	            else {
	                // Check this territory can be selected.
	                if (territory.getOwner() !== this.model.self) {
	                    this.model.showToast('You do not own this territory');
	                    return;
	                }
	                var sourceId = this.message.payload[0];
	                var sourceTerritory = this.model.map.territories.get(sourceId);
	                if (!territory.connections.get(sourceTerritory)) {
	                    this.model.showToast('This territory is not connected to the source');
	                    return;
	                }
	                // TODO add deselect button.
	                this.message.payload.push(id);
	                // Get number of armies to attack with.
	                var maxArmies = Math.min(3, sourceTerritory.getArmies() - 1);
	                this.armyCountSelectView.setMin(1);
	                this.armyCountSelectView.setMax(maxArmies);
	                this.armyCountSelectView.off('select');
	                this.armyCountSelectView.on('select', function (armies) {
	                    _this.message.payload.push(armies);
	                    _this.model.handleFortifyMessage(_this.message);
	                    _this.model.sendMessage(_this.message);
	                    _this.message = null;
	                    _this.endTurn();
	                });
	                this.armyCountSelectView.show(true);
	            }
	        }
	    };
	    GameView.prototype.startDeployPhase = function () {
	        this.model.setPhase('deploy');
	        this.model.showToast('Select one or more territories to deploy your new armies to. You have ' + this.deployableArmies + ' armies.', true);
	    };
	    GameView.prototype.startAttackPhase = function () {
	        this.$('#attack-end-button').removeClass('hidden');
	        this.model.showToast('Select a territory to attack from', true);
	        this.message = null;
	        this.highlightSelectableTerritories();
	    };
	    GameView.prototype.endAttackPhase = function () {
	        this.$('#attack-end-button').addClass('hidden');
	        this.$('#no-fortify-button').removeClass('hidden');
	        this.model.setPhase('fortify');
	        this.model.showToast('Select a territory to move armies from, if you wish to fortify', true);
	        this.message = null;
	        this.highlightSelectableTerritories();
	    };
	    GameView.prototype.getAttackCapture = function (attack) {
	        var _this = this;
	        this.model.showToast('You won! Select how many armies you wish to move in to the new territory', true);
	        var sourceTerritory = this.model.map.territories.get(attack.payload[0]);
	        this.armyCountSelectView.setMin(attack.payload[2]);
	        this.armyCountSelectView.setMax(sourceTerritory.getArmies() - 1);
	        this.armyCountSelectView.off('select');
	        this.armyCountSelectView.on('select', function (count) {
	            var message = {
	                command: 'attack_capture',
	                payload: [attack.payload[0], attack.payload[1], count],
	                player_id: _this.model.self.id
	            };
	            _this.model.sendMessage(message);
	            _this.model.handleAttackCaptureMessage(message);
	        });
	        // TODO disable cancel button.
	    };
	    GameView.prototype.noFortifyButtonClick = function () {
	        this.$('#no-fortify-button').addClass('hidden');
	        var message = {
	            command: 'fortify',
	            payload: null,
	            player_id: this.model.self.id
	        };
	        this.model.sendMessage(message);
	        this.endTurn();
	    };
	    GameView.prototype.endTurn = function () {
	        this.model.nextTurn();
	    };
	    GameView.prototype.startDefend = function (payload) {
	        var _this = this;
	        var territory = this.model.map.territories.get(payload[0]);
	        var maxArmies = Math.min(2, territory.getArmies());
	        this.model.setPhase('defend');
	        this.armyCountSelectView.setMin(1);
	        this.armyCountSelectView.setMax(maxArmies);
	        this.armyCountSelectView.off('select');
	        this.armyCountSelectView.on('select', function (count) {
	            var message = {
	                command: 'defend',
	                payload: count,
	                player_id: _this.model.self.id
	            };
	            _this.model.handleDefendMessage(message);
	            _this.model.sendMessage(message);
	        });
	        this.armyCountSelectView.show(true);
	    };
	    GameView.prototype.highlightSelectableTerritories = function () {
	        var _this = this;
	        this.clearHighlightedTerritories();
	        var invalidTerritories = [];
	        var phase = this.model.getPhase();
	        if (phase === 'setup') {
	            var allTerritoriesClaimed = this.model.map.territories.every(function (territory) {
	                return territory.getOwner() !== null;
	            });
	            if (!allTerritoriesClaimed) {
	                this.model.map.territories.forEach(function (territory) {
	                    if (territory.getOwner() !== null) {
	                        invalidTerritories.push(territory.id);
	                    }
	                });
	            }
	            else {
	                this.model.map.territories.forEach(function (territory) {
	                    if (territory.getOwner() !== _this.model.self) {
	                        invalidTerritories.push(territory.id);
	                    }
	                });
	            }
	        }
	        else if (phase === 'deploy') {
	            this.model.map.territories.forEach(function (territory) {
	                if (territory.getOwner() !== _this.model.self) {
	                    invalidTerritories.push(territory.id);
	                }
	            });
	        }
	        else if (phase === 'attack') {
	            if (this.message === null) {
	                this.model.map.territories.forEach(function (territory) {
	                    if (territory.getOwner() !== _this.model.self) {
	                        invalidTerritories.push(territory.id);
	                    }
	                });
	            }
	            else {
	                var sourceId = this.message.payload[0];
	                var source = this.model.map.territories.get(sourceId);
	                invalidTerritories = this.model.map.territories.map(function (territory) { return territory.id; });
	                source.connections.forEach(function (territory) {
	                    if (territory.getOwner() !== _this.model.self) {
	                        invalidTerritories.splice(invalidTerritories.indexOf(territory.id), 1);
	                    }
	                });
	            }
	        }
	        else if (phase === 'fortify') {
	            if (!this.message) {
	                this.model.map.territories.forEach(function (territory) {
	                    if (territory.getOwner() !== _this.model.self) {
	                        invalidTerritories.push(territory.id);
	                    }
	                });
	            }
	            else {
	                var sourceId = this.message.payload[0];
	                var source = this.model.map.territories.get(sourceId);
	                invalidTerritories = this.model.map.territories.map(function (territory) { return territory.id; });
	                source.connections.forEach(function (territory) {
	                    if (territory.getOwner() === _this.model.self) {
	                        invalidTerritories.splice(invalidTerritories.indexOf(territory.id), 1);
	                    }
	                });
	            }
	        }
	        invalidTerritories.forEach(function (id) { return document.querySelector('svg .territory[data-territory-id="' + id + '"]').classList.add('fade'); });
	    };
	    GameView.prototype.clearHighlightedTerritories = function () {
	        var territories = document.querySelectorAll('svg .territory.fade');
	        for (var i = 0; i < territories.length; i++) {
	            territories[i].classList.remove('fade');
	        }
	    };
	    return GameView;
	})(View);
	module.exports = GameView;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var View = __webpack_require__(2);
	var TIMEOUT = 5000;
	var Toast = (function (_super) {
	    __extends(Toast, _super);
	    function Toast() {
	        _super.apply(this, arguments);
	    }
	    Object.defineProperty(Toast.prototype, "className", {
	        get: function () {
	            return 'toast';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Toast.prototype.initialize = function (options) {
	        this.message = options.message;
	        if (options.persistent) {
	            // Clear any previous persistent toasts.
	            if (Toast.persistentToast) {
	                Toast.persistentToast.remove();
	            }
	            Toast.persistentToast = this;
	        }
	        else {
	            setTimeout(this.remove.bind(this), TIMEOUT);
	        }
	    };
	    Toast.prototype.render = function () {
	        this.$el.text(this.message);
	        return this;
	    };
	    return Toast;
	})(View);
	module.exports = Toast;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(9);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(23)(content, {});
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		module.hot.accept("!!/Users/Peter/Dropbox/Documents/Uni/3rd Year/CS3099-STP/risk/www/node_modules/css-loader/index.js!/Users/Peter/Dropbox/Documents/Uni/3rd Year/CS3099-STP/risk/www/node_modules/autoprefixer-loader/index.js!/Users/Peter/Dropbox/Documents/Uni/3rd Year/CS3099-STP/risk/www/node_modules/less-loader/index.js!/Users/Peter/Dropbox/Documents/Uni/3rd Year/CS3099-STP/risk/www/src/less/main.less", function() {
			var newContent = require("!!/Users/Peter/Dropbox/Documents/Uni/3rd Year/CS3099-STP/risk/www/node_modules/css-loader/index.js!/Users/Peter/Dropbox/Documents/Uni/3rd Year/CS3099-STP/risk/www/node_modules/autoprefixer-loader/index.js!/Users/Peter/Dropbox/Documents/Uni/3rd Year/CS3099-STP/risk/www/node_modules/less-loader/index.js!/Users/Peter/Dropbox/Documents/Uni/3rd Year/CS3099-STP/risk/www/src/less/main.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(42)();
	exports.push([module.id, ".game {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  height: 100%;\n}\n.army-count-select {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(0, 0, 0, 0.2);\n}\n.modal {\n  width: 500px;\n  margin: 100px auto;\n  background-color: #FFF;\n  padding: 10px 20px 20px;\n  border-radius: 6px;\n}\n#attack-end-button {\n  position: absolute;\n  left: 10px;\n  bottom: 10px;\n}\n.card {\n  float: left;\n  width: 50px;\n  height: 80px;\n  border-radius: 8px;\n  border: 1px solid #999;\n  text-align: center;\n  margin: 11px;\n}\n.card.active {\n  border: 2px solid blue;\n  margin: 10px;\n}\n#player-list {\n  width: 300px;\n  height: 100%;\n  background-color: #E6E6E6;\n  border-right: 1px solid #979797;\n  position: relative;\n}\n#player-list .player-list-item {\n  height: 90px;\n}\n#player-list .armies-badge {\n  width: 55px;\n  height: 55px;\n  float: left;\n  text-align: center;\n  border-radius: 50%;\n  background: red;\n  border: 1px solid #FFF;\n  color: #FFF;\n  font-size: 24px;\n  padding-top: 5px;\n  box-sizing: border-box;\n}\n#player-list .armies-badge .armies-count {\n  font-size: 12px;\n  opacity: 0.79;\n}\n#player-list .current-player-thumb {\n  background: url('/img/current-player-thumb.png') no-repeat center;\n  background-size: 100%;\n  width: 42px;\n  height: 90px;\n  position: absolute;\n  right: -13px;\n  top: 0;\n  -webkit-transition: -webkit-transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);\n          transition: transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);\n}\n#player-list .current-player-thumb[data-player-id=\"1\"] {\n  -webkit-transform: translateY(90px);\n      -ms-transform: translateY(90px);\n          transform: translateY(90px);\n}\n#player-list .current-player-thumb[data-player-id=\"2\"] {\n  -webkit-transform: translateY(180px);\n      -ms-transform: translateY(180px);\n          transform: translateY(180px);\n}\n#player-list .current-player-thumb[data-player-id=\"3\"] {\n  -webkit-transform: translateY(270px);\n      -ms-transform: translateY(270px);\n          transform: translateY(270px);\n}\n#player-list .current-player-thumb[data-player-id=\"4\"] {\n  -webkit-transform: translateY(360px);\n      -ms-transform: translateY(360px);\n          transform: translateY(360px);\n}\n#player-list .current-player-thumb[data-player-id=\"5\"] {\n  -webkit-transform: translateY(450px);\n      -ms-transform: translateY(450px);\n          transform: translateY(450px);\n}\n#map {\n  width: 100%;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n          align-items: center;\n  background-color: #C2DFFF;\n}\n#map svg {\n  width: 100%;\n  height: 100%;\n}\n#map svg .territory {\n  -webkit-transition: opacity 0.5s linear;\n          transition: opacity 0.5s linear;\n  cursor: pointer;\n}\n#map svg .territory.fade {\n  opacity: 0.2;\n  cursor: auto;\n}\n#map svg text {\n  fill: #000;\n}\n.map {\n  width: 100%;\n  margin: auto 0;\n}\n.toast-container {\n  pointer-events: none;\n  position: fixed;\n  top: 0;\n  bottom: 50px;\n  right: 0;\n  left: 0;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: end;\n  -webkit-justify-content: flex-end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n}\n.toast-container .toast {\n  width: 500px;\n  text-align: center;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  padding: 15px;\n  border-radius: 3px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);\n  background-color: rgba(255, 255, 255, 0.7);\n  margin: 10px 0;\n  -webkit-flex-shrink: 0;\n      -ms-flex-negative: 0;\n          flex-shrink: 0;\n}\n.connection-view {\n  width: 600px;\n  margin: 100px auto;\n  border: 1px solid #CCC;\n  overflow: auto;\n  border-radius: 8px;\n}\n.connection-view form {\n  width: 50%;\n  float: left;\n  padding: 15px;\n}\n.connection-view label,\n.connection-view input:not([type=checkbox]) {\n  display: block;\n}\n.connection-view label {\n  margin-top: 10px;\n}\n* {\n  box-sizing: border-box;\n}\nhtml,\nbody,\n.view-container {\n  height: 100%;\n}\nbody {\n  font-family: Helvetica, Arial, sans-serif;\n  margin: 0;\n}\nbody > div {\n  height: 100%;\n}\ninput:not([type=checkbox]) {\n  width: 100%;\n  font-size: 16px;\n  border-radius: 4px;\n  border: 1px solid #CCC;\n  padding: 8px;\n}\nbutton {\n  border-radius: 4px;\n  padding: 8px 16px;\n  font-size: 16px;\n  outline: none;\n  background-color: #FFF;\n  border: 1px solid #CCC;\n  cursor: pointer;\n  margin-top: 10px;\n}\n.hidden {\n  display: none;\n}\n", ""]);

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(40);
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
	  return "<div class=\"view-container\"></div>\n<div class=\"toast-container\"></div>\n";
	  },"useData":true});

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	/// <reference path="../../lib/backbone/backbone.d.ts" />
	var Backbone = __webpack_require__(24);
	var Model = (function (_super) {
	    __extends(Model, _super);
	    function Model() {
	        _super.apply(this, arguments);
	    }
	    return Model;
	})(Backbone.Model);
	module.exports = Model;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var Model = __webpack_require__(11);
	var colours = [
	    '#FF2B2B',
	    '#2BE0FF',
	    '#F6FF2B',
	    '#B4EC51',
	    '#F5A623',
	    '#53A0FD'
	];
	var Player = (function (_super) {
	    __extends(Player, _super);
	    function Player() {
	        _super.apply(this, arguments);
	    }
	    Object.defineProperty(Player.prototype, "defaults", {
	        get: function () {
	            return {
	                isActive: false,
	                armies: 0,
	                territories: 0
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Player.prototype, "idAttribute", {
	        get: function () {
	            return 'player_id';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Player.prototype, "playerId", {
	        get: function () {
	            return _super.prototype.get.call(this, 'player_id');
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Player.prototype, "name", {
	        get: function () {
	            return _super.prototype.get.call(this, 'name');
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Player.prototype, "isActive", {
	        get: function () {
	            return _super.prototype.get.call(this, 'isActive');
	        },
	        set: function (isActive) {
	            _super.prototype.set.call(this, 'isActive', isActive);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Player.prototype.getColour = function () {
	        return colours[this.playerId];
	    };
	    Player.prototype.setArmies = function (armies) {
	        this.set('armies', armies);
	    };
	    Player.prototype.getArmies = function () {
	        return this.get('armies');
	    };
	    Player.prototype.setTerritories = function (territories) {
	        this.set('territories', territories);
	    };
	    Player.prototype.getTerritories = function () {
	        return this.get('territories');
	    };
	    return Player;
	})(Model);
	module.exports = Player;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var Collection = __webpack_require__(26);
	var PlayerList = (function (_super) {
	    __extends(PlayerList, _super);
	    function PlayerList() {
	        _super.apply(this, arguments);
	    }
	    PlayerList.prototype.comparator = function (player) {
	        return player.id;
	    };
	    PlayerList.prototype.getActivePlayerCount = function () {
	        return this.reduce(function (prev, player) {
	            return prev + ((player.isActive) ? 1 : 0);
	        }, 0);
	    };
	    return PlayerList;
	})(Collection);
	module.exports = PlayerList;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var Model = __webpack_require__(11);
	var Collection = __webpack_require__(26);
	var Continent = __webpack_require__(27);
	var Territory = __webpack_require__(28);
	var CardList = __webpack_require__(15);
	var Card = __webpack_require__(29);
	var Map = (function (_super) {
	    __extends(Map, _super);
	    function Map() {
	        _super.apply(this, arguments);
	    }
	    Map.prototype.initialize = function (options) {
	        this.continents = new Collection();
	        this.territories = new Collection();
	        this.deck = new CardList();
	    };
	    Map.prototype.fromJSON = function (json) {
	        for (var i in json.continents) {
	            var id = +i;
	            var continent = new Continent({ id: id });
	            this.continents.add(continent);
	            json.continents[i].forEach(function (territoryId) {
	                var territory = new Territory({ id: +territoryId });
	                continent.territories.add(territory);
	                this.territories.add(territory);
	            }, this);
	        }
	        // Set connections between each territory.
	        json.connections.forEach(function (connection) {
	            var territory1 = this.territories.get(connection[0]);
	            var territory2 = this.territories.get(connection[1]);
	            territory1.connections.add(territory2);
	            territory2.connections.add(territory1);
	        }, this);
	        for (var i in json.continent_values) {
	            var continent = this.continents.get(+i);
	            continent.setValue(json.continent_values[i]);
	        }
	        for (var i in json.country_names) {
	            var territory = this.territories.get(+i);
	            territory.setName(json.country_names[i]);
	        }
	        for (var i in json.continent_names) {
	            var continent = this.continents.get(+i);
	            continent.setName(json.continent_names[i]);
	        }
	        var cardTypes = [
	            'infantry',
	            'cavalry',
	            'artillery'
	        ];
	        for (var i in json.country_card) {
	            var cardType = cardTypes[json.country_card[i]];
	            var territory = this.territories.get(+i);
	            territory.setCardType(cardType);
	            var card = new Card({
	                type: cardType,
	                territory: territory
	            });
	            this.deck.add(card);
	        }
	        for (var j = 0; j < json.wildcards; j++) {
	            this.deck.add(new Card({ type: 'wildcard' }));
	        }
	    };
	    return Map;
	})(Model);
	module.exports = Map;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var Collection = __webpack_require__(26);
	var CardList = (function (_super) {
	    __extends(CardList, _super);
	    function CardList() {
	        _super.apply(this, arguments);
	        this.shuffled = false;
	        this.shuffleIndex = 0;
	    }
	    // Check if there are any valid sets of cards in this deck.
	    CardList.prototype.canTradeInCards = function () {
	        var artilleryCount = this.where({ type: 'artillery' }).length;
	        var cavalryCount = this.where({ type: 'cavalry' }).length;
	        var infantryCount = this.where({ type: 'infantry' }).length;
	        var hasWildcards = this.findWhere({ type: 'wildcard' }) != null;
	        return artilleryCount > 2 || cavalryCount > 2 || infantryCount > 2 || hasWildcards && this.length > 2 || (artilleryCount > 0 && cavalryCount > 0 && infantryCount > 0);
	    };
	    CardList.prototype.shuffleWithNumber = function (n) {
	        var first = this.at(this.shuffleIndex);
	        var second = this.at(n);
	        this.models[n] = first;
	        this.models[this.shuffleIndex] = second;
	        // Increment shuffle position, check if we're done.
	        if (++this.shuffleIndex === this.length) {
	            this.shuffled = true;
	        }
	    };
	    return CardList;
	})(Collection);
	module.exports = CardList;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(40);
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
	  return "<form class=\"connect-form\">\n	<h2>Connect to a host</h2>\n	<label for=\"player-name\">Player name</label>\n	<input type=\"text\" id=\"player-name\" required>\n	<label for=\"connection-host\">Hostname</label>\n	<input type=\"text\" id=\"connection-host\" value=\"localhost\" required>\n	<label for=\"connection-port\">Port</label>\n	<input type=\"number\" id=\"connection-port\" value=\"7475\" required>\n	<label><input type=\"checkbox\" id=\"connection-ai\"> Use AI</label>\n	<button type=\"submit\" class=\"connect-button\">Connect</button>\n</form>\n<form class=\"host-form\">\n	<h2>Start a server</h2>\n	<label for=\"host-player-name\">Player name</label>\n	<input type=\"text\" id=\"host-player-name\" required>\n	<label for=\"host-port\">Port: </label>\n	<input type=\"number\" id=\"host-port\" value=\"7475\" required>\n	<button type=\"submit\" class=\"host-button\">Launch</button>\n</form>\n";
	  },"useData":true});

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(40);
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(depth0,helpers,partials,data) {
	  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
	  return "	<div>"
	    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
	    + "</div>\n";
	},"3":function(depth0,helpers,partials,data) {
	  return "	<button class=\"start-game-button\">Start game</button>\n";
	  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
	  var stack1, buffer = "<h2>Lobby</h2>\n<h4>Awaiting players</h4>\n";
	  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.players : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
	  if (stack1 != null) { buffer += stack1; }
	  buffer += "\n";
	  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isHost : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
	  if (stack1 != null) { buffer += stack1; }
	  return buffer;
	},"useData":true});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var View = __webpack_require__(2);
	var PlayerListItemView = __webpack_require__(30);
	var PlayerListView = (function (_super) {
	    __extends(PlayerListView, _super);
	    function PlayerListView(options) {
	        _super.call(this, options);
	        this.template = __webpack_require__(31);
	        this.listenTo(this.model, 'change:currentPlayer', this.updateCurrentPlayer);
	    }
	    PlayerListView.prototype.render = function (data) {
	        var _this = this;
	        _super.prototype.render.call(this);
	        this.model.playerList.forEach(function (player) {
	            var view = new PlayerListItemView({ model: player });
	            _this.listViews.push(view);
	            _this.$('.player-container').append(view.render().el);
	        });
	        this.updateCurrentPlayer();
	        return this;
	    };
	    PlayerListView.prototype.updateCurrentPlayer = function () {
	        this.$('.current-player-thumb').attr('data-player-id', this.model.getCurrentPlayerId());
	    };
	    return PlayerListView;
	})(View);
	module.exports = PlayerListView;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var View = __webpack_require__(2);
	var MapView = (function (_super) {
	    __extends(MapView, _super);
	    function MapView() {
	        _super.apply(this, arguments);
	        this.template = __webpack_require__(32);
	    }
	    Object.defineProperty(MapView.prototype, "className", {
	        get: function () {
	            return 'map';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(MapView.prototype, "events", {
	        get: function () {
	            return {
	                'click .territory': 'territoryClick'
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    MapView.prototype.initialize = function () {
	        this.listenTo(this.model, 'change:map', this.updateMapState);
	    };
	    MapView.prototype.render = function () {
	        _super.prototype.render.call(this);
	        this.updateMapState();
	        return this;
	    };
	    MapView.prototype.updateMapState = function () {
	        this.model.map.territories.forEach(function (territory) {
	            // Set fill colour to match owning player.
	            var owner = territory.getOwner();
	            var colour = '#FFFFFF';
	            var $territory = this.$('.territory[data-territory-id=' + territory.id + ']');
	            if (owner) {
	                colour = owner.getColour();
	            }
	            $territory.attr('fill', colour);
	            // Show number of armies.
	            var armies = territory.getArmies();
	            this.$('text[data-territory-id=' + territory.id + '] tspan').text(armies);
	        }, this);
	    };
	    MapView.prototype.territoryClick = function (e) {
	        var territoryId = this.$(e.currentTarget).data('territory-id');
	        this.trigger('territorySelect', +territoryId);
	    };
	    return MapView;
	})(View);
	module.exports = MapView;


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var View = __webpack_require__(2);
	var CardSelectView = (function (_super) {
	    __extends(CardSelectView, _super);
	    function CardSelectView() {
	        _super.apply(this, arguments);
	        this.template = __webpack_require__(33);
	    }
	    Object.defineProperty(CardSelectView.prototype, "className", {
	        get: function () {
	            return 'card-select hidden';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(CardSelectView.prototype, "events", {
	        get: function () {
	            return {
	                'click .card': 'cardClick',
	                'click .trade-button': 'tradeButtonClick',
	                'click .done-button': 'doneButtonClick'
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    CardSelectView.prototype.getRenderData = function () {
	        // The player *must* trade in cards if they have 5 or 6.
	        var mustTrade = this.collection.length > 4;
	        return {
	            mustTrade: mustTrade,
	            cards: this.collection.toJSON()
	        };
	    };
	    CardSelectView.prototype.show = function () {
	        this.render();
	        this.$el.removeClass('hidden');
	    };
	    CardSelectView.prototype.hide = function () {
	        this.$el.addClass('hidden');
	    };
	    CardSelectView.prototype.cardClick = function (e) {
	        var currentlySelected = this.$('.card.active').length;
	        var $target = $(e.currentTarget);
	        // Don't allow more than three cards to be selected at once.
	        if (currentlySelected === 3 && !$target.hasClass('active')) {
	            return;
	        }
	        $target.toggleClass('active');
	    };
	    CardSelectView.prototype.tradeButtonClick = function () {
	        var _this = this;
	        var cards = this.$('.card.active').map(function () {
	            return $(this).data('id');
	        }).get().map(function (id) { return _this.collection.get(id); });
	        if (cards.length !== 3) {
	            return;
	        }
	        // Check cards make a valid set.
	        var counts = {
	            wildcard: 0,
	            cavalry: 0,
	            infantry: 0,
	            artillery: 0
	        };
	        cards.forEach(function (card) { return cards[card.getType()]++; });
	        var valid = counts.wildcard > 0 || counts.cavalry === 3 || counts.infantry === 3 || counts.artillery === 3 || counts.cavalry + counts.infantry + counts.artillery === 3;
	        if (!valid) {
	            alert('Invalid card combination');
	            return;
	        }
	        // Trade valid.
	        this.trigger('trade', cards);
	        return false;
	    };
	    CardSelectView.prototype.doneButtonClick = function () {
	        this.trigger('close');
	        this.hide();
	    };
	    return CardSelectView;
	})(View);
	module.exports = CardSelectView;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var View = __webpack_require__(2);
	var ArmyCountSelectView = (function (_super) {
	    __extends(ArmyCountSelectView, _super);
	    function ArmyCountSelectView() {
	        _super.apply(this, arguments);
	        this.template = __webpack_require__(34);
	    }
	    Object.defineProperty(ArmyCountSelectView.prototype, "className", {
	        get: function () {
	            return 'army-count-select hidden';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ArmyCountSelectView.prototype, "events", {
	        get: function () {
	            return {
	                'click .select-button': 'selectButtonClick',
	                'click .cancel-button': 'cancelButtonClick'
	            };
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ArmyCountSelectView.prototype.getRenderData = function () {
	        return {
	            min: this.min,
	            max: this.max
	        };
	    };
	    ArmyCountSelectView.prototype.selectButtonClick = function (e) {
	        var value = +this.$('.army-count').val();
	        this.trigger('select', value);
	        this.hide();
	        return false;
	    };
	    ArmyCountSelectView.prototype.cancelButtonClick = function (e) {
	        this.hide();
	    };
	    ArmyCountSelectView.prototype.show = function (force) {
	        this.render();
	        this.$el.removeClass('hidden');
	        this.$('.army-count').focus();
	        if (force) {
	            this.$('.cancel-button').remove();
	        }
	    };
	    ArmyCountSelectView.prototype.hide = function () {
	        this.$el.addClass('hidden');
	    };
	    ArmyCountSelectView.prototype.setMin = function (min) {
	        this.min = min;
	    };
	    ArmyCountSelectView.prototype.setMax = function (max) {
	        this.max = max;
	    };
	    return ArmyCountSelectView;
	})(View);
	module.exports = ArmyCountSelectView;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(40);
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
	  return "<div id=\"player-list\"></div>\n<div id=\"map\"></div>\n<div id=\"army-count-select\"></div>\n<div id=\"card-select\"></div>\n<button id=\"attack-end-button\" class=\"hidden\">Done attacking</button>\n<button id=\"no-fortify-button\" class=\"hidden\">Don't fortify</button>\n";
	  },"useData":true});

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function () {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	function replaceText(source, id, replacement) {
		var boundaries = ["/** >>" + id + " **/", "/** " + id + "<< **/"];
		var start = source.lastIndexOf(boundaries[0]);
		var wrappedReplacement = replacement
			? (boundaries[0] + replacement + boundaries[1])
			: "";
		if (source.lastIndexOf(boundaries[0]) >= 0) {
			var end = source.lastIndexOf(boundaries[1]) + boundaries[1].length;
			return source.slice(0, start) + wrappedReplacement + source.slice(end);
		} else {
			return source + wrappedReplacement;
		}
	}
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(styleElement.styleSheet.cssText, index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap && typeof btoa === "function") {
			try {
				css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(JSON.stringify(sourceMap)) + " */";
				css = "@import url(\"data:text/css;base64," + btoa(css) + "\")";
			} catch(e) {}
		}
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Backbone.js 1.1.2
	
	//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Backbone may be freely distributed under the MIT license.
	//     For all details and documentation:
	//     http://backbonejs.org
	
	(function(root, factory) {
	
	  // Set up Backbone appropriately for the environment. Start with AMD.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(45), __webpack_require__(44), exports], __WEBPACK_AMD_DEFINE_RESULT__ = function(_, $, exports) {
	      // Export global even in AMD case in case this script is loaded with
	      // others that may still expect a global Backbone.
	      root.Backbone = factory(root, exports, _, $);
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	
	  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
	  } else if (typeof exports !== 'undefined') {
	    var _ = require('underscore');
	    factory(root, exports, _);
	
	  // Finally, as a browser global.
	  } else {
	    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
	  }
	
	}(this, function(root, Backbone, _, $) {
	
	  // Initial Setup
	  // -------------
	
	  // Save the previous value of the `Backbone` variable, so that it can be
	  // restored later on, if `noConflict` is used.
	  var previousBackbone = root.Backbone;
	
	  // Create local references to array methods we'll want to use later.
	  var array = [];
	  var push = array.push;
	  var slice = array.slice;
	  var splice = array.splice;
	
	  // Current version of the library. Keep in sync with `package.json`.
	  Backbone.VERSION = '1.1.2';
	
	  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
	  // the `$` variable.
	  Backbone.$ = $;
	
	  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
	  // to its previous owner. Returns a reference to this Backbone object.
	  Backbone.noConflict = function() {
	    root.Backbone = previousBackbone;
	    return this;
	  };
	
	  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
	  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
	  // set a `X-Http-Method-Override` header.
	  Backbone.emulateHTTP = false;
	
	  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
	  // `application/json` requests ... will encode the body as
	  // `application/x-www-form-urlencoded` instead and will send the model in a
	  // form param named `model`.
	  Backbone.emulateJSON = false;
	
	  // Backbone.Events
	  // ---------------
	
	  // A module that can be mixed in to *any object* in order to provide it with
	  // custom events. You may bind with `on` or remove with `off` callback
	  // functions to an event; `trigger`-ing an event fires all callbacks in
	  // succession.
	  //
	  //     var object = {};
	  //     _.extend(object, Backbone.Events);
	  //     object.on('expand', function(){ alert('expanded'); });
	  //     object.trigger('expand');
	  //
	  var Events = Backbone.Events = {
	
	    // Bind an event to a `callback` function. Passing `"all"` will bind
	    // the callback to all events fired.
	    on: function(name, callback, context) {
	      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
	      this._events || (this._events = {});
	      var events = this._events[name] || (this._events[name] = []);
	      events.push({callback: callback, context: context, ctx: context || this});
	      return this;
	    },
	
	    // Bind an event to only be triggered a single time. After the first time
	    // the callback is invoked, it will be removed.
	    once: function(name, callback, context) {
	      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
	      var self = this;
	      var once = _.once(function() {
	        self.off(name, once);
	        callback.apply(this, arguments);
	      });
	      once._callback = callback;
	      return this.on(name, once, context);
	    },
	
	    // Remove one or many callbacks. If `context` is null, removes all
	    // callbacks with that function. If `callback` is null, removes all
	    // callbacks for the event. If `name` is null, removes all bound
	    // callbacks for all events.
	    off: function(name, callback, context) {
	      var retain, ev, events, names, i, l, j, k;
	      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
	      if (!name && !callback && !context) {
	        this._events = void 0;
	        return this;
	      }
	      names = name ? [name] : _.keys(this._events);
	      for (i = 0, l = names.length; i < l; i++) {
	        name = names[i];
	        if (events = this._events[name]) {
	          this._events[name] = retain = [];
	          if (callback || context) {
	            for (j = 0, k = events.length; j < k; j++) {
	              ev = events[j];
	              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
	                  (context && context !== ev.context)) {
	                retain.push(ev);
	              }
	            }
	          }
	          if (!retain.length) delete this._events[name];
	        }
	      }
	
	      return this;
	    },
	
	    // Trigger one or many events, firing all bound callbacks. Callbacks are
	    // passed the same arguments as `trigger` is, apart from the event name
	    // (unless you're listening on `"all"`, which will cause your callback to
	    // receive the true name of the event as the first argument).
	    trigger: function(name) {
	      if (!this._events) return this;
	      var args = slice.call(arguments, 1);
	      if (!eventsApi(this, 'trigger', name, args)) return this;
	      var events = this._events[name];
	      var allEvents = this._events.all;
	      if (events) triggerEvents(events, args);
	      if (allEvents) triggerEvents(allEvents, arguments);
	      return this;
	    },
	
	    // Tell this object to stop listening to either specific events ... or
	    // to every object it's currently listening to.
	    stopListening: function(obj, name, callback) {
	      var listeningTo = this._listeningTo;
	      if (!listeningTo) return this;
	      var remove = !name && !callback;
	      if (!callback && typeof name === 'object') callback = this;
	      if (obj) (listeningTo = {})[obj._listenId] = obj;
	      for (var id in listeningTo) {
	        obj = listeningTo[id];
	        obj.off(name, callback, this);
	        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
	      }
	      return this;
	    }
	
	  };
	
	  // Regular expression used to split event strings.
	  var eventSplitter = /\s+/;
	
	  // Implement fancy features of the Events API such as multiple event
	  // names `"change blur"` and jQuery-style event maps `{change: action}`
	  // in terms of the existing API.
	  var eventsApi = function(obj, action, name, rest) {
	    if (!name) return true;
	
	    // Handle event maps.
	    if (typeof name === 'object') {
	      for (var key in name) {
	        obj[action].apply(obj, [key, name[key]].concat(rest));
	      }
	      return false;
	    }
	
	    // Handle space separated event names.
	    if (eventSplitter.test(name)) {
	      var names = name.split(eventSplitter);
	      for (var i = 0, l = names.length; i < l; i++) {
	        obj[action].apply(obj, [names[i]].concat(rest));
	      }
	      return false;
	    }
	
	    return true;
	  };
	
	  // A difficult-to-believe, but optimized internal dispatch function for
	  // triggering events. Tries to keep the usual cases speedy (most internal
	  // Backbone events have 3 arguments).
	  var triggerEvents = function(events, args) {
	    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
	    switch (args.length) {
	      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
	      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
	      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
	      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
	      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
	    }
	  };
	
	  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};
	
	  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
	  // listen to an event in another object ... keeping track of what it's
	  // listening to.
	  _.each(listenMethods, function(implementation, method) {
	    Events[method] = function(obj, name, callback) {
	      var listeningTo = this._listeningTo || (this._listeningTo = {});
	      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
	      listeningTo[id] = obj;
	      if (!callback && typeof name === 'object') callback = this;
	      obj[implementation](name, callback, this);
	      return this;
	    };
	  });
	
	  // Aliases for backwards compatibility.
	  Events.bind   = Events.on;
	  Events.unbind = Events.off;
	
	  // Allow the `Backbone` object to serve as a global event bus, for folks who
	  // want global "pubsub" in a convenient place.
	  _.extend(Backbone, Events);
	
	  // Backbone.Model
	  // --------------
	
	  // Backbone **Models** are the basic data object in the framework --
	  // frequently representing a row in a table in a database on your server.
	  // A discrete chunk of data and a bunch of useful, related methods for
	  // performing computations and transformations on that data.
	
	  // Create a new model with the specified attributes. A client id (`cid`)
	  // is automatically generated and assigned for you.
	  var Model = Backbone.Model = function(attributes, options) {
	    var attrs = attributes || {};
	    options || (options = {});
	    this.cid = _.uniqueId('c');
	    this.attributes = {};
	    if (options.collection) this.collection = options.collection;
	    if (options.parse) attrs = this.parse(attrs, options) || {};
	    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
	    this.set(attrs, options);
	    this.changed = {};
	    this.initialize.apply(this, arguments);
	  };
	
	  // Attach all inheritable methods to the Model prototype.
	  _.extend(Model.prototype, Events, {
	
	    // A hash of attributes whose current and previous value differ.
	    changed: null,
	
	    // The value returned during the last failed validation.
	    validationError: null,
	
	    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
	    // CouchDB users may want to set this to `"_id"`.
	    idAttribute: 'id',
	
	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic.
	    initialize: function(){},
	
	    // Return a copy of the model's `attributes` object.
	    toJSON: function(options) {
	      return _.clone(this.attributes);
	    },
	
	    // Proxy `Backbone.sync` by default -- but override this if you need
	    // custom syncing semantics for *this* particular model.
	    sync: function() {
	      return Backbone.sync.apply(this, arguments);
	    },
	
	    // Get the value of an attribute.
	    get: function(attr) {
	      return this.attributes[attr];
	    },
	
	    // Get the HTML-escaped value of an attribute.
	    escape: function(attr) {
	      return _.escape(this.get(attr));
	    },
	
	    // Returns `true` if the attribute contains a value that is not null
	    // or undefined.
	    has: function(attr) {
	      return this.get(attr) != null;
	    },
	
	    // Set a hash of model attributes on the object, firing `"change"`. This is
	    // the core primitive operation of a model, updating the data and notifying
	    // anyone who needs to know about the change in state. The heart of the beast.
	    set: function(key, val, options) {
	      var attr, attrs, unset, changes, silent, changing, prev, current;
	      if (key == null) return this;
	
	      // Handle both `"key", value` and `{key: value}` -style arguments.
	      if (typeof key === 'object') {
	        attrs = key;
	        options = val;
	      } else {
	        (attrs = {})[key] = val;
	      }
	
	      options || (options = {});
	
	      // Run validation.
	      if (!this._validate(attrs, options)) return false;
	
	      // Extract attributes and options.
	      unset           = options.unset;
	      silent          = options.silent;
	      changes         = [];
	      changing        = this._changing;
	      this._changing  = true;
	
	      if (!changing) {
	        this._previousAttributes = _.clone(this.attributes);
	        this.changed = {};
	      }
	      current = this.attributes, prev = this._previousAttributes;
	
	      // Check for changes of `id`.
	      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];
	
	      // For each `set` attribute, update or delete the current value.
	      for (attr in attrs) {
	        val = attrs[attr];
	        if (!_.isEqual(current[attr], val)) changes.push(attr);
	        if (!_.isEqual(prev[attr], val)) {
	          this.changed[attr] = val;
	        } else {
	          delete this.changed[attr];
	        }
	        unset ? delete current[attr] : current[attr] = val;
	      }
	
	      // Trigger all relevant attribute changes.
	      if (!silent) {
	        if (changes.length) this._pending = options;
	        for (var i = 0, l = changes.length; i < l; i++) {
	          this.trigger('change:' + changes[i], this, current[changes[i]], options);
	        }
	      }
	
	      // You might be wondering why there's a `while` loop here. Changes can
	      // be recursively nested within `"change"` events.
	      if (changing) return this;
	      if (!silent) {
	        while (this._pending) {
	          options = this._pending;
	          this._pending = false;
	          this.trigger('change', this, options);
	        }
	      }
	      this._pending = false;
	      this._changing = false;
	      return this;
	    },
	
	    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
	    // if the attribute doesn't exist.
	    unset: function(attr, options) {
	      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
	    },
	
	    // Clear all attributes on the model, firing `"change"`.
	    clear: function(options) {
	      var attrs = {};
	      for (var key in this.attributes) attrs[key] = void 0;
	      return this.set(attrs, _.extend({}, options, {unset: true}));
	    },
	
	    // Determine if the model has changed since the last `"change"` event.
	    // If you specify an attribute name, determine if that attribute has changed.
	    hasChanged: function(attr) {
	      if (attr == null) return !_.isEmpty(this.changed);
	      return _.has(this.changed, attr);
	    },
	
	    // Return an object containing all the attributes that have changed, or
	    // false if there are no changed attributes. Useful for determining what
	    // parts of a view need to be updated and/or what attributes need to be
	    // persisted to the server. Unset attributes will be set to undefined.
	    // You can also pass an attributes object to diff against the model,
	    // determining if there *would be* a change.
	    changedAttributes: function(diff) {
	      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
	      var val, changed = false;
	      var old = this._changing ? this._previousAttributes : this.attributes;
	      for (var attr in diff) {
	        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
	        (changed || (changed = {}))[attr] = val;
	      }
	      return changed;
	    },
	
	    // Get the previous value of an attribute, recorded at the time the last
	    // `"change"` event was fired.
	    previous: function(attr) {
	      if (attr == null || !this._previousAttributes) return null;
	      return this._previousAttributes[attr];
	    },
	
	    // Get all of the attributes of the model at the time of the previous
	    // `"change"` event.
	    previousAttributes: function() {
	      return _.clone(this._previousAttributes);
	    },
	
	    // Fetch the model from the server. If the server's representation of the
	    // model differs from its current attributes, they will be overridden,
	    // triggering a `"change"` event.
	    fetch: function(options) {
	      options = options ? _.clone(options) : {};
	      if (options.parse === void 0) options.parse = true;
	      var model = this;
	      var success = options.success;
	      options.success = function(resp) {
	        if (!model.set(model.parse(resp, options), options)) return false;
	        if (success) success(model, resp, options);
	        model.trigger('sync', model, resp, options);
	      };
	      wrapError(this, options);
	      return this.sync('read', this, options);
	    },
	
	    // Set a hash of model attributes, and sync the model to the server.
	    // If the server returns an attributes hash that differs, the model's
	    // state will be `set` again.
	    save: function(key, val, options) {
	      var attrs, method, xhr, attributes = this.attributes;
	
	      // Handle both `"key", value` and `{key: value}` -style arguments.
	      if (key == null || typeof key === 'object') {
	        attrs = key;
	        options = val;
	      } else {
	        (attrs = {})[key] = val;
	      }
	
	      options = _.extend({validate: true}, options);
	
	      // If we're not waiting and attributes exist, save acts as
	      // `set(attr).save(null, opts)` with validation. Otherwise, check if
	      // the model will be valid when the attributes, if any, are set.
	      if (attrs && !options.wait) {
	        if (!this.set(attrs, options)) return false;
	      } else {
	        if (!this._validate(attrs, options)) return false;
	      }
	
	      // Set temporary attributes if `{wait: true}`.
	      if (attrs && options.wait) {
	        this.attributes = _.extend({}, attributes, attrs);
	      }
	
	      // After a successful server-side save, the client is (optionally)
	      // updated with the server-side state.
	      if (options.parse === void 0) options.parse = true;
	      var model = this;
	      var success = options.success;
	      options.success = function(resp) {
	        // Ensure attributes are restored during synchronous saves.
	        model.attributes = attributes;
	        var serverAttrs = model.parse(resp, options);
	        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
	        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
	          return false;
	        }
	        if (success) success(model, resp, options);
	        model.trigger('sync', model, resp, options);
	      };
	      wrapError(this, options);
	
	      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
	      if (method === 'patch') options.attrs = attrs;
	      xhr = this.sync(method, this, options);
	
	      // Restore attributes.
	      if (attrs && options.wait) this.attributes = attributes;
	
	      return xhr;
	    },
	
	    // Destroy this model on the server if it was already persisted.
	    // Optimistically removes the model from its collection, if it has one.
	    // If `wait: true` is passed, waits for the server to respond before removal.
	    destroy: function(options) {
	      options = options ? _.clone(options) : {};
	      var model = this;
	      var success = options.success;
	
	      var destroy = function() {
	        model.trigger('destroy', model, model.collection, options);
	      };
	
	      options.success = function(resp) {
	        if (options.wait || model.isNew()) destroy();
	        if (success) success(model, resp, options);
	        if (!model.isNew()) model.trigger('sync', model, resp, options);
	      };
	
	      if (this.isNew()) {
	        options.success();
	        return false;
	      }
	      wrapError(this, options);
	
	      var xhr = this.sync('delete', this, options);
	      if (!options.wait) destroy();
	      return xhr;
	    },
	
	    // Default URL for the model's representation on the server -- if you're
	    // using Backbone's restful methods, override this to change the endpoint
	    // that will be called.
	    url: function() {
	      var base =
	        _.result(this, 'urlRoot') ||
	        _.result(this.collection, 'url') ||
	        urlError();
	      if (this.isNew()) return base;
	      return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
	    },
	
	    // **parse** converts a response into the hash of attributes to be `set` on
	    // the model. The default implementation is just to pass the response along.
	    parse: function(resp, options) {
	      return resp;
	    },
	
	    // Create a new model with identical attributes to this one.
	    clone: function() {
	      return new this.constructor(this.attributes);
	    },
	
	    // A model is new if it has never been saved to the server, and lacks an id.
	    isNew: function() {
	      return !this.has(this.idAttribute);
	    },
	
	    // Check if the model is currently in a valid state.
	    isValid: function(options) {
	      return this._validate({}, _.extend(options || {}, { validate: true }));
	    },
	
	    // Run validation against the next complete set of model attributes,
	    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
	    _validate: function(attrs, options) {
	      if (!options.validate || !this.validate) return true;
	      attrs = _.extend({}, this.attributes, attrs);
	      var error = this.validationError = this.validate(attrs, options) || null;
	      if (!error) return true;
	      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
	      return false;
	    }
	
	  });
	
	  // Underscore methods that we want to implement on the Model.
	  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];
	
	  // Mix in each Underscore method as a proxy to `Model#attributes`.
	  _.each(modelMethods, function(method) {
	    Model.prototype[method] = function() {
	      var args = slice.call(arguments);
	      args.unshift(this.attributes);
	      return _[method].apply(_, args);
	    };
	  });
	
	  // Backbone.Collection
	  // -------------------
	
	  // If models tend to represent a single row of data, a Backbone Collection is
	  // more analagous to a table full of data ... or a small slice or page of that
	  // table, or a collection of rows that belong together for a particular reason
	  // -- all of the messages in this particular folder, all of the documents
	  // belonging to this particular author, and so on. Collections maintain
	  // indexes of their models, both in order, and for lookup by `id`.
	
	  // Create a new **Collection**, perhaps to contain a specific type of `model`.
	  // If a `comparator` is specified, the Collection will maintain
	  // its models in sort order, as they're added and removed.
	  var Collection = Backbone.Collection = function(models, options) {
	    options || (options = {});
	    if (options.model) this.model = options.model;
	    if (options.comparator !== void 0) this.comparator = options.comparator;
	    this._reset();
	    this.initialize.apply(this, arguments);
	    if (models) this.reset(models, _.extend({silent: true}, options));
	  };
	
	  // Default options for `Collection#set`.
	  var setOptions = {add: true, remove: true, merge: true};
	  var addOptions = {add: true, remove: false};
	
	  // Define the Collection's inheritable methods.
	  _.extend(Collection.prototype, Events, {
	
	    // The default model for a collection is just a **Backbone.Model**.
	    // This should be overridden in most cases.
	    model: Model,
	
	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic.
	    initialize: function(){},
	
	    // The JSON representation of a Collection is an array of the
	    // models' attributes.
	    toJSON: function(options) {
	      return this.map(function(model){ return model.toJSON(options); });
	    },
	
	    // Proxy `Backbone.sync` by default.
	    sync: function() {
	      return Backbone.sync.apply(this, arguments);
	    },
	
	    // Add a model, or list of models to the set.
	    add: function(models, options) {
	      return this.set(models, _.extend({merge: false}, options, addOptions));
	    },
	
	    // Remove a model, or a list of models from the set.
	    remove: function(models, options) {
	      var singular = !_.isArray(models);
	      models = singular ? [models] : _.clone(models);
	      options || (options = {});
	      var i, l, index, model;
	      for (i = 0, l = models.length; i < l; i++) {
	        model = models[i] = this.get(models[i]);
	        if (!model) continue;
	        delete this._byId[model.id];
	        delete this._byId[model.cid];
	        index = this.indexOf(model);
	        this.models.splice(index, 1);
	        this.length--;
	        if (!options.silent) {
	          options.index = index;
	          model.trigger('remove', model, this, options);
	        }
	        this._removeReference(model, options);
	      }
	      return singular ? models[0] : models;
	    },
	
	    // Update a collection by `set`-ing a new list of models, adding new ones,
	    // removing models that are no longer present, and merging models that
	    // already exist in the collection, as necessary. Similar to **Model#set**,
	    // the core operation for updating the data contained by the collection.
	    set: function(models, options) {
	      options = _.defaults({}, options, setOptions);
	      if (options.parse) models = this.parse(models, options);
	      var singular = !_.isArray(models);
	      models = singular ? (models ? [models] : []) : _.clone(models);
	      var i, l, id, model, attrs, existing, sort;
	      var at = options.at;
	      var targetModel = this.model;
	      var sortable = this.comparator && (at == null) && options.sort !== false;
	      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
	      var toAdd = [], toRemove = [], modelMap = {};
	      var add = options.add, merge = options.merge, remove = options.remove;
	      var order = !sortable && add && remove ? [] : false;
	
	      // Turn bare objects into model references, and prevent invalid models
	      // from being added.
	      for (i = 0, l = models.length; i < l; i++) {
	        attrs = models[i] || {};
	        if (attrs instanceof Model) {
	          id = model = attrs;
	        } else {
	          id = attrs[targetModel.prototype.idAttribute || 'id'];
	        }
	
	        // If a duplicate is found, prevent it from being added and
	        // optionally merge it into the existing model.
	        if (existing = this.get(id)) {
	          if (remove) modelMap[existing.cid] = true;
	          if (merge) {
	            attrs = attrs === model ? model.attributes : attrs;
	            if (options.parse) attrs = existing.parse(attrs, options);
	            existing.set(attrs, options);
	            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
	          }
	          models[i] = existing;
	
	        // If this is a new, valid model, push it to the `toAdd` list.
	        } else if (add) {
	          model = models[i] = this._prepareModel(attrs, options);
	          if (!model) continue;
	          toAdd.push(model);
	          this._addReference(model, options);
	        }
	
	        // Do not add multiple models with the same `id`.
	        model = existing || model;
	        if (order && (model.isNew() || !modelMap[model.id])) order.push(model);
	        modelMap[model.id] = true;
	      }
	
	      // Remove nonexistent models if appropriate.
	      if (remove) {
	        for (i = 0, l = this.length; i < l; ++i) {
	          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
	        }
	        if (toRemove.length) this.remove(toRemove, options);
	      }
	
	      // See if sorting is needed, update `length` and splice in new models.
	      if (toAdd.length || (order && order.length)) {
	        if (sortable) sort = true;
	        this.length += toAdd.length;
	        if (at != null) {
	          for (i = 0, l = toAdd.length; i < l; i++) {
	            this.models.splice(at + i, 0, toAdd[i]);
	          }
	        } else {
	          if (order) this.models.length = 0;
	          var orderedModels = order || toAdd;
	          for (i = 0, l = orderedModels.length; i < l; i++) {
	            this.models.push(orderedModels[i]);
	          }
	        }
	      }
	
	      // Silently sort the collection if appropriate.
	      if (sort) this.sort({silent: true});
	
	      // Unless silenced, it's time to fire all appropriate add/sort events.
	      if (!options.silent) {
	        for (i = 0, l = toAdd.length; i < l; i++) {
	          (model = toAdd[i]).trigger('add', model, this, options);
	        }
	        if (sort || (order && order.length)) this.trigger('sort', this, options);
	      }
	
	      // Return the added (or merged) model (or models).
	      return singular ? models[0] : models;
	    },
	
	    // When you have more items than you want to add or remove individually,
	    // you can reset the entire set with a new list of models, without firing
	    // any granular `add` or `remove` events. Fires `reset` when finished.
	    // Useful for bulk operations and optimizations.
	    reset: function(models, options) {
	      options || (options = {});
	      for (var i = 0, l = this.models.length; i < l; i++) {
	        this._removeReference(this.models[i], options);
	      }
	      options.previousModels = this.models;
	      this._reset();
	      models = this.add(models, _.extend({silent: true}, options));
	      if (!options.silent) this.trigger('reset', this, options);
	      return models;
	    },
	
	    // Add a model to the end of the collection.
	    push: function(model, options) {
	      return this.add(model, _.extend({at: this.length}, options));
	    },
	
	    // Remove a model from the end of the collection.
	    pop: function(options) {
	      var model = this.at(this.length - 1);
	      this.remove(model, options);
	      return model;
	    },
	
	    // Add a model to the beginning of the collection.
	    unshift: function(model, options) {
	      return this.add(model, _.extend({at: 0}, options));
	    },
	
	    // Remove a model from the beginning of the collection.
	    shift: function(options) {
	      var model = this.at(0);
	      this.remove(model, options);
	      return model;
	    },
	
	    // Slice out a sub-array of models from the collection.
	    slice: function() {
	      return slice.apply(this.models, arguments);
	    },
	
	    // Get a model from the set by id.
	    get: function(obj) {
	      if (obj == null) return void 0;
	      return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
	    },
	
	    // Get the model at the given index.
	    at: function(index) {
	      return this.models[index];
	    },
	
	    // Return models with matching attributes. Useful for simple cases of
	    // `filter`.
	    where: function(attrs, first) {
	      if (_.isEmpty(attrs)) return first ? void 0 : [];
	      return this[first ? 'find' : 'filter'](function(model) {
	        for (var key in attrs) {
	          if (attrs[key] !== model.get(key)) return false;
	        }
	        return true;
	      });
	    },
	
	    // Return the first model with matching attributes. Useful for simple cases
	    // of `find`.
	    findWhere: function(attrs) {
	      return this.where(attrs, true);
	    },
	
	    // Force the collection to re-sort itself. You don't need to call this under
	    // normal circumstances, as the set will maintain sort order as each item
	    // is added.
	    sort: function(options) {
	      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
	      options || (options = {});
	
	      // Run sort based on type of `comparator`.
	      if (_.isString(this.comparator) || this.comparator.length === 1) {
	        this.models = this.sortBy(this.comparator, this);
	      } else {
	        this.models.sort(_.bind(this.comparator, this));
	      }
	
	      if (!options.silent) this.trigger('sort', this, options);
	      return this;
	    },
	
	    // Pluck an attribute from each model in the collection.
	    pluck: function(attr) {
	      return _.invoke(this.models, 'get', attr);
	    },
	
	    // Fetch the default set of models for this collection, resetting the
	    // collection when they arrive. If `reset: true` is passed, the response
	    // data will be passed through the `reset` method instead of `set`.
	    fetch: function(options) {
	      options = options ? _.clone(options) : {};
	      if (options.parse === void 0) options.parse = true;
	      var success = options.success;
	      var collection = this;
	      options.success = function(resp) {
	        var method = options.reset ? 'reset' : 'set';
	        collection[method](resp, options);
	        if (success) success(collection, resp, options);
	        collection.trigger('sync', collection, resp, options);
	      };
	      wrapError(this, options);
	      return this.sync('read', this, options);
	    },
	
	    // Create a new instance of a model in this collection. Add the model to the
	    // collection immediately, unless `wait: true` is passed, in which case we
	    // wait for the server to agree.
	    create: function(model, options) {
	      options = options ? _.clone(options) : {};
	      if (!(model = this._prepareModel(model, options))) return false;
	      if (!options.wait) this.add(model, options);
	      var collection = this;
	      var success = options.success;
	      options.success = function(model, resp) {
	        if (options.wait) collection.add(model, options);
	        if (success) success(model, resp, options);
	      };
	      model.save(null, options);
	      return model;
	    },
	
	    // **parse** converts a response into a list of models to be added to the
	    // collection. The default implementation is just to pass it through.
	    parse: function(resp, options) {
	      return resp;
	    },
	
	    // Create a new collection with an identical list of models as this one.
	    clone: function() {
	      return new this.constructor(this.models);
	    },
	
	    // Private method to reset all internal state. Called when the collection
	    // is first initialized or reset.
	    _reset: function() {
	      this.length = 0;
	      this.models = [];
	      this._byId  = {};
	    },
	
	    // Prepare a hash of attributes (or other model) to be added to this
	    // collection.
	    _prepareModel: function(attrs, options) {
	      if (attrs instanceof Model) return attrs;
	      options = options ? _.clone(options) : {};
	      options.collection = this;
	      var model = new this.model(attrs, options);
	      if (!model.validationError) return model;
	      this.trigger('invalid', this, model.validationError, options);
	      return false;
	    },
	
	    // Internal method to create a model's ties to a collection.
	    _addReference: function(model, options) {
	      this._byId[model.cid] = model;
	      if (model.id != null) this._byId[model.id] = model;
	      if (!model.collection) model.collection = this;
	      model.on('all', this._onModelEvent, this);
	    },
	
	    // Internal method to sever a model's ties to a collection.
	    _removeReference: function(model, options) {
	      if (this === model.collection) delete model.collection;
	      model.off('all', this._onModelEvent, this);
	    },
	
	    // Internal method called every time a model in the set fires an event.
	    // Sets need to update their indexes when models change ids. All other
	    // events simply proxy through. "add" and "remove" events that originate
	    // in other collections are ignored.
	    _onModelEvent: function(event, model, collection, options) {
	      if ((event === 'add' || event === 'remove') && collection !== this) return;
	      if (event === 'destroy') this.remove(model, options);
	      if (model && event === 'change:' + model.idAttribute) {
	        delete this._byId[model.previous(model.idAttribute)];
	        if (model.id != null) this._byId[model.id] = model;
	      }
	      this.trigger.apply(this, arguments);
	    }
	
	  });
	
	  // Underscore methods that we want to implement on the Collection.
	  // 90% of the core usefulness of Backbone Collections is actually implemented
	  // right here:
	  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
	    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
	    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
	    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
	    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
	    'lastIndexOf', 'isEmpty', 'chain', 'sample'];
	
	  // Mix in each Underscore method as a proxy to `Collection#models`.
	  _.each(methods, function(method) {
	    Collection.prototype[method] = function() {
	      var args = slice.call(arguments);
	      args.unshift(this.models);
	      return _[method].apply(_, args);
	    };
	  });
	
	  // Underscore methods that take a property name as an argument.
	  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];
	
	  // Use attributes instead of properties.
	  _.each(attributeMethods, function(method) {
	    Collection.prototype[method] = function(value, context) {
	      var iterator = _.isFunction(value) ? value : function(model) {
	        return model.get(value);
	      };
	      return _[method](this.models, iterator, context);
	    };
	  });
	
	  // Backbone.View
	  // -------------
	
	  // Backbone Views are almost more convention than they are actual code. A View
	  // is simply a JavaScript object that represents a logical chunk of UI in the
	  // DOM. This might be a single item, an entire list, a sidebar or panel, or
	  // even the surrounding frame which wraps your whole app. Defining a chunk of
	  // UI as a **View** allows you to define your DOM events declaratively, without
	  // having to worry about render order ... and makes it easy for the view to
	  // react to specific changes in the state of your models.
	
	  // Creating a Backbone.View creates its initial element outside of the DOM,
	  // if an existing element is not provided...
	  var View = Backbone.View = function(options) {
	    this.cid = _.uniqueId('view');
	    options || (options = {});
	    _.extend(this, _.pick(options, viewOptions));
	    this._ensureElement();
	    this.initialize.apply(this, arguments);
	    this.delegateEvents();
	  };
	
	  // Cached regex to split keys for `delegate`.
	  var delegateEventSplitter = /^(\S+)\s*(.*)$/;
	
	  // List of view options to be merged as properties.
	  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
	
	  // Set up all inheritable **Backbone.View** properties and methods.
	  _.extend(View.prototype, Events, {
	
	    // The default `tagName` of a View's element is `"div"`.
	    tagName: 'div',
	
	    // jQuery delegate for element lookup, scoped to DOM elements within the
	    // current view. This should be preferred to global lookups where possible.
	    $: function(selector) {
	      return this.$el.find(selector);
	    },
	
	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic.
	    initialize: function(){},
	
	    // **render** is the core function that your view should override, in order
	    // to populate its element (`this.el`), with the appropriate HTML. The
	    // convention is for **render** to always return `this`.
	    render: function() {
	      return this;
	    },
	
	    // Remove this view by taking the element out of the DOM, and removing any
	    // applicable Backbone.Events listeners.
	    remove: function() {
	      this.$el.remove();
	      this.stopListening();
	      return this;
	    },
	
	    // Change the view's element (`this.el` property), including event
	    // re-delegation.
	    setElement: function(element, delegate) {
	      if (this.$el) this.undelegateEvents();
	      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
	      this.el = this.$el[0];
	      if (delegate !== false) this.delegateEvents();
	      return this;
	    },
	
	    // Set callbacks, where `this.events` is a hash of
	    //
	    // *{"event selector": "callback"}*
	    //
	    //     {
	    //       'mousedown .title':  'edit',
	    //       'click .button':     'save',
	    //       'click .open':       function(e) { ... }
	    //     }
	    //
	    // pairs. Callbacks will be bound to the view, with `this` set properly.
	    // Uses event delegation for efficiency.
	    // Omitting the selector binds the event to `this.el`.
	    // This only works for delegate-able events: not `focus`, `blur`, and
	    // not `change`, `submit`, and `reset` in Internet Explorer.
	    delegateEvents: function(events) {
	      if (!(events || (events = _.result(this, 'events')))) return this;
	      this.undelegateEvents();
	      for (var key in events) {
	        var method = events[key];
	        if (!_.isFunction(method)) method = this[events[key]];
	        if (!method) continue;
	
	        var match = key.match(delegateEventSplitter);
	        var eventName = match[1], selector = match[2];
	        method = _.bind(method, this);
	        eventName += '.delegateEvents' + this.cid;
	        if (selector === '') {
	          this.$el.on(eventName, method);
	        } else {
	          this.$el.on(eventName, selector, method);
	        }
	      }
	      return this;
	    },
	
	    // Clears all callbacks previously bound to the view with `delegateEvents`.
	    // You usually don't need to use this, but may wish to if you have multiple
	    // Backbone views attached to the same DOM element.
	    undelegateEvents: function() {
	      this.$el.off('.delegateEvents' + this.cid);
	      return this;
	    },
	
	    // Ensure that the View has a DOM element to render into.
	    // If `this.el` is a string, pass it through `$()`, take the first
	    // matching element, and re-assign it to `el`. Otherwise, create
	    // an element from the `id`, `className` and `tagName` properties.
	    _ensureElement: function() {
	      if (!this.el) {
	        var attrs = _.extend({}, _.result(this, 'attributes'));
	        if (this.id) attrs.id = _.result(this, 'id');
	        if (this.className) attrs['class'] = _.result(this, 'className');
	        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
	        this.setElement($el, false);
	      } else {
	        this.setElement(_.result(this, 'el'), false);
	      }
	    }
	
	  });
	
	  // Backbone.sync
	  // -------------
	
	  // Override this function to change the manner in which Backbone persists
	  // models to the server. You will be passed the type of request, and the
	  // model in question. By default, makes a RESTful Ajax request
	  // to the model's `url()`. Some possible customizations could be:
	  //
	  // * Use `setTimeout` to batch rapid-fire updates into a single request.
	  // * Send up the models as XML instead of JSON.
	  // * Persist models via WebSockets instead of Ajax.
	  //
	  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
	  // as `POST`, with a `_method` parameter containing the true HTTP method,
	  // as well as all requests with the body as `application/x-www-form-urlencoded`
	  // instead of `application/json` with the model in a param named `model`.
	  // Useful when interfacing with server-side languages like **PHP** that make
	  // it difficult to read the body of `PUT` requests.
	  Backbone.sync = function(method, model, options) {
	    var type = methodMap[method];
	
	    // Default options, unless specified.
	    _.defaults(options || (options = {}), {
	      emulateHTTP: Backbone.emulateHTTP,
	      emulateJSON: Backbone.emulateJSON
	    });
	
	    // Default JSON-request options.
	    var params = {type: type, dataType: 'json'};
	
	    // Ensure that we have a URL.
	    if (!options.url) {
	      params.url = _.result(model, 'url') || urlError();
	    }
	
	    // Ensure that we have the appropriate request data.
	    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
	      params.contentType = 'application/json';
	      params.data = JSON.stringify(options.attrs || model.toJSON(options));
	    }
	
	    // For older servers, emulate JSON by encoding the request into an HTML-form.
	    if (options.emulateJSON) {
	      params.contentType = 'application/x-www-form-urlencoded';
	      params.data = params.data ? {model: params.data} : {};
	    }
	
	    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
	    // And an `X-HTTP-Method-Override` header.
	    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
	      params.type = 'POST';
	      if (options.emulateJSON) params.data._method = type;
	      var beforeSend = options.beforeSend;
	      options.beforeSend = function(xhr) {
	        xhr.setRequestHeader('X-HTTP-Method-Override', type);
	        if (beforeSend) return beforeSend.apply(this, arguments);
	      };
	    }
	
	    // Don't process data on a non-GET request.
	    if (params.type !== 'GET' && !options.emulateJSON) {
	      params.processData = false;
	    }
	
	    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
	    // that still has ActiveX enabled by default, override jQuery to use that
	    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
	    if (params.type === 'PATCH' && noXhrPatch) {
	      params.xhr = function() {
	        return new ActiveXObject("Microsoft.XMLHTTP");
	      };
	    }
	
	    // Make the request, allowing the user to override any Ajax options.
	    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
	    model.trigger('request', model, xhr, options);
	    return xhr;
	  };
	
	  var noXhrPatch =
	    typeof window !== 'undefined' && !!window.ActiveXObject &&
	      !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);
	
	  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
	  var methodMap = {
	    'create': 'POST',
	    'update': 'PUT',
	    'patch':  'PATCH',
	    'delete': 'DELETE',
	    'read':   'GET'
	  };
	
	  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
	  // Override this if you'd like to use a different library.
	  Backbone.ajax = function() {
	    return Backbone.$.ajax.apply(Backbone.$, arguments);
	  };
	
	  // Backbone.Router
	  // ---------------
	
	  // Routers map faux-URLs to actions, and fire events when routes are
	  // matched. Creating a new one sets its `routes` hash, if not set statically.
	  var Router = Backbone.Router = function(options) {
	    options || (options = {});
	    if (options.routes) this.routes = options.routes;
	    this._bindRoutes();
	    this.initialize.apply(this, arguments);
	  };
	
	  // Cached regular expressions for matching named param parts and splatted
	  // parts of route strings.
	  var optionalParam = /\((.*?)\)/g;
	  var namedParam    = /(\(\?)?:\w+/g;
	  var splatParam    = /\*\w+/g;
	  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;
	
	  // Set up all inheritable **Backbone.Router** properties and methods.
	  _.extend(Router.prototype, Events, {
	
	    // Initialize is an empty function by default. Override it with your own
	    // initialization logic.
	    initialize: function(){},
	
	    // Manually bind a single named route to a callback. For example:
	    //
	    //     this.route('search/:query/p:num', 'search', function(query, num) {
	    //       ...
	    //     });
	    //
	    route: function(route, name, callback) {
	      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
	      if (_.isFunction(name)) {
	        callback = name;
	        name = '';
	      }
	      if (!callback) callback = this[name];
	      var router = this;
	      Backbone.history.route(route, function(fragment) {
	        var args = router._extractParameters(route, fragment);
	        router.execute(callback, args);
	        router.trigger.apply(router, ['route:' + name].concat(args));
	        router.trigger('route', name, args);
	        Backbone.history.trigger('route', router, name, args);
	      });
	      return this;
	    },
	
	    // Execute a route handler with the provided parameters.  This is an
	    // excellent place to do pre-route setup or post-route cleanup.
	    execute: function(callback, args) {
	      if (callback) callback.apply(this, args);
	    },
	
	    // Simple proxy to `Backbone.history` to save a fragment into the history.
	    navigate: function(fragment, options) {
	      Backbone.history.navigate(fragment, options);
	      return this;
	    },
	
	    // Bind all defined routes to `Backbone.history`. We have to reverse the
	    // order of the routes here to support behavior where the most general
	    // routes can be defined at the bottom of the route map.
	    _bindRoutes: function() {
	      if (!this.routes) return;
	      this.routes = _.result(this, 'routes');
	      var route, routes = _.keys(this.routes);
	      while ((route = routes.pop()) != null) {
	        this.route(route, this.routes[route]);
	      }
	    },
	
	    // Convert a route string into a regular expression, suitable for matching
	    // against the current location hash.
	    _routeToRegExp: function(route) {
	      route = route.replace(escapeRegExp, '\\$&')
	                   .replace(optionalParam, '(?:$1)?')
	                   .replace(namedParam, function(match, optional) {
	                     return optional ? match : '([^/?]+)';
	                   })
	                   .replace(splatParam, '([^?]*?)');
	      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
	    },
	
	    // Given a route, and a URL fragment that it matches, return the array of
	    // extracted decoded parameters. Empty or unmatched parameters will be
	    // treated as `null` to normalize cross-browser behavior.
	    _extractParameters: function(route, fragment) {
	      var params = route.exec(fragment).slice(1);
	      return _.map(params, function(param, i) {
	        // Don't decode the search params.
	        if (i === params.length - 1) return param || null;
	        return param ? decodeURIComponent(param) : null;
	      });
	    }
	
	  });
	
	  // Backbone.History
	  // ----------------
	
	  // Handles cross-browser history management, based on either
	  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
	  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
	  // and URL fragments. If the browser supports neither (old IE, natch),
	  // falls back to polling.
	  var History = Backbone.History = function() {
	    this.handlers = [];
	    _.bindAll(this, 'checkUrl');
	
	    // Ensure that `History` can be used outside of the browser.
	    if (typeof window !== 'undefined') {
	      this.location = window.location;
	      this.history = window.history;
	    }
	  };
	
	  // Cached regex for stripping a leading hash/slash and trailing space.
	  var routeStripper = /^[#\/]|\s+$/g;
	
	  // Cached regex for stripping leading and trailing slashes.
	  var rootStripper = /^\/+|\/+$/g;
	
	  // Cached regex for detecting MSIE.
	  var isExplorer = /msie [\w.]+/;
	
	  // Cached regex for removing a trailing slash.
	  var trailingSlash = /\/$/;
	
	  // Cached regex for stripping urls of hash.
	  var pathStripper = /#.*$/;
	
	  // Has the history handling already been started?
	  History.started = false;
	
	  // Set up all inheritable **Backbone.History** properties and methods.
	  _.extend(History.prototype, Events, {
	
	    // The default interval to poll for hash changes, if necessary, is
	    // twenty times a second.
	    interval: 50,
	
	    // Are we at the app root?
	    atRoot: function() {
	      return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
	    },
	
	    // Gets the true hash value. Cannot use location.hash directly due to bug
	    // in Firefox where location.hash will always be decoded.
	    getHash: function(window) {
	      var match = (window || this).location.href.match(/#(.*)$/);
	      return match ? match[1] : '';
	    },
	
	    // Get the cross-browser normalized URL fragment, either from the URL,
	    // the hash, or the override.
	    getFragment: function(fragment, forcePushState) {
	      if (fragment == null) {
	        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
	          fragment = decodeURI(this.location.pathname + this.location.search);
	          var root = this.root.replace(trailingSlash, '');
	          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
	        } else {
	          fragment = this.getHash();
	        }
	      }
	      return fragment.replace(routeStripper, '');
	    },
	
	    // Start the hash change handling, returning `true` if the current URL matches
	    // an existing route, and `false` otherwise.
	    start: function(options) {
	      if (History.started) throw new Error("Backbone.history has already been started");
	      History.started = true;
	
	      // Figure out the initial configuration. Do we need an iframe?
	      // Is pushState desired ... is it available?
	      this.options          = _.extend({root: '/'}, this.options, options);
	      this.root             = this.options.root;
	      this._wantsHashChange = this.options.hashChange !== false;
	      this._wantsPushState  = !!this.options.pushState;
	      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
	      var fragment          = this.getFragment();
	      var docMode           = document.documentMode;
	      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));
	
	      // Normalize root to always include a leading and trailing slash.
	      this.root = ('/' + this.root + '/').replace(rootStripper, '/');
	
	      if (oldIE && this._wantsHashChange) {
	        var frame = Backbone.$('<iframe src="javascript:0" tabindex="-1">');
	        this.iframe = frame.hide().appendTo('body')[0].contentWindow;
	        this.navigate(fragment);
	      }
	
	      // Depending on whether we're using pushState or hashes, and whether
	      // 'onhashchange' is supported, determine how we check the URL state.
	      if (this._hasPushState) {
	        Backbone.$(window).on('popstate', this.checkUrl);
	      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
	        Backbone.$(window).on('hashchange', this.checkUrl);
	      } else if (this._wantsHashChange) {
	        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
	      }
	
	      // Determine if we need to change the base url, for a pushState link
	      // opened by a non-pushState browser.
	      this.fragment = fragment;
	      var loc = this.location;
	
	      // Transition from hashChange to pushState or vice versa if both are
	      // requested.
	      if (this._wantsHashChange && this._wantsPushState) {
	
	        // If we've started off with a route from a `pushState`-enabled
	        // browser, but we're currently in a browser that doesn't support it...
	        if (!this._hasPushState && !this.atRoot()) {
	          this.fragment = this.getFragment(null, true);
	          this.location.replace(this.root + '#' + this.fragment);
	          // Return immediately as browser will do redirect to new url
	          return true;
	
	        // Or if we've started out with a hash-based route, but we're currently
	        // in a browser where it could be `pushState`-based instead...
	        } else if (this._hasPushState && this.atRoot() && loc.hash) {
	          this.fragment = this.getHash().replace(routeStripper, '');
	          this.history.replaceState({}, document.title, this.root + this.fragment);
	        }
	
	      }
	
	      if (!this.options.silent) return this.loadUrl();
	    },
	
	    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
	    // but possibly useful for unit testing Routers.
	    stop: function() {
	      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
	      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
	      History.started = false;
	    },
	
	    // Add a route to be tested when the fragment changes. Routes added later
	    // may override previous routes.
	    route: function(route, callback) {
	      this.handlers.unshift({route: route, callback: callback});
	    },
	
	    // Checks the current URL to see if it has changed, and if it has,
	    // calls `loadUrl`, normalizing across the hidden iframe.
	    checkUrl: function(e) {
	      var current = this.getFragment();
	      if (current === this.fragment && this.iframe) {
	        current = this.getFragment(this.getHash(this.iframe));
	      }
	      if (current === this.fragment) return false;
	      if (this.iframe) this.navigate(current);
	      this.loadUrl();
	    },
	
	    // Attempt to load the current URL fragment. If a route succeeds with a
	    // match, returns `true`. If no defined routes matches the fragment,
	    // returns `false`.
	    loadUrl: function(fragment) {
	      fragment = this.fragment = this.getFragment(fragment);
	      return _.any(this.handlers, function(handler) {
	        if (handler.route.test(fragment)) {
	          handler.callback(fragment);
	          return true;
	        }
	      });
	    },
	
	    // Save a fragment into the hash history, or replace the URL state if the
	    // 'replace' option is passed. You are responsible for properly URL-encoding
	    // the fragment in advance.
	    //
	    // The options object can contain `trigger: true` if you wish to have the
	    // route callback be fired (not usually desirable), or `replace: true`, if
	    // you wish to modify the current URL without adding an entry to the history.
	    navigate: function(fragment, options) {
	      if (!History.started) return false;
	      if (!options || options === true) options = {trigger: !!options};
	
	      var url = this.root + (fragment = this.getFragment(fragment || ''));
	
	      // Strip the hash for matching.
	      fragment = fragment.replace(pathStripper, '');
	
	      if (this.fragment === fragment) return;
	      this.fragment = fragment;
	
	      // Don't include a trailing slash on the root.
	      if (fragment === '' && url !== '/') url = url.slice(0, -1);
	
	      // If pushState is available, we use it to set the fragment as a real URL.
	      if (this._hasPushState) {
	        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);
	
	      // If hash changes haven't been explicitly disabled, update the hash
	      // fragment to store history.
	      } else if (this._wantsHashChange) {
	        this._updateHash(this.location, fragment, options.replace);
	        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
	          // Opening and closing the iframe tricks IE7 and earlier to push a
	          // history entry on hash-tag change.  When replace is true, we don't
	          // want this.
	          if(!options.replace) this.iframe.document.open().close();
	          this._updateHash(this.iframe.location, fragment, options.replace);
	        }
	
	      // If you've told us that you explicitly don't want fallback hashchange-
	      // based history, then `navigate` becomes a page refresh.
	      } else {
	        return this.location.assign(url);
	      }
	      if (options.trigger) return this.loadUrl(fragment);
	    },
	
	    // Update the hash location, either replacing the current entry, or adding
	    // a new one to the browser history.
	    _updateHash: function(location, fragment, replace) {
	      if (replace) {
	        var href = location.href.replace(/(javascript:|#).*$/, '');
	        location.replace(href + '#' + fragment);
	      } else {
	        // Some browsers require that `hash` contains a leading #.
	        location.hash = '#' + fragment;
	      }
	    }
	
	  });
	
	  // Create the default Backbone.history.
	  Backbone.history = new History;
	
	  // Helpers
	  // -------
	
	  // Helper function to correctly set up the prototype chain, for subclasses.
	  // Similar to `goog.inherits`, but uses a hash of prototype properties and
	  // class properties to be extended.
	  var extend = function(protoProps, staticProps) {
	    var parent = this;
	    var child;
	
	    // The constructor function for the new subclass is either defined by you
	    // (the "constructor" property in your `extend` definition), or defaulted
	    // by us to simply call the parent's constructor.
	    if (protoProps && _.has(protoProps, 'constructor')) {
	      child = protoProps.constructor;
	    } else {
	      child = function(){ return parent.apply(this, arguments); };
	    }
	
	    // Add static properties to the constructor function, if supplied.
	    _.extend(child, parent, staticProps);
	
	    // Set the prototype chain to inherit from `parent`, without calling
	    // `parent`'s constructor function.
	    var Surrogate = function(){ this.constructor = child; };
	    Surrogate.prototype = parent.prototype;
	    child.prototype = new Surrogate;
	
	    // Add prototype properties (instance properties) to the subclass,
	    // if supplied.
	    if (protoProps) _.extend(child.prototype, protoProps);
	
	    // Set a convenience property in case the parent's prototype is needed
	    // later.
	    child.__super__ = parent.prototype;
	
	    return child;
	  };
	
	  // Set up inheritance for the model, collection, router, view and history.
	  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;
	
	  // Throw an error when a URL is needed, and none is supplied.
	  var urlError = function() {
	    throw new Error('A "url" property or function must be specified');
	  };
	
	  // Wrap an optional error callback with a fallback error event.
	  var wrapError = function(model, options) {
	    var error = options.error;
	    options.error = function(resp) {
	      if (error) error(model, resp, options);
	      model.trigger('error', model, resp, options);
	    };
	  };
	
	  return Backbone;
	
	}));


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
		"data": "map",
		"continents": {
			"0": [
				"0",
				"1",
				"2",
				"3",
				"4",
				"5",
				"6",
				"7",
				"8"
			],
			"1": [
				"9",
				"10",
				"11",
				"12"
			],
			"2": [
				"13",
				"14",
				"15",
				"16",
				"17",
				"18",
				"19"
			],
			"3": [
				"20",
				"21",
				"22",
				"23",
				"24",
				"25"
			],
			"4": [
				"26",
				"27",
				"28",
				"29",
				"30",
				"31",
				"32",
				"33",
				"34",
				"35",
				"36",
				"37"
			],
			"5": [
				"38",
				"39",
				"40",
				"41"
			]
		},
		"connections": [
			[
				0,
				1
			],
			[
				0,
				3
			],
			[
				0,
				29
			],
			[
				1,
				3
			],
			[
				1,
				2
			],
			[
				1,
				4
			],
			[
				2,
				4
			],
			[
				2,
				5
			],
			[
				2,
				13
			],
			[
				3,
				4
			],
			[
				3,
				6
			],
			[
				4,
				5
			],
			[
				4,
				6
			],
			[
				4,
				7
			],
			[
				5,
				7
			],
			[
				6,
				7
			],
			[
				6,
				8
			],
			[
				7,
				8
			],
			[
				8,
				9
			],
			[
				9,
				10
			],
			[
				9,
				11
			],
			[
				10,
				11
			],
			[
				10,
				12
			],
			[
				11,
				12
			],
			[
				11,
				20
			],
			[
				13,
				14
			],
			[
				13,
				16
			],
			[
				14,
				16
			],
			[
				14,
				17
			],
			[
				14,
				15
			],
			[
				15,
				17
			],
			[
				15,
				19
			],
			[
				15,
				26
			],
			[
				15,
				33
			],
			[
				15,
				35
			],
			[
				16,
				17
			],
			[
				16,
				18
			],
			[
				17,
				18
			],
			[
				17,
				19
			],
			[
				18,
				19
			],
			[
				18,
				20
			],
			[
				19,
				20
			],
			[
				19,
				21
			],
			[
				19,
				35
			],
			[
				20,
				21
			],
			[
				20,
				22
			],
			[
				20,
				23
			],
			[
				21,
				23
			],
			[
				21,
				35
			],
			[
				22,
				23
			],
			[
				22,
				24
			],
			[
				23,
				25
			],
			[
				23,
				24
			],
			[
				23,
				35
			],
			[
				24,
				25
			],
			[
				26,
				27
			],
			[
				26,
				34
			],
			[
				26,
				33
			],
			[
				27,
				28
			],
			[
				27,
				30
			],
			[
				27,
				31
			],
			[
				27,
				34
			],
			[
				28,
				29
			],
			[
				28,
				30
			],
			[
				29,
				30
			],
			[
				29,
				32
			],
			[
				29,
				31
			],
			[
				30,
				31
			],
			[
				31,
				32
			],
			[
				31,
				34
			],
			[
				33,
				34
			],
			[
				33,
				35
			],
			[
				33,
				36
			],
			[
				34,
				36
			],
			[
				34,
				37
			],
			[
				35,
				36
			],
			[
				36,
				37
			],
			[
				37,
				38
			],
			[
				38,
				39
			],
			[
				38,
				40
			],
			[
				39,
				40
			],
			[
				39,
				41
			],
			[
				40,
				41
			]
		],
		"continent_values": {
			"0": 5,
			"1": 2,
			"2": 5,
			"3": 3,
			"4": 7,
			"5": 2
		},
		"country_names": {
			"0": "Alaska",
			"1": "Northwest territory",
			"2": "Greenland",
			"3": "Alberta",
			"4": "Ontario",
			"5": "Quebec",
			"6": "Western United States",
			"7": "Eastern United States",
			"8": "Central America",
			"9": "Venezuela",
			"10": "Peru",
			"11": "Brazil",
			"12": "Argentina",
			"13": "Iceland",
			"14": "Scandinavia",
			"15": "Ukraine",
			"16": "Great Britain",
			"17": "Northern Europe",
			"18": "Western Europe",
			"19": "Southern Europe",
			"20": "North Africa",
			"21": "Egypt",
			"22": "Congo",
			"23": "East Africa",
			"24": "South Africa",
			"25": "Madagaskar",
			"26": "Ural",
			"27": "Siberia",
			"28": "Yakutsk",
			"29": "Kamchatka",
			"30": "Irkutsk",
			"31": "Mongolia",
			"32": "Japan",
			"33": "Afghanistan",
			"34": "China",
			"35": "Middle East",
			"36": "India",
			"37": "Siam",
			"38": "Indonesia",
			"39": "New Guinea",
			"40": "Western Australia",
			"41": "Eastern Australia"
		},
		"continent_names": {
			"0": "North America",
			"1": "South America",
			"2": "Europe",
			"3": "Africa",
			"4": "Asia",
			"5": "Australia"
		},
		"country_card": {
			"0": 2,
			"1": 1,
			"2": 1,
			"3": 2,
			"4": 2,
			"5": 2,
			"6": 2,
			"7": 2,
			"8": 0,
			"9": 1,
			"10": 1,
			"11": 0,
			"12": 0,
			"13": 1,
			"14": 0,
			"15": 0,
			"16": 0,
			"17": 1,
			"18": 0,
			"19": 0,
			"20": 0,
			"21": 1,
			"22": 2,
			"23": 0,
			"24": 2,
			"25": 1,
			"26": 0,
			"27": 0,
			"28": 2,
			"29": 2,
			"30": 2,
			"31": 1,
			"32": 1,
			"33": 0,
			"34": 2,
			"35": 2,
			"36": 1,
			"37": 1,
			"38": 0,
			"39": 1,
			"40": 2,
			"41": 1
		},
		"wildcards": 2
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	/// <reference path="../../lib/backbone/backbone.d.ts" />
	var Backbone = __webpack_require__(24);
	var Collection = (function (_super) {
	    __extends(Collection, _super);
	    function Collection() {
	        _super.apply(this, arguments);
	    }
	    return Collection;
	})(Backbone.Collection);
	module.exports = Collection;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var Model = __webpack_require__(11);
	var Collection = __webpack_require__(26);
	var Continent = (function (_super) {
	    __extends(Continent, _super);
	    function Continent() {
	        _super.apply(this, arguments);
	    }
	    Continent.prototype.initialize = function (options) {
	        this.territories = new Collection();
	    };
	    Continent.prototype.setValue = function (value) {
	        this.set('value', value);
	    };
	    Continent.prototype.getValue = function () {
	        return this.get('value');
	    };
	    Continent.prototype.setName = function (name) {
	        this.set('name', name);
	    };
	    Continent.prototype.getName = function () {
	        return this.get('name');
	    };
	    return Continent;
	})(Model);
	module.exports = Continent;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var Model = __webpack_require__(11);
	var Collection = __webpack_require__(26);
	var Territory = (function (_super) {
	    __extends(Territory, _super);
	    function Territory() {
	        _super.apply(this, arguments);
	        this.owner = null;
	        this.armies = 0;
	    }
	    Territory.prototype.initialize = function (options) {
	        this.connections = new Collection();
	    };
	    Territory.prototype.setName = function (name) {
	        this.set('name', name);
	    };
	    Territory.prototype.getName = function () {
	        return this.get('name');
	    };
	    Territory.prototype.setCardType = function (cardType) {
	        this.set('cardType', cardType);
	    };
	    Territory.prototype.getCardType = function () {
	        return this.get('cardType');
	    };
	    Territory.prototype.setOwner = function (player) {
	        this.owner = player;
	    };
	    Territory.prototype.getOwner = function () {
	        return this.owner;
	    };
	    Territory.prototype.setArmies = function (armies) {
	        this.armies = armies;
	    };
	    Territory.prototype.addArmies = function (armies) {
	        this.armies += armies;
	    };
	    Territory.prototype.getArmies = function () {
	        return this.armies;
	    };
	    return Territory;
	})(Model);
	module.exports = Territory;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var Model = __webpack_require__(11);
	var Card = (function (_super) {
	    __extends(Card, _super);
	    function Card() {
	        _super.apply(this, arguments);
	    }
	    Card.prototype.getType = function () {
	        return this.get('type');
	    };
	    Card.prototype.getCountry = function () {
	        return this.get('territory');
	    };
	    return Card;
	})(Model);
	module.exports = Card;


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = this.__extends || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var View = __webpack_require__(2);
	var PlayerListItemView = (function (_super) {
	    __extends(PlayerListItemView, _super);
	    function PlayerListItemView(options) {
	        _super.call(this, options);
	        this.template = __webpack_require__(41);
	        this.listenTo(this.model, 'change', this.render);
	    }
	    Object.defineProperty(PlayerListItemView.prototype, "className", {
	        get: function () {
	            return 'player-list-item';
	        },
	        enumerable: true,
	        configurable: true
	    });
	    PlayerListItemView.prototype.getRenderData = function () {
	        var data = this.model.toJSON();
	        data.colour = this.model.getColour();
	        return data;
	    };
	    return PlayerListItemView;
	})(View);
	module.exports = PlayerListItemView;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(40);
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
	  return "<div class=\"player-container\"></div>\n<div class=\"current-player-thumb\"></div>\n";
	  },"useData":true});

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(40);
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
	  return "<svg width=\"725px\" height=\"469px\" viewBox=\"0 0 725 469\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n	<!-- Generator: Sketch 3.2.2 (9983) - http://www.bohemiancoding.com/sketch -->\n	<title>Risk_board</title>\n	<desc>Created with Sketch.</desc>\n	<defs>\n		<path id=\"path-1\" d=\"M128.74134,51.58711 C128.74134,51.58711 130.33233,51.41034 130.50911,53.88521 C130.68589,56.36008 131.39299,58.4814 131.39299,59.54206 C131.39299,60.60272 132.1001,64.49181 132.1001,64.49181 C132.1001,64.49181 133.33754,65.90602 134.04464,65.37569 C134.75175,64.84536 135.81241,64.66859 135.81241,63.43115 C135.81241,62.19371 136.16596,60.7795 136.51952,61.48661 C136.87307,62.19371 137.93373,62.72404 137.93373,63.7847 C137.93373,64.84536 137.75695,65.90602 137.93373,66.96668 C138.11051,68.02734 139.17117,69.08801 139.17117,69.08801 C139.17117,69.08801 139.52472,71.20933 139.52472,71.91643 C139.52472,72.62354 139.87827,73.15387 139.52472,74.92164 C139.17117,76.6894 139.17117,76.86618 139.34794,78.45717 C139.52472,80.04816 139.7015,80.75527 140.4086,80.93204 C141.11571,81.10882 141.11571,81.10882 141.82282,81.10882 C142.52992,81.10882 142.7067,80.40171 143.23703,81.2856 C143.76736,82.16948 143.94414,82.69981 145.18157,82.87659 C146.41901,83.05336 147.47967,82.87659 147.47967,82.87659 C147.47967,82.87659 148.01,83.76047 148.01,84.82113 C148.01,85.88179 147.83323,86.23534 148.18678,87.64956 C148.54033,89.06377 148.54033,89.24055 149.42422,89.41733 C150.3081,89.5941 150.83843,89.77088 150.83843,89.77088 C150.83843,89.77088 151.01521,90.65476 151.01521,92.06898 C151.01521,93.48319 151.36876,94.36707 151.36876,94.36707 L152.78297,95.42773 C152.78297,95.42773 153.13653,96.31162 153.84363,97.1955 C154.55074,98.07938 155.25785,98.25616 155.25785,98.25616 C155.25785,98.25616 155.78818,99.31682 155.96495,100.2007 C156.14173,101.08459 155.6114,100.55426 156.67206,101.79169 C157.73272,103.02913 157.9095,103.38268 157.9095,104.44334 C157.9095,105.504 158.79338,106.21111 158.43983,107.62532 C158.08627,109.03954 158.26305,109.56987 158.08627,111.33764 C157.9095,113.1054 158.26305,110.98408 157.9095,113.98929 C157.55594,116.99449 157.73272,117.87837 157.55594,118.93903 C157.37917,119.99969 157.02561,119.11581 156.84884,121.06035 C156.67206,123.0049 156.49528,124.59589 156.49528,124.59589 C156.49528,124.59589 155.25785,126.36365 154.37396,126.36365 C153.49008,126.36365 151.89909,125.65655 151.89909,126.54043 C151.89909,127.42431 151.01521,128.13142 152.25264,128.48497 C153.49008,128.83853 153.84363,127.77787 153.84363,129.0153 C153.84363,130.25274 153.49008,130.6063 152.42942,131.49018 C151.36876,132.37406 151.36876,132.19729 150.13132,132.90439 C148.89389,133.6115 149.60099,132.55084 148.71711,134.84894 C147.83323,137.14703 148.01,137.14703 147.3029,138.03092 C146.59579,138.9148 146.41901,138.9148 146.06546,139.97546 C145.7119,141.03612 145.7119,141.38967 145.7119,142.62711 C145.7119,143.86455 145.35835,144.39488 145.35835,144.39488 C145.35835,144.39488 143.94414,145.80909 143.94414,147.04653 C143.94414,148.28396 144.82802,148.81429 144.12091,149.69818 C143.41381,150.58206 144.12091,150.58206 142.52992,150.75884 C140.93893,150.93562 140.23183,150.93562 140.23183,150.93562 L137.75695,151.46595 C137.75695,151.46595 137.4034,150.40528 136.51952,150.93562 C135.63563,151.46595 135.98919,151.28917 135.28208,152.17305 C134.57497,153.05694 134.3982,153.05694 133.51431,153.58727 C132.63043,154.1176 133.51431,154.29437 132.98398,155.17826 C132.45365,156.06214 132.27688,156.94602 131.21622,156.41569 C130.15556,155.88536 129.802,156.06214 129.44845,155.00148 C129.0949,153.94082 129.62523,153.76404 127.85746,153.23371 C126.08969,152.70338 125.91291,152.70338 125.91291,152.70338 C125.91291,152.70338 125.38258,153.05694 125.02903,153.94082 C124.67548,154.8247 125.20581,155.17826 123.96837,155.70859 C122.73093,156.23892 122.73093,156.76925 121.4935,155.88536 C120.25606,155.00148 120.60961,154.64793 119.90251,154.29437 C119.1954,153.94082 119.37218,154.29437 118.66507,153.58727 C117.95796,152.88016 116.01342,150.22851 115.83664,149.16785 C115.65987,148.10719 115.12954,148.10719 115.65987,146.69297 C116.1902,145.27876 116.1902,144.2181 115.30631,143.68777 C114.42243,143.15744 114.24565,143.33422 114.24565,142.27356 C114.24565,141.2129 114.95276,139.09158 114.06888,138.9148 C113.18499,138.73802 113.18499,138.03092 112.47789,139.09158 C111.77078,140.15224 110.00301,142.80389 109.82624,141.38967 C109.64946,139.97546 109.11913,140.15224 110.17979,138.9148 C111.24045,137.67736 111.24045,137.50059 112.12433,136.6167 C113.00822,135.73282 113.71532,135.37927 114.06888,134.14183 C114.42243,132.90439 115.65987,130.78307 114.42243,130.6063 C113.18499,130.42952 112.47789,128.83853 112.12433,131.13663 C111.77078,133.43472 112.83144,133.96505 111.24045,134.49538 C109.64946,135.02571 109.82624,133.96505 108.76558,135.55604 C107.70492,137.14703 106.46748,138.9148 106.46748,138.9148 C106.46748,138.9148 105.76037,138.9148 104.34616,136.43993 C102.93194,133.96505 102.75517,133.78828 102.75517,132.37406 C102.75517,130.95985 103.2855,130.78307 102.40161,130.25274 C101.51773,129.72241 100.81062,128.48497 99.57319,128.3082 C98.33575,128.13142 98.51253,127.95464 96.56798,127.95464 L93.56278,127.95464 C91.61824,127.95464 91.61824,127.42431 90.55758,128.48497 C89.49692,129.54563 89.67369,129.89919 88.25948,130.07597 C86.84527,130.25274 86.49171,129.89919 85.7846,130.6063 C85.0775,131.3134 83.30973,131.66696 82.60262,131.66696 C81.89552,131.66696 80.30453,132.02051 79.7742,133.25795 C79.24387,134.49538 79.24387,134.67216 79.24387,135.37927 C79.24387,136.08637 80.30453,137.32381 79.42064,137.67736 C78.53676,138.03092 77.4761,138.20769 76.76899,138.20769 C76.06189,138.20769 75.00123,138.20769 74.64767,137.50059 C74.29412,136.79348 75.178,136.6167 73.58701,136.6167 L71.99602,136.6167 C71.99602,136.6167 71.46569,136.08637 69.52115,136.79348 C67.57661,137.50059 67.39983,138.03092 66.16239,138.73802 C64.92495,139.44513 65.63206,138.56125 64.5714,139.62191 C63.51074,140.68257 62.98041,141.2129 62.2733,141.56645 C61.5662,141.92 61.91975,141.74323 60.68231,142.27356 C59.44488,142.80389 60.15198,142.98066 58.56099,143.86455 C56.97,144.74843 56.97,144.74843 55.37901,144.92521 C53.78802,145.10198 53.9648,146.16264 52.37381,145.27876 C50.78282,144.39488 51.48993,144.39488 50.42927,143.51099 C49.36861,142.62711 48.30795,142.09678 47.42406,141.38967 C46.54018,140.68257 46.00985,141.03612 46.54018,139.62191 C47.07051,138.20769 46.89373,138.20769 47.60084,137.32381 C48.30795,136.43993 49.01505,137.32381 49.19183,135.20249 C49.36861,133.08117 49.01505,133.43472 49.36861,132.37406 C49.72216,131.3134 50.60604,131.66696 50.25249,129.89919 C49.89894,128.13142 49.89894,127.60109 49.19183,127.07076 C48.48472,126.54043 47.24729,125.65655 47.24729,125.65655 C47.24729,125.65655 46.18663,126.36365 46.00985,124.06556 C45.83307,121.76746 45.83307,122.29779 45.83307,120.53002 C45.83307,118.76226 46.3634,118.58548 45.47952,116.64094 C44.59563,114.69639 44.0653,115.04995 43.53497,113.81251 C43.00464,112.57507 42.82787,112.04474 42.65109,110.80731 C42.47431,109.56987 41.94398,109.74665 42.47431,108.68598 C43.00464,107.62532 43.53497,107.44855 43.53497,107.44855 C43.53497,107.44855 43.53497,107.44855 43.53497,106.21111 C43.53497,104.97367 42.65109,104.44334 44.24208,104.44334 C45.83307,104.44334 46.3634,105.15045 46.00985,104.44334 C45.6563,103.73624 46.00985,101.61492 46.00985,101.61492 C46.00985,101.61492 44.94919,102.4988 44.41886,101.08459 C43.88853,99.67037 43.3582,99.31682 43.88853,98.07938 C44.41886,96.84195 44.77241,96.84195 44.94919,95.42773 C45.12597,94.01352 43.3582,93.65997 45.30274,92.42253 C47.24729,91.18509 46.3634,91.18509 48.30795,91.00832 C50.25249,90.83154 49.54538,91.53865 50.78282,90.30121 C52.02026,89.06377 52.55059,88.71022 53.61125,87.82633 C54.67191,86.94245 54.31835,85.88179 55.90934,85.70501 C57.50033,85.52824 56.2629,85.35146 58.38422,85.52824 C60.50554,85.70501 61.03587,86.23534 62.09653,85.17468 C63.15719,84.11402 64.92495,82.34626 65.98562,81.63915 C67.04628,80.93204 67.22305,81.81593 68.10694,80.04816 C68.99082,78.28039 67.93016,78.28039 69.34437,77.04296 C70.75859,75.80552 70.93536,76.86618 71.99602,75.45197 C73.05668,74.03775 72.1728,73.33065 73.76379,73.33065 C75.35478,73.33065 75.35478,74.92164 75.88511,73.15387 C76.41544,71.3861 74.64767,71.3861 76.59222,70.679 C78.53676,69.97189 80.12775,71.03255 80.4813,69.79511 C80.83486,68.55767 81.36519,66.78991 81.36519,66.78991 C81.36519,66.78991 83.48651,65.55247 84.19361,65.19892 C84.90072,64.84536 85.60783,62.37049 86.49171,62.90082 C87.3756,63.43115 88.96659,64.49181 88.96659,64.49181 L91.08791,65.72925 C91.08791,65.72925 91.26468,66.25958 91.79501,64.13826 C92.32534,62.01694 91.97179,60.95628 92.6789,59.36529 C93.386,57.7743 93.73956,57.95107 95.15377,57.24397 C96.56798,56.53686 96.92154,56.18331 97.27509,55.4762 C97.62864,54.76909 98.6893,54.59232 99.74996,54.76909 C100.81062,54.94587 101.34095,55.4762 102.22484,54.23876 C103.10872,53.00133 102.93194,52.64777 103.81583,53.00133 C104.69971,53.35488 104.16938,53.35488 105.40682,53.70843 C106.64426,54.06199 107.88169,54.59232 110.35657,54.06199 C112.83144,53.53166 113.00822,52.29422 113.18499,53.70843 C113.36177,55.12265 113.36177,55.29942 114.24565,55.29942 C115.12954,55.29942 115.12954,55.4762 114.59921,56.53686 C114.06888,57.59752 114.42243,56.89041 113.00822,58.83496 C111.594,60.7795 110.8869,60.95628 110.71012,62.37049 C110.53334,63.7847 110.8869,64.66859 110.8869,64.66859 C110.8869,64.66859 110.17979,66.61313 111.41723,66.61313 C112.65466,66.61313 112.83144,66.0828 114.42243,65.90602 C116.01342,65.72925 117.42763,65.55247 117.60441,67.14346 C117.78119,68.73445 118.84185,71.73966 119.90251,71.91643 C120.96317,72.09321 120.96317,72.44676 122.73093,72.09321 C124.4987,71.73966 125.20581,72.62354 125.38258,71.03255 C125.55936,69.44156 125.55936,69.08801 125.55936,67.85057 C125.55936,66.61313 123.79159,68.55767 126.08969,65.02214 C128.38779,61.48661 128.91812,63.7847 128.38779,59.89562 C127.85746,56.00653 126.7968,56.36008 127.68068,53.88521 C128.56457,51.41034 128.21101,51.41034 128.74134,51.58711 L128.74134,51.58711 Z\"></path>\n		<path id=\"path-2\" d=\"M37.125,67.375 C38,68.75 37.5,69 39.5,69 C41.5,69 42.75,68.625 43.875,68.875 C45,69.125 44.5,69.5 45.75,69.375 C47,69.25 48.125,68.5 49.125,68.375 C50.125,68.25 51.375,68.125 52.125,68.375 C52.875,68.625 54,69.5 55.375,69.625 C56.75,69.75 59.875,69.75 60.375,69.875 C60.875,70 62.5,71.25 63.25,70.375 C64,69.5 64.25,69.75 64.5,68.375 C64.75,67 64.75,66.25 63.875,66 C63,65.75 63.625,65.25 61.5,65.125 C59.375,65 58.75,64.75 58.125,64.5 C57.5,64.25 56.5,63.25 55.75,63 C55,62.75 52.875,61.875 51.5,61.875 C50.125,61.875 47.375,61.625 46,61.625 C44.625,61.625 44.375,61 42.875,62.125 C41.375,63.25 40.125,63.75 39.25,64.375 C38.375,65 38.625,64.5 38.25,65.75 C37.875,67 37.5,67.625 37.125,67.375 L37.125,67.375 Z\"></path>\n		<path id=\"path-3\" d=\"M60.5,59.25 C61,57.5 60.625,57.75 60.75,56.25 C60.875,54.75 61.25,55.125 61.875,54.125 C62.5,53.125 62.125,51.5 63.25,53.375 C64.375,55.25 64,56 65.375,57.125 C66.75,58.25 67,59.5 68.125,58.375 C69.25,57.25 71.375,56.125 70.125,54.75 C68.875,53.375 68.125,54.75 68,51.5 C67.875,48.25 67.75,47.125 66.875,47.25 C66,47.375 65.25,48.625 65.125,46.875 C65,45.125 64.5,43 65.875,42.875 C67.25,42.75 68.625,43.625 69.5,42 C70.375,40.375 71.375,39.875 69.75,39.625 C68.125,39.375 66.875,39.125 66,39.25 C65.125,39.375 64.5,39.375 64.625,38.625 C64.75,37.875 63.75,37.125 65.5,37.125 C67.25,37.125 66.875,37.5 68.5,37.375 C70.125,37.25 71.75,36.375 72.25,35.875 C72.75,35.375 73.375,33.125 74.125,32.625 C74.875,32.125 75.375,31.75 75.25,31.125 C75.125,30.5 74.875,30 74.125,29.75 C73.375,29.5 72.125,29.25 71.75,29.75 C71.375,30.25 70.5,31.625 69.625,32 C68.75,32.375 64.5,32.125 63.5,32.625 C62.5,33.125 61.625,33.75 61,34.125 C60.375,34.5 59,35.125 59.25,36.625 C59.5,38.125 59.5,39.375 59.5,40 C59.5,40.625 58.25,42.375 58,43 C57.75,43.625 58.125,45.5 57.75,46.375 C57.375,47.25 57.125,46.75 57.125,48 C57.125,49.25 56.875,49.5 57.25,50.375 C57.625,51.25 58.25,51.25 57.875,52.5 C57.5,53.75 56.875,53 57.375,54.375 C57.875,55.75 58.5,55.25 58.625,56.5 C58.75,57.75 58.375,58.25 58.625,59.25 C58.875,60.25 60.625,59.375 60.5,59.25 L60.5,59.25 Z\"></path>\n		<path id=\"path-4\" d=\"M26.38764,35.85399 L27.09474,34.08622 C27.09474,34.08622 27.27152,36.03076 27.4483,37.09142 C27.62507,38.15208 27.09474,39.5663 27.62507,40.2734 C28.1554,40.98051 27.80185,41.33406 27.62507,42.39472 C27.4483,43.45538 28.33218,45.22315 28.33218,45.22315 L29.625,46.75 L31,47 C31,47 31.625,47.875 31.875,48.5 C32.125,49.125 33,49.5 33,49.5 L33,51.75 C33,52.625 32,53.125 33.125,53.375 C34.25,53.625 35.625,53.625 36.375,53.625 C37.125,53.625 36.875,54 37.375,55 C37.875,56 38.375,56.125 38.5,57.5 C38.625,58.875 38.625,59.875 38.125,60.5 C37.625,61.125 38,61.625 37.375,62.375 C36.75,63.125 35.75,63.25 35,63.375 C34.25,63.5 34,63.5 33.75,64.375 C33.5,65.25 35.375,66.125 33,66 C30.625,65.875 30.75,66.5 30.25,65.25 C29.75,64 31.125,63.5 29.375,62.875 C27.625,62.25 29.125,64.75 26.5,61.25 C23.875,57.75 23,60.125 22.625,57 C22.25,53.875 21.125,53.125 19.625,50.75 C18.125,48.375 17.5,46.75 16.25,46.375 C15,46 14.5,47.5 13.875,45.875 C13.25,44.25 13.25,45.125 13.25,43.25 C13.25,41.375 13.125,41.5 12.25,39.75 C11.375,38 11.25,38.125 10.75,36.25 C10.25,34.375 10.5,35.25 8.25,32.375 C6,29.5 5.75,29.25 3.75,27.75 C1.75,26.25 1.25,26 1.375,24 C1.5,22 0.125,20 1.375,19.625 C2.625,19.25 2.875,18.875 4.125,19.625 C5.375,20.375 5.5,21.25 6.5,21.5 C7.5,21.75 8.125,21.625 8.875,21.625 C9.625,21.625 9.375,20.625 10.625,22.125 C11.875,23.625 12.125,23.625 12.75,25 C13.375,26.375 13.375,26.875 14,27.625 C14.625,28.375 15.125,28.375 15.75,28 C16.375,27.625 17,26.5 17.375,27.25 C17.75,28 17.75,28.375 18,28.875 C18.25,29.375 19,27.75 19,29.875 C19,32 18.25,33 19.375,32.25 L21.625,30.75 C21.625,30.75 21.5,30.375 22,31.625 C22.5,32.875 22.625,34 23.75,34.5 C24.875,35 25.25,35 25.25,35 L26.38764,35.85399 L26.38764,35.85399 Z\"></path>\n		<path id=\"path-5\" d=\"M50,52.875 C50,52.875 49.75,51.625 51.875,49.5 C54,47.375 54.625,47.25 54.625,45.125 C54.625,43 54.5,43.125 53.5,42.125 C52.5,41.125 51.125,40.5 52.375,39 C53.625,37.5 53.5,37.125 55.125,36.75 C56.75,36.375 58.375,34 58.5,33.125 C58.625,32.25 58.75,31.75 58.375,30.625 C58,29.5 57,27.5 56.875,26.125 C56.75,24.75 56.625,23.75 56.75,22.75 C56.875,21.75 57.75,21.75 58.875,20.375 C60,19 60.25,19.625 60.25,17.625 C60.25,15.625 60.125,13.125 59.5,12.625 C58.875,12.125 58.625,12.375 57.25,11.875 C55.875,11.375 55.25,10.125 53.375,9 C51.5,7.875 50.25,7.75 49.875,8.375 C49.5,9 50.25,6.875 49.5,10 C48.75,13.125 48.875,13.875 48,14.5 C47.125,15.125 45.75,15.5 45.375,16.75 C45,18 46.375,18.875 44.375,21 C42.375,23.125 38.75,27.125 36.125,27.625 C33.5,28.125 31.625,28.75 31.625,29.625 C31.625,30.5 32.75,31.625 32.5,32.625 C32.25,33.625 30.5,34.625 30.75,35.125 C31,35.625 31.625,35.125 32.125,36.25 C32.625,37.375 32.625,40.875 32.625,40.875 L35,43.5 C35,43.5 33.25,46.125 34.125,46.875 C35,47.625 35.375,47.75 36.375,48.875 C37.375,50 38.625,51.25 40.125,51.375 C41.625,51.5 42.5,52.25 43.625,52.75 C44.75,53.25 45.125,52.75 46.5,52.625 C47.875,52.5 50.375,53 50,52.875 L50,52.875 Z\"></path>\n		<path id=\"path-6\" d=\"M91.75,11.5 C91.75,11.5 92.25,8.75 93.25,8 C94.25,7.25 93.5,7 93.5,5.75 C93.5,4.5 92.5,3.25 93.75,3 C95,2.75 95.25,3 97,2.75 C98.75,2.5 100.5,1.5 100.5,1.5 L102,3 C102,3 102.75,3.75 105,3.75 C107.25,3.75 108,4.75 109,6.5 C110,8.25 109.5,9 112.25,10.75 C115,12.5 117.75,13.25 119.25,13.75 C120.75,14.25 122,15 121.75,16.5 C121.5,18 123.25,18.75 121.25,19.25 C121.25,19.25 126.97358,21.71185 127.68068,23.30284 C128.38779,24.89383 129.62523,25.60094 128.21101,26.48482 C126.7968,27.3687 125.20581,26.6616 125.38258,27.72226 C125.55936,28.78292 126.62002,29.49003 126.97358,30.72746 C127.32713,31.9649 128.56457,32.67201 128.56457,34.08622 C128.56457,35.50043 128.21101,36.38432 129.62523,37.2682 C131.03944,38.15208 131.21622,38.15208 131.21622,39.21274 L131.21622,41.68762 C131.21622,41.68762 130.15556,42.74828 128.38779,42.74828 C126.62002,42.74828 125.73614,41.33406 125.02903,41.33406 C124.32192,41.33406 122.55416,40.98051 122.55416,40.98051 C122.55416,40.98051 121.31672,36.03076 117.78119,35.14688 C114.24565,34.263 114.24565,33.73267 114.24565,34.43977 C114.24565,35.14688 115.48309,36.73787 114.06888,37.2682 C112.65466,37.79853 111.94756,37.79853 111.06367,37.79853 C110.17979,37.79853 114.06888,39.38952 109.64946,39.21274 C105.23004,39.03597 104.87649,37.44498 102.93194,38.68241 C100.9874,39.91985 95.15377,34.9701 95.15377,34.9701 C95.15377,34.9701 92.50212,35.14688 92.50212,33.73267 C92.50212,32.31845 91.79501,32.14168 92.6789,30.90424 C93.56278,29.6668 93.56278,29.49003 93.56278,28.07581 C93.56278,26.6616 93.91633,26.30804 93.91633,24.89383 C93.91633,23.47962 94.80022,22.94929 93.56278,22.41896 C92.32534,21.88863 91.26468,21.53507 91.08791,20.29764 C90.91113,19.0602 90.91113,18.88342 90.02725,18.88342 C89.14336,18.88342 90.02725,19.0602 88.61303,19.0602 C87.19882,19.0602 86.13816,20.12086 84.90072,18.52987 C83.66328,16.93888 83.48651,16.93888 81.18841,16.93888 C78.89031,16.93888 73.94057,20.29764 77.82965,16.93888 C81.71874,13.58012 82.42585,13.40335 82.42585,13.40335 C82.42585,13.40335 78.35998,13.40335 78.18321,11.98913 C78.00643,10.57492 77.65288,8.27682 76.76899,7.92327 C75.88511,7.56972 74.82445,7.03938 75.178,5.80195 C75.53156,4.56451 76.23866,0.14509 79.7742,0.32187 C83.30973,0.49865 84.01684,1.91286 85.0775,2.44319 C86.13816,2.97352 88.0827,1.02898 88.43626,2.79674 C88.78981,4.56451 88.43626,7.56972 88.43626,7.56972 C88.43626,7.56972 89.67369,8.4536 90.02725,10.22137 L91.75,11.5 L91.75,11.5 Z\"></path>\n	</defs>\n	<g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n		<g id=\"Risk_board\" sketch:type=\"MSLayerGroup\" transform=\"translate(0.000000, 1.000000)\">\n			<g id=\"layer3\" transform=\"translate(0.003490, 41.444930)\" sketch:type=\"MSShapeGroup\">\n				<path d=\"M309.75,75 C309.75,75.8284271 309.078427,76.5 308.25,76.5 C307.421573,76.5 306.75,75.8284271 306.75,75 C306.75,74.1715729 307.421573,73.5 308.25,73.5 C309.078427,73.5 309.75,74.1715729 309.75,75 L309.75,75 Z\" id=\"path2900\" fill=\"#000000\"></path>\n				<path d=\"M308.5,75 L321.5,56\" id=\"path2902\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M323,56 C323,56.8284271 322.328427,57.5 321.5,57.5 C320.671573,57.5 320,56.8284271 320,56 C320,55.1715729 320.671573,54.5 321.5,54.5 C322.328427,54.5 323,55.1715729 323,56 L323,56 Z\" id=\"path2904\" fill=\"#000000\"></path>\n				<path d=\"M321.5,56 L344.75,69.5\" id=\"path2906\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M346.25,69.5 C346.25,70.3284271 345.578427,71 344.75,71 C343.921573,71 343.25,70.3284271 343.25,69.5 C343.25,68.6715729 343.921573,68 344.75,68 C345.578427,68 346.25,68.6715729 346.25,69.5 L346.25,69.5 Z\" id=\"path2908\" fill=\"#000000\"></path>\n				<path d=\"M344.75,69.5 L344.5,103.75\" id=\"path2910\" stroke=\"#000000\" stroke-width=\"1.20000005\" stroke-dasharray=\"4.8,1.2\"></path>\n				<path d=\"M346,103.75 C346,104.578427 345.328427,105.25 344.5,105.25 C343.671573,105.25 343,104.578427 343,103.75 C343,102.921573 343.671573,102.25 344.5,102.25 C345.328427,102.25 346,102.921573 346,103.75 L346,103.75 Z\" id=\"path2912\" fill=\"#000000\"></path>\n				<path d=\"M344.5,103.75 L308.25,75\" id=\"path2914\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M308.5,75 L344.75,69.75\" id=\"path2918\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M314.75,137.125 C314.75,137.953427 314.078427,138.625 313.25,138.625 C312.421573,138.625 311.75,137.953427 311.75,137.125 C311.75,136.296573 312.421573,135.625 313.25,135.625 C314.078427,135.625 314.75,136.296573 314.75,137.125 L314.75,137.125 Z\" id=\"path4638\" fill=\"#000000\"></path>\n				<path d=\"M313.25,137.125 L305.75,124.625\" id=\"path4640\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M307.375,124.625 C307.375,125.453427 306.703427,126.125 305.875,126.125 C305.046573,126.125 304.375,125.453427 304.375,124.625 C304.375,123.796573 305.046573,123.125 305.875,123.125 C306.703427,123.125 307.375,123.796573 307.375,124.625 L307.375,124.625 Z\" id=\"path4642\" fill=\"#000000\"></path>\n				<path d=\"M387.35699,193.31311 C387.35699,194.141537 386.685417,194.81311 385.85699,194.81311 C385.028563,194.81311 384.35699,194.141537 384.35699,193.31311 C384.35699,192.484683 385.028563,191.81311 385.85699,191.81311 C386.685417,191.81311 387.35699,192.484683 387.35699,193.31311 L387.35699,193.31311 Z\" id=\"path4644\" fill=\"#000000\"></path>\n				<path d=\"M385.857,193.3131 L387.27121,211.52109\" id=\"path4646\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M388.948,211.52109 C388.948,212.349517 388.276427,213.02109 387.448,213.02109 C386.619573,213.02109 385.948,212.349517 385.948,211.52109 C385.948,210.985192 386.233898,210.490001 386.698,210.222052 C387.162102,209.954103 387.733898,209.954103 388.198,210.222052 C388.662102,210.490001 388.948,210.985192 388.948,211.52109 L388.948,211.52109 Z\" id=\"path4648\" fill=\"#000000\"></path>\n				<path d=\"M452.05725,253.94751 C452.05725,254.775937 451.385677,255.44751 450.55725,255.44751 C449.728823,255.44751 449.05725,254.775937 449.05725,253.94751 C449.05725,253.119083 449.728823,252.44751 450.55725,252.44751 C451.385677,252.44751 452.05725,253.119083 452.05725,253.94751 L452.05725,253.94751 Z\" id=\"path4650\" fill=\"#000000\"></path>\n				<path d=\"M450.55727,253.59395 L442.42554,266.14509\" id=\"path4652\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M443.92554,266.14508 C443.92554,266.973507 443.253967,267.64508 442.42554,267.64508 C441.597113,267.64508 440.92554,266.973507 440.92554,266.14508 C440.92554,265.316653 441.597113,264.64508 442.42554,264.64508 C443.253967,264.64508 443.92554,265.316653 443.92554,266.14508 L443.92554,266.14508 Z\" id=\"path4654\" fill=\"#000000\"></path>\n				<path d=\"M616.81317,253.77072 C616.81317,254.599147 616.141597,255.27072 615.31317,255.27072 C614.484743,255.27072 613.81317,254.599147 613.81317,253.77072 C613.81317,252.942293 614.484743,252.27072 615.31317,252.27072 C616.141597,252.27072 616.81317,252.942293 616.81317,253.77072 L616.81317,253.77072 Z\" id=\"path4656\" fill=\"#000000\"></path>\n				<path d=\"M615.48993,253.77073 L622.91455,278.69624\" id=\"path4658\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M624.41455,278.69623 C624.41455,279.524657 623.742977,280.19623 622.91455,280.19623 C622.086123,280.19623 621.41455,279.524657 621.41455,278.69623 C621.41455,277.867803 622.086123,277.19623 622.91455,277.19623 C623.742977,277.19623 624.41455,277.867803 624.41455,278.69623 L624.41455,278.69623 Z\" id=\"path4660\" fill=\"#000000\"></path>\n				<path d=\"M622.91455,279.04979 L641.65288,283.11566\" id=\"path4662\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M300.0293,252.53329 C300.0293,253.361717 299.357727,254.03329 298.5293,254.03329 C297.700873,254.03329 297.0293,253.361717 297.0293,252.53329 C297.0293,251.704863 297.700873,251.03329 298.5293,251.03329 C299.357727,251.03329 300.0293,251.704863 300.0293,252.53329 L300.0293,252.53329 Z\" id=\"path4664\" fill=\"#000000\"></path>\n				<path d=\"M298.52931,252.53329 L272.71991,259.95791\" id=\"path4666\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M274.21991,259.95792 C274.21991,260.786347 273.548337,261.45792 272.71991,261.45792 C271.891483,261.45792 271.21991,260.786347 271.21991,259.95792 C271.21991,259.129493 271.891483,258.45792 272.71991,258.45792 C273.548337,258.45792 274.21991,259.129493 274.21991,259.95792 L274.21991,259.95792 Z\" id=\"path4668\" fill=\"#000000\"></path>\n				<path d=\"M224.75,1.75 C224.75,2.57842712 224.078427,3.25 223.25,3.25 C222.421573,3.25 221.75,2.57842712 221.75,1.75 C221.75,0.921572875 222.421573,0.25 223.25,0.25 C224.078427,0.25 224.75,0.921572875 224.75,1.75 L224.75,1.75 Z\" id=\"path4670\" fill=\"#000000\"></path>\n				<path d=\"M223.25,1.75 L207.75,39.25\" id=\"path4672\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M209.25,39.25 C209.25,40.0784271 208.578427,40.75 207.75,40.75 C206.921573,40.75 206.25,40.0784271 206.25,39.25 C206.25,38.4215729 206.921573,37.75 207.75,37.75 C208.578427,37.75 209.25,38.4215729 209.25,39.25 L209.25,39.25 Z\" id=\"path4674\" fill=\"#000000\"></path>\n				<path d=\"M223.25,1.5 L155.25,51.75\" id=\"path4676\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M156.75,51.75 C156.75,52.5784271 156.078427,53.25 155.25,53.25 C154.421573,53.25 153.75,52.5784271 153.75,51.75 C153.75,50.9215729 154.421573,50.25 155.25,50.25 C156.078427,50.25 156.75,50.9215729 156.75,51.75 L156.75,51.75 Z\" id=\"path4678\" fill=\"#000000\"></path>\n				<path d=\"M223.25,1.5 L186.5,9.75\" id=\"path4680\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M188,9.75 C188,10.5784271 187.328427,11.25 186.5,11.25 C185.671573,11.25 185,10.5784271 185,9.75 C185,8.92157288 185.671573,8.25 186.5,8.25 C187.328427,8.25 188,8.92157288 188,9.75 L188,9.75 Z\" id=\"path4682\" fill=\"#000000\"></path>\n				<path d=\"M296.5,36.5 C296.5,37.3284271 295.828427,38 295,38 C294.171573,38 293.5,37.3284271 293.5,36.5 C293.5,35.6715729 294.171573,35 295,35 C295.828427,35 296.5,35.6715729 296.5,36.5 L296.5,36.5 Z\" id=\"path4684\" fill=\"#000000\"></path>\n				<path d=\"M295,36.5 L274.5,18.75\" id=\"path4686\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M276,19 C276,19.8284271 275.328427,20.5 274.5,20.5 C273.671573,20.5 273,19.8284271 273,19 C273,18.1715729 273.671573,17.5 274.5,17.5 C275.328427,17.5 276,18.1715729 276,19 L276,19 Z\" id=\"path4688\" fill=\"#000000\"></path>\n				<path d=\"M647.92584,97.85367 C647.92584,98.6820971 647.254267,99.35367 646.42584,99.35367 C645.597413,99.35367 644.92584,98.6820971 644.92584,97.85367 C644.92584,97.0252429 645.597413,96.35367 646.42584,96.35367 C647.254267,96.35367 647.92584,97.0252429 647.92584,97.85367 L647.92584,97.85367 Z\" id=\"path4690\" fill=\"#000000\"></path>\n				<path d=\"M646.42585,97.85368 L669.05326,116.59201\" id=\"path4692\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M670.55328,116.59201 C670.55328,117.420437 669.881707,118.09201 669.05328,118.09201 C668.224853,118.09201 667.55328,117.420437 667.55328,116.59201 C667.55328,115.763583 668.224853,115.09201 669.05328,115.09201 C669.881707,115.09201 670.55328,115.763583 670.55328,116.59201 L670.55328,116.59201 Z\" id=\"path4694\" fill=\"#000000\"></path>\n				<path d=\"M669.05326,116.59201 L636.87991,121.89531\" id=\"path4696\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M638.37988,121.89532 C638.37988,122.723747 637.708307,123.39532 636.87988,123.39532 C636.051453,123.39532 635.37988,122.723747 635.37988,121.89532 C635.37988,121.066893 636.051453,120.39532 636.87988,120.39532 C637.708307,120.39532 638.37988,121.066893 638.37988,121.89532 L638.37988,121.89532 Z\" id=\"path4698\" fill=\"#000000\"></path>\n				<path d=\"M647.57227,284.88342 C647.57227,285.711847 646.900697,286.38342 646.07227,286.38342 C645.243843,286.38342 644.57227,285.711847 644.57227,284.88342 C644.57227,284.054993 645.243843,283.38342 646.07227,283.38342 C646.900697,283.38342 647.57227,284.054993 647.57227,284.88342 L647.57227,284.88342 Z\" id=\"path4700\" fill=\"#000000\"></path>\n				<path d=\"M646.07229,284.88342 L645.36519,332.61313\" id=\"path4702\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M646.86517,332.61313 C646.86517,333.441557 646.193597,334.11313 645.36517,334.11313 C644.536743,334.11313 643.86517,333.441557 643.86517,332.61313 C643.86517,331.784703 644.536743,331.11313 645.36517,331.11313 C646.193597,331.11313 646.86517,331.784703 646.86517,332.61313 L646.86517,332.61313 Z\" id=\"path4704\" fill=\"#000000\"></path>\n				<path d=\"M645.36519,332.61313 L634.05148,324.12785\" id=\"path4706\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M635.5,324.25 C635.5,325.078427 634.828427,325.75 634,325.75 C633.171573,325.75 632.5,325.078427 632.5,324.25 C632.5,323.421573 633.171573,322.75 634,322.75 C634.828427,322.75 635.5,323.421573 635.5,324.25 L635.5,324.25 Z\" id=\"path4708\" fill=\"#000000\"></path>\n				<path d=\"M661.25,320.625 C661.25,321.453427 660.578427,322.125 659.75,322.125 C658.921573,322.125 658.25,321.453427 658.25,320.625 C658.25,319.796573 658.921573,319.125 659.75,319.125 C660.578427,319.125 661.25,319.796573 661.25,320.625 L661.25,320.625 Z\" id=\"path4710\" fill=\"#000000\"></path>\n				<path d=\"M659.75,320.625 L646,284.875\" id=\"path4712\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M448.52173,320.94586 C448.52173,321.774287 447.850157,322.44586 447.02173,322.44586 C446.193303,322.44586 445.52173,321.774287 445.52173,320.94586 C445.52173,320.409962 445.807628,319.914771 446.27173,319.646822 C446.735832,319.378873 447.307628,319.378873 447.77173,319.646822 C448.235832,319.914771 448.52173,320.409962 448.52173,320.94586 L448.52173,320.94586 Z\" id=\"path4714\" fill=\"#000000\"></path>\n				<path d=\"M447,321 L455.25,366.75\" id=\"path4716\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M456.75,366.75 C456.75,367.578427 456.078427,368.25 455.25,368.25 C454.421573,368.25 453.75,367.578427 453.75,366.75 C453.75,365.921573 454.421573,365.25 455.25,365.25 C456.078427,365.25 456.75,365.921573 456.75,366.75 L456.75,366.75 Z\" id=\"path4718\" fill=\"#000000\"></path>\n				<path d=\"M455.25,366.75 L433,382.25\" id=\"path4720\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M434.5,382.25 C434.5,383.078427 433.828427,383.75 433,383.75 C432.171573,383.75 431.5,383.078427 431.5,382.25 C431.5,381.421573 432.171573,380.75 433,380.75 C433.828427,380.75 434.5,381.421573 434.5,382.25 L434.5,382.25 Z\" id=\"path4722\" fill=\"#000000\"></path>\n				<path d=\"M19.22213,38.27993 L0.83736,38.27993\" id=\"path4724\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n				<path d=\"M669.40682,40.93158 L713.24744,41.28514\" id=\"path4726\" stroke=\"#000000\" stroke-dasharray=\"4,1\"></path>\n			</g>\n			<g id=\"territories\" transform=\"translate(15.003490, 0.444930)\" stroke-opacity=\"0.58527132\" stroke=\"#000000\" stroke-width=\"1.20000005\" sketch:type=\"MSShapeGroup\">\n				<path d=\"M641.08791,372.72925 C641.08791,372.72925 641.26468,373.25958 641.79501,371.13826 C642.32534,369.01694 641.97179,367.95628 642.6789,366.36529 C643.386,364.7743 643.73956,364.95107 645.15377,364.24397 C646.56798,363.53686 646.92154,363.18331 647.27509,362.4762 C647.62864,361.76909 648.6893,361.59232 649.74996,361.76909 C650.81062,361.94587 651.34095,362.4762 652.22484,361.23876 C653.10872,360.00133 652.93194,359.64777 653.81583,360.00133 C654.69971,360.35488 654.16938,360.35488 655.40682,360.70843 C656.64426,361.06199 657.88169,361.59232 660.35657,361.06199 C662.83144,360.53166 663.00822,359.29422 663.18499,360.70843 C663.36177,362.12265 663.36177,362.29942 664.24565,362.29942 C665.12954,362.29942 665.12954,362.4762 664.59921,363.53686 C664.06888,364.59752 664.42243,363.89041 663.00822,365.83496 C661.594,367.7795 660.8869,367.95628 660.71012,369.37049 C660.53334,370.7847 660.8869,371.66859 660.8869,371.66859 C660.8869,371.66859 660.17979,373.61313 661.41723,373.61313 C662.65466,373.61313 662.83144,373.0828 664.42243,372.90602 C666.01342,372.72925 667.42763,372.55247 667.60441,374.14346 C667.78119,375.73445 668.84185,378.73966 669.90251,378.91643 C670.96317,379.09321 670.96317,379.44676 672.73093,379.09321 C674.4987,378.73966 675.20581,379.62354 675.38258,378.03255 C675.55936,376.44156 675.55936,376.08801 675.55936,374.85057 C675.55936,373.61313 673.79159,375.55767 676.08969,372.02214 C678.38779,368.48661 678.91812,370.7847 678.38779,366.89562 C677.85746,363.00653 676.7968,363.36008 677.68068,360.88521 C678.56457,358.41034 678.21101,358.41034 678.74134,358.58711 C678.74134,358.58711 680.33233,358.41034 680.50911,360.88521 C680.68589,363.36008 681.39299,365.4814 681.39299,366.54206 C681.39299,367.60272 682.1001,371.49181 682.1001,371.49181 C682.1001,371.49181 683.33754,372.90602 684.04464,372.37569 C684.75175,371.84536 685.81241,371.66859 685.81241,370.43115 C685.81241,369.19371 686.16596,367.7795 686.51952,368.48661 C686.87307,369.19371 687.93373,369.72404 687.93373,370.7847 C687.93373,371.84536 687.75695,372.90602 687.93373,373.96668 C688.11051,375.02734 689.17117,376.08801 689.17117,376.08801 C689.17117,376.08801 689.52472,378.20933 689.52472,378.91643 C689.52472,379.62354 689.87827,380.15387 689.52472,381.92164 C689.17117,383.6894 689.17117,383.86618 689.34794,385.45717 C689.52472,387.04816 689.7015,387.75527 690.4086,387.93204 C691.11571,388.10882 691.11571,388.10882 691.82282,388.10882 C692.52992,388.10882 692.7067,387.40171 693.23703,388.2856 C693.76736,389.16948 693.94414,389.69981 695.18157,389.87659 C696.41901,390.05336 697.47967,389.87659 697.47967,389.87659 C697.47967,389.87659 698.01,390.76047 698.01,391.82113 C698.01,392.88179 697.83323,393.23534 698.18678,394.64956 C698.54033,396.06377 698.54033,396.24055 699.42422,396.41733 C700.3081,396.5941 700.83843,396.77088 700.83843,396.77088 C700.83843,396.77088 701.01521,397.65476 701.01521,399.06898 C701.01521,400.48319 701.36876,401.36707 701.36876,401.36707 L702.78297,402.42773 C702.78297,402.42773 703.13653,403.31162 703.84363,404.1955 C704.55074,405.07938 705.25785,405.25616 705.25785,405.25616 C705.25785,405.25616 705.78818,406.31682 705.96495,407.2007 C706.14173,408.08459 705.6114,407.55426 706.67206,408.79169 C707.73272,410.02913 707.9095,410.38268 707.9095,411.44334 C707.9095,412.504 708.79338,413.21111 708.43983,414.62532 C708.08627,416.03954 708.26305,416.56987 708.08627,418.33764 C707.9095,420.1054 708.26305,417.98408 707.9095,420.98929 C707.55594,423.99449 707.73272,424.87837 707.55594,425.93903 C707.37917,426.99969 707.02561,426.11581 706.84884,428.06035 C706.67206,430.0049 706.49528,431.59589 706.49528,431.59589 C706.49528,431.59589 705.25785,433.36365 704.37396,433.36365 C703.49008,433.36365 701.89909,432.65655 701.89909,433.54043 C701.89909,434.42431 701.01521,435.13142 702.25264,435.48497 C703.49008,435.83853 703.84363,434.77787 703.84363,436.0153 C703.84363,437.25274 703.49008,437.6063 702.42942,438.49018 C701.36876,439.37406 701.36876,439.19729 700.13132,439.90439 C698.89389,440.6115 699.60099,439.55084 698.71711,441.84894 C697.83323,444.14703 698.01,444.14703 697.3029,445.03092 C696.59579,445.9148 696.41901,445.9148 696.06546,446.97546 C695.7119,448.03612 695.7119,448.38967 695.7119,449.62711 C695.7119,450.86455 695.35835,451.39488 695.35835,451.39488 C695.35835,451.39488 693.94414,452.80909 693.94414,454.04653 C693.94414,455.28396 694.82802,455.81429 694.12091,456.69818 C693.41381,457.58206 694.12091,457.58206 692.52992,457.75884 C690.93893,457.93562 690.23183,457.93562 690.23183,457.93562 L687.75695,458.46595 C687.75695,458.46595 687.4034,457.40528 686.51952,457.93562 C685.63563,458.46595 685.98919,458.28917 685.28208,459.17305 C684.57497,460.05694 684.3982,460.05694 683.51431,460.58727 C682.63043,461.1176 683.51431,461.29437 682.98398,462.17826 C682.45365,463.06214 682.27688,463.94602 681.21622,463.41569 C680.15556,462.88536 679.802,463.06214 679.44845,462.00148 C679.0949,460.94082 679.62523,460.76404 677.85746,460.23371 C676.08969,459.70338 675.91291,459.70338 675.91291,459.70338 C675.91291,459.70338 675.38258,460.05694 675.02903,460.94082 C674.67548,461.8247 675.20581,462.17826 673.96837,462.70859 C672.73093,463.23892 672.73093,463.76925 671.4935,462.88536 L671.72892,462.61589 C671.72892,462.61589 671.72892,456.95904 671.9057,455.54482 C672.08248,454.13061 671.55215,454.30739 670.84504,453.24673 C670.13793,452.18607 671.72892,410.9971 671.55215,410.11321 C671.37537,409.22933 641.67689,410.46677 641.67689,410.46677 L641.08791,372.72925 L641.08791,372.72925 Z\" id=\"eastern_australia\" data-territory-id=\"41\" class=\"territory\"></path>\n				<path d=\"M587.125,374.375 C588,375.75 587.5,376 589.5,376 C591.5,376 592.75,375.625 593.875,375.875 C595,376.125 594.5,376.5 595.75,376.375 C597,376.25 598.125,375.5 599.125,375.375 C600.125,375.25 601.375,375.125 602.125,375.375 C602.875,375.625 604,376.5 605.375,376.625 C606.75,376.75 609.875,376.75 610.375,376.875 C610.875,377 612.5,378.25 613.25,377.375 C614,376.5 614.25,376.75 614.5,375.375 C614.75,374 614.75,373.25 613.875,373 C613,372.75 613.625,372.25 611.5,372.125 C609.375,372 608.75,371.75 608.125,371.5 C607.5,371.25 606.5,370.25 605.75,370 C605,369.75 602.875,368.875 601.5,368.875 C600.125,368.875 597.375,368.625 596,368.625 C594.625,368.625 594.375,368 592.875,369.125 C591.375,370.25 590.125,370.75 589.25,371.375 C588.375,372 588.625,371.5 588.25,372.75 C587.875,374 587.5,374.625 587.125,374.375 L587.125,374.375 Z M610.5,366.25 C611,364.5 610.625,364.75 610.75,363.25 C610.875,361.75 611.25,362.125 611.875,361.125 C612.5,360.125 612.125,358.5 613.25,360.375 C614.375,362.25 614,363 615.375,364.125 C616.75,365.25 617,366.5 618.125,365.375 C619.25,364.25 621.375,363.125 620.125,361.75 C618.875,360.375 618.125,361.75 618,358.5 C617.875,355.25 617.75,354.125 616.875,354.25 C616,354.375 615.25,355.625 615.125,353.875 C615,352.125 614.5,350 615.875,349.875 C617.25,349.75 618.625,350.625 619.5,349 C620.375,347.375 621.375,346.875 619.75,346.625 C618.125,346.375 616.875,346.125 616,346.25 C615.125,346.375 614.5,346.375 614.625,345.625 C614.75,344.875 613.75,344.125 615.5,344.125 C617.25,344.125 616.875,344.5 618.5,344.375 C620.125,344.25 621.75,343.375 622.25,342.875 C622.75,342.375 623.375,340.125 624.125,339.625 C624.875,339.125 625.375,338.75 625.25,338.125 C625.125,337.5 624.875,337 624.125,336.75 C623.375,336.5 622.125,336.25 621.75,336.75 C621.375,337.25 620.5,338.625 619.625,339 C618.75,339.375 614.5,339.125 613.5,339.625 C612.5,340.125 611.625,340.75 611,341.125 C610.375,341.5 609,342.125 609.25,343.625 C609.5,345.125 609.5,346.375 609.5,347 C609.5,347.625 608.25,349.375 608,350 C607.75,350.625 608.125,352.5 607.75,353.375 C607.375,354.25 607.125,353.75 607.125,355 C607.125,356.25 606.875,356.5 607.25,357.375 C607.625,358.25 608.25,358.25 607.875,359.5 C607.5,360.75 606.875,360 607.375,361.375 C607.875,362.75 608.5,362.25 608.625,363.5 C608.75,364.75 608.375,365.25 608.625,366.25 C608.875,367.25 610.625,366.375 610.5,366.25 L610.5,366.25 Z M600,359.875 C600,359.875 599.75,358.625 601.875,356.5 C604,354.375 604.625,354.25 604.625,352.125 C604.625,350 604.5,350.125 603.5,349.125 C602.5,348.125 601.125,347.5 602.375,346 C603.625,344.5 603.5,344.125 605.125,343.75 C606.75,343.375 608.375,341 608.5,340.125 C608.625,339.25 608.75,338.75 608.375,337.625 C608,336.5 607,334.5 606.875,333.125 C606.75,331.75 606.625,330.75 606.75,329.75 C606.875,328.75 607.75,328.75 608.875,327.375 C610,326 610.25,326.625 610.25,324.625 C610.25,322.625 610.125,320.125 609.5,319.625 C608.875,319.125 608.625,319.375 607.25,318.875 C605.875,318.375 605.25,317.125 603.375,316 C601.5,314.875 600.25,314.75 599.875,315.375 C599.5,316 600.25,313.875 599.5,317 C598.75,320.125 598.875,320.875 598,321.5 C597.125,322.125 595.75,322.5 595.375,323.75 C595,325 596.375,325.875 594.375,328 C592.375,330.125 588.75,334.125 586.125,334.625 C583.5,335.125 581.625,335.75 581.625,336.625 C581.625,337.5 582.75,338.625 582.5,339.625 C582.25,340.625 580.5,341.625 580.75,342.125 C581,342.625 581.625,342.125 582.125,343.25 C582.625,344.375 582.625,347.875 582.625,347.875 L585,350.5 C585,350.5 583.25,353.125 584.125,353.875 C585,354.625 585.375,354.75 586.375,355.875 C587.375,357 588.625,358.25 590.125,358.375 C591.625,358.5 592.5,359.25 593.625,359.75 C594.75,360.25 595.125,359.75 596.5,359.625 C597.875,359.5 600.375,360 600,359.875 L600,359.875 Z M576.38764,342.85399 L577.09474,341.08622 C577.09474,341.08622 577.27152,343.03076 577.4483,344.09142 C577.62507,345.15208 577.09474,346.5663 577.62507,347.2734 C578.1554,347.98051 577.80185,348.33406 577.62507,349.39472 C577.4483,350.45538 578.33218,352.22315 578.33218,352.22315 L579.625,353.75 L581,354 C581,354 581.625,354.875 581.875,355.5 C582.125,356.125 583,356.5 583,356.5 L583,358.75 C583,359.625 582,360.125 583.125,360.375 C584.25,360.625 585.625,360.625 586.375,360.625 C587.125,360.625 586.875,361 587.375,362 C587.875,363 588.375,363.125 588.5,364.5 C588.625,365.875 588.625,366.875 588.125,367.5 C587.625,368.125 588,368.625 587.375,369.375 C586.75,370.125 585.75,370.25 585,370.375 C584.25,370.5 584,370.5 583.75,371.375 C583.5,372.25 585.375,373.125 583,373 C580.625,372.875 580.75,373.5 580.25,372.25 C579.75,371 581.125,370.5 579.375,369.875 C577.625,369.25 579.125,371.75 576.5,368.25 C573.875,364.75 573,367.125 572.625,364 C572.25,360.875 571.125,360.125 569.625,357.75 C568.125,355.375 567.5,353.75 566.25,353.375 C565,353 564.5,354.5 563.875,352.875 C563.25,351.25 563.25,352.125 563.25,350.25 C563.25,348.375 563.125,348.5 562.25,346.75 C561.375,345 561.25,345.125 560.75,343.25 C560.25,341.375 560.5,342.25 558.25,339.375 C556,336.5 555.75,336.25 553.75,334.75 C551.75,333.25 551.25,333 551.375,331 C551.5,329 550.125,327 551.375,326.625 C552.625,326.25 552.875,325.875 554.125,326.625 C555.375,327.375 555.5,328.25 556.5,328.5 C557.5,328.75 558.125,328.625 558.875,328.625 C559.625,328.625 559.375,327.625 560.625,329.125 C561.875,330.625 562.125,330.625 562.75,332 C563.375,333.375 563.375,333.875 564,334.625 C564.625,335.375 565.125,335.375 565.75,335 C566.375,334.625 567,333.5 567.375,334.25 C567.75,335 567.75,335.375 568,335.875 C568.25,336.375 569,334.75 569,336.875 C569,339 568.25,340 569.375,339.25 L571.625,337.75 C571.625,337.75 571.5,337.375 572,338.625 C572.5,339.875 572.625,341 573.75,341.5 C574.875,342 575.25,342 575.25,342 L576.38764,342.85399 L576.38764,342.85399 Z\" id=\"indonesia\" data-territory-id=\"38\" class=\"territory\"></path>\n				<path d=\"M641.75,318.5 C641.75,318.5 642.25,315.75 643.25,315 C644.25,314.25 643.5,314 643.5,312.75 C643.5,311.5 642.5,310.25 643.75,310 C645,309.75 645.25,310 647,309.75 C648.75,309.5 650.5,308.5 650.5,308.5 L652,310 C652,310 652.75,310.75 655,310.75 C657.25,310.75 658,311.75 659,313.5 C660,315.25 659.5,316 662.25,317.75 C665,319.5 667.75,320.25 669.25,320.75 C670.75,321.25 672,322 671.75,323.5 C671.5,325 673.25,325.75 671.25,326.25 C671.25,326.25 676.97358,328.71185 677.68068,330.30284 C678.38779,331.89383 679.62523,332.60094 678.21101,333.48482 C676.7968,334.3687 675.20581,333.6616 675.38258,334.72226 C675.55936,335.78292 676.62002,336.49003 676.97358,337.72746 C677.32713,338.9649 678.56457,339.67201 678.56457,341.08622 C678.56457,342.50043 678.21101,343.38432 679.62523,344.2682 C681.03944,345.15208 681.21622,345.15208 681.21622,346.21274 L681.21622,348.68762 C681.21622,348.68762 680.15556,349.74828 678.38779,349.74828 C676.62002,349.74828 675.73614,348.33406 675.02903,348.33406 C674.32192,348.33406 672.55416,347.98051 672.55416,347.98051 C672.55416,347.98051 671.31672,343.03076 667.78119,342.14688 C664.24565,341.263 664.24565,340.73267 664.24565,341.43977 C664.24565,342.14688 665.48309,343.73787 664.06888,344.2682 C662.65466,344.79853 661.94756,344.79853 661.06367,344.79853 C660.17979,344.79853 664.06888,346.38952 659.64946,346.21274 C655.23004,346.03597 654.87649,344.44498 652.93194,345.68241 C650.9874,346.91985 645.15377,341.9701 645.15377,341.9701 C645.15377,341.9701 642.50212,342.14688 642.50212,340.73267 C642.50212,339.31845 641.79501,339.14168 642.6789,337.90424 C643.56278,336.6668 643.56278,336.49003 643.56278,335.07581 C643.56278,333.6616 643.91633,333.30804 643.91633,331.89383 C643.91633,330.47962 644.80022,329.94929 643.56278,329.41896 C642.32534,328.88863 641.26468,328.53507 641.08791,327.29764 C640.91113,326.0602 640.91113,325.88342 640.02725,325.88342 C639.14336,325.88342 640.02725,326.0602 638.61303,326.0602 C637.19882,326.0602 636.13816,327.12086 634.90072,325.52987 C633.66328,323.93888 633.48651,323.93888 631.18841,323.93888 C628.89031,323.93888 623.94057,327.29764 627.82965,323.93888 C631.71874,320.58012 632.42585,320.40335 632.42585,320.40335 C632.42585,320.40335 628.35998,320.40335 628.18321,318.98913 C628.00643,317.57492 627.65288,315.27682 626.76899,314.92327 C625.88511,314.56972 624.82445,314.03938 625.178,312.80195 C625.53156,311.56451 626.23866,307.14509 629.7742,307.32187 C633.30973,307.49865 634.01684,308.91286 635.0775,309.44319 C636.13816,309.97352 638.0827,308.02898 638.43626,309.79674 C638.78981,311.56451 638.43626,314.56972 638.43626,314.56972 C638.43626,314.56972 639.67369,315.4536 640.02725,317.22137 L641.75,318.5 L641.75,318.5 Z\" id=\"new_guinea\" data-territory-id=\"39\" class=\"territory\"></path>\n				<path d=\"M63.5,105.25 C62.875,104 63,105.375 62.625,103.25 C62.25,101.125 61.5,101.375 60.875,100.75 C60.25,100.125 59.375,100 59.75,98.875 C60.125,97.75 60.375,97.75 60,96.625 C59.625,95.5 58,94.875 57.5,93.75 C57,92.625 57,93.5 57,91.75 C57,90 57.5,89.75 56,89.25 C54.5,88.75 53.5,90 52.75,88.375 C52,86.75 52.125,87.625 50.625,87.375 C49.125,87.125 48.5,87.25 48,86.25 C47.5,85.25 47.25,84.375 46.25,84.375 C45.25,84.375 44,84 43.75,83.375 C43.5,82.75 42.125,81 41.25,81 C40.375,81 40.625,81.625 39.25,82.25 C37.875,82.875 41.75,83.5 38.75,84.25 C35.75,85 34.375,85.25 33.75,84.75 C33.125,84.25 30.875,85.875 31.25,84 C31.625,82.125 31.75,82.375 32.375,81.875 C33,81.375 34.75,81.25 34,80.75 C33.25,80.25 33.625,79.375 31,80 C28.375,80.625 27.625,80.875 26.75,81.5 C25.875,82.125 25.875,83.375 25.5,84.125 C25.125,84.875 26.625,84.625 23.75,85.875 C20.875,87.125 22.375,85.25 19.375,87.875 C16.375,90.5 17.375,90.75 15.125,91.125 C12.875,91.5 14.25,91.125 12.5,93 C10.75,94.875 11,95.75 9.25,95.75 C7.5,95.75 8.125,98.875 6.5,96.75 C4.875,94.625 3.75,95.5 5,94.5 C6.25,93.5 6.5,93.75 7.5,93.5 C8.5,93.25 8,93.875 9.125,92.25 C10.25,90.625 10,90 11.75,89.875 C13.5,89.75 13.25,91.375 14,89 C14.75,86.625 14,86.75 15.375,85.5 C16.75,84.25 18.25,83 16.5,82.875 C14.75,82.75 14.625,82.375 13,83.125 C11.375,83.875 11.25,84.25 9.75,84 C8.25,83.75 7.875,83.625 7.875,83 C7.875,82.375 7.25,80.375 7.25,80.375 C7.25,80.375 8.5,79.75 6.375,79.25 C4.25,78.75 4.125,80.375 4.25,78.75 C4.375,77.125 5.375,77.375 4.5,76.625 C3.625,75.875 3.375,75.375 2.25,75.875 C1.125,76.375 -0.125,77.625 0.625,75.75 C1.375,73.875 2.875,73.125 3.375,72.375 C3.875,71.625 4.625,69.5 4.875,68.375 C5.125,67.25 3.875,67.875 5.375,66.75 C6.875,65.625 6.25,65.375 8.125,65.5 C10,65.625 9.5,65.5 10.75,66.125 C12,66.75 12.375,67.125 13.125,66.75 C13.875,66.375 14.625,65.5 15.125,64.875 C15.625,64.25 16.25,63.875 16.375,63.125 C16.5,62.375 17.125,61.625 15.75,62.125 C14.375,62.625 14.875,62.625 13,63 C11.125,63.375 11.375,64.75 10.625,63.125 C9.875,61.5 9.75,60.75 9.75,60.75 C9.75,60.75 9,60.75 9.125,59 C9.25,57.25 8,54.375 11.375,53.5 C14.75,52.625 16.875,53.375 17,53.875 C17.125,54.375 16,54.875 17.5,55 C19,55.125 19.125,55.5 20,54.25 C20.875,53 21.875,53.125 20.875,52.625 C19.875,52.125 19,52.25 18.5,51.25 C18,50.25 18.5,50 18,48.625 C17.5,47.25 17.5,47 16.75,46 C16,45 14,43.5 16.5,42.875 C19,42.25 21.625,41.625 21.13203,41.98005 C21.13203,41.98005 23.96046,38.79807 25.72823,39.15162 C27.496,39.50518 29.61732,39.15162 31.38508,37.73741 C33.15285,36.3232 35.98128,37.0303 35.98128,37.0303 L38.1026,38.79807 C38.1026,38.79807 40.93102,41.6265 42.69879,40.56584 C44.46656,39.50518 44.46656,42.3336 47.64854,42.68716 C50.83052,43.04071 52.24473,43.74782 55.42671,44.80848 C55.42671,44.80848 56.3106,44.45492 56.13382,45.69236 C55.95704,46.9298 54.18928,76.27473 54.71961,76.62828 L54.87151,76.87288 L62.37151,77.74788 C62.37151,77.74788 62.49651,77.87288 62.99651,79.37288 C63.49651,80.87288 63.87151,81.87288 64.99651,83.87288 C66.12151,85.87288 65.12151,91.87288 65.12151,91.87288 L67.12151,94.62288 C67.12151,94.62288 68.74651,95.37288 69.37151,95.49788 C69.99651,95.62288 69.74651,98.74788 69.62151,99.99788 C69.49651,101.24788 67.99651,100.62288 67.12151,100.87288 C66.24651,101.12288 65.99651,103.24788 65.87151,104.49788 C65.74651,105.74788 63.5,105.25 63.5,105.25 L63.5,105.25 Z\" id=\"alaska\" data-territory-id=\"0\" class=\"territory\"></path>\n				<path d=\"M142.04729,82.63869 C141.34019,85.11356 140.98663,91.83108 140.98663,91.83108 L142.7544,93.24529 C142.7544,93.24529 144.16861,95.72017 145.93638,97.48793 C147.70415,99.2557 148.76481,102.79123 151.59324,102.08413 C154.42166,101.37702 155.48232,104.559 155.48232,104.559 L157.60364,103.14479 C157.60364,103.14479 159.72496,101.90735 160.07852,102.61446 C160.43207,103.32156 162.55339,104.02867 162.55339,104.02867 C162.55339,104.02867 164.67471,102.79123 166.61926,102.61446 C168.5638,102.43768 166.97281,104.20545 166.97281,104.20545 L162.90694,106.14999 C162.90694,106.14999 163.79083,108.80164 164.85149,108.44809 C165.91215,108.09453 166.44248,112.51395 165.20504,113.39784 C163.9676,114.28172 165.55859,116.04949 165.55859,116.04949 L166.2657,118.52436 L168.21025,119.93857 L168.74058,122.23667 L168.5638,122.23667 C167.85669,124.18121 167.50314,141.15178 167.50314,141.15178 C167.50314,141.15178 168.5638,139.73756 169.27091,139.56079 C169.97801,139.38401 171.03867,140.975 171.74578,141.15178 C172.45289,141.32855 172.09933,139.73756 172.80644,139.03046 C173.51355,138.32335 173.69032,139.03046 174.39743,139.56079 C175.10454,140.09112 174.92776,139.56079 175.98842,139.38401 C177.04908,139.20723 177.04908,142.21244 177.04908,143.09632 C177.04908,143.9802 175.28131,144.51053 175.28131,144.51053 C175.28131,144.51053 172.80644,145.39442 171.74578,145.21764 C170.68512,145.04086 169.44768,146.63185 168.74058,147.51574 C168.03347,148.39962 166.61926,147.86929 165.73537,148.22284 C164.85149,148.5764 165.38182,149.46028 165.55859,150.69772 C165.73537,151.93516 161.66951,155.11714 160.78562,154.23325 C159.90174,153.34937 158.48753,151.93516 156.89654,151.05127 C155.30555,150.16739 157.25009,148.39962 157.9572,147.16218 C158.6643,145.92475 158.13397,143.09632 157.07331,140.26789 C156.01265,137.43947 155.83588,136.37881 155.30555,135.6717 C154.77522,134.96459 153.53778,133.02005 153.00745,130.72195 C152.47712,128.42385 150.17902,132.31294 147.70415,131.60584 C145.22927,130.89873 141.87052,132.6665 141.87052,132.6665 C141.87052,132.6665 142.22407,127.71675 141.51696,127.36319 C140.80986,127.00964 121.71797,127.71675 121.71797,127.71675 L121.71797,124.88832 C121.71797,122.59022 125.60706,79.45671 125.60706,79.45671 L143.99184,79.98704 L142.04729,82.63869 L142.04729,82.63869 Z\" id=\"ontario\" data-territory-id=\"4\" class=\"territory\"></path>\n				<path d=\"M143.83614,80.06934 C144.54326,77.59447 152.6539,69.91077 152.6539,69.91077 C152.6539,69.91077 155.83588,69.55722 157.25009,68.49656 C158.6643,67.43589 155.48232,64.25391 155.48232,64.25391 L156.18943,62.13259 L158.31075,63.90036 C158.31075,63.90036 159.01786,65.31457 161.13918,65.31457 C163.2605,65.31457 162.55339,63.19325 163.9676,62.8397 C165.38182,62.48615 166.79603,58.95061 166.79603,58.95061 C166.79603,58.95061 169.62446,60.01127 172.45289,57.18285 C175.28131,54.35442 173.15999,55.76863 172.45289,54.35442 C171.74578,52.94021 173.15999,51.87955 173.15999,51.87955 L171.03867,51.17244 C171.03867,51.17244 172.45289,50.11178 171.03867,47.99046 C169.62446,45.86914 169.27091,49.05112 167.85669,50.11178 C166.44248,51.17244 166.79603,52.2331 162.90694,51.52599 C159.01786,50.81889 162.90694,49.40467 162.55339,47.99046 C162.19984,46.57624 158.31075,48.69757 157.60364,46.57624 C156.89654,44.45492 155.83588,47.63691 156.18943,45.51558 C156.54298,43.39426 155.83588,40.21228 154.42166,39.50518 C153.00745,38.79807 157.25009,32.08056 157.25009,32.08056 C157.25009,32.08056 160.07852,33.49477 160.43207,31.0199 C160.78562,28.54502 162.19984,28.89858 162.19984,27.48436 C162.19984,26.07015 158.6643,27.13081 158.6643,27.13081 L157.9572,29.95924 C157.9572,29.95924 153.71456,26.77725 153.71456,29.95924 C153.71456,33.14122 152.30034,33.14122 150.17902,37.38386 C148.0577,41.6265 149.82547,44.10137 149.82547,44.10137 C149.82547,44.10137 151.94679,44.80848 151.23968,46.9298 C150.53258,49.05112 146.28993,48.69757 146.28993,48.69757 L145.93638,44.80848 L143.10795,44.80848 C143.10795,44.80848 142.7544,48.69757 143.10795,50.11178 C143.46151,51.52599 135.32978,50.46533 133.20846,48.69757 C131.08714,46.9298 128.61227,50.11178 126.49095,51.17244 C124.36962,52.2331 122.60186,51.52599 120.48054,50.81889 C118.35922,50.11178 119.41988,53.64731 114.82368,53.29376 C110.22749,52.94021 112.70236,46.9298 111.6417,49.05112 C110.58104,51.17244 105.98485,47.28335 103.50997,45.16203 C101.0351,43.04071 96.43891,43.74782 96.43891,43.74782 L96.08535,41.27294 L93.61048,41.27294 L90.4285,41.98005 C90.4285,41.98005 87.95363,43.04071 85.83231,42.68716 C83.71098,42.3336 84.06454,44.45492 84.06454,44.45492 C84.06454,44.45492 81.58966,45.51558 78.40768,45.16203 C75.2257,44.80848 75.57926,46.22269 74.16504,47.28335 C72.75083,48.34401 67.80108,45.86914 64.6191,44.45492 C61.43712,43.04071 59.35869,45.99414 56.17671,44.93348 C56.17671,44.93348 54.5,76.25 54.75,77 C55,77.75 137.375,80 141.5,79.875 C145.625,79.75 143.83614,80.06934 143.83614,80.06934 L143.83614,80.06934 Z\" id=\"northwest_territory\" data-territory-id=\"1\" class=\"territory\"></path>\n				<path d=\"M126.375,277.875 C128.25,276.625 127.875,274.125 127.875,273.375 L127.875,270.25 C127.875,269.25 127.75,268.5 128.875,267.25 C130,266 130.625,264.875 130.625,264.875 L131.875,263.75 L131.875,261.75 L132.625,259.5 C132.625,259.5 133.125,258.375 133.25,257.875 C133.375,257.375 133,255.375 133,255.375 L133.25,253.75 L136.375,252.875 C136.375,252.875 136.75,253.25 137.75,252.875 C138.75,252.5 139.75,251.625 139.75,251.625 L142,250.375 C142,250.375 143.5,249.375 144,248.875 C144.5,248.375 146.25,247.75 146.25,247.75 C146.25,247.75 147.125,247.5 147.75,247.5 C148.375,247.5 150.5,246.875 150.5,246.875 C150.5,246.875 150.625,246.25 151.375,245.75 C152.125,245.25 152.625,244.625 153.25,244.5 C153.875,244.375 157.25,243.875 157.25,243.875 C157.25,243.875 158.5,244.75 158.625,246 C158.75,247.25 158.25,248 159.25,247.875 C160.25,247.75 161.25,247.5 161.75,247.25 C162.25,247 162,245.875 163.25,246.75 C164.5,247.625 164.625,247.875 165.125,247.875 C165.625,247.875 167,247.5 167,247.5 L172.5,249.375 L174.375,249 C175,248.875 178.125,248.625 178.125,248.625 C178.125,248.625 179.5,249 180,249.5 C180.5,250 183.625,251.875 184.625,253.375 C185.625,254.875 187.125,255.375 187.375,256 C187.625,256.625 188.625,257.25 189.125,257.25 C189.625,257.25 189.625,258.25 190.25,258.375 C190.875,258.5 192.25,258.5 192.25,258.5 C192.25,258.5 192.375,259 192.875,259.625 C193.375,260.25 194.5,259 194.75,260.375 C195,261.75 194.625,262.5 195.375,262.5 C196.125,262.5 196.875,262 196.875,262 L198.125,261.5 C198.125,261.5 198.125,260.5 199.125,261.5 C200.125,262.5 200.875,262.25 201.75,262.5 C202.625,262.75 201.375,263.375 203.5,263.875 C205.625,264.375 207.625,264.625 208.125,264.625 C208.625,264.625 208.625,262.625 210.375,264.25 C212.125,265.875 213.375,266.625 213.375,266.625 C213.375,266.625 209.04566,270.19876 208.51533,271.25942 C207.985,272.32008 207.63145,274.61818 206.39401,274.79496 C205.15657,274.97174 197.73195,275.32529 197.73195,275.32529 C197.73195,275.32529 198.08551,277.44661 197.02485,277.44661 C195.96419,277.44661 185.53436,277.09306 185.53436,277.09306 L184.12015,272.85041 C184.12015,272.85041 182.88271,273.7343 182.70593,271.96653 C182.52916,270.19876 182.52916,267.37034 182.52916,267.37034 C182.52916,267.37034 179.87751,268.78455 178.28652,269.31488 C176.69553,269.84521 175.28131,272.49686 173.8671,271.96653 C172.45289,271.4362 171.74578,269.66843 171.39223,271.08265 C171.03867,272.49686 171.569,276.7395 170.50834,277.09306 C169.44768,277.44661 169.09413,276.82789 168.21025,277.88855 C167.32636,278.94921 164.93988,279.21438 164.23277,278.59566 C163.52566,277.97694 162.99533,277.26983 162.19984,277.00467 C161.40434,276.7395 160.9624,276.29756 160.07852,276.20917 C159.19463,276.12078 159.01786,275.67884 158.31075,276.47434 C157.60364,277.26983 156.10104,278.59566 155.83588,279.30276 C155.57071,280.00987 154.1565,282.57313 154.51005,283.5454 C154.8636,284.51768 156.27782,284.25251 156.27782,286.02028 C156.27782,287.78805 155.74749,288.67193 154.77522,288.93709 C153.80294,289.20226 148.94159,290.79325 148.94159,290.79325 C148.94159,290.79325 148.14609,288.67193 147.61576,288.1416 C147.08543,287.61127 146.11316,287.3461 145.40605,287.16933 C144.69894,286.99255 143.5499,285.75511 142.66601,285.8435 C141.78213,285.93189 139.48403,285.93189 138.86531,285.22478 C138.2466,284.51768 137.18594,283.72218 135.59495,283.63379 C134.00395,283.5454 133.29685,284.69445 132.23619,283.01507 C131.17553,281.3357 129.23098,279.0376 128.70065,278.94921 C128.17032,278.86082 125.69545,278.59566 126.375,277.875 L126.375,277.875 Z\" id=\"venezuela\" data-territory-id=\"9\" class=\"territory\"></path>\n				<path d=\"M468.75,397 C469,398 469.75,397.75 469.75,400 C469.75,402.25 470.25,405.5 468.75,403.5 C467.25,401.5 467.25,400.75 467.25,402 C467.25,403.25 467.5,405.5 467.5,405.5 C467.5,405.5 468.73063,407.2007 467.13964,407.2007 C465.54865,407.2007 465.37187,407.02393 465.37187,407.73103 C465.37187,408.43814 465.54865,409.85235 465.54865,409.85235 L464.48799,410.91301 L463.95766,413.21111 C463.95766,413.21111 465.72542,413.38789 464.66476,415.15565 C463.6041,416.92342 463.25055,417.45375 463.25055,417.45375 C463.25055,417.45375 463.42733,415.86276 463.07377,419.3983 C462.72022,422.93383 462.72022,423.46416 462.72022,423.46416 C462.72022,423.46416 463.78088,423.11061 462.36667,424.87837 C460.95245,426.64614 460.42212,427.17647 460.06857,428.06035 C459.71502,428.94424 460.42212,429.82812 459.36146,430.712 C458.3008,431.59589 457.77047,432.30299 457.77047,432.30299 L456.70981,433.36365 C456.70981,433.36365 456.35626,434.77787 456.35626,435.48497 C456.35626,436.19208 455.82593,436.72241 455.82593,436.72241 C455.82593,436.72241 455.2956,437.25274 455.2956,437.95985 C455.2956,438.66696 455.47238,439.02051 454.58849,439.72762 C453.70461,440.43472 454.05816,440.6115 452.9975,441.49538 C451.93684,442.37927 451.58329,441.14183 451.58329,443.08637 C451.58329,445.03092 451.05296,445.9148 450.16907,445.9148 C449.28519,445.9148 440.79991,446.09158 439.3857,445.9148 C437.97148,445.73802 440.26958,438.66696 438.32504,437.42952 C436.38049,436.19208 435.14306,431.94944 436.38049,431.06556 C437.61793,430.18167 436.91082,431.06556 437.79471,430.18167 C438.67859,429.29779 438.67859,429.29779 439.20892,428.23713 C439.73925,427.17647 440.62313,427.17647 440.62313,427.17647 C440.62313,427.17647 439.56247,424.87837 440.26958,424.87837 C440.97669,424.87837 440.62313,422.22672 440.62313,422.22672 C440.62313,422.22672 440.97669,420.98929 441.50702,420.1054 C442.03735,419.22152 440.97669,418.33764 442.3909,418.16086 C443.80511,417.98408 444.51222,418.33764 444.51222,417.45375 C444.51222,416.56987 443.62834,416.39309 442.92123,416.21631 C442.21412,416.03954 441.86057,416.21631 441.86057,414.97888 C441.86057,413.74144 441.33024,414.27177 440.97669,413.03433 C440.62313,411.7969 439.56247,412.504 440.79991,410.91301 C442.03735,409.32202 442.03735,410.38268 442.3909,408.79169 C442.74445,407.2007 441.33024,406.14004 443.09801,406.14004 C444.86577,406.14004 445.3961,406.67037 447.16387,405.96327 C448.93164,405.25616 446.98709,405.07938 449.81552,405.25616 C452.64395,405.43294 452.82073,406.31682 453.88139,405.25616 C454.94205,404.1955 455.47238,404.54905 455.64915,403.31162 C455.82593,402.07418 455.64915,401.72063 456.88659,401.1903 C458.12403,400.65997 458.12403,401.1903 459.00791,400.48319 C459.89179,399.77608 460.5989,398.8922 460.42212,397.83154 C460.24535,396.77088 459.36146,396.24055 460.95245,396.24055 C462.54344,396.24055 462.36667,396.77088 463.07377,395.88699 C463.78088,395.00311 463.6041,395.00311 463.95766,393.41212 C464.31121,391.82113 463.95766,391.46758 464.84154,390.93725 C465.72542,390.40692 467.31641,388.63915 467.31641,388.63915 C467.31641,388.63915 467.84674,387.04816 468.55385,389.52303 C469.26096,391.99791 468.55385,391.64435 469.43773,392.35146 C470.32162,393.05857 470.49839,392.52824 470.49839,393.41212 C470.49839,394.296 470.14484,396.06377 470.14484,396.06377 L468.75,397 L468.75,397 Z\" id=\"madagascar\" data-territory-id=\"25\" class=\"territory\"></path>\n				<path d=\"M353.625,248.375 C352.75,247.375 352.625,247 352.25,246.25 C351.875,245.5 351.625,244.125 350.375,244 C349.125,243.875 349.25,245.125 348.875,243.25 C348.5,241.375 348.125,239.875 347.625,239.5 C347.125,239.125 346.25,238.75 345.125,237.625 C344,236.5 343.875,235.375 343.875,235.375 L341.75,234 C341.75,234 336.25,234.25 335.625,234.25 C335,234.25 333.875,234.375 333.125,234.875 C332.375,235.375 332.75,235.625 331.375,236.25 C330,236.875 327.75,238 327.125,238.25 C326.5,238.5 323.625,238.625 323.625,238.625 C323.625,238.625 323.625,239.625 322.5,240.375 C321.375,241.125 319.875,242 318.625,241.875 C317.375,241.75 317.23106,241.30628 316.25,241.5 C314.40217,241.86488 313.19141,243.08233 312.5,243 C311.86709,242.92463 310.75,243.375 309.625,243.75 C308.5,244.125 309.75,244.25 307.375,244.25 C305,244.25 303.75,244.25 303,244.125 C302.25,244 301.625,244.375 301,244.5 C300.375,244.625 299.5,244.75 299.73211,244.9197 C298.31789,244.9197 297.61079,245.98036 297.61079,245.98036 L297.96434,250.57655 L294.78236,254.11209 C294.78236,254.11209 294.07525,256.94051 293.36814,259.06183 C292.66104,261.18315 291.60038,263.30447 291.60038,263.30447 L290.18616,267.19356 C290.18616,267.19356 288.625,268 288.75,268.625 C288.875,269.25 289.125,270.5 288.625,270.875 C288.125,271.25 287.5,270.875 286.875,272.125 C286.25,273.375 285.75,274.5 285.75,275 C285.75,275.5 286.375,276 285.5,277 C284.625,278 283.75,278.125 283.5,280.25 C283.25,282.375 282.25,284.25 283.25,285.5 C284.25,286.75 284.875,287.75 284.875,289.125 C284.875,290.5 284.5,290.375 284.625,292.375 C284.75,294.375 285,294.25 285,295.625 C285,297 284.875,298.875 284.625,300.5 C284.375,302.125 283.875,302.625 283.5,304.5 C283.125,306.375 280.875,307.125 282.625,308.75 C284.375,310.375 284.125,311.875 284.625,313.25 C285.125,314.625 289.625,314.25 289.625,317.125 C289.625,320 293,320.375 293.25,321.875 C293.5,323.375 292.625,325.5 295.625,326.75 C298.625,328 298.375,329.875 299,330.375 C299.625,330.875 302.375,331.25 303,332 C303.625,332.75 304.5,334 305.125,334.625 C305.75,335.25 306.375,336.25 308.5,336.125 C310.625,336 310.875,336.125 314.25,335.75 C317.625,335.375 320,335.25 320.875,335.125 C321.75,335 323.625,335.625 325,335 C326.375,334.375 326.125,333.25 327.875,332.875 C329.625,332.5 330.25,332.875 331.375,332.625 C332.5,332.375 336.875,332.375 337.5,332.875 C338.125,333.375 338.875,332.875 339.625,334.5 C340.375,336.125 338.125,338.625 342.875,338.375 C347.625,338.125 350.375,337.375 351,338.5 C351.625,339.625 349.5,341.25 349.875,342.75 C350.25,344.25 350.75,344.625 350.25,345.375 L350.82057,345.68241 C351.3509,346.74307 351.3509,347.2734 352.05801,347.62696 C352.76512,347.98051 354.70966,346.38952 354.70966,346.38952 C354.70966,346.38952 356.30065,346.38952 357.89164,346.74307 C359.48263,347.09663 359.65941,346.38952 361.2504,346.03597 C362.84139,345.68241 363.19494,347.2734 363.19494,347.2734 C363.19494,347.2734 364.43238,348.15729 365.84659,347.2734 C367.2608,346.38952 366.90725,346.03597 366.37692,344.62175 C365.84659,343.20754 366.73047,342.85399 367.08403,338.9649 C367.43758,335.07581 365.84659,337.02036 365.84659,337.02036 C365.84659,337.02036 365.31626,335.78292 365.49304,333.30804 C365.66981,330.83317 366.37692,332.60094 366.90725,331.54028 C367.43758,330.47962 368.14469,330.47962 369.02857,329.77251 C369.91245,329.0654 371.14989,329.0654 372.03378,328.53507 C372.91766,328.00474 373.44799,326.94408 374.8622,326.41375 C376.27642,325.88342 377.69063,325.17632 379.98873,324.11566 C382.28682,323.055 381.75649,321.99434 381.75649,321.11045 C381.75649,320.22657 384.05459,317.7517 384.05459,317.7517 C384.05459,317.7517 383.52426,315.63038 382.64038,314.39294 C381.75649,313.1555 382.28682,311.74129 382.28682,310.8574 C382.28682,309.97352 382.64038,309.44319 383.17071,308.73608 C383.70104,308.02898 383.34748,307.67542 383.34748,307.67542 L384.23137,305.90766 C384.23137,305.90766 384.7617,304.49344 384.7617,303.25601 C384.7617,302.01857 384.05459,302.5489 383.34748,302.37212 C382.64038,302.19535 383.17071,302.01857 384.23137,301.48824 C385.29203,300.95791 384.93847,299.72047 385.11525,298.65981 C385.29203,297.59915 384.7617,293.17973 384.58492,292.29585 C384.40814,291.41197 380.69583,292.47263 379.81195,292.11907 C378.92807,291.76552 378.39774,291.05841 378.39774,291.05841 C378.39774,291.05841 377.69063,288.93709 377.51385,287.87643 C377.33708,286.81577 374.8622,288.05321 373.97832,287.87643 C373.09444,287.69966 373.80154,286.46222 373.44799,285.22478 C373.09444,283.98735 371.68022,284.51768 370.79634,284.51768 C369.91245,284.51768 368.49824,283.81057 367.2608,282.92669 C366.02337,282.0428 365.66981,283.28024 364.2556,283.45702 C362.84139,283.63379 362.84139,283.28024 362.31106,282.39636 C361.78073,281.51247 360.01296,282.92669 358.42197,282.74991 C356.83098,282.57313 357.18453,281.86603 356.30065,280.45181 C355.41677,279.0376 354.53288,280.09826 352.58834,279.56793 C350.6438,279.0376 351.3509,278.86082 351.17413,277.44661 C350.99735,276.0324 349.75991,276.20917 349.75991,276.20917 C349.75991,276.20917 349.58313,274.61818 349.40636,273.38074 C349.22958,272.14331 349.58313,270.19876 349.58313,269.49166 C349.58313,268.78455 349.22958,266.1329 347.99214,265.60257 C346.75471,265.07224 347.63859,263.8348 347.63859,263.8348 C347.63859,263.8348 347.10826,262.06704 347.28504,261.18315 C347.46181,260.29927 348.69925,259.23861 349.58313,259.23861 C350.46702,259.23861 350.99735,258.17795 350.99735,258.17795 C350.99735,258.17795 349.58313,256.05663 348.87603,254.81919 C348.16892,253.58176 350.11347,253.75853 350.11347,253.75853 L350.99735,252.69787 C350.99735,252.69787 351.3509,252.16754 352.94189,251.28366 C354.53288,250.39977 353.625,248.375 353.625,248.375 L353.625,248.375 Z\" id=\"north_africa\" data-territory-id=\"20\" class=\"territory\"></path>\n				<path d=\"M238.125,72.875 C238.125,72.875 238.75,76.75 237.875,78.375 C237,80 236.875,79.125 236.375,81.5 C235.875,83.875 236.25,84.75 235.375,86.125 C234.5,87.5 234.75,85.25 234.375,88.875 C234,92.5 234.25,93.375 233.375,93.75 C232.5,94.125 233.625,95.5 232.125,95.5 C230.625,95.5 230.125,96.5 229.75,95.125 C229.375,93.75 230,93.125 228.5,93 C227,92.875 226.125,94.625 225.875,92.875 C225.625,91.125 226.25,90.5 225,90 C223.75,89.5 226.25,93.625 222.125,88.75 C218,83.875 218.75,80.5 218.75,80.5 C218.75,80.5 217.5,79.125 217.5,78.25 C217.5,77.375 218.375,74.625 217.25,73.125 C216.125,71.625 215,68.625 216.375,67.75 C217.75,66.875 219.125,67.125 219.5,65.125 C219.875,63.125 219.75,63.375 220,62.375 C220.25,61.375 220.75,61 219.75,60.875 C218.75,60.75 219.75,61.25 217.875,60.75 C216,60.25 216.25,59.5 215.75,59.375 C215.25,59.25 216.125,60.125 214.5,59.5 C212.875,58.875 211.625,58.375 213.375,57.75 C215.125,57.125 216.25,56.875 217,57.125 C217.75,57.375 218.125,58.75 217.875,56.875 C217.625,55 213.5,54 213.5,52.75 L213.5,50.5 C213.5,49.25 213.25,48.625 212.25,47.625 C211.25,46.625 211.5,46.625 211.25,45 C211,43.375 211,43.5 210.125,42.5 C209.25,41.5 209.125,42.875 208.5,41.125 C207.875,39.375 207.875,39 206.625,39 C205.375,39 205.5,39.75 204.5,38.375 C203.5,37 203.75,36.75 202.125,36.875 C200.5,37 199.25,37.75 199,38.25 C198.75,38.75 199.375,39.25 197.75,39.375 C196.125,39.5 195.75,39.5 194.875,39.5 C194,39.5 193.125,39.875 193.125,39.375 C193.125,39.375 192.125,37.875 190.5,38.25 C188.875,38.625 188.5,39.75 188,38.5 C187.5,37.25 186.5,37.375 186.375,36.75 C186.25,36.125 184.75,36.875 186.25,35.25 C187.75,33.625 186.75,33.25 188.625,33.375 C190.5,33.5 190.125,33.625 191.125,33.125 C192.125,32.625 193.5,32.5 192.125,32.375 C192.125,32.375 192.625,31.625 191.25,31.375 C189.875,31.125 188.375,31.875 188.375,30.875 C188.375,29.875 187.125,28.75 188.875,28.75 C190.625,28.75 191.625,29.25 192.5,28.375 C193.375,27.5 193.375,27.75 194.625,27.875 C195.875,28 197.125,28.625 197.5,27.625 C197.875,26.625 199.875,26.5 198.25,26 C196.625,25.5 195.75,25.625 196.125,24.875 C196.5,24.125 197.5,24 197.125,23.125 C196.75,22.25 195,21.5 197.5,21.375 C200,21.25 201.25,22.375 201.625,21 C202,19.625 200.625,18.5 202.875,18.5 C205.125,18.5 207.5,17.375 207.625,16.625 C207.75,15.875 207.125,15 209.25,15.5 C211.375,16 211,17.125 212.125,15.75 C213.25,14.375 212,14 214.25,14.5 C216.5,15 216.75,15.25 217.625,14.625 C218.5,14 216.875,13.75 219,14 C221.125,14.25 220.75,15 221.125,13.125 C221.5,11.25 219.75,11.5 221.875,11 C224,10.5 224.125,11 225.125,9.625 C226.125,8.25 225.25,8.625 227.125,8.25 C229,7.875 229.25,8.25 228.375,6.875 C227.5,5.5 225.875,4.75 228.375,4.5 C230.875,4.25 232.25,4 232.5,3.25 C232.5,3.25 232.375,4.25 233.875,3.875 C235.375,3.5 235.125,3 236,1.875 C236.875,0.75 236.625,0.5 237.5,1.125 C238.375,1.75 237.375,2.25 239.625,1.125 C241.875,7.10542736e-15 240.125,7.10542736e-15 242.375,0.375 C244.625,0.75 244.5,0.5 247.125,0.625 C249.75,0.75 248.375,1.125 249.875,1.5 C251.375,1.875 251,1.75 252.875,1.75 C254.75,1.75 254.375,1.375 255.5,2.125 C256.625,2.875 256.125,3 258.375,3 C260.625,3 261.25,2.375 261.625,3.75 C262,5.125 261,5.25 263.75,5.625 C266.5,6 267.375,5.5 265.875,6.625 C264.375,7.75 261.25,7.875 262.125,8.625 C263,9.375 262.875,9.125 260.5,9.625 C258.125,10.125 254.625,10.625 257.5,11 C260.375,11.375 262.375,10.125 263.125,11.375 C263.875,12.625 262.125,12.75 265.375,12.375 C268.625,12 267.25,11.25 269.875,11.75 C272.5,12.25 272,13 272.875,11.375 C273.75,9.75 271.375,8.875 274.25,9.5 C277.125,10.125 276.5,10.125 278.25,9.125 C280,8.125 280.25,6.125 281,8.5 C281.75,10.875 281.625,11.375 280,12.125 C278.375,12.875 278.5,11.75 278,13.5 C277.5,15.25 277.625,15.75 276.375,16.75 C275.125,17.75 274.5,16.875 274.75,18.625 C275,20.375 275,20.125 274.625,21.875 C274.25,23.625 273.375,24.125 274.5,25.125 C275.625,26.125 275.625,25.125 276.375,26.625 C277.125,28.125 277.5,28.125 276.75,29.875 C276,31.625 275.875,30.75 275.625,32.875 C275.375,35 275.125,36.25 276,35.625 C276.875,35 277,33.25 277.125,35 C277.25,36.75 277.75,37.875 276.25,38.5 C274.75,39.125 274.875,38.25 274.625,39.5 C274.375,40.75 275.25,41.125 274.125,42.125 C273,43.125 274,44.125 272.75,43 C271.5,41.875 270.75,40.125 269.75,41.25 C268.75,42.375 267.375,41.375 268.5,42.75 C269.625,44.125 270.375,43.75 270.625,44.25 C270.875,44.75 270.75,45.25 271.125,46 C271.5,46.75 271.25,47.125 272.25,47 C273.25,46.875 273.625,47.375 273.375,48.25 C273.125,49.125 273,49.625 273.75,50.5 C274.5,51.375 274.75,51.375 274.125,51.75 C273.5,52.125 273.375,52.25 272.5,52.75 C271.625,53.25 271.75,54 271.25,54.125 C270.75,54.25 269.75,54.875 269.625,53.625 C269.5,52.375 269.375,50.75 268.625,50.125 C267.875,49.5 266.75,47.875 266.5,49.375 C266.25,50.875 266.5,51.375 266.125,52.125 C265.75,52.875 264.25,51.875 265.75,53.125 C267.25,54.375 267.875,54.75 267.875,54.75 C267.875,54.75 269.25,55.5 268.625,56.125 C268,56.75 268.75,57 266.875,57.25 C265,57.5 265.875,55.625 264.125,57.625 C262.375,59.625 261.125,60.125 261.125,60.125 L260.25,59.125 C260.25,59.125 259.5,57 259.25,58.375 C259,59.75 259.25,59.625 258.25,61.75 C257.25,63.875 257.75,64.375 256.625,64.5 C255.5,64.625 254.625,63.75 254,64.625 C253.375,65.5 254.25,65.25 253.125,66.125 C252,67 251.625,67.125 250.875,67.125 C250.125,67.125 251.25,65 249.75,67.25 C248.25,69.5 249.125,69.75 247.875,70 C246.625,70.25 246.375,70.25 245.25,70.25 C244.125,70.25 243.5,70.375 242.375,70.375 C241.25,70.375 240.375,70.5 239.625,70.875 C238.875,71.25 238.125,72.125 238.125,72.125 L238.125,72.875 L238.125,72.875 Z\" id=\"greenland\" data-territory-id=\"2\" class=\"territory\"></path>\n				<path d=\"M283,75.5 C283,75.5 285,77.375 285.50001,76.375 C286.00001,75.37501 284.87501,74.125 286.37501,75.25 C287.875,76.375 287.75,76 288.25001,76.625 C288.75001,77.25 291.75,75.125 290.625,77.125 C289.5,79.12501 288.75001,79.875 289.5,79.75001 C290.25001,79.625 289.375,79 290.37501,80.25001 C291.37501,81.5 291.25001,82.5 292.62501,81.37501 L293.875,77.50001 C293.875,77.50001 297.37501,77.625 297.125,78.875 C296.87501,80.125 296,80 297.87501,79 C299.75,78 298.75,76.25 300.00001,77.375 C301.25001,78.5 301.87501,79.625 302.37501,78.5 C302.87501,77.375 301.25001,76.125 302.75001,76.375 C304.25,76.625 304.37501,78 305.25,76.375 C306.12501,74.75001 305.12501,73.875 306.5,74.125 C307.87501,74.375 307.25001,74.75001 308.25001,73.875 C309.25,73 309.00001,72.125 310.00001,73 C311.00001,73.875 311.00001,74.25001 311.00001,74.25001 C311.00001,74.25001 313,74.5 313.5,74.75001 C314,75 313.25001,73.75 313.75001,75.75 C314.25001,77.75 314.37501,78.375 315.00001,78.125 C315.625,77.875 316.00001,77.00001 316.00001,78.62501 C316.00001,80.25001 314.87501,80.75 316.375,80.5 C317.875,80.25001 318.25001,80.125 318.375,81.25 C318.5,82.375 319.12501,83.25 319.12501,83.25 C319.12501,83.25 319.25001,84.12501 319.12501,84.62501 C319,85.125 318.75001,85.375 319,86 C319.25001,86.625 319.5,87.625 319,87.87501 C318.5,88.125 317.75001,88.625 316.875,88.75 C316.00001,88.875 315.50001,89.5 315.25,90.12501 C315.00001,90.75 316.00001,90.375 314.87501,91.75001 C313.75001,93.125 314.125,93.37501 313.37501,93.625 C312.62501,93.87501 311.75001,94.375 311.75001,94.375 L308.37501,94.875 L307.625,93.5 C307.625,93.5 307.12501,92.375 306.62501,92.87501 C306.12501,93.37501 306.75001,94.375 306.25001,94.50001 C305.75001,94.625 304.50001,92.375 304.50001,93.37501 C304.50001,94.375 305.12501,96.12501 305.12501,96.12501 C305.12501,96.12501 305.25,97.625 304.62501,97.875 C304.00001,98.125 304.00001,98.87501 302.37501,99 C300.75001,99.125 300.62501,99.875 299.75,100 C298.875,100.125 298.62501,101.875 297.00001,100.625 C295.375,99.37501 290.87501,97.375 290,97.625 C289.12501,97.875 288.75001,98.25001 287.00001,97.75001 C285.25001,97.25 284.5,98.375 284.125,97.625 C283.75001,96.875 283.62501,98 284,96.25 C284.37501,94.50001 286.00001,93.625 286.00001,93.625 C286.00001,93.625 286.62501,93.25 286.50001,92.625 C286.37501,92 286.50001,91.75001 285.75,91.625 C285,91.5 285.25001,91.125 284.87501,90.12501 C284.5,89.125 284.125,89.25 283.12501,89.5 C282.12501,89.75 281.875,90.875 280.75,89.625 C279.625,88.375 279.125,88.625 279.625,87.87501 C280.125,87.125 280.00001,86.875 281.25,86.625 C282.50001,86.375 282.62501,87.625 283.12501,86.125 C283.62501,84.62501 284.125,84 284.125,84 C284.125,84 283.62501,83.75 282.75001,83.875 C281.875,84 282.12501,85 281.12501,83.00001 C280.125,81 279,81 279,81 C279,81 278.75001,81 279.37501,80 C280.00001,79 280.625,79 281.25,78 C281.875,77.00001 280.75,76.125 281.62501,75.25 C282.50001,74.375 282.75001,75 282.75001,75 L283,75.5 L283,75.5 Z\" id=\"iceland\" data-territory-id=\"13\" class=\"territory\"></path>\n				<path d=\"M275.5137,157.23847 C275.5137,157.23847 275.16016,157.76879 273.74594,157.76879 C272.33172,157.76879 272.15494,157.59201 271.27106,158.12235 C270.38718,158.65267 269.32653,158.82945 268.44264,159.00623 C267.55876,159.183 266.49809,160.24366 266.49809,160.24366 C266.49809,160.24366 266.49809,160.95077 265.26066,161.30432 C264.02321,161.65787 264.2,161.48111 262.96255,161.48111 C261.72513,161.48111 262.07867,160.42044 261.9019,159.71333 C261.9019,159.71333 257.75,160.125 259,159.375 C260.25001,158.625 261.25001,159.125 260.37501,158.5 C259.5,157.87501 258.12501,157.75 259.62501,157.5 C261.125,157.25 261.5,157.5 261.5,157 C261.5,156.5 260.5,157.625 261.5,156 C262.50001,154.375 262.75,154.375 263.37501,153.875 C264.00001,153.375 263.62501,151.87501 264.50001,152.125 C265.375,152.37501 266.37501,152.625 266.37501,152.625 L266.87501,151.625 C266.87501,151.625 263.75,151.5 263.50001,151 C263.50001,151 261.87501,149.875 261.37501,149.875 C260.87501,149.875 259.75001,150 260.12501,149.5 C260.5,149 261.25001,147.50001 261.25001,147.50001 C261.25001,147.50001 259.62501,146.25 260.25001,145.75 C260.87501,145.25001 261,145.375 261,144.5 C261,143.62501 259.875,143.5 261.125,142.25 C262.37501,141 262.625,141.25 263.50001,140.5 C264.375,139.75 264.375,139.625 265,140.25 C265.62501,140.87501 265.62501,141.875 266.75001,140.5 C267.87501,139.125 268.00001,138.375 268.00001,138.375 C268.00001,138.375 267.50001,138.5 269.375,137.5 C271.25001,136.50001 269.75,135.625 272.5,136.00001 C275.25,136.375 274.75,136.50001 275.375,136.375 C276.00001,136.25 276.375,134.625 276.75001,136.00001 C277.12501,137.375 276.25,137.62501 278,138.125 C279.75,138.625 280.50001,138.375 280.00001,139.25001 C279.50001,140.125 279.37501,140 279.87501,140.75 C280.37501,141.50001 280.75,141.875 280.75,142.5 C280.75,143.12501 280.37501,143.62501 279.50001,144 C278.625,144.375 278.75001,143.875 277.62501,145 C276.50001,146.125 275.875,145.87501 275.875,145.87501 C275.875,145.87501 275.62501,145.25001 274.87501,145.75 C274.125,146.25 274.50001,147 273.37501,146.25 C272.25001,145.5 270.875,145.5 270.875,145.5 C270.875,145.5 270.375,145.5 270.50001,146.25 C270.62501,147 271.25001,149.5 271.25001,149.5 C271.25001,149.5 272.37501,151.5 272,152.37501 C271.62501,153.25 269.75,153.75 271.375,153.875 C273,154.00001 272.87501,153.625 272.87501,154.75 C272.87501,155.875 272.87501,156.5 273.87501,156.375 C274.87501,156.25001 275.62501,157.375 275.5137,157.23847 L275.5137,157.23847 Z M287.71129,146.2783 C287.18096,145.65958 287.44613,145.74797 287.26935,145.12925 C287.09257,144.51053 287.35774,144.42215 287.35774,143.80343 C287.35774,143.18471 287.44613,142.91954 287.71129,142.12405 C287.97646,141.32855 286.29708,140.62145 286.29708,140.00273 C286.29708,139.38401 285.23642,138.58851 285.05964,138.23496 C284.88286,137.88141 284.35253,137.43947 283.73382,137.52785 C283.1151,137.61624 283.1151,137.9698 282.40799,138.32335 C281.70088,138.6769 281.70088,138.14657 281.17055,137.70463 C280.64022,137.26269 280.72861,136.73236 280.72861,135.76009 C280.72861,134.78782 280.817,135.22976 281.17055,134.78782 C281.52411,134.34587 281.6125,134.43426 282.14283,133.81554 C282.67316,133.19683 282.40799,133.3736 282.40799,132.75488 C282.40799,132.13616 282.40799,131.60583 282.14283,130.89873 C281.87766,130.19162 281.17055,130.72195 280.90539,130.01484 C280.64022,129.30774 280.55184,129.48451 280.10989,129.21935 C279.66795,128.95418 279.49118,129.13096 278.5189,129.04257 C277.54663,128.95418 278.25374,128.42385 278.16535,128.0703 C278.07696,127.71675 278.07696,127.53997 277.90019,126.5677 C277.72341,125.59543 277.28147,126.30253 276.75114,126.39092 C276.22081,126.47931 276.04403,126.47931 275.86725,125.59543 C275.69048,124.71154 275.86725,125.0651 275.77886,124.62316 C275.69048,124.18121 275.60209,124.18121 274.98337,123.20894 C274.36465,122.23667 275.07176,122.767 275.77886,122.23667 C276.48597,121.70634 276.39758,121.44117 277.0163,120.99923 C277.63502,120.55729 277.0163,120.38051 276.83952,119.67341 C276.66275,118.9663 276.30919,118.78952 276.30919,118.78952 C276.30919,118.78952 275.69048,118.9663 274.62982,118.9663 C273.56916,118.9663 273.65754,118.78952 273.12721,118.08242 C272.59688,117.37531 273.2156,117.37531 274.0111,116.75659 C274.80659,116.13787 274.54143,115.78432 275.33692,114.90044 C276.13242,114.01655 276.57436,114.10494 277.54663,113.92817 C278.5189,113.75139 278.07696,113.22106 278.5189,112.1604 C278.96085,111.09974 279.13762,110.92296 279.40279,110.30424 C279.66795,109.68552 280.19828,108.89003 280.37506,107.74098 C280.55184,106.59193 282,108.5 285,107.5 C288,106.5 288,107.5 288,107.5 C288,107.5 289.5,110 287,111 C284.5,112 286,116 286,116 L286.73902,116.04949 C286.73902,116.04949 287.6229,115.34238 288.33001,115.25399 C289.03712,115.1656 288.94873,115.60754 289.83261,115.60754 C290.7165,115.60754 290.53972,115.07721 291.60038,114.37011 C292.66104,113.663 292.39587,115.1656 292.39587,115.78432 C292.39587,116.40304 293.81009,118.17081 293.81009,118.17081 L293.45653,118.78952 C293.45653,118.78952 292.83782,119.14308 292.83782,120.11535 C292.83782,121.08762 292.57265,120.82246 292.39587,121.2644 C292.2191,121.70634 291.86554,121.70634 291.4236,121.9715 C290.98166,122.23667 291.51199,122.41345 291.68877,123.29733 C291.86554,124.18121 291.60038,123.73927 291.15844,123.82766 C290.7165,123.91605 290.27455,123.91605 289.921,124.53477 C289.56745,125.15349 289.83261,125.24187 289.30228,125.94898 C288.77195,126.65609 288.86034,126.39092 287.71129,126.74448 C286.56224,127.09803 287.09257,127.09803 287.35774,128.42385 C287.6229,129.74968 288.50679,127.98191 290.09778,127.80514 C291.68877,127.62836 291.33521,127.80514 292.39587,127.80514 C293.45653,127.80514 293.01459,127.89352 293.7217,128.42385 C294.42881,128.95418 293.89848,129.21935 294.25203,129.83807 C294.60558,130.45679 294.95914,130.10323 295.40108,130.72195 C295.84302,131.34067 295.40108,131.95939 295.40108,132.84327 L295.40108,133.63877 C295.40108,133.63877 296.46174,136.82075 297.87595,137.61624 C299.29017,138.41174 298.75984,138.41174 299.37855,138.94207 C299.99727,139.4724 301.14632,142.38921 301.49987,142.83116 C301.85343,143.2731 301.85343,143.62665 302.0302,145.21764 C302.20698,146.80863 302.0302,146.45508 301.85343,147.0738 C301.67665,147.69251 301.58826,147.60413 301.3231,148.5764 C301.05793,149.54867 301.3231,149.72545 301.3231,150.079 C301.3231,150.43255 301.85343,150.69772 303.62119,149.81383 C305.38896,148.92995 304.68185,149.19512 305.8309,148.84156 C306.97995,148.48801 306.71479,148.39962 307.77545,148.66479 C308.83611,148.92995 308.65933,149.10673 309.6316,150.079 C310.60387,151.05127 309.98516,151.22805 310.25032,151.93515 C310.51549,152.64226 310.16193,152.55387 309.89677,153.26098 C309.6316,153.96809 309.6316,153.8797 309.18966,154.76358 C308.74772,155.64747 309.01288,155.47069 308.65933,156.00102 C308.30578,156.53135 308.04061,156.26618 306.97995,156.53135 C305.91929,156.79651 306.09607,157.41523 305.56574,157.94556 C305.03541,158.47589 305.21218,158.65267 305.1238,159.09461 C305.03541,159.53655 305.56574,160.33205 305.56574,160.33205 C305.56574,160.33205 306.36123,160.6856 306.80317,161.12754 C307.24512,161.56948 307.06834,161.92304 306.53801,162.80692 C306.00768,163.69081 305.8309,163.24886 304.77024,163.69081 C303.70958,164.13275 303.35603,163.69081 302.29537,163.60242 C301.23471,163.51403 301.3231,163.95597 299.8205,164.4863 C298.31789,165.01663 298.40628,164.57469 297.25723,164.4863 C296.10818,164.39791 296.19657,164.39791 295.04752,164.4863 C293.89848,164.57469 293.98686,164.92824 292.66104,165.72374 C291.33521,166.51923 291.86554,165.72374 291.4236,165.37018 C290.98166,165.01663 290.7165,164.92824 290.09778,164.30952 C289.47906,163.69081 289.47906,163.95597 288.94873,164.13275 C288.4184,164.30952 287.26935,166.34246 286.47385,166.69601 C285.67836,167.04956 285.58997,166.87279 284.44092,166.87279 C283.29187,166.87279 283.64543,166.87279 283.1151,166.96117 C282.58477,167.04956 282.23121,167.93345 281.52411,168.72894 C280.817,169.52444 280.99378,168.99411 279.66795,169.17088 C278.34213,169.34766 278.43052,169.08249 278.25374,168.72894 C278.07696,168.37539 278.43052,168.37539 278.87246,167.75667 C279.3144,167.13795 280.10989,165.9889 280.64022,165.10502 C281.17055,164.22114 281.43572,164.66308 282.76154,163.86758 C284.08737,163.07209 283.02671,163.51403 283.64543,162.1882 C284.26415,160.86238 284.35253,160.86238 285.67836,160.42044 C285.67836,160.42044 286.25,159.25 285.125,158.625 C284,158 283.5,158.25 282.375,157.75 C281.25,157.25 280.375,157.5 280.625,156.8125 C281.75,155.5 282,154.875 282.375,154.25 C282.75,153.625 282.5,153 283,153 C283.5,153 283.75,153.25 284.375,152.875 C285,152.5 285.125,152.25 285.125,151.5 C285.125,150.75 285,150.5 285.25,149.75 C285.5,149 286.25,148.375 285.625,147.875 C285,147.375 285.5,147.5 284.75,147.25 C284,147 283.5,146.5 283.5,146.5 L283.75,145.5 L283.9375,143.75 C283.9375,143.75 284.125,143.875 285.375,144.375 C286.625,144.875 287.375,146.5 287.375,146.5 C287.64075,146.97231 288.0265,146.95957 287.71129,146.2783 L287.71129,146.2783 Z\" id=\"great_britain\" data-territory-id=\"16\" class=\"territory\"></path>\n				<path d=\"M388.125,100 C387.5,99.875 386.625,99.5 386.25,98.75 C385.875,98 385,97.125 384.375,97.375 C383.75,97.625 384,97.75 382.75,97.75 C381.5,97.75 380.875,96 379.875,96.625 C378.875,97.25 379.625,97.625 378.375,97.875 C377.125,98.125 375.75,98.25 374.5,98.25 C373.25,98.25 373.5,98 372.125,98.25 C370.75,98.5 369.75,99.25 369.25,98 C368.75,96.75 368.625,97.125 368.625,95.875 C368.625,94.625 369.375,93.75 369.625,92.625 C369.875,91.5 369.125,90.375 370,89.25 C370.875,88.125 371.5,87.875 371.875,87.25 C372.25,86.625 372.625,85.875 372.75,85 C372.875,84.125 372.875,84.375 372.875,83.5 C372.875,82.625 372.5,81.875 372,81.5 C371.5,81.125 371.625,81.125 370.5,81 C369.375,80.875 369.75,80.125 368.625,81.375 C367.5,82.625 366.5,82.75 366.375,83.75 C366.25,84.75 366.875,85.125 366.25,86.375 C365.625,87.625 365.5,87.5 365.25,88 C365,88.5 365.5,89.25 365,89.75 C364.5,90.25 364.125,90.25 363.25,90.75 C362.375,91.25 361.75,90.875 361.625,92.375 C361.5,93.875 361.25,93.5 361.625,94.5 C362,95.5 362.25,95.625 362.5,96.375 C362.75,97.125 363.25,97.5 363.25,99 C363.25,100.5 363.625,101 363.625,101 C363.625,101 364.125,102.75 364,103.625 C363.875,104.5 363.5,106 363.125,106.875 C362.75,107.75 362.375,108.25 361.75,108.875 C361.125,109.5 361.375,109.625 360.625,110.375 C359.875,111.125 359,111.375 358.375,111.75 C357.75,112.125 357.625,113.375 357.625,113.375 L357.625,115.75 C357.625,115.75 358.25,117.375 357.125,117.875 C356,118.375 355.75,118.5 355,119.625 C354.25,120.75 355,121.625 354.125,122.375 C353.25,123.125 353.5,123.25 352,123.125 C350.5,123 350.25,123 349.75,122.375 C349.25,121.75 348.625,120.625 347.875,120.5 C347.125,120.375 347.25,120.625 346.75,120.375 C346.25,120.125 346.625,119.625 345.875,119.625 C345.125,119.625 344.75,120.125 344.75,119.625 L344.75,118.25 L344.75,113.625 L342.875,110.75 L343.5,109.125 L342.75,107.875 L341.875,107.375 C341.875,107.375 340.5,107.875 340.375,108.375 C340.25,108.875 340.25,109.25 340,109.75 C339.75,110.25 338.625,111.75 337.75,111.875 C336.875,112 335.75,112.125 335.75,112.125 C335.75,112.125 335.375,113.125 334.625,112.75 C333.875,112.375 334.125,112.5 333.25,111.5 C332.375,110.5 332.125,109.375 332.125,108.875 C332.125,108.375 332.375,108.25 331.75,107.75 C331.125,107.25 331.125,107.25 330.5,106.625 C329.875,106 329,105.5 329.125,104.375 C329.25,103.25 329.5,102.125 329.75,101 C330,99.875 329.375,98.75 329.375,98.75 L328.90026,97.84149 C328.36993,96.78083 328.90026,96.9576 328.01638,96.07372 C327.13249,95.18984 326.42539,94.83628 326.95572,93.42207 C327.48605,92.00786 326.60216,91.12397 328.01638,90.77042 C329.43059,90.41687 329.25381,92.36141 329.60737,89.88653 C329.96092,87.41166 328.90026,88.11877 330.31448,86.52778 C331.72869,84.93679 331.90547,84.58323 331.90547,84.58323 C331.90547,84.58323 332.78935,84.58323 333.1429,85.82067 C333.49646,87.05811 333.49646,88.11877 334.20356,87.23488 C334.91067,86.351 335.08745,85.29034 335.61778,84.58323 C336.14811,83.87613 337.03199,82.99224 337.03199,82.99224 C337.03199,82.99224 335.441,80.34059 337.38554,80.51737 C339.33009,80.69415 339.33009,81.0477 339.86042,80.34059 C340.39075,79.63349 340.21397,79.63349 341.45141,79.27993 C342.68884,78.92638 342.86562,79.10316 343.0424,78.0425 C343.21917,76.98184 343.7495,76.98184 344.45661,76.27473 C345.16372,75.56762 345.16372,75.21407 345.34049,73.79986 C345.51727,72.38564 345.16372,72.56242 346.75471,70.4411 C348.3457,68.31978 348.3457,68.49655 348.87603,67.08234 C349.40636,65.66813 349.40636,65.8449 349.93669,64.96102 C350.46702,64.07714 351.17413,64.43069 351.70446,63.72358 C352.23479,63.01648 352.41156,62.13259 352.41156,62.13259 L353.29545,60.5416 C353.29545,60.5416 351.52768,59.8345 353.11867,59.12739 C354.70966,58.42028 354.88644,58.24351 356.12387,57.88995 C357.36131,57.5364 358.24519,57.5364 358.24519,57.5364 C358.24519,57.5364 359.39424,59.21578 359.57102,57.97834 C359.7478,56.7409 359.04069,56.56413 360.10135,55.76863 C361.16201,54.97314 361.78073,55.06153 362.13428,55.32669 C362.48783,55.59186 362.31106,55.85702 363.10655,55.68024 C363.90205,55.50347 364.78593,56.56413 365.0511,55.32669 C365.31626,54.08925 363.90205,53.11698 365.58143,52.40988 C367.2608,51.70277 368.14469,52.32149 368.67502,51.79116 C369.20535,51.26083 368.40985,50.99566 369.47051,50.46533 C370.53117,49.935 370.88473,50.20017 371.94539,49.84661 C373.00605,49.49306 373.09444,48.34401 373.62477,48.25562 C374.1551,48.16723 374.8622,48.25562 375.39253,48.78595 C375.92286,49.31628 374.42026,49.75822 376.54158,49.40467 C378.6629,49.05112 381.49133,47.72529 382.28682,48.34401 C383.08232,48.96273 382.37521,50.02339 383.43587,50.02339 C384.49653,50.02339 385.55719,49.58145 386.08752,49.935 C386.61785,50.28855 386.52946,50.55372 387.32496,50.90727 C387.32496,50.90727 388.25,54.875 387.625,55.375 C387,55.875 388.375,59 387.625,59.5 C386.875,60 386.5,65.75 386.5,68.375 C386.5,71 387.875,75.125 387.5,77.25 C387.125,79.375 388.125,82.375 388.125,82.375 C388.125,82.375 388.75,83 388.75,84.625 C388.75,86.25 389.625,87.125 389.625,87.125 C389.625,87.125 390.0625,87.25 390.125,87.8125 C390.1875,88.375 390.1875,89.25 389.9375,89.5 C389.6875,89.75 389.125,90.1875 389.125,91.125 C389.125,92.0625 389.375,92.4375 389.0625,92.875 C388.75,93.3125 388.5,93.4375 388.375,94.5 C388.25,95.5625 388.0625,97 388.3125,97.5625 C388.5625,98.125 389,100.25 388.125,100 L388.125,100 Z\" id=\"scandinavia\" data-territory-id=\"14\" class=\"territory\"></path>\n				<path d=\"M638.43626,198.25065 C638.43626,197.01321 638.96659,193.83123 638.25948,193.65446 C637.55237,193.47768 637.55237,192.94735 636.31494,193.12413 C635.0775,193.3009 633.66328,192.5938 633.66328,192.5938 C633.66328,192.5938 633.30973,191.35636 635.43105,190.11892 C637.55237,188.88148 638.78981,188.17438 638.78981,188.17438 L637.72915,187.46727 C637.72915,187.46727 635.43105,187.29049 636.49171,186.58339 C637.55237,185.87628 637.72915,184.9924 638.61303,183.93174 C639.49692,182.87108 641.61824,177.391 642.85567,175.26968 C644.09311,173.14836 646.92154,173.85547 646.92154,173.85547 L648.86608,168.90572 C648.86608,168.90572 647.27509,165.19341 649.92674,163.95597 C652.57839,162.71853 652.75517,164.13275 653.46227,161.12754 C654.16938,158.12234 656.2907,158.65267 656.64426,157.59201 C656.99781,156.53135 657.35136,156.53135 656.82103,154.76358 C656.2907,152.99582 654.87649,151.40483 654.87649,151.40483 C654.87649,151.40483 654.16938,148.75317 654.16938,147.33896 C654.16938,145.92475 653.81583,143.62665 655.05326,143.09632 C656.2907,142.56599 653.9926,139.73756 653.9926,139.73756 C653.9926,139.73756 654.69971,138.6769 653.81583,137.9698 C652.93194,137.26269 652.40161,136.37881 652.40161,135.49492 C652.40161,134.61104 652.57839,132.31294 652.57839,132.31294 C652.57839,132.31294 653.46227,130.89873 654.16938,130.72195 C654.87649,130.54517 655.58359,130.89873 655.58359,129.13096 C655.58359,127.36319 654.69971,124.71154 654.69971,124.71154 C654.69971,124.71154 650.9874,119.23147 650.28029,118.87791 C649.57319,118.52436 649.57319,118.17081 650.10352,117.11015 C650.63385,116.04949 654.16938,121.35279 656.64426,121.70634 C659.11913,122.05989 661.41723,121.70634 661.41723,121.70634 L663.71532,120.64568 L668.31152,120.82246 C668.31152,120.82246 670.25606,120.99923 670.60961,122.94378 C670.96317,124.88832 673.43804,124.18121 672.2006,125.94898 C670.96317,127.71675 671.13994,128.60063 669.90251,128.42385 C668.66507,128.24708 668.84185,127.36319 667.95796,127.53997 C667.07408,127.71675 666.36697,127.53997 666.36697,129.48451 C666.36697,131.42906 667.78119,131.60584 666.54375,133.19683 C665.30631,134.78782 665.83664,135.49492 664.06888,135.49492 C662.30111,135.49492 660.71012,135.31815 658.94235,135.6717 C657.17459,136.02525 656.2907,134.78782 656.2907,136.37881 C656.2907,137.9698 656.2907,138.32335 657.17459,138.50013 C658.05847,138.6769 658.76558,138.50013 658.41202,139.56079 C658.05847,140.62145 656.99781,141.32855 657.70492,141.68211 C658.41202,142.03566 659.29591,141.15178 659.29591,142.03566 L662.30111,142.21244 L662.83144,143.9802 C662.83144,143.9802 663.18499,143.9802 664.24565,144.15698 C665.30631,144.33376 666.01342,143.44987 666.36697,144.68731 C666.72053,145.92475 667.25086,146.45508 667.25086,146.45508 C667.25086,146.45508 667.78119,146.45508 667.95796,147.69251 C668.13474,148.92995 668.31152,149.2835 668.31152,150.16739 C668.31152,151.05127 667.42763,153.8797 667.42763,153.8797 C667.42763,153.8797 666.72053,154.58681 666.8973,156.00102 C667.07408,157.41523 667.78119,156.00102 667.95796,157.76879 C668.13474,159.53655 668.13474,160.06688 668.13474,161.30432 C668.13474,162.54176 667.95796,162.36498 669.01862,163.24886 C670.07928,164.13275 670.43284,165.01663 670.43284,165.01663 C670.43284,165.01663 671.31672,165.54696 671.31672,166.7844 L671.31672,169.08249 C671.31672,169.08249 670.78639,169.25927 670.07928,169.25927 C669.37218,169.25927 668.48829,169.08249 668.48829,169.08249 C668.48829,169.08249 668.31152,169.61282 667.95796,170.85026 C667.60441,172.0877 666.01342,172.79481 666.01342,172.79481 C666.01342,172.79481 666.01342,174.56257 665.30631,174.73935 C664.59921,174.91613 664.06888,174.91613 663.36177,175.0929 C662.65466,175.26968 662.12433,175.0929 661.77078,175.97679 C661.41723,176.86067 661.77078,177.03745 660.8869,177.21422 C660.00301,177.391 659.11913,175.80001 658.94235,178.09811 C658.76558,180.3962 660.17979,181.28009 658.41202,181.81042 C656.64426,182.34075 655.58359,182.6943 655.58359,182.6943 C655.58359,182.6943 655.93715,184.10851 654.69971,183.75496 C653.46227,183.40141 652.04806,182.16397 652.04806,181.28009 C652.04806,180.3962 651.87128,179.86587 651.87128,179.86587 L649.39641,181.45686 C649.39641,181.45686 649.74996,182.34075 647.9822,182.34075 C646.21443,182.34075 645.50732,180.3962 645.86088,182.34075 C646.21443,184.28529 646.92154,185.6995 647.09831,186.40661 C647.27509,187.11372 648.33575,186.58339 648.15897,187.64405 C647.9822,188.70471 648.33575,188.70471 647.62864,189.41181 C646.92154,190.11892 645.50732,190.2957 644.80022,190.2957 C644.09311,190.2957 643.91633,190.11892 642.50212,190.2957 C641.08791,190.47247 640.375,197.125 640.375,197.125 L639.125,198.25 L638.43626,198.25065 L638.43626,198.25065 Z\" id=\"japan\" data-territory-id=\"32\" class=\"territory\"></path>\n				<path d=\"M619.125,33.375 C618.625,32.25 619.875,32.125 618,31.125 C616.125,30.125 615.375,30.375 614.25,30 C613.125,29.625 613.375,29.375 613.875,28 C614.375,26.625 616,26.5 613.75,26 C611.5,25.5 611.625,24.625 610,24.625 C608.375,24.625 608.75,24.625 607.875,25 C607,25.375 606.875,25.375 606.5,25.875 C606.125,26.375 606.875,27 606,26.75 C605.125,26.5 605.625,26.875 604.75,25.875 C603.875,24.875 604.125,24.5 603,24.625 C601.875,24.75 602.75,24.5 601.125,24.875 C599.5,25.25 599,25.25 597.875,25.375 C596.75,25.5 594.875,27 594.875,27 C594.875,27 595,27.25 593.625,27.375 C592.25,27.5 593.125,26.75 591.25,28.125 C589.375,29.5 590.25,29.625 588.75,29.5 C587.25,29.375 588,28.5 586.375,29.25 C584.75,30 584.625,29.625 584.625,30.625 C584.625,31.625 583.625,32.25 583.625,32.25 C583.625,32.25 583.625,31.875 583.25,30.625 C582.875,29.375 582.375,29.875 582.5,28.625 C582.625,27.375 577.25,26.625 576.5,24.875 C575.75,23.125 575.875,23.375 575.625,21.75 C575.375,20.125 572.375,19.375 571.875,19.5 C571.375,19.625 570,21.125 569.375,21.875 C568.75,22.625 568.5,23.25 567.5,24 C566.63654,24.8506 565.83066,25.3739 565.0625,25.9375 L565.375,28.5 C565.375,29 565.25,30.5 566.375,31.625 C567.5,32.75 567.875,32.25 568.375,32.75 C568.875,33.25 568.25,36.5 568.125,37.25 C568,38 567.5,38 567,38.875 C566.5,39.75 566.875,40.25 566.5,41.75 C566.125,43.25 565.625,42.625 565.25,44.125 C564.875,45.625 565.25,45.5 565.75,46.5 C566.25,47.5 566.25,48.375 566.25,49.875 C566.25,51.375 566,50.5 565.375,50.625 C564.75,50.75 564.125,51.25 562.875,51.375 C561.625,51.5 560.25,52 559.625,51.25 C559,50.5 558.375,50.375 556.125,50.625 C553.875,50.875 555.5,51.625 555.25,52.625 C555,53.625 554.25,53.5 552.75,53.75 C551.25,54 551.75,54.125 551.625,55.75 C551.5,57.375 553.375,58.375 554.375,58.75 C555.375,59.125 555.625,59.375 556,60 C556.375,60.625 557.5,60.375 559,61.75 C560.5,63.125 559.25,63.375 558.25,64.375 C557.25,65.375 558.875,68.875 559.625,69.375 C560.375,69.875 560.75,70.625 561.125,73.625 C561.5,76.625 562.625,76.875 562.625,76.875 C562.625,76.875 563.5,77.375 563.625,80.5 C563.75,83.625 564.5,86.25 564.5,86.25 C564.5,86.25 569.375,84.75 570.625,84 C571.875,83.25 571.75,83.125 572.125,81.375 C572.5,79.625 572.625,76.75 574,76.5 C575.375,76.25 575.125,78.25 575.125,78.25 C575.25,79 576.625,78.75 578.125,79 C579.183,79.17633 578.74851,78.2333 578.53218,77.31133 C578.4418,76.92616 578.3895,76.54467 578.5,76.25 C578.875,75.25 590.79494,76.36312 590.79494,76.36312 C591.23688,75.30246 592.03237,74.59535 593.3582,73.35791 C594.68402,72.12048 593.62336,69.91077 593.71175,69.46883 C593.80014,69.02689 595.47952,67.61267 596.27501,64.60747 C597.07051,61.60226 598.04278,63.81197 598.04278,63.81197 C598.04278,63.81197 600.07571,62.04421 600.78282,60.80677 C601.48993,59.56933 605.37901,59.74611 605.82095,59.92289 C606.2629,60.09966 605.99773,61.86743 606.61645,63.10487 C607.23517,64.3423 606.88161,63.6352 607.94228,63.54681 C609.00294,63.45842 609.71004,63.10487 610.68231,63.10487 C611.65459,63.10487 611.21264,64.51908 611.65459,64.69586 C612.09653,64.87263 613.68752,64.69586 614.12946,64.60747 C614.5714,64.51908 615.54367,63.81197 616.16239,63.28164 C616.78111,62.75131 616.33917,60.98355 616.42756,60.18805 C616.51594,59.39256 617.39983,59.12739 617.66499,58.50867 C617.93016,57.88995 617.66499,56.21057 617.5766,55.41508 C617.48822,54.61958 616.8695,53.64731 616.25078,53.47054 C615.63206,53.29376 613.15719,53.11698 612.18492,53.02859 C611.21264,52.94021 611.21264,48.25562 611.65459,45.25042 C612.09653,42.24522 611.83136,42.95232 612.2733,42.42199 C612.71525,41.89166 614.21785,41.6265 614.74818,41.6265 C615.27851,41.6265 615.98561,40.47745 616.074,39.59357 C616.16239,38.70968 616.8695,38.88646 617.22305,38.00258 C617.5766,37.11869 618.72565,37.56063 619.96309,37.38386 C621.20053,37.20708 620.40503,35.88125 620.40503,34.46704 L619.125,33.375 L619.125,33.375 Z\" id=\"yakutsk\" data-territory-id=\"28\" class=\"territory\"></path>\n				<path d=\"M627.375,152.5 C628.375,151.75 628.125,152.625 629,150.75 C629.875,148.875 629.625,148.25 630.25,147.625 C630.875,147 632.25,144.75 632.125,143.125 C632,141.5 631.5,141.625 631.875,140.125 C632.25,138.625 632.375,138.625 632.625,136.625 C632.875,134.625 632.375,134.875 633,132.5 C633.625,130.125 633.75,129.625 633.375,128.75 C633,127.875 632.75,126.875 632.75,125.375 C632.75,123.875 632.875,122.625 632.75,122.125 C632.625,121.625 632.5,121.125 632.125,119.75 C631.75,118.375 630.75,117.375 630.75,117.375 C630.75,117.375 630.5,118.375 630,116.75 C629.5,115.125 629.625,115.625 629.375,114.625 C629.125,113.625 628.375,115.125 628.75,111.75 C629.125,108.375 629,107.25 629,107.25 C629,107.25 628.875,103.875 626.625,103.875 C624.375,103.875 623.625,104.5 623.375,102.625 C623.125,100.75 622.125,100.375 620.625,100.125 C619.125,99.875 618.875,100.125 618.125,99.75 C617.375,99.375 617.75,99.125 616.5,99.125 C615.25,99.125 616,99.625 614.25,99.125 C612.5,98.625 612.5,99.875 612.25,98.625 C612,97.375 612.125,96.5 613.875,93.75 C615.625,91 615.5,90.375 615.75,89 C616,87.625 614.5,88.25 616.75,86.25 C619,84.25 618.375,83.625 621,83.625 C623.625,83.625 624,83.625 625.875,82.75 C627.75,81.875 626.25,80.875 628.5,81.875 C630.75,82.875 630.5,83.875 631.75,82.75 C633,81.625 633.375,80.875 634,80.875 C634.625,80.875 637,82.25 637,82.25 C637,82.25 638,82.75 638.875,82.5 C639.75,82.25 640.5,84.125 641.375,82.375 C642.25,80.625 641.875,80.125 641,79.625 C640.125,79.125 639.125,81.375 639.625,78.375 C640.125,75.375 640.625,74.25 640.25,73.25 C639.875,72.25 637.25,68.75 640.375,70.875 C643.5,73 642.75,73.375 643.875,74 C645,74.625 644.5,74.625 644.875,77 C645.25,79.375 649,78.875 648.5,81.875 C648,84.875 648,85.75 647.75,87 C647.5,88.25 646.125,87.375 646.5,92.5 C646.875,97.625 647.25,106.75 651.75,110.75 C656.25,114.75 657.375,115.25 658,113.5 C658.625,111.75 659.25,111 658.875,109 C658.5,107 657.5,106.25 658.25,104.875 C659,103.5 659.625,102.625 659.75,101.5 C659.875,100.375 660.125,99.5 660,98.25 C659.875,97 660,95.5 659.75,94.5 C659.5,93.5 659.25,91.875 659.125,90.875 C659,89.875 658,88.125 657.625,87.25 C657.25,86.375 656.125,84.625 655.875,83.375 C655.625,82.125 655.125,81.625 656.375,79.875 C657.625,78.125 655.25,77.125 658.125,77.5 C661,77.875 660.875,78.25 662.375,78 C663.875,77.75 665.375,78.625 665.875,76.875 C666.375,75.125 666,75.375 666.875,74.125 C667.75,72.875 668.125,73.125 669.125,71.625 C670.125,70.125 668.625,69.625 671.125,67.625 C673.625,65.625 675.125,64.875 675.75,64.125 C676.375,63.375 677.625,63 676.625,62 C675.625,61 675.5,60.125 674.125,59.25 C672.75,58.375 672,57.75 671.375,57.625 C670.75,57.5 669.875,57.25 670.5,56.75 C671.125,56.25 672.125,55.375 673.125,55.375 C674.125,55.375 674.125,56.375 675.625,55.625 C677.125,54.875 677.75,54.375 678.75,55.125 C679.75,55.875 679.125,55.25 679.875,56.75 C680.625,58.25 679.125,57.75 681.125,58.875 C683.125,60 685,60.25 685.625,60.25 C686.25,60.25 685.875,61 687.375,60.125 C688.875,59.25 688.625,59.625 689.625,58.25 C690.625,56.875 691.25,56.625 690.875,54.875 C690.5,53.125 689.875,52 689.875,51.5 L688.75,49.625 C688.75,49.625 688.75,48.75 687,48.75 C685.25,48.75 684.25,48.875 684.25,48.25 C684.25,47.625 684.75,46.5 683.625,46.5 C682.5,46.5 681.875,45.5 681.125,46.375 C680.375,47.25 679.875,48.25 679,47.75 C678.125,47.25 677.125,46 677.125,46 C677.125,46 677.375,44.75 677,44.25 C676.625,43.75 675.5,42.625 675.5,42.625 L673.875,41.875 C673.875,41.875 670.5,38.5 669.25,38.375 C668,38.25 666.875,38.5 666.5,37.5 C666.125,36.5 668.25,36.5 665.125,36 C662,35.5 661.875,36 660.875,34.625 C659.875,33.25 661.25,32.875 658.75,32.75 C656.25,32.625 655.125,33 653,32.125 C650.875,31.25 650.875,30.375 649.875,31.375 C648.875,32.375 649.375,32.5 648,33.625 C646.625,34.75 647.375,35.75 645.25,35.75 C643.125,35.75 643.5,36 642.25,35.5 C641,35 641.25,34.625 639.75,34.5 C638.25,34.375 638.625,34.5 637.125,34.625 C635.625,34.75 636.875,35.625 634.5,34.5 C632.125,33.375 632.125,33.125 630.375,32.25 C628.625,31.375 628.125,31.125 627.25,31.125 C626.375,31.125 622.75,30.75 621.75,31.625 C621.75,31.625 620.40503,33.05283 620.40503,34.46704 C620.40503,35.88125 621.20053,37.20708 619.96309,37.38386 C619.3812,37.46699 618.81886,37.4133 618.34959,37.42499 C617.82091,37.43817 617.41035,37.53433 617.22305,38.00258 C616.8695,38.88646 616.16239,38.70968 616.074,39.59357 C615.98561,40.47745 615.27851,41.6265 614.74818,41.6265 C614.21785,41.6265 612.71525,41.89166 612.2733,42.42199 C611.83136,42.95232 612.09653,42.24522 611.65459,45.25042 C611.21264,48.25562 611.21264,52.94021 612.18492,53.02859 C613.15719,53.11698 615.63206,53.29376 616.25078,53.47054 C616.8695,53.64731 617.48822,54.61958 617.5766,55.41508 C617.66499,56.21057 617.93016,57.88995 617.66499,58.50867 C617.39983,59.12739 616.51594,59.39256 616.42756,60.18805 C616.33917,60.98355 616.78111,62.75131 616.16239,63.28164 C615.54367,63.81197 614.5714,64.51908 614.12946,64.60747 C613.68752,64.69586 612.09653,64.87263 611.65459,64.69586 C611.21264,64.51908 611.65459,63.10487 610.68231,63.10487 C609.71004,63.10487 609.00294,63.45842 607.94228,63.54681 C606.88161,63.6352 607.23517,64.3423 606.61645,63.10487 C605.99773,61.86743 606.2629,60.09966 605.82095,59.92289 C605.37901,59.74611 601.48993,59.56933 600.78282,60.80677 C600.07571,62.04421 598.04278,63.81197 598.04278,63.81197 C598.04278,63.81197 597.07051,61.60226 596.27501,64.60747 C595.47952,67.61267 593.80014,69.02689 593.71175,69.46883 C593.62336,69.91077 594.68402,72.12048 593.3582,73.35791 C592.03237,74.59535 591.23688,75.30246 590.79494,76.36312 C590.35299,77.42378 590.44138,78.83799 590.70655,79.27993 C590.97171,79.72188 592.12076,82.19675 591.76721,84.22968 C591.41365,86.26261 590.88332,92.36141 591.14849,93.51046 C591.41365,94.65951 591.50204,97.48793 592.29754,98.28343 C593.09303,99.07892 593.44659,99.69764 593.80014,100.40475 C594.15369,101.11186 597.77762,102.2609 598.39633,103.76351 C599.01505,105.26611 598.6615,105.61966 599.72216,106.23838 C600.78282,106.8571 601.75509,108.18292 601.84348,109.42036 C601.93187,110.6578 601.93187,112.51395 602.81575,112.24879 C603.69963,111.98362 604.67191,110.74619 605.02546,110.39263 C605.37901,110.03908 606.70484,109.59714 607.85389,110.03908 C609.00294,110.48102 609.2681,110.48102 610.41715,110.30424 C611.5662,110.12747 612.62686,110.48102 612.62686,110.48102 C612.62686,110.48102 613.51074,111.80685 613.59913,112.51395 C613.68752,113.22106 613.15719,113.75139 614.74818,113.663 C616.33917,113.57461 616.69272,113.48622 616.8695,115.25399 C617.04627,117.02176 618.01855,117.99403 618.01855,117.99403 C618.01855,117.99403 618.28371,119.85019 618.19532,120.29213 C618.10694,120.73407 617.48822,121.79473 617.75338,122.94378 C618.01855,124.09283 618.63727,125.24187 618.10694,126.03737 C617.5766,126.83286 616.69272,128.60063 616.69272,129.30774 C616.69272,130.01485 616.51594,131.871 616.69272,132.48972 C616.8695,133.10844 616.16239,132.6665 616.42756,134.61104 C616.69272,136.55558 616.8695,136.90914 616.8695,137.61624 C616.8695,138.32335 612.98041,138.14657 614.74818,140.26789 C616.51594,142.38921 616.8695,144.95248 618.81404,144.86409 C620.75859,144.7757 621.64247,147.60413 621.90763,148.5764 C622.1728,149.54867 622.96829,150.25578 624.20573,150.34417 C625.44317,150.43255 625.61994,152.28871 626.59222,152.46549 C627.56449,152.64226 627.56449,152.55387 627.375,152.5 L627.375,152.5 Z\" id=\"kamchatka\" data-territory-id=\"29\" class=\"territory\"></path>\n				<path d=\"M492.875,56.625 C493.5,58.375 494,57.375 495.125,56.625 C496.25,55.875 495.375,56 495.5,54.5 C495.625,53 495.125,53.25 494.5,52.5 C493.875,51.75 494.125,52.375 492.5,52.375 C490.875,52.375 491.375,52.625 490.25,52.75 C489.125,52.875 489.5,52.75 487.625,52.375 C485.75,52 486.5,51 486.5,50.25 C486.5,49.5 486,48.125 486,48.125 C486,48.125 485,47.75 484.5,46.75 C484,45.75 484.5,45.625 484.625,45.125 C484.75,44.625 484.875,44 484.75,42.5 C484.625,41 484.25,42 483.75,41.25 C483.25,40.5 483.75,40 483.75,40 L484.75,39 L486.5,39.625 L487.625,40 L489.875,40.75 C489.875,40.75 490,41 492,43.25 C494,45.5 493,43.5 494.5,43.625 C496,43.75 495.625,43 495.625,43 C495.625,43 493.625,42 493.625,41.5 C493.625,41 494.125,40.25 494.125,39.625 C494.125,39 494,37.625 493.75,37.125 C493.5,36.625 492.75,36.25 492.25,35.75 C491.75,35.25 491,33.875 491,33.875 C491,33.875 490.625,33.125 491.5,30.625 C492.375,28.125 492.625,31.5 492.625,31.5 L493.375,31.875 L494.875,33.125 C494.875,33.125 496.125,32.875 496.875,32.625 C497.625,32.375 498.75,34.375 498.75,34.375 C498.75,34.375 501,34.625 501.5,34.625 C502,34.625 503,33.25 503,32.25 C503,31.25 501,32.125 501,32.125 L498,31.5 C498,31.5 494.125,30.375 493.375,29.375 C492.625,28.375 493.5,27.875 493.5,27.875 L495.5,25.375 C495.5,25.375 496.875,24 497.5,24 L500.75,24 C500.75,24 501.625,21.875 501.75,20.25 C501.875,18.625 504,19.75 504,19.75 C504,19.75 505.625,19.25 506,18.75 C506.375,18.25 508.5,16.75 511.875,14.75 C515.25,12.75 515.25,13.625 516.75,13.5 C518.25,13.375 519.625,13.375 520.125,13.125 C520.625,12.875 522.25,11.75 522.75,11.5 C523.25,11.25 525.75,10 525.75,10.625 C525.75,11.25 526,12.625 526.25,13.125 C526.5,13.625 527.875,12.5 529.5,11.25 C531.125,10 530.625,10.25 531.375,9.125 C532.125,8 532.875,8.75 534,8.875 C535.125,9 534.75,10.75 534.875,11.5 C535,12.25 536.875,13.625 538,14.375 C539.125,15.125 542.25,10.625 542.75,13 C543.25,15.375 546,16.25 546,17 C546,17.75 544.75,19.25 543.875,20 C543,20.75 542.25,21.625 541.75,22.75 C541.25,23.875 541.75,23.5 541.75,24.5 C541.75,25.5 541,24.75 539.875,25.5 C538.75,26.25 538.75,26.5 537.875,27.5 C537,28.5 536.5,28 535.625,28.375 C534.75,28.75 535,29.875 534.75,30.75 C534.5,31.625 535.25,31.5 535.25,31.5 C535.25,31.5 536.5,30.625 537.125,30.25 C537.75,29.875 540.125,28.625 540.75,28.25 C541.375,27.875 543,26.5 544.375,25 C545.75,23.5 547.625,24.25 548.625,24 C549.625,23.75 550.25,24.375 550.25,24.375 C550.25,24.375 551.5,24.5 552.625,23.875 C553.75,23.25 556.625,22.625 557.25,22.625 C557.875,22.625 559.5,22.875 560.375,23.625 C561.25,24.375 562.75,25.375 563.625,26 L565.0625,25.9375 L565.375,28.5 C565.375,29 565.25,30.5 566.375,31.625 C567.5,32.75 567.875,32.25 568.375,32.75 C568.875,33.25 568.25,36.5 568.125,37.25 C568,38 567.5,38 567,38.875 C566.5,39.75 566.875,40.25 566.5,41.75 C566.125,43.25 565.625,42.625 565.25,44.125 C564.875,45.625 565.25,45.5 565.75,46.5 C566.25,47.5 566.25,48.375 566.25,49.875 C566.25,51.375 566,50.5 565.375,50.625 C564.75,50.75 564.125,51.25 562.875,51.375 C561.625,51.5 560.25,52 559.625,51.25 C559,50.5 558.375,50.375 556.125,50.625 C553.875,50.875 555.5,51.625 555.25,52.625 C555,53.625 554.25,53.5 552.75,53.75 C551.25,54 551.75,54.125 551.625,55.75 C551.5,57.375 553.375,58.375 554.375,58.75 C555.375,59.125 555.625,59.375 556,60 C556.375,60.625 557.5,60.375 559,61.75 C560.5,63.125 559.25,63.375 558.25,64.375 C557.25,65.375 558.875,68.875 559.625,69.375 C560.375,69.875 560.75,70.625 561.125,73.625 C561.5,76.625 562.625,76.875 562.625,76.875 C562.625,76.875 563.5,77.375 563.625,80.5 C563.75,83.625 564.5,86.25 564.5,86.25 C564.5,86.25 560.37782,93.90628 561.60757,97.2881 C562.83732,100.66991 564.37451,106.81867 562.52988,108.97073 C560.68525,111.1228 559.76294,111.1228 559.14806,109.89305 C558.53319,108.66329 559.4555,108.35586 557.30344,108.04842 C555.15137,107.74098 555.45881,108.66329 553.92162,108.97073 C552.38443,109.27817 551.76956,110.81536 550.53981,109.58561 C549.31006,108.35586 550.53981,108.04842 548.69518,108.66329 C546.85055,109.27817 547.77287,111.43023 545.46709,111.89139 C543.1613,112.35255 543.46874,111.58395 542.54643,113.12114 C541.62411,114.65833 541.16296,115.11949 540.85552,115.88808 C540.54808,116.65668 539.93321,116.50296 540.54808,117.88643 C541.16296,119.2699 542.70015,117.27155 542.54643,120.03849 C542.39271,122.80543 542.08527,124.49634 542.08527,124.49634 C542.08527,124.49634 541.00924,123.72774 541.00924,125.57237 C541.00924,127.417 541.77783,127.26328 541.47039,128.80047 C541.16296,130.33765 540.39436,129.41534 540.85552,131.25997 C541.31668,133.10459 542.54643,133.10459 542.54643,133.10459 C542.54643,133.10459 542.85386,131.25997 543.46874,132.79716 C544.08362,134.33434 543.31502,135.25666 544.39105,135.71781 C545.46709,136.17897 544.39105,136.02525 546.08196,136.64013 C546.08196,136.64013 546.7737,136.64013 547.08113,137.56244 C547.38857,138.48475 548.23403,139.94508 547.38857,141.09797 C546.54312,142.25087 545.85138,144.40293 546.7737,146.47814 C547.69601,148.55334 549.31006,148.78392 549.15634,150.01367 C549.00262,151.24342 548.77204,150.93598 548.61832,152.62689 C548.4646,154.3178 548.77204,155.39383 548.38774,156.08556 C548.00345,156.7773 547.77287,157.93019 547.23485,158.16077 C546.69684,158.39135 545.85138,157.85333 545.31337,157.54589 C544.77535,157.23846 545.15965,155.54755 544.23733,156.23928 C543.31502,156.93102 543.1613,157.85333 542.39271,157.39217 C541.62411,156.93102 541.70097,156.16242 541.00924,156.0087 C540.3175,155.85499 538.93403,156.31614 539.62577,155.00953 C540.3175,153.70292 541.16296,153.47234 541.23982,152.62689 C541.31668,151.78144 541.70097,151.01284 541.23982,150.09053 C540.77866,149.16822 540.47122,148.16904 539.70263,148.01532 C538.93403,147.8616 538.93403,147.40045 538.01172,146.55499 C537.08941,145.70954 537.01255,144.63351 536.32081,144.86409 C535.62908,145.09467 534.47619,146.93929 532.86214,146.63185 C531.24809,146.32442 530.63322,147.01615 530.0952,145.94012 C529.55718,144.86409 529.3266,144.47979 528.71173,144.32607 C528.09685,144.17235 527.78942,144.09549 527.94314,143.40376 C528.09685,142.71202 528.17371,143.01946 528.17371,141.78971 C528.17371,140.55996 528.25057,137.86988 527.32826,136.56327 C526.40595,135.25666 526.40595,135.1798 526.40595,134.71864 C526.40595,134.25749 526.8671,134.02691 526.09851,133.71947 C525.32991,133.41203 524.17702,131.33683 523.94644,130.56823 C523.71587,129.79964 522.56297,129.79964 522.17868,129.79964 C521.79438,129.79964 520.87207,127.26328 520.87207,127.26328 C520.87207,127.26328 516.95224,127.34014 517.0291,126.41782 C517.10596,125.49551 517.56711,124.5732 517.64397,124.1889 C517.72083,123.8046 518.33571,121.42196 517.72083,120.57651 C517.10596,119.73105 516.02992,118.96246 515.41505,118.8856 C514.80017,118.80874 513.72414,118.5013 513.10926,119.42361 C512.49439,120.34593 511.95637,120.9608 511.64894,120.80708 C511.3415,120.65337 510.88034,120.73023 510.72662,119.88477 C510.5729,119.03932 510.18861,116.88725 511.3415,115.27321 C512.49439,113.65916 512.11009,115.81122 512.80183,115.04263 C513.49356,114.27403 513.87786,112.8137 513.87786,112.04511 C513.87786,111.27651 513.4167,110.50792 514.41587,109.50875 C515.41505,108.50958 516.18364,108.81701 516.6448,107.8947 C517.10596,106.97239 517.87455,106.81867 517.33653,105.97321 C516.79852,105.12776 515.95306,104.35917 515.8762,103.28313 C515.79934,102.2071 516.18364,102.28396 515.49191,101.59223 C514.80017,100.90049 514.26216,100.59305 514.1853,99.82446 C514.10844,99.05587 515.56877,99.3633 514.10844,98.51785 C512.64811,97.6724 512.18695,98.28727 512.41753,96.9038 C512.64811,95.52033 512.41753,94.36744 512.87869,93.59885 C513.33984,92.83025 512.57125,90.37075 512.26381,89.98645 C511.95637,89.60215 511.18778,88.98728 510.80348,88.44926 C510.41918,87.91125 510.49604,86.60464 510.18861,86.37406 C509.88117,86.14348 508.72828,85.22117 508.42084,84.76001 C508.1134,84.29885 508.1134,84.06828 507.80596,83.29968 C507.49853,82.53109 506.26878,81.99307 505.96134,81.60877 C505.6539,81.22448 503.27126,80.6096 503.11754,80.2253 C502.96382,79.84101 502.88696,78.91869 503.04068,78.1501 C503.1944,77.3815 503.42498,76.22861 503.1944,75.3063 C502.96382,74.38399 502.88696,73.46167 502.8101,72.15506 C502.73324,70.84845 502.19523,70.23358 501.19605,70.23358 C500.19688,70.23358 499.73572,70.69473 499.65886,70.23358 C499.582,69.77242 499.04399,68.15837 499.04399,67.77408 C499.04399,67.38978 497.66052,63.77739 497.35308,63.54681 C497.04564,63.31623 497.04564,63.23937 496.20019,62.47077 C495.35474,61.70218 494.73986,61.08731 494.12498,61.01045 C493.51011,60.93359 493.12581,60.24185 493.04895,59.47326 C492.97209,58.70466 492.74151,56.78318 492.875,56.625 L492.875,56.625 Z\" id=\"siberia\" data-territory-id=\"27\" class=\"territory\"></path>\n				<path d=\"M474.79395,128.91507 C475.85461,128.38474 474.957,127.37843 474.957,125.61067 C474.957,123.8429 474.42667,123.66612 474.24989,122.42869 C474.07311,121.19125 473.71956,120.8377 473.54278,119.95381 C473.36601,119.06993 475.13377,118.18605 475.84088,116.77183 C476.54799,115.35762 475.84088,114.82729 475.6641,113.58985 C475.48733,112.35242 473.89634,112.35242 473.89634,112.35242 L470.71435,110.23109 L469.30014,109.52399 C469.30014,109.52399 469.12336,108.10977 469.30014,106.51878 C469.47692,104.92779 470.3608,104.39746 471.06791,103.16003 C471.77501,101.92259 471.77501,100.50838 471.77501,99.62449 C471.77501,98.74061 470.00725,98.38706 470.00725,98.38706 L470.00725,94.32119 L470.00725,89.54822 C470.00725,88.31078 469.30014,86.01269 468.76981,85.1288 C468.23948,84.24492 469.30014,82.65393 469.30014,82.65393 C469.30014,82.65393 468.41626,80.70939 468.23948,79.8255 C468.0627,78.94162 469.30014,75.05253 469.30014,75.05253 L471.24468,70.27956 L472.48212,68.15824 C472.48212,68.15824 472.48212,64.97626 473.01245,64.26915 C473.54278,63.56205 473.36601,60.20329 473.36601,60.20329 C473.36601,60.20329 472.6589,53.48578 471.95179,53.04383 L472.625,50.75 L471.625,49.875 L471.25,47.375 L468.75,46.75 L469,43.375 C469,43.375 470.5,41.875 471.125,41.875 C471.75,41.875 469.625,39.75 469.375,38.875 C469.125,38 469.375,37.625 469.875,37.375 C470.375,37.125 470.125,36.375 470,35.375 C469.875,34.375 469.875,34.25 469.875,34.25 L470.75,31.75 L473.625,32.75 C473.625,32.75 474.25,33.75 474.875,33.875 C475.5,34 476.125,33.875 476.625,33.875 C477.125,33.875 476.875,34 477.625,35.5 C478.375,37 478.375,35.5 479.5,35.75 C480.625,36 480.625,37.125 480.5,37.875 C480.375,38.625 479.75,39.25 479.125,40.375 C478.5,41.5 478.625,41.125 477.625,42.25 C476.625,43.375 479.125,44.125 479.125,44.125 C479.125,44.125 479.375,45.625 480,46.5 C480.625,47.375 480.125,46.75 481.125,47.25 C482.125,47.75 481.125,48.125 481.125,49.5 C481.125,50.875 481.875,49.75 481.875,49.75 C481.875,49.75 482.375,50.375 482.75,51.625 C483.125,52.875 482.875,52.125 483.75,54 C484.625,55.875 485,53.875 485,53.875 C485,53.875 485.75,54.5 486.25,55.5 C486.75,56.5 488.625,56.125 488.625,56.125 C488.625,56.125 489.625,55.125 490.375,54.5 C491.125,53.875 490.875,54.125 491.875,53.75 C492.875,53.375 491.92391,53.89674 492.54891,55.64674 C493.17391,57.39674 492.97209,58.70467 493.04895,59.47326 C493.12581,60.24185 493.51011,60.93359 494.12498,61.01045 C494.73986,61.08731 495.35474,61.70218 496.20019,62.47077 C497.04564,63.23937 497.04564,63.31623 497.35308,63.54681 C497.66052,63.77739 499.04399,67.38978 499.04399,67.77408 C499.04399,68.15837 499.582,69.77242 499.65886,70.23358 C499.73572,70.69473 500.19688,70.23358 501.19605,70.23358 C502.19523,70.23358 502.73324,70.84845 502.8101,72.15506 C502.88696,73.46167 502.96382,74.38399 503.1944,75.3063 C503.42498,76.22861 503.1944,77.3815 503.04068,78.1501 C502.88696,78.91869 502.96382,79.84101 503.11754,80.2253 C503.27126,80.6096 505.6539,81.22448 505.96134,81.60877 C506.26878,81.99307 507.49853,82.53109 507.80596,83.29968 C508.1134,84.06828 508.1134,84.29885 508.42084,84.76001 C508.72828,85.22117 509.88117,86.14348 510.18861,86.37406 C510.49604,86.60464 510.41918,87.91125 510.80348,88.44926 C511.18778,88.98728 511.95637,89.60215 512.26381,89.98645 C512.57125,90.37075 513.33984,92.83025 512.87869,93.59885 C512.41753,94.36744 512.64811,95.52033 512.41753,96.9038 C512.18695,98.28727 512.64811,97.6724 514.10844,98.51785 C515.56877,99.3633 514.10844,99.05587 514.1853,99.82446 C514.26216,100.59305 514.80017,100.90049 515.49191,101.59223 C516.18364,102.28396 515.79934,102.2071 515.8762,103.28313 C515.95306,104.35917 516.79852,105.12776 517.33653,105.97321 C517.87455,106.81867 517.10596,106.97239 516.6448,107.8947 C516.18364,108.81701 515.41505,108.50958 514.41587,109.50875 C513.4167,110.50792 513.87786,111.27651 513.87786,112.04511 C513.87786,112.8137 513.49356,114.27403 512.80183,115.04263 C512.11009,115.81122 512.49439,113.65916 511.3415,115.27321 C510.18861,116.88725 510.5729,119.03932 510.72662,119.88477 C510.88034,120.73023 511.3415,120.65337 511.64894,120.80708 C511.95637,120.9608 512.49439,120.34593 513.10926,119.42361 C513.72414,118.5013 514.80017,118.80874 515.41505,118.8856 C516.02992,118.96246 517.10596,119.73105 517.72083,120.57651 C518.33571,121.42196 517.72083,123.8046 517.64397,124.1889 C517.56711,124.5732 517.10596,125.49551 517.0291,126.41782 C516.95224,127.34014 520.87207,127.26328 520.87207,127.26328 C520.87207,127.26328 521.79438,129.79964 522.17868,129.79964 C522.56297,129.79964 523.71587,129.79964 523.94644,130.56823 C524.17702,131.33683 525.32991,133.41203 526.09851,133.71947 C526.8671,134.02691 526.40595,134.25749 526.40595,134.71864 C526.40595,135.1798 526.40595,135.25666 527.32826,136.56327 C528.25057,137.86988 528.17371,140.55996 528.17371,141.78971 C528.17371,143.01946 528.09685,142.71202 527.94314,143.40376 L525.41304,143.60869 C525.41304,143.60869 526.06522,147.84783 525.41304,148.17391 C524.76087,148.5 521.6087,148.93478 521.6087,148.93478 C521.6087,148.93478 521.5,152.19565 521.39131,152.73913 C521.28261,153.28261 519.76087,154.26087 519.43478,154.80435 C519.1087,155.34783 518.78261,155.34783 519.1087,156 C519.43478,156.65217 519.65218,157.52174 519.54348,157.95652 C519.43478,158.3913 520.08696,159.26087 518.89131,159.47826 C517.69565,159.69565 517.15218,160.13043 516.5,159.58696 C515.84783,159.04348 515.63044,157.84783 514.76087,157.41304 C513.89131,156.97826 513.56522,156.97826 513.45652,156.10869 C513.34783,155.23913 513.02174,153.93478 513.02174,153.93478 C513.02174,153.93478 511.93478,152.30435 511.39131,152.30435 C510.84783,152.30435 508.67391,152.84783 508.23913,152.52174 C507.80435,152.19565 505.73913,152.41304 504.97826,151.76087 C504.21739,151.10869 504.1087,150.56522 503.13044,151 C502.15218,151.43478 500.41304,151.54348 500.41304,151.54348 L498.78261,150.45652 C498.78261,150.45652 497.91304,150.13043 497.04348,149.58696 C496.17391,149.04348 496.06522,147.73913 495.73913,147.19565 C495.41304,146.65217 494.76087,145.78261 494.32609,145.45652 C493.89131,145.13043 493.45652,144.47826 492.91304,143.93478 C492.36957,143.3913 491.71739,143.06522 490.95652,142.84783 C490.19565,142.63043 489.54348,142.52174 489.32609,141.86956 C489.1087,141.21739 489.32609,140.67391 488.89131,140.56522 C488.45652,140.45652 487.36957,140.02174 487.36957,140.02174 C487.36957,140.02174 487.26087,138.5 486.71739,138.17391 C486.17391,137.84783 485.08696,136.97826 484.43478,136.65217 C483.78261,136.32609 483.02174,136.21739 482.80435,135.34783 C482.58696,134.47826 482.26087,134.15217 482.26087,134.15217 C482.26087,134.15217 480.95652,133.28261 480.73913,132.73913 C480.52174,132.19565 479.86957,131.10869 479.86957,131.10869 L478.45652,129.58696 L476.82609,129.04348 L474.79395,128.91507 L474.79395,128.91507 Z\" id=\"ural\" data-territory-id=\"26\" class=\"territory\"></path>\n				<path d=\"M516.6087,159.80435 L516.5,159.58696 C515.84783,159.04348 515.63044,157.84783 514.76087,157.41304 C513.89131,156.97826 513.56522,156.97826 513.45652,156.10869 C513.34783,155.23913 513.02174,153.93478 513.02174,153.93478 C513.02174,153.93478 511.93478,152.30435 511.39131,152.30435 C510.84783,152.30435 508.67391,152.84783 508.23913,152.52174 C507.80435,152.19565 505.73913,152.41304 504.97826,151.76087 C504.21739,151.10869 504.1087,150.56522 503.13044,151 C502.15218,151.43478 500.41304,151.54348 500.41304,151.54348 L498.78261,150.45652 C498.78261,150.45652 497.91304,150.13043 497.04348,149.58696 C496.17391,149.04348 496.06522,147.73913 495.73913,147.19565 C495.41304,146.65217 494.76087,145.78261 494.32609,145.45652 C493.89131,145.13043 493.45652,144.47826 492.91304,143.93478 C492.36957,143.3913 491.71739,143.06522 490.95652,142.84783 C490.19565,142.63043 489.54348,142.52174 489.32609,141.86956 C489.1087,141.21739 489.32609,140.67391 488.89131,140.56522 C488.45652,140.45652 487.36957,140.02174 487.36957,140.02174 C487.36957,140.02174 487.26087,138.5 486.71739,138.17391 C486.17391,137.84783 485.08696,136.97826 484.43478,136.65217 C483.78261,136.32609 483.02174,136.21739 482.80435,135.34783 C482.58696,134.47826 482.26087,134.15217 482.26087,134.15217 C482.26087,134.15217 480.95652,133.28261 480.73913,132.73913 C480.52174,132.19565 479.86957,131.10869 479.86957,131.10869 L478.45652,129.58696 L476.82609,129.04348 L474.79395,128.91507 L474.24661,129.39195 C473.18595,129.92228 473.71956,129.85331 472.83568,130.20686 C471.95179,130.56041 468.76981,130.56041 468.59303,131.79785 C468.41626,133.03529 468.23948,133.38884 467.53237,134.80306 C466.82527,136.21727 466.64849,136.57082 465.76461,136.7476 C464.88072,136.92438 464.52717,136.7476 463.64329,136.57082 C462.7594,136.39405 461.16841,135.68694 461.16841,135.68694 L459.7542,135.51016 L458.51676,134.27273 C458.51676,134.27273 457.80966,134.80306 457.10255,135.15661 C456.39544,135.51016 454.80445,136.92438 454.80445,136.92438 C454.80445,136.92438 452.32958,137.63148 451.62247,137.63148 C450.91536,137.63148 450.91536,137.45471 450.20826,137.63148 C449.50115,137.80826 448.26371,137.63148 447.73338,138.33859 C447.20305,139.0457 448.44049,139.7528 445.78884,139.92958 C443.13719,140.10636 443.13719,140.10636 442.43008,140.10636 C441.72298,140.10636 440.48554,143.81867 440.48554,143.81867 C440.48554,143.81867 441.89975,145.0561 440.83909,145.40966 C439.77843,145.76321 439.07133,146.82387 438.541,147.53098 C438.01067,148.23808 437.65711,148.76841 437.83389,149.6523 C438.01067,150.53618 437.83389,151.06651 438.18744,152.12717 C438.541,153.18783 439.42488,155.30915 439.42488,155.30915 C439.42488,155.30915 440.13199,155.66271 439.95521,156.72337 C439.77843,157.78403 439.2481,158.31436 439.77843,159.19824 C440.30876,160.08212 441.36942,160.43568 441.36942,160.43568 L442.43008,161.84989 C442.43008,161.84989 443.8443,161.49634 443.8443,162.73377 C443.8443,163.97121 444.02107,164.50154 444.19785,165.91575 C444.19785,165.91575 445.21933,167.31473 445.92643,166.7844 C446.63354,166.25407 447.87098,165.37018 447.87098,164.30952 C447.87098,163.24886 447.6942,162.89531 448.57808,162.71853 C449.46197,162.54176 449.9923,162.54176 450.87618,162.1882 C451.76006,161.83465 451.40651,161.83465 452.46717,161.83465 C453.52783,161.83465 453.35105,161.30432 453.88138,162.36498 C454.41171,163.42564 453.70461,162.71853 454.05816,164.30952 C454.41171,165.90051 454.58849,165.72374 454.76527,166.7844 C454.94204,167.84506 454.76527,167.49151 454.41171,168.90572 C454.05816,170.31993 454.05816,170.49671 453.17428,170.85026 C452.29039,171.20382 450.52263,172.0877 450.34585,173.50191 C450.16907,174.91613 450.34585,173.14836 450.52263,175.44646 C450.6994,177.74455 450.6994,178.45166 451.40651,178.80521 C452.11362,179.15877 452.29039,178.98199 452.29039,180.04265 C452.29039,181.10331 451.76006,181.45686 452.9975,181.63364 C454.23494,181.81042 455.11882,181.45686 455.11882,181.45686 C455.11882,181.45686 457.41692,181.81042 456.88659,183.22463 C456.35626,184.63884 455.2956,183.75496 456.0027,185.34595 C456.70981,186.93694 456.88659,185.6995 457.06336,187.46727 C457.24014,189.23504 456.53303,189.76537 457.41692,189.76537 C458.3008,189.76537 459.89179,190.47248 459.89179,190.47248 L460.06857,192.77057 L460.42212,194.18479 C460.42212,194.18479 458.12402,193.3009 458.47758,194.89189 C458.83113,196.48288 459.18469,196.48288 459.18469,196.48288 C459.18469,196.48288 461.48278,196.30611 461.48278,197.8971 C461.48278,199.48809 461.12923,200.01842 461.30601,200.9023 C461.48278,201.78618 462.36667,201.07908 462.18989,202.31651 C462.18989,202.31651 462.04348,204.26087 462.96739,204.80435 C463.89131,205.34783 464.81522,205.40217 465.25,205.23913 C465.68478,205.07609 466.5,203.66304 467.36957,203.71739 C468.23913,203.77174 468.78261,203.33696 469.38044,203.88043 C469.97826,204.42391 470.57609,204.31522 471.11957,204.42391 C471.66304,204.53261 472.04348,204.69565 472.80435,205.45652 C473.56522,206.21739 473.89131,206.70652 474.05435,206.97826 C474.21739,207.25 474.21739,208.01087 474.59783,208.55435 C474.97826,209.09783 475.84783,209.26087 476.11957,209.31522 C476.39131,209.36956 478.02174,209.15217 478.51087,209.53261 C479,209.91304 480.19565,211.54348 480.30435,211.97826 C480.41304,212.41304 481.6087,212.84783 481.6087,212.84783 C481.6087,212.84783 484.32609,212.52174 484.76087,211.32609 C485.19565,210.13043 487.47826,208.60869 487.47826,207.84783 C487.47826,207.08696 487.47826,205.8913 488.02174,205.78261 C488.56522,205.67391 490.84783,204.91304 491.6087,205.02174 C492.36957,205.13043 493.89131,205.45652 494.32609,204.47826 C494.76087,203.5 494.65217,200.67391 496.17391,200.56522 C497.69565,200.45652 498.56522,199.58696 499.54348,200.56522 C500.52174,201.54348 503.23913,203.06522 503.23913,203.06522 C503.23913,203.06522 506.93478,203.60869 508.13044,202.30435 C509.32609,201 510.41304,199.36956 510.41304,198.5 C510.41304,197.63043 510.73913,197.30435 510.73913,196.32609 C510.73913,195.34783 509.86957,192.63043 509.86957,192.63043 C509.86957,192.63043 509.1087,191.43478 508.45652,191.21739 C507.80435,191 506.82609,189.91304 506.82609,189.91304 C506.82609,189.91304 506.06522,187.84783 506.06522,186.97826 C506.06522,186.10869 506.5,182.52174 507.04348,182.41304 C507.58696,182.30435 509.1087,181.32609 509.97826,181.32609 C510.84783,181.32609 512.26087,181.43478 512.69565,181.10869 C513.13044,180.78261 513.89131,176.65217 514.32609,175.56522 C514.76087,174.47826 514.97826,173.60869 515.73913,173.71739 C516.5,173.82609 517.91304,173.71739 517.80435,171.86956 C517.69565,170.02174 517.47826,166.43478 516.71739,165.23913 C515.95652,164.04348 515.41304,163.82609 515.84783,162.73913 C516.28261,161.65217 516.82609,161.32609 516.82609,161.32609 L516.6087,159.80435 L516.6087,159.80435 Z\" id=\"afghanistan\" data-territory-id=\"33\" class=\"territory\"></path>\n				<path d=\"M461.65956,206.02882 C461.48278,207.08948 462.18989,207.61981 460.77568,207.97337 C459.36146,208.32692 458.3008,209.38758 458.3008,209.38758 C458.3008,209.38758 459.89179,210.97857 456.53303,210.27147 C453.17428,209.56436 453.70461,209.03403 452.29039,208.68048 C450.87618,208.32692 451.05296,209.03403 449.9923,208.32692 C448.93164,207.61981 448.57808,207.97337 448.22453,206.91271 C447.87098,205.85205 445.25,204.375 445.25,204.375 C445.25,204.375 444.375,204.375 444.25,205.25 C444.125,206.125 446,206.125 443.875,206.5 C443.875,206.5 442.625,206.625 442,206.75 C441.375,206.875 440.75,206.5 440.125,207 C439.5,207.5 439.5,207.875 438.625,208 C437.75,208.125 437.875,208 436.875,208.125 C435.875,208.25 435.125,209.125 435.125,209.125 C435.125,209.125 435.375,209.625 433.75,209.5 C432.125,209.375 431.5,209.75 431.5,209.75 C431.5,209.75 431.5,211.25 430.125,210.25 C428.75,209.25 428.125,209.25 428.125,208.75 C428.125,208.25 428.75,207.75 429.25,207.25 C429.25,207.25 428.77909,205.76366 426.92294,206.11721 C425.06678,206.47077 423.91773,206.38238 423.47579,207.0011 C423.03385,207.61981 422.59191,208.85725 421.8848,208.94564 C421.1777,209.03403 419.14476,209.2108 418.61443,208.59209 C418.0841,207.97337 417.125,206 414.625,205.25 C412.125,204.5 410,203.875 409.125,204.5 C408.25,205.125 409,205.875 407.25,205.375 C405.5,204.875 403.75,204.125 403.25,204.375 C402.75,204.625 401.125,204.375 401.125,205 C401.125,205.625 401.875,206.625 400.875,206.75 C399.875,206.875 398.625,207.375 398,207.625 C397.375,207.875 397.75,208.125 395.5,208.125 C393.25,208.125 391,208.5 390.125,207.75 C389.25,207 388.875,206.125 388.5,205.625 C388.125,205.125 387.125,204.625 387.125,204.625 L385.875,204.625 C385.875,204.625 384.5,205 384,205.625 C383.5,206.25 383.5,206.625 383,207 C382.5,207.375 382.5,207.25 381.875,208 C381.25,208.75 381.75,209.125 381.25,209.75 C380.75,210.375 380.375,209.875 380.125,210.75 C379.875,211.625 380.125,211.25 380.25,212.125 C380.375,213 381,213 380.25,214 C380.25,214 381.3125,216.1875 381.75,217.25 C382.1875,218.3125 383.625,218.875 382.5,219.25 C381.375,219.625 380,219.6875 380.25,220.6875 C380.5,221.6875 382.875,224.0625 383.5625,225.25 C384.25,226.4375 383.75,229.125 384.875,230.125 C386,231.125 387.75,232 388.375,232 C389,232 390.875,230.625 391.125,231.875 C391.375,233.125 390.875,235.5 391.625,235.625 C392.375,235.75 394.125,236.625 394.5,236 C394.875,235.375 393.24698,233.60599 394.48441,233.07566 C395.72185,232.54533 394.48441,230.07046 397.13607,231.30789 C399.78772,232.54533 399.78772,233.42921 401.37871,233.60599 C402.9697,233.78277 404.03036,233.25244 405.09102,233.42921 C406.15168,233.60599 407.38911,234.66665 407.74267,233.42921 C408.09622,232.19178 408.9801,231.48467 409.86399,231.48467 C410.74787,231.48467 412.69241,230.95434 413.04597,232.015 C413.39952,233.07566 412.51564,234.3131 412.69241,235.37376 C412.86919,236.43442 413.92985,236.78797 413.5763,242.79838 C413.22274,248.80878 414.63696,251.81399 413.75307,252.34432 C412.86919,252.87465 411.63175,254.46564 411.98531,255.34952 C412.33886,256.23341 413.75307,259.23861 413.92985,261.35993 C414.10663,263.48125 414.81373,264.01158 414.99051,265.07224 C415.16729,266.1329 413.75307,266.30968 415.16729,268.07744 C416.5815,269.84521 419.58671,270.90587 419.40993,272.14331 C419.23315,273.38075 421.35447,273.91108 422.23836,275.14851 C423.12224,276.38595 424.53645,279.92148 424.89001,281.51247 C425.24356,283.10346 426.481,280.80537 427.1881,283.45702 C427.89521,286.10867 430.01653,285.75511 430.54686,287.69966 C431.07719,289.6442 433,291.5 434,292 C435,292.5 438.25,293.25 438,295 C437.75,296.75 440.75,298.5 440.75,299.75 C440.75,301 440.5,303.5 440.5,303.5 C440.5,303.5 440,304 441,305 C442,306 442.75,306.75 443,308.25 C443.25,309.75 444.25,309.5 444.25,309.5 C444.25,309.5 454,308.5 457.25,307.5 C460.5,306.5 464.5,304.75 464.5,303.75 C464.5,302.75 464.5,303 466,302.5 C467.5,302 468.5,300 468.5,300 L470,298.75 C470,298.75 470.25,296.75 471.5,297 C472.75,297.25 474.25,298 474.25,297 C474.25,296 473.5,297.25 476.5,292.25 C479.5,287.25 480,285.5 479.75,284.5 C479.5,283.5 479.5,283.5 480.5,282.75 C481.5,282 482,279.5 482,279.5 L481.5,277.25 L482.5,275 C482.5,275 483.93342,271.08265 482.69599,270.55232 C481.45855,270.02199 481.63533,269.66843 481.63533,268.25422 C481.63533,266.84001 480.04434,265.95612 480.04434,265.95612 C480.04434,265.95612 480.04434,266.48645 478.63012,265.95612 C477.21591,265.42579 475.44814,263.8348 475.44814,263.8348 C475.44814,263.8348 473.85715,264.54191 473.68037,263.48125 C473.5036,262.42059 474.03393,260.8296 473.15004,261.35993 C472.26616,261.89026 471.2055,261.71348 470.67517,262.42059 C470.14484,263.1277 471.38228,264.18836 468.2003,264.18836 C465.01832,264.18836 464.31121,265.24902 463.6041,264.01158 C462.897,262.77414 462.897,262.77414 462.54344,261.35993 C462.18989,259.94572 463.25055,260.65282 461.65956,259.59216 C460.06857,258.5315 459.71502,258.5315 459.71502,257.64762 C459.71502,256.76374 459.18469,256.23341 459.18469,256.23341 C459.18469,256.23341 457.94725,256.94051 457.41692,255.5263 C456.88659,254.11209 458.12402,253.2282 456.70981,251.99077 C455.2956,250.75333 455.2956,250.57655 454.76527,249.51589 C454.23494,248.45523 453.70461,247.74812 453.70461,247.74812 C453.70461,247.74812 452.46717,247.04102 452.9975,246.33391 C453.52783,245.6268 453.17428,245.45003 454.76527,245.27325 C456.35626,245.09647 456.70981,244.74292 457.41692,244.21259 C458.12402,243.68226 457.77047,243.32871 459.00791,243.15193 C460.24535,242.97515 460.42212,241.91449 460.95245,243.32871 C461.48278,244.74292 461.30601,245.27325 461.30601,247.21779 C461.30601,249.16234 461.12923,250.57655 461.65956,251.63721 C462.18989,252.69787 462.54344,253.2282 462.72022,253.93531 C462.897,254.64242 463.07377,255.17275 463.07377,255.17275 C463.07377,255.17275 463.25055,255.34952 464.13443,255.34952 C465.01832,255.34952 465.19509,254.64242 465.54865,255.5263 C465.9022,256.41018 465.54865,256.05663 466.07898,256.76374 C466.60931,257.47084 466.43253,257.8244 467.31641,257.47084 C468.2003,257.11729 468.37707,256.23341 469.26096,256.58696 C470.14484,256.94051 470.85195,257.11729 470.85195,257.11729 C470.85195,257.11729 472.08938,257.29407 472.08938,256.23341 C472.08938,255.17275 471.91261,254.64242 472.44294,253.93531 C472.97327,253.2282 473.32682,251.46044 474.38748,253.75853 C475.44814,256.05663 474.91781,256.41018 475.44814,257.29407 C475.97847,258.17795 476.33202,258.88506 477.39268,258.5315 C478.45334,258.17795 478.98367,258.17795 479.69078,257.47084 C480.39789,256.76374 481.105,256.41018 481.105,256.41018 C481.105,256.41018 480.92822,254.64242 481.98888,254.28886 C483.04954,253.93531 484.28698,252.87465 484.28698,252.87465 L485.52441,251.46044 L486.58507,250.04622 L489.23672,250.04622 C489.23672,250.04622 488.12995,245.93424 487.97623,244.39705 C487.82251,242.85987 485.97788,242.70615 486.59276,241.4764 C487.20763,240.24664 487.82251,238.70946 486.9002,237.78714 C485.97788,236.86483 484.44069,235.94252 484.44069,234.71277 C484.44069,233.48301 484.90185,233.48301 484.13326,232.25326 C483.36466,231.02351 482.90351,229.64004 482.90351,228.87145 C482.90351,228.10285 482.93835,227.31087 482.44235,226.10451 C481.79722,224.53544 480.07031,226.07807 480.444,223.33757 C481.33828,216.77916 481.30758,215.0955 481.28946,215.11361 C481.27134,215.13172 481.6087,212.84783 481.6087,212.84783 C481.6087,212.84783 480.41304,212.41304 480.30435,211.97826 C480.19565,211.54348 479,209.91304 478.51087,209.53261 C478.02174,209.15217 476.39131,209.36956 476.11957,209.31522 C475.84783,209.26087 474.97826,209.09783 474.59783,208.55435 C474.21739,208.01087 474.21739,207.25 474.05435,206.97826 C473.89131,206.70652 473.56522,206.21739 472.80435,205.45652 C472.04348,204.69565 471.66304,204.53261 471.11957,204.42391 C470.57609,204.31522 469.97826,204.42391 469.38044,203.88043 C468.78261,203.33696 468.23913,203.77174 467.36957,203.71739 C466.5,203.66304 465.68478,205.07609 465.25,205.23913 C464.81522,205.40217 463.89131,205.34783 462.96739,204.80435 C462.58696,204.69565 461.93478,204.6413 461.93478,204.6413 L461.65956,206.02882 L461.65956,206.02882 Z\" id=\"middle_east\" data-territory-id=\"35\" class=\"territory\"></path>\n				<path d=\"M510.41304,198.5 C510.41304,199.36956 509.32609,201 508.13044,202.30435 C506.93478,203.60869 503.23913,203.06522 503.23913,203.06522 C503.23913,203.06522 500.52174,201.54348 499.54348,200.56522 C498.56522,199.58696 497.69565,200.45652 496.17391,200.56522 C494.65217,200.67391 494.76087,203.5 494.32609,204.47826 C493.89131,205.45652 492.36957,205.13043 491.6087,205.02174 C490.84783,204.91304 488.56522,205.67391 488.02174,205.78261 C487.47826,205.8913 487.47826,207.08696 487.47826,207.84783 C487.47826,208.60869 485.19565,210.13043 484.76087,211.32609 C484.32609,212.52174 481.55435,213.01087 481.66305,212.84783 C481.77174,212.68479 481.27134,215.13172 481.28946,215.11361 C481.30758,215.0955 481.33828,216.77916 480.444,223.33757 C480.07031,226.07807 481.79722,224.53544 482.44235,226.10451 C482.93835,227.31087 482.90351,228.10285 482.90351,228.87145 C482.90351,229.64004 483.36466,231.02351 484.13326,232.25326 C484.90185,233.48301 484.44069,233.48301 484.44069,234.71277 C484.44069,235.94252 485.97788,236.86483 486.9002,237.78714 C487.82251,238.70946 487.20763,240.24664 486.59276,241.4764 C485.97788,242.70615 487.82251,242.85987 487.97623,244.39705 C488.12995,245.93424 489.12802,249.88318 489.20955,250.01905 C489.99818,250.15492 490.65094,249.16234 491.35804,248.98556 C492.06515,248.80878 494.36325,248.10168 494.7168,249.33911 C495.07035,250.57655 494.89358,252.5211 495.24713,253.2282 C495.60068,253.93531 497.89878,254.81919 497.89878,254.81919 L499.31299,254.81919 C500.0201,254.81919 500.37366,253.93531 500.55043,255.17275 C500.72721,256.41018 500.37366,256.94051 500.72721,257.64762 C501.08076,258.35473 503.37886,258.35473 503.37886,258.35473 C503.37886,258.35473 505.67696,258.35473 504.6163,259.41539 C503.55564,260.47605 502.84853,260.65282 502.49498,261.35993 C502.14142,262.06704 501.43432,262.24381 502.3182,262.59737 C503.20208,262.95092 503.02531,262.06704 503.73241,263.30447 C504.43952,264.54191 504.26274,264.18836 504.79307,264.89546 C505.3234,265.60257 504.43952,265.77935 506.03051,265.95612 C507.6215,266.1329 508.15183,265.95612 508.15183,265.95612 L508.85894,264.18836 C508.85894,264.18836 509.74282,262.95092 510.44993,264.36513 C511.15703,265.77935 510.45881,265.74902 510.28203,267.51678 C510.10526,269.28455 509.92848,271.03087 509.92848,272.26831 C509.92848,273.50575 509.17848,274.21285 509.35526,275.45029 C509.53203,276.68773 509.78203,277.46806 509.78203,278.88227 C509.78203,280.29648 511.15703,279.74471 511.15703,280.98214 C511.15703,282.21958 510.98026,282.57313 511.68736,283.28024 C512.39447,283.98735 513.16224,285.52656 513.16224,286.23367 C513.16224,286.94077 513.8479,287.2211 513.8479,288.45854 C513.8479,289.69598 513.79612,290.82986 514.50323,291.18342 C515.21033,291.53697 516.36566,291.73519 516.36566,293.14941 C516.36566,294.56362 517.52099,296.08139 517.52099,296.08139 C517.52099,296.08139 518.08165,297.36172 518.08165,298.06882 C518.08165,298.77593 519.28876,299.19014 519.28876,299.89725 C519.28876,300.60436 520.70298,299.89725 521.58686,304.67022 C522.47074,309.44319 523.00107,306.43799 524.41529,310.50385 C525.8295,314.56972 526.53661,315.63038 527.42049,315.63038 C528.30437,315.63038 529.36503,315.27682 529.54181,314.39294 C529.71859,313.50906 529.54181,313.50906 530.42569,313.1555 C531.30958,312.80195 531.1328,312.97873 531.30958,311.91807 C531.48635,310.8574 530.60247,310.68063 530.95602,309.97352 C531.30958,309.26641 530.42569,307.8522 531.83991,307.8522 C533.25412,307.8522 534.31478,306.61476 534.31478,306.61476 C534.31478,306.61476 533.78445,305.90766 533.78445,305.02377 C533.78445,304.13989 533.07734,306.79154 533.78445,302.90245 C534.49156,299.01337 534.84511,298.30626 534.66833,296.00816 C534.49156,293.71007 533.60767,294.77073 534.66833,291.76552 C535.72899,288.76032 536.25932,290.17453 536.25932,287.87643 C536.25932,285.57834 537.31998,283.10346 537.49676,281.68925 C537.67354,280.27504 538.20387,281.3357 538.20387,279.74471 C538.20387,278.15372 537.31998,277.26983 538.38064,276.20917 C539.4413,275.14851 540.85552,274.79496 540.85552,273.55752 L540.85552,270.90587 C540.85552,270.02199 541.20907,268.25422 541.20907,268.25422 C541.20907,268.25422 543.50717,268.07744 542.97684,267.01678 C542.44651,265.95612 542.62329,264.71869 542.97684,263.8348 C543.33039,262.95092 544.375,259.25 545.875,260.25 C547.375,261.25 547.875,261.25 547.875,261.25 C547.875,261.25 549.25,259.875 549.125,259.25 C549,258.625 549.625,257.5 549.625,257.5 C549.625,257.5 549.875,255.75 550.375,255.625 C550.875,255.5 553.25,255.375 553.25,255.375 C553.25,255.375 552.84559,251.54498 553.7679,251.46812 C554.69022,251.39126 555.15137,251.54498 555.38195,250.54581 C555.61253,249.54664 556.38112,248.54746 556.91914,248.31688 C557.45716,248.08631 557.61087,245.70366 557.61087,245.70366 L559.37864,245.08879 C559.37864,245.08879 559.8398,241.16896 560.53153,240.47722 C561.22327,239.78549 562.22244,237.94086 562.22244,237.94086 C562.22244,237.94086 559.68608,230.94665 559.30178,230.56236 C558.91748,230.17806 549.54063,230.02434 549.46377,230.33178 C549.38691,230.63922 548.31088,232.09954 547.84973,232.09954 C547.38857,232.09954 546.15882,230.79293 546.15882,230.79293 C546.15882,230.79293 546.54312,227.18054 546.23568,226.79624 C545.92824,226.41195 543.31502,225.41277 543.00758,225.56649 C542.70014,225.72021 542.08527,227.71856 541.62411,227.71856 C541.16296,227.71856 537.93486,225.95079 537.62742,224.72104 C537.31998,223.49129 538.2423,223.49129 536.85883,223.41443 C535.47536,223.33757 536.55139,224.7979 534.47618,224.33674 C532.40098,223.87559 532.1704,223.56815 531.86296,223.26071 C531.55553,222.95327 530.63321,221.80038 529.55718,221.80038 C528.48115,221.80038 526.32909,220.64749 526.17537,220.26319 C526.02165,219.87889 525.63735,219.41774 525.32991,219.03344 C525.02247,218.64914 525.02247,217.34253 524.56132,216.95824 C524.10016,216.57394 522.48611,217.88055 522.10182,217.95741 C521.71752,218.03427 520.41091,217.49625 520.64149,216.72766 C520.87207,215.95906 521.25636,214.95989 521.71752,214.72931 C522.17868,214.49873 523.10099,213.73014 523.17785,213.19212 C523.25471,212.65411 523.56215,212.42353 523.71586,211.19378 C523.86958,209.96403 523.17785,207.12023 523.02413,206.19792 C522.87041,205.2756 522.87041,202.4318 522.87041,202.4318 C522.87041,202.4318 522.94727,201.35577 522.94727,201.04833 C522.94727,200.7409 523.17785,200.04916 523.17785,200.04916 C523.17785,200.04916 521.79438,200.43346 521.48694,200.51032 C521.1795,200.58718 518.10513,200.58718 517.79769,200.58718 C517.49025,200.58718 515.79934,199.66486 515.72248,199.35743 C515.64562,199.04999 515.49191,197.28222 515.33819,196.97478 C515.18447,196.66735 515.10761,195.59131 514.80017,195.89875 L513.4167,197.8971 L513.49356,198.05082 C511.57207,199.04999 510.49604,198.66569 510.41304,198.5 L510.41304,198.5 Z\" id=\"india\" data-territory-id=\"36\" class=\"territory\"></path>\n				<path d=\"M597.375,251 C595.5,250.625 597.75,249.125 594.125,248.625 C590.5,248.125 590.75,257.75 591,258.75 C591.25,259.75 592.25,260.25 594.5,260 C596.75,259.75 596.25,260 596.75,262.25 C597.25,264.5 596.5,266.25 596.5,266.25 C596.5,266.25 597.25,266 598.5,265.5 C599.75,265 601.5,266.25 602.25,269.75 C603,273.25 603.25,273.25 604.5,275.25 C605.75,277.25 605.5,278.25 606,281 C606.5,283.75 605.5,287 605.25,288.75 C605,290.5 601.75,294 601.75,295 C601.75,296 598.5,298.5 598.25,299.5 C598,300.5 596.75,298.75 596.75,298.75 C596.75,298.75 595.5,295.25 595,294.25 C594.5,293.25 593.75,292.75 593.75,292.75 L594,290.5 C594,290.5 592.75,289.75 591.75,289.75 C590.75,289.75 590.75,288.75 590.75,288.75 L588.5,287 C588.5,287 588.25,286.75 587,286.5 C585.75,286.25 586,286.5 585.75,287.5 C585.5,288.5 585,288.5 583.75,289.75 C582.5,291 584.25,290.5 585.5,291.75 C586.75,293 586.25,292.5 586.25,294.5 C586.25,296.5 586.25,297.25 588,302 C589.75,306.75 589.5,303.75 589.5,303.75 C589.5,303.75 590,304.5 590,305.75 C590,307 589,307 589,307 C589,307 587.25,307.25 585.75,307 C584.25,306.75 585.25,306.5 582.75,303.25 C580.25,300 580.25,299.75 579.25,299 C578.25,298.25 579.5,297.25 579.25,296 C579,294.75 579.25,293 578.5,292 C577.75,291 577.75,290.5 577.25,288.75 C576.75,287 577.25,285.5 577.5,284 C577.75,282.5 576.25,282.25 576,280.25 C575.75,278.25 575.5,278.5 575.5,278.5 C575.5,278.5 571,275.75 570.25,276.75 C569.5,277.75 568.25,274.75 568.25,274.75 C568.25,274.75 565,275.75 564.75,274.25 C564.5,272.75 558,266 557.75,264.25 C557.5,262.5 557.5,260.75 556.25,260.5 C555,260.25 554.125,257.5 554.125,257.5 L553.25,255.375 C552.97689,252.00231 553.46372,251.75909 553.7679,251.46812 C554.69022,251.39126 555.15137,251.54498 555.38195,250.54581 C555.61253,249.54664 556.38112,248.54746 556.91914,248.31688 C557.45716,248.08631 557.61087,245.70366 557.61087,245.70366 L559.37864,245.08879 C559.37864,245.08879 559.8398,241.16896 560.53153,240.47722 C561.22327,239.78549 562.22244,237.94086 562.22244,237.94086 C562.91418,237.01855 563.29847,237.55656 563.29847,237.55656 L564.52822,236.63425 C564.52822,236.63425 565.21996,235.48136 565.5274,234.94334 C565.83483,234.40533 565.98855,234.32847 566.52657,234.48219 C567.06458,234.63591 567.37202,235.55822 568.14062,235.94252 C568.90921,236.32681 569.29351,236.48053 569.67781,236.78797 C570.0621,237.09541 570.21582,238.55574 570.52326,239.47805 C570.8307,240.40036 571.06127,240.16978 571.98359,240.7078 C572.9059,241.24582 572.36789,241.39954 572.29103,241.70697 C572.21417,242.01441 573.6745,244.01276 574.44309,243.9359 C575.21168,243.85904 576.67201,245.93424 577.21003,246.54912 C577.74805,247.16399 579.51581,247.39457 580.51499,247.24085 C581.51416,247.08713 581.20672,245.78052 581.20672,245.31937 C581.20672,244.85821 581.89845,243.39788 582.28275,243.32102 C582.66705,243.24416 584.58854,243.32102 585.43399,243.1673 C586.27944,243.01358 585.89515,242.47557 585.89515,242.47557 C585.89515,242.47557 586.97118,241.55325 587.04804,241.0921 C587.1249,240.63094 587.81663,240.09293 588.12407,239.86235 C588.43151,239.63177 589.2001,239.78549 589.5844,239.86235 C589.9687,239.93921 590.58357,241.0921 590.58357,241.0921 C590.58357,241.0921 592.0439,241.24582 592.4282,241.24582 C592.81249,241.24582 593.11993,242.01441 593.11993,242.78301 L593.11993,244.24333 C593.11993,244.78135 593.96539,244.85821 593.96539,244.85821 C593.96539,244.85821 594.5034,244.93507 594.65712,245.39623 C594.81084,245.85738 594.81084,246.0111 595.272,246.0111 C595.73315,246.0111 595.73315,246.85656 595.73315,246.85656 C595.73315,246.85656 597.27034,248.24003 596.65547,248.54746 C596.04059,248.8549 597.375,251 597.375,251 L597.375,251 Z\" id=\"siam\" data-territory-id=\"37\" class=\"territory\"></path>\n				<path d=\"M611.125,187 C610.125,187.5 611,187.5 611,188.125 C611,188.75 611.875,188.375 611.875,189.25 C611.875,190.125 612.125,190 612.625,190.25 C613.125,190.5 612.75,191 612.75,192.375 C612.75,193.75 612.875,193 613.875,193.25 C614.875,193.5 614.375,193.625 614.625,195.125 C614.875,196.625 615.625,195.625 616.125,195.625 C616.625,195.625 616.625,195.875 617,196.625 C617.375,197.375 617,197.125 615.75,197.875 C614.5,198.625 617,198.75 618.375,199.125 C619.75,199.5 619.25,201.125 619,202.5 C618.75,203.875 619.625,203.625 620.5,205.125 C621.375,206.625 620.625,207.5 619.625,209.875 C618.625,212.25 620.125,211.5 621.25,211.625 C622.375,211.75 622.125,215 621.375,216.625 C620.625,218.25 621.5,218.125 621.5,220.25 C621.5,222.375 621.125,222.75 620.875,224.375 C620.625,226 620.5,225.75 619.875,226.75 C619.25,227.75 619.625,228.75 619.625,230.375 C619.625,232 618,232 616.875,232.25 C615.75,232.5 616.25,232.375 616.375,233.5 C616.5,234.625 615.875,234.875 614.875,235.875 C613.875,236.875 614.375,236.125 613.75,237.75 C613.125,239.375 613.625,238.625 612.25,239.875 C610.875,241.125 610.875,241.75 610.875,241.75 C610.875,241.75 610.875,242.875 610.625,244.125 C610.375,245.375 609.5,244.375 609,244.25 C608.5,244.125 607.625,244.875 607.25,245.625 C606.875,246.375 605.375,246.75 604.125,248 C602.875,249.25 604.25,248.25 604.625,249.125 C605,250 603.75,250.625 603.125,251.125 C602.5,251.625 602,252.875 601,253.5 C600,254.125 599.20581,251.41919 597.59597,250.9779 C597.86114,250.91161 596.04059,248.8549 596.65547,248.54746 C597.27034,248.24003 595.73315,246.85656 595.73315,246.85656 C595.73315,246.85656 595.73315,246.0111 595.272,246.0111 C594.81084,246.0111 594.81084,245.85738 594.65712,245.39623 C594.5034,244.93507 593.96539,244.85821 593.96539,244.85821 C593.96539,244.85821 593.11993,244.78135 593.11993,244.24333 L593.11993,242.78301 C593.11993,242.01441 592.81249,241.24582 592.4282,241.24582 C592.0439,241.24582 590.58357,241.0921 590.58357,241.0921 C590.58357,241.0921 589.9687,239.93921 589.5844,239.86235 C589.2001,239.78549 588.43151,239.63177 588.12407,239.86235 C587.81663,240.09293 587.1249,240.63094 587.04804,241.0921 C586.97118,241.55325 585.89515,242.47557 585.89515,242.47557 C585.89515,242.47557 586.27944,243.01358 585.43399,243.1673 C584.58854,243.32102 582.66705,243.24416 582.28275,243.32102 C581.89845,243.39788 581.20672,244.85821 581.20672,245.31937 C581.20672,245.78052 581.51416,247.08713 580.51499,247.24085 C579.51581,247.39457 577.74805,247.16399 577.21003,246.54912 C576.67201,245.93424 575.21168,243.85904 574.44309,243.9359 C573.6745,244.01276 572.21417,242.01441 572.29103,241.70697 C572.36789,241.39954 572.9059,241.24582 571.98359,240.7078 C571.06127,240.16978 570.8307,240.40036 570.52326,239.47805 C570.21582,238.55574 570.0621,237.09541 569.67781,236.78797 C569.29351,236.48053 568.90921,236.32681 568.14062,235.94252 C567.37202,235.55822 567.06458,234.63591 566.52657,234.48219 C565.98855,234.32847 565.83483,234.40533 565.5274,234.94334 C565.21996,235.48136 564.52822,236.63425 564.52822,236.63425 L563.29847,237.55656 C563.29847,237.55656 562.91418,237.01855 562.22244,237.94086 C562.22244,237.94086 559.68608,230.94665 559.30178,230.56236 C558.91748,230.17806 549.54063,230.02434 549.46377,230.33178 C549.38691,230.63922 548.31088,232.09954 547.84973,232.09954 C547.38857,232.09954 546.15882,230.79293 546.15882,230.79293 C546.15882,230.79293 546.54312,227.18054 546.23568,226.79624 C545.92824,226.41195 543.31502,225.41277 543.00758,225.56649 C542.70014,225.72021 542.08527,227.71856 541.62411,227.71856 C541.16296,227.71856 537.93486,225.95079 537.62742,224.72104 C537.31998,223.49129 538.2423,223.49129 536.85883,223.41443 C535.47536,223.33757 536.55139,224.7979 534.47618,224.33674 C532.40098,223.87559 532.1704,223.56815 531.86296,223.26071 C531.55553,222.95327 530.63321,221.80038 529.55718,221.80038 C528.48115,221.80038 526.32909,220.64749 526.17537,220.26319 C526.02165,219.87889 525.63735,219.41774 525.32991,219.03344 C525.02247,218.64914 525.02247,217.34253 524.56132,216.95824 C524.10016,216.57394 522.48611,217.88055 522.10182,217.95741 C521.71752,218.03427 520.41091,217.49625 520.64149,216.72766 C520.87207,215.95906 521.25636,214.95989 521.71752,214.72931 C522.17868,214.49873 523.10099,213.73014 523.17785,213.19212 C523.25471,212.65411 523.56215,212.42353 523.71586,211.19378 C523.86958,209.96403 523.17785,207.12023 523.02413,206.19792 C522.87041,205.2756 522.87041,202.4318 522.87041,202.4318 C522.87041,202.4318 522.94727,201.35577 522.94727,201.04833 C522.94727,200.7409 523.17785,200.04916 523.17785,200.04916 C523.17785,200.04916 521.79438,200.43346 521.48694,200.51032 C521.1795,200.58718 518.10513,200.58718 517.79769,200.58718 C517.49025,200.58718 515.79934,199.66486 515.72248,199.35743 C515.64562,199.04999 515.49191,197.28222 515.33819,196.97478 C515.18447,196.66735 515.10761,195.59131 514.80017,195.89875 L513.4167,197.8971 L513.49356,198.05082 C511.57207,199.04999 510.49604,198.66569 510.41304,198.5 C510.41304,197.63043 510.73913,197.30435 510.73913,196.32609 C510.73913,195.34783 509.86957,192.63043 509.86957,192.63043 C509.86957,192.63043 509.1087,191.43478 508.45652,191.21739 C507.80435,191 506.82609,189.91304 506.82609,189.91304 C506.82609,189.91304 506.06522,187.84783 506.06522,186.97826 C506.06522,186.10869 506.5,182.52174 507.04348,182.41304 C507.58696,182.30435 509.1087,181.32609 509.97826,181.32609 C510.84783,181.32609 512.26087,181.43478 512.69565,181.10869 C513.13044,180.78261 513.89131,176.65217 514.32609,175.56522 C514.76087,174.47826 514.97826,173.60869 515.73913,173.71739 C516.5,173.82609 517.91304,173.71739 517.80435,171.86956 C517.69565,170.02174 517.47826,166.43478 516.71739,165.23913 C515.95652,164.04348 515.41304,163.82609 515.84783,162.73913 C516.28261,161.65217 516.82609,161.32609 516.82609,161.32609 C516.7377,161.14931 516.6087,159.80435 516.55435,159.69565 C517.15218,160.13043 517.69565,159.69565 518.89131,159.47826 C520.08696,159.26087 519.43478,158.3913 519.54348,157.95652 C519.65218,157.52174 519.43478,156.65217 519.1087,156 C518.78261,155.34783 519.1087,155.34783 519.43478,154.80435 C519.76087,154.26087 521.28261,153.28261 521.39131,152.73913 C521.5,152.19565 521.6087,148.93478 521.6087,148.93478 C521.6087,148.93478 524.76087,148.5 525.41304,148.17391 C526.06522,147.84783 525.41304,143.60869 525.41304,143.60869 L527.94314,143.40376 C527.78942,144.09549 528.09685,144.17235 528.71173,144.32607 C529.3266,144.47979 529.55718,144.86409 530.0952,145.94012 C530.63322,147.01615 531.24809,146.32442 532.86214,146.63185 C534.47619,146.93929 535.62908,145.09467 536.32081,144.86409 C537.01255,144.63351 537.08941,145.70954 538.01172,146.55499 C538.93403,147.40045 538.93403,147.8616 539.70263,148.01532 C540.47122,148.16904 540.77866,149.16822 541.23982,150.09053 C541.70097,151.01284 541.31668,151.78144 541.23982,152.62689 C541.16296,153.47234 540.3175,153.70292 539.62577,155.00953 C538.93403,156.31614 540.3175,155.85499 541.00924,156.0087 C541.70097,156.16242 541.62411,156.93102 542.39271,157.39217 C543.1613,157.85333 543.31502,156.93102 544.23733,156.23928 C545.15965,155.54755 544.77535,157.23846 545.31337,157.54589 C545.85138,157.85333 546.69684,158.39135 547.23485,158.16077 C547.23485,158.16077 548.36853,160.06688 548.98725,160.24366 C549.60597,160.42044 550.1363,166.69601 550.1363,166.69601 C550.1363,166.69601 551.10857,166.07729 551.37373,166.87279 C551.6389,167.66828 551.99245,168.99411 551.99245,168.99411 C551.99245,168.99411 553.31828,169.7896 553.31828,170.23154 C553.31828,170.67348 553.22989,171.73414 553.58344,171.91092 C553.937,172.0877 555.35121,172.70642 555.35121,172.70642 L555.70476,174.03224 C555.70476,174.03224 555.88154,175.18129 556.41187,175.26968 C556.9422,175.35807 557.20736,175.18129 557.91447,175.53484 C558.62158,175.8884 558.79835,175.97679 559.41707,175.97679 C560.03579,175.97679 560.30096,175.8884 560.30096,176.41873 C560.30096,176.94906 560.21257,177.83294 560.56612,177.92133 C560.91967,178.00972 561.80356,178.09811 561.80356,178.09811 C561.80356,178.09811 562.06872,178.62844 562.42228,178.98199 C562.77583,179.33554 563.83649,179.42393 564.01327,179.77748 C564.19004,180.13104 564.27843,180.74976 564.36682,181.10331 C564.45521,181.45686 564.10166,182.25236 565.42748,182.34075 C566.75331,182.42913 574.44309,181.28009 574.44309,181.28009 L574.97342,182.16397 C574.97342,182.16397 575.50375,182.6943 576.12247,182.87108 C576.74119,183.04785 577.89024,182.60591 578.86251,183.04785 C579.83478,183.4898 580.63028,183.75496 581.07222,183.75496 L582.39804,183.75496 C582.39804,183.75496 582.66321,184.9924 583.10515,185.08079 C583.54709,185.16917 585.31486,184.46207 585.31486,184.46207 C585.31486,184.46207 585.66841,183.93174 586.19874,184.02013 C586.72907,184.10851 586.81746,182.87108 587.78973,182.78269 C588.762,182.6943 589.29233,182.6943 589.64589,182.6943 C589.99944,182.6943 592.12076,181.63364 592.20915,182.51752 C592.29754,183.40141 592.38593,183.93174 592.82787,184.46207 C593.26981,184.9924 594.50725,185.34595 594.94919,185.34595 C595.39113,185.34595 596.3634,184.72723 596.98212,184.37368 C597.60084,184.02013 597.866,183.66657 598.6615,183.84335 C599.45699,184.02013 600.25249,184.55046 600.60604,184.72723 C600.9596,184.90401 601.13637,184.90401 602.19703,185.25756 C603.25769,185.61112 604.67191,185.52273 604.67191,185.52273 C604.67191,185.52273 607.23517,185.78789 608.20744,186.05306 C609.88682,187.29049 610.59393,187.20211 611.125,187 L611.125,187 Z\" id=\"china\" data-territory-id=\"34\" class=\"territory\"></path>\n				<path d=\"M546.08196,136.64013 C546.08196,136.64013 546.7737,136.64013 547.08113,137.56244 C547.38857,138.48475 548.23403,139.94508 547.38857,141.09797 C546.54312,142.25087 545.85138,144.40293 546.7737,146.47814 C547.69601,148.55334 549.31006,148.78392 549.15634,150.01367 C549.00262,151.24342 548.77204,150.93598 548.61832,152.62689 C548.4646,154.3178 548.77204,155.39383 548.38137,156.10528 C548.1875,157.0625 547.23485,158.16077 547.23485,158.16077 C547.23485,158.16077 548.36853,160.06688 548.98725,160.24366 C549.60597,160.42044 550.1363,166.69601 550.1363,166.69601 C550.1363,166.69601 551.10857,166.07729 551.37373,166.87279 C551.6389,167.66828 551.99245,168.99411 551.99245,168.99411 C551.99245,168.99411 553.31828,169.7896 553.31828,170.23154 C553.31828,170.67348 553.22989,171.73414 553.58344,171.91092 C553.937,172.0877 555.35121,172.70642 555.35121,172.70642 L555.70476,174.03224 C555.70476,174.03224 555.88154,175.18129 556.41187,175.26968 C556.9422,175.35807 557.20736,175.18129 557.91447,175.53484 C558.62158,175.8884 558.79835,175.97679 559.41707,175.97679 C560.03579,175.97679 560.30096,175.8884 560.30096,176.41873 C560.30096,176.94906 560.21257,177.83294 560.56612,177.92133 C560.91967,178.00972 561.80356,178.09811 561.80356,178.09811 C561.80356,178.09811 562.06872,178.62844 562.42228,178.98199 C562.77583,179.33554 563.83649,179.42393 564.01327,179.77748 C564.19004,180.13104 564.27843,180.74976 564.36682,181.10331 C564.45521,181.45686 564.10166,182.25236 565.42748,182.34075 C566.75331,182.42913 574.44309,181.28009 574.44309,181.28009 L574.97342,182.16397 C574.97342,182.16397 575.50375,182.6943 576.12247,182.87108 C576.74119,183.04785 577.89024,182.60591 578.86251,183.04785 C579.83478,183.4898 580.63028,183.75496 581.07222,183.75496 L582.39804,183.75496 C582.39804,183.75496 582.66321,184.9924 583.10515,185.08079 C583.54709,185.16917 585.31486,184.46207 585.31486,184.46207 C585.31486,184.46207 585.66841,183.93174 586.19874,184.02013 C586.72907,184.10851 586.81746,182.87108 587.78973,182.78269 C588.762,182.6943 589.29233,182.6943 589.64589,182.6943 C589.99944,182.6943 592.12076,181.63364 592.20915,182.51752 C592.29754,183.40141 592.38593,183.93174 592.82787,184.46207 C593.26981,184.9924 594.50725,185.34595 594.94919,185.34595 C595.39113,185.34595 596.3634,184.72723 596.98212,184.37368 C597.60084,184.02013 597.866,183.66657 598.6615,183.84335 C599.45699,184.02013 600.25249,184.55046 600.60604,184.72723 C600.9596,184.90401 601.13637,184.90401 602.19703,185.25756 C603.25769,185.61112 604.67191,185.52273 604.67191,185.52273 C604.67191,185.52273 607.23517,185.78789 608.13497,186.12028 C608.5625,186.375 610.4375,187.0625 611.125,187 C612.125,186.5 612,187.5 613.375,186 C614.75,184.5 613.875,185.75 615.25,183.75 C616.625,181.75 618.875,181.5 616.375,181.25 C613.875,181 614.25,181.75 613.375,180.875 C612.5,180 613.25,179.75 611.75,179.875 C610.25,180 610.25,180.25 609.875,179.75 C609.5,179.25 610.625,178.875 608.75,178.875 C606.875,178.875 607.5,179.625 606,178.75 C604.5,177.875 604.375,178.25 604.5,177.25 C604.625,176.25 604.625,175.375 605.625,175.125 C606.625,174.875 606.375,175.125 607,174.625 C607.625,174.125 608,174 608,173.25 C608,172.5 609.375,172.125 609.75,171.125 C610.125,170.125 610.125,168.625 610.875,168.625 C611.625,168.625 611.625,168.5 612.25,170.25 C612.875,172 611.375,172.75 613.125,172.875 C614.875,173 615.875,173.125 616.625,173 C617.375,172.875 616.875,173.125 617.75,174.125 C618.625,175.125 618.5,175.625 619.375,176.25 C620.25,176.875 620.375,178 620.375,178 C620.375,178 620.375,178.625 621.5,178.375 C622.625,178.125 624.375,178.125 624.375,178.125 C624.375,178.125 623.875,177.5 624.5,179.625 C625.125,181.75 625.5,181.25 625.5,183.125 C625.5,185 624.625,186 625.5,186.625 C626.375,187.25 627.375,187.5 627.375,187.5 C627.375,187.5 630,185 630.25,183.875 C630.5,182.75 631.25,182.375 631.125,181.5 C631,180.625 630.75,181.25 631.25,180.125 C631.75,179 631.75,177 631.75,177 C631.75,177 631.25,176.875 630.75,176.625 C630.25,176.375 630,176.5 629.75,175.125 C629.5,173.75 630,173.75 629.125,173.375 C628.25,173 627.875,172.375 627.625,171.625 C627.375,170.875 627.5,170.375 626.875,170.25 C626.25,170.125 626.375,170 625,169 C623.625,168 623.875,168.5 622.875,167.875 C621.875,167.25 621.625,166.875 621.625,166 C621.625,165.125 621.375,164.875 622,164.25 C622.625,163.625 623,165 623.125,162.75 C623.25,160.5 622.5,160.375 623.625,158.125 C624.75,155.875 624.5,155 625.375,154.25 C625.9375,153.8125 625.8125,154.25 627.46875,152.5 C627.56449,152.55387 627.56449,152.64226 626.59222,152.46549 C625.61994,152.28871 625.44317,150.43255 624.20573,150.34417 C622.96829,150.25578 622.1728,149.54867 621.90763,148.5764 C621.64247,147.60413 620.75859,144.7757 618.81404,144.86409 C616.8695,144.95248 616.51594,142.38921 614.74818,140.26789 C612.98041,138.14657 616.8695,138.32335 616.8695,137.61624 C616.8695,136.90914 616.60433,137.52785 616.33917,135.58331 C616.33917,135.58331 615.4375,136.5 614.3125,136.1875 C613.1875,135.875 612.4375,135.5 612.3125,134.625 C612.1875,133.75 611.0625,133.3125 611.0625,133.3125 C611.0625,133.3125 609.5,133.25 609.4375,132.75 C609.375,132.25 609.125,131.875 608.9375,130.3125 C608.75,128.75 608.875,128.375 608.25,128.375 C607.625,128.375 606.875,128.5 606.625,128.25 C606.375,128 606.0625,127.8125 606,127 C605.9375,126.1875 605.875,125.375 605.5,125.25 C605.125,125.125 604.5,124.8125 604.125,124.8125 C603.75,124.8125 602.5,125.0625 602.375,124.5625 C602.25,124.0625 602.125,123.375 602.25,122.875 C602.375,122.375 602.5625,122.0625 602.5625,121.625 C602.5625,121.1875 602.3125,120.1875 602.3125,120.1875 C602.3125,120.1875 601.875,120.1875 601.4375,119.8125 C601,119.4375 601,118.875 600.375,118.75 C599.75,118.625 599.375,118.4375 598.8125,119.0625 C598.25,119.6875 597.875,120.25 597.5625,120.375 C597.25,120.5 595.375,120.6875 594.75,120.6875 C594.125,120.6875 593.1875,120.3125 593.1875,120.3125 L592.75,119.8125 C592.75,119.8125 591.875,119.5 591.875,119.875 C591.875,120.25 592.1875,120.625 591.875,121.125 C591.5625,121.625 591.75,121.625 591.0625,122.1875 C590.375,122.75 589.9375,122.875 589.875,123.3125 C589.8125,123.75 589.8125,123.9375 590.1875,124.375 C590.5625,124.8125 590.75,124.6875 590.9375,125.25 C591.125,125.8125 591.1875,125.9375 591.1875,126.5625 C591.1875,127.1875 591.25,128.0625 590.8125,128.4375 C590.375,128.8125 590.25,128.75 589.9375,129.5625 C589.625,130.375 589.375,130.5 589.1875,130.875 C589,131.25 588.75,131.4375 589.125,132.1875 C589.5,132.9375 589.875,133.4375 590.125,133.75 C590.375,134.0625 590.6875,134.5625 590.4375,135.375 C590.1875,136.1875 590.125,136.625 589.625,137.125 C589.125,137.625 588.6875,138.6875 588.3125,139.125 C587.9375,139.5625 588.0625,140.0625 587.4375,139.75 C586.8125,139.4375 586.375,138.875 586.3125,138.625 L586,137.375 C585.8125,136.625 585.5625,135.6875 585.4375,135.4375 C585.3125,135.1875 583.72387,134.34587 583.32612,135.14137 C582.92837,135.93686 583.06096,136.68816 582.44224,136.95333 C581.82352,137.21849 581.69094,137.21849 581.42577,137.61624 C581.16061,138.01399 580.40931,139.11884 579.83478,138.98626 C579.26026,138.85368 579.12767,138.7211 578.1996,138.58851 C577.27152,138.45593 576.52022,138.14657 576.12247,138.7211 C575.72472,139.29562 574.70826,140.13531 574.00115,139.87015 C573.29404,139.60498 572.36597,139.07465 572.145,138.85368 C571.92402,138.63271 570.55401,138.01399 569.8469,138.10238 C569.13979,138.19077 569.13979,138.36754 567.76977,138.27915 C566.39975,138.19077 565.07393,137.66044 564.19004,137.66044 C563.30616,137.66044 561.00806,136.51139 560.30096,136.64397 C559.59385,136.77655 559.72643,136.77655 558.97513,137.08591 C558.22383,137.39527 557.6935,136.90914 557.38414,137.43947 C557.07478,137.9698 557.07478,138.7211 556.1467,138.58851 C555.21863,138.45593 554.73249,138.45593 554.37894,138.10238 C554.02538,137.74882 553.76022,137.21849 553.76022,137.21849 C553.76022,137.21849 553.18569,136.99752 552.83214,137.08591 C552.47859,137.1743 551.55051,137.08591 551.55051,137.08591 C551.55051,137.08591 550.75502,136.29042 550.57824,136.24622 C550.40146,136.20203 549.65016,135.76009 549.3408,135.80428 C549.03144,135.84848 547.70562,136.06945 547.70562,136.06945 C547.70562,136.06945 545.76107,136.20203 546.08196,136.64013 L546.08196,136.64013 Z\" id=\"mongolia\" data-territory-id=\"31\" class=\"territory\"></path>\n				<path d=\"M616.42756,134.61104 C616.69273,136.55558 616.33917,135.58331 616.33917,135.58331 C616.33917,135.58331 615.4375,136.5 614.3125,136.1875 C613.1875,135.875 612.4375,135.5 612.3125,134.625 C612.1875,133.75 611.0625,133.3125 611.0625,133.3125 C611.0625,133.3125 609.5,133.25 609.4375,132.75 C609.375,132.25 609.125,131.875 608.9375,130.3125 C608.75,128.75 608.875,128.375 608.25,128.375 C607.625,128.375 606.875,128.5 606.625,128.25 C606.375,128 606.0625,127.8125 606,127 C605.9375,126.1875 605.875,125.375 605.5,125.25 C605.125,125.125 604.5,124.8125 604.125,124.8125 C603.75,124.8125 602.5,125.0625 602.375,124.5625 C602.25,124.0625 602.125,123.375 602.25,122.875 C602.375,122.375 602.5625,122.0625 602.5625,121.625 C602.5625,121.1875 602.3125,120.1875 602.3125,120.1875 C602.3125,120.1875 601.875,120.1875 601.4375,119.8125 C601,119.4375 601,118.875 600.375,118.75 C599.75,118.625 599.375,118.4375 598.8125,119.0625 C598.25,119.6875 597.875,120.25 597.5625,120.375 C597.25,120.5 595.375,120.6875 594.75,120.6875 C594.125,120.6875 593.1875,120.3125 593.1875,120.3125 L592.75,119.8125 C592.75,119.8125 591.875,119.5 591.875,119.875 C591.875,120.25 592.1875,120.625 591.875,121.125 C591.5625,121.625 591.75,121.625 591.0625,122.1875 C590.375,122.75 589.9375,122.875 589.875,123.3125 C589.8125,123.75 589.8125,123.9375 590.1875,124.375 C590.5625,124.8125 590.75,124.6875 590.9375,125.25 C591.125,125.8125 591.1875,125.9375 591.1875,126.5625 C591.1875,127.1875 591.25,128.0625 590.8125,128.4375 C590.375,128.8125 590.25,128.75 589.9375,129.5625 C589.625,130.375 589.375,130.5 589.1875,130.875 C589,131.25 588.75,131.4375 589.125,132.1875 C589.5,132.9375 589.875,133.4375 590.125,133.75 C590.375,134.0625 590.6875,134.5625 590.4375,135.375 C590.1875,136.1875 590.125,136.625 589.625,137.125 C589.125,137.625 588.6875,138.6875 588.3125,139.125 C587.9375,139.5625 588.0625,140.0625 587.4375,139.75 C586.8125,139.4375 586.375,138.875 586.3125,138.625 L586,137.375 C585.8125,136.625 585.5625,135.6875 585.4375,135.4375 C585.3125,135.1875 583.72387,134.34587 583.32612,135.14137 C582.92837,135.93686 583.06096,136.68816 582.44224,136.95333 C581.82352,137.21849 581.69094,137.21849 581.42577,137.61624 C581.16061,138.01399 580.40931,139.11884 579.83478,138.98626 C579.26026,138.85368 579.12767,138.7211 578.1996,138.58851 C577.27152,138.45593 576.52022,138.14657 576.12247,138.7211 C575.72472,139.29562 574.70826,140.13531 574.00115,139.87015 C573.29404,139.60498 572.36597,139.07465 572.145,138.85368 C571.92402,138.63271 570.55401,138.01399 569.8469,138.10238 C569.13979,138.19077 569.13979,138.36754 567.76977,138.27915 C566.39975,138.19077 565.07393,137.66044 564.19004,137.66044 C563.30616,137.66044 561.00806,136.51139 560.30096,136.64397 C559.59385,136.77655 559.72643,136.77655 558.97513,137.08591 C558.22383,137.39527 557.6935,136.90914 557.38414,137.43947 C557.07478,137.9698 557.07478,138.7211 556.1467,138.58851 C555.21863,138.45593 554.73249,138.45593 554.37894,138.10238 C554.02538,137.74882 553.76022,137.21849 553.76022,137.21849 C553.76022,137.21849 553.18569,136.99752 552.83214,137.08591 C552.47859,137.1743 551.55051,137.08591 551.55051,137.08591 C551.55051,137.08591 550.75502,136.29042 550.57824,136.24622 C550.40146,136.20203 549.65016,135.76009 549.3408,135.80428 C549.03144,135.84848 547.70562,136.06945 547.70562,136.06945 C547.70562,136.06945 545.76107,136.20203 546.08196,136.64013 C544.39105,136.02525 545.46709,136.17897 544.39105,135.71781 C543.31502,135.25666 544.08362,134.33434 543.46874,132.79716 C542.85386,131.25997 542.54643,133.10459 542.54643,133.10459 C542.54643,133.10459 541.31668,133.10459 540.85552,131.25997 C540.39436,129.41534 541.16296,130.33765 541.47039,128.80047 C541.77783,127.26328 541.00924,127.417 541.00924,125.57237 C541.00924,123.72774 542.08527,124.49634 542.08527,124.49634 C542.08527,124.49634 542.39271,122.80543 542.54643,120.03849 C542.70015,117.27155 541.16296,119.2699 540.54808,117.88643 C539.93321,116.50296 540.54808,116.65668 540.85552,115.88808 C541.16296,115.11949 541.62411,114.65833 542.54643,113.12114 C543.46874,111.58395 543.1613,112.35255 545.46709,111.89139 C547.77287,111.43023 546.85055,109.27817 548.69518,108.66329 C550.53981,108.04842 549.31006,108.35586 550.53981,109.58561 C551.76956,110.81536 552.38443,109.27817 553.92162,108.97073 C555.45881,108.66329 555.15137,107.74098 557.30344,108.04842 C559.4555,108.35586 558.53319,108.66329 559.14806,109.89305 C559.76294,111.1228 560.68525,111.1228 562.52988,108.97073 C564.37451,106.81867 562.83732,100.66991 561.60757,97.2881 C560.37782,93.90628 564.5,86.25 564.5,86.25 C564.5,86.25 569.375,84.75 570.625,84 C571.875,83.25 571.75,83.125 572.125,81.375 C572.5,79.625 572.625,76.75 574,76.5 C575.375,76.25 575.125,78.25 575.125,78.25 C575.25,79 576.625,78.75 578.125,79 C579.183,79.17633 578.74851,78.2333 578.53218,77.31133 C578.4418,76.92616 578.3895,76.54467 578.5,76.25 C578.875,75.25 590.79494,76.36312 590.79494,76.36312 C590.35299,77.42378 590.44138,78.83799 590.70655,79.27993 C590.97171,79.72188 592.12076,82.19675 591.76721,84.22968 C591.41365,86.26261 590.88332,92.36141 591.14849,93.51046 C591.41365,94.65951 591.50204,97.48793 592.29754,98.28343 C593.09303,99.07892 593.44659,99.69764 593.80014,100.40475 C594.15369,101.11186 597.77762,102.2609 598.39633,103.76351 C599.01505,105.26611 598.6615,105.61966 599.72216,106.23838 C600.78282,106.8571 601.75509,108.18292 601.84348,109.42036 C601.93187,110.6578 601.93187,112.51395 602.81575,112.24879 C603.69963,111.98362 604.67191,110.74619 605.02546,110.39263 C605.37901,110.03908 606.70484,109.59714 607.85389,110.03908 C609.00294,110.48102 609.2681,110.48102 610.41715,110.30424 C611.5662,110.12747 612.62686,110.48102 612.62686,110.48102 C612.62686,110.48102 613.51074,111.80685 613.59913,112.51395 C613.68752,113.22106 613.15719,113.75139 614.74818,113.663 C616.33917,113.57461 616.69272,113.48622 616.8695,115.25399 C617.04627,117.02176 618.01855,117.99403 618.01855,117.99403 C618.01855,117.99403 618.28371,119.85019 618.19532,120.29213 C618.10694,120.73407 617.48822,121.79473 617.75338,122.94378 C618.01855,124.09283 618.63727,125.24187 618.10694,126.03737 C617.5766,126.83286 616.69272,128.60063 616.69272,129.30774 C616.69272,130.01485 616.51594,131.871 616.69272,132.48972 C616.8695,133.10844 616.16239,132.6665 616.42756,134.61104 L616.42756,134.61104 Z\" id=\"irkutsk\" data-territory-id=\"30\" class=\"territory\"></path>\n				<path d=\"M389.44628,51.26083 C388.20884,51.17244 387.32496,50.90727 387.32496,50.90727 C387.32496,50.90727 388.25,54.875 387.625,55.375 C387,55.875 388.375,59 387.625,59.5 C386.875,60 386.5,65.75 386.5,68.375 C386.5,71 387.875,75.125 387.5,77.25 C387.125,79.375 388.125,82.375 388.125,82.375 C388.125,82.375 388.75,83 388.75,84.625 C388.75,86.25 389.625,87.125 389.625,87.125 C389.625,87.125 390.0625,87.25 390.125,87.8125 C390.1875,88.375 390.1875,89.25 389.9375,89.5 C389.6875,89.75 389.125,90.1875 389.125,91.125 C389.125,92.0625 389.375,92.4375 389.0625,92.875 C388.75,93.3125 388.5,93.4375 388.375,94.5 C388.25,95.5625 388.0625,97 388.3125,97.5625 C388.5625,98.125 389,100.25 388.125,100 C387.25,99.75 389.125,100.375 389.625,100.75 C390.125,101.125 388.5,101.875 387.625,102.125 C386.75,102.375 386,102.375 384.75,102.25 C383.5,102.125 383.875,101.875 382.875,102 C381.875,102.125 379.75,102.75 378.625,102.5 C377.5,102.25 376.875,102.375 376.125,102.875 C375.375,103.375 375.875,104.375 375.875,105.5 C375.875,106.625 376.625,105.875 376.75,107.125 C376.875,108.375 377.125,108.125 377.5,108.875 C377.875,109.625 378.5,109 378.5,109 C378.5,109 380.625,110.75 380.375,111.875 C380.125,113 380.875,113.75 380.875,114.75 C380.875,115.75 379.75,115 378.125,114.875 C376.5,114.75 377.5,114 376.875,112.25 C376.25,110.5 376.375,111.625 375.375,111.25 C374.375,110.875 374.375,111.5 374.125,112.625 C373.875,113.75 373.75,113.875 372.875,114.625 C372,115.375 372.75,116 372.5,117.125 C372.25,118.25 371.875,118.125 371.125,119 C370.375,119.875 371.375,120.375 371.75,121.625 C372.125,122.875 372.625,123.375 372.625,123.375 C373.125,123.875 373,124.375 373,125.125 C373,125.875 372.5,126.25 372,126.625 L373.25,126.75 C373.25,126.75 374.3125,127.6875 374.375,128 C374.4375,128.3125 375.5625,129.25 375.5625,129.25 C375.5625,129.25 378.0625,130.625 378.9375,130.625 C379.8125,130.625 380.8125,130.0625 381.3125,130 C381.8125,129.9375 381.25,130.875 381.25,131.1875 C381.25,131.5 381.9375,134.4375 382.25,135.0625 C382.5625,135.6875 382.625,143.125 382.6875,144.5 C382.75,145.875 384.0625,147.25 384.4375,147.5625 C384.8125,147.875 385.0625,148.625 385.0625,148.9375 C385.0625,149.25 384.25,150.3125 384.1875,150.75 C384.125,151.1875 384.3125,151.9375 384.25,152.5 C384.1875,153.0625 383.75,153.3125 383.25,153.75 C382.75,154.1875 382.875,155.1875 382.5625,155.8125 C382.25,156.4375 381.75,156.4375 381.125,156.6875 C380.5,156.9375 378.8125,160.3125 378.625,160.6875 C378.4375,161.0625 376.6875,161.6875 376.125,161.6875 C375.5625,161.6875 374.0625,162.125 373.875,162.625 C373.6875,163.125 373.6875,164.125 373.6875,164.125 L376,166.3125 C376.25,166.25 376.5,165.5 376.75,165.125 C377,164.75 377.9375,164.6875 377.9375,164.6875 C377.9375,164.6875 379.5625,164.625 380.25,165.0625 C380.9375,165.5 380.5,165.8125 380.5625,167.125 C380.625,168.4375 380.625,168.1875 380.8125,168.8125 C381,169.4375 381.3125,169.1875 382.4375,169.5 C383.5625,169.8125 383.1875,169.6875 384.0625,169.8125 C384.9375,169.9375 384.75,170.5625 385.1875,171.5 C385.625,172.4375 385.6875,173.125 386.125,173.9375 C386.5625,174.75 386.5625,175.25 386.5625,175.5 C386.5625,175.75 386.25,177 386.1875,177.6875 C386.125,178.375 385.8125,178.5 385.6875,178.8125 C385.5625,179.125 385.625,180 385.625,180.3125 C385.625,180.625 386.0625,181.0625 386.4375,181.5 C386.8125,181.9375 386.8125,182.3125 386.8125,183 C386.8125,183.6875 386.25,184.75 386.25,185.375 C386.25,186 387.1875,186.4375 387.0625,187 C386.9375,187.5625 389.25,189.25 389.25,189.25 L390.25,188.5 C390.25,188.5 391.25,188.375 392,187.625 C392.75,186.875 392.5,186.5 392.5,186.5 C392.5,186.5 392.75,184.125 393.125,183.625 C393.5,183.125 394,183.375 395.625,183 C397.25,182.625 396.625,183 397.375,183 C398.125,183 398.625,183.5 399.375,183.75 C400.125,184 400,184.5 400.25,185.5 C400.5,186.5 400.75,187.125 400.875,188 C401,188.875 401,189 401.375,189.875 C401.75,190.75 402.125,190.625 403.125,191.25 C404.125,191.875 403.5,191.75 405,192.5 C406.5,193.25 405.75,191.375 406.25,190.5 C406.75,189.625 407,189.625 407.5,189.375 C408,189.125 408.375,188.875 409,188.375 C409.625,187.875 409.375,187.875 409.75,187 C410.125,186.125 409.625,185.75 409.375,185.25 C409.125,184.75 408.625,185.375 408,185.375 C407.375,185.375 406.625,184.625 406,183.875 C405.375,183.125 405.875,182.875 405.875,182.875 C405.875,182.875 406.75,181.875 407.625,181.25 C408.5,180.625 408.375,180.75 409.125,180.5 C409.875,180.25 410.375,180.25 411,180 C411.625,179.75 412.125,179.625 413.375,179.375 C414.625,179.125 414.125,179.375 415.5,179.375 C416.875,179.375 417.125,179.125 417.125,179.125 C417.125,179.125 417.5,178.625 418.125,178.25 C418.75,177.875 419,178.125 419.375,178.625 C419.75,179.125 419.125,179.875 419.125,179.875 L417.625,181.375 C416.75,182.25 416.625,181.75 415,182 C413.375,182.25 414.5,182.25 414.375,183.125 C414.25,184 413.625,184.75 413.625,184.75 L413.125,186 L414,186.5 C414,186.5 414.375,187.25 414.625,188.25 C414.875,189.25 415.375,188.625 416,188.875 C416.625,189.125 415.875,189.875 415.875,190.625 C415.875,191.375 417,192 417.625,192.625 C418.25,193.25 418,193.5 418.625,194.625 C419.25,195.75 419.125,194.25 419.625,194 C420.125,193.75 420.375,193.75 421.5,193.625 C422.625,193.5 422.75,193.75 422.75,193.75 L422.125,195.25 C422.125,195.25 422.875,195.75 423.75,196.625 C424.625,197.5 424,198.25 425.125,198.25 C426.25,198.25 425.875,198.75 426.375,199.125 C426.875,199.5 427.375,200.125 428.25,200.875 C429.125,201.625 429,201.375 429.75,201.5 C430.5,201.625 430.125,201.625 430.5,204.5 C430.875,207.375 431.25,204.75 431.25,204.75 C431.25,204.75 431,205.5 430.625,206 C430.25,206.5 429.75,206.75 429.25,207.25 C428.75,207.75 428.125,208.25 428.125,208.75 C428.125,209.25 428.75,209.25 430.125,210.25 C431.5,211.25 431.5,209.75 431.5,209.75 C431.5,209.75 432.125,209.375 433.75,209.5 C435.375,209.625 435.125,209.125 435.125,209.125 C435.125,209.125 435.875,208.25 436.875,208.125 C437.875,208 437.75,208.125 438.625,208 C439.5,207.875 439.5,207.5 440.125,207 C440.75,206.5 441.375,206.875 442,206.75 C442.625,206.625 443.875,206.5 443.875,206.5 C446,206.125 444.125,206.125 444.25,205.25 C444.375,204.375 445.25,204.375 445.25,204.375 C445.25,204.375 446,204.5 446.5,204 C447,203.5 447.25,203.25 447.25,202.625 C447.25,202 446.625,201 446.625,201 C446.625,201 445.75,200.375 445.75,199.625 C445.75,198.875 445.875,198.625 446.125,198.125 C446.375,197.625 446.125,196.75 446.125,195.25 C446.125,193.75 446.125,193.625 446.25,192.625 C446.375,191.625 447,192.125 447.75,191.625 C448.5,191.125 447.5,189.875 447.5,189.875 C447.5,189.875 447,189.875 445.875,189.5 C444.75,189.125 444.25,189.125 443.5,187.625 C442.75,186.125 443.125,186.5 443,185.875 C442.875,185.25 442.25,185 442.5,183.5 C442.75,182 441.50702,180.57298 441.50702,180.57298 L440.44636,180.21943 C440.44636,180.21943 439.73925,179.86587 439.56247,179.15877 C439.3857,178.45166 439.73925,178.27488 439.91603,177.21422 C440.0928,176.15356 439.3857,175.0929 439.3857,175.0929 L438.14826,176.15356 C438.14826,176.15356 439.91603,173.32514 440.0928,172.44125 C440.26958,171.55737 440.0928,171.38059 440.44636,170.67348 C440.79991,169.96638 441.15346,170.14315 442.21412,169.7896 C443.27478,169.43605 443.62834,168.72894 443.62834,168.72894 C443.62834,168.72894 444.15867,167.31473 443.98189,165.90051 C443.80511,164.4863 443.62834,163.95597 443.62834,162.71853 C443.62834,161.4811 442.21412,161.83465 442.21412,161.83465 L441.15346,160.42044 C441.15346,160.42044 440.0928,160.06688 439.56247,159.183 C439.03214,158.29912 439.56247,157.76879 439.73925,156.70813 C439.91603,155.64747 439.20892,155.29391 439.20892,155.29391 C439.20892,155.29391 438.32504,153.17259 437.97148,152.11193 C437.61793,151.05127 437.79471,150.52094 437.61793,149.63706 C437.44115,148.75317 437.79471,148.22284 438.32504,147.51574 C438.85537,146.80863 439.56247,145.74797 440.62313,145.39442 C441.68379,145.04086 440.26958,143.80343 440.26958,143.80343 C440.26958,143.80343 441.50702,140.09112 442.21412,140.09112 C442.92123,140.09112 442.92123,140.09112 445.57288,139.91434 C448.22453,139.73756 446.98709,139.03046 447.51742,138.32335 C448.04775,137.61624 449.28519,137.79302 449.9923,137.61624 C450.6994,137.43947 450.6994,137.61624 451.40651,137.61624 C452.11362,137.61624 454.58849,136.90914 454.58849,136.90914 C454.58849,136.90914 456.17948,135.49492 456.88659,135.14137 C457.5937,134.78782 458.3008,134.25749 458.3008,134.25749 L459.53824,135.49492 L460.95245,135.6717 C460.95245,135.6717 462.54344,136.37881 463.42733,136.55558 C464.31121,136.73236 464.66476,136.90914 465.54865,136.73236 C466.43253,136.55558 466.60931,136.20203 467.31641,134.78782 C468.02352,133.3736 468.2003,133.02005 468.37707,131.78261 C468.55385,130.54517 471.73583,130.54517 472.61972,130.19162 C473.5036,129.83807 473.68038,129.48451 474.74104,128.95418 C475.8017,128.42385 474.74104,127.36319 474.74104,125.59543 C474.74104,123.82766 474.21071,123.65088 474.03393,122.41345 C473.85715,121.17601 473.5036,120.82246 473.32682,119.93857 C473.15005,119.05469 474.91781,118.17081 475.62492,116.75659 C476.33203,115.34238 475.62492,114.81205 475.44814,113.57461 C475.27137,112.33718 473.68038,112.33718 473.68038,112.33718 L470.49839,110.21585 L469.08418,109.50875 C469.08418,109.50875 468.9074,108.09453 469.08418,106.50354 C469.26096,104.91255 470.14484,104.38222 470.85195,103.14479 C471.55905,101.90735 471.55905,100.49314 471.55905,99.60925 C471.55905,98.72537 469.79129,98.37182 469.79129,98.37182 L469.79129,94.30595 L469.79129,89.53298 C469.79129,88.29554 469.08418,85.99745 468.55385,85.11356 C468.02352,84.22968 469.08418,82.63869 469.08418,82.63869 C469.08418,82.63869 468.2003,80.69415 468.02352,79.81026 C467.84674,78.92638 469.08418,75.03729 469.08418,75.03729 L471.02872,70.26432 L472.26616,68.143 C472.26616,68.143 472.26616,64.96102 472.79649,64.25391 C473.32682,63.54681 473.15005,60.18805 473.15005,60.18805 C473.15005,60.18805 472.44294,53.47054 471.73583,53.02859 C471.02873,52.58665 470.76356,52.05632 470.05645,51.17244 C469.34935,50.28855 468.02352,51.08405 467.05125,51.08405 C466.07898,51.08405 465.10671,50.99566 464.04605,50.81888 C462.98539,50.64211 462.72022,50.37694 461.3944,50.11178 C460.06857,49.84661 459.18469,50.99566 458.83113,51.70277 C458.47758,52.40988 458.12403,52.67504 457.06337,54.26603 C456.00271,55.85702 455.91432,54.61958 454.58849,55.2383 C453.26267,55.85702 453.35106,54.35442 452.37878,54.00087 C451.40651,53.64731 450.16908,54.35442 449.10841,54.35442 C448.04775,54.35442 448.13614,54.08925 446.81032,53.20537 C445.48449,52.32149 445.48449,52.67504 443.62834,54.44281 C441.77218,56.21057 441.94896,55.59186 440.62313,55.32669 C439.29731,55.06153 438.67859,56.56413 438.67859,56.56413 C438.67859,56.56413 436.2921,58.86222 435.67339,59.21578 C435.05467,59.56933 432.57979,60.27644 431.69591,61.51388 C430.81203,62.75131 431.51913,62.30937 429.83976,63.19325 C428.16038,64.07714 428.51393,63.28164 428.51393,62.22098 C428.51393,61.16032 428.51393,61.77904 429.13265,60.36483 C429.75137,58.95061 429.13265,59.74611 428.51393,59.48094 C427.89521,59.21578 427.45327,58.68545 426.83455,57.80156 C426.21583,56.91768 426.21583,56.56413 425.50873,55.85702 C424.80162,55.14991 423.38741,56.65252 422.14997,56.47574 C420.91253,56.29896 421.00092,56.47574 420.11704,56.56413 C419.23315,56.65252 420.02865,57.35962 420.29381,58.15512 C420.55898,58.95061 420.73576,58.86222 421.35447,59.56933 C421.97319,60.27644 421.26609,61.51388 421.26609,62.22098 C421.26609,62.92809 421.08931,63.01648 421.35447,63.81197 C421.61964,64.60747 422.06158,64.3423 422.94546,64.96102 C423.82935,65.57974 423.47579,65.93329 423.29902,66.72879 C423.12224,67.52428 422.32675,66.6404 421.35447,66.55201 C420.3822,66.46362 419.76348,67.87784 418.79121,68.40817 C417.81894,68.9385 417.377,68.76172 416.40473,68.85011 C415.43245,68.9385 415.60923,69.46883 414.01824,70.97143 C412.42725,72.47403 412.33886,71.59015 411.18981,71.59015 C410.04077,71.59015 410.48271,70.97143 409.15688,70.08754 C407.83106,69.20366 408.53816,70.17593 407.56589,70.52949 C406.59362,70.88304 407.65428,71.59015 408.273,72.56242 C408.89172,73.53469 409.06849,74.2418 409.24527,74.59535 C409.42205,74.9489 409.24527,75.03729 407.83106,76.53989 C406.41684,78.0425 406.7704,76.62828 405.70974,76.62828 C404.64908,76.62828 404.91424,76.71667 403.85358,76.80506 C402.79292,76.89345 403.14647,76.36312 403.14647,75.65601 L403.14647,73.53469 C403.14647,72.03209 402.61614,72.38564 402.35098,72.03209 C402.08581,71.67854 402.35098,71.23659 402.1742,70.79465 C401.99743,70.35271 401.29032,69.73399 400.84838,69.73399 C400.40644,69.73399 399.169,69.82238 398.90383,69.46883 C398.63867,69.11527 398.10834,68.58494 397.31284,68.23139 C396.51735,67.87784 395.63346,66.99395 395.27991,66.6404 C394.92636,66.28685 395.27991,65.8449 395.3683,65.40296 C395.45669,64.96102 397.04768,64.3423 398.3735,64.51908 C399.69933,64.69586 402.52776,65.04941 404.73746,65.04941 L408.89172,65.04941 C409.7756,65.04941 411.89692,64.60747 413.04597,64.3423 C414.19502,64.07714 415.69762,63.28164 416.22795,62.66292 C416.75828,62.04421 416.40473,61.86743 416.31634,60.71838 C416.22795,59.56933 415.8744,59.12739 415.0789,58.42028 C414.28341,57.71318 414.37179,57.27123 411.01304,55.06153 C407.65428,52.85182 407.83106,54.35442 406.50523,54.44281 C405.17941,54.5312 405.35618,53.91248 404.38391,53.64731 C403.41164,53.38215 401.37871,53.47054 399.69933,53.47054 C398.01995,53.47054 397.93156,53.7357 396.60574,53.38215 C395.27991,53.02859 395.89863,52.58665 394.74958,52.49826 C393.60053,52.40988 393.33537,52.67504 392.3631,52.32149 C391.39082,51.96793 391.12566,51.4376 390.41855,51.17244 C389.71145,50.90727 390.68372,51.34922 389.44628,51.26083 L389.44628,51.26083 Z\" id=\"ukraine\" data-territory-id=\"15\" class=\"territory\"></path>\n				<path d=\"M376,166.3125 C376.25,166.25 376.5,165.5 376.75,165.125 C377,164.75 377.9375,164.6875 377.9375,164.6875 C377.9375,164.6875 379.5625,164.625 380.25,165.0625 C380.9375,165.5 380.5,165.8125 380.5625,167.125 C380.625,168.4375 380.625,168.1875 380.8125,168.8125 C381,169.4375 381.3125,169.1875 382.4375,169.5 C383.5625,169.8125 383.1875,169.6875 384.0625,169.8125 C384.9375,169.9375 384.75,170.5625 385.1875,171.5 C385.625,172.4375 385.6875,173.125 386.125,173.9375 C386.5625,174.75 386.5625,175.25 386.5625,175.5 C386.5625,175.75 386.25,177 386.1875,177.6875 C386.125,178.375 385.8125,178.5 385.6875,178.8125 C385.5625,179.125 385.625,180 385.625,180.3125 C385.625,180.625 386.0625,181.0625 386.4375,181.5 C386.8125,181.9375 386.8125,182.3125 386.8125,183 C386.8125,183.6875 386.25,184.75 386.25,185.375 C386.25,186 387.1875,186.4375 387.0625,187 C386.9375,187.5625 389.25,189.25 389.25,189.25 C389.25,189.25 388.125,190 388.625,190.75 C389.125,191.5 389.75,192.125 389.5,192.625 C389.25,193.125 389.375,193.125 388.75,193.625 C388.125,194.125 387.75,194 387.75,195.125 C387.75,196.25 388.625,196.5 388,197.5 C387.375,198.5 387.625,198.375 387.125,199.125 C386.625,199.875 386.375,200.5 386.125,201.25 C385.875,202 386.625,202.125 385.75,202.875 C384.875,203.625 384.625,203.25 384.375,204.125 C384.125,205 384.5,205 384,205.625 C383.5,206.25 383.5,206.625 383,207 C382.5,207.375 382.5,207.25 381.875,208 C381.25,208.75 381.75,209.125 381.25,209.75 C380.75,210.375 380.375,209.875 380.125,210.75 C379.875,211.625 380.125,211.25 380.25,212.125 C380.375,213 381,213 380.25,214 C379.5,215 379.125,215.625 378.625,216 C378.125,216.375 378.125,215.875 377.75,217 C377.375,218.125 378,218.5 377.25,218.75 C376.5,219 376.125,219 375.375,219.125 C374.625,219.25 374.25,219 373.75,219.125 C373.25,219.25 373,219.125 372.625,219.75 C372.25,220.375 371.875,220.25 372.375,221 C372.875,221.75 372.75,221.75 373.25,222.25 L374.625,223.625 C375.125,224.125 375.5,224.375 375.625,225 C375.75,225.625 375.75,226.125 375.75,226.125 C375.75,226.125 376.375,228 375.875,228.25 C375.375,228.5 374.875,228.5 374.75,229.25 C374.625,230 374.5,229.75 374.75,230.625 C375,231.5 374.75,231.5 375.25,232 C375.75,232.5 375.875,232.5 376.625,233.25 C377.375,234 378.25,234.125 377.75,234.75 C377.25,235.375 376.625,235.5 375.875,235.25 C375.125,235 374.75,235.625 374.25,234.5 C373.75,233.375 373.5,233.125 373.5,233.125 C373.5,233.125 372.75,233.25 372.75,233.875 C372.75,234.5 374.625,234.625 372.25,234.625 C369.875,234.625 370.125,235.375 369.5,234.625 C368.875,233.875 369.375,233.625 368.5,233.375 C367.625,233.125 367.5,233.875 367.125,233.125 C366.75,232.375 366.625,232.375 366.625,231.25 C366.625,230.125 367.25,230.125 366.875,228.625 C366.5,227.125 366.25,227.5 366,226.625 C365.75,225.75 366,225.75 366,224.625 C366,223.5 365.625,223 365.625,223 C365.625,223 365.25,222.75 365,221.5 C364.75,220.25 364.875,220.125 364.625,219 C364.375,217.875 364.5,217.5 363.875,217.5 C363.25,217.5 363.625,218 362.625,217.25 C361.625,216.5 362.125,216.25 361.25,215.875 C360.375,215.5 360.25,216.25 360,215 C359.75,213.75 359.75,214.375 359.75,212.875 L359.75,210.25 C359.75,209.625 360.25,209.625 359.5,208.625 C358.75,207.625 358.875,207.375 358,207.25 C357.125,207.125 357.375,208.125 356.625,206.875 C355.875,205.625 355.75,204.875 354.75,204.625 C353.75,204.375 353.875,205 353.375,204.375 C352.875,203.75 353.125,203.625 352.5,203 C351.875,202.375 352.625,202.125 351,202.125 C349.375,202.125 349.375,201.25 348.5,201.625 C347.625,202 347.375,202.625 347.375,203.25 C347.375,203.875 347.375,203.875 347.5,204.75 C347.625,205.625 347.375,206.125 348,206.25 C348.625,206.375 348.625,205.75 348.75,206.875 C348.875,208 348.625,209.125 350.125,208.5 C351.625,207.875 352.5,207 352.625,207.75 C352.75,208.5 352.5,208.625 352.75,209.625 C353,210.625 352.75,211.5 353.625,212.125 C354.5,212.75 354.875,212.75 355.25,213.25 C355.625,213.75 355.5,213.625 356,213.875 C356.5,214.125 356.5,215.25 357.125,216.125 C357.75,217 358.5,216.25 358.125,217.375 C357.75,218.5 357.75,219 357.25,219.375 C356.75,219.75 355.625,220.125 354.875,219.5 C354.125,218.875 353.5,218.375 353.5,218.375 C353.5,218.375 354.125,217.125 352.625,217.5 C351.125,217.875 351.125,218 350.5,218 C349.875,218 349.5,217 349.75,218.375 C350,219.75 351,220.25 351,220.25 C351,220.25 352.125,220.25 352,221.5 C351.875,222.75 352.375,222.375 351.75,223.625 C351.125,224.875 351.25,224.625 350.75,225.75 C350.25,226.875 350.75,226.875 350.125,227.75 C349.5,228.625 349.25,229.125 348.375,229.5 C347.5,229.875 347.5,229.125 347.125,230.5 C346.75,231.875 346.875,231.875 346.25,232.125 C345.625,232.375 344.25,232.375 343.75,232.75 C343.25,233.125 344.125,233.625 342.75,233.25 C341.375,232.875 341.75,232.875 341.125,232.75 C340.5,232.625 340.25,232.625 339.75,232 C339.25,231.375 339.625,230.25 339.125,230.625 C338.625,231 338.25,232.375 337.75,231 C337.25,229.625 337.375,229.5 336.875,229.25 C336.375,229 336.125,230.5 336,228.875 C335.875,227.25 335.625,227.25 336.375,226.5 C337.125,225.75 337.375,225.5 338,225.5 C338.625,225.5 338.75,225.625 339.5,225.75 C340.25,225.875 340.125,226.5 340.75,226.625 C341.375,226.75 343.25,225.625 343.5,226.375 C343.75,227.125 343.25,229.375 343.875,227.375 C344.5,225.375 344.125,225 345,224.25 C345.875,223.5 346.75,222.75 347.125,222.25 C347.5,221.75 347.875,221 347,220.125 C346.125,219.25 345.875,220.125 345.875,218.5 C345.875,216.875 346.125,216.5 345.625,215.625 C345.125,214.75 345.625,215 344.625,214.5 C343.625,214 343.625,213.75 343.125,213.125 C342.625,212.5 341.75,212 340.875,211.75 C340,211.5 340.625,212.125 339.75,210.75 C338.875,209.375 338.625,209 337.875,209.125 C337.125,209.25 337.5,210.25 336.75,209.375 C336,208.5 336.25,208.375 335.75,208 C335.25,207.625 335,208 334.375,207.5 C333.75,207 333.75,207 333.625,206 C333.5,205 333.75,204.625 333.125,204.125 C332.5,203.625 331.25,203.25 331.25,203.25 C331.25,203.25 331.5,203 329.875,203.25 C328.25,203.5 328.125,203.5 327.625,203.875 C327.625,203.875 330.04931,203.02362 328.45832,201.60941 C326.86733,200.19519 326.16022,198.42743 326.86733,198.25065 C327.57444,198.07387 328.45832,197.36677 328.6351,196.65966 C328.81187,195.95255 329.07704,194.53834 328.72349,194.0964 C328.36993,193.65446 326.51378,192.41702 326.51378,192.41702 C326.51378,192.41702 325.45312,191.53313 325.62989,191.17958 C325.80667,190.82603 326.69055,189.85376 326.69055,189.85376 C326.69055,189.85376 327.75121,190.03053 327.75121,188.52793 C327.75121,187.02533 327.75121,186.22983 327.39766,185.34595 C327.04411,184.46207 326.95572,183.75496 327.57444,183.13624 C328.19316,182.51752 328.90026,181.54525 329.07704,181.1917 C329.25382,180.83814 329.25382,180.21943 330.40286,180.3962 C331.55191,180.57298 331.81708,180.30781 332.61257,179.95426 C333.40807,179.60071 334.20356,178.62844 334.20356,178.62844 C334.20356,178.62844 335.52939,178.45166 335.52939,178.8936 C335.52939,179.33554 336.41327,181.8988 337.29715,181.54525 C338.18104,181.1917 339.86042,180.74976 340.65591,180.30781 C341.45141,179.86587 341.36302,179.42393 342.42368,179.51232 C343.48434,179.60071 343.66112,179.77748 344.81016,179.42393 C345.95921,179.07038 346.57793,178.98199 347.10826,178.27488 C347.63859,177.56778 349.49475,175.97679 349.49475,175.0929 L349.49475,173.05997 C349.49475,173.05997 353.29545,172.52964 354.17933,172.44125 C355.06321,172.35286 355.9471,172.35286 356.47743,171.99931 C357.00776,171.64576 357.00776,170.93865 357.4497,170.85026 C357.89164,170.76187 359.30585,171.02704 359.30585,171.02704 C359.30585,171.02704 359.30585,171.2922 359.7478,171.38059 C360.18974,171.46898 361.07362,172.44125 360.89684,173.23675 C360.72007,174.03224 360.18974,174.91613 360.01296,175.26968 C359.83618,175.62323 359.39424,176.77228 359.48263,177.12583 C359.57102,177.47939 360.54329,178.8936 360.54329,178.8936 L360.54329,182.78269 L369.73568,182.78269 C369.73568,182.78269 370.44279,181.28009 370.3544,180.57298 C370.26601,179.86587 369.47051,178.80521 369.47051,178.45166 C369.47051,178.09811 369.64729,175.26968 369.64729,175.26968 C369.64729,175.26968 370.17762,172.35286 371.50345,171.46898 C372.82927,170.5851 373.62477,170.23154 373.71315,169.7896 C373.80154,169.34766 373.97832,168.46378 374.42026,168.287 C374.8622,168.11022 375.56931,167.40312 375.56931,167.40312 C375.56931,167.40312 375.30414,167.40312 376,166.3125 L376,166.3125 Z\" id=\"southern_europe\" data-territory-id=\"19\" class=\"territory\"></path>\n				<path d=\"M330.40286,180.3962 C329.25382,180.21943 329.25382,180.83814 329.07704,181.1917 C328.90026,181.54525 328.19316,182.51752 327.57444,183.13624 C326.95572,183.75496 327.04411,184.46207 327.39766,185.34595 C327.75121,186.22983 327.75121,187.02533 327.75121,188.52793 C327.75121,190.03053 326.69055,189.85376 326.69055,189.85376 C326.69055,189.85376 325.80667,190.82603 325.62989,191.17958 C325.45312,191.53313 326.51378,192.41702 326.51378,192.41702 C326.51378,192.41702 328.36993,193.65446 328.72349,194.0964 C329.07704,194.53834 328.81187,195.95255 328.6351,196.65966 C328.45832,197.36677 327.57444,198.07387 326.86733,198.25065 C326.16022,198.42743 326.86733,200.19519 328.45832,201.60941 C330.04931,203.02362 329.03921,203.34467 329.03921,203.34467 C329.03921,203.34467 328.125,203.5 327.625,203.875 C327.125,204.25 327.5,204.25 327,204.875 C326.5,205.5 326.625,205.625 325.75,205.875 C324.875,206.125 325.625,206.625 324.75,206.5 C323.875,206.375 324,206.75 323.5,206.25 C323,205.75 323.375,205.125 322.5,205.125 C321.625,205.125 321.25,205.25 321.625,204.5 C322,203.75 322.5,203.75 321.5,203.75 C320.5,203.75 320.625,204 319.375,203.75 C318.125,203.5 317.625,203.625 317.125,203.625 L315.75,206.125 C315.75,206.125 315.875,206.625 315.75,207.25 C315.625,207.875 315.125,208.375 315.125,208.375 C315.125,208.375 314.75,208.75 314.75,209.5 C314.75,210.25 315,210.375 314.25,211.125 C313.5,211.875 313.5,212.125 313,212.375 C312.5,212.625 312.5,212.5 312.125,213 C311.75,213.5 311.5,213.5 311.25,214.125 C311,214.75 311,214.75 311.375,215.375 C311.75,216 312,216.75 312,216.75 C312,216.75 312.375,216.875 312.125,218 C311.875,219.125 311.75,219.875 311.75,219.875 C311.75,219.875 311.75,220.375 311.875,221.375 C312,222.375 312.875,223.5 312.875,223.5 L313.5,224.375 C313.5,224.375 313.875,225.875 314,226.625 C314.125,227.375 315.25,227.125 314.125,228.125 C313,229.125 311.375,229.75 310.25,231.625 C309.125,233.5 309.5,235 308.625,236 C307.75,237 308.5,237.125 307.375,237.125 C306.25,237.125 305.25,235.875 304.625,237.125 C304,238.375 303.625,239.5 302.75,239.625 C301.875,239.75 301.75,238.25 301.75,240 C301.75,241.75 301.375,242.875 301.375,242.875 C301.375,242.875 301.125,243.75 300.25,243.625 C299.375,243.5 299.25,243.375 298.5,243.25 C297.75,243.125 297.75,243.625 297.125,242.875 C296.5,242.125 296.375,241.75 296.125,241.125 C295.875,240.5 295.875,240.25 294.875,240.125 C293.875,240 293.875,240.375 293.375,239.5 C292.875,238.625 292.625,238.375 291.875,238.5 C291.125,238.625 291.125,239.125 290.125,238.125 C289.125,237.125 289.125,236.375 288.625,236.5 C288.125,236.625 287.5,237.5 287.5,237.5 C287.5,237.5 287.625,238 286.125,237.875 C284.625,237.75 284.375,237.5 283.25,237.5 C282.125,237.5 282,238.25 281,237.75 C280,237.25 279.875,237.125 279.875,236.5 C279.875,235.875 280,235 279.5,234.5 C279,234 279.625,233.375 278.875,233 C278.125,232.625 278.5,232.75 277.625,232.75 C276.75,232.75 276.75,232.875 275.875,232.375 C275,231.875 274.625,232.625 275,231.25 C275.375,229.875 275.125,230 275.75,229 C276.375,228 276.375,228 276.75,226.875 C277.125,225.75 277.25,225.5 277.875,223.875 C278.5,222.25 278.75,222.75 278.75,221.5 C278.75,220.25 278.25,220.25 279,219.375 C279.75,218.5 279.875,218.5 279.75,217.5 C279.625,216.5 280,216.75 279.5,216 C279,215.25 277.75,214.125 277.25,213.625 C276.75,213.125 276.875,213.75 276.625,212.25 C276.375,210.75 275.875,211 275.625,210.125 C275.375,209.25 275.375,209.25 275.375,208.125 C275.375,207 274.5,207.375 274.5,206.75 C274.5,206.125 274.125,205.625 275,205.125 C275.875,204.625 276,205 277.125,204 C278.25,203 278.25,203.25 278.5,202.375 C278.75,201.5 279.625,201 279.625,201 C279.625,201 279.5,201.125 280.25,201.875 C281,202.625 281.125,202.625 281.25,203.125 C281.375,203.625 280.875,203.75 282.375,204.125 C283.875,204.5 283.5,204.625 285,204.625 C286.5,204.625 286.875,204.75 287.5,204.5 C288.125,204.25 288.75,203.875 288.75,203.875 C288.75,203.875 289.25,203.5 290.125,203.5 C291,203.5 291.125,203.375 291.875,203.625 C292.625,203.875 292,204 292.75,203.875 C293.5,203.75 293.625,204 294.25,203.625 C294.875,203.25 295.25,203.875 295.625,202.75 C296,201.625 295.625,201.25 296.625,200.5 C297.625,199.75 298,199.5 299,199.5 C300,199.5 298.375,197.875 297.75,197.75 C297.125,197.625 296.75,198.25 296.75,197.625 C296.75,197 296.625,196.875 297,195.875 C297.375,194.875 298.125,194.25 298.125,194.25 C298.125,194.25 298,193.75 297.875,192.875 C297.75,192 299.5,191.5 298.375,190.75 C297.25,190 296.75,189.625 296,189.625 C295.25,189.625 295.375,190.875 294.75,189.375 C294.125,187.875 294.625,187.625 294,186.875 C293.375,186.125 293.125,186.375 292.5,185.5 C291.875,184.625 292.75,184.75 291.375,183.75 C290,182.75 289.125,182.5 288.5,182.5 C287.875,182.5 287.625,183.375 287.75,182.125 C287.875,180.875 287.875,180.5 288.75,179.75 C289.625,179 291.875,178.375 292.75,178.25 C293.625,178.125 292.25,177.75 294.125,178.125 C296,178.5 295.375,178.5 296.25,178.625 C297.125,178.75 298.75,179.25 298.75,179.25 C298.75,179.25 299,177.375 299.5,176.75 C300,176.125 300.125,176.125 300.5,175.125 C300.875,174.125 301,174 302.25,173.625 C303.5,173.25 304.375,174.25 304.375,174.25 C304.375,174.25 302.75,175.875 304,175.25 C305.25,174.625 303.625,172.625 306.375,173 C309.125,173.375 310.125,175 310.5,173.125 C310.875,171.25 310.5,171.25 311.125,170.25 C311.75,169.25 311.75,169.25 312.875,168.625 C314,168 313.75,166.125 315.125,165.875 C316.5,165.625 316,165.875 317.25,165.625 C318.5,165.375 318.375,165.625 319.125,164.75 C319.125,164.75 320.3125,165.0625 320.25,165.5 C320.1875,165.9375 321.25,168.6875 321.25,168.6875 C321.25,168.6875 322.5625,169.5 323.4375,170.75 C324.3125,172 324.75,173.125 325.1875,173.25 C325.625,173.375 325.875,173.375 326,174.1875 C326.125,175 326.1875,175.125 326.5625,175.625 C326.9375,176.125 327.5,176.0625 327.625,176.8125 C327.75,177.5625 327.9375,178.375 328.25,178.75 C328.5625,179.125 329.5,179.8125 329.5,179.8125 C329.5,179.8125 330.3125,180.5625 330.40286,180.3962 L330.40286,180.3962 Z\" id=\"western_europe\" data-territory-id=\"18\" class=\"territory\"></path>\n				<path d=\"M372,126.625 L373.25,126.75 C374.09679,127.54371 374.70175,128.4675 375.5625,129.25 C375.5625,129.25 378.0625,130.625 378.9375,130.625 C379.8125,130.625 380.8125,130.0625 381.3125,130 C381.8125,129.9375 381.25,130.875 381.25,131.1875 C381.25,131.5 381.9375,134.4375 382.25,135.0625 C382.5625,135.6875 382.625,143.125 382.6875,144.5 C382.75,145.875 384.0625,147.25 384.4375,147.5625 C384.8125,147.875 385.0625,148.625 385.0625,148.9375 C385.0625,149.25 384.25,150.3125 384.1875,150.75 C384.125,151.1875 384.3125,151.9375 384.25,152.5 C384.1875,153.0625 383.75,153.3125 383.25,153.75 C382.75,154.1875 382.875,155.1875 382.5625,155.8125 C382.25,156.4375 381.75,156.4375 381.125,156.6875 C379.43993,158.9867 379.02741,161.02502 376.125,161.6875 C375.5625,161.6875 374.0625,162.125 373.875,162.625 C373.6875,163.125 373.6875,164.125 373.6875,164.125 L376,166.3125 C375.30414,167.40312 375.56931,167.40312 375.56931,167.40312 C375.56931,167.40312 374.8622,168.11022 374.42026,168.287 C373.97832,168.46378 373.80154,169.34766 373.71315,169.7896 C373.62477,170.23154 372.82927,170.5851 371.50345,171.46898 C370.17762,172.35286 369.64729,175.26968 369.64729,175.26968 C369.64729,175.26968 369.47051,178.09811 369.47051,178.45166 C369.47051,178.80521 370.26601,179.86587 370.3544,180.57298 C370.44279,181.28009 369.73568,182.78269 369.73568,182.78269 L360.54329,182.78269 L360.54329,178.8936 C360.54329,178.8936 359.57102,177.47939 359.48263,177.12583 C359.39424,176.77228 359.83618,175.62323 360.01296,175.26968 C360.18974,174.91613 360.72007,174.03224 360.89684,173.23675 C361.07362,172.44125 360.18974,171.46898 359.7478,171.38059 C359.30585,171.2922 359.30585,171.02704 359.30585,171.02704 C359.30585,171.02704 357.89164,170.76187 357.4497,170.85026 C357.00776,170.93865 357.00776,171.64576 356.47743,171.99931 C355.9471,172.35286 355.06321,172.35286 354.17933,172.44125 C353.29545,172.52964 349.49475,173.05997 349.49475,173.05997 L349.49475,175.0929 C349.49475,175.97679 347.63859,177.56778 347.10826,178.27488 C346.57793,178.98199 345.95921,179.07038 344.81016,179.42393 C343.66112,179.77748 343.48434,179.60071 342.42368,179.51232 C341.36302,179.42393 341.45141,179.86587 340.65591,180.30781 C339.86042,180.74976 338.18104,181.1917 337.29715,181.54525 C336.41327,181.8988 335.52939,179.33554 335.52939,178.8936 C335.52939,178.45166 334.20356,178.62844 334.20356,178.62844 C334.20356,178.62844 333.40807,179.60071 332.61257,179.95426 C331.81708,180.30781 331.55191,180.57298 330.40286,180.3962 C329.25381,180.21942 329.5,179.8125 329.5,179.8125 C329.5,179.8125 328.5625,179.125 328.25,178.75 C327.9375,178.375 327.75,177.5625 327.625,176.8125 C327.5,176.0625 326.9375,176.125 326.5625,175.625 C326.1875,175.125 326.125,175 326,174.1875 C325.875,173.375 325.625,173.375 325.1875,173.25 C324.75,173.125 324.3125,172 323.4375,170.75 C322.5625,169.5 321.25,168.6875 321.25,168.6875 C321.25,168.6875 320.1875,165.9375 320.25,165.5 C320.3125,165.0625 319.125,164.75 319.125,164.75 C319.875,163.875 320.5,161.625 321.125,161.375 C321.75,161.125 322.125,161.75 322.5,159.75 C322.875,157.75 322.25,158.125 322.875,157.625 C323.5,157.125 324.25,157.75 324.625,156.375 C325,155 324.875,154.75 324.875,154.125 C324.875,153.5 323.125,153.5 325.5,153 C327.875,152.5 328,153.25 328.5,152.25 C329,151.25 329,151.5 329.25,150.5 C329.5,149.5 330,149.75 330.625,148.75 C331.25,147.75 330.875,147.75 331.25,146.875 C331.625,146 331.625,142.75 332.25,142.5 C332.875,142.25 332.875,143 333.25,142 C333.625,141 333.25,140.75 334,139.75 C334.75,138.75 334.875,138.875 335.625,138.375 C336.375,137.875 336.5,138 336.75,137.375 C337,136.75 335.875,136.875 337.625,135.625 C339.375,134.375 339.25,134.875 339.5,134.25 C339.75,133.625 340,133.25 340.125,132.625 C340.25,132 340.125,132 340.25,131.125 C340.375,130.25 340.25,130.875 340.375,129.375 C340.5,127.875 340.75,126.875 340.875,126.25 C341,125.625 341.125,125.25 340.5,125.375 C339.875,125.5 339.75,126.5 339.625,125.375 C339.5,124.25 339.25,123.875 339,123.25 C338.75,122.625 338.375,121.5 338.375,121.5 C338.375,121.5 337.875,121 338.375,120.25 C338.875,119.5 339.5,118.375 339.5,118.375 C339.5,118.375 339.875,118 340.5,117.875 C341.125,117.75 341.25,118 341.75,117.375 C342.25,116.75 341.25,116.625 342.5,116.5 C343.75,116.375 344,116.375 344,116.375 L343.25,117.5 L343.125,118.5 C343.125,118.5 344.5,119.25 344.75,120.75 C345,122.25 345.25,122.375 345.125,123.125 C345,123.875 344.875,126.875 344.875,126.875 C344.875,126.875 344.875,127.875 345.625,128.5 C346.375,129.125 346.875,129.375 347.625,129.5 C348.375,129.625 349.75,129.75 350.375,129.5 C351,129.25 351.625,129.125 352.25,129.5 C352.875,129.875 353.625,129.5 354.125,129.25 C354.625,129 355.25,128.75 355.875,128.625 C356.5,128.5 357,128.5 358.25,128.5 C359.5,128.5 359.875,128.75 360.375,128.25 C360.875,127.75 360.75,128.125 361.375,127.625 C362,127.125 363.25,126.5 363.875,126.5 C364.5,126.5 364.5,126.375 365.25,126.25 C366,126.125 367,125.625 368,126 C369,126.375 369.375,126.5 370.25,126.625 C371.125,126.75 371.5,127 372,126.625 L372,126.625 Z\" id=\"northern_europe\" data-territory-id=\"17\" class=\"territory\"></path>\n				<path d=\"M384.58492,292.29585 C384.40814,291.41197 380.69583,292.47263 379.81195,292.11907 C378.92807,291.76552 378.39774,291.05841 378.39774,291.05841 C378.39774,291.05841 377.69063,288.93709 377.51385,287.87643 C377.33708,286.81577 374.8622,288.05321 373.97832,287.87643 C373.09444,287.69966 373.80154,286.46222 373.44799,285.22478 C373.09444,283.98735 371.68022,284.51768 370.79634,284.51768 C369.91245,284.51768 368.49824,283.81057 367.2608,282.92669 C366.02337,282.0428 365.66981,283.28024 364.2556,283.45702 C362.84139,283.63379 362.84139,283.28024 362.31106,282.39636 C361.78073,281.51247 360.01296,282.92669 358.42197,282.74991 C356.83098,282.57313 357.18453,281.86603 356.30065,280.45181 C355.41677,279.0376 354.53288,280.09826 352.58834,279.56793 C350.6438,279.0376 351.3509,278.86082 351.17413,277.44661 C350.99735,276.0324 349.75991,276.20917 349.75991,276.20917 C349.75991,276.20917 349.58313,274.61818 349.40636,273.38074 C349.22958,272.14331 349.58313,270.19876 349.58313,269.49166 C349.58313,268.78455 349.22958,266.1329 347.99214,265.60257 C346.75471,265.07224 347.63859,263.8348 347.63859,263.8348 C347.63859,263.8348 347.10826,262.06704 347.28504,261.18315 C347.46181,260.29927 348.69925,259.23861 349.58313,259.23861 C350.46702,259.23861 350.99735,258.17795 350.99735,258.17795 C350.99735,258.17795 349.58313,256.05663 348.87603,254.81919 C348.16892,253.58176 350.11347,253.75853 350.11347,253.75853 L350.99735,252.69787 C350.99735,252.69787 351.3509,252.16754 352.94189,251.28366 C354.53288,250.39977 353.625,248.375 353.625,248.375 C353.625,248.375 355.25,248.5 356.875,248.75 C358.5,249 358.25,249.75 359.25,250.75 C360.25,251.75 360.625,252 362.75,252.75 C364.875,253.5 365,253.875 366.375,253.875 C367.75,253.875 370,252.625 370.875,252.25 C371.75,251.875 373.25,251.75 379.25,251.375 C385.25,251 385.25,254.875 386.625,254.375 C388,253.875 389.5,254.375 390.25,254.625 C391,254.875 393.125,255.625 394.375,255.625 C395.625,255.625 397,256.375 397.5,256.625 C398,256.875 403.75,258.125 404.375,258.125 L406,256.625 L407.25,257 C407.25,257 408.25,257.5 408.75,257.5 C409.25,257.5 409.5,256.625 409.5,256.625 L411.5,255.375 L413.75,259.75 C413.75,259.75 412.75,262.375 412.75,263.125 C412.75,263.875 412.625,265.75 412.125,265.875 C411.625,266 411,265.75 410.25,265.25 C409.5,264.75 408.75,263.375 407.625,262.625 C406.5,261.875 407.625,265.125 407.625,265.125 C407.5,265.625 410,269 414.375,275 C418.75,281 414.875,278 415.75,279.5 C416.625,281 417.5,281.5 417.75,283.75 C418,286 417.875,284.875 418.25,286 L418,285.75 C418.125,287.375 390.75,285.75 389.125,286.25 C387.5,286.75 387.875,291.5 387.25,291.25 C386.625,291 384.58492,292.29585 384.58492,292.29585 L384.58492,292.29585 Z\" id=\"egypt\" data-territory-id=\"21\" class=\"territory\"></path>\n				<path d=\"M384.05459,317.7517 C384.05459,317.7517 383.52426,315.63038 382.64038,314.39294 C381.75649,313.1555 382.28682,311.74129 382.28682,310.8574 C382.28682,309.97352 382.64038,309.44319 383.17071,308.73608 C383.70104,308.02898 383.34748,307.67542 383.34748,307.67542 L384.23137,305.90766 C384.23137,305.90766 384.7617,304.49344 384.7617,303.25601 C384.7617,302.01857 384.05459,302.5489 383.34748,302.37212 C382.64038,302.19535 383.17071,302.01857 384.23137,301.48824 C385.29203,300.95791 384.93847,299.72047 385.11525,298.65981 C385.29203,297.59915 384.7617,293.17973 384.58492,292.29585 C384.58492,292.29585 386.625,291 387.25,291.25 C387.875,291.5 387.5,286.75 389.125,286.25 C390.75,285.75 418.125,287.375 418,285.75 L418.25,286 C418.625,287.125 419.5,287 419.5,287 C419.5,287 421.5,288.5 421.75,289.25 C422,290 422.25,289.5 422.25,290.125 C422.25,290.75 422.625,293 423.125,294.5 C423.625,296 423.75,295.25 424.75,296.125 C425.75,297 425,296.875 425,298.875 C425,300.875 426,300.375 427,302 C428,303.625 427.125,302.875 427.625,304.25 C428.125,305.625 428.25,306.25 428.75,307.25 C429.25,308.25 429.5,308 430.125,308 C430.75,308 430.875,308.375 430.875,309.875 C430.875,311.375 433.25,311.875 434.25,313.375 C435.25,314.875 435.375,314.375 436,315.375 C436.625,316.375 436,316.125 435.375,318.25 C434.75,320.375 435.5,320.5 436.125,321.5 C436.75,322.5 440.125,322.375 440.125,322.375 C440.125,322.375 443.125,322.125 444.25,321.5 C445.375,320.875 445.25,320.625 445.75,320.25 C446.25,319.875 449.75,320.25 452.25,319.625 C454.75,319 458,316.625 459.5,319.25 C461,321.875 455.75,332.25 453.5,337.25 C451.25,342.25 445,347.25 441.125,351 C437.25,354.75 434.875,359.375 434.625,359.875 C434.375,360.375 433.375,361.375 432.875,361.625 C432.375,361.875 431.875,362.25 430.875,363.5 C429.875,364.75 429.25,364.25 427.875,365.25 C426.5,366.25 426.75,367.25 426.75,368 C426.75,368.75 426.375,370.375 426,370.875 C425.625,371.375 426.5,373.875 426.5,374.75 C426.5,375.625 426.25,377.625 426.25,377.625 C426.25,377.625 426.25,378 427.625,378.75 C429,379.5 428.125,384 428.125,384 L428.375,384.5 C428.375,384.5 426.75,386.125 425.625,386.125 C424.5,386.125 423,387.5 423,387.5 C423,387.5 422.375,387.625 421.125,388 C419.875,388.375 418.875,388.25 417.75,389.75 C416.625,391.25 417.25,391.125 418.125,394 C419,396.875 417.75,395.125 417.375,396.125 C417,397.125 417.375,399.25 417.375,400.5 C417.375,401.75 416.5,402.25 415.875,402.75 C415.25,403.25 413.25,401.25 412.5,400 C411.75,398.75 412.5,396.75 413,395.25 C413.5,393.75 411.875,391.625 411.5,390.375 C411.125,389.125 411.25,389 411.875,387.875 C412.5,386.75 412,387 411.625,385.25 C411.25,383.5 410.25,383.625 409.875,382.875 C409.5,382.125 408.375,380.625 407.375,380.625 C406.375,380.625 406.875,379 406.625,378.125 C406.375,377.25 404.625,377.625 404,377.875 C403.375,378.125 403.25,377.25 402.875,374.5 C402.5,371.75 401.75,364.75 401.875,363.625 C402,362.5 404.75,364.625 405.25,363.875 C405.75,363.125 405.875,357.5 405.625,356 C405.375,354.5 407.75,355.125 409.25,355 C410.75,354.875 411,353 411.625,351.75 C412.25,350.5 412.875,350.625 413.5,350.375 C414.125,350.125 414,348.875 414.75,347.875 C415.5,346.875 416.5,345.125 416.5,343.75 C416.5,342.375 414.625,341 412.375,340.875 C410.125,340.75 410.625,341.875 407.5,341.125 C404.375,340.375 403.75,340.5 402.75,340.25 C401.75,340 401.875,338.375 400.75,338 C399.625,337.625 398.25,340.125 398.25,340.125 C398.25,340.125 397,339.75 395.75,336.75 C394.5,333.75 392.75,332.875 392.25,332.75 C391.75,332.625 391.625,329.125 391.625,328.5 C391.625,327.875 389.375,327.125 388.875,326.375 C388.375,325.625 388,324.5 387.125,324.25 C386.25,324 385.625,324 385.25,321.875 C384.875,319.75 384.05459,317.7517 384.05459,317.7517 L384.05459,317.7517 Z\" id=\"east_africa\" data-territory-id=\"23\" class=\"territory\"></path>\n				<path d=\"M404,377.875 C403.375,378.125 403.25,377.25 402.875,374.5 C402.5,371.75 401.75,364.75 401.875,363.625 C402,362.5 404.75,364.625 405.25,363.875 C405.75,363.125 405.875,357.5 405.625,356 C405.375,354.5 407.75,355.125 409.25,355 C410.75,354.875 411,353 411.625,351.75 C412.25,350.5 412.875,350.625 413.5,350.375 C414.125,350.125 414,348.875 414.75,347.875 C415.5,346.875 416.5,345.125 416.5,343.75 C416.5,342.375 414.625,341 412.375,340.875 C410.125,340.75 410.625,341.875 407.5,341.125 C404.375,340.375 403.75,340.5 402.75,340.25 C401.75,340 401.875,338.375 400.75,338 C399.625,337.625 398.25,340.125 398.25,340.125 C398.25,340.125 397,339.75 395.75,336.75 C394.5,333.75 392.75,332.875 392.25,332.75 C391.75,332.625 391.625,329.125 391.625,328.5 C391.625,327.875 389.375,327.125 388.875,326.375 C388.375,325.625 388,324.5 387.125,324.25 C386.25,324 385.625,324 385.25,321.875 C385.25,321.875 384.75,318.25 384.08979,317.87585 C384.05459,317.7517 381.75649,320.22657 381.75649,321.11045 C381.75649,321.99434 382.28682,323.055 379.98873,324.11566 C377.69063,325.17632 376.27642,325.88342 374.8622,326.41375 C373.44799,326.94408 372.91766,328.00474 372.03378,328.53507 C371.14989,329.0654 369.91245,329.0654 369.02857,329.77251 C368.14469,330.47962 367.43758,330.47962 366.90725,331.54028 C366.37692,332.60094 365.66981,330.83317 365.49304,333.30804 C365.31626,335.78292 365.84659,337.02036 365.84659,337.02036 C365.84659,337.02036 367.43758,335.07581 367.08403,338.9649 C366.73047,342.85399 365.84659,343.20754 366.37692,344.62175 C366.90725,346.03597 367.2608,346.38952 365.84659,347.2734 C364.43238,348.15729 363.19494,347.2734 363.19494,347.2734 C363.19494,347.2734 362.84139,345.68241 361.2504,346.03597 C359.65941,346.38952 359.48263,347.09663 357.89164,346.74307 C356.30065,346.38952 354.70966,346.38952 354.70966,346.38952 C354.70966,346.38952 352.76512,347.98051 352.05801,347.62696 C351.3509,347.2734 351.3509,346.74307 350.82057,345.68241 L350.1875,345.5 C349.125,345.125 349,347.625 349,347.625 C349.375,348.75 350.375,349.25 349.875,349.75 C349.375,350.25 348.75,351.75 348.125,352.625 C347.5,353.5 344.875,354.75 345.875,355.875 C346.875,357 353.5,362.25 354.875,365.375 L356.125,367.125 C356.75,368 359,366.125 359.75,366.75 C360.5,367.375 362.5,368.75 363.25,369.125 C364,369.5 368.125,368.875 369.125,369.625 C370.125,370.375 370.875,370 370.875,370 C370.875,370 370.25,374.25 370.875,374.875 C371.5,375.5 373,376.25 373.875,375 C374.75,373.75 381.25,373 381.625,374 C382,375 381,377 382.25,378 C383.5,379 384.375,379.75 384.25,380.75 C384.125,381.75 382.875,382.75 383.375,384.125 C383.875,385.5 385.25,386 386.75,385.875 C388.25,385.75 388.125,386.875 389.375,387.125 C390.625,387.375 395.5,387.375 396,387.75 C396.5,388.125 397.75,389 398.125,389.625 C398.5,390.25 399.875,392.5 400.75,391.625 C401.625,390.75 402.625,386.125 401.25,385.625 C399.875,385.125 399,385.125 399,383.625 C399,382.125 399.75,379.5 400.25,379.5 C400.75,379.5 401.375,378.875 401.375,378.875 C401.375,378.875 405.25,378.875 404,377.875 L404,377.875 Z\" id=\"congo\" data-territory-id=\"22\" class=\"territory\"></path>\n				<path d=\"M356.125,367.125 C356.75,368 359,366.125 359.75,366.75 C360.5,367.375 362.5,368.75 363.25,369.125 C364,369.5 368.125,368.875 369.125,369.625 C370.125,370.375 370.875,370 370.875,370 C370.875,370 370.25,374.25 370.875,374.875 C371.5,375.5 373,376.25 373.875,375 C374.75,373.75 381.25,373 381.625,374 C382,375 381,377 382.25,378 C383.5,379 384.375,379.75 384.25,380.75 C384.125,381.75 382.875,382.75 383.375,384.125 C383.875,385.5 385.25,386 386.75,385.875 C388.25,385.75 388.125,386.875 389.375,387.125 C390.625,387.375 395.5,387.375 396,387.75 C396.5,388.125 397.75,389 398.125,389.625 C398.5,390.25 399.875,392.5 400.75,391.625 C401.625,390.75 402.625,386.125 401.25,385.625 C399.875,385.125 399,385.125 399,383.625 C399,382.125 399.75,379.5 400.25,379.5 C400.75,379.5 401.375,378.875 401.375,378.875 C401.375,378.875 405.25,378.875 404,377.875 C404.625,377.625 406.375,377.25 406.625,378.125 C406.875,379 406.375,380.625 407.375,380.625 C408.375,380.625 409.5,382.125 409.875,382.875 C410.25,383.625 411.25,383.5 411.625,385.25 C412,387 412.5,386.75 411.875,387.875 C411.25,389 411.125,389.125 411.5,390.375 C411.875,391.625 413.5,393.75 413,395.25 C412.5,396.75 411.75,398.75 412.5,400 C413.25,401.25 415.25,403.25 415.875,402.75 C416.5,402.25 417.375,401.75 417.375,400.5 C417.375,399.25 417,397.125 417.375,396.125 C417.75,395.125 419,396.875 418.125,394 C417.25,391.125 416.625,391.25 417.75,389.75 C418.875,388.25 419.875,388.375 421.125,388 C422.375,387.625 423,387.5 423,387.5 C423,387.5 424.5,386.125 425.625,386.125 C426.75,386.125 428.375,384.5 428.375,384.5 L428.125,384 C428.125,384 431,383.125 430.5,384.125 C430,385.125 431.375,388.75 431.375,388.75 C431.375,388.75 431.5,389.5 431.75,390.5 C432,391.5 431.875,391.625 432,392.625 C432.125,393.625 431.625,394.125 431.5,394.875 C431.375,395.625 431.625,396.25 431.75,397.25 C431.875,398.25 431.125,400.5 430.875,401.125 C430.625,401.75 429.875,401.75 429.375,402.25 C428.875,402.75 428.75,403.5 427.625,404.625 C426.5,405.75 426.75,405.75 426,406.875 C425.25,408 425.875,407.375 424.75,409.125 C423.625,410.875 424.125,409.625 423,410 C421.875,410.375 421.25,411.625 420.75,411.75 C420.25,411.875 418.875,413.125 418.125,417.75 C417.375,422.375 418.875,423.25 418.5,424.125 C418.125,425 415.75,428.375 415.375,429.375 C415,430.375 414.625,430.25 413.5,430.75 C412.375,431.25 412.75,433.25 412.75,434 C412.75,434.75 412,437.25 410.625,438.5 C409.25,439.75 410.5,439.625 410.875,440.125 C411.25,440.625 411.25,441.25 411,442.875 C410.75,444.5 409.375,443.625 408.625,444.125 C407.875,444.625 405.5,447.375 405.75,448.375 C406,449.375 407,449.25 407,449.25 C407,449.25 405.375,451 403.875,452.875 C402.375,454.75 404,454 404.375,455.25 C404.75,456.5 403.5,455.5 402.75,455.5 C402,455.5 401.875,455.875 401.125,456.5 C400.375,457.125 399.875,457 396.375,457.75 C392.875,458.5 395,459 393.25,460.25 C391.5,461.5 391.625,461.875 386.75,461.875 C381.875,461.875 383.5,462.375 382.625,462.75 C381.75,463.125 381.125,463.125 380.125,463.125 C379.125,463.125 378.375,463.625 377.75,464 C377.125,464.375 376.625,465.375 376.625,465.375 C376.625,465.375 376.125,465.125 375.625,464.25 C375.125,463.375 374,463.75 373.125,463.625 C372.25,463.5 372.125,463.375 371.25,462.25 C370.375,461.125 371.5,460.75 371.5,460.125 C371.5,459.5 370.75,457.5 370.75,456.5 L370.75,453.75 C370.75,452.5 370.625,452.5 370.625,451.125 C370.625,449.75 370.625,449.625 370.25,448.875 C369.875,448.125 368.875,447.25 368.625,445.875 C368.375,444.5 368.625,444 368.625,442.875 C368.625,441.75 367.375,442.375 367.125,441.875 C366.875,441.375 366.25,440.875 365.75,439.375 C365.25,437.875 365.875,438 365.875,436.75 L365.875,434.375 C365.875,433.375 365.125,433 364.875,432.375 C364.625,431.75 363.125,429.125 363,428.25 C362.875,427.375 362.75,426.875 362.75,425.75 C362.75,424.625 362.875,424.75 363,423.875 C363.125,423 362.375,422.5 362.375,421.875 C362.375,421.25 359.125,418.125 359.125,418.125 C359.125,418.125 358.75,417.875 358.625,417.125 C358.5,416.375 357.875,415.875 356.75,414.5 C355.625,413.125 356.125,413.125 356.25,412.125 C356.375,411.125 356.125,410.125 356,409.5 C355.875,408.875 354.625,406.125 354.625,406.125 C354.625,406.125 354.5,404.875 354.75,403.875 C355,402.875 355.375,402.625 355.5,401.125 C355.625,399.625 355.5,400 355.625,399.125 C355.75,398.25 355.875,398.25 356.25,397.5 C356.625,396.75 357.25,396.125 357.25,395 C357.25,393.875 358,392.875 358.25,392.375 C358.5,391.875 359,391.375 359.75,390.25 C360.5,389.125 359.375,389.5 359.5,388.5 C359.625,387.5 359.375,386.75 359.25,386 C359.125,385.25 357.25,382.875 356.75,381.5 C356.25,380.125 358.5,378.75 360.25,376 L360.3125,376 C362.3125,373.0625 356.125,368.3125 356.125,367.125 L356.125,367.125 Z\" id=\"south_africa\" data-territory-id=\"24\" class=\"territory\"></path>\n				<path d=\"M213.375,266.625 C213.375,266.625 209.04566,270.19876 208.51533,271.25942 C207.985,272.32008 207.63145,274.61818 206.39401,274.79496 C205.15657,274.97174 197.73195,275.32529 197.73195,275.32529 C197.73195,275.32529 198.08551,277.44661 197.02485,277.44661 C195.96419,277.44661 185.53436,277.09306 185.53436,277.09306 L184.12015,272.85041 C184.12015,272.85041 182.88271,273.7343 182.70593,271.96653 C182.52916,270.19876 182.52916,267.37034 182.52916,267.37034 C182.52916,267.37034 179.87751,268.78455 178.28652,269.31488 C176.69553,269.84521 175.28131,272.49686 173.8671,271.96653 C172.45289,271.4362 171.74578,269.66843 171.39223,271.08265 C171.03867,272.49686 171.569,276.7395 170.50834,277.09306 C169.44768,277.44661 169.09413,276.82789 168.21025,277.88855 C167.32636,278.94921 164.93988,279.21438 164.23277,278.59566 C163.52566,277.97694 162.99533,277.26983 162.19984,277.00467 C161.40434,276.7395 160.9624,276.29756 160.07852,276.20917 C159.19463,276.12078 159.01786,275.67884 158.31075,276.47434 C157.60364,277.26983 156.10104,278.59566 155.83588,279.30276 C155.57071,280.00987 154.1565,282.57313 154.51005,283.5454 C154.8636,284.51768 156.27782,284.25251 156.27782,286.02028 C156.27782,287.78805 155.74749,288.67193 154.77522,288.93709 C153.80294,289.20226 148.94159,290.79325 148.94159,290.79325 C148.94159,290.79325 144.875,290.75 144.75,291.375 C144.625,292 144.875,295.875 143.875,296.625 C142.875,297.375 140.125,297 140,298 C139.875,299 137.875,299.625 138.625,301 C139.375,302.375 140.75,303.625 141.75,303.625 C142.75,303.625 144,303.75 144.125,304.75 C144.25,305.75 147.75,305.875 149.125,306.625 C150.5,307.375 154,305.5 153.75,307.625 C153.5,309.75 149.875,310.125 149.625,311.5 C149.375,312.875 149.25,315.875 152,315.75 C154.75,315.625 157.25,313.75 159.125,313.375 C161,313 162.875,313 163.375,312.5 C163.875,312 164.25,310.75 165.25,310.625 C166.25,310.5 168.625,311.625 169.375,312.875 C170.125,314.125 170.25,315.25 171.75,315.375 C173.25,315.5 172.75,316.375 173.875,316.875 C175,317.375 176,316.875 177,317.5 C178,318.125 178,320.25 179.625,320.25 C181.25,320.25 183.5,319.125 184.125,320.375 C184.75,321.625 185.375,323.375 186.125,324.125 C186.875,324.875 186.375,325.875 186.625,326.625 C186.875,327.375 188.375,327.5 189.5,328.375 C190.625,329.25 190.75,329.75 191.125,331.5 C191.5,333.25 192.375,333.25 193.125,334.75 C193.875,336.25 195.125,339.5 194.875,340.625 C194.625,341.75 193.875,343.125 195.375,344 C196.875,344.875 197.5,345.375 198.375,346.75 C199.25,348.125 199.875,347.625 200.5,348.125 C201.125,348.625 201.5,350.5 201.875,353.125 C202.25,355.75 205.125,356.75 205.25,358.5 C205.375,360.25 205.5,361.5 204.875,361.625 C204.25,361.75 203,362.875 202.875,364.625 C202.75,366.375 199.5,367.25 199.5,367.25 C199.5,367.25 197.375,368.75 197.625,369.75 C197.875,370.75 202.625,370 202.625,370.625 C202.625,371.25 201.875,375.75 202.375,375.875 C202.875,376 206.125,374.875 206.625,375.5 C207.125,376.125 206,380 206.25,380.375 C206.5,380.75 209.375,382.875 210.0625,382.3125 C211.375,381.875 210.625,381.75 210.875,381 C211.125,380.25 211.125,380.375 211.75,379.5 C212.375,378.625 212,378.625 212.25,377.875 C212.5,377.125 212.875,376.5 213.375,376 C213.875,375.5 214.125,375.375 214.375,374.625 C214.625,373.875 214.5,373.5 214.625,372.25 C214.75,371 216.25,370.875 217.625,370.375 C219,369.875 218.875,368.375 219,367.125 C219.125,365.875 218.625,366.75 218.625,365.375 C218.625,364 218.5,363.5 218.375,362.125 C218.25,360.75 218.5,361.625 219.125,361 C219.75,360.375 219.75,357.625 221.25,354.5 C222.75,351.375 233.75,350.5 234.25,350.375 C234.75,350.25 237.625,349.25 238,348.75 C238.375,348.25 239.625,347.125 240.625,346.625 C241.625,346.125 241,345.25 241.25,344.125 C241.5,343 241.75,343.375 242.375,343.125 C243,342.875 242.875,342.125 243.5,341.25 C244.125,340.375 243.5,339.5 243.875,338.75 C244.25,338 245.375,337.75 246.25,337.375 C247.125,337 246.625,335.75 247.375,335 C248.125,334.25 247.375,331.625 247.375,330 C247.375,328.375 247.375,328.25 248.125,327.25 C248.875,326.25 247.875,324.25 247.875,324.25 L248.125,322.5 C248.125,322.5 247.75,320.5 248,319.5 C248.25,318.5 249.25,318 250.75,317 C252.25,316 251.25,313.75 251.25,313.75 L251.25,312 C251.25,312 253.5,311 255.25,311 C257,311 257,308.5 258.5,307 C260,305.5 259.25,304 259.5,302.75 C259.75,303.25 259.25,302 258.875,300.875 C258.5,299.75 258.75,299.25 258.5,297.5 C258.25,295.75 257.25,295 256.25,294 C255.25,293 253.875,293.25 253,293 C252.125,292.75 251.625,291.125 250.75,290.875 C249.875,290.625 246.5,288.25 244.625,288 C242.75,287.75 242.625,287.875 241.75,286.875 C240.875,285.875 240.375,286.5 239.75,286.5 C239.125,286.5 238.125,287 237.375,286.5 C236.625,286 236.25,286.25 235.125,286.25 C234,286.25 233,285.875 232.5,285 C232,284.125 232,284 231.25,283.625 C230.5,283.25 229.625,283.5 228.875,283.125 C228.125,282.75 227.25,282.375 226.5,282.25 C225.75,282.125 224.875,282.375 224.125,282.25 C223.375,282.125 221.625,281.75 221,281.75 C220.375,281.75 218.5,282.125 217.625,282.125 C216.75,282.125 215.25,280.625 214,280.125 C212.75,279.625 215.125,280 217,277.75 C218.875,275.5 216.25,274.125 215.75,273.25 C215.25,272.375 215.125,271.625 214.375,269 C213.625,266.375 213.375,266.625 213.375,266.625 L213.375,266.625 Z\" id=\"brazil\" data-territory-id=\"11\" class=\"territory\"></path>\n				<path d=\"M205.25,358.5 C205.375,360.25 205.5,361.5 204.875,361.625 C204.25,361.75 203,362.875 202.875,364.625 C202.75,366.375 199.5,367.25 199.5,367.25 C199.5,367.25 197.375,368.75 197.625,369.75 C197.875,370.75 202.625,370 202.625,370.625 C202.625,371.25 201.875,375.75 202.375,375.875 C202.875,376 206.125,374.875 206.625,375.5 C207.125,376.125 206,380 206.25,380.375 C206.5,380.75 209.375,382.875 210.03125,382.28125 C208.625,382.625 205.375,384.125 206,385 C206.625,385.875 207.5,386.125 206,386.5 C204.5,386.875 204.75,386.75 203.25,387 C201.75,387.25 202,387.125 200.375,387.5 C198.75,387.875 198.5,388.375 197.5,388.5 C196.5,388.625 196,388.375 195.375,388.375 C194.75,388.375 194.25,388.375 194.25,389 C194.25,389.625 194.125,389.75 194.75,390.25 C195.375,390.75 197.125,391.25 197.25,391.75 C197.375,392.25 197.375,392.625 197.375,393.5 C197.375,394.375 197.5,394.5 198,394.625 C198.5,394.75 198.625,394.875 198.75,395.375 C198.875,395.875 197.5,397.625 196.75,398.125 C196,398.625 195.375,399.25 193.625,399.375 C191.875,399.5 192.25,399.25 191.125,399.875 C190,400.5 190,400.625 188.75,400.625 C187.5,400.625 187.125,400.625 185.875,400.875 C184.625,401.125 183.75,401.375 183.75,401.375 C183.75,401.375 184.25,402.125 184.375,402.875 C184.5,403.625 185.125,403.75 184.625,404.875 C184.125,406 183.25,406.5 182.875,407 C182.5,407.5 182.5,407.25 182.5,408.25 L179.875,408.625 C179.875,408.625 179,407.875 178.75,409 C178.5,410.125 179.75,411.125 179.75,411.125 C179.75,411.125 178,413.75 178.25,414.375 C178.5,415 179.125,416 178.875,416.5 C178.625,417 178.75,417.25 178.125,417.75 C177.5,418.25 178,418.75 177.625,419.25 C177.25,419.75 176.875,420.5 176,420.875 C175.125,421.25 174.875,421.875 174.875,421.875 L174.25,423 C174.25,423 173.75,423.625 174.375,424.375 C175,425.125 175.625,424.625 175.25,426 C174.875,427.375 175,427.75 175,427.75 C175,427.75 176.25,426.375 176.125,430.125 C176,433.875 175.375,434.75 175.375,434.75 C175.375,434.75 174.75,434.625 175,435.75 C175.25,436.875 175.75,437.875 175.125,438.5 C174.5,439.125 174.625,438.125 173.625,440.125 C172.625,442.125 173.625,444.875 174.25,445.5 C174.875,446.125 175.375,446.25 175.25,447.5 C175.125,448.75 174.5,448.875 175,449.75 C175.5,450.625 177.125,451.25 177.375,452.125 C177.625,453 177.125,453.625 177.625,454.25 C178.125,454.875 178.75,455.375 178.75,455.375 C178.75,455.375 178.5,456.375 178.5,457.5 C178.5,458.625 178,458.5 178,459.5 C178,460.5 178,461.75 178.5,460.5 C179,459.25 178.875,459.25 179.375,458.75 C179.875,458.25 181.5,458.25 182,458.25 C182.5,458.25 183,457.5 183.875,457.875 C184.75,458.25 184.875,457.875 185.375,459.125 C185.875,460.375 185.625,460.625 186.625,460.875 C187.625,461.125 188.5,461 189.5,461 C190.5,461 190.75,460.25 191,461.375 C191.25,462.5 192.75,462.875 191.25,463.375 C189.75,463.875 189.5,463.375 188,463.875 C186.5,464.375 186.5,464.375 186,464.5 C185.5,464.625 185.5,465 184.625,465.375 C183.75,465.75 184.25,466.125 182.625,465.75 C181,465.375 181.625,465.875 180.5,465.125 C179.375,464.375 178.875,464 178.875,463.5 C178.875,463 178.125,462.5 178.125,462.5 L175.25,460 L173.875,460 L171.875,460 C171.125,460 170.625,459.375 170.625,459.375 L168.875,459.4375 C168.875,459.4375 168.4375,459 168.6875,458.4375 C168.9375,457.875 168.9375,457.875 168.625,457.8125 C168.3125,457.75 167.4375,457.6875 166.875,457.5 C166.3125,457.3125 166.875,456.5 166.75,456.25 C166.625,456 165.4375,456 164.8125,455.9375 C164.1875,455.875 163.3125,455.5625 162.8125,454.9375 C162.3125,454.3125 162.4375,454.125 161.375,453.25 C160.3125,452.375 160.625,452.25 159.6875,451.9375 C158.75,451.625 158.4375,451.6875 158.25,450.9375 C158.0625,450.1875 157.3125,450.0625 157,449.3125 C156.6875,448.5625 157,448.0625 156.125,447.5 C155.25,446.9375 155.0625,447.375 154.9375,446.1875 C154.8125,445 155.125,444.4375 154.8125,443.8125 C154.5,443.1875 154.6875,443.6875 154.1875,442.9375 C153.6875,442.1875 153.4375,442.0625 153.25,441.1875 C153.0625,440.3125 153.0625,439.875 152.75,439.3125 C152.4375,438.75 151.875,438.5 151.8125,437.875 C151.75,437.25 151.75,437 151.75,436.4375 C151.75,435.875 151.9375,435.4375 151.625,434.1875 C151.3125,432.9375 151.5,432.625 150.875,431.875 C150.25,431.125 150.1875,431.625 149.6875,430 C149.1875,428.375 148.625,428.125 148.9375,427.3125 C149.25,426.5 149.4375,426.375 149.5,425.75 C149.5625,425.125 149.9375,425.25 150,424.375 C150.0625,423.5 150.0625,423.75 150.0625,422.5625 C150.0625,421.375 149.3125,422.875 150.1875,419.625 C151.0625,416.375 151.0625,416.5 151.125,415.75 C151.1875,415 152.375,414.875 151.9375,413.5625 C151.5,412.25 151.25,412.25 151.375,411.375 C151.5,410.5 152,410.125 151.875,409.6875 C151.75,409.25 151.9375,409.4375 151.75,408.9375 C151.5625,408.4375 152.25,408.6875 151.4375,408.0625 C150.625,407.4375 150.375,407.5625 150.25,406.625 C150.125,405.6875 150.125,404.9375 150.1875,401.25 C150.25,397.5625 150,397.3125 150.625,396.25 C151.25,395.1875 151.5625,395.0625 151.5625,394.1875 C151.5625,393.3125 152.0625,392.1875 151.6875,391.125 C151.3125,390.0625 151,389.9375 151.375,389.3125 C151.75,388.6875 152.0625,388.6875 152.0625,387.9375 C152.0625,387.1875 152.0625,388.25 152.125,386.625 C152.1875,385 151.6875,386.1875 152.3125,384.0625 C152.9375,381.9375 153.1875,379.8125 153.25,378.75 C153.3125,377.6875 153.375,377.375 153.0625,376.75 C152.75,376.125 152.3125,373.125 152.3125,372.125 C152.3125,371.125 152.5,371.375 152.75,370.375 C153,369.375 153.0625,369.1875 153,368.875 C152.9375,368.5625 153,368.25 153.1875,367.4375 C153.375,366.625 153,364.9375 153.6875,363.1875 C154.375,361.4375 154.5625,362.125 154.375,360.875 C154.1875,359.625 152.75,357.625 153.1875,356.25 C153.625,354.875 154.0625,355.125 154,353.3125 C153.9375,351.5 153.75,349.0625 154.1875,348.0625 C154.625,347.0625 154.875,343.625 154.6875,342.8125 L154.875,342.75 C155.25,339.875 153.75,337.375 153.75,337.375 C153.75,337.375 155.25,335.75 156.125,335.5 C157,335.25 157.125,337.125 156.875,338.125 C156.625,339.125 157,340.125 158.125,341.25 C159.25,342.375 160.5,343.625 161,344.5 C161.5,345.375 162.75,346.125 163,347.125 C163.25,348.125 163.625,349.125 164.875,350.125 C166.125,351.125 166.875,350 167.125,349.25 C167.375,348.5 167,346.75 167.25,345 C167.5,343.25 169.75,345.25 169.75,345.25 C169.75,345.25 170.625,347.125 171,347.75 C171.375,348.375 173,348.125 173.75,347.375 C174.5,346.625 175,346.75 175.5,346.75 C176,346.75 177,347.75 178.75,347.5 C180.5,347.25 180.625,347.125 182.125,348.5 C183.625,349.875 182.375,350.625 183.75,351.5 C185.125,352.375 185.125,351.5 186,351.875 C186.875,352.25 186.375,353.375 187.75,354.25 C189.125,355.125 192.75,354.375 194,354.875 C195.25,355.375 194,356.5 194,357.375 C194,358.25 194,360.625 193.375,360.875 C192.75,361.125 191.875,362.875 192,364.25 C192.125,365.625 195.375,364.25 196.75,363.625 C198.125,363 198.75,363.125 200.125,361.875 C201.5,360.625 205.25,358.5 205.25,358.5 L205.25,358.5 Z\" id=\"argentina\" data-territory-id=\"12\" class=\"territory\"></path>\n				<path d=\"M135.24139,127.27481 L141.51696,127.36319 C142.22407,127.71675 141.87052,132.6665 141.87052,132.6665 C141.87052,132.6665 145.22927,130.89873 147.70415,131.60584 C150.17902,132.31294 152.47712,128.42385 153.00745,130.72195 C153.53778,133.02005 154.77522,134.96459 155.30555,135.6717 C155.83588,136.37881 156.01265,137.43947 157.07331,140.26789 C158.13397,143.09632 158.6643,145.92475 157.9572,147.16218 C157.25009,148.39962 155.30555,150.16739 156.89654,151.05127 C158.48753,151.93516 159.90174,153.34937 160.78562,154.23325 C161.66951,155.11714 165.73537,151.93516 165.55859,150.69772 C165.38182,149.46028 164.85149,148.5764 165.73537,148.22284 C166.61926,147.86929 168.03347,148.39962 168.74058,147.51574 C169.44768,146.63185 170.68512,145.04086 171.74578,145.21764 C172.80644,145.39442 175.28131,144.51053 175.28131,144.51053 C175.28131,144.51053 177.04908,143.9802 177.04908,143.09632 C177.04908,143.09632 187.30213,142.83116 188.89312,141.85888 C190.48411,140.88661 190.66089,141.06339 190.66089,141.06339 C190.66089,141.06339 189.95378,137.1743 190.30733,136.90914 C190.66089,136.64397 191.45638,136.37881 192.16349,135.6717 C192.87059,134.96459 193.94642,134.9191 194.91869,135.09587 C195.89096,135.27265 199.41133,137.35108 198.96939,139.29562 C198.52745,141.24016 197.02485,144.86409 198.61584,144.95248 C200.20683,145.04086 201.44426,144.86409 201.70943,145.92475 C201.97459,146.98541 202.23976,147.7809 202.77009,147.95768 C203.30042,148.13446 205.15657,147.42735 205.125,147.125 C205.09343,146.82265 204.375,148.1875 203.6875,149.4375 C203,150.6875 202,151.625 202,151.625 C199.875,152.5 199.5,155.25 198.75,154.125 C198,153 197,153 197.875,151.375 C198.75,149.75 199.375,150 199.125,148.5 C198.875,147 199.875,146.875 198.625,146.75 C197.375,146.625 198,146.625 196.5,147.125 C195,147.625 195.125,146 193.875,148 C192.625,150 192.25,149.875 191.375,150.375 C190.5,150.875 190.875,151.5 190.25,152.25 C189.625,153 189.375,153.375 188.875,154 C188.375,154.625 188.25,154.625 188.25,156 C188.25,157.375 189.375,159.625 189.375,159.625 C189.375,159.625 188.75,161.375 188,161.75 C187.25,162.125 187.125,160.875 183.875,164.625 C180.625,168.375 181,168.75 179,169.625 C177,170.5 177.25,170.625 177.125,171.125 C177,171.625 175.625,172.25 176.375,173.375 C177.125,174.5 176.375,174.75 177.5,175.25 C178.625,175.75 179.75,174.75 179.625,176.375 C179.5,178 178.25,179.625 176.25,180.875 C174.25,182.125 171.625,186 169,186.625 C166.375,187.25 165.25,188.125 165.375,189.375 C165.5,190.625 165.375,192.125 164,192.125 C162.625,192.125 163.5,192.75 163.5,195.75 C163.5,198.75 163.75,199.625 164.375,200.75 C165,201.875 165.25,201.875 165.25,203.625 C165.25,205.375 165.25,206.625 165.125,207.125 C165,207.625 166.125,207.5 164.25,208.625 C162.375,209.75 160.75,210.375 160,208.5 C159.25,206.625 157.75,207.125 157.625,205.625 C157.5,204.125 158.125,200.5 158.125,200.5 C158.125,200.5 156.25,200 156,199 C155.75,198 155,195.625 154.5,195.25 C154,194.875 153,194 152,194.5 C151,195 149.25,196 148.625,195.875 C148,195.75 149.5,196 146,195 C142.5,194 140.875,193.5 139.375,193.375 C137.875,193.25 134.375,193.25 133.75,193.375 C133.125,193.5 127.125,194.875 126.375,194.875 C125.625,194.875 120.375,196.125 119,197.25 C117.625,198.375 117.75,200.25 116.25,200.875 C114.75,201.5 114.25,201.75 114.25,201.75 C114.25,201.75 112.75,203.5 112.625,204.5 C112.5,205.5 111.25,207.25 110.625,207.625 C110,208 109.875,207.875 110.25,209 C110.25,209 108.25,207.75 108.25,206.875 C108.25,206 109.75,204.875 110.125,203.25 C110.5,201.625 111.25,200.125 111.25,199.25 C111.25,198.375 111.125,195.75 111.125,195.75 C111.125,195.75 109.875,191.125 110.25,190.375 C110.625,189.625 108.875,189.375 108.875,189.375 C108.875,189.375 108.25,187.5 108.75,186.875 C109.25,186.25 111.125,186.25 111.625,186 C112.125,185.75 113.875,185.25 113.875,185.25 C113.875,185.25 114.875,179.75 114.875,179.125 C114.875,178.5 115.625,175.125 115.625,174.5 C115.625,173.875 119,172.625 119.5,172.375 C120,172.125 121.75,173.5 121.875,172.125 C122,170.75 121.875,167.625 122,166.75 C122.125,165.875 122.5,165.25 123,165 C123.5,164.75 134.375,164.875 134.875,164.375 C135.375,163.875 134.375,127.75 135.24139,127.27481 L135.24139,127.27481 Z\" id=\"eastern_united_states\" data-territory-id=\"7\" class=\"territory\"></path>\n				<path d=\"M135.24139,127.27481 C134.375,127.75 135.375,163.875 134.875,164.375 C134.375,164.875 123.5,164.75 123,165 C122.5,165.25 122.125,165.875 122,166.75 C121.875,167.625 122,170.75 121.875,172.125 C121.75,173.5 120,172.125 119.5,172.375 C119,172.625 115.625,173.875 115.625,174.5 C115.625,175.125 114.875,178.5 114.875,179.125 C114.875,179.75 113.875,185.25 113.875,185.25 C113.875,185.25 112.125,185.75 111.625,186 C111.125,186.25 109.25,186.25 108.75,186.875 C108.25,187.5 108.875,189.375 108.875,189.375 C108.875,189.375 110.625,189.625 110.25,190.375 C109.875,191.125 111.125,195.75 111,195.5 C110.875,195.25 107.625,195.5 106.625,195.625 C105.625,195.75 104.375,194.75 104,194.25 C103.625,193.75 103.25,193.125 102.125,193.125 C101,193.125 98.75,190.375 98.125,189.875 C97.5,189.375 89.75,189.875 88.75,189.875 C87.75,189.875 86.375,187.5 86.375,187.5 L82.5,185.375 C82.5,185.375 75.875,185.375 74.75,185.5 C73.625,185.625 73,182.125 73,182.125 C72.5,180 72.25,180.5 72.25,178.625 C72.25,176.75 69.375,173.125 68,171.125 C66.625,169.125 66.625,163.75 66.875,162.375 C67.125,161 66.625,156 67.5,153.875 C68.375,151.75 68.375,148.75 69,145.875 C69.625,143 68.875,143.625 70.375,140 C71.875,136.375 71.75,138.75 72,135.625 C72.25,132.5 73.25,134.375 73.375,131.75 C73.5,129.125 74,127.875 73.125,126.625 C73.125,126.625 72.875,127.375 73.875,127.625 C74.875,127.875 131.375,128.25 135.24139,127.27481 L135.24139,127.27481 Z\" id=\"western_united_states\" data-territory-id=\"6\" class=\"territory\"></path>\n				<path d=\"M168.74058,122.23667 C168.74058,122.23667 169.44768,118.52436 170.68512,117.64048 C171.92256,116.75659 172.62966,111.98362 172.09933,110.92296 C171.569,109.8623 170.68512,109.50875 171.39223,107.91776 C172.09933,106.32677 171.74578,103.67512 173.51355,104.20545 C175.28131,104.73578 177.04908,104.559 177.40263,103.32156 C177.75619,102.08413 177.22586,102.08413 177.40263,101.02347 C177.57941,99.96281 178.46329,99.60925 179.1704,99.43248 C179.87751,99.2557 180.40784,99.78603 179.87751,97.31116 C179.34718,94.83628 179.87751,95.89694 179.1704,94.12918 C178.46329,92.36141 178.99362,93.42207 178.28652,91.83108 C177.57941,90.24009 177.04908,87.76521 178.81685,87.58844 C180.58461,87.41166 178.64007,85.29034 179.87751,84.76001 C181.11494,84.22968 183.41304,84.93679 182.88271,82.81547 C182.35238,80.69415 179.70073,76.45151 181.4685,76.27473 C183.23626,76.09795 185.75,77 185.75,77 L192,77.375 C192,77.375 191.375,79.75 193.25,80 C195.125,80.25 195.375,81.375 196,81.75 C196.625,82.125 197.625,83 197.375,83.5 C197.125,84 197.125,84.5 197.25,85.375 C197.375,86.25 198,87.5 197.5,87.75 C197,88 196.5,88.75 196.625,89.75 C196.75,90.75 197.125,92.25 197.125,92.25 C197.125,92.25 198.125,93.625 199.375,93 C200.625,92.375 200.25,91.875 201.875,91.125 C203.5,90.375 203.5,92 204.5,90.375 C205.5,88.75 205.375,88.5 205.625,87.875 C205.875,87.25 207.125,85.625 208.125,86.125 C209.125,86.625 207.80823,91.12397 208.86889,92.71496 C209.92955,94.30595 211.375,92.125 211.5,92.875 C211.625,93.625 211.75,94.5 211.875,95.125 C212,95.75 211.125,96.25 211.875,97.25 C212.625,98.25 212.75,98.5 212.625,99.25 C212.5,100 213,100.625 213,100.625 C213,100.625 214.375,99.375 215,100.875 C215.625,102.375 215.125,103.25 216.25,103.25 C217.375,103.25 218.625,105 218.625,105 L219.125,107.625 L222,105.625 L224.75,106.5 C224.75,106.5 220.9375,108.25 221.6875,110.0625 C222.4375,111.875 226.3125,107.9375 226.25,110.375 C226.1875,112.8125 225.75,115.3125 224.8125,115.4375 C223.875,115.5625 222.375,116.375 222.25,116.9375 C222.125,117.5 220.375,118.625 219.25,118.875 C218.125,119.125 219.875,120.125 217.5,120.5 C215.125,120.875 214.375,120.75 213.875,120.75 C213.375,120.75 213.375,121.25 212.75,122.375 C212.125,123.5 212.625,123.875 212,124.375 C211.375,124.875 214.25,124.375 210.375,125.25 C206.5,126.125 205.875,126.375 205.875,126.375 C205.875,126.375 205.625,126.75 204.375,126.75 C203.125,126.75 202.625,126.125 202.625,126.125 C202.625,126.125 202.375,125.5 200.625,125.5 C198.875,125.5 197.25,127.125 197.25,127.125 C197.25,127.125 196.75,127.75 195.75,127.875 C194.75,128 193.375,129.25 193.375,129.25 C193.375,129.25 192,129.625 192.375,131.125 C192.75,132.625 194.125,134 195,133 C195.875,132 197.25,128 199.125,128.375 C201,128.75 203.5,129.5 203,132.25 C202.5,135 202.375,134.5 202.75,135.875 C203.125,137.25 204,138 203.875,139.25 C203.75,140.5 202.625,140.125 204,141.25 C205.375,142.375 206.875,144.125 207.375,142.5 C207.875,140.875 208.5,139.75 209.125,140 C209.75,140.25 211.5,139.5 210.25,142 C209,144.5 209.25,144.625 208.125,145.375 C207,146.125 207.125,144.125 205.125,147.125 C205.15657,147.42735 203.30042,148.13446 202.77009,147.95768 C202.23976,147.7809 201.97459,146.98541 201.70943,145.92475 C201.44426,144.86409 200.20683,145.04086 198.61584,144.95248 C197.02485,144.86409 198.52745,141.24016 198.96939,139.29562 C199.41133,137.35108 195.89096,135.27265 194.91869,135.09587 C193.94642,134.9191 192.87059,134.96459 192.16349,135.6717 C191.45638,136.37881 190.66089,136.64397 190.30733,136.90914 C189.95378,137.1743 190.66089,141.06339 190.66089,141.06339 C190.66089,141.06339 190.48411,140.88661 188.89312,141.85888 C187.30213,142.83116 177.04908,143.09632 177.04908,143.09632 C177.04908,142.21244 177.04908,139.20723 175.98842,139.38401 C174.92776,139.56079 175.10454,140.09112 174.39743,139.56079 C173.69032,139.03046 173.51355,138.32335 172.80644,139.03046 C172.09933,139.73756 172.45289,141.32855 171.74578,141.15178 C171.03867,140.975 169.97801,139.38401 169.27091,139.56079 C168.5638,139.73756 167.50314,141.15178 167.50314,141.15178 C167.50314,141.15178 167.85669,124.18121 168.5638,122.23667 L168.74058,122.23667 L168.74058,122.23667 Z\" id=\"quebec\" data-territory-id=\"5\" class=\"territory\"></path>\n				<path d=\"M73,182.125 C73,182.125 73.625,185.625 74.75,185.5 C75.875,185.375 82.5,185.375 82.5,185.375 L86.375,187.5 C86.375,187.5 87.75,189.875 88.75,189.875 C89.75,189.875 97.5,189.375 98.125,189.875 C98.75,190.375 101,193.125 102.125,193.125 C103.25,193.125 103.625,193.75 104,194.25 C104.375,194.75 105.625,195.75 106.625,195.625 C107.625,195.5 110.875,195.25 111.0625,195.625 C111.125,195.75 111.25,198.375 111.25,199.25 C111.25,200.125 110.5,201.625 110.125,203.25 C109.75,204.875 108.25,206 108.25,206.875 C108.25,207.75 110.25,209 110.25,209 C109.7489,211.79276 109.36384,214.46949 110.5,215.625 L110.625,217.875 L112.125,220.5 C112.125,220.5 114.375,223.75 117.25,222.875 C120.125,222 118.75,222.625 121.125,221.5 C123.5,220.375 122.75,222.75 124,220.25 C125.25,217.75 124.375,217.5 125.75,217 C127.125,216.5 126.375,216 128.125,216.5 C129.875,217 128.25,217.125 130.5,217.25 C132.75,217.375 133,214.875 132.75,217.75 C132.5,220.625 132.25,220.75 132,221.5 C131.75,222.25 132.375,221.375 131.5,223 C130.625,224.625 130.125,224.75 129.5,225.125 C128.875,225.5 128.5,225.75 128.5,226.875 C128.5,228 128.75,228.875 127.625,229.375 C126.5,229.875 125.375,229.25 125.625,230.625 C125.875,232 125.5,232.375 126.5,233 C127.5,233.625 128.25,233.75 128.875,234.875 C129.5,236 129.75,237.375 129.5,237.875 C129.25,238.375 129.375,240 128.625,240.375 C127.875,240.75 126.875,240.5 126.875,242.125 C126.875,243.75 127.625,245 126.875,245.375 C126.125,245.75 124.875,244.875 124.625,245.75 C124.375,246.625 124.25,247.375 124.125,248.125 C124,248.875 123.375,249 123.375,249.5 L123.375,251.125 C123.375,252.5 122.5,253.375 123.75,253.625 C125,253.875 125.625,254.25 126.25,253.875 C126.875,253.5 127.625,253.375 128.125,253 C128.625,252.625 129.375,251.625 130.125,251.625 C130.875,251.625 132.375,252 132.375,252 C132.375,252 133.125,253.875 133,254.5 C132.875,255.125 133.375,255 133.25,256.5 C133.125,258 133.125,259.125 132.875,259.625 C132.625,260.125 132.25,260.625 132,261.125 C131.75,261.625 132,261.625 131.75,262.375 C131.5,263.125 131.875,264.25 131.25,263.75 C130.625,263.25 131,263.25 130.625,262.75 C130.25,262.25 130,261.625 129.25,260.375 C128.5,259.125 128.625,259.875 127.125,259.125 C125.625,258.375 125.75,257.5 124.75,258 C123.75,258.5 124.125,259.375 123,258.625 C121.875,257.875 121.5,257.875 120.875,256.875 C120.25,255.875 120.375,256 120,255.25 C119.625,254.5 118.625,255 118.625,253.625 C118.625,252.25 119,252 118.625,251.25 C118.25,250.5 117.875,250.125 117.625,249.5 C117.375,248.875 117.25,249.375 117.25,248.125 L117.25,245.5 C117.25,245 116.75,243 116.75,243 L116.125,241.75 C116.125,241.75 116,241.625 115.5,240.875 C115,240.125 115,240.5 114.625,239.25 C114.25,238 113.375,236.5 113.125,235.5 C112.875,234.5 111.5,233.25 107.375,231.75 C103.25,230.25 103.5,229.875 100,229.125 C96.5,228.375 95.25,227.75 95.25,226.25 C95.25,224.75 95.25,224.25 94.375,223.75 C93.5,223.25 92.625,223.125 93,222.25 C93.375,221.375 94,221.25 94.625,220.125 C95.25,219 95.375,218.75 95.375,217.875 C95.375,217 95.75,216.875 94.375,216.25 C93,215.625 90.25,213.25 90.25,213.25 C90.25,213.25 91.875,212.875 88.375,213.375 C84.875,213.875 84.625,215.875 83.625,214.625 C82.625,213.375 84.375,209 83.125,208.375 C81.875,207.75 82,208.625 81.25,207 C80.5,205.375 81.125,204 80.75,202.625 C80.375,201.25 80.75,203.375 79.75,198.75 C78.75,194.125 80.625,195.375 78.375,192.75 C76.125,190.125 73.375,190.375 73.125,188.25 C73.125,188.25 73.1875,182.625 73,182.125 L73,182.125 Z\" id=\"central_america\" data-territory-id=\"8\" class=\"territory\"></path>\n				<path d=\"M156.125,335.5 C157,335.25 157.125,337.125 156.875,338.125 C156.625,339.125 157,340.125 158.125,341.25 C159.25,342.375 160.5,343.625 161,344.5 C161.5,345.375 162.75,346.125 163,347.125 C163.25,348.125 163.625,349.125 164.875,350.125 C166.125,351.125 166.875,350 167.125,349.25 C167.375,348.5 167,346.75 167.25,345 C167.5,343.25 169.75,345.25 169.75,345.25 C169.75,345.25 170.625,347.125 171,347.75 C171.375,348.375 173,348.125 173.75,347.375 C174.5,346.625 175,346.75 175.5,346.75 C176,346.75 177,347.75 178.75,347.5 C180.5,347.25 180.625,347.125 182.125,348.5 C183.625,349.875 182.375,350.625 183.75,351.5 C185.125,352.375 185.125,351.5 186,351.875 C186.875,352.25 186.375,353.375 187.75,354.25 C189.125,355.125 192.75,354.375 194,354.875 C195.25,355.375 194,356.5 194,357.375 C194,358.25 194,360.625 193.375,360.875 C192.75,361.125 191.875,362.875 192,364.25 C192.125,365.625 195.375,364.25 196.75,363.625 C198.125,363 198.75,363.125 200.125,361.875 C201.5,360.625 205.25,358.5 205.25,358.5 C205.125,356.75 202.25,355.75 201.875,353.125 C201.5,350.5 201.125,348.625 200.5,348.125 C199.875,347.625 199.25,348.125 198.375,346.75 C197.5,345.375 196.875,344.875 195.375,344 C193.875,343.125 194.625,341.75 194.875,340.625 C195.125,339.5 193.875,336.25 193.125,334.75 C192.375,333.25 191.5,333.25 191.125,331.5 C190.75,329.75 190.625,329.25 189.5,328.375 C188.375,327.5 186.875,327.375 186.625,326.625 C186.375,325.875 186.875,324.875 186.125,324.125 C185.375,323.375 184.75,321.625 184.125,320.375 C183.5,319.125 181.25,320.25 179.625,320.25 C178,320.25 178,318.125 177,317.5 C176,316.875 175,317.375 173.875,316.875 C172.75,316.375 173.25,315.5 171.75,315.375 C170.25,315.25 170.125,314.125 169.375,312.875 C168.625,311.625 166.25,310.5 165.25,310.625 C164.25,310.75 163.875,312 163.375,312.5 C162.875,313 161,313 159.125,313.375 C157.25,313.75 154.75,315.625 152,315.75 C149.25,315.875 149.375,312.875 149.625,311.5 C149.875,310.125 153.5,309.75 153.75,307.625 C154,305.5 150.5,307.375 149.125,306.625 C147.75,305.875 144.25,305.75 144.125,304.75 C144,303.75 142.75,303.625 141.75,303.625 C140.75,303.625 139.375,302.375 138.625,301 C137.875,299.625 139.875,299 140,298 C140.125,297 142.875,297.375 143.875,296.625 C144.875,295.875 144.625,292 144.75,291.375 C144.875,290.75 148.94159,290.79325 148.94159,290.79325 C148.94159,290.79325 148.14609,288.67193 147.61576,288.1416 C147.08543,287.61127 146.11316,287.3461 145.40605,287.16933 C144.69894,286.99255 143.5499,285.75511 142.66601,285.8435 C141.78213,285.93189 139.48403,285.93189 138.86531,285.22478 C138.2466,284.51768 137.18594,283.72218 135.59495,283.63379 C134.00395,283.5454 133.29685,284.69445 132.23619,283.01507 C131.17553,281.3357 129.23098,279.0376 128.70065,278.94921 C128.17032,278.86082 125.69545,278.59566 126.375,277.875 C124.5,279.125 124.625,281.625 123.875,283.5 C123.125,285.375 122.5,286.125 121.875,288.125 C121.25,290.125 122.25,289.625 123,291.75 C123.75,293.875 122.75,292.75 122.375,294 C122,295.25 122.25,299.25 122.25,299.25 C122.25,299.25 123.125,301.875 123.625,302.375 C124.125,302.875 126.125,305.125 126.125,305.125 C126.125,305.125 125.875,306.75 126.375,308.75 C126.875,310.75 127.75,310 128.25,311 C128.75,312 130.75,314.125 131.375,314.625 C132,315.125 133.375,317.25 134.75,317.75 C136.125,318.25 135.125,320.125 135,321.125 C134.875,322.125 136.375,324.375 136.875,325.375 C137.375,326.375 137.625,325.625 138.125,326.375 C138.625,327.125 140,328.125 140.875,328.625 C141.75,329.125 142.625,329.25 142.625,329.25 C142.625,329.25 143.875,330.375 144.75,331 C145.625,331.625 146.75,331.875 147.5,332.125 C148.25,332.375 149.5,335.125 150.125,335.75 C150.125,335.75 152.875,336.875 153.5,337 C154.125,337.125 155.25,335.625 156.125,335.5 L156.125,335.5 Z\" id=\"peru\" data-territory-id=\"10\" class=\"territory\"></path>\n				<path d=\"M671.4935,462.88536 L671.72892,462.61589 C671.72892,462.61589 671.72892,456.95904 671.9057,455.54482 C672.08248,454.13061 671.55215,454.30739 670.84504,453.24673 C670.13793,452.18607 671.72892,410.9971 671.55215,410.11321 C671.37537,409.22933 641.67689,410.46677 641.67689,410.46677 L641.08791,372.72925 L638.96659,371.49181 C638.96659,371.49181 637.3756,370.43115 636.49171,369.90082 C635.60783,369.37049 634.90072,371.84536 634.19361,372.19892 C633.48651,372.55247 631.36519,373.78991 631.36519,373.78991 C631.36519,373.78991 630.83486,375.55767 630.4813,376.79511 C630.12775,378.03255 628.53676,376.97189 626.59222,377.679 C624.64767,378.3861 626.41544,378.3861 625.88511,380.15387 C625.35478,381.92164 625.35478,380.33065 623.76379,380.33065 C622.1728,380.33065 623.05668,381.03775 621.99602,382.45197 C620.93536,383.86618 620.75859,382.80552 619.34437,384.04296 C617.93016,385.28039 618.99082,385.28039 618.10694,387.04816 C617.22305,388.81593 617.04628,387.93204 615.98562,388.63915 C614.92495,389.34626 613.15719,391.11402 612.09653,392.17468 C611.03587,393.23534 610.50554,392.70501 608.38422,392.52824 C606.2629,392.35146 607.50033,392.52824 605.90934,392.70501 C604.31835,392.88179 604.67191,393.94245 603.61125,394.82633 C602.55059,395.71022 602.02026,396.06377 600.78282,397.30121 C599.54538,398.53865 600.25249,397.83154 598.30795,398.00832 C596.3634,398.18509 597.24729,398.18509 595.30274,399.42253 C593.3582,400.65997 595.12597,401.01352 594.94919,402.42773 C594.77241,403.84195 594.41886,403.84195 593.88853,405.07938 C593.3582,406.31682 593.88853,406.67037 594.41886,408.08459 C594.94919,409.4988 596.00985,408.61492 596.00985,408.61492 C596.00985,408.61492 595.6563,410.73624 596.00985,411.44334 C596.3634,412.15045 595.83307,411.44334 594.24208,411.44334 C592.65109,411.44334 593.53497,411.97367 593.53497,413.21111 L593.53497,414.44855 C593.53497,414.44855 593.00464,414.62532 592.47431,415.68598 C591.94398,416.74665 592.47431,416.56987 592.65109,417.80731 C592.82787,419.04474 593.00464,419.57507 593.53497,420.81251 C594.0653,422.04995 594.59563,421.69639 595.47952,423.64094 C596.3634,425.58548 595.83307,425.76226 595.83307,427.53002 C595.83307,429.29779 595.83307,428.76746 596.00985,431.06556 C596.18663,433.36365 597.24729,432.65655 597.24729,432.65655 C597.24729,432.65655 598.48472,433.54043 599.19183,434.07076 C599.89894,434.60109 599.89894,435.13142 600.25249,436.89919 C600.60604,438.66696 599.72216,438.3134 599.36861,439.37406 C599.01505,440.43472 599.36861,440.08117 599.19183,442.20249 C599.01505,444.32381 598.30795,443.43993 597.60084,444.32381 C596.89373,445.20769 597.07051,445.20769 596.54018,446.62191 C596.00985,448.03612 596.54018,447.68257 597.42406,448.38967 C598.30795,449.09678 599.36861,449.62711 600.42927,450.51099 C602.87008,453.1838 605.49259,452.50055 608.56099,450.86455 C610.15198,449.98066 609.44488,449.80389 610.68231,449.27356 C611.91975,448.74323 611.5662,448.92 612.2733,448.56645 C612.98041,448.2129 613.51074,447.68257 614.5714,446.62191 C615.63206,445.56125 614.92495,446.44513 616.16239,445.73802 C617.39983,445.03092 617.57661,444.50059 619.52115,443.79348 C621.46569,443.08637 621.99602,443.6167 621.99602,443.6167 L623.58701,443.6167 C625.178,443.6167 624.29412,443.79348 624.64767,444.50059 C625.00123,445.20769 626.06189,445.20769 626.76899,445.20769 C627.4761,445.20769 628.53676,445.03092 629.42064,444.67736 C630.30453,444.32381 629.24387,443.08637 629.24387,442.37927 C629.24387,441.67216 629.24387,441.49538 629.7742,440.25795 C630.30453,439.02051 631.89552,438.66696 632.60262,438.66696 C633.30973,438.66696 635.0775,438.3134 635.7846,437.6063 C636.49171,436.89919 636.84527,437.25274 638.25948,437.07597 C639.67369,436.89919 639.49692,436.54563 640.55758,435.48497 C641.61824,434.42431 641.61824,434.95464 643.56278,434.95464 L646.56798,434.95464 C648.51253,434.95464 648.33575,435.13142 649.57319,435.3082 C650.81062,435.48497 651.51773,436.72241 652.40161,437.25274 C653.2855,437.78307 652.75517,437.95985 652.75517,439.37406 C652.75517,440.78828 652.93194,440.96505 654.34616,443.43993 C655.76037,445.9148 656.46748,445.9148 656.46748,445.9148 C656.46748,445.9148 657.70492,444.14703 658.76558,442.55604 C659.82624,440.96505 659.64946,442.02571 661.24045,441.49538 C662.83144,440.96505 661.77078,440.43472 662.12433,438.13663 C662.47789,435.83853 663.18499,437.42952 664.42243,437.6063 C665.65987,437.78307 664.42243,439.90439 664.06888,441.14183 C663.71532,442.37927 663.00822,442.73282 662.12433,443.6167 C661.24045,444.50059 661.24045,444.67736 660.17979,445.9148 C659.11913,447.15224 659.64946,446.97546 659.82624,448.38967 C660.00301,449.80389 661.77078,447.15224 662.47789,446.09158 C663.18499,445.03092 663.18499,445.73802 664.06888,445.9148 C664.95276,446.09158 664.24565,448.2129 664.24565,449.27356 C664.24565,450.33422 664.42243,450.15744 665.30631,450.68777 C666.1902,451.2181 666.1902,452.27876 665.65987,453.69297 C665.12954,455.10719 665.65987,455.10719 665.83664,456.16785 C666.01342,457.22851 667.95796,459.88016 668.66507,460.58727 C669.37218,461.29437 669.1954,460.94082 669.90251,461.29437 C670.60961,461.64793 670.25606,462.00148 671.4935,462.88536 L671.4935,462.88536 Z\" id=\"western_australia\" data-territory-id=\"40\" class=\"territory\"></path>\n				<path d=\"M62.37151,77.74788 C62.37151,77.74788 62.49651,77.87288 62.99651,79.37288 C63.49651,80.87288 63.87151,81.87288 64.99651,83.87288 C66.12151,85.87288 65.12151,91.87288 65.12151,91.87288 L67.12151,94.62288 C67.12151,94.62288 68.74651,95.37288 69.37151,95.49788 C69.99651,95.62288 69.74651,98.74788 69.62151,99.99788 C69.49651,101.24788 67.99651,100.62288 67.12151,100.87288 C66.24651,101.12288 65.99651,103.24788 65.87151,104.49788 C65.74651,105.74788 63.5,105.25 63.5,105.25 C64.125,106.5 65.375,106.625 65.875,108.875 C66.375,111.125 66.125,110.375 66.75,111.25 C67.375,112.125 68.5,112.25 68.75,114.25 C69,116.25 69,115.125 70.375,117.75 C71.75,120.375 70.5,121.5 70.75,123.875 C71,126.25 72.25,125.375 73.125,126.625 L73.49651,127.99788 L121.49651,127.87288 L125.49651,79.49788 C125.49651,79.49788 62.62151,77.74788 62.37151,77.74788 L62.37151,77.74788 Z\" id=\"alberta\" data-territory-id=\"3\" class=\"territory\"></path>\n			</g>\n			<g id=\"fills\" transform=\"translate(14.003490, 0.444930)\">\n				<g id=\"north-america\" stroke-width=\"3\" stroke=\"#B5B81D\" sketch:type=\"MSShapeGroup\" data-continent-id=\"0\">\n					<path d=\"M21.13203,41.98005 C21.13203,41.98005 23.96046,38.79807 25.72823,39.15162 C27.496,39.50518 29.61732,39.15162 31.38508,37.73741 C33.15285,36.3232 35.98128,37.0303 35.98128,37.0303 L38.1026,38.79807 C38.1026,38.79807 40.93102,41.6265 42.69879,40.56584 C44.46656,39.50518 44.46656,42.3336 47.64854,42.68716 C50.83052,43.04071 52.24473,43.74782 55.42671,44.80848 C58.60869,45.86914 61.43712,43.04071 64.6191,44.45492 C67.80108,45.86914 72.75083,48.34401 74.16504,47.28335 C75.57926,46.22269 75.2257,44.80848 78.40768,45.16203 C81.58966,45.51558 84.06454,44.45492 84.06454,44.45492 C84.06454,44.45492 83.71098,42.3336 85.83231,42.68716 C87.95363,43.04071 90.4285,41.98005 90.4285,41.98005 L93.61048,41.27294 L96.08535,41.27294 L96.43891,43.74782 C96.43891,43.74782 101.0351,43.04071 103.50997,45.16203 C105.98485,47.28335 110.58104,51.17244 111.6417,49.05112 C112.70236,46.9298 110.22749,52.94021 114.82368,53.29376 C119.41988,53.64731 118.35922,50.11178 120.48054,50.81889 C122.60186,51.52599 124.36962,52.2331 126.49095,51.17244 C128.61227,50.11178 131.08714,46.9298 133.20846,48.69757 C135.32978,50.46533 143.46151,51.52599 143.10795,50.11178 C142.7544,48.69757 143.10795,44.80848 143.10795,44.80848 L145.93638,44.80848 L146.28993,48.69757 C146.28993,48.69757 150.53258,49.05112 151.23968,46.9298 C151.94679,44.80848 149.82547,44.10137 149.82547,44.10137 C149.82547,44.10137 148.0577,41.6265 150.17902,37.38386 C152.30034,33.14122 153.71456,33.14122 153.71456,29.95924 C153.71456,26.77725 157.9572,29.95924 157.9572,29.95924 L158.6643,27.13081 C158.6643,27.13081 162.19984,26.07015 162.19984,27.48436 C162.19984,28.89858 160.78562,28.54502 160.43207,31.0199 C160.07852,33.49477 157.25009,32.08056 157.25009,32.08056 C157.25009,32.08056 153.00745,38.79807 154.42166,39.50518 C155.83588,40.21228 156.54298,43.39426 156.18943,45.51558 C155.83588,47.63691 156.89654,44.45492 157.60364,46.57624 C158.31075,48.69757 162.19984,46.57624 162.55339,47.99046 C162.90694,49.40467 159.01786,50.81889 162.90694,51.52599 C166.79603,52.2331 166.44248,51.17244 167.85669,50.11178 C169.27091,49.05112 169.62446,45.86914 171.03867,47.99046 C172.45289,50.11178 171.03867,51.17244 171.03867,51.17244 L173.15999,51.87955 C173.15999,51.87955 171.74578,52.94021 172.45289,54.35442 C173.15999,55.76863 175.28131,54.35442 172.45289,57.18285 C169.62446,60.01127 166.79603,58.95061 166.79603,58.95061 C166.79603,58.95061 165.38182,62.48615 163.9676,62.8397 C162.55339,63.19325 163.2605,65.31457 161.13918,65.31457 C159.01786,65.31457 158.31075,63.90036 158.31075,63.90036 L156.18943,62.13259 L155.48232,64.25391 C155.48232,64.25391 158.6643,67.43589 157.25009,68.49656 C155.83588,69.55722 152.6539,69.91077 152.6539,69.91077 C152.6539,69.91077 142.7544,80.16382 142.04729,82.63869 C141.34019,85.11356 140.98663,91.83108 140.98663,91.83108 L142.7544,93.24529 C142.7544,93.24529 144.16861,95.72017 145.93638,97.48793 C147.70415,99.2557 148.76481,102.79123 151.59324,102.08413 C154.42166,101.37702 155.48232,104.559 155.48232,104.559 L157.60364,103.14479 C157.60364,103.14479 159.72496,101.90735 160.07852,102.61446 C160.43207,103.32156 162.55339,104.02867 162.55339,104.02867 C162.55339,104.02867 164.67471,102.79123 166.61926,102.61446 C168.5638,102.43768 166.97281,104.20545 166.97281,104.20545 L162.90694,106.14999 C162.90694,106.14999 163.79083,108.80164 164.85149,108.44809 C165.91215,108.09453 166.44248,112.51395 165.20504,113.39784 C163.9676,114.28172 165.55859,116.04949 165.55859,116.04949 L166.2657,118.52436 L168.21025,119.93857 L168.74058,122.23667 C168.74058,122.23667 169.44768,118.52436 170.68512,117.64048 C171.92256,116.75659 172.62966,111.98362 172.09933,110.92296 C171.569,109.8623 170.68512,109.50875 171.39223,107.91776 C172.09933,106.32677 171.74578,103.67512 173.51355,104.20545 C175.28131,104.73578 177.04908,104.559 177.40263,103.32156 C177.75619,102.08413 177.22586,102.08413 177.40263,101.02347 C177.57941,99.96281 178.46329,99.60925 179.1704,99.43248 C179.87751,99.2557 180.40784,99.78603 179.87751,97.31116 C179.34718,94.83628 179.87751,95.89694 179.1704,94.12918 C178.46329,92.36141 178.99362,93.42207 178.28652,91.83108 C177.57941,90.24009 177.04908,87.76521 178.81685,87.58844 C180.58461,87.41166 178.64007,85.29034 179.87751,84.76001 C181.11494,84.22968 183.41304,84.93679 182.88271,82.81547 C182.35238,80.69415 179.70073,76.45151 181.4685,76.27473 C183.23626,76.09795 185.75,77 185.75,77 L192,77.375 C192,77.375 191.375,79.75 193.25,80 C195.125,80.25 195.375,81.375 196,81.75 C196.625,82.125 197.625,83 197.375,83.5 C197.125,84 197.125,84.5 197.25,85.375 C197.375,86.25 198,87.5 197.5,87.75 C197,88 196.5,88.75 196.625,89.75 C196.75,90.75 197.125,92.25 197.125,92.25 C197.125,92.25 198.125,93.625 199.375,93 C200.625,92.375 200.25,91.875 201.875,91.125 C203.5,90.375 203.5,92 204.5,90.375 C205.5,88.75 205.375,88.5 205.625,87.875 C205.875,87.25 207.125,85.625 208.125,86.125 C209.125,86.625 207.80823,91.12397 208.86889,92.71496 C209.92955,94.30595 211.375,92.125 211.5,92.875 C211.625,93.625 211.75,94.5 211.875,95.125 C212,95.75 211.125,96.25 211.875,97.25 C212.625,98.25 212.75,98.5 212.625,99.25 C212.5,100 213,100.625 213,100.625 C213,100.625 214.375,99.375 215,100.875 C215.625,102.375 215.125,103.25 216.25,103.25 C217.375,103.25 218.625,105 218.625,105 L219.125,107.625 L222,105.625 L224.75,106.5 C224.75,106.5 220.9375,108.25 221.6875,110.0625 C222.4375,111.875 226.3125,107.9375 226.25,110.375 C226.1875,112.8125 225.75,115.3125 224.8125,115.4375 C223.875,115.5625 222.375,116.375 222.25,116.9375 C222.125,117.5 220.375,118.625 219.25,118.875 C218.125,119.125 219.875,120.125 217.5,120.5 C215.125,120.875 214.375,120.75 213.875,120.75 C213.375,120.75 213.375,121.25 212.75,122.375 C212.125,123.5 212.625,123.875 212,124.375 C211.375,124.875 214.25,124.375 210.375,125.25 C206.5,126.125 205.875,126.375 205.875,126.375 C205.875,126.375 205.625,126.75 204.375,126.75 C203.125,126.75 202.625,126.125 202.625,126.125 C202.625,126.125 202.375,125.5 200.625,125.5 C198.875,125.5 197.25,127.125 197.25,127.125 C197.25,127.125 196.75,127.75 195.75,127.875 C194.75,128 193.375,129.25 193.375,129.25 C193.375,129.25 192,129.625 192.375,131.125 C192.75,132.625 194.125,134 195,133 C195.875,132 197.25,128 199.125,128.375 C201,128.75 203.5,129.5 203,132.25 C202.5,135 202.375,134.5 202.75,135.875 C203.125,137.25 204,138 203.875,139.25 C203.75,140.5 202.625,140.125 204,141.25 C205.375,142.375 206.875,144.125 207.375,142.5 C207.875,140.875 208.5,139.75 209.125,140 C209.75,140.25 211.5,139.5 210.25,142 C209,144.5 209.25,144.625 208.125,145.375 C207,146.125 207.125,144.125 205.125,147.125 C203.125,150.125 204.125,150.75 202,151.625 C199.875,152.5 199.5,155.25 198.75,154.125 C198,153 197,153 197.875,151.375 C198.75,149.75 199.375,150 199.125,148.5 C198.875,147 199.875,146.875 198.625,146.75 C197.375,146.625 198,146.625 196.5,147.125 C195,147.625 195.125,146 193.875,148 C192.625,150 192.25,149.875 191.375,150.375 C190.5,150.875 190.875,151.5 190.25,152.25 C189.625,153 189.375,153.375 188.875,154 C188.375,154.625 188.25,154.625 188.25,156 C188.25,157.375 189.375,159.625 189.375,159.625 C189.375,159.625 188.75,161.375 188,161.75 C187.25,162.125 187.125,160.875 183.875,164.625 C180.625,168.375 181,168.75 179,169.625 C177,170.5 177.25,170.625 177.125,171.125 C177,171.625 175.625,172.25 176.375,173.375 C177.125,174.5 176.375,174.75 177.5,175.25 C178.625,175.75 179.75,174.75 179.625,176.375 C179.5,178 178.25,179.625 176.25,180.875 C174.25,182.125 171.625,186 169,186.625 C166.375,187.25 165.25,188.125 165.375,189.375 C165.5,190.625 165.375,192.125 164,192.125 C162.625,192.125 163.5,192.75 163.5,195.75 C163.5,198.75 163.75,199.625 164.375,200.75 C165,201.875 165.25,201.875 165.25,203.625 C165.25,205.375 165.25,206.625 165.125,207.125 C165,207.625 166.125,207.5 164.25,208.625 C162.375,209.75 160.75,210.375 160,208.5 C159.25,206.625 157.75,207.125 157.625,205.625 C157.5,204.125 158.125,200.5 158.125,200.5 C158.125,200.5 156.25,200 156,199 C155.75,198 155,195.625 154.5,195.25 C154,194.875 153,194 152,194.5 C151,195 149.25,196 148.625,195.875 C148,195.75 149.5,196 146,195 C142.5,194 140.875,193.5 139.375,193.375 C137.875,193.25 134.375,193.25 133.75,193.375 C133.125,193.5 127.125,194.875 126.375,194.875 C125.625,194.875 120.375,196.125 119,197.25 C117.625,198.375 117.75,200.25 116.25,200.875 C114.75,201.5 114.25,201.75 114.25,201.75 C114.25,201.75 112.75,203.5 112.625,204.5 C112.5,205.5 111.25,207.25 110.625,207.625 C110,208 109.875,207.875 110.25,209 C109.7489,211.79276 109.36384,214.46949 110.5,215.625 L110.625,217.875 L112.125,220.5 C112.125,220.5 114.375,223.75 117.25,222.875 C120.125,222 118.75,222.625 121.125,221.5 C123.5,220.375 122.75,222.75 124,220.25 C125.25,217.75 124.375,217.5 125.75,217 C127.125,216.5 126.375,216 128.125,216.5 C129.875,217 128.25,217.125 130.5,217.25 C132.75,217.375 133,214.875 132.75,217.75 C132.5,220.625 132.25,220.75 132,221.5 C131.75,222.25 132.375,221.375 131.5,223 C130.625,224.625 130.125,224.75 129.5,225.125 C128.875,225.5 128.5,225.75 128.5,226.875 C128.5,228 128.75,228.875 127.625,229.375 C126.5,229.875 125.375,229.25 125.625,230.625 C125.875,232 125.5,232.375 126.5,233 C127.5,233.625 128.25,233.75 128.875,234.875 C129.5,236 129.75,237.375 129.5,237.875 C129.25,238.375 129.375,240 128.625,240.375 C127.875,240.75 126.875,240.5 126.875,242.125 C126.875,243.75 127.625,245 126.875,245.375 C126.125,245.75 124.875,244.875 124.625,245.75 C124.375,246.625 124.25,247.375 124.125,248.125 C124,248.875 123.375,249 123.375,249.5 L123.375,251.125 C123.375,252.5 122.5,253.375 123.75,253.625 C125,253.875 125.625,254.25 126.25,253.875 C126.875,253.5 127.625,253.375 128.125,253 C128.625,252.625 129.375,251.625 130.125,251.625 C130.875,251.625 132.375,252 132.375,252 C132.375,252 133.125,253.875 133,254.5 C132.875,255.125 133.375,255 133.25,256.5 C133.125,258 133.125,259.125 132.875,259.625 C132.625,260.125 132.25,260.625 132,261.125 C131.75,261.625 132,261.625 131.75,262.375 C131.5,263.125 131.875,264.25 131.25,263.75 C130.625,263.25 131,263.25 130.625,262.75 C130.25,262.25 130,261.625 129.25,260.375 C128.5,259.125 128.625,259.875 127.125,259.125 C125.625,258.375 125.75,257.5 124.75,258 C123.75,258.5 124.125,259.375 123,258.625 C121.875,257.875 121.5,257.875 120.875,256.875 C120.25,255.875 120.375,256 120,255.25 C119.625,254.5 118.625,255 118.625,253.625 C118.625,252.25 119,252 118.625,251.25 C118.25,250.5 117.875,250.125 117.625,249.5 C117.375,248.875 117.25,249.375 117.25,248.125 L117.25,245.5 C117.25,245 116.75,243 116.75,243 L116.125,241.75 C116.125,241.75 116,241.625 115.5,240.875 C115,240.125 115,240.5 114.625,239.25 C114.25,238 113.375,236.5 113.125,235.5 C112.875,234.5 111.5,233.25 107.375,231.75 C103.25,230.25 103.5,229.875 100,229.125 C96.5,228.375 95.25,227.75 95.25,226.25 C95.25,224.75 95.25,224.25 94.375,223.75 C93.5,223.25 92.625,223.125 93,222.25 C93.375,221.375 94,221.25 94.625,220.125 C95.25,219 95.375,218.75 95.375,217.875 C95.375,217 95.75,216.875 94.375,216.25 C93,215.625 90.25,213.25 90.25,213.25 C90.25,213.25 91.875,212.875 88.375,213.375 C84.875,213.875 84.625,215.875 83.625,214.625 C82.625,213.375 84.375,209 83.125,208.375 C81.875,207.75 82,208.625 81.25,207 C80.5,205.375 81.125,204 80.75,202.625 C80.375,201.25 80.75,203.375 79.75,198.75 C78.75,194.125 80.625,195.375 78.375,192.75 C76.125,190.125 73.375,190.375 73.125,188.25 C72.875,186.125 73.5,184.25 73,182.125 C72.5,180 72.25,180.5 72.25,178.625 C72.25,176.75 69.375,173.125 68,171.125 C66.625,169.125 66.625,163.75 66.875,162.375 C67.125,161 66.625,156 67.5,153.875 C68.375,151.75 68.375,148.75 69,145.875 C69.625,143 68.875,143.625 70.375,140 C71.875,136.375 71.75,138.75 72,135.625 C72.25,132.5 73.25,134.375 73.375,131.75 C73.5,129.125 74,127.875 73.125,126.625 C72.25,125.375 71,126.25 70.75,123.875 C70.5,121.5 71.75,120.375 70.375,117.75 C69,115.125 69,116.25 68.75,114.25 C68.5,112.25 67.375,112.125 66.75,111.25 C66.125,110.375 66.375,111.125 65.875,108.875 C65.375,106.625 64.125,106.5 63.5,105.25 C62.875,104 63,105.375 62.625,103.25 C62.25,101.125 61.5,101.375 60.875,100.75 C60.25,100.125 59.375,100 59.75,98.875 C60.125,97.75 60.375,97.75 60,96.625 C59.625,95.5 58,94.875 57.5,93.75 C57,92.625 57,93.5 57,91.75 C57,90 57.5,89.75 56,89.25 C54.5,88.75 53.5,90 52.75,88.375 C52,86.75 52.125,87.625 50.625,87.375 C49.125,87.125 48.5,87.25 48,86.25 C47.5,85.25 47.25,84.375 46.25,84.375 C45.25,84.375 44,84 43.75,83.375 C43.5,82.75 42.125,81 41.25,81 C40.375,81 40.625,81.625 39.25,82.25 C37.875,82.875 41.75,83.5 38.75,84.25 C35.75,85 34.375,85.25 33.75,84.75 C33.125,84.25 30.875,85.875 31.25,84 C31.625,82.125 31.75,82.375 32.375,81.875 C33,81.375 34.75,81.25 34,80.75 C33.25,80.25 33.625,79.375 31,80 C28.375,80.625 27.625,80.875 26.75,81.5 C25.875,82.125 25.875,83.375 25.5,84.125 C25.125,84.875 26.625,84.625 23.75,85.875 C20.875,87.125 22.375,85.25 19.375,87.875 C16.375,90.5 17.375,90.75 15.125,91.125 C12.875,91.5 14.25,91.125 12.5,93 C10.75,94.875 11,95.75 9.25,95.75 C7.5,95.75 8.125,98.875 6.5,96.75 C4.875,94.625 3.75,95.5 5,94.5 C6.25,93.5 6.5,93.75 7.5,93.5 C8.5,93.25 8,93.875 9.125,92.25 C10.25,90.625 10,90 11.75,89.875 C13.5,89.75 13.25,91.375 14,89 C14.75,86.625 14,86.75 15.375,85.5 C16.75,84.25 18.25,83 16.5,82.875 C14.75,82.75 14.625,82.375 13,83.125 C11.375,83.875 11.25,84.25 9.75,84 C8.25,83.75 7.875,83.625 7.875,83 C7.875,82.375 7.25,80.375 7.25,80.375 C7.25,80.375 8.5,79.75 6.375,79.25 C4.25,78.75 4.125,80.375 4.25,78.75 C4.375,77.125 5.375,77.375 4.5,76.625 C3.625,75.875 3.375,75.375 2.25,75.875 C1.125,76.375 -0.125,77.625 0.625,75.75 C1.375,73.875 2.875,73.125 3.375,72.375 C3.875,71.625 4.625,69.5 4.875,68.375 C5.125,67.25 3.875,67.875 5.375,66.75 C6.875,65.625 6.25,65.375 8.125,65.5 C10,65.625 9.5,65.5 10.75,66.125 C12,66.75 12.375,67.125 13.125,66.75 C13.875,66.375 14.625,65.5 15.125,64.875 C15.625,64.25 16.25,63.875 16.375,63.125 C16.5,62.375 17.125,61.625 15.75,62.125 C14.375,62.625 14.875,62.625 13,63 C11.125,63.375 11.375,64.75 10.625,63.125 C9.875,61.5 9.75,60.75 9.75,60.75 C9.75,60.75 9,60.75 9.125,59 C9.25,57.25 8,54.375 11.375,53.5 C14.75,52.625 16.875,53.375 17,53.875 C17.125,54.375 16,54.875 17.5,55 C19,55.125 19.125,55.5 20,54.25 C20.875,53 21.875,53.125 20.875,52.625 C19.875,52.125 19,52.25 18.5,51.25 C18,50.25 18.5,50 18,48.625 C17.5,47.25 17.5,47 16.75,46 C16,45 14,43.5 16.5,42.875 C19,42.25 21.625,41.625 21.13203,41.98005 L21.13203,41.98005 Z\"></path>\n					<path d=\"M238.125,72.875 C238.125,72.875 238.75,76.75 237.875,78.375 C237,80 236.875,79.125 236.375,81.5 C235.875,83.875 236.25,84.75 235.375,86.125 C234.5,87.5 234.75,85.25 234.375,88.875 C234,92.5 234.25,93.375 233.375,93.75 C232.5,94.125 233.625,95.5 232.125,95.5 C230.625,95.5 230.125,96.5 229.75,95.125 C229.375,93.75 230,93.125 228.5,93 C227,92.875 226.125,94.625 225.875,92.875 C225.625,91.125 226.25,90.5 225,90 C223.75,89.5 226.25,93.625 222.125,88.75 C218,83.875 218.75,80.5 218.75,80.5 C218.75,80.5 217.5,79.125 217.5,78.25 C217.5,77.375 218.375,74.625 217.25,73.125 C216.125,71.625 215,68.625 216.375,67.75 C217.75,66.875 219.125,67.125 219.5,65.125 C219.875,63.125 219.75,63.375 220,62.375 C220.25,61.375 220.75,61 219.75,60.875 C218.75,60.75 219.75,61.25 217.875,60.75 C216,60.25 216.25,59.5 215.75,59.375 C215.25,59.25 216.125,60.125 214.5,59.5 C212.875,58.875 211.625,58.375 213.375,57.75 C215.125,57.125 216.25,56.875 217,57.125 C217.75,57.375 218.125,58.75 217.875,56.875 C217.625,55 213.5,54 213.5,52.75 L213.5,50.5 C213.5,49.25 213.25,48.625 212.25,47.625 C211.25,46.625 211.5,46.625 211.25,45 C211,43.375 211,43.5 210.125,42.5 C209.25,41.5 209.125,42.875 208.5,41.125 C207.875,39.375 207.875,39 206.625,39 C205.375,39 205.5,39.75 204.5,38.375 C203.5,37 203.75,36.75 202.125,36.875 C200.5,37 199.25,37.75 199,38.25 C198.75,38.75 199.375,39.25 197.75,39.375 C196.125,39.5 195.75,39.5 194.875,39.5 C194,39.5 193.125,39.875 193.125,39.375 C193.125,39.375 192.125,37.875 190.5,38.25 C188.875,38.625 188.5,39.75 188,38.5 C187.5,37.25 186.5,37.375 186.375,36.75 C186.25,36.125 184.75,36.875 186.25,35.25 C187.75,33.625 186.75,33.25 188.625,33.375 C190.5,33.5 190.125,33.625 191.125,33.125 C192.125,32.625 193.5,32.5 192.125,32.375 C192.125,32.375 192.625,31.625 191.25,31.375 C189.875,31.125 188.375,31.875 188.375,30.875 C188.375,29.875 187.125,28.75 188.875,28.75 C190.625,28.75 191.625,29.25 192.5,28.375 C193.375,27.5 193.375,27.75 194.625,27.875 C195.875,28 197.125,28.625 197.5,27.625 C197.875,26.625 199.875,26.5 198.25,26 C196.625,25.5 195.75,25.625 196.125,24.875 C196.5,24.125 197.5,24 197.125,23.125 C196.75,22.25 195,21.5 197.5,21.375 C200,21.25 201.25,22.375 201.625,21 C202,19.625 200.625,18.5 202.875,18.5 C205.125,18.5 207.5,17.375 207.625,16.625 C207.75,15.875 207.125,15 209.25,15.5 C211.375,16 211,17.125 212.125,15.75 C213.25,14.375 212,14 214.25,14.5 C216.5,15 216.75,15.25 217.625,14.625 C218.5,14 216.875,13.75 219,14 C221.125,14.25 220.75,15 221.125,13.125 C221.5,11.25 219.75,11.5 221.875,11 C224,10.5 224.125,11 225.125,9.625 C226.125,8.25 225.25,8.625 227.125,8.25 C229,7.875 229.25,8.25 228.375,6.875 C227.5,5.5 225.875,4.75 228.375,4.5 C230.875,4.25 232.25,4 232.5,3.25 C232.5,3.25 232.375,4.25 233.875,3.875 C235.375,3.5 235.125,3 236,1.875 C236.875,0.75 236.625,0.5 237.5,1.125 C238.375,1.75 237.375,2.25 239.625,1.125 C241.875,7.10542736e-15 240.125,7.10542736e-15 242.375,0.375 C244.625,0.75 244.5,0.5 247.125,0.625 C249.75,0.75 248.375,1.125 249.875,1.5 C251.375,1.875 251,1.75 252.875,1.75 C254.75,1.75 254.375,1.375 255.5,2.125 C256.625,2.875 256.125,3 258.375,3 C260.625,3 261.25,2.375 261.625,3.75 C262,5.125 261,5.25 263.75,5.625 C266.5,6 267.375,5.5 265.875,6.625 C264.375,7.75 261.25,7.875 262.125,8.625 C263,9.375 262.875,9.125 260.5,9.625 C258.125,10.125 254.625,10.625 257.5,11 C260.375,11.375 262.375,10.125 263.125,11.375 C263.875,12.625 262.125,12.75 265.375,12.375 C268.625,12 267.25,11.25 269.875,11.75 C272.5,12.25 272,13 272.875,11.375 C273.75,9.75 271.375,8.875 274.25,9.5 C277.125,10.125 276.5,10.125 278.25,9.125 C280,8.125 280.25,6.125 281,8.5 C281.75,10.875 281.625,11.375 280,12.125 C278.375,12.875 278.5,11.75 278,13.5 C277.5,15.25 277.625,15.75 276.375,16.75 C275.125,17.75 274.5,16.875 274.75,18.625 C275,20.375 275,20.125 274.625,21.875 C274.25,23.625 273.375,24.125 274.5,25.125 C275.625,26.125 275.625,25.125 276.375,26.625 C277.125,28.125 277.5,28.125 276.75,29.875 C276,31.625 275.875,30.75 275.625,32.875 C275.375,35 275.125,36.25 276,35.625 C276.875,35 277,33.25 277.125,35 C277.25,36.75 277.75,37.875 276.25,38.5 C274.75,39.125 274.875,38.25 274.625,39.5 C274.375,40.75 275.25,41.125 274.125,42.125 C273,43.125 274,44.125 272.75,43 C271.5,41.875 270.75,40.125 269.75,41.25 C268.75,42.375 267.375,41.375 268.5,42.75 C269.625,44.125 270.375,43.75 270.625,44.25 C270.875,44.75 270.75,45.25 271.125,46 C271.5,46.75 271.25,47.125 272.25,47 C273.25,46.875 273.625,47.375 273.375,48.25 C273.125,49.125 273,49.625 273.75,50.5 C274.5,51.375 274.75,51.375 274.125,51.75 C273.5,52.125 273.375,52.25 272.5,52.75 C271.625,53.25 271.75,54 271.25,54.125 C270.75,54.25 269.75,54.875 269.625,53.625 C269.5,52.375 269.375,50.75 268.625,50.125 C267.875,49.5 266.75,47.875 266.5,49.375 C266.25,50.875 266.5,51.375 266.125,52.125 C265.75,52.875 264.25,51.875 265.75,53.125 C267.25,54.375 267.875,54.75 267.875,54.75 C267.875,54.75 269.25,55.5 268.625,56.125 C268,56.75 268.75,57 266.875,57.25 C265,57.5 265.875,55.625 264.125,57.625 C262.375,59.625 261.125,60.125 261.125,60.125 L260.25,59.125 C260.25,59.125 259.5,57 259.25,58.375 C259,59.75 259.25,59.625 258.25,61.75 C257.25,63.875 257.75,64.375 256.625,64.5 C255.5,64.625 254.625,63.75 254,64.625 C253.375,65.5 254.25,65.25 253.125,66.125 C252,67 251.625,67.125 250.875,67.125 C250.125,67.125 251.25,65 249.75,67.25 C248.25,69.5 249.125,69.75 247.875,70 C246.625,70.25 246.375,70.25 245.25,70.25 C244.125,70.25 243.5,70.375 242.375,70.375 C241.25,70.375 240.375,70.5 239.625,70.875 C238.875,71.25 238.125,72.125 238.125,72.125 L238.125,72.875 L238.125,72.875 Z\" id=\"greenland\"></path>\n				</g>\n				<g id=\"africa\" transform=\"translate(281.000000, 234.000000)\" stroke-width=\"3\" stroke=\"#FF0ECB\" sketch:type=\"MSShapeGroup\" data-continent-id=\"3\">\n					<path d=\"M123.375,24.125 C122.75,24.125 117,22.875 116.5,22.625 C116,22.375 114.625,21.625 113.375,21.625 C112.125,21.625 110,20.875 109.25,20.625 C108.5,20.375 107,19.875 105.625,20.375 C104.25,20.875 104.25,17 98.25,17.375 C92.25,17.75 90.75,17.875 89.875,18.25 C89,18.625 86.75,19.875 85.375,19.875 C84,19.875 83.875,19.5 81.75,18.75 C79.625,18 79.25,17.75 78.25,16.75 C77.25,15.75 77.5,15 75.875,14.75 C74.25,14.5 73.5,15.375 72.625,14.375 C71.75,13.375 71.625,13 71.25,12.25 C70.875,11.5 70.625,10.125 69.375,10 C68.125,9.875 68.25,11.125 67.875,9.25 C67.5,7.375 67.125,5.875 66.625,5.5 C66.125,5.125 65.25,4.75 64.125,3.625 C63,2.5 62.875,1.375 62.875,1.375 L60.75,0 C60.75,0 55.25,0.25 54.625,0.25 C54,0.25 52.875,0.375 52.125,0.875 C51.375,1.375 51.75,1.625 50.375,2.25 C49,2.875 46.75,4 46.125,4.25 C45.5,4.5 42.625,4.625 42.625,4.625 C42.625,4.625 42.625,5.625 41.5,6.375 C40.375,7.125 38.875,8 37.625,7.875 C36.375,7.75 36.23106,7.30628 35.25,7.5 C33.40217,7.86488 32.19141,9.08233 31.5,9 C30.86709,8.92463 29.75,9.375 28.625,9.75 C27.5,10.125 28.75,10.25 26.375,10.25 C24,10.25 22.75,10.25 22,10.125 C21.25,10 20.625,10.375 20,10.5 C19.375,10.625 18.5,10.75 18.73211,10.9197 C17.31789,10.9197 16.61079,11.98036 16.61079,11.98036 L16.96434,16.57655 L13.78236,20.11209 C13.78236,20.11209 13.07525,22.94051 12.36814,25.06183 C11.66104,27.18315 10.60038,29.30447 10.60038,29.30447 L9.18616,33.19356 C9.18616,33.19356 7.625,34 7.75,34.625 C7.875,35.25 8.125,36.5 7.625,36.875 C7.125,37.25 6.5,36.875 5.875,38.125 C5.25,39.375 4.75,40.5 4.75,41 C4.75,41.5 5.375,42 4.5,43 C3.625,44 2.75,44.125 2.5,46.25 C2.25,48.375 1.25,50.25 2.25,51.5 C3.25,52.75 3.875,53.75 3.875,55.125 C3.875,56.5 3.5,56.375 3.625,58.375 C3.75,60.375 4,60.25 4,61.625 C4,63 3.875,64.875 3.625,66.5 C3.375,68.125 2.875,68.625 2.5,70.5 C2.125,72.375 -0.125,73.125 1.625,74.75 C3.375,76.375 3.125,77.875 3.625,79.25 C4.125,80.625 8.625,80.25 8.625,83.125 C8.625,86 12,86.375 12.25,87.875 C12.5,89.375 11.625,91.5 14.625,92.75 C17.625,94 17.375,95.875 18,96.375 C18.625,96.875 21.375,97.25 22,98 C22.625,98.75 23.5,100 24.125,100.625 C24.75,101.25 25.375,102.25 27.5,102.125 C29.625,102 29.875,102.125 33.25,101.75 C36.625,101.375 39,101.25 39.875,101.125 C40.75,101 42.625,101.625 44,101 C45.375,100.375 45.125,99.25 46.875,98.875 C48.625,98.5 49.25,98.875 50.375,98.625 C51.5,98.375 55.875,98.375 56.5,98.875 C57.125,99.375 57.875,98.875 58.625,100.5 C59.375,102.125 57.125,104.625 61.875,104.375 C66.625,104.125 69.375,103.375 70,104.5 C70.625,105.625 68.5,107.25 68.875,108.75 C69.25,110.25 69.75,110.625 69.25,111.375 C68.75,112.125 67.625,112.5 68,113.625 C68.375,114.75 69.375,115.25 68.875,115.75 C68.375,116.25 67.75,117.75 67.125,118.625 C66.5,119.5 63.875,120.75 64.875,121.875 C65.875,123 72.5,128.25 73.875,131.375 C75.25,134.5 81,139.25 79.25,142 C77.5,144.75 75.25,146.125 75.75,147.5 C76.25,148.875 78.125,151.25 78.25,152 C78.375,152.75 78.625,153.5 78.5,154.5 C78.375,155.5 79.5,155.125 78.75,156.25 C78,157.375 77.5,157.875 77.25,158.375 C77,158.875 76.25,159.875 76.25,161 C76.25,162.125 75.625,162.75 75.25,163.5 C74.875,164.25 74.75,164.25 74.625,165.125 C74.5,166 74.625,165.625 74.5,167.125 C74.375,168.625 74,168.875 73.75,169.875 C73.5,170.875 73.625,172.125 73.625,172.125 C73.625,172.125 74.875,174.875 75,175.5 C75.125,176.125 75.375,177.125 75.25,178.125 C75.125,179.125 74.625,179.125 75.75,180.5 C76.875,181.875 77.5,182.375 77.625,183.125 C77.75,183.875 78.125,184.125 78.125,184.125 C78.125,184.125 81.375,187.25 81.375,187.875 C81.375,188.5 82.125,189 82,189.875 C81.875,190.75 81.75,190.625 81.75,191.75 C81.75,192.875 81.875,193.375 82,194.25 C82.125,195.125 83.625,197.75 83.875,198.375 C84.125,199 84.875,199.375 84.875,200.375 L84.875,202.75 C84.875,204 84.25,203.875 84.75,205.375 C85.25,206.875 85.875,207.375 86.125,207.875 C86.375,208.375 87.625,207.75 87.625,208.875 C87.625,210 87.375,210.5 87.625,211.875 C87.875,213.25 88.875,214.125 89.25,214.875 C89.625,215.625 89.625,215.75 89.625,217.125 C89.625,218.5 89.75,218.5 89.75,219.75 L89.75,222.5 C89.75,223.5 90.5,225.5 90.5,226.125 C90.5,226.75 89.375,227.125 90.25,228.25 C91.125,229.375 91.25,229.5 92.125,229.625 C93,229.75 94.125,229.375 94.625,230.25 C95.125,231.125 95.625,231.375 95.625,231.375 C95.625,231.375 96.125,230.375 96.75,230 C97.375,229.625 98.125,229.125 99.125,229.125 C100.125,229.125 100.75,229.125 101.625,228.75 C102.5,228.375 100.875,227.875 105.75,227.875 C110.625,227.875 110.5,227.5 112.25,226.25 C114,225 111.875,224.5 115.375,223.75 C118.875,223 119.375,223.125 120.125,222.5 C120.875,221.875 121,221.5 121.75,221.5 C122.5,221.5 123.75,222.5 123.375,221.25 C123,220 121.375,220.75 122.875,218.875 C124.375,217 126,215.25 126,215.25 C126,215.25 125,215.375 124.75,214.375 C124.5,213.375 126.875,210.625 127.625,210.125 C128.375,209.625 129.75,210.5 130,208.875 C130.25,207.25 130.25,206.625 129.875,206.125 C129.5,205.625 128.25,205.75 129.625,204.5 C131,203.25 131.75,200.75 131.75,200 C131.75,199.25 131.375,197.25 132.5,196.75 C133.625,196.25 134,196.375 134.375,195.375 C134.75,194.375 137.125,191 137.5,190.125 C137.875,189.25 136.375,188.375 137.125,183.75 C137.875,179.125 139.25,177.875 139.75,177.75 C140.25,177.625 140.875,176.375 142,176 C143.125,175.625 142.625,176.875 143.75,175.125 C144.875,173.375 144.25,174 145,172.875 C145.75,171.75 145.5,171.75 146.625,170.625 C147.75,169.5 147.875,168.75 148.375,168.25 C148.875,167.75 149.625,167.75 149.875,167.125 C150.125,166.5 150.875,164.25 150.75,163.25 C150.625,162.25 150.375,161.625 150.5,160.875 C150.625,160.125 151.125,159.625 151,158.625 C150.875,157.625 151,157.5 150.75,156.5 C150.5,155.5 150.375,154.75 150.375,154.75 C150.375,154.75 149,151.125 149.5,150.125 C150,149.125 147.125,150 147.125,150 C147.125,150 148,145.5 146.625,144.75 C145.25,144 145.25,143.625 145.25,143.625 C145.25,143.625 145.5,141.625 145.5,140.75 C145.5,139.875 144.625,137.375 145,136.875 C145.375,136.375 145.75,134.75 145.75,134 C145.75,133.25 145.5,132.25 146.875,131.25 C148.25,130.25 148.875,130.75 149.875,129.5 C150.875,128.25 151.375,127.875 151.875,127.625 C152.375,127.375 153.375,126.375 153.625,125.875 C153.875,125.375 156.25,120.75 160.125,117 C164,113.25 170.25,108.25 172.5,103.25 C174.75,98.25 180,87.875 178.5,85.25 C177,82.625 173.75,85 171.25,85.625 C168.75,86.25 165.25,85.875 164.75,86.25 C164.25,86.625 164.375,86.875 163.25,87.5 C162.125,88.125 159.125,88.375 159.125,88.375 C159.125,88.375 155.75,88.5 155.125,87.5 C154.5,86.5 153.75,86.375 154.375,84.25 C155,82.125 155.625,82.375 155,81.375 C154.375,80.375 154.25,80.875 153.25,79.375 C152.25,77.875 149.875,77.375 149.875,75.875 C149.875,74.375 149.75,74 149.125,74 C148.5,74 148.25,74.25 147.75,73.25 C147.25,72.25 147.125,71.625 146.625,70.25 C146.125,68.875 147,69.625 146,68 C145,66.375 144,66.875 144,64.875 C144,62.875 144.75,63 143.75,62.125 C142.75,61.25 142.625,62 142.125,60.5 C141.625,59 141.25,56.75 141.25,56.125 C141.25,55.5 141,56 140.75,55.25 C140.5,54.5 138.5,53 138.5,53 C138.5,53 137.625,53.125 137.25,52 C136.875,50.875 137,52 136.75,49.75 C136.5,47.5 135.625,47 134.75,45.5 C133.875,44 137.75,47 133.375,41 C129,35 126.5,31.625 126.625,31.125 C126.625,31.125 125.5,27.875 126.625,28.625 C127.75,29.375 128.5,30.75 129.25,31.25 C130,31.75 130.625,32 131.125,31.875 C131.625,31.75 131.75,29.875 131.75,29.125 C131.75,28.375 132.75,25.75 132.75,25.75 L130.5,21.375 L128.5,22.625 C128.5,22.625 128.25,23.5 127.75,23.5 C127.25,23.5 126.25,23 126.25,23 L125,22.625 L123.375,24.125 L123.375,24.125 Z\"></path>\n					<path d=\"M187.75,163 C188,164 188.75,163.75 188.75,166 C188.75,168.25 189.25,171.5 187.75,169.5 C186.25,167.5 186.25,166.75 186.25,168 C186.25,169.25 186.5,171.5 186.5,171.5 C186.5,171.5 187.73063,173.2007 186.13964,173.2007 C184.54865,173.2007 184.37187,173.02393 184.37187,173.73103 C184.37187,174.43814 184.54865,175.85235 184.54865,175.85235 L183.48799,176.91301 L182.95766,179.21111 C182.95766,179.21111 184.72542,179.38789 183.66476,181.15565 C182.6041,182.92342 182.25055,183.45375 182.25055,183.45375 C182.25055,183.45375 182.42733,181.86276 182.07377,185.3983 C181.72022,188.93383 181.72022,189.46416 181.72022,189.46416 C181.72022,189.46416 182.78088,189.11061 181.36667,190.87837 C179.95245,192.64614 179.42212,193.17647 179.06857,194.06035 C178.71502,194.94424 179.42212,195.82812 178.36146,196.712 C177.3008,197.59589 176.77047,198.30299 176.77047,198.30299 L175.70981,199.36365 C175.70981,199.36365 175.35626,200.77787 175.35626,201.48497 C175.35626,202.19208 174.82593,202.72241 174.82593,202.72241 C174.82593,202.72241 174.2956,203.25274 174.2956,203.95985 C174.2956,204.66696 174.47238,205.02051 173.58849,205.72762 C172.70461,206.43472 173.05816,206.6115 171.9975,207.49538 C170.93684,208.37927 170.58329,207.14183 170.58329,209.08637 C170.58329,211.03092 170.05296,211.9148 169.16907,211.9148 C168.28519,211.9148 159.79991,212.09158 158.3857,211.9148 C156.97148,211.73802 159.26958,204.66696 157.32504,203.42952 C155.38049,202.19208 154.14306,197.94944 155.38049,197.06556 C156.61793,196.18167 155.91082,197.06556 156.79471,196.18167 C157.67859,195.29779 157.67859,195.29779 158.20892,194.23713 C158.73925,193.17647 159.62313,193.17647 159.62313,193.17647 C159.62313,193.17647 158.56247,190.87837 159.26958,190.87837 C159.97669,190.87837 159.62313,188.22672 159.62313,188.22672 C159.62313,188.22672 159.97669,186.98929 160.50702,186.1054 C161.03735,185.22152 159.97669,184.33764 161.3909,184.16086 C162.80511,183.98408 163.51222,184.33764 163.51222,183.45375 C163.51222,182.56987 162.62834,182.39309 161.92123,182.21631 C161.21412,182.03954 160.86057,182.21631 160.86057,180.97888 C160.86057,179.74144 160.33024,180.27177 159.97669,179.03433 C159.62313,177.7969 158.56247,178.504 159.79991,176.91301 C161.03735,175.32202 161.03735,176.38268 161.3909,174.79169 C161.74445,173.2007 160.33024,172.14004 162.09801,172.14004 C163.86577,172.14004 164.3961,172.67037 166.16387,171.96327 C167.93164,171.25616 165.98709,171.07938 168.81552,171.25616 C171.64395,171.43294 171.82073,172.31682 172.88139,171.25616 C173.94205,170.1955 174.47238,170.54905 174.64915,169.31162 C174.82593,168.07418 174.64915,167.72063 175.88659,167.1903 C177.12403,166.65997 177.12403,167.1903 178.00791,166.48319 C178.89179,165.77608 179.5989,164.8922 179.42212,163.83154 C179.24535,162.77088 178.36146,162.24055 179.95245,162.24055 C181.54344,162.24055 181.36667,162.77088 182.07377,161.88699 C182.78088,161.00311 182.6041,161.00311 182.95766,159.41212 C183.31121,157.82113 182.95766,157.46758 183.84154,156.93725 C184.72542,156.40692 186.31641,154.63915 186.31641,154.63915 C186.31641,154.63915 186.84674,153.04816 187.55385,155.52303 C188.26096,157.99791 187.55385,157.64435 188.43773,158.35146 C189.32162,159.05857 189.49839,158.52824 189.49839,159.41212 C189.49839,160.296 189.14484,162.06377 189.14484,162.06377 L187.75,163 L187.75,163 Z\" id=\"madagascar\"></path>\n				</g>\n				<g id=\"south-america\" transform=\"translate(121.000000, 243.000000)\" stroke-width=\"3\" stroke=\"#9C240F\" sketch:type=\"MSShapeGroup\" data-continent-id=\"1\">\n					<path d=\"M138.5,59.75 C138.25,61 139,62.5 137.5,64 C136,65.5 136,68 134.25,68 C132.5,68 130.25,69 130.25,69 L130.25,70.75 C130.25,70.75 131.25,73 129.75,74 C128.25,75 127.25,75.5 127,76.5 C126.75,77.5 127.125,79.5 127.125,79.5 L126.875,81.25 C126.875,81.25 127.875,83.25 127.125,84.25 C126.375,85.25 126.375,85.375 126.375,87 C126.375,88.625 127.125,91.25 126.375,92 C125.625,92.75 126.125,94 125.25,94.375 C124.375,94.75 123.25,95 122.875,95.75 C122.5,96.5 123.125,97.375 122.5,98.25 C121.875,99.125 122,99.875 121.375,100.125 C120.75,100.375 120.5,100 120.25,101.125 C120,102.25 120.625,103.125 119.625,103.625 C118.625,104.125 117.375,105.25 117,105.75 C116.625,106.25 113.75,107.25 113.25,107.375 C112.75,107.5 101.75,108.375 100.25,111.5 C98.75,114.625 98.75,117.375 98.125,118 C97.5,118.625 97.25,117.75 97.375,119.125 C97.5,120.5 97.625,121 97.625,122.375 C97.625,123.75 98.125,122.875 98,124.125 C97.875,125.375 98,126.875 96.625,127.375 C95.25,127.875 93.75,128 93.625,129.25 C93.5,130.5 93.625,130.875 93.375,131.625 C93.125,132.375 92.875,132.5 92.375,133 C91.875,133.5 91.5,134.125 91.25,134.875 C91,135.625 91.375,135.625 90.75,136.5 C90.125,137.375 90.125,137.25 89.875,138 C89.625,138.75 90.375,138.875 89,139.25 C87.625,139.625 84.375,141.125 85,142 C85.625,142.875 86.5,143.125 85,143.5 C83.5,143.875 83.75,143.75 82.25,144 C80.75,144.25 81,144.125 79.375,144.5 C77.75,144.875 77.5,145.375 76.5,145.5 C75.5,145.625 75,145.375 74.375,145.375 C73.75,145.375 73.25,145.375 73.25,146 C73.25,146.625 73.125,146.75 73.75,147.25 C74.375,147.75 76.125,148.25 76.25,148.75 C76.375,149.25 76.375,149.625 76.375,150.5 C76.375,151.375 76.5,151.5 77,151.625 C77.5,151.75 77.625,151.875 77.75,152.375 C77.875,152.875 76.5,154.625 75.75,155.125 C75,155.625 74.375,156.25 72.625,156.375 C70.875,156.5 71.25,156.25 70.125,156.875 C69,157.5 69,157.625 67.75,157.625 C66.5,157.625 66.125,157.625 64.875,157.875 C63.625,158.125 62.75,158.375 62.75,158.375 C62.75,158.375 63.25,159.125 63.375,159.875 C63.5,160.625 64.125,160.75 63.625,161.875 C63.125,163 62.25,163.5 61.875,164 C61.5,164.5 61.5,164.25 61.5,165.25 L58.875,165.625 C58.875,165.625 58,164.875 57.75,166 C57.5,167.125 58.75,168.125 58.75,168.125 C58.75,168.125 57,170.75 57.25,171.375 C57.5,172 58.125,173 57.875,173.5 C57.625,174 57.75,174.25 57.125,174.75 C56.5,175.25 57,175.75 56.625,176.25 C56.25,176.75 55.875,177.5 55,177.875 C54.125,178.25 53.875,178.875 53.875,178.875 L53.25,180 C53.25,180 52.75,180.625 53.375,181.375 C54,182.125 54.625,181.625 54.25,183 C53.875,184.375 54,184.75 54,184.75 C54,184.75 55.25,183.375 55.125,187.125 C55,190.875 54.375,191.75 54.375,191.75 C54.375,191.75 53.75,191.625 54,192.75 C54.25,193.875 54.75,194.875 54.125,195.5 C53.5,196.125 53.625,195.125 52.625,197.125 C51.625,199.125 52.625,201.875 53.25,202.5 C53.875,203.125 54.375,203.25 54.25,204.5 C54.125,205.75 53.5,205.875 54,206.75 C54.5,207.625 56.125,208.25 56.375,209.125 C56.625,210 56.125,210.625 56.625,211.25 C57.125,211.875 57.75,212.375 57.75,212.375 C57.75,212.375 57.5,213.375 57.5,214.5 C57.5,215.625 57,215.5 57,216.5 C57,217.5 57,218.75 57.5,217.5 C58,216.25 57.875,216.25 58.375,215.75 C58.875,215.25 60.5,215.25 61,215.25 C61.5,215.25 62,214.5 62.875,214.875 C63.75,215.25 63.875,214.875 64.375,216.125 C64.875,217.375 64.625,217.625 65.625,217.875 C66.625,218.125 67.5,218 68.5,218 C69.5,218 69.75,217.25 70,218.375 C70.25,219.5 71.75,219.875 70.25,220.375 C68.75,220.875 68.5,220.375 67,220.875 C65.5,221.375 65.5,221.375 65,221.5 C64.5,221.625 64.5,222 63.625,222.375 C62.75,222.75 63.25,223.125 61.625,222.75 C60,222.375 60.625,222.875 59.5,222.125 C58.375,221.375 57.875,221 57.875,220.5 C57.875,220 57.125,219.5 57.125,219.5 L54.25,217 L52.875,217 L50.875,217 C50.125,217 49.625,216.375 49.625,216.375 L47.875,216.4375 C47.875,216.4375 47.4375,216 47.6875,215.4375 C47.9375,214.875 47.9375,214.875 47.625,214.8125 C47.3125,214.75 46.4375,214.6875 45.875,214.5 C45.3125,214.3125 45.875,213.5 45.75,213.25 C45.625,213 44.4375,213 43.8125,212.9375 C43.1875,212.875 42.3125,212.5625 41.8125,211.9375 C41.3125,211.3125 41.4375,211.125 40.375,210.25 C39.3125,209.375 39.625,209.25 38.6875,208.9375 C37.75,208.625 37.4375,208.6875 37.25,207.9375 C37.0625,207.1875 36.3125,207.0625 36,206.3125 C35.6875,205.5625 36,205.0625 35.125,204.5 C34.25,203.9375 34.0625,204.375 33.9375,203.1875 C33.8125,202 34.125,201.4375 33.8125,200.8125 C33.5,200.1875 33.6875,200.6875 33.1875,199.9375 C32.6875,199.1875 32.4375,199.0625 32.25,198.1875 C32.0625,197.3125 32.0625,196.875 31.75,196.3125 C31.4375,195.75 30.875,195.5 30.8125,194.875 C30.75,194.25 30.75,194 30.75,193.4375 C30.75,192.875 30.9375,192.4375 30.625,191.1875 C30.3125,189.9375 30.5,189.625 29.875,188.875 C29.25,188.125 29.1875,188.625 28.6875,187 C28.1875,185.375 27.625,185.125 27.9375,184.3125 C28.25,183.5 28.4375,183.375 28.5,182.75 C28.5625,182.125 28.9375,182.25 29,181.375 C29.0625,180.5 29.0625,180.75 29.0625,179.5625 C29.0625,178.375 28.3125,179.875 29.1875,176.625 C30.0625,173.375 30.0625,173.5 30.125,172.75 C30.1875,172 31.375,171.875 30.9375,170.5625 C30.5,169.25 30.25,169.25 30.375,168.375 C30.5,167.5 31,167.125 30.875,166.6875 C30.75,166.25 30.9375,166.4375 30.75,165.9375 C30.5625,165.4375 31.25,165.6875 30.4375,165.0625 C29.625,164.4375 29.375,164.5625 29.25,163.625 C29.125,162.6875 29.125,161.9375 29.1875,158.25 C29.25,154.5625 29,154.3125 29.625,153.25 C30.25,152.1875 30.5625,152.0625 30.5625,151.1875 C30.5625,150.3125 31.0625,149.1875 30.6875,148.125 C30.3125,147.0625 30,146.9375 30.375,146.3125 C30.75,145.6875 31.0625,145.6875 31.0625,144.9375 C31.0625,144.1875 31.0625,145.25 31.125,143.625 C31.1875,142 30.6875,143.1875 31.3125,141.0625 C31.9375,138.9375 32.1875,136.8125 32.25,135.75 C32.3125,134.6875 32.375,134.375 32.0625,133.75 C31.75,133.125 31.3125,130.125 31.3125,129.125 C31.3125,128.125 31.5,128.375 31.75,127.375 C32,126.375 32.0625,126.1875 32,125.875 C31.9375,125.5625 32,125.25 32.1875,124.4375 C32.375,123.625 32,121.9375 32.6875,120.1875 C33.375,118.4375 33.5625,119.125 33.375,117.875 C33.1875,116.625 31.75,114.625 32.1875,113.25 C32.625,111.875 33.0625,112.125 33,110.3125 C32.9375,108.5 32.75,106.0625 33.1875,105.0625 C33.625,104.0625 33.875,100.625 33.6875,99.8125 C33.5,99 34.25,94.625 32,93.875 C29.75,93.125 29.75,93.375 29.125,92.75 C28.5,92.125 27.25,89.375 26.5,89.125 C25.75,88.875 24.625,88.625 23.75,88 C22.875,87.375 21.625,86.25 21.625,86.25 C21.625,86.25 20.75,86.125 19.875,85.625 C19,85.125 17.625,84.125 17.125,83.375 C16.625,82.625 16.375,83.375 15.875,82.375 C15.375,81.375 13.875,79.125 14,78.125 C14.125,77.125 15.125,75.25 13.75,74.75 C12.375,74.25 11,72.125 10.375,71.625 C9.75,71.125 7.75,69 7.25,68 C6.75,67 5.875,67.75 5.375,65.75 C4.875,63.75 5.125,62.125 5.125,62.125 C5.125,62.125 3.125,59.875 2.625,59.375 C2.125,58.875 1.25,56.25 1.25,56.25 C1.25,56.25 1,52.25 1.375,51 C1.75,49.75 2.75,50.875 2,48.75 C1.25,46.625 0.25,47.125 0.875,45.125 C1.5,43.125 2.125,42.375 2.875,40.5 C3.625,38.625 3.5,36.125 5.375,34.875 C7.25,33.625 6.875,31.125 6.875,30.375 L6.875,27.25 C6.875,26.25 6.75,25.5 7.875,24.25 C9,23 9.625,21.875 9.625,21.875 L10.875,20.75 L10.875,18.75 L11.625,16.5 C11.625,16.5 12.125,15.375 12.25,14.875 C12.375,14.375 12,12.375 12,12.375 L12.25,10.75 L15.375,9.875 C15.375,9.875 15.75,10.25 16.75,9.875 C17.75,9.5 18.75,8.625 18.75,8.625 L21,7.375 C21,7.375 22.5,6.375 23,5.875 C23.5,5.375 25.25,4.75 25.25,4.75 C25.25,4.75 26.125,4.5 26.75,4.5 C27.375,4.5 29.5,3.875 29.5,3.875 C29.5,3.875 29.625,3.25 30.375,2.75 C31.125,2.25 31.625,1.625 32.25,1.5 C32.875,1.375 36.25,0.875 36.25,0.875 C36.25,0.875 37.5,1.75 37.625,3 C37.75,4.25 37.25,5 38.25,4.875 C39.25,4.75 40.25,4.5 40.75,4.25 C41.25,4 41,2.875 42.25,3.75 C43.5,4.625 43.625,4.875 44.125,4.875 C44.625,4.875 46,4.5 46,4.5 L51.5,6.375 L53.375,6 C54,5.875 57.125,5.625 57.125,5.625 C57.125,5.625 58.5,6 59,6.5 C59.5,7 62.625,8.875 63.625,10.375 C64.625,11.875 66.125,12.375 66.375,13 C66.625,13.625 67.625,14.25 68.125,14.25 C68.625,14.25 68.625,15.25 69.25,15.375 C69.875,15.5 71.25,15.5 71.25,15.5 C71.25,15.5 71.375,16 71.875,16.625 C72.375,17.25 73.5,16 73.75,17.375 C74,18.75 73.625,19.5 74.375,19.5 C75.125,19.5 75.875,19 75.875,19 L77.125,18.5 C77.125,18.5 77.125,17.5 78.125,18.5 C79.125,19.5 79.875,19.25 80.75,19.5 C81.625,19.75 80.375,20.375 82.5,20.875 C84.625,21.375 86.625,21.625 87.125,21.625 C87.625,21.625 87.625,19.625 89.375,21.25 C91.125,22.875 92.375,23.625 92.375,23.625 C92.375,23.625 92.625,23.375 93.375,26 C94.125,28.625 94.25,29.375 94.75,30.25 C95.25,31.125 97.875,32.5 96,34.75 C94.125,37 91.75,36.625 93,37.125 C94.25,37.625 95.75,39.125 96.625,39.125 C97.5,39.125 99.375,38.75 100,38.75 C100.625,38.75 102.375,39.125 103.125,39.25 C103.875,39.375 104.75,39.125 105.5,39.25 C106.25,39.375 107.125,39.75 107.875,40.125 C108.625,40.5 109.5,40.25 110.25,40.625 C111,41 111,41.125 111.5,42 C112,42.875 113,43.25 114.125,43.25 C115.25,43.25 115.625,43 116.375,43.5 C117.125,44 118.125,43.5 118.75,43.5 C119.375,43.5 119.875,42.875 120.75,43.875 C121.625,44.875 121.75,44.75 123.625,45 C125.5,45.25 128.875,47.625 129.75,47.875 C130.625,48.125 131.125,49.75 132,50 C132.875,50.25 134.25,50 135.25,51 C136.25,52 137.25,52.75 137.5,54.5 C137.75,56.25 137.5,56.75 137.875,57.875 C138.25,59 138.75,60.25 138.5,59.75 L138.5,59.75 Z\"></path>\n				</g>\n				<g id=\"asia\" transform=\"translate(380.000000, 8.000000)\" stroke-width=\"3\" stroke=\"#48C74C\" sketch:type=\"MSShapeGroup\" data-continent-id=\"4\">\n					<path d=\"M91.95179,45.04383 C92.6589,45.48578 93.36601,52.20329 93.36601,52.20329 C93.36601,52.20329 93.54278,55.56205 93.01245,56.26915 C92.48212,56.97626 92.48212,60.15824 92.48212,60.15824 L91.24468,62.27956 L89.30014,67.05253 C89.30014,67.05253 88.0627,70.94162 88.23948,71.8255 C88.41626,72.70939 89.30014,74.65393 89.30014,74.65393 C89.30014,74.65393 88.23948,76.24492 88.76981,77.1288 C89.30014,78.01269 90.00725,80.31078 90.00725,81.54822 L90.00725,86.32119 L90.00725,90.38706 C90.00725,90.38706 91.77501,90.74061 91.77501,91.62449 C91.77501,92.50838 91.77501,93.92259 91.06791,95.16003 C90.3608,96.39746 89.47692,96.92779 89.30014,98.51878 C89.12336,100.10977 89.30014,101.52399 89.30014,101.52399 L90.71435,102.23109 L93.89634,104.35242 C93.89634,104.35242 95.48733,104.35242 95.6641,105.58985 C95.84088,106.82729 96.54799,107.35762 95.84088,108.77183 C95.13377,110.18605 93.36601,111.06993 93.54278,111.95381 C93.71956,112.8377 94.07311,113.19125 94.24989,114.42869 C94.42667,115.66612 94.957,115.8429 94.957,117.61067 C94.957,119.37843 96.01766,120.43909 94.957,120.96942 C93.89634,121.49975 93.71956,121.85331 92.83568,122.20686 C91.95179,122.56041 88.76981,122.56041 88.59303,123.79785 C88.41626,125.03529 88.23948,125.38884 87.53237,126.80306 C86.82527,128.21727 86.64849,128.57082 85.76461,128.7476 C84.88072,128.92438 84.52717,128.7476 83.64329,128.57082 C82.7594,128.39405 81.16841,127.68694 81.16841,127.68694 L79.7542,127.51016 L78.51676,126.27273 C78.51676,126.27273 77.80966,126.80306 77.10255,127.15661 C76.39544,127.51016 74.80445,128.92438 74.80445,128.92438 C74.80445,128.92438 72.32958,129.63148 71.62247,129.63148 C70.91536,129.63148 70.91536,129.45471 70.20826,129.63148 C69.50115,129.80826 68.26371,129.63148 67.73338,130.33859 C67.20305,131.0457 68.44049,131.7528 65.78884,131.92958 C63.13719,132.10636 63.13719,132.10636 62.43008,132.10636 C61.72298,132.10636 60.48554,135.81867 60.48554,135.81867 C60.48554,135.81867 61.89975,137.0561 60.83909,137.40966 C59.77843,137.76321 59.07133,138.82387 58.541,139.53098 C58.01067,140.23808 57.65711,140.76841 57.83389,141.6523 C58.01067,142.53618 57.83389,143.06651 58.18744,144.12717 C58.541,145.18783 59.42488,147.30915 59.42488,147.30915 C59.42488,147.30915 60.13199,147.66271 59.95521,148.72337 C59.77843,149.78403 59.2481,150.31436 59.77843,151.19824 C60.30876,152.08212 61.36942,152.43568 61.36942,152.43568 L62.43008,153.84989 C62.43008,153.84989 63.8443,153.49634 63.8443,154.73377 C63.8443,155.97121 64.02107,156.50154 64.19785,157.91575 C64.19785,157.91575 65.21933,159.31473 65.92643,158.7844 C66.63354,158.25407 67.87098,157.37018 67.87098,156.30952 C67.87098,155.24886 67.6942,154.89531 68.57808,154.71853 C69.46197,154.54176 69.9923,154.54176 70.87618,154.1882 C71.76006,153.83465 71.40651,153.83465 72.46717,153.83465 C73.52783,153.83465 73.35105,153.30432 73.88138,154.36498 C74.41171,155.42564 73.70461,154.71853 74.05816,156.30952 C74.41171,157.90051 74.58849,157.72374 74.76527,158.7844 C74.94204,159.84506 74.76527,159.49151 74.41171,160.90572 C74.05816,162.31993 74.05816,162.49671 73.17428,162.85026 C72.29039,163.20382 70.52263,164.0877 70.34585,165.50191 C70.16907,166.91613 70.34585,165.14836 70.52263,167.44646 C70.6994,169.74455 70.6994,170.45166 71.40651,170.80521 C72.11362,171.15877 72.29039,170.98199 72.29039,172.04265 C72.29039,173.10331 71.76006,173.45686 72.9975,173.63364 C74.23494,173.81042 75.11882,173.45686 75.11882,173.45686 C75.11882,173.45686 77.41692,173.81042 76.88659,175.22463 C76.35626,176.63884 75.2956,175.75496 76.0027,177.34595 C76.70981,178.93694 76.88659,177.6995 77.06336,179.46727 C77.24014,181.23504 76.53303,181.76537 77.41692,181.76537 C78.3008,181.76537 79.89179,182.47248 79.89179,182.47248 L80.06857,184.77057 L80.42212,186.18479 C80.42212,186.18479 78.12402,185.3009 78.47758,186.89189 C78.83113,188.48288 79.18469,188.48288 79.18469,188.48288 C79.18469,188.48288 81.48278,188.30611 81.48278,189.8971 C81.48278,191.48809 81.12923,192.01842 81.30601,192.9023 C81.48278,193.78618 82.28981,193.77081 82.11303,195.00824 C81.93625,196.24568 81.83634,196.96816 81.65956,198.02882 C81.48278,199.08948 82.18989,199.61981 80.77568,199.97337 C79.36146,200.32692 78.3008,201.38758 78.3008,201.38758 C78.3008,201.38758 79.89179,202.97857 76.53303,202.27147 C73.17428,201.56436 73.70461,201.03403 72.29039,200.68048 C70.87618,200.32692 71.05296,201.03403 69.9923,200.32692 C68.93164,199.61981 68.57808,199.97337 68.22453,198.91271 C67.87098,197.85205 65.25,196.375 65.25,196.375 C65.25,196.375 64.375,196.375 64.25,197.25 C64.125,198.125 66,198.125 63.875,198.5 C63.875,198.5 62.625,198.625 62,198.75 C61.375,198.875 60.75,198.5 60.125,199 C59.5,199.5 59.5,199.875 58.625,200 C57.75,200.125 57.875,200 56.875,200.125 C55.875,200.25 55.125,201.125 55.125,201.125 C55.125,201.125 55.375,201.625 53.75,201.5 C52.125,201.375 51.5,201.75 51.5,201.75 C51.5,201.75 51.5,203.25 50.125,202.25 C48.75,201.25 48.125,201.25 48.125,200.75 C48.125,200.25 48.75,199.75 49.25,199.25 C49.25,199.25 48.77909,197.76366 46.92294,198.11721 C45.06678,198.47077 43.91773,198.38238 43.47579,199.0011 C43.03385,199.61981 42.59191,200.85725 41.8848,200.94564 C41.1777,201.03403 39.14476,201.2108 38.61443,200.59209 C38.0841,199.97337 37.125,198 34.625,197.25 C32.125,196.5 30,195.875 29.125,196.5 C28.25,197.125 29,197.875 27.25,197.375 C25.5,196.875 23.75,196.125 23.25,196.375 C22.75,196.625 21.125,196.375 21.125,197 C21.125,197.625 21.875,198.625 20.875,198.75 C19.875,198.875 18.625,199.375 18,199.625 C17.375,199.875 17.75,200.125 15.5,200.125 C13.25,200.125 11,200.5 10.125,199.75 C9.25,199 8.875,198.125 8.5,197.625 C8.125,197.125 7.125,196.625 7.125,196.625 L5.875,196.625 C5.875,196.625 4.5,197 4,197.625 C3.5,198.25 3.5,198.625 3,199 C2.5,199.375 2.5,199.25 1.875,200 C1.25,200.75 1.75,201.125 1.25,201.75 C0.75,202.375 0.375,201.875 0.125,202.75 C-0.125,203.625 0.125,203.25 0.25,204.125 C0.375,205 1,205 0.25,206 C0.25,206 1.3125,208.1875 1.75,209.25 C2.1875,210.3125 3.625,210.875 2.5,211.25 C1.375,211.625 -4.65183447e-14,211.6875 0.25,212.6875 C0.5,213.6875 2.875,216.0625 3.5625,217.25 C4.25,218.4375 3.75,221.125 4.875,222.125 C6,223.125 7.75,224 8.375,224 C9,224 10.875,222.625 11.125,223.875 C11.375,225.125 10.875,227.5 11.625,227.625 C12.375,227.75 14.125,228.625 14.5,228 C14.875,227.375 13.24698,225.60599 14.48441,225.07566 C15.72185,224.54533 14.48441,222.07046 17.13607,223.30789 C19.78772,224.54533 19.78772,225.42921 21.37871,225.60599 C22.9697,225.78277 24.03036,225.25244 25.09102,225.42921 C26.15168,225.60599 27.38911,226.66665 27.74267,225.42921 C28.09622,224.19178 28.9801,223.48467 29.86399,223.48467 C30.74787,223.48467 32.69241,222.95434 33.04597,224.015 C33.39952,225.07566 32.51564,226.3131 32.69241,227.37376 C32.86919,228.43442 33.92985,228.78797 33.5763,234.79838 C33.22274,240.80878 34.63696,243.81399 33.75307,244.34432 C32.86919,244.87465 31.63175,246.46564 31.98531,247.34952 C32.33886,248.23341 33.75307,251.23861 33.92985,253.35993 C34.10663,255.48125 34.81373,256.01158 34.99051,257.07224 C35.16729,258.1329 33.75307,258.30968 35.16729,260.07744 C36.5815,261.84521 39.58671,262.90587 39.40993,264.14331 C39.23315,265.38075 41.35447,265.91108 42.23836,267.14851 C43.12224,268.38595 44.53645,271.92148 44.89001,273.51247 C45.24356,275.10346 46.481,272.80537 47.1881,275.45702 C47.89521,278.10867 50.01653,277.75511 50.54686,279.69966 C51.07719,281.6442 53,283.5 54,284 C55,284.5 58.25,285.25 58,287 C57.75,288.75 60.75,290.5 60.75,291.75 C60.75,293 60.5,295.5 60.5,295.5 C60.5,295.5 60,296 61,297 C62,298 62.75,298.75 63,300.25 C63.25,301.75 64.25,301.5 64.25,301.5 C64.25,301.5 74,300.5 77.25,299.5 C80.5,298.5 84.5,296.75 84.5,295.75 C84.5,294.75 84.5,295 86,294.5 C87.5,294 88.5,292 88.5,292 L90,290.75 C90,290.75 90.25,288.75 91.5,289 C92.75,289.25 94.25,290 94.25,289 C94.25,288 93.5,289.25 96.5,284.25 C99.5,279.25 100,277.5 99.75,276.5 C99.5,275.5 99.5,275.5 100.5,274.75 C101.5,274 102,271.5 102,271.5 L101.5,269.25 L102.5,267 C102.5,267 103.93342,263.08265 102.69599,262.55232 C101.45855,262.02199 101.63533,261.66843 101.63533,260.25422 C101.63533,258.84001 100.04434,257.95612 100.04434,257.95612 C100.04434,257.95612 100.04434,258.48645 98.63012,257.95612 C97.21591,257.42579 95.44814,255.8348 95.44814,255.8348 C95.44814,255.8348 93.85715,256.54191 93.68037,255.48125 C93.5036,254.42059 94.03393,252.8296 93.15004,253.35993 C92.26616,253.89026 91.2055,253.71348 90.67517,254.42059 C90.14484,255.1277 91.38228,256.18836 88.2003,256.18836 C85.01832,256.18836 84.31121,257.24902 83.6041,256.01158 C82.897,254.77414 82.897,254.77414 82.54344,253.35993 C82.18989,251.94572 83.25055,252.65282 81.65956,251.59216 C80.06857,250.5315 79.71502,250.5315 79.71502,249.64762 C79.71502,248.76374 79.18469,248.23341 79.18469,248.23341 C79.18469,248.23341 77.94725,248.94051 77.41692,247.5263 C76.88659,246.11209 78.12402,245.2282 76.70981,243.99077 C75.2956,242.75333 75.2956,242.57655 74.76527,241.51589 C74.23494,240.45523 73.70461,239.74812 73.70461,239.74812 C73.70461,239.74812 72.46717,239.04102 72.9975,238.33391 C73.52783,237.6268 73.17428,237.45003 74.76527,237.27325 C76.35626,237.09647 76.70981,236.74292 77.41692,236.21259 C78.12402,235.68226 77.77047,235.32871 79.00791,235.15193 C80.24535,234.97515 80.42212,233.91449 80.95245,235.32871 C81.48278,236.74292 81.30601,237.27325 81.30601,239.21779 C81.30601,241.16234 81.12923,242.57655 81.65956,243.63721 C82.18989,244.69787 82.54344,245.2282 82.72022,245.93531 C82.897,246.64242 83.07377,247.17275 83.07377,247.17275 C83.07377,247.17275 83.25055,247.34952 84.13443,247.34952 C85.01832,247.34952 85.19509,246.64242 85.54865,247.5263 C85.9022,248.41018 85.54865,248.05663 86.07898,248.76374 C86.60931,249.47084 86.43253,249.8244 87.31641,249.47084 C88.2003,249.11729 88.37707,248.23341 89.26096,248.58696 C90.14484,248.94051 90.85195,249.11729 90.85195,249.11729 C90.85195,249.11729 92.08938,249.29407 92.08938,248.23341 C92.08938,247.17275 91.91261,246.64242 92.44294,245.93531 C92.97327,245.2282 93.32682,243.46044 94.38748,245.75853 C95.44814,248.05663 94.91781,248.41018 95.44814,249.29407 C95.97847,250.17795 96.33202,250.88506 97.39268,250.5315 C98.45334,250.17795 98.98367,250.17795 99.69078,249.47084 C100.39789,248.76374 101.105,248.41018 101.105,248.41018 C101.105,248.41018 100.92822,246.64242 101.98888,246.28886 C103.04954,245.93531 104.28698,244.87465 104.28698,244.87465 L105.52441,243.46044 L106.58507,242.04622 L109.23672,242.04622 C109.94383,242.04622 110.65094,241.16234 111.35804,240.98556 C112.06515,240.80878 114.36325,240.10168 114.7168,241.33911 C115.07035,242.57655 114.89358,244.5211 115.24713,245.2282 C115.60068,245.93531 117.89878,246.81919 117.89878,246.81919 L119.31299,246.81919 C120.0201,246.81919 120.37366,245.93531 120.55043,247.17275 C120.72721,248.41018 120.37366,248.94051 120.72721,249.64762 C121.08076,250.35473 123.37886,250.35473 123.37886,250.35473 C123.37886,250.35473 125.67696,250.35473 124.6163,251.41539 C123.55564,252.47605 122.84853,252.65282 122.49498,253.35993 C122.14142,254.06704 121.43432,254.24381 122.3182,254.59737 C123.20208,254.95092 123.02531,254.06704 123.73241,255.30447 C124.43952,256.54191 124.26274,256.18836 124.79307,256.89546 C125.3234,257.60257 124.43952,257.77935 126.03051,257.95612 C127.6215,258.1329 128.15183,257.95612 128.15183,257.95612 L128.85894,256.18836 C128.85894,256.18836 129.74282,254.95092 130.44993,256.36513 C131.15703,257.77935 130.45881,257.74902 130.28203,259.51678 C130.10526,261.28455 129.92848,263.03087 129.92848,264.26831 C129.92848,265.50575 129.17848,266.21285 129.35526,267.45029 C129.53203,268.68773 129.78203,269.46806 129.78203,270.88227 C129.78203,272.29648 131.15703,271.74471 131.15703,272.98214 C131.15703,274.21958 130.98026,274.57313 131.68736,275.28024 C132.39447,275.98735 133.16224,277.52656 133.16224,278.23367 C133.16224,278.94077 133.8479,279.2211 133.8479,280.45854 C133.8479,281.69598 133.79612,282.82986 134.50323,283.18342 C135.21033,283.53697 136.36566,283.73519 136.36566,285.14941 C136.36566,286.56362 137.52099,288.08139 137.52099,288.08139 C137.52099,288.08139 138.08165,289.36172 138.08165,290.06882 C138.08165,290.77593 139.28876,291.19014 139.28876,291.89725 C139.28876,292.60436 140.70298,291.89725 141.58686,296.67022 C142.47074,301.44319 143.00107,298.43799 144.41529,302.50385 C145.8295,306.56972 146.53661,307.63038 147.42049,307.63038 C148.30437,307.63038 149.36503,307.27682 149.54181,306.39294 C149.71859,305.50906 149.54181,305.50906 150.42569,305.1555 C151.30958,304.80195 151.1328,304.97873 151.30958,303.91807 C151.48635,302.8574 150.60247,302.68063 150.95602,301.97352 C151.30958,301.26641 150.42569,299.8522 151.83991,299.8522 C153.25412,299.8522 154.31478,298.61476 154.31478,298.61476 C154.31478,298.61476 153.78445,297.90766 153.78445,297.02377 C153.78445,296.13989 153.07734,298.79154 153.78445,294.90245 C154.49156,291.01337 154.84511,290.30626 154.66833,288.00816 C154.49156,285.71007 153.60767,286.77073 154.66833,283.76552 C155.72899,280.76032 156.25932,282.17453 156.25932,279.87643 C156.25932,277.57834 157.31998,275.10346 157.49676,273.68925 C157.67354,272.27504 158.20387,273.3357 158.20387,271.74471 C158.20387,270.15372 157.31998,269.26983 158.38064,268.20917 C159.4413,267.14851 160.85552,266.79496 160.85552,265.55752 L160.85552,262.90587 C160.85552,262.02199 161.20907,260.25422 161.20907,260.25422 C161.20907,260.25422 163.50717,260.07744 162.97684,259.01678 C162.44651,257.95612 162.62329,256.71869 162.97684,255.8348 C163.33039,254.95092 164.375,251.25 165.875,252.25 C167.375,253.25 167.875,253.25 167.875,253.25 C167.875,253.25 169.25,251.875 169.125,251.25 C169,250.625 169.625,249.5 169.625,249.5 C169.625,249.5 169.875,247.75 170.375,247.625 C170.875,247.5 173.25,247.375 173.25,247.375 L174.125,249.5 C174.125,249.5 175,252.25 176.25,252.5 C177.5,252.75 177.5,254.5 177.75,256.25 C178,258 184.5,264.75 184.75,266.25 C185,267.75 188.25,266.75 188.25,266.75 C188.25,266.75 189.5,269.75 190.25,268.75 C191,267.75 195.5,270.5 195.5,270.5 C195.5,270.5 195.75,270.25 196,272.25 C196.25,274.25 197.75,274.5 197.5,276 C197.25,277.5 196.75,279 197.25,280.75 C197.75,282.5 197.75,283 198.5,284 C199.25,285 199,286.75 199.25,288 C199.5,289.25 198.25,290.25 199.25,291 C200.25,291.75 200.25,292 202.75,295.25 C205.25,298.5 204.25,298.75 205.75,299 C207.25,299.25 209,299 209,299 C209,299 210,299 210,297.75 C210,296.5 209.5,295.75 209.5,295.75 C209.5,295.75 209.75,298.75 208,294 C206.25,289.25 206.25,288.5 206.25,286.5 C206.25,284.5 206.75,285 205.5,283.75 C204.25,282.5 202.5,283 203.75,281.75 C205,280.5 205.5,280.5 205.75,279.5 C206,278.5 205.75,278.25 207,278.5 C208.25,278.75 208.5,279 208.5,279 L210.75,280.75 C210.75,280.75 210.75,281.75 211.75,281.75 C212.75,281.75 214,282.5 214,282.5 L213.75,284.75 C213.75,284.75 214.5,285.25 215,286.25 C215.5,287.25 216.75,290.75 216.75,290.75 C216.75,290.75 218,292.5 218.25,291.5 C218.5,290.5 221.75,288 221.75,287 C221.75,286 225,282.5 225.25,280.75 C225.5,279 226.5,275.75 226,273 C225.5,270.25 225.75,269.25 224.5,267.25 C223.25,265.25 223,265.25 222.25,261.75 C221.5,258.25 219.75,257 218.5,257.5 C217.25,258 216.5,258.25 216.5,258.25 C216.5,258.25 217.25,256.5 216.75,254.25 C216.25,252 216.75,251.75 214.5,252 C212.25,252.25 211.25,251.75 211,250.75 C210.75,249.75 210.5,240.125 214.125,240.625 C217.75,241.125 215.5,242.625 217.375,243 C219.25,243.375 220,246.125 221,245.5 C222,244.875 222.5,243.625 223.125,243.125 C223.75,242.625 225,242 224.625,241.125 C224.25,240.25 222.875,241.25 224.125,240 C225.375,238.75 226.875,238.375 227.25,237.625 C227.625,236.875 228.5,236.125 229,236.25 C229.5,236.375 230.375,237.375 230.625,236.125 C230.875,234.875 230.875,233.75 230.875,233.75 C230.875,233.75 230.875,233.125 232.25,231.875 C233.625,230.625 233.125,231.375 233.75,229.75 C234.375,228.125 233.875,228.875 234.875,227.875 C235.875,226.875 236.5,226.625 236.375,225.5 C236.25,224.375 235.75,224.5 236.875,224.25 C238,224 239.625,224 239.625,222.375 C239.625,220.75 239.25,219.75 239.875,218.75 C240.5,217.75 240.625,218 240.875,216.375 C241.125,214.75 241.5,214.375 241.5,212.25 C241.5,210.125 240.625,210.25 241.375,208.625 C242.125,207 242.375,203.75 241.25,203.625 C240.125,203.5 238.625,204.25 239.625,201.875 C240.625,199.5 241.375,198.625 240.5,197.125 C239.625,195.625 238.75,195.875 239,194.5 C239.25,193.125 239.75,191.5 238.375,191.125 C237,190.75 234.5,190.625 235.75,189.875 C237,189.125 237.375,189.375 237,188.625 C236.625,187.875 236.625,187.625 236.125,187.625 C235.625,187.625 234.875,188.625 234.625,187.125 C234.375,185.625 234.875,185.5 233.875,185.25 C232.875,185 232.75,185.75 232.75,184.375 C232.75,183 233.125,182.5 232.625,182.25 C232.125,182 231.875,182.125 231.875,181.25 C231.875,180.375 231,180.75 231,180.125 C231,179.5 230.125,179.5 231.125,179 C232.125,178.5 232,179.5 233.375,178 C234.75,176.5 233.875,177.75 235.25,175.75 C236.625,173.75 238.875,173.5 236.375,173.25 C233.875,173 234.25,173.75 233.375,172.875 C232.5,172 233.25,171.75 231.75,171.875 C230.25,172 230.25,172.25 229.875,171.75 C229.5,171.25 230.625,170.875 228.75,170.875 C226.875,170.875 227.5,171.625 226,170.75 C224.5,169.875 224.375,170.25 224.5,169.25 C224.625,168.25 224.625,167.375 225.625,167.125 C226.625,166.875 226.375,167.125 227,166.625 C227.625,166.125 228,166 228,165.25 C228,164.5 229.375,164.125 229.75,163.125 C230.125,162.125 230.125,160.625 230.875,160.625 C231.625,160.625 231.625,160.5 232.25,162.25 C232.875,164 231.375,164.75 233.125,164.875 C234.875,165 235.875,165.125 236.625,165 C237.375,164.875 236.875,165.125 237.75,166.125 C238.625,167.125 238.5,167.625 239.375,168.25 C240.25,168.875 240.375,170 240.375,170 C240.375,170 240.375,170.625 241.5,170.375 C242.625,170.125 244.375,170.125 244.375,170.125 C244.375,170.125 243.875,169.5 244.5,171.625 C245.125,173.75 245.5,173.25 245.5,175.125 C245.5,177 244.625,178 245.5,178.625 C246.375,179.25 247.375,179.5 247.375,179.5 C247.375,179.5 250,177 250.25,175.875 C250.5,174.75 251.25,174.375 251.125,173.5 C251,172.625 250.75,173.25 251.25,172.125 C251.75,171 251.75,169 251.75,169 C251.75,169 251.25,168.875 250.75,168.625 C250.25,168.375 250,168.5 249.75,167.125 C249.5,165.75 250,165.75 249.125,165.375 C248.25,165 247.875,164.375 247.625,163.625 C247.375,162.875 247.5,162.375 246.875,162.25 C246.25,162.125 246.375,162 245,161 C243.625,160 243.875,160.5 242.875,159.875 C241.875,159.25 241.625,158.875 241.625,158 C241.625,157.125 241.375,156.875 242,156.25 C242.625,155.625 243,157 243.125,154.75 C243.25,152.5 242.5,152.375 243.625,150.125 C244.75,147.875 244.5,147 245.375,146.25 C246.25,145.5 246.375,145.25 247.375,144.5 C248.375,143.75 248.125,144.625 249,142.75 C249.875,140.875 249.625,140.25 250.25,139.625 C250.875,139 252.25,136.75 252.125,135.125 C252,133.5 251.5,133.625 251.875,132.125 C252.25,130.625 252.375,130.625 252.625,128.625 C252.875,126.625 252.375,126.875 253,124.5 C253.625,122.125 253.75,121.625 253.375,120.75 C253,119.875 252.75,118.875 252.75,117.375 C252.75,115.875 252.875,114.625 252.75,114.125 C252.625,113.625 252.5,113.125 252.125,111.75 C251.75,110.375 250.75,109.375 250.75,109.375 C250.75,109.375 250.5,110.375 250,108.75 C249.5,107.125 249.625,107.625 249.375,106.625 C249.125,105.625 248.375,107.125 248.75,103.75 C249.125,100.375 249,99.25 249,99.25 C249,99.25 248.875,95.875 246.625,95.875 C244.375,95.875 243.625,96.5 243.375,94.625 C243.125,92.75 242.125,92.375 240.625,92.125 C239.125,91.875 238.875,92.125 238.125,91.75 C237.375,91.375 237.75,91.125 236.5,91.125 C235.25,91.125 236,91.625 234.25,91.125 C232.5,90.625 232.5,91.875 232.25,90.625 C232,89.375 232.125,88.5 233.875,85.75 C235.625,83 235.5,82.375 235.75,81 C236,79.625 234.5,80.25 236.75,78.25 C239,76.25 238.375,75.625 241,75.625 C243.625,75.625 244,75.625 245.875,74.75 C247.75,73.875 246.25,72.875 248.5,73.875 C250.75,74.875 250.5,75.875 251.75,74.75 C253,73.625 253.375,72.875 254,72.875 C254.625,72.875 257,74.25 257,74.25 C257,74.25 258,74.75 258.875,74.5 C259.75,74.25 260.5,76.125 261.375,74.375 C262.25,72.625 261.875,72.125 261,71.625 C260.125,71.125 259.125,73.375 259.625,70.375 C260.125,67.375 260.625,66.25 260.25,65.25 C259.875,64.25 257.25,60.75 260.375,62.875 C263.5,65 262.75,65.375 263.875,66 C265,66.625 264.5,66.625 264.875,69 C265.25,71.375 269,70.875 268.5,73.875 C268,76.875 268,77.75 267.75,79 C267.5,80.25 266.125,79.375 266.5,84.5 C266.875,89.625 267.25,98.75 271.75,102.75 C276.25,106.75 277.375,107.25 278,105.5 C278.625,103.75 279.25,103 278.875,101 C278.5,99 277.5,98.25 278.25,96.875 C279,95.5 279.625,94.625 279.75,93.5 C279.875,92.375 280.125,91.5 280,90.25 C279.875,89 280,87.5 279.75,86.5 C279.5,85.5 279.25,83.875 279.125,82.875 C279,81.875 278,80.125 277.625,79.25 C277.25,78.375 276.125,76.625 275.875,75.375 C275.625,74.125 275.125,73.625 276.375,71.875 C277.625,70.125 275.25,69.125 278.125,69.5 C281,69.875 280.875,70.25 282.375,70 C283.875,69.75 285.375,70.625 285.875,68.875 C286.375,67.125 286,67.375 286.875,66.125 C287.75,64.875 288.125,65.125 289.125,63.625 C290.125,62.125 288.625,61.625 291.125,59.625 C293.625,57.625 295.125,56.875 295.75,56.125 C296.375,55.375 297.625,55 296.625,54 C295.625,53 295.5,52.125 294.125,51.25 C292.75,50.375 292,49.75 291.375,49.625 C290.75,49.5 289.875,49.25 290.5,48.75 C291.125,48.25 292.125,47.375 293.125,47.375 C294.125,47.375 294.125,48.375 295.625,47.625 C297.125,46.875 297.75,46.375 298.75,47.125 C299.75,47.875 299.125,47.25 299.875,48.75 C300.625,50.25 299.125,49.75 301.125,50.875 C303.125,52 305,52.25 305.625,52.25 C306.25,52.25 305.875,53 307.375,52.125 C308.875,51.25 308.625,51.625 309.625,50.25 C310.625,48.875 311.25,48.625 310.875,46.875 C310.5,45.125 309.875,44 309.875,43.5 L308.75,41.625 C308.75,41.625 308.75,40.75 307,40.75 C305.25,40.75 304.25,40.875 304.25,40.25 C304.25,39.625 304.75,38.5 303.625,38.5 C302.5,38.5 301.875,37.5 301.125,38.375 C300.375,39.25 299.875,40.25 299,39.75 C298.125,39.25 297.125,38 297.125,38 C297.125,38 297.375,36.75 297,36.25 C296.625,35.75 295.5,34.625 295.5,34.625 L293.875,33.875 C293.875,33.875 290.5,30.5 289.25,30.375 C288,30.25 286.875,30.5 286.5,29.5 C286.125,28.5 288.25,28.5 285.125,28 C282,27.5 281.875,28 280.875,26.625 C279.875,25.25 281.25,24.875 278.75,24.75 C276.25,24.625 275.125,25 273,24.125 C270.875,23.25 270.875,22.375 269.875,23.375 C268.875,24.375 269.375,24.5 268,25.625 C266.625,26.75 267.375,27.75 265.25,27.75 C263.125,27.75 263.5,28 262.25,27.5 C261,27 261.25,26.625 259.75,26.5 C258.25,26.375 258.625,26.5 257.125,26.625 C255.625,26.75 256.875,27.625 254.5,26.5 C252.125,25.375 252.125,25.125 250.375,24.25 C248.625,23.375 248.125,23.125 247.25,23.125 C246.375,23.125 242.75,22.75 241.75,23.625 C240.75,24.5 239.625,26.5 239.125,25.375 C238.625,24.25 239.875,24.125 238,23.125 C236.125,22.125 235.375,22.375 234.25,22 C233.125,21.625 233.375,21.375 233.875,20 C234.375,18.625 236,18.5 233.75,18 C231.5,17.5 231.625,16.625 230,16.625 C228.375,16.625 228.75,16.625 227.875,17 C227,17.375 226.875,17.375 226.5,17.875 C226.125,18.375 226.875,19 226,18.75 C225.125,18.5 225.625,18.875 224.75,17.875 C223.875,16.875 224.125,16.5 223,16.625 C221.875,16.75 222.75,16.5 221.125,16.875 C219.5,17.25 219,17.25 217.875,17.375 C216.75,17.5 214.875,19 214.875,19 C214.875,19 215,19.25 213.625,19.375 C212.25,19.5 213.125,18.75 211.25,20.125 C209.375,21.5 210.25,21.625 208.75,21.5 C207.25,21.375 208,20.5 206.375,21.25 C204.75,22 204.625,21.625 204.625,22.625 C204.625,23.625 203.625,24.25 203.625,24.25 C203.625,24.25 203.625,23.875 203.25,22.625 C202.875,21.375 202.375,21.875 202.5,20.625 C202.625,19.375 197.25,18.625 196.5,16.875 C195.75,15.125 195.875,15.375 195.625,13.75 C195.375,12.125 192.375,11.375 191.875,11.5 C191.375,11.625 190,13.125 189.375,13.875 C188.75,14.625 188.5,15.25 187.5,16 C186.5,16.75 186.375,17.25 185.375,17.625 C184.375,18 184.5,18.625 183.625,18 C182.75,17.375 181.25,16.375 180.375,15.625 C179.5,14.875 177.875,14.625 177.25,14.625 C176.625,14.625 173.75,15.25 172.625,15.875 C171.5,16.5 170.25,16.375 170.25,16.375 C170.25,16.375 169.625,15.75 168.625,16 C167.625,16.25 165.75,15.5 164.375,17 C163,18.5 161.375,19.875 160.75,20.25 C160.125,20.625 157.75,21.875 157.125,22.25 C156.5,22.625 155.25,23.5 155.25,23.5 C155.25,23.5 154.5,23.625 154.75,22.75 C155,21.875 154.75,20.75 155.625,20.375 C156.5,20 157,20.5 157.875,19.5 C158.75,18.5 158.75,18.25 159.875,17.5 C161,16.75 161.75,17.5 161.75,16.5 C161.75,15.5 161.25,15.875 161.75,14.75 C162.25,13.625 163,12.75 163.875,12 C164.75,11.25 166,9.75 166,9 C166,8.25 163.25,7.375 162.75,5 C162.25,2.625 159.125,7.125 158,6.375 C156.875,5.625 155,4.25 154.875,3.5 C154.75,2.75 155.125,1 154,0.875 C152.875,0.75 152.125,4.88498131e-15 151.375,1.125 C150.625,2.25 151.125,2 149.5,3.25 C147.875,4.5 146.5,5.625 146.25,5.125 C146,4.625 145.75,3.25 145.75,2.625 C145.75,2 143.25,3.25 142.75,3.5 C142.25,3.75 140.625,4.875 140.125,5.125 C139.625,5.375 138.25,5.375 136.75,5.5 C135.25,5.625 135.25,4.75 131.875,6.75 C128.5,8.75 126.375,10.25 126,10.75 C125.625,11.25 124,11.75 124,11.75 C124,11.75 121.875,10.625 121.75,12.25 C121.625,13.875 120.75,16 120.75,16 L117.5,16 C116.875,16 115.5,17.375 115.5,17.375 L113.5,19.875 C113.5,19.875 112.625,20.375 113.375,21.375 C114.125,22.375 118,23.5 118,23.5 L121,24.125 C121,24.125 123,23.25 123,24.25 C123,25.25 122,26.625 121.5,26.625 C121,26.625 118.75,26.375 118.75,26.375 C118.75,26.375 117.625,24.375 116.875,24.625 C116.125,24.875 114.875,25.125 114.875,25.125 L113.375,23.875 L112.625,23.5 C112.625,23.5 112.375,20.125 111.5,22.625 C110.625,25.125 111,25.875 111,25.875 C111,25.875 111.75,27.25 112.25,27.75 C112.75,28.25 113.5,28.625 113.75,29.125 C114,29.625 114.125,31 114.125,31.625 C114.125,32.25 113.625,33 113.625,33.5 C113.625,34 115.625,35 115.625,35 C115.625,35 116,35.75 114.5,35.625 C113,35.5 114,37.5 112,35.25 C110,33 109.875,32.75 109.875,32.75 L107.625,32 L106.5,31.625 L104.75,31 L103.75,32 C103.75,32 103.25,32.5 103.75,33.25 C104.25,34 104.625,33 104.75,34.5 C104.875,36 104.75,36.625 104.625,37.125 C104.5,37.625 104,37.75 104.5,38.75 C105,39.75 106,40.125 106,40.125 C106,40.125 106.5,41.5 106.5,42.25 C106.5,43 105.75,44 107.625,44.375 C109.5,44.75 109.125,44.875 110.25,44.75 C111.375,44.625 110.875,44.375 112.5,44.375 C114.125,44.375 113.875,43.75 114.5,44.5 C115.125,45.25 115.625,45 115.5,46.5 C115.375,48 116.25,47.875 115.125,48.625 C114,49.375 113.5,50.375 112.875,48.625 C112.25,46.875 112.875,45.375 111.875,45.75 C110.875,46.125 111.125,45.875 110.375,46.5 C109.625,47.125 108.625,48.125 108.625,48.125 C108.625,48.125 106.75,48.5 106.25,47.5 C105.75,46.5 105,45.875 105,45.875 C105,45.875 104.625,47.875 103.75,46 C102.875,44.125 103.125,44.875 102.75,43.625 C102.375,42.375 101.875,41.75 101.875,41.75 C101.875,41.75 101.125,42.875 101.125,41.5 C101.125,40.125 102.125,39.75 101.125,39.25 C100.125,38.75 100.625,39.375 100,38.5 C99.375,37.625 99.125,36.125 99.125,36.125 C99.125,36.125 96.625,35.375 97.625,34.25 C98.625,33.125 98.5,33.5 99.125,32.375 C99.75,31.25 100.375,30.625 100.5,29.875 C100.625,29.125 100.625,28 99.5,27.75 C98.375,27.5 98.375,29 97.625,27.5 C96.875,26 97.125,25.875 96.625,25.875 C96.125,25.875 95.5,26 94.875,25.875 C94.25,25.75 93.625,24.75 93.625,24.75 L90.75,23.75 L89.875,26.25 C89.875,26.25 89.875,26.375 90,27.375 C90.125,28.375 90.375,29.125 89.875,29.375 C89.375,29.625 89.125,30 89.375,30.875 C89.625,31.75 91.75,33.875 91.125,33.875 C90.5,33.875 89,35.375 89,35.375 L88.75,38.75 L91.25,39.375 L91.625,41.875 L92.625,42.75 L91.95179,45.04383 L91.95179,45.04383 Z\"></path>\n					<path d=\"M258.43626,190.25065 C258.43626,189.01321 258.96659,185.83123 258.25948,185.65446 C257.55237,185.47768 257.55237,184.94735 256.31494,185.12413 C255.0775,185.3009 253.66328,184.5938 253.66328,184.5938 C253.66328,184.5938 253.30973,183.35636 255.43105,182.11892 C257.55237,180.88148 258.78981,180.17438 258.78981,180.17438 L257.72915,179.46727 C257.72915,179.46727 255.43105,179.29049 256.49171,178.58339 C257.55237,177.87628 257.72915,176.9924 258.61303,175.93174 C259.49692,174.87108 261.61824,169.391 262.85567,167.26968 C264.09311,165.14836 266.92154,165.85547 266.92154,165.85547 L268.86608,160.90572 C268.86608,160.90572 267.27509,157.19341 269.92674,155.95597 C272.57839,154.71853 272.75517,156.13275 273.46227,153.12754 C274.16938,150.12234 276.2907,150.65267 276.64426,149.59201 C276.99781,148.53135 277.35136,148.53135 276.82103,146.76358 C276.2907,144.99582 274.87649,143.40483 274.87649,143.40483 C274.87649,143.40483 274.16938,140.75317 274.16938,139.33896 C274.16938,137.92475 273.81583,135.62665 275.05326,135.09632 C276.2907,134.56599 273.9926,131.73756 273.9926,131.73756 C273.9926,131.73756 274.69971,130.6769 273.81583,129.9698 C272.93194,129.26269 272.40161,128.37881 272.40161,127.49492 C272.40161,126.61104 272.57839,124.31294 272.57839,124.31294 C272.57839,124.31294 273.46227,122.89873 274.16938,122.72195 C274.87649,122.54517 275.58359,122.89873 275.58359,121.13096 C275.58359,119.36319 274.69971,116.71154 274.69971,116.71154 C274.69971,116.71154 270.9874,111.23147 270.28029,110.87791 C269.57319,110.52436 269.57319,110.17081 270.10352,109.11015 C270.63385,108.04949 274.16938,113.35279 276.64426,113.70634 C279.11913,114.05989 281.41723,113.70634 281.41723,113.70634 L283.71532,112.64568 L288.31152,112.82246 C288.31152,112.82246 290.25606,112.99923 290.60961,114.94378 C290.96317,116.88832 293.43804,116.18121 292.2006,117.94898 C290.96317,119.71675 291.13994,120.60063 289.90251,120.42385 C288.66507,120.24708 288.84185,119.36319 287.95796,119.53997 C287.07408,119.71675 286.36697,119.53997 286.36697,121.48451 C286.36697,123.42906 287.78119,123.60584 286.54375,125.19683 C285.30631,126.78782 285.83664,127.49492 284.06888,127.49492 C282.30111,127.49492 280.71012,127.31815 278.94235,127.6717 C277.17459,128.02525 276.2907,126.78782 276.2907,128.37881 C276.2907,129.9698 276.2907,130.32335 277.17459,130.50013 C278.05847,130.6769 278.76558,130.50013 278.41202,131.56079 C278.05847,132.62145 276.99781,133.32855 277.70492,133.68211 C278.41202,134.03566 279.29591,133.15178 279.29591,134.03566 L282.30111,134.21244 L282.83144,135.9802 C282.83144,135.9802 283.18499,135.9802 284.24565,136.15698 C285.30631,136.33376 286.01342,135.44987 286.36697,136.68731 C286.72053,137.92475 287.25086,138.45508 287.25086,138.45508 C287.25086,138.45508 287.78119,138.45508 287.95796,139.69251 C288.13474,140.92995 288.31152,141.2835 288.31152,142.16739 C288.31152,143.05127 287.42763,145.8797 287.42763,145.8797 C287.42763,145.8797 286.72053,146.58681 286.8973,148.00102 C287.07408,149.41523 287.78119,148.00102 287.95796,149.76879 C288.13474,151.53655 288.13474,152.06688 288.13474,153.30432 C288.13474,154.54176 287.95796,154.36498 289.01862,155.24886 C290.07928,156.13275 290.43284,157.01663 290.43284,157.01663 C290.43284,157.01663 291.31672,157.54696 291.31672,158.7844 L291.31672,161.08249 C291.31672,161.08249 290.78639,161.25927 290.07928,161.25927 C289.37218,161.25927 288.48829,161.08249 288.48829,161.08249 C288.48829,161.08249 288.31152,161.61282 287.95796,162.85026 C287.60441,164.0877 286.01342,164.79481 286.01342,164.79481 C286.01342,164.79481 286.01342,166.56257 285.30631,166.73935 C284.59921,166.91613 284.06888,166.91613 283.36177,167.0929 C282.65466,167.26968 282.12433,167.0929 281.77078,167.97679 C281.41723,168.86067 281.77078,169.03745 280.8869,169.21422 C280.00301,169.391 279.11913,167.80001 278.94235,170.09811 C278.76558,172.3962 280.17979,173.28009 278.41202,173.81042 C276.64426,174.34075 275.58359,174.6943 275.58359,174.6943 C275.58359,174.6943 275.93715,176.10851 274.69971,175.75496 C273.46227,175.40141 272.04806,174.16397 272.04806,173.28009 C272.04806,172.3962 271.87128,171.86587 271.87128,171.86587 L269.39641,173.45686 C269.39641,173.45686 269.74996,174.34075 267.9822,174.34075 C266.21443,174.34075 265.50732,172.3962 265.86088,174.34075 C266.21443,176.28529 266.92154,177.6995 267.09831,178.40661 C267.27509,179.11372 268.33575,178.58339 268.15897,179.64405 C267.9822,180.70471 268.33575,180.70471 267.62864,181.41181 C266.92154,182.11892 265.50732,182.2957 264.80022,182.2957 C264.09311,182.2957 263.91633,182.11892 262.50212,182.2957 C261.08791,182.47247 260.375,189.125 260.375,189.125 L259.125,190.25 L258.43626,190.25065 L258.43626,190.25065 Z\" id=\"japan\"></path>\n				</g>\n				<g id=\"australian-archipelago\" transform=\"translate(550.000000, 307.000000)\" data-continent-id=\"5\">\n					<g id=\"australia\">\n						<use stroke=\"#7B147D\" stroke-width=\"3\" sketch:type=\"MSShapeGroup\" xlink:href=\"#path-1\"></use>\n						<use stroke=\"none\" xlink:href=\"#path-1\"></use>\n					</g>\n					<g id=\"path2408\">\n						<use stroke=\"#7B147D\" stroke-width=\"3\" sketch:type=\"MSShapeGroup\" xlink:href=\"#path-2\"></use>\n						<use stroke=\"none\" xlink:href=\"#path-2\"></use>\n					</g>\n					<g id=\"path2411\">\n						<use stroke=\"#7B147D\" stroke-width=\"3\" sketch:type=\"MSShapeGroup\" xlink:href=\"#path-3\"></use>\n						<use stroke=\"none\" xlink:href=\"#path-3\"></use>\n					</g>\n					<g id=\"path2417\">\n						<use stroke=\"#7B147D\" stroke-width=\"3\" sketch:type=\"MSShapeGroup\" xlink:href=\"#path-4\"></use>\n						<use stroke=\"none\" xlink:href=\"#path-4\"></use>\n					</g>\n					<g id=\"path2420\">\n						<use stroke=\"#7B147D\" stroke-width=\"3\" sketch:type=\"MSShapeGroup\" xlink:href=\"#path-5\"></use>\n						<use stroke=\"none\" xlink:href=\"#path-5\"></use>\n					</g>\n					<g id=\"new-guinea\">\n						<use stroke=\"#7B147D\" stroke-width=\"3\" sketch:type=\"MSShapeGroup\" xlink:href=\"#path-6\"></use>\n						<use stroke=\"none\" xlink:href=\"#path-6\"></use>\n					</g>\n				</g>\n				<g id=\"europe\" transform=\"translate(258.000000, 48.000000)\" stroke-width=\"3\" stroke=\"#00A0FF\" sketch:type=\"MSShapeGroup\" data-continent-id=\"2\">\n					<path d=\"M70.90026,49.84149 C70.36993,48.78083 70.90026,48.9576 70.01638,48.07372 C69.13249,47.18984 68.42539,46.83628 68.95572,45.42207 C69.48605,44.00786 68.60216,43.12397 70.01638,42.77042 C71.43059,42.41687 71.25381,44.36141 71.60737,41.88653 C71.96092,39.41166 70.90026,40.11877 72.31448,38.52778 C73.72869,36.93679 73.90547,36.58323 73.90547,36.58323 C73.90547,36.58323 74.78935,36.58323 75.1429,37.82067 C75.49646,39.05811 75.49646,40.11877 76.20356,39.23488 C76.91067,38.351 77.08745,37.29034 77.61778,36.58323 C78.14811,35.87613 79.03199,34.99224 79.03199,34.99224 C79.03199,34.99224 77.441,32.34059 79.38554,32.51737 C81.33009,32.69415 81.33009,33.0477 81.86042,32.34059 C82.39075,31.63349 82.21397,31.63349 83.45141,31.27993 C84.68884,30.92638 84.86562,31.10316 85.0424,30.0425 C85.21917,28.98184 85.7495,28.98184 86.45661,28.27473 C87.16372,27.56762 87.16372,27.21407 87.34049,25.79986 C87.51727,24.38564 87.16372,24.56242 88.75471,22.4411 C90.3457,20.31978 90.3457,20.49655 90.87603,19.08234 C91.40636,17.66813 91.40636,17.8449 91.93669,16.96102 C92.46702,16.07714 93.17413,16.43069 93.70446,15.72358 C94.23479,15.01648 94.41156,14.13259 94.41156,14.13259 L95.29545,12.5416 C95.29545,12.5416 93.52768,11.8345 95.11867,11.12739 C96.70966,10.42028 96.88644,10.24351 98.12387,9.88995 C99.36131,9.5364 100.24519,9.5364 100.24519,9.5364 C100.24519,9.5364 101.39424,11.21578 101.57102,9.97834 C101.7478,8.7409 101.04069,8.56413 102.10135,7.76863 C103.16201,6.97314 103.78073,7.06153 104.13428,7.32669 C104.48783,7.59186 104.31106,7.85702 105.10655,7.68024 C105.90205,7.50347 106.78593,8.56413 107.0511,7.32669 C107.31626,6.08925 105.90205,5.11698 107.58143,4.40988 C109.2608,3.70277 110.14469,4.32149 110.67502,3.79116 C111.20535,3.26083 110.40985,2.99566 111.47051,2.46533 C112.53117,1.935 112.88473,2.20017 113.94539,1.84661 C115.00605,1.49306 115.09444,0.34401 115.62477,0.25562 C116.1551,0.16723 116.8622,0.25562 117.39253,0.78595 C117.92286,1.31628 116.42026,1.75822 118.54158,1.40467 C120.6629,1.05112 123.49133,-0.27471 124.28682,0.34401 C125.08232,0.96273 124.37521,2.02339 125.43587,2.02339 C126.49653,2.02339 127.55719,1.58145 128.08752,1.935 C128.61785,2.28855 128.52946,2.55372 129.32496,2.90727 C130.12045,3.26083 130.20884,3.17244 131.44628,3.26083 C132.68372,3.34922 131.71145,2.90727 132.41855,3.17244 C133.12566,3.4376 133.39082,3.96793 134.3631,4.32149 C135.33537,4.67504 135.60053,4.40988 136.74958,4.49826 C137.89863,4.58665 137.27991,5.02859 138.60574,5.38215 C139.93156,5.7357 140.01995,5.47054 141.69933,5.47054 C143.37871,5.47054 145.41164,5.38215 146.38391,5.64731 C147.35618,5.91248 147.17941,6.5312 148.50523,6.44281 C149.83106,6.35442 149.65428,4.85182 153.01304,7.06153 C156.37179,9.27123 156.28341,9.71318 157.0789,10.42028 C157.8744,11.12739 158.22795,11.56933 158.31634,12.71838 C158.40473,13.86743 158.75828,14.04421 158.22795,14.66292 C157.69762,15.28164 156.19502,16.07714 155.04597,16.3423 C153.89692,16.60747 151.7756,17.04941 150.89172,17.04941 L146.73746,17.04941 C144.52776,17.04941 141.69933,16.69586 140.3735,16.51908 C139.04768,16.3423 137.45669,16.96102 137.3683,17.40296 C137.27991,17.8449 136.92636,18.28685 137.27991,18.6404 C137.63346,18.99395 138.51735,19.87784 139.31284,20.23139 C140.10834,20.58494 140.63867,21.11527 140.90383,21.46883 C141.169,21.82238 142.40644,21.73399 142.84838,21.73399 C143.29032,21.73399 143.99743,22.35271 144.1742,22.79465 C144.35098,23.23659 144.08581,23.67854 144.35098,24.03209 C144.61614,24.38564 145.14647,24.03209 145.14647,25.53469 L145.14647,27.65601 C145.14647,28.36312 144.79292,28.89345 145.85358,28.80506 C146.91424,28.71667 146.64908,28.62828 147.70974,28.62828 C148.7704,28.62828 148.41684,30.0425 149.83106,28.53989 C151.24527,27.03729 151.42205,26.9489 151.24527,26.59535 C151.06849,26.2418 150.89172,25.53469 150.273,24.56242 C149.65428,23.59015 148.59362,22.88304 149.56589,22.52949 C150.53816,22.17593 149.83106,21.20366 151.15688,22.08754 C152.48271,22.97143 152.04077,23.59015 153.18981,23.59015 C154.33886,23.59015 154.42725,24.47403 156.01824,22.97143 C157.60923,21.46883 157.43245,20.9385 158.40473,20.85011 C159.377,20.76172 159.81894,20.9385 160.79121,20.40817 C161.76348,19.87784 162.3822,18.46362 163.35447,18.55201 C164.32675,18.6404 165.12224,19.52428 165.29902,18.72879 C165.47579,17.93329 165.82935,17.57974 164.94546,16.96102 C164.06158,16.3423 163.61964,16.60747 163.35447,15.81197 C163.08931,15.01648 163.26609,14.92809 163.26609,14.22098 C163.26609,13.51388 163.97319,12.27644 163.35447,11.56933 C162.73576,10.86222 162.55898,10.95061 162.29381,10.15512 C162.02865,9.35962 161.23315,8.65252 162.11704,8.56413 C163.00092,8.47574 162.91253,8.29896 164.14997,8.47574 C165.38741,8.65252 166.80162,7.14991 167.50873,7.85702 C168.21583,8.56413 168.21583,8.91768 168.83455,9.80156 C169.45327,10.68545 169.89521,11.21578 170.51393,11.48094 C171.13265,11.74611 171.75137,10.95061 171.13265,12.36483 C170.51393,13.77904 170.51393,13.16032 170.51393,14.22098 C170.51393,15.28164 170.16038,16.07714 171.83976,15.19325 C173.51913,14.30937 172.81203,14.75131 173.69591,13.51388 C174.57979,12.27644 177.05467,11.56933 177.67339,11.21578 C178.2921,10.86222 180.67859,8.56413 180.67859,8.56413 C180.67859,8.56413 181.29731,7.06153 182.62313,7.32669 C183.94896,7.59186 183.77218,8.21057 185.62834,6.44281 C187.48449,4.67504 187.48449,4.32149 188.81032,5.20537 C190.13614,6.08925 190.04775,6.35442 191.10841,6.35442 C192.16908,6.35442 193.40651,5.64731 194.37878,6.00087 C195.35106,6.35442 195.26267,7.85702 196.58849,7.2383 C197.91432,6.61958 198.00271,7.85702 199.06337,6.26603 C200.12403,4.67504 200.47758,4.40988 200.83113,3.70277 C201.18469,2.99566 202.06857,1.84661 203.3944,2.11178 C204.72022,2.37694 204.98539,2.64211 206.04605,2.81888 C207.10671,2.99566 208.07898,3.08405 209.05125,3.08405 C210.02352,3.08405 211.34935,2.28855 212.05645,3.17244 C212.76356,4.05632 213.02873,4.58665 213.73583,5.02859 C214.44294,5.47054 215.15005,12.18805 215.15005,12.18805 C215.15005,12.18805 215.32682,15.54681 214.79649,16.25391 C214.26616,16.96102 214.26616,20.143 214.26616,20.143 L213.02872,22.26432 L211.08418,27.03729 C211.08418,27.03729 209.84674,30.92638 210.02352,31.81026 C210.2003,32.69415 211.08418,34.63869 211.08418,34.63869 C211.08418,34.63869 210.02352,36.22968 210.55385,37.11356 C211.08418,37.99745 211.79129,40.29554 211.79129,41.53298 L211.79129,46.30595 L211.79129,50.37182 C211.79129,50.37182 213.55905,50.72537 213.55905,51.60925 C213.55905,52.49314 213.55905,53.90735 212.85195,55.14479 C212.14484,56.38222 211.26096,56.91255 211.08418,58.50354 C210.9074,60.09453 211.08418,61.50875 211.08418,61.50875 L212.49839,62.21585 L215.68038,64.33718 C215.68038,64.33718 217.27137,64.33718 217.44814,65.57461 C217.62492,66.81205 218.33203,67.34238 217.62492,68.75659 C216.91781,70.17081 215.15005,71.05469 215.32682,71.93857 C215.5036,72.82246 215.85715,73.17601 216.03393,74.41345 C216.21071,75.65088 216.74104,75.82766 216.74104,77.59543 C216.74104,79.36319 217.8017,80.42385 216.74104,80.95418 C215.68038,81.48451 215.5036,81.83807 214.61972,82.19162 C213.73583,82.54517 210.55385,82.54517 210.37707,83.78261 C210.2003,85.02005 210.02352,85.3736 209.31641,86.78782 C208.60931,88.20203 208.43253,88.55558 207.54865,88.73236 C206.66476,88.90914 206.31121,88.73236 205.42733,88.55558 C204.54344,88.37881 202.95245,87.6717 202.95245,87.6717 L201.53824,87.49492 L200.3008,86.25749 C200.3008,86.25749 199.5937,86.78782 198.88659,87.14137 C198.17948,87.49492 196.58849,88.90914 196.58849,88.90914 C196.58849,88.90914 194.11362,89.61624 193.40651,89.61624 C192.6994,89.61624 192.6994,89.43947 191.9923,89.61624 C191.28519,89.79302 190.04775,89.61624 189.51742,90.32335 C188.98709,91.03046 190.22453,91.73756 187.57288,91.91434 C184.92123,92.09112 184.92123,92.09112 184.21412,92.09112 C183.50702,92.09112 182.26958,95.80343 182.26958,95.80343 C182.26958,95.80343 183.68379,97.04086 182.62313,97.39442 C181.56247,97.74797 180.85537,98.80863 180.32504,99.51574 C179.79471,100.22284 179.44115,100.75317 179.61793,101.63706 C179.79471,102.52094 179.61793,103.05127 179.97148,104.11193 C180.32504,105.17259 181.20892,107.29391 181.20892,107.29391 C181.20892,107.29391 181.91603,107.64747 181.73925,108.70813 C181.56247,109.76879 181.03214,110.29912 181.56247,111.183 C182.0928,112.06688 183.15346,112.42044 183.15346,112.42044 L184.21412,113.83465 C184.21412,113.83465 185.62834,113.4811 185.62834,114.71853 C185.62834,115.95597 185.80511,116.4863 185.98189,117.90051 C186.15867,119.31473 185.62834,120.72894 185.62834,120.72894 C185.62834,120.72894 185.27478,121.43605 184.21412,121.7896 C183.15346,122.14315 182.79991,121.96638 182.44636,122.67348 C182.0928,123.38059 182.26958,123.55737 182.0928,124.44125 C181.91603,125.32514 180.14826,128.15356 180.14826,128.15356 L181.3857,127.0929 C181.3857,127.0929 182.0928,128.15356 181.91603,129.21422 C181.73925,130.27488 181.3857,130.45166 181.56247,131.15877 C181.73925,131.86587 182.44636,132.21943 182.44636,132.21943 L183.50702,132.57298 C183.50702,132.57298 184.75,134 184.5,135.5 C184.25,137 184.875,137.25 185,137.875 C185.125,138.5 184.75,138.125 185.5,139.625 C186.25,141.125 186.75,141.125 187.875,141.5 C189,141.875 189.5,141.875 189.5,141.875 C189.5,141.875 190.5,143.125 189.75,143.625 C189,144.125 188.375,143.625 188.25,144.625 C188.125,145.625 188.125,145.75 188.125,147.25 C188.125,148.75 188.375,149.625 188.125,150.125 C187.875,150.625 187.75,150.875 187.75,151.625 C187.75,152.375 188.625,153 188.625,153 C188.625,153 189.25,154 189.25,154.625 C189.25,155.25 189,155.5 188.5,156 C188,156.5 187.25,156.375 187.25,156.375 C187.25,156.375 186.375,156.375 186.25,157.25 C186.125,158.125 188,158.125 185.875,158.5 C185.875,158.5 184.625,158.625 184,158.75 C183.375,158.875 182.75,158.5 182.125,159 C181.5,159.5 181.5,159.875 180.625,160 C179.75,160.125 179.875,160 178.875,160.125 C177.875,160.25 177.125,161.125 177.125,161.125 C177.125,161.125 177.375,161.625 175.75,161.5 C174.125,161.375 173.5,161.75 173.5,161.75 C173.5,161.75 173.5,163.25 172.125,162.25 C170.75,161.25 170.125,161.25 170.125,160.75 C170.125,160.25 170.75,159.75 171.25,159.25 C171.75,158.75 172.25,158.5 172.625,158 C173,157.5 173.25,156.75 173.25,156.75 C173.25,156.75 172.875,159.375 172.5,156.5 C172.125,153.625 172.5,153.625 171.75,153.5 C171,153.375 171.125,153.625 170.25,152.875 C169.375,152.125 168.875,151.5 168.375,151.125 C167.875,150.75 168.25,150.25 167.125,150.25 C166,150.25 166.625,149.5 165.75,148.625 C164.875,147.75 164.125,147.25 164.125,147.25 L164.75,145.75 C164.75,145.75 164.625,145.5 163.5,145.625 C162.375,145.75 162.125,145.75 161.625,146 C161.125,146.25 161.25,147.75 160.625,146.625 C160,145.5 160.25,145.25 159.625,144.625 C159,144 157.875,143.375 157.875,142.625 C157.875,141.875 158.625,141.125 158,140.875 C157.375,140.625 156.875,141.25 156.625,140.25 C156.375,139.25 156,138.5 156,138.5 L155.125,138 L155.625,136.75 C155.625,136.75 156.25,136 156.375,135.125 C156.5,134.25 155.375,134.25 157,134 C158.625,133.75 158.75,134.25 159.625,133.375 L161.125,131.875 C161.125,131.875 161.75,131.125 161.375,130.625 C161,130.125 160.75,129.875 160.125,130.25 C159.5,130.625 159.125,131.125 159.125,131.125 C159.125,131.125 158.875,131.375 157.5,131.375 C156.125,131.375 156.625,131.125 155.375,131.375 C154.125,131.625 153.625,131.75 153,132 C152.375,132.25 151.875,132.25 151.125,132.5 C150.375,132.75 150.5,132.625 149.625,133.25 C148.75,133.875 147.875,134.875 147.875,134.875 C147.875,134.875 147.375,135.125 148,135.875 C148.625,136.625 149.375,137.375 150,137.375 C150.625,137.375 151.125,136.75 151.375,137.25 C151.625,137.75 152.125,138.125 151.75,139 C151.375,139.875 151.625,139.875 151,140.375 C150.375,140.875 150,141.125 149.5,141.375 C149,141.625 148.75,141.625 148.25,142.5 C147.75,143.375 148.5,145.25 147,144.5 C145.5,143.75 146.125,143.875 145.125,143.25 C144.125,142.625 143.75,142.75 143.375,141.875 C143,141 143,140.875 142.875,140 C142.75,139.125 142.5,138.5 142.25,137.5 C142,136.5 142.125,136 141.375,135.75 C140.625,135.5 140.125,135 139.375,135 C138.625,135 139.25,134.625 137.625,135 C136,135.375 135.5,135.125 135.125,135.625 C134.75,136.125 134.5,138.5 134.5,138.5 C134.5,138.5 134.75,138.875 134,139.625 C133.25,140.375 132.25,140.5 132.25,140.5 L131.25,141.25 C131.25,141.25 130.125,142 130.625,142.75 C131.125,143.5 131.75,144.125 131.5,144.625 C131.25,145.125 131.375,145.125 130.75,145.625 C130.125,146.125 129.75,146 129.75,147.125 C129.75,148.25 130.625,148.5 130,149.5 C129.375,150.5 129.625,150.375 129.125,151.125 C128.625,151.875 128.375,152.5 128.125,153.25 C127.875,154 128.625,154.125 127.75,154.875 C126.875,155.625 126.625,155.25 126.375,156.125 C126.125,157 126.5,157 126,157.625 C125.5,158.25 125.5,158.625 125,159 C124.5,159.375 124.5,159.25 123.875,160 C123.25,160.75 123.75,161.125 123.25,161.75 C122.75,162.375 122.375,161.875 122.125,162.75 C121.875,163.625 122.125,163.25 122.25,164.125 C122.375,165 123,165 122.25,166 C121.5,167 121.125,167.625 120.625,168 C120.125,168.375 120.125,167.875 119.75,169 C119.375,170.125 120,170.5 119.25,170.75 C118.5,171 118.125,171 117.375,171.125 C116.625,171.25 116.25,171 115.75,171.125 C115.25,171.25 115,171.125 114.625,171.75 C114.25,172.375 113.875,172.25 114.375,173 C114.875,173.75 114.75,173.75 115.25,174.25 L116.625,175.625 C117.125,176.125 117.5,176.375 117.625,177 C117.75,177.625 117.75,178.125 117.75,178.125 C117.75,178.125 118.375,180 117.875,180.25 C117.375,180.5 116.875,180.5 116.75,181.25 C116.625,182 116.5,181.75 116.75,182.625 C117,183.5 116.75,183.5 117.25,184 C117.75,184.5 117.875,184.5 118.625,185.25 C119.375,186 120.25,186.125 119.75,186.75 C119.25,187.375 118.625,187.5 117.875,187.25 C117.125,187 116.75,187.625 116.25,186.5 C115.75,185.375 115.5,185.125 115.5,185.125 C115.5,185.125 114.75,185.25 114.75,185.875 C114.75,186.5 116.625,186.625 114.25,186.625 C111.875,186.625 112.125,187.375 111.5,186.625 C110.875,185.875 111.375,185.625 110.5,185.375 C109.625,185.125 109.5,185.875 109.125,185.125 C108.75,184.375 108.625,184.375 108.625,183.25 C108.625,182.125 109.25,182.125 108.875,180.625 C108.5,179.125 108.25,179.5 108,178.625 C107.75,177.75 108,177.75 108,176.625 C108,175.5 107.625,175 107.625,175 C107.625,175 107.25,174.75 107,173.5 C106.75,172.25 106.875,172.125 106.625,171 C106.375,169.875 106.5,169.5 105.875,169.5 C105.25,169.5 105.625,170 104.625,169.25 C103.625,168.5 104.125,168.25 103.25,167.875 C102.375,167.5 102.25,168.25 102,167 C101.75,165.75 101.75,166.375 101.75,164.875 L101.75,162.25 C101.75,161.625 102.25,161.625 101.5,160.625 C100.75,159.625 100.875,159.375 100,159.25 C99.125,159.125 99.375,160.125 98.625,158.875 C97.875,157.625 97.75,156.875 96.75,156.625 C95.75,156.375 95.875,157 95.375,156.375 C94.875,155.75 95.125,155.625 94.5,155 C93.875,154.375 94.625,154.125 93,154.125 C91.375,154.125 91.375,153.25 90.5,153.625 C89.625,154 89.375,154.625 89.375,155.25 C89.375,155.875 89.375,155.875 89.5,156.75 C89.625,157.625 89.375,158.125 90,158.25 C90.625,158.375 90.625,157.75 90.75,158.875 C90.875,160 90.625,161.125 92.125,160.5 C93.625,159.875 94.5,159 94.625,159.75 C94.75,160.5 94.5,160.625 94.75,161.625 C95,162.625 94.75,163.5 95.625,164.125 C96.5,164.75 96.875,164.75 97.25,165.25 C97.625,165.75 97.5,165.625 98,165.875 C98.5,166.125 98.5,167.25 99.125,168.125 C99.75,169 100.5,168.25 100.125,169.375 C99.75,170.5 99.75,171 99.25,171.375 C98.75,171.75 97.625,172.125 96.875,171.5 C96.125,170.875 95.5,170.375 95.5,170.375 C95.5,170.375 96.125,169.125 94.625,169.5 C93.125,169.875 93.125,170 92.5,170 C91.875,170 91.5,169 91.75,170.375 C92,171.75 93,172.25 93,172.25 C93,172.25 94.125,172.25 94,173.5 C93.875,174.75 94.375,174.375 93.75,175.625 C93.125,176.875 93.25,176.625 92.75,177.75 C92.25,178.875 92.75,178.875 92.125,179.75 C91.5,180.625 91.25,181.125 90.375,181.5 C89.5,181.875 89.5,181.125 89.125,182.5 C88.75,183.875 88.875,183.875 88.25,184.125 C87.625,184.375 86.25,184.375 85.75,184.75 C85.25,185.125 86.125,185.625 84.75,185.25 C83.375,184.875 83.75,184.875 83.125,184.75 C82.5,184.625 82.25,184.625 81.75,184 C81.25,183.375 81.625,182.25 81.125,182.625 C80.625,183 80.25,184.375 79.75,183 C79.25,181.625 79.375,181.5 78.875,181.25 C78.375,181 78.125,182.5 78,180.875 C77.875,179.25 77.625,179.25 78.375,178.5 C79.125,177.75 79.375,177.5 80,177.5 C80.625,177.5 80.75,177.625 81.5,177.75 C82.25,177.875 82.125,178.5 82.75,178.625 C83.375,178.75 85.25,177.625 85.5,178.375 C85.75,179.125 85.25,181.375 85.875,179.375 C86.5,177.375 86.125,177 87,176.25 C87.875,175.5 88.75,174.75 89.125,174.25 C89.5,173.75 89.875,173 89,172.125 C88.125,171.25 87.875,172.125 87.875,170.5 C87.875,168.875 88.125,168.5 87.625,167.625 C87.125,166.75 87.625,167 86.625,166.5 C85.625,166 85.625,165.75 85.125,165.125 C84.625,164.5 83.75,164 82.875,163.75 C82,163.5 82.625,164.125 81.75,162.75 C80.875,161.375 80.625,161 79.875,161.125 C79.125,161.25 79.5,162.25 78.75,161.375 C78,160.5 78.25,160.375 77.75,160 C77.25,159.625 77,160 76.375,159.5 C75.75,159 75.75,159 75.625,158 C75.5,157 75.75,156.625 75.125,156.125 C74.5,155.625 73.25,155.25 73.25,155.25 C73.25,155.25 73.5,155 71.875,155.25 C70.25,155.5 70.125,155.5 69.625,155.875 C69.125,156.25 69.5,156.25 69,156.875 C68.5,157.5 68.625,157.625 67.75,157.875 C66.875,158.125 67.625,158.625 66.75,158.5 C65.875,158.375 66,158.75 65.5,158.25 C65,157.75 65.375,157.125 64.5,157.125 C63.625,157.125 63.25,157.25 63.625,156.5 C64,155.75 64.5,155.75 63.5,155.75 C62.5,155.75 62.625,156 61.375,155.75 C60.125,155.5 59.625,155.625 59.125,155.625 L57.75,158.125 C57.75,158.125 57.875,158.625 57.75,159.25 C57.625,159.875 57.125,160.375 57.125,160.375 C57.125,160.375 56.75,160.75 56.75,161.5 C56.75,162.25 57,162.375 56.25,163.125 C55.5,163.875 55.5,164.125 55,164.375 C54.5,164.625 54.5,164.5 54.125,165 C53.75,165.5 53.5,165.5 53.25,166.125 C53,166.75 53,166.75 53.375,167.375 C53.75,168 54,168.75 54,168.75 C54,168.75 54.375,168.875 54.125,170 C53.875,171.125 53.75,171.875 53.75,171.875 C53.75,171.875 53.75,172.375 53.875,173.375 C54,174.375 54.875,175.5 54.875,175.5 L55.5,176.375 C55.5,176.375 55.875,177.875 56,178.625 C56.125,179.375 57.25,179.125 56.125,180.125 C55,181.125 53.375,181.75 52.25,183.625 C51.125,185.5 51.5,187 50.625,188 C49.75,189 50.5,189.125 49.375,189.125 C48.25,189.125 47.25,187.875 46.625,189.125 C46,190.375 45.625,191.5 44.75,191.625 C43.875,191.75 43.75,190.25 43.75,192 C43.75,193.75 43.375,194.875 43.375,194.875 C43.375,194.875 43.125,195.75 42.25,195.625 C41.375,195.5 41.25,195.375 40.5,195.25 C39.75,195.125 39.75,195.625 39.125,194.875 C38.5,194.125 38.375,193.75 38.125,193.125 C37.875,192.5 37.875,192.25 36.875,192.125 C35.875,192 35.875,192.375 35.375,191.5 C34.875,190.625 34.625,190.375 33.875,190.5 C33.125,190.625 33.125,191.125 32.125,190.125 C31.125,189.125 31.125,188.375 30.625,188.5 C30.125,188.625 29.5,189.5 29.5,189.5 C29.5,189.5 29.625,190 28.125,189.875 C26.625,189.75 26.375,189.5 25.25,189.5 C24.125,189.5 24,190.25 23,189.75 C22,189.25 21.875,189.125 21.875,188.5 C21.875,187.875 22,187 21.5,186.5 C21,186 21.625,185.375 20.875,185 C20.125,184.625 20.5,184.75 19.625,184.75 C18.75,184.75 18.75,184.875 17.875,184.375 C17,183.875 16.625,184.625 17,183.25 C17.375,181.875 17.125,182 17.75,181 C18.375,180 18.375,180 18.75,178.875 C19.125,177.75 19.25,177.5 19.875,175.875 C20.5,174.25 20.75,174.75 20.75,173.5 C20.75,172.25 20.25,172.25 21,171.375 C21.75,170.5 21.875,170.5 21.75,169.5 C21.625,168.5 22,168.75 21.5,168 C21,167.25 19.75,166.125 19.25,165.625 C18.75,165.125 18.875,165.75 18.625,164.25 C18.375,162.75 17.875,163 17.625,162.125 C17.375,161.25 17.375,161.25 17.375,160.125 C17.375,159 16.5,159.375 16.5,158.75 C16.5,158.125 16.125,157.625 17,157.125 C17.875,156.625 18,157 19.125,156 C20.25,155 20.25,155.25 20.5,154.375 C20.75,153.5 21.625,153 21.625,153 C21.625,153 21.5,153.125 22.25,153.875 C23,154.625 23.125,154.625 23.25,155.125 C23.375,155.625 22.875,155.75 24.375,156.125 C25.875,156.5 25.5,156.625 27,156.625 C28.5,156.625 28.875,156.75 29.5,156.5 C30.125,156.25 30.75,155.875 30.75,155.875 C30.75,155.875 31.25,155.5 32.125,155.5 C33,155.5 33.125,155.375 33.875,155.625 C34.625,155.875 34,156 34.75,155.875 C35.5,155.75 35.625,156 36.25,155.625 C36.875,155.25 37.25,155.875 37.625,154.75 C38,153.625 37.625,153.25 38.625,152.5 C39.625,151.75 40,151.5 41,151.5 C42,151.5 40.375,149.875 39.75,149.75 C39.125,149.625 38.75,150.25 38.75,149.625 C38.75,149 38.625,148.875 39,147.875 C39.375,146.875 40.125,146.25 40.125,146.25 C40.125,146.25 40,145.75 39.875,144.875 C39.75,144 41.5,143.5 40.375,142.75 C39.25,142 38.75,141.625 38,141.625 C37.25,141.625 37.375,142.875 36.75,141.375 C36.125,139.875 36.625,139.625 36,138.875 C35.375,138.125 35.125,138.375 34.5,137.5 C33.875,136.625 34.75,136.75 33.375,135.75 C32,134.75 31.125,134.5 30.5,134.5 C29.875,134.5 29.625,135.375 29.75,134.125 C29.875,132.875 29.875,132.5 30.75,131.75 C31.625,131 33.875,130.375 34.75,130.25 C35.625,130.125 34.25,129.75 36.125,130.125 C38,130.5 37.375,130.5 38.25,130.625 C39.125,130.75 40.75,131.25 40.75,131.25 C40.75,131.25 41,129.375 41.5,128.75 C42,128.125 42.125,128.125 42.5,127.125 C42.875,126.125 43,126 44.25,125.625 C45.5,125.25 46.375,126.25 46.375,126.25 C46.375,126.25 44.75,127.875 46,127.25 C47.25,126.625 45.625,124.625 48.375,125 C51.125,125.375 52.125,127 52.5,125.125 C52.875,123.25 52.5,123.25 53.125,122.25 C53.75,121.25 53.75,121.25 54.875,120.625 C56,120 55.75,118.125 57.125,117.875 C58.5,117.625 58,117.875 59.25,117.625 C60.5,117.375 60.375,117.625 61.125,116.75 C61.875,115.875 62.5,113.625 63.125,113.375 C63.75,113.125 64.125,113.75 64.5,111.75 C64.875,109.75 64.25,110.125 64.875,109.625 C65.5,109.125 66.25,109.75 66.625,108.375 C67,107 66.875,106.75 66.875,106.125 C66.875,105.5 65.125,105.5 67.5,105 C69.875,104.5 70,105.25 70.5,104.25 C71,103.25 71,103.5 71.25,102.5 C71.5,101.5 72,101.75 72.625,100.75 C73.25,99.75 72.875,99.75 73.25,98.875 C73.625,98 73.625,94.75 74.25,94.5 C74.875,94.25 74.875,95 75.25,94 C75.625,93 75.25,92.75 76,91.75 C76.75,90.75 76.875,90.875 77.625,90.375 C78.375,89.875 78.5,90 78.75,89.375 C79,88.75 77.875,88.875 79.625,87.625 C81.375,86.375 81.25,86.875 81.5,86.25 C81.75,85.625 82,85.25 82.125,84.625 C82.25,84 82.125,84 82.25,83.125 C82.375,82.25 82.25,82.875 82.375,81.375 C82.5,79.875 82.75,78.875 82.875,78.25 C83,77.625 83.125,77.25 82.5,77.375 C81.875,77.5 81.75,78.5 81.625,77.375 C81.5,76.25 81.25,75.875 81,75.25 C80.75,74.625 80.375,73.5 80.375,73.5 C80.375,73.5 79.875,73 80.375,72.25 C80.875,71.5 81.5,70.375 81.5,70.375 C81.5,70.375 81.875,70 82.5,69.875 C83.125,69.75 83.25,70 83.75,69.375 C84.25,68.75 83.25,68.625 84.5,68.5 C85.75,68.375 86,68.375 86,68.375 L85.25,69.5 L85.125,70.5 C85.125,70.5 86.5,71.25 86.75,72.75 C87,74.25 87.25,74.375 87.125,75.125 C87,75.875 86.875,78.875 86.875,78.875 C86.875,78.875 86.875,79.875 87.625,80.5 C88.375,81.125 88.875,81.375 89.625,81.5 C90.375,81.625 91.75,81.75 92.375,81.5 C93,81.25 93.625,81.125 94.25,81.5 C94.875,81.875 95.625,81.5 96.125,81.25 C96.625,81 97.25,80.75 97.875,80.625 C98.5,80.5 99,80.5 100.25,80.5 C101.5,80.5 101.875,80.75 102.375,80.25 C102.875,79.75 102.75,80.125 103.375,79.625 C104,79.125 105.25,78.5 105.875,78.5 C106.5,78.5 106.5,78.375 107.25,78.25 C108,78.125 109,77.625 110,78 C111,78.375 111.375,78.5 112.25,78.625 C113.125,78.75 113.5,79 114,78.625 C114.5,78.25 115,77.875 115,77.125 C115,76.375 115.125,75.875 114.625,75.375 C114.625,75.375 114.125,74.875 113.75,73.625 C113.375,72.375 112.375,71.875 113.125,71 C113.875,70.125 114.25,70.25 114.5,69.125 C114.75,68 114,67.375 114.875,66.625 C115.75,65.875 115.875,65.75 116.125,64.625 C116.375,63.5 116.375,62.875 117.375,63.25 C118.375,63.625 118.25,62.5 118.875,64.25 C119.5,66 118.5,66.75 120.125,66.875 C121.75,67 122.875,67.75 122.875,66.75 C122.875,65.75 122.125,65 122.375,63.875 C122.625,62.75 120.5,61 120.5,61 C120.5,61 119.875,61.625 119.5,60.875 C119.125,60.125 118.875,60.375 118.75,59.125 C118.625,57.875 117.875,58.625 117.875,57.5 C117.875,56.375 117.375,55.375 118.125,54.875 C118.875,54.375 119.5,54.25 120.625,54.5 C121.75,54.75 123.875,54.125 124.875,54 C125.875,53.875 125.5,54.125 126.75,54.25 C128,54.375 128.75,54.375 129.625,54.125 C130.5,53.875 132.125,53.125 131.625,52.75 C131.125,52.375 130.75,52.125 130.125,52 C129.5,51.875 128.625,51.5 128.25,50.75 C127.875,50 127,49.125 126.375,49.375 C125.75,49.625 126,49.75 124.75,49.75 C123.5,49.75 122.875,48 121.875,48.625 C120.875,49.25 121.625,49.625 120.375,49.875 C119.125,50.125 117.75,50.25 116.5,50.25 C115.25,50.25 115.5,50 114.125,50.25 C112.75,50.5 111.75,51.25 111.25,50 C110.75,48.75 110.625,49.125 110.625,47.875 C110.625,46.625 111.375,45.75 111.625,44.625 C111.875,43.5 111.125,42.375 112,41.25 C112.875,40.125 113.5,39.875 113.875,39.25 C114.25,38.625 114.625,37.875 114.75,37 C114.875,36.125 114.875,36.375 114.875,35.5 C114.875,34.625 114.5,33.875 114,33.5 C113.5,33.125 113.625,33.125 112.5,33 C111.375,32.875 111.75,32.125 110.625,33.375 C109.5,34.625 108.5,34.75 108.375,35.75 C108.25,36.75 108.875,37.125 108.25,38.375 C107.625,39.625 107.5,39.5 107.25,40 C107,40.5 107.5,41.25 107,41.75 C106.5,42.25 106.125,42.25 105.25,42.75 C104.375,43.25 103.75,42.875 103.625,44.375 C103.5,45.875 103.25,45.5 103.625,46.5 C104,47.5 104.25,47.625 104.5,48.375 C104.75,49.125 105.25,49.5 105.25,51 C105.25,52.5 105.625,53 105.625,53 C105.625,53 106.125,54.75 106,55.625 C105.875,56.5 105.5,58 105.125,58.875 C104.75,59.75 104.375,60.25 103.75,60.875 C103.125,61.5 103.375,61.625 102.625,62.375 C101.875,63.125 101,63.375 100.375,63.75 C99.75,64.125 99.625,65.375 99.625,65.375 L99.625,67.75 C99.625,67.75 100.25,69.375 99.125,69.875 C98,70.375 97.75,70.5 97,71.625 C96.25,72.75 97,73.625 96.125,74.375 C95.25,75.125 95.5,75.25 94,75.125 C92.5,75 92.25,75 91.75,74.375 C91.25,73.75 90.625,72.625 89.875,72.5 C89.125,72.375 89.25,72.625 88.75,72.375 C88.25,72.125 88.625,71.625 87.875,71.625 C87.125,71.625 86.75,72.125 86.75,71.625 L86.75,70.25 L86.75,65.625 L84.875,62.75 L85.5,61.125 L84.75,59.875 L83.875,59.375 C83.875,59.375 82.5,59.875 82.375,60.375 C82.25,60.875 82.25,61.25 82,61.75 C81.75,62.25 80.625,63.75 79.75,63.875 C78.875,64 77.75,64.125 77.75,64.125 C77.75,64.125 77.375,65.125 76.625,64.75 C75.875,64.375 76.125,64.5 75.25,63.5 C74.375,62.5 74.125,61.375 74.125,60.875 C74.125,60.375 74.375,60.25 73.75,59.75 C73.125,59.25 73.125,59.25 72.5,58.625 C71.875,58 71,57.5 71.125,56.375 C71.25,55.25 71.5,54.125 71.75,53 C72,51.875 71.375,50.75 71.375,50.75 L70.90026,49.84149 L70.90026,49.84149 Z\"></path>\n					<path d=\"M25,27.5 C25,27.5 27,29.375 27.50001,28.375 C28.00001,27.37501 26.87501,26.125 28.37501,27.25 C29.875,28.375 29.75,28 30.25001,28.625 C30.75001,29.25 33.75,27.125 32.625,29.125 C31.5,31.12501 30.75001,31.875 31.5,31.75001 C32.25001,31.625 31.375,31 32.37501,32.25001 C33.37501,33.5 33.25001,34.5 34.62501,33.37501 L35.875,29.50001 C35.875,29.50001 39.37501,29.625 39.125,30.875 C38.87501,32.125 38,32 39.87501,31 C41.75,30 40.75,28.25 42.00001,29.375 C43.25001,30.5 43.87501,31.625 44.37501,30.5 C44.87501,29.375 43.25001,28.125 44.75001,28.375 C46.25,28.625 46.37501,30 47.25,28.375 C48.12501,26.75001 47.12501,25.875 48.5,26.125 C49.87501,26.375 49.25001,26.75001 50.25001,25.875 C51.25,25 51.00001,24.125 52.00001,25 C53.00001,25.875 53.00001,26.25001 53.00001,26.25001 C53.00001,26.25001 55,26.5 55.5,26.75001 C56,27 55.25001,25.75 55.75001,27.75 C56.25001,29.75 56.37501,30.375 57.00001,30.125 C57.625,29.875 58.00001,29.00001 58.00001,30.62501 C58.00001,32.25001 56.87501,32.75 58.375,32.5 C59.875,32.25001 60.25001,32.125 60.375,33.25 C60.5,34.375 61.12501,35.25 61.12501,35.25 C61.12501,35.25 61.25001,36.12501 61.12501,36.62501 C61,37.125 60.75001,37.375 61,38 C61.25001,38.625 61.5,39.625 61,39.87501 C60.5,40.125 59.75001,40.625 58.875,40.75 C58.00001,40.875 57.50001,41.5 57.25,42.12501 C57.00001,42.75 58.00001,42.375 56.87501,43.75001 C55.75001,45.125 56.125,45.37501 55.37501,45.625 C54.62501,45.87501 53.75001,46.375 53.75001,46.375 L50.37501,46.875 L49.625,45.5 C49.625,45.5 49.12501,44.375 48.62501,44.87501 C48.12501,45.37501 48.75001,46.375 48.25001,46.50001 C47.75001,46.625 46.50001,44.375 46.50001,45.37501 C46.50001,46.375 47.12501,48.12501 47.12501,48.12501 C47.12501,48.12501 47.25,49.625 46.62501,49.875 C46.00001,50.125 46.00001,50.87501 44.37501,51 C42.75001,51.125 42.62501,51.875 41.75,52 C40.875,52.125 40.62501,53.875 39.00001,52.625 C37.375,51.37501 32.87501,49.375 32,49.625 C31.12501,49.875 30.75001,50.25001 29.00001,49.75001 C27.25001,49.25 26.5,50.375 26.125,49.625 C25.75001,48.875 25.62501,50 26,48.25 C26.37501,46.50001 28.00001,45.625 28.00001,45.625 C28.00001,45.625 28.62501,45.25 28.50001,44.625 C28.37501,44 28.50001,43.75001 27.75,43.625 C27,43.5 27.25001,43.125 26.87501,42.12501 C26.5,41.125 26.125,41.25 25.12501,41.5 C24.12501,41.75 23.875,42.875 22.75,41.625 C21.625,40.375 21.125,40.625 21.625,39.87501 C22.125,39.125 22.00001,38.875 23.25,38.625 C24.50001,38.375 24.62501,39.625 25.12501,38.125 C25.62501,36.62501 26.125,36 26.125,36 C26.125,36 25.62501,35.75 24.75001,35.875 C23.875,36 24.12501,37 23.12501,35.00001 C22.125,33 21,33 21,33 C21,33 20.75001,33 21.37501,32 C22.00001,31 22.625,31 23.25,30 C23.875,29.00001 22.75,28.125 23.62501,27.25 C24.50001,26.375 24.75001,27 24.75001,27 L25,27.5 L25,27.5 Z\" id=\"iceland\"></path>\n					<path d=\"M17.5137,109.23847 C17.5137,109.23847 17.16016,109.76879 15.74594,109.76879 C14.33172,109.76879 14.15494,109.59201 13.27106,110.12235 C12.38718,110.65267 11.32653,110.82945 10.44264,111.00623 C9.55876,111.183 8.49809,112.24366 8.49809,112.24366 C8.49809,112.24366 8.49809,112.95077 7.26066,113.30432 C6.02321,113.65787 6.2,113.48111 4.96255,113.48111 C3.72513,113.48111 4.07867,112.42044 3.9019,111.71333 C3.9019,111.71333 -0.25,112.125 1,111.375 C2.25001,110.625 3.25001,111.125 2.37501,110.5 C1.5,109.87501 0.12501,109.75 1.62501,109.5 C3.125,109.25 3.5,109.5 3.5,109 C3.5,108.5 2.5,109.625 3.5,108 C4.50001,106.375 4.75,106.375 5.37501,105.875 C6.00001,105.375 5.62501,103.87501 6.50001,104.125 C7.375,104.37501 8.37501,104.625 8.37501,104.625 L8.87501,103.625 C8.87501,103.625 5.75,103.5 5.50001,103 C5.50001,103 3.87501,101.875 3.37501,101.875 C2.87501,101.875 1.75001,102 2.12501,101.5 C2.5,101 3.25001,99.50001 3.25001,99.50001 C3.25001,99.50001 1.62501,98.25 2.25001,97.75 C2.87501,97.25001 3,97.375 3,96.5 C3,95.62501 1.875,95.5 3.125,94.25 C4.37501,93 4.625,93.25 5.50001,92.5 C6.375,91.75 6.375,91.625 7,92.25 C7.62501,92.87501 7.62501,93.875 8.75001,92.5 C9.87501,91.125 10.00001,90.375 10.00001,90.375 C10.00001,90.375 9.50001,90.5 11.375,89.5 C13.25001,88.50001 11.75,87.625 14.5,88.00001 C17.25,88.375 16.75,88.50001 17.375,88.375 C18.00001,88.25 18.375,86.625 18.75001,88.00001 C19.12501,89.375 18.25,89.62501 20,90.125 C21.75,90.625 22.50001,90.375 22.00001,91.25001 C21.50001,92.125 21.37501,92 21.87501,92.75 C22.37501,93.50001 22.75,93.875 22.75,94.5 C22.75,95.12501 22.37501,95.62501 21.50001,96 C20.625,96.375 20.75001,95.875 19.62501,97 C18.50001,98.125 17.875,97.87501 17.875,97.87501 C17.875,97.87501 17.62501,97.25001 16.87501,97.75 C16.125,98.25 16.50001,99 15.37501,98.25 C14.25001,97.5 12.875,97.5 12.875,97.5 C12.875,97.5 12.375,97.5 12.50001,98.25 C12.62501,99 13.25001,101.5 13.25001,101.5 C13.25001,101.5 14.37501,103.5 14,104.37501 C13.62501,105.25 11.75,105.75 13.375,105.875 C15,106.00001 14.87501,105.625 14.87501,106.75 C14.87501,107.875 14.87501,108.5 15.87501,108.375 C16.87501,108.25001 17.62501,109.375 17.5137,109.23847 L17.5137,109.23847 Z\" id=\"ireland\"></path>\n					<path d=\"M30.7112945,98.278301 C30.1809645,97.659581 30.4461345,97.747971 30.2693545,97.129251 C30.0925745,96.510531 30.3577445,96.422151 30.3577445,95.803431 C30.3577445,95.184711 30.4461345,94.919541 30.7112945,94.124051 C30.9764645,93.328551 29.2970845,92.621451 29.2970845,92.002731 C29.2970845,91.384011 28.2364245,90.588511 28.0596445,90.234961 C27.8828645,89.881411 27.3525345,89.439471 26.7338245,89.527851 C26.1151045,89.616241 26.1151045,89.969801 25.4079945,90.323351 C24.7008845,90.676901 24.7008845,90.146571 24.1705545,89.704631 C23.6402245,89.262691 23.7286145,88.732361 23.7286145,87.760091 C23.7286145,86.787821 23.8170045,87.229761 24.1705545,86.787821 C24.5241145,86.345871 24.6125045,86.434261 25.1428345,85.815541 C25.6731645,85.196831 25.4079945,85.373601 25.4079945,84.754881 C25.4079945,84.136161 25.4079945,83.605831 25.1428345,82.898731 C24.8776645,82.191621 24.1705545,82.721951 23.9053945,82.014841 C23.6402245,81.307741 23.5518445,81.484511 23.1098945,81.219351 C22.6679545,80.954181 22.4911845,81.130961 21.5189045,81.042571 C20.5466345,80.954181 21.2537445,80.423851 21.1653545,80.070301 C21.0769645,79.716751 21.0769645,79.539971 20.9001945,78.567701 C20.7234145,77.595431 20.2814745,78.302531 19.7511445,78.390921 C19.2208145,78.479311 19.0440345,78.479311 18.8672545,77.595431 C18.6904845,76.711541 18.8672545,77.065101 18.7788645,76.623161 C18.6904845,76.181211 18.6020945,76.181211 17.9833745,75.208941 C17.3646545,74.236671 18.0717645,74.767001 18.7788645,74.236671 C19.4859745,73.706341 19.3975845,73.441171 20.0163045,72.999231 C20.6350245,72.557291 20.0163045,72.380511 19.8395245,71.673411 C19.6627545,70.966301 19.3091945,70.789521 19.3091945,70.789521 C19.3091945,70.789521 18.6904845,70.966301 17.6298245,70.966301 C16.5691645,70.966301 16.6575445,70.789521 16.1272145,70.082421 C15.5968845,69.375311 16.2156045,69.375311 17.0111045,68.756591 C17.8065945,68.137871 17.5414345,67.784321 18.3369245,66.900441 C19.1324245,66.016551 19.5743645,66.104941 20.5466345,65.928171 C21.5189045,65.751391 21.0769645,65.221061 21.5189045,64.160401 C21.9608545,63.099741 22.1376245,62.922961 22.4027945,62.304241 C22.6679545,61.685521 23.1982845,60.890031 23.3750645,59.740981 C23.5518445,58.591931 25.0000045,60.500001 28.0000045,59.500001 C31.0000045,58.500001 31.0000045,59.500001 31.0000045,59.500001 C31.0000045,59.500001 32.5000045,62.000001 30.0000045,63.000001 C27.5000045,64.000001 29.0000045,68.000001 29.0000045,68.000001 L29.7390245,68.049491 C29.7390245,68.049491 30.6229045,67.342381 31.3300145,67.253991 C32.0371245,67.165601 31.9487345,67.607541 32.8326145,67.607541 C33.7165045,67.607541 33.5397245,67.077211 34.6003845,66.370111 C35.6610445,65.663001 35.3958745,67.165601 35.3958745,67.784321 C35.3958745,68.403041 36.8100945,70.170811 36.8100945,70.170811 L36.4565345,70.789521 C36.4565345,70.789521 35.8378245,71.143081 35.8378245,72.115351 C35.8378245,73.087621 35.5726545,72.822461 35.3958745,73.264401 C35.2191045,73.706341 34.8655445,73.706341 34.4236045,73.971501 C33.9816645,74.236671 34.5119945,74.413451 34.6887745,75.297331 C34.8655445,76.181211 34.6003845,75.739271 34.1584445,75.827661 C33.7165045,75.916051 33.2745545,75.916051 32.9210045,76.534771 C32.5674545,77.153491 32.8326145,77.241871 32.3022845,77.948981 C31.7719545,78.656091 31.8603445,78.390921 30.7112945,78.744481 C29.5622445,79.098031 30.0925745,79.098031 30.3577445,80.423851 C30.6229045,81.749681 31.5067945,79.981911 33.0977845,79.805141 C34.6887745,79.628361 34.3352145,79.805141 35.3958745,79.805141 C36.4565345,79.805141 36.0145945,79.893521 36.7217045,80.423851 C37.4288145,80.954181 36.8984845,81.219351 37.2520345,81.838071 C37.6055845,82.456791 37.9591445,82.103231 38.4010845,82.721951 C38.8430245,83.340671 38.4010845,83.959391 38.4010845,84.843271 L38.4010845,85.638771 C38.4010845,85.638771 39.4617445,88.820751 40.8759545,89.616241 C42.2901745,90.411741 41.7598445,90.411741 42.3785545,90.942071 C42.9972745,91.472401 44.1463245,94.389211 44.4998745,94.831161 C44.8534345,95.273101 44.8534345,95.626651 45.0302045,97.217641 C45.2069845,98.808631 45.0302045,98.455081 44.8534345,99.073801 C44.6766545,99.692511 44.5882645,99.604131 44.3231045,100.576401 C44.0579345,101.548671 44.3231045,101.725451 44.3231045,102.079001 C44.3231045,102.432551 44.8534345,102.697721 46.6211945,101.813831 C48.3889645,100.929951 47.6818545,101.195121 48.8309045,100.841561 C49.9799545,100.488011 49.7147945,100.399621 50.7754545,100.664791 C51.8361145,100.929951 51.6593345,101.106731 52.6316045,102.079001 C53.6038745,103.051271 52.9851645,103.228051 53.2503245,103.935151 C53.5154945,104.642261 53.1619345,104.553871 52.8967745,105.260981 C52.6316045,105.968091 52.6316045,105.879701 52.1896645,106.763581 C51.7477245,107.647471 52.0128845,107.470691 51.6593345,108.001021 C51.3057845,108.531351 51.0406145,108.266181 49.9799545,108.531351 C48.9192945,108.796511 49.0960745,109.415231 48.5657445,109.945561 C48.0354145,110.475891 48.2121845,110.652671 48.1238045,111.094611 C48.0354145,111.536551 48.5657445,112.332051 48.5657445,112.332051 C48.5657445,112.332051 49.3612345,112.685601 49.8031745,113.127541 C50.2451245,113.569481 50.0683445,113.923041 49.5380145,114.806921 C49.0076845,115.690811 48.8309045,115.248861 47.7702445,115.690811 C46.7095845,116.132751 46.3560345,115.690811 45.2953745,115.602421 C44.2347145,115.514031 44.3231045,115.955971 42.8205045,116.486301 C41.3178945,117.016631 41.4062845,116.574691 40.2572345,116.486301 C39.1081845,116.397911 39.1965745,116.397911 38.0475245,116.486301 C36.8984845,116.574691 36.9868645,116.928241 35.6610445,117.723741 C34.3352145,118.519231 34.8655445,117.723741 34.4236045,117.370181 C33.9816645,117.016631 33.7165045,116.928241 33.0977845,116.309521 C32.4790645,115.690811 32.4790645,115.955971 31.9487345,116.132751 C31.4184045,116.309521 30.2693545,118.342461 29.4738545,118.696011 C28.6783645,119.049561 28.5899745,118.872791 27.4409245,118.872791 C26.2918745,118.872791 26.6454345,118.872791 26.1151045,118.961171 C25.5847745,119.049561 25.2312145,119.933451 24.5241145,120.728941 C23.8170045,121.524441 23.9937845,120.994111 22.6679545,121.170881 C21.3421345,121.347661 21.4305245,121.082491 21.2537445,120.728941 C21.0769645,120.375391 21.4305245,120.375391 21.8724645,119.756671 C22.3144045,119.137951 23.1098945,117.988901 23.6402245,117.105021 C24.1705545,116.221141 24.4357245,116.663081 25.7615445,115.867581 C27.0873745,115.072091 26.0267145,115.514031 26.6454345,114.188201 C27.2641545,112.862381 27.3525345,112.862381 28.6783645,112.420441 C28.6783645,112.420441 29.2500045,111.250001 28.1250045,110.625001 C27.0000045,110.000001 26.5000045,110.250001 25.3750045,109.750001 C24.2500045,109.250001 23.3750045,109.500001 23.6250045,108.812501 C24.7500045,107.500001 25.0000045,106.875001 25.3750045,106.250001 C25.7500045,105.625001 25.5000045,105.000001 26.0000045,105.000001 C26.5000045,105.000001 26.7500045,105.250001 27.3750045,104.875001 C28.0000045,104.500001 28.1250045,104.250001 28.1250045,103.500001 C28.1250045,102.750001 28.0000045,102.500001 28.2500045,101.750001 C28.5000045,101.000001 29.2500045,100.375001 28.6250045,99.875001 C28.0000045,99.375001 28.5000045,99.500001 27.7500045,99.250001 C27.0000045,99.000001 26.5000045,98.500001 26.5000045,98.500001 L26.7500045,97.500001 L26.9375045,95.750001 C26.9375045,95.750001 27.1250045,95.875001 28.3750045,96.375001 C29.6250045,96.875001 30.3750045,98.500001 30.3750045,98.500001 C30.6407545,98.972311 31.0265045,98.959571 30.7112945,98.278301 L30.7112945,98.278301 Z\" id=\"great-britain\"></path>\n				</g>\n			</g>\n			<g id=\"armies\" transform=\"translate(47.000000, 29.000000)\" sketch:type=\"MSTextLayer\">\n				<text data-territory-id=\"1\">\n					<tspan x=\"65.1069336\" y=\"41\">0</tspan>\n				</text>\n				<text data-territory-id=\"0\">\n					<tspan x=\"0.106933594\" y=\"41\">0</tspan>\n				</text>\n				<text data-territory-id=\"3\">\n					<tspan x=\"66.1069336\" y=\"80\">0</tspan>\n				</text>\n				<text data-territory-id=\"4\">\n					<tspan x=\"112.106934\" y=\"89\">0</tspan>\n				</text>\n				<text data-territory-id=\"5\">\n					<tspan x=\"159.106934\" y=\"87\">0</tspan>\n				</text>\n				<text data-territory-id=\"6\">\n					<tspan x=\"66.1069336\" y=\"130\">0</tspan>\n				</text>\n				<text data-territory-id=\"7\">\n					<tspan x=\"122.106934\" y=\"149\">0</tspan>\n				</text>\n				<text data-territory-id=\"8\">\n					<tspan x=\"60.1069336\" y=\"181\">0</tspan>\n				</text>\n				<text data-territory-id=\"9\">\n					<tspan x=\"125.106934\" y=\"242\">0</tspan>\n				</text>\n				<text data-territory-id=\"11\">\n					<tspan x=\"174.106934\" y=\"286\">0</tspan>\n				</text>\n				<text data-territory-id=\"10\">\n					<tspan x=\"130.106934\" y=\"305\">0</tspan>\n				</text>\n				<text data-territory-id=\"12\">\n					<tspan x=\"136.106934\" y=\"362\">0</tspan>\n				</text>\n				<text data-territory-id=\"13\">\n					<tspan x=\"265.106934\" y=\"63\">0</tspan>\n				</text>\n				<text data-territory-id=\"16\">\n					<tspan x=\"258.106934\" y=\"130\">0</tspan>\n				</text>\n				<text data-territory-id=\"18\">\n					<tspan x=\"268.106934\" y=\"183\">0</tspan>\n				</text>\n				<text data-territory-id=\"17\">\n					<tspan x=\"318.106934\" y=\"127\">0</tspan>\n				</text>\n				<text data-territory-id=\"19\">\n					<tspan x=\"324.106934\" y=\"171\">0</tspan>\n				</text>\n				<text data-territory-id=\"14\">\n					<tspan x=\"326.106934\" y=\"52\">0</tspan>\n				</text>\n				<text data-territory-id=\"15\">\n					<tspan x=\"385.106934\" y=\"95\">0</tspan>\n				</text>\n				<text data-territory-id=\"20\">\n					<tspan x=\"287.106934\" y=\"274\">0</tspan>\n				</text>\n				<text data-territory-id=\"21\">\n					<tspan x=\"345.106934\" y=\"248\">0</tspan>\n				</text>\n				<text data-territory-id=\"23\">\n					<tspan x=\"386.106934\" y=\"304\">0</tspan>\n				</text>\n				<text data-territory-id=\"22\">\n					<tspan x=\"349.106934\" y=\"332\">0</tspan>\n				</text>\n				<text data-territory-id=\"24\">\n					<tspan x=\"352.106934\" y=\"399\">0</tspan>\n				</text>\n				<text data-territory-id=\"25\">\n					<tspan x=\"415.106934\" y=\"397\">0</tspan>\n				</text>\n				<text data-territory-id=\"35\">\n					<tspan x=\"399.106934\" y=\"224\">0</tspan>\n				</text>\n				<text data-territory-id=\"33\">\n					<tspan x=\"445.106934\" y=\"146\">0</tspan>\n				</text>\n				<text data-territory-id=\"36\">\n					<tspan x=\"488.106934\" y=\"219\">0</tspan>\n				</text>\n				<text data-territory-id=\"37\">\n					<tspan x=\"544.106934\" y=\"240\">0</tspan>\n				</text>\n				<text data-territory-id=\"34\">\n					<tspan x=\"530.106934\" y=\"179\">0</tspan>\n				</text>\n				<text data-territory-id=\"31\">\n					<tspan x=\"551.106934\" y=\"133\">0</tspan>\n				</text>\n				<text data-territory-id=\"27\">\n					<tspan x=\"497.106934\" y=\"57\">0</tspan>\n				</text>\n				<text data-territory-id=\"26\">\n					<tspan x=\"462.106934\" y=\"83\">0</tspan>\n				</text>\n				<text data-territory-id=\"30\">\n					<tspan x=\"541.106934\" y=\"88\">0</tspan>\n				</text>\n				<text data-territory-id=\"28\">\n					<tspan x=\"551.106934\" y=\"28\">0</tspan>\n				</text>\n				<text data-territory-id=\"29\">\n					<tspan x=\"603.106934\" y=\"32\">0</tspan>\n				</text>\n				<text data-territory-id=\"32\">\n					<tspan x=\"624.106934\" y=\"141\">0</tspan>\n				</text>\n				<text data-territory-id=\"39\">\n					<tspan x=\"620.106934\" y=\"307\">0</tspan>\n				</text>\n				<text data-territory-id=\"38\">\n					<tspan x=\"558.106934\" y=\"319\">0</tspan>\n				</text>\n				<text data-territory-id=\"41\">\n					<tspan x=\"628.106934\" y=\"371\">0</tspan>\n				</text>\n				<text data-territory-id=\"40\">\n					<tspan x=\"586.106934\" y=\"392\">0</tspan>\n				</text>\n				<text data-territory-id=\"2\">\n					<tspan x=\"204.106934\" y=\"13\">0</tspan>\n				</text>\n			</g>\n		</g>\n	</g>\n</svg>\n";
	  },"useData":true});

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(40);
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(depth0,helpers,partials,data) {
	  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "			<div class=\"card\" data-id=\""
	    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
	    + "\">\n				";
	  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.territory : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
	  if (stack1 != null) { buffer += stack1; }
	  return buffer + "\n				<p>"
	    + escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"type","hash":{},"data":data}) : helper)))
	    + "</p>\n			</div>\n";
	},"2":function(depth0,helpers,partials,data) {
	  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
	  return "<p>"
	    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.territory : depth0)) != null ? stack1.name : stack1), depth0))
	    + "</p>";
	},"4":function(depth0,helpers,partials,data) {
	  return "<button type=\"button\" class=\"done-button\">Done</button>";
	  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
	  var stack1, buffer = "<form class=\"modal\">\n	<h2>Select cards to trade in</h2>\n	<div class=\"cards\">\n";
	  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.cards : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
	  if (stack1 != null) { buffer += stack1; }
	  buffer += "	</div>\n	<button type=\"submit\" class=\"trade-button\">Trade</button>\n	";
	  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.mustTrade : depth0), {"name":"unless","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
	  if (stack1 != null) { buffer += stack1; }
	  return buffer + "\n</form>\n\n";
	},"useData":true});

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(40);
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
	  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
	  return "<form class=\"modal\">\n	<h2>How many armies?</h2>\n	<p>Min: "
	    + escapeExpression(((helper = (helper = helpers.min || (depth0 != null ? depth0.min : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"min","hash":{},"data":data}) : helper)))
	    + ", max: "
	    + escapeExpression(((helper = (helper = helpers.max || (depth0 != null ? depth0.max : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"max","hash":{},"data":data}) : helper)))
	    + "</p>\n	<input type=\"number\" min=\""
	    + escapeExpression(((helper = (helper = helpers.min || (depth0 != null ? depth0.min : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"min","hash":{},"data":data}) : helper)))
	    + "\" max=\""
	    + escapeExpression(((helper = (helper = helpers.max || (depth0 != null ? depth0.max : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"max","hash":{},"data":data}) : helper)))
	    + "\" value=\""
	    + escapeExpression(((helper = (helper = helpers.min || (depth0 != null ? depth0.min : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"min","hash":{},"data":data}) : helper)))
	    + "\" class=\"army-count\" required>\n	<button type=\"submit\" class=\"select-button\">Select</button>\n	<button type=\"button\" class=\"cancel-button\">Cancel</button>\n</form>\n";
	},"useData":true});

/***/ },
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// Create a simple path alias to allow browserify to resolve
	// the runtime on a supported path.
	module.exports = __webpack_require__(43);


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(40);
	module.exports = (Handlebars["default"] || Handlebars).template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
	  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
	  return "<div class=\"armies-badge\" style=\"background-color: "
	    + escapeExpression(((helper = (helper = helpers.colour || (depth0 != null ? depth0.colour : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"colour","hash":{},"data":data}) : helper)))
	    + "\">\n	<div class=\"territories-count\">"
	    + escapeExpression(((helper = (helper = helpers.territories || (depth0 != null ? depth0.territories : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"territories","hash":{},"data":data}) : helper)))
	    + "</div>\n	<div class=\"armies-count\">"
	    + escapeExpression(((helper = (helper = helpers.armies || (depth0 != null ? depth0.armies : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"armies","hash":{},"data":data}) : helper)))
	    + "</div>\n</div>\n"
	    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
	    + "\n";
	},"useData":true});

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function() {
		var list = [];
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
		return list;
	}

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*globals Handlebars: true */
	var base = __webpack_require__(46);
	
	// Each of these augment the Handlebars object. No need to setup here.
	// (This is done to easily share code between commonjs and browse envs)
	var SafeString = __webpack_require__(47)["default"];
	var Exception = __webpack_require__(48)["default"];
	var Utils = __webpack_require__(49);
	var runtime = __webpack_require__(50);
	
	// For compatibility and usage outside of module systems, make the Handlebars object a namespace
	var create = function() {
	  var hb = new base.HandlebarsEnvironment();
	
	  Utils.extend(hb, base);
	  hb.SafeString = SafeString;
	  hb.Exception = Exception;
	  hb.Utils = Utils;
	  hb.escapeExpression = Utils.escapeExpression;
	
	  hb.VM = runtime;
	  hb.template = function(spec) {
	    return runtime.template(spec, hb);
	  };
	
	  return hb;
	};
	
	var Handlebars = create();
	Handlebars.create = create;
	
	Handlebars['default'] = Handlebars;
	
	exports["default"] = Handlebars;

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * jQuery JavaScript Library v2.1.3
	 * http://jquery.com/
	 *
	 * Includes Sizzle.js
	 * http://sizzlejs.com/
	 *
	 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2014-12-18T15:11Z
	 */
	
	(function( global, factory ) {
	
		if ( typeof module === "object" && typeof module.exports === "object" ) {
			// For CommonJS and CommonJS-like environments where a proper `window`
			// is present, execute the factory and get jQuery.
			// For environments that do not have a `window` with a `document`
			// (such as Node.js), expose a factory as module.exports.
			// This accentuates the need for the creation of a real `window`.
			// e.g. var jQuery = require("jquery")(window);
			// See ticket #14549 for more info.
			module.exports = global.document ?
				factory( global, true ) :
				function( w ) {
					if ( !w.document ) {
						throw new Error( "jQuery requires a window with a document" );
					}
					return factory( w );
				};
		} else {
			factory( global );
		}
	
	// Pass this if window is not defined yet
	}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {
	
	// Support: Firefox 18+
	// Can't be in strict mode, several libs including ASP.NET trace
	// the stack via arguments.caller.callee and Firefox dies if
	// you try to trace through "use strict" call chains. (#13335)
	//
	
	var arr = [];
	
	var slice = arr.slice;
	
	var concat = arr.concat;
	
	var push = arr.push;
	
	var indexOf = arr.indexOf;
	
	var class2type = {};
	
	var toString = class2type.toString;
	
	var hasOwn = class2type.hasOwnProperty;
	
	var support = {};
	
	
	
	var
		// Use the correct document accordingly with window argument (sandbox)
		document = window.document,
	
		version = "2.1.3",
	
		// Define a local copy of jQuery
		jQuery = function( selector, context ) {
			// The jQuery object is actually just the init constructor 'enhanced'
			// Need init if jQuery is called (just allow error to be thrown if not included)
			return new jQuery.fn.init( selector, context );
		},
	
		// Support: Android<4.1
		// Make sure we trim BOM and NBSP
		rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
	
		// Matches dashed string for camelizing
		rmsPrefix = /^-ms-/,
		rdashAlpha = /-([\da-z])/gi,
	
		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		};
	
	jQuery.fn = jQuery.prototype = {
		// The current version of jQuery being used
		jquery: version,
	
		constructor: jQuery,
	
		// Start with an empty selector
		selector: "",
	
		// The default length of a jQuery object is 0
		length: 0,
	
		toArray: function() {
			return slice.call( this );
		},
	
		// Get the Nth element in the matched element set OR
		// Get the whole matched element set as a clean array
		get: function( num ) {
			return num != null ?
	
				// Return just the one element from the set
				( num < 0 ? this[ num + this.length ] : this[ num ] ) :
	
				// Return all the elements in a clean array
				slice.call( this );
		},
	
		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function( elems ) {
	
			// Build a new jQuery matched element set
			var ret = jQuery.merge( this.constructor(), elems );
	
			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;
	
			// Return the newly-formed element set
			return ret;
		},
	
		// Execute a callback for every element in the matched set.
		// (You can seed the arguments with an array of args, but this is
		// only used internally.)
		each: function( callback, args ) {
			return jQuery.each( this, callback, args );
		},
	
		map: function( callback ) {
			return this.pushStack( jQuery.map(this, function( elem, i ) {
				return callback.call( elem, i, elem );
			}));
		},
	
		slice: function() {
			return this.pushStack( slice.apply( this, arguments ) );
		},
	
		first: function() {
			return this.eq( 0 );
		},
	
		last: function() {
			return this.eq( -1 );
		},
	
		eq: function( i ) {
			var len = this.length,
				j = +i + ( i < 0 ? len : 0 );
			return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
		},
	
		end: function() {
			return this.prevObject || this.constructor(null);
		},
	
		// For internal use only.
		// Behaves like an Array's method, not like a jQuery method.
		push: push,
		sort: arr.sort,
		splice: arr.splice
	};
	
	jQuery.extend = jQuery.fn.extend = function() {
		var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false;
	
		// Handle a deep copy situation
		if ( typeof target === "boolean" ) {
			deep = target;
	
			// Skip the boolean and the target
			target = arguments[ i ] || {};
			i++;
		}
	
		// Handle case when target is a string or something (possible in deep copy)
		if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
			target = {};
		}
	
		// Extend jQuery itself if only one argument is passed
		if ( i === length ) {
			target = this;
			i--;
		}
	
		for ( ; i < length; i++ ) {
			// Only deal with non-null/undefined values
			if ( (options = arguments[ i ]) != null ) {
				// Extend the base object
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];
	
					// Prevent never-ending loop
					if ( target === copy ) {
						continue;
					}
	
					// Recurse if we're merging plain objects or arrays
					if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];
	
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}
	
						// Never move original objects, clone them
						target[ name ] = jQuery.extend( deep, clone, copy );
	
					// Don't bring in undefined values
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
	
		// Return the modified object
		return target;
	};
	
	jQuery.extend({
		// Unique for each copy of jQuery on the page
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
	
		// Assume jQuery is ready without the ready module
		isReady: true,
	
		error: function( msg ) {
			throw new Error( msg );
		},
	
		noop: function() {},
	
		isFunction: function( obj ) {
			return jQuery.type(obj) === "function";
		},
	
		isArray: Array.isArray,
	
		isWindow: function( obj ) {
			return obj != null && obj === obj.window;
		},
	
		isNumeric: function( obj ) {
			// parseFloat NaNs numeric-cast false positives (null|true|false|"")
			// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
			// subtraction forces infinities to NaN
			// adding 1 corrects loss of precision from parseFloat (#15100)
			return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
		},
	
		isPlainObject: function( obj ) {
			// Not plain objects:
			// - Any object or value whose internal [[Class]] property is not "[object Object]"
			// - DOM nodes
			// - window
			if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
				return false;
			}
	
			if ( obj.constructor &&
					!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
	
			// If the function hasn't returned already, we're confident that
			// |obj| is a plain object, created by {} or constructed with new Object
			return true;
		},
	
		isEmptyObject: function( obj ) {
			var name;
			for ( name in obj ) {
				return false;
			}
			return true;
		},
	
		type: function( obj ) {
			if ( obj == null ) {
				return obj + "";
			}
			// Support: Android<4.0, iOS<6 (functionish RegExp)
			return typeof obj === "object" || typeof obj === "function" ?
				class2type[ toString.call(obj) ] || "object" :
				typeof obj;
		},
	
		// Evaluates a script in a global context
		globalEval: function( code ) {
			var script,
				indirect = eval;
	
			code = jQuery.trim( code );
	
			if ( code ) {
				// If the code includes a valid, prologue position
				// strict mode pragma, execute code by injecting a
				// script tag into the document.
				if ( code.indexOf("use strict") === 1 ) {
					script = document.createElement("script");
					script.text = code;
					document.head.appendChild( script ).parentNode.removeChild( script );
				} else {
				// Otherwise, avoid the DOM node creation, insertion
				// and removal by using an indirect global eval
					indirect( code );
				}
			}
		},
	
		// Convert dashed to camelCase; used by the css and data modules
		// Support: IE9-11+
		// Microsoft forgot to hump their vendor prefix (#9572)
		camelCase: function( string ) {
			return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
		},
	
		nodeName: function( elem, name ) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},
	
		// args is for internal usage only
		each: function( obj, callback, args ) {
			var value,
				i = 0,
				length = obj.length,
				isArray = isArraylike( obj );
	
			if ( args ) {
				if ( isArray ) {
					for ( ; i < length; i++ ) {
						value = callback.apply( obj[ i ], args );
	
						if ( value === false ) {
							break;
						}
					}
				} else {
					for ( i in obj ) {
						value = callback.apply( obj[ i ], args );
	
						if ( value === false ) {
							break;
						}
					}
				}
	
			// A special, fast, case for the most common use of each
			} else {
				if ( isArray ) {
					for ( ; i < length; i++ ) {
						value = callback.call( obj[ i ], i, obj[ i ] );
	
						if ( value === false ) {
							break;
						}
					}
				} else {
					for ( i in obj ) {
						value = callback.call( obj[ i ], i, obj[ i ] );
	
						if ( value === false ) {
							break;
						}
					}
				}
			}
	
			return obj;
		},
	
		// Support: Android<4.1
		trim: function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},
	
		// results is for internal usage only
		makeArray: function( arr, results ) {
			var ret = results || [];
	
			if ( arr != null ) {
				if ( isArraylike( Object(arr) ) ) {
					jQuery.merge( ret,
						typeof arr === "string" ?
						[ arr ] : arr
					);
				} else {
					push.call( ret, arr );
				}
			}
	
			return ret;
		},
	
		inArray: function( elem, arr, i ) {
			return arr == null ? -1 : indexOf.call( arr, elem, i );
		},
	
		merge: function( first, second ) {
			var len = +second.length,
				j = 0,
				i = first.length;
	
			for ( ; j < len; j++ ) {
				first[ i++ ] = second[ j ];
			}
	
			first.length = i;
	
			return first;
		},
	
		grep: function( elems, callback, invert ) {
			var callbackInverse,
				matches = [],
				i = 0,
				length = elems.length,
				callbackExpect = !invert;
	
			// Go through the array, only saving the items
			// that pass the validator function
			for ( ; i < length; i++ ) {
				callbackInverse = !callback( elems[ i ], i );
				if ( callbackInverse !== callbackExpect ) {
					matches.push( elems[ i ] );
				}
			}
	
			return matches;
		},
	
		// arg is for internal usage only
		map: function( elems, callback, arg ) {
			var value,
				i = 0,
				length = elems.length,
				isArray = isArraylike( elems ),
				ret = [];
	
			// Go through the array, translating each of the items to their new values
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
	
			// Go through every key on the object,
			} else {
				for ( i in elems ) {
					value = callback( elems[ i ], i, arg );
	
					if ( value != null ) {
						ret.push( value );
					}
				}
			}
	
			// Flatten any nested arrays
			return concat.apply( [], ret );
		},
	
		// A global GUID counter for objects
		guid: 1,
	
		// Bind a function to a context, optionally partially applying any
		// arguments.
		proxy: function( fn, context ) {
			var tmp, args, proxy;
	
			if ( typeof context === "string" ) {
				tmp = fn[ context ];
				context = fn;
				fn = tmp;
			}
	
			// Quick check to determine if target is callable, in the spec
			// this throws a TypeError, but we will just return undefined.
			if ( !jQuery.isFunction( fn ) ) {
				return undefined;
			}
	
			// Simulated bind
			args = slice.call( arguments, 2 );
			proxy = function() {
				return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
			};
	
			// Set the guid of unique handler to the same of original handler, so it can be removed
			proxy.guid = fn.guid = fn.guid || jQuery.guid++;
	
			return proxy;
		},
	
		now: Date.now,
	
		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	});
	
	// Populate the class2type map
	jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});
	
	function isArraylike( obj ) {
		var length = obj.length,
			type = jQuery.type( obj );
	
		if ( type === "function" || jQuery.isWindow( obj ) ) {
			return false;
		}
	
		if ( obj.nodeType === 1 && length ) {
			return true;
		}
	
		return type === "array" || length === 0 ||
			typeof length === "number" && length > 0 && ( length - 1 ) in obj;
	}
	var Sizzle =
	/*!
	 * Sizzle CSS Selector Engine v2.2.0-pre
	 * http://sizzlejs.com/
	 *
	 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
	 * Released under the MIT license
	 * http://jquery.org/license
	 *
	 * Date: 2014-12-16
	 */
	(function( window ) {
	
	var i,
		support,
		Expr,
		getText,
		isXML,
		tokenize,
		compile,
		select,
		outermostContext,
		sortInput,
		hasDuplicate,
	
		// Local document vars
		setDocument,
		document,
		docElem,
		documentIsHTML,
		rbuggyQSA,
		rbuggyMatches,
		matches,
		contains,
	
		// Instance-specific data
		expando = "sizzle" + 1 * new Date(),
		preferredDoc = window.document,
		dirruns = 0,
		done = 0,
		classCache = createCache(),
		tokenCache = createCache(),
		compilerCache = createCache(),
		sortOrder = function( a, b ) {
			if ( a === b ) {
				hasDuplicate = true;
			}
			return 0;
		},
	
		// General-purpose constants
		MAX_NEGATIVE = 1 << 31,
	
		// Instance methods
		hasOwn = ({}).hasOwnProperty,
		arr = [],
		pop = arr.pop,
		push_native = arr.push,
		push = arr.push,
		slice = arr.slice,
		// Use a stripped-down indexOf as it's faster than native
		// http://jsperf.com/thor-indexof-vs-for/5
		indexOf = function( list, elem ) {
			var i = 0,
				len = list.length;
			for ( ; i < len; i++ ) {
				if ( list[i] === elem ) {
					return i;
				}
			}
			return -1;
		},
	
		booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
	
		// Regular expressions
	
		// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
		whitespace = "[\\x20\\t\\r\\n\\f]",
		// http://www.w3.org/TR/css3-syntax/#characters
		characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
	
		// Loosely modeled on CSS identifier characters
		// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
		// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
		identifier = characterEncoding.replace( "w", "w#" ),
	
		// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
		attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
			// Operator (capture 2)
			"*([*^$|!~]?=)" + whitespace +
			// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
			"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
			"*\\]",
	
		pseudos = ":(" + characterEncoding + ")(?:\\((" +
			// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
			// 1. quoted (capture 3; capture 4 or capture 5)
			"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
			// 2. simple (capture 6)
			"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
			// 3. anything else (capture 2)
			".*" +
			")\\)|)",
	
		// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
		rwhitespace = new RegExp( whitespace + "+", "g" ),
		rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),
	
		rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
		rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),
	
		rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),
	
		rpseudo = new RegExp( pseudos ),
		ridentifier = new RegExp( "^" + identifier + "$" ),
	
		matchExpr = {
			"ID": new RegExp( "^#(" + characterEncoding + ")" ),
			"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
			"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
			"ATTR": new RegExp( "^" + attributes ),
			"PSEUDO": new RegExp( "^" + pseudos ),
			"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
				"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
				"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
			"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
			// For use in libraries implementing .is()
			// We use this for POS matching in `select`
			"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
				whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
		},
	
		rinputs = /^(?:input|select|textarea|button)$/i,
		rheader = /^h\d$/i,
	
		rnative = /^[^{]+\{\s*\[native \w/,
	
		// Easily-parseable/retrievable ID or TAG or CLASS selectors
		rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
	
		rsibling = /[+~]/,
		rescape = /'|\\/g,
	
		// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
		runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
		funescape = function( _, escaped, escapedWhitespace ) {
			var high = "0x" + escaped - 0x10000;
			// NaN means non-codepoint
			// Support: Firefox<24
			// Workaround erroneous numeric interpretation of +"0x"
			return high !== high || escapedWhitespace ?
				escaped :
				high < 0 ?
					// BMP codepoint
					String.fromCharCode( high + 0x10000 ) :
					// Supplemental Plane codepoint (surrogate pair)
					String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
		},
	
		// Used for iframes
		// See setDocument()
		// Removing the function wrapper causes a "Permission Denied"
		// error in IE
		unloadHandler = function() {
			setDocument();
		};
	
	// Optimize for push.apply( _, NodeList )
	try {
		push.apply(
			(arr = slice.call( preferredDoc.childNodes )),
			preferredDoc.childNodes
		);
		// Support: Android<4.0
		// Detect silently failing push.apply
		arr[ preferredDoc.childNodes.length ].nodeType;
	} catch ( e ) {
		push = { apply: arr.length ?
	
			// Leverage slice if possible
			function( target, els ) {
				push_native.apply( target, slice.call(els) );
			} :
	
			// Support: IE<9
			// Otherwise append directly
			function( target, els ) {
				var j = target.length,
					i = 0;
				// Can't trust NodeList.length
				while ( (target[j++] = els[i++]) ) {}
				target.length = j - 1;
			}
		};
	}
	
	function Sizzle( selector, context, results, seed ) {
		var match, elem, m, nodeType,
			// QSA vars
			i, groups, old, nid, newContext, newSelector;
	
		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
	
		context = context || document;
		results = results || [];
		nodeType = context.nodeType;
	
		if ( typeof selector !== "string" || !selector ||
			nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
	
			return results;
		}
	
		if ( !seed && documentIsHTML ) {
	
			// Try to shortcut find operations when possible (e.g., not under DocumentFragment)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
				// Speed-up: Sizzle("#ID")
				if ( (m = match[1]) ) {
					if ( nodeType === 9 ) {
						elem = context.getElementById( m );
						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document (jQuery #6963)
						if ( elem && elem.parentNode ) {
							// Handle the case where IE, Opera, and Webkit return items
							// by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}
					} else {
						// Context is not a document
						if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
							contains( context, elem ) && elem.id === m ) {
							results.push( elem );
							return results;
						}
					}
	
				// Speed-up: Sizzle("TAG")
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;
	
				// Speed-up: Sizzle(".CLASS")
				} else if ( (m = match[3]) && support.getElementsByClassName ) {
					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}
	
			// QSA path
			if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
				nid = old = expando;
				newContext = context;
				newSelector = nodeType !== 1 && selector;
	
				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					groups = tokenize( selector );
	
					if ( (old = context.getAttribute("id")) ) {
						nid = old.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}
					nid = "[id='" + nid + "'] ";
	
					i = groups.length;
					while ( i-- ) {
						groups[i] = nid + toSelector( groups[i] );
					}
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
					newSelector = groups.join(",");
				}
	
				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}
		}
	
		// All others
		return select( selector.replace( rtrim, "$1" ), context, results, seed );
	}
	
	/**
	 * Create key-value caches of limited size
	 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
	 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
	 *	deleting the oldest entry
	 */
	function createCache() {
		var keys = [];
	
		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > Expr.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	}
	
	/**
	 * Mark a function for special use by Sizzle
	 * @param {Function} fn The function to mark
	 */
	function markFunction( fn ) {
		fn[ expando ] = true;
		return fn;
	}
	
	/**
	 * Support testing using an element
	 * @param {Function} fn Passed the created div and expects a boolean result
	 */
	function assert( fn ) {
		var div = document.createElement("div");
	
		try {
			return !!fn( div );
		} catch (e) {
			return false;
		} finally {
			// Remove from its parent by default
			if ( div.parentNode ) {
				div.parentNode.removeChild( div );
			}
			// release memory in IE
			div = null;
		}
	}
	
	/**
	 * Adds the same handler for all of the specified attrs
	 * @param {String} attrs Pipe-separated list of attributes
	 * @param {Function} handler The method that will be applied
	 */
	function addHandle( attrs, handler ) {
		var arr = attrs.split("|"),
			i = attrs.length;
	
		while ( i-- ) {
			Expr.attrHandle[ arr[i] ] = handler;
		}
	}
	
	/**
	 * Checks document order of two siblings
	 * @param {Element} a
	 * @param {Element} b
	 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
	 */
	function siblingCheck( a, b ) {
		var cur = b && a,
			diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
				( ~b.sourceIndex || MAX_NEGATIVE ) -
				( ~a.sourceIndex || MAX_NEGATIVE );
	
		// Use IE sourceIndex if available on both nodes
		if ( diff ) {
			return diff;
		}
	
		// Check if b follows a
		if ( cur ) {
			while ( (cur = cur.nextSibling) ) {
				if ( cur === b ) {
					return -1;
				}
			}
		}
	
		return a ? 1 : -1;
	}
	
	/**
	 * Returns a function to use in pseudos for input types
	 * @param {String} type
	 */
	function createInputPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for buttons
	 * @param {String} type
	 */
	function createButtonPseudo( type ) {
		return function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && elem.type === type;
		};
	}
	
	/**
	 * Returns a function to use in pseudos for positionals
	 * @param {Function} fn
	 */
	function createPositionalPseudo( fn ) {
		return markFunction(function( argument ) {
			argument = +argument;
			return markFunction(function( seed, matches ) {
				var j,
					matchIndexes = fn( [], seed.length, argument ),
					i = matchIndexes.length;
	
				// Match elements found at the specified indexes
				while ( i-- ) {
					if ( seed[ (j = matchIndexes[i]) ] ) {
						seed[j] = !(matches[j] = seed[j]);
					}
				}
			});
		});
	}
	
	/**
	 * Checks a node for validity as a Sizzle context
	 * @param {Element|Object=} context
	 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
	 */
	function testContext( context ) {
		return context && typeof context.getElementsByTagName !== "undefined" && context;
	}
	
	// Expose support vars for convenience
	support = Sizzle.support = {};
	
	/**
	 * Detects XML nodes
	 * @param {Element|Object} elem An element or a document
	 * @returns {Boolean} True iff elem is a non-HTML XML node
	 */
	isXML = Sizzle.isXML = function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = elem && (elem.ownerDocument || elem).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	};
	
	/**
	 * Sets document-related variables once based on the current document
	 * @param {Element|Object} [doc] An element or document object to use to set the document
	 * @returns {Object} Returns the current document
	 */
	setDocument = Sizzle.setDocument = function( node ) {
		var hasCompare, parent,
			doc = node ? node.ownerDocument || node : preferredDoc;
	
		// If no document and documentElement is available, return
		if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
			return document;
		}
	
		// Set our document
		document = doc;
		docElem = doc.documentElement;
		parent = doc.defaultView;
	
		// Support: IE>8
		// If iframe document is assigned to "document" variable and if iframe has been reloaded,
		// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
		// IE6-8 do not support the defaultView property so parent will be undefined
		if ( parent && parent !== parent.top ) {
			// IE11 does not have attachEvent, so all must suffer
			if ( parent.addEventListener ) {
				parent.addEventListener( "unload", unloadHandler, false );
			} else if ( parent.attachEvent ) {
				parent.attachEvent( "onunload", unloadHandler );
			}
		}
	
		/* Support tests
		---------------------------------------------------------------------- */
		documentIsHTML = !isXML( doc );
	
		/* Attributes
		---------------------------------------------------------------------- */
	
		// Support: IE<8
		// Verify that getAttribute really returns attributes and not properties
		// (excepting IE8 booleans)
		support.attributes = assert(function( div ) {
			div.className = "i";
			return !div.getAttribute("className");
		});
	
		/* getElement(s)By*
		---------------------------------------------------------------------- */
	
		// Check if getElementsByTagName("*") returns only elements
		support.getElementsByTagName = assert(function( div ) {
			div.appendChild( doc.createComment("") );
			return !div.getElementsByTagName("*").length;
		});
	
		// Support: IE<9
		support.getElementsByClassName = rnative.test( doc.getElementsByClassName );
	
		// Support: IE<10
		// Check if getElementById returns elements by name
		// The broken getElementById methods don't pick up programatically-set names,
		// so use a roundabout getElementsByName test
		support.getById = assert(function( div ) {
			docElem.appendChild( div ).id = expando;
			return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
		});
	
		// ID find and filter
		if ( support.getById ) {
			Expr.find["ID"] = function( id, context ) {
				if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [ m ] : [];
				}
			};
			Expr.filter["ID"] = function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					return elem.getAttribute("id") === attrId;
				};
			};
		} else {
			// Support: IE6/7
			// getElementById is not reliable as a find shortcut
			delete Expr.find["ID"];
	
			Expr.filter["ID"] =  function( id ) {
				var attrId = id.replace( runescape, funescape );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
					return node && node.value === attrId;
				};
			};
		}
	
		// Tag
		Expr.find["TAG"] = support.getElementsByTagName ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== "undefined" ) {
					return context.getElementsByTagName( tag );
	
				// DocumentFragment nodes don't have gEBTN
				} else if ( support.qsa ) {
					return context.querySelectorAll( tag );
				}
			} :
	
			function( tag, context ) {
				var elem,
					tmp = [],
					i = 0,
					// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
					results = context.getElementsByTagName( tag );
	
				// Filter out possible comments
				if ( tag === "*" ) {
					while ( (elem = results[i++]) ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}
	
					return tmp;
				}
				return results;
			};
	
		// Class
		Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
			if ( documentIsHTML ) {
				return context.getElementsByClassName( className );
			}
		};
	
		/* QSA/matchesSelector
		---------------------------------------------------------------------- */
	
		// QSA and matchesSelector support
	
		// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
		rbuggyMatches = [];
	
		// qSa(:focus) reports false when true (Chrome 21)
		// We allow this because of a bug in IE8/9 that throws an error
		// whenever `document.activeElement` is accessed on an iframe
		// So, we allow :focus to pass through QSA all the time to avoid the IE error
		// See http://bugs.jquery.com/ticket/13378
		rbuggyQSA = [];
	
		if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
			// Build QSA regex
			// Regex strategy adopted from Diego Perini
			assert(function( div ) {
				// Select is set to empty string on purpose
				// This is to test IE's treatment of not explicitly
				// setting a boolean content attribute,
				// since its presence should be enough
				// http://bugs.jquery.com/ticket/12359
				docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
					"<select id='" + expando + "-\f]' msallowcapture=''>" +
					"<option selected=''></option></select>";
	
				// Support: IE8, Opera 11-12.16
				// Nothing should be selected when empty strings follow ^= or $= or *=
				// The test attribute must be unknown in Opera but "safe" for WinRT
				// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
				if ( div.querySelectorAll("[msallowcapture^='']").length ) {
					rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
				}
	
				// Support: IE8
				// Boolean attributes and "value" are not treated correctly
				if ( !div.querySelectorAll("[selected]").length ) {
					rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
				}
	
				// Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
				if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
					rbuggyQSA.push("~=");
				}
	
				// Webkit/Opera - :checked should return selected option elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":checked").length ) {
					rbuggyQSA.push(":checked");
				}
	
				// Support: Safari 8+, iOS 8+
				// https://bugs.webkit.org/show_bug.cgi?id=136851
				// In-page `selector#id sibing-combinator selector` fails
				if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
					rbuggyQSA.push(".#.+[+~]");
				}
			});
	
			assert(function( div ) {
				// Support: Windows 8 Native Apps
				// The type and name attributes are restricted during .innerHTML assignment
				var input = doc.createElement("input");
				input.setAttribute( "type", "hidden" );
				div.appendChild( input ).setAttribute( "name", "D" );
	
				// Support: IE8
				// Enforce case-sensitivity of name attribute
				if ( div.querySelectorAll("[name=d]").length ) {
					rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
				}
	
				// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
				// IE8 throws error here and will not see later tests
				if ( !div.querySelectorAll(":enabled").length ) {
					rbuggyQSA.push( ":enabled", ":disabled" );
				}
	
				// Opera 10-11 does not throw on post-comma invalid pseudos
				div.querySelectorAll("*,:x");
				rbuggyQSA.push(",.*:");
			});
		}
	
		if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
			docElem.webkitMatchesSelector ||
			docElem.mozMatchesSelector ||
			docElem.oMatchesSelector ||
			docElem.msMatchesSelector) )) ) {
	
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				support.disconnectedMatch = matches.call( div, "div" );
	
				// This should fail with an exception
				// Gecko does not error, returns false instead
				matches.call( div, "[s!='']:x" );
				rbuggyMatches.push( "!=", pseudos );
			});
		}
	
		rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
		rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );
	
		/* Contains
		---------------------------------------------------------------------- */
		hasCompare = rnative.test( docElem.compareDocumentPosition );
	
		// Element contains another
		// Purposefully does not implement inclusive descendent
		// As in, an element does not contain itself
		contains = hasCompare || rnative.test( docElem.contains ) ?
			function( a, b ) {
				var adown = a.nodeType === 9 ? a.documentElement : a,
					bup = b && b.parentNode;
				return a === bup || !!( bup && bup.nodeType === 1 && (
					adown.contains ?
						adown.contains( bup ) :
						a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
				));
			} :
			function( a, b ) {
				if ( b ) {
					while ( (b = b.parentNode) ) {
						if ( b === a ) {
							return true;
						}
					}
				}
				return false;
			};
	
		/* Sorting
		---------------------------------------------------------------------- */
	
		// Document order sorting
		sortOrder = hasCompare ?
		function( a, b ) {
	
			// Flag for duplicate removal
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			// Sort on method existence if only one input has compareDocumentPosition
			var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
			if ( compare ) {
				return compare;
			}
	
			// Calculate position if both inputs belong to the same document
			compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
				a.compareDocumentPosition( b ) :
	
				// Otherwise we know they are disconnected
				1;
	
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {
	
				// Choose the first element that is related to our preferred document
				if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
					return 1;
				}
	
				// Maintain original order
				return sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
			}
	
			return compare & 4 ? -1 : 1;
		} :
		function( a, b ) {
			// Exit early if the nodes are identical
			if ( a === b ) {
				hasDuplicate = true;
				return 0;
			}
	
			var cur,
				i = 0,
				aup = a.parentNode,
				bup = b.parentNode,
				ap = [ a ],
				bp = [ b ];
	
			// Parentless nodes are either documents or disconnected
			if ( !aup || !bup ) {
				return a === doc ? -1 :
					b === doc ? 1 :
					aup ? -1 :
					bup ? 1 :
					sortInput ?
					( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
					0;
	
			// If the nodes are siblings, we can do a quick check
			} else if ( aup === bup ) {
				return siblingCheck( a, b );
			}
	
			// Otherwise we need full lists of their ancestors for comparison
			cur = a;
			while ( (cur = cur.parentNode) ) {
				ap.unshift( cur );
			}
			cur = b;
			while ( (cur = cur.parentNode) ) {
				bp.unshift( cur );
			}
	
			// Walk down the tree looking for a discrepancy
			while ( ap[i] === bp[i] ) {
				i++;
			}
	
			return i ?
				// Do a sibling check if the nodes have a common ancestor
				siblingCheck( ap[i], bp[i] ) :
	
				// Otherwise nodes in our document sort first
				ap[i] === preferredDoc ? -1 :
				bp[i] === preferredDoc ? 1 :
				0;
		};
	
		return doc;
	};
	
	Sizzle.matches = function( expr, elements ) {
		return Sizzle( expr, null, null, elements );
	};
	
	Sizzle.matchesSelector = function( elem, expr ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		// Make sure that attribute selectors are quoted
		expr = expr.replace( rattributeQuotes, "='$1']" );
	
		if ( support.matchesSelector && documentIsHTML &&
			( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
			( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {
	
			try {
				var ret = matches.call( elem, expr );
	
				// IE 9's matchesSelector returns false on disconnected nodes
				if ( ret || support.disconnectedMatch ||
						// As well, disconnected nodes are said to be in a document
						// fragment in IE 9
						elem.document && elem.document.nodeType !== 11 ) {
					return ret;
				}
			} catch (e) {}
		}
	
		return Sizzle( expr, document, null, [ elem ] ).length > 0;
	};
	
	Sizzle.contains = function( context, elem ) {
		// Set document vars if needed
		if ( ( context.ownerDocument || context ) !== document ) {
			setDocument( context );
		}
		return contains( context, elem );
	};
	
	Sizzle.attr = function( elem, name ) {
		// Set document vars if needed
		if ( ( elem.ownerDocument || elem ) !== document ) {
			setDocument( elem );
		}
	
		var fn = Expr.attrHandle[ name.toLowerCase() ],
			// Don't get fooled by Object.prototype properties (jQuery #13807)
			val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
				fn( elem, name, !documentIsHTML ) :
				undefined;
	
		return val !== undefined ?
			val :
			support.attributes || !documentIsHTML ?
				elem.getAttribute( name ) :
				(val = elem.getAttributeNode(name)) && val.specified ?
					val.value :
					null;
	};
	
	Sizzle.error = function( msg ) {
		throw new Error( "Syntax error, unrecognized expression: " + msg );
	};
	
	/**
	 * Document sorting and removing duplicates
	 * @param {ArrayLike} results
	 */
	Sizzle.uniqueSort = function( results ) {
		var elem,
			duplicates = [],
			j = 0,
			i = 0;
	
		// Unless we *know* we can detect duplicates, assume their presence
		hasDuplicate = !support.detectDuplicates;
		sortInput = !support.sortStable && results.slice( 0 );
		results.sort( sortOrder );
	
		if ( hasDuplicate ) {
			while ( (elem = results[i++]) ) {
				if ( elem === results[ i ] ) {
					j = duplicates.push( i );
				}
			}
			while ( j-- ) {
				results.splice( duplicates[ j ], 1 );
			}
		}
	
		// Clear input after sorting to release objects
		// See https://github.com/jquery/sizzle/pull/225
		sortInput = null;
	
		return results;
	};
	
	/**
	 * Utility function for retrieving the text value of an array of DOM nodes
	 * @param {Array|Element} elem
	 */
	getText = Sizzle.getText = function( elem ) {
		var node,
			ret = "",
			i = 0,
			nodeType = elem.nodeType;
	
		if ( !nodeType ) {
			// If no nodeType, this is expected to be an array
			while ( (node = elem[i++]) ) {
				// Do not traverse comment nodes
				ret += getText( node );
			}
		} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (jQuery #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	
		return ret;
	};
	
	Expr = Sizzle.selectors = {
	
		// Can be adjusted by the user
		cacheLength: 50,
	
		createPseudo: markFunction,
	
		match: matchExpr,
	
		attrHandle: {},
	
		find: {},
	
		relative: {
			">": { dir: "parentNode", first: true },
			" ": { dir: "parentNode" },
			"+": { dir: "previousSibling", first: true },
			"~": { dir: "previousSibling" }
		},
	
		preFilter: {
			"ATTR": function( match ) {
				match[1] = match[1].replace( runescape, funescape );
	
				// Move the given value to match[3] whether quoted or unquoted
				match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );
	
				if ( match[2] === "~=" ) {
					match[3] = " " + match[3] + " ";
				}
	
				return match.slice( 0, 4 );
			},
	
			"CHILD": function( match ) {
				/* matches from matchExpr["CHILD"]
					1 type (only|nth|...)
					2 what (child|of-type)
					3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
					4 xn-component of xn+y argument ([+-]?\d*n|)
					5 sign of xn-component
					6 x of xn-component
					7 sign of y-component
					8 y of y-component
				*/
				match[1] = match[1].toLowerCase();
	
				if ( match[1].slice( 0, 3 ) === "nth" ) {
					// nth-* requires argument
					if ( !match[3] ) {
						Sizzle.error( match[0] );
					}
	
					// numeric x and y parameters for Expr.filter.CHILD
					// remember that false/true cast respectively to 0/1
					match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
					match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );
	
				// other types prohibit arguments
				} else if ( match[3] ) {
					Sizzle.error( match[0] );
				}
	
				return match;
			},
	
			"PSEUDO": function( match ) {
				var excess,
					unquoted = !match[6] && match[2];
	
				if ( matchExpr["CHILD"].test( match[0] ) ) {
					return null;
				}
	
				// Accept quoted arguments as-is
				if ( match[3] ) {
					match[2] = match[4] || match[5] || "";
	
				// Strip excess characters from unquoted arguments
				} else if ( unquoted && rpseudo.test( unquoted ) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {
	
					// excess is a negative index
					match[0] = match[0].slice( 0, excess );
					match[2] = unquoted.slice( 0, excess );
				}
	
				// Return only captures needed by the pseudo filter method (type and argument)
				return match.slice( 0, 3 );
			}
		},
	
		filter: {
	
			"TAG": function( nodeNameSelector ) {
				var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
				return nodeNameSelector === "*" ?
					function() { return true; } :
					function( elem ) {
						return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
					};
			},
	
			"CLASS": function( className ) {
				var pattern = classCache[ className + " " ];
	
				return pattern ||
					(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
					classCache( className, function( elem ) {
						return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
					});
			},
	
			"ATTR": function( name, operator, check ) {
				return function( elem ) {
					var result = Sizzle.attr( elem, name );
	
					if ( result == null ) {
						return operator === "!=";
					}
					if ( !operator ) {
						return true;
					}
	
					result += "";
	
					return operator === "=" ? result === check :
						operator === "!=" ? result !== check :
						operator === "^=" ? check && result.indexOf( check ) === 0 :
						operator === "*=" ? check && result.indexOf( check ) > -1 :
						operator === "$=" ? check && result.slice( -check.length ) === check :
						operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
						operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
						false;
				};
			},
	
			"CHILD": function( type, what, argument, first, last ) {
				var simple = type.slice( 0, 3 ) !== "nth",
					forward = type.slice( -4 ) !== "last",
					ofType = what === "of-type";
	
				return first === 1 && last === 0 ?
	
					// Shortcut for :nth-*(n)
					function( elem ) {
						return !!elem.parentNode;
					} :
	
					function( elem, context, xml ) {
						var cache, outerCache, node, diff, nodeIndex, start,
							dir = simple !== forward ? "nextSibling" : "previousSibling",
							parent = elem.parentNode,
							name = ofType && elem.nodeName.toLowerCase(),
							useCache = !xml && !ofType;
	
						if ( parent ) {
	
							// :(first|last|only)-(child|of-type)
							if ( simple ) {
								while ( dir ) {
									node = elem;
									while ( (node = node[ dir ]) ) {
										if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
											return false;
										}
									}
									// Reverse direction for :only-* (if we haven't yet done so)
									start = dir = type === "only" && !start && "nextSibling";
								}
								return true;
							}
	
							start = [ forward ? parent.firstChild : parent.lastChild ];
	
							// non-xml :nth-child(...) stores cache data on `parent`
							if ( forward && useCache ) {
								// Seek `elem` from a previously-cached index
								outerCache = parent[ expando ] || (parent[ expando ] = {});
								cache = outerCache[ type ] || [];
								nodeIndex = cache[0] === dirruns && cache[1];
								diff = cache[0] === dirruns && cache[2];
								node = nodeIndex && parent.childNodes[ nodeIndex ];
	
								while ( (node = ++nodeIndex && node && node[ dir ] ||
	
									// Fallback to seeking `elem` from the start
									(diff = nodeIndex = 0) || start.pop()) ) {
	
									// When found, cache indexes on `parent` and break
									if ( node.nodeType === 1 && ++diff && node === elem ) {
										outerCache[ type ] = [ dirruns, nodeIndex, diff ];
										break;
									}
								}
	
							// Use previously-cached element index if available
							} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
								diff = cache[1];
	
							// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
							} else {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {
	
									if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
										// Cache the index of each encountered element
										if ( useCache ) {
											(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
										}
	
										if ( node === elem ) {
											break;
										}
									}
								}
							}
	
							// Incorporate the offset, then check against cycle size
							diff -= last;
							return diff === first || ( diff % first === 0 && diff / first >= 0 );
						}
					};
			},
	
			"PSEUDO": function( pseudo, argument ) {
				// pseudo-class names are case-insensitive
				// http://www.w3.org/TR/selectors/#pseudo-classes
				// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
				// Remember that setFilters inherits from pseudos
				var args,
					fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
						Sizzle.error( "unsupported pseudo: " + pseudo );
	
				// The user may use createPseudo to indicate that
				// arguments are needed to create the filter function
				// just as Sizzle does
				if ( fn[ expando ] ) {
					return fn( argument );
				}
	
				// But maintain support for old signatures
				if ( fn.length > 1 ) {
					args = [ pseudo, pseudo, "", argument ];
					return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
						markFunction(function( seed, matches ) {
							var idx,
								matched = fn( seed, argument ),
								i = matched.length;
							while ( i-- ) {
								idx = indexOf( seed, matched[i] );
								seed[ idx ] = !( matches[ idx ] = matched[i] );
							}
						}) :
						function( elem ) {
							return fn( elem, 0, args );
						};
				}
	
				return fn;
			}
		},
	
		pseudos: {
			// Potentially complex pseudos
			"not": markFunction(function( selector ) {
				// Trim the selector passed to compile
				// to avoid treating leading and trailing
				// spaces as combinators
				var input = [],
					results = [],
					matcher = compile( selector.replace( rtrim, "$1" ) );
	
				return matcher[ expando ] ?
					markFunction(function( seed, matches, context, xml ) {
						var elem,
							unmatched = matcher( seed, null, xml, [] ),
							i = seed.length;
	
						// Match elements unmatched by `matcher`
						while ( i-- ) {
							if ( (elem = unmatched[i]) ) {
								seed[i] = !(matches[i] = elem);
							}
						}
					}) :
					function( elem, context, xml ) {
						input[0] = elem;
						matcher( input, null, xml, results );
						// Don't keep the element (issue #299)
						input[0] = null;
						return !results.pop();
					};
			}),
	
			"has": markFunction(function( selector ) {
				return function( elem ) {
					return Sizzle( selector, elem ).length > 0;
				};
			}),
	
			"contains": markFunction(function( text ) {
				text = text.replace( runescape, funescape );
				return function( elem ) {
					return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
				};
			}),
	
			// "Whether an element is represented by a :lang() selector
			// is based solely on the element's language value
			// being equal to the identifier C,
			// or beginning with the identifier C immediately followed by "-".
			// The matching of C against the element's language value is performed case-insensitively.
			// The identifier C does not have to be a valid language name."
			// http://www.w3.org/TR/selectors/#lang-pseudo
			"lang": markFunction( function( lang ) {
				// lang value must be a valid identifier
				if ( !ridentifier.test(lang || "") ) {
					Sizzle.error( "unsupported lang: " + lang );
				}
				lang = lang.replace( runescape, funescape ).toLowerCase();
				return function( elem ) {
					var elemLang;
					do {
						if ( (elemLang = documentIsHTML ?
							elem.lang :
							elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {
	
							elemLang = elemLang.toLowerCase();
							return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
						}
					} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
					return false;
				};
			}),
	
			// Miscellaneous
			"target": function( elem ) {
				var hash = window.location && window.location.hash;
				return hash && hash.slice( 1 ) === elem.id;
			},
	
			"root": function( elem ) {
				return elem === docElem;
			},
	
			"focus": function( elem ) {
				return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
			},
	
			// Boolean properties
			"enabled": function( elem ) {
				return elem.disabled === false;
			},
	
			"disabled": function( elem ) {
				return elem.disabled === true;
			},
	
			"checked": function( elem ) {
				// In CSS3, :checked should return both checked and selected elements
				// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
				var nodeName = elem.nodeName.toLowerCase();
				return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
			},
	
			"selected": function( elem ) {
				// Accessing this property makes selected-by-default
				// options in Safari work properly
				if ( elem.parentNode ) {
					elem.parentNode.selectedIndex;
				}
	
				return elem.selected === true;
			},
	
			// Contents
			"empty": function( elem ) {
				// http://www.w3.org/TR/selectors/#empty-pseudo
				// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
				//   but not by others (comment: 8; processing instruction: 7; etc.)
				// nodeType < 6 works because attributes (2) do not appear as children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					if ( elem.nodeType < 6 ) {
						return false;
					}
				}
				return true;
			},
	
			"parent": function( elem ) {
				return !Expr.pseudos["empty"]( elem );
			},
	
			// Element/input types
			"header": function( elem ) {
				return rheader.test( elem.nodeName );
			},
	
			"input": function( elem ) {
				return rinputs.test( elem.nodeName );
			},
	
			"button": function( elem ) {
				var name = elem.nodeName.toLowerCase();
				return name === "input" && elem.type === "button" || name === "button";
			},
	
			"text": function( elem ) {
				var attr;
				return elem.nodeName.toLowerCase() === "input" &&
					elem.type === "text" &&
	
					// Support: IE<8
					// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
					( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
			},
	
			// Position-in-collection
			"first": createPositionalPseudo(function() {
				return [ 0 ];
			}),
	
			"last": createPositionalPseudo(function( matchIndexes, length ) {
				return [ length - 1 ];
			}),
	
			"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
				return [ argument < 0 ? argument + length : argument ];
			}),
	
			"even": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 0;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"odd": createPositionalPseudo(function( matchIndexes, length ) {
				var i = 1;
				for ( ; i < length; i += 2 ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; --i >= 0; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			}),
	
			"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
				var i = argument < 0 ? argument + length : argument;
				for ( ; ++i < length; ) {
					matchIndexes.push( i );
				}
				return matchIndexes;
			})
		}
	};
	
	Expr.pseudos["nth"] = Expr.pseudos["eq"];
	
	// Add button/input type pseudos
	for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
		Expr.pseudos[ i ] = createInputPseudo( i );
	}
	for ( i in { submit: true, reset: true } ) {
		Expr.pseudos[ i ] = createButtonPseudo( i );
	}
	
	// Easy API for creating new setFilters
	function setFilters() {}
	setFilters.prototype = Expr.filters = Expr.pseudos;
	Expr.setFilters = new setFilters();
	
	tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
		var matched, match, tokens, type,
			soFar, groups, preFilters,
			cached = tokenCache[ selector + " " ];
	
		if ( cached ) {
			return parseOnly ? 0 : cached.slice( 0 );
		}
	
		soFar = selector;
		groups = [];
		preFilters = Expr.preFilter;
	
		while ( soFar ) {
	
			// Comma and first run
			if ( !matched || (match = rcomma.exec( soFar )) ) {
				if ( match ) {
					// Don't consume trailing commas as valid
					soFar = soFar.slice( match[0].length ) || soFar;
				}
				groups.push( (tokens = []) );
			}
	
			matched = false;
	
			// Combinators
			if ( (match = rcombinators.exec( soFar )) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					// Cast descendant combinators to space
					type: match[0].replace( rtrim, " " )
				});
				soFar = soFar.slice( matched.length );
			}
	
			// Filters
			for ( type in Expr.filter ) {
				if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
					(match = preFilters[ type ]( match ))) ) {
					matched = match.shift();
					tokens.push({
						value: matched,
						type: type,
						matches: match
					});
					soFar = soFar.slice( matched.length );
				}
			}
	
			if ( !matched ) {
				break;
			}
		}
	
		// Return the length of the invalid excess
		// if we're just parsing
		// Otherwise, throw an error or return tokens
		return parseOnly ?
			soFar.length :
			soFar ?
				Sizzle.error( selector ) :
				// Cache the tokens
				tokenCache( selector, groups ).slice( 0 );
	};
	
	function toSelector( tokens ) {
		var i = 0,
			len = tokens.length,
			selector = "";
		for ( ; i < len; i++ ) {
			selector += tokens[i].value;
		}
		return selector;
	}
	
	function addCombinator( matcher, combinator, base ) {
		var dir = combinator.dir,
			checkNonElements = base && dir === "parentNode",
			doneName = done++;
	
		return combinator.first ?
			// Check against closest ancestor/preceding element
			function( elem, context, xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						return matcher( elem, context, xml );
					}
				}
			} :
	
			// Check against all ancestor/preceding elements
			function( elem, context, xml ) {
				var oldCache, outerCache,
					newCache = [ dirruns, doneName ];
	
				// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
				if ( xml ) {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							if ( matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				} else {
					while ( (elem = elem[ dir ]) ) {
						if ( elem.nodeType === 1 || checkNonElements ) {
							outerCache = elem[ expando ] || (elem[ expando ] = {});
							if ( (oldCache = outerCache[ dir ]) &&
								oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {
	
								// Assign to newCache so results back-propagate to previous elements
								return (newCache[ 2 ] = oldCache[ 2 ]);
							} else {
								// Reuse newcache so results back-propagate to previous elements
								outerCache[ dir ] = newCache;
	
								// A match means we're done; a fail means we have to keep checking
								if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
									return true;
								}
							}
						}
					}
				}
			};
	}
	
	function elementMatcher( matchers ) {
		return matchers.length > 1 ?
			function( elem, context, xml ) {
				var i = matchers.length;
				while ( i-- ) {
					if ( !matchers[i]( elem, context, xml ) ) {
						return false;
					}
				}
				return true;
			} :
			matchers[0];
	}
	
	function multipleContexts( selector, contexts, results ) {
		var i = 0,
			len = contexts.length;
		for ( ; i < len; i++ ) {
			Sizzle( selector, contexts[i], results );
		}
		return results;
	}
	
	function condense( unmatched, map, filter, context, xml ) {
		var elem,
			newUnmatched = [],
			i = 0,
			len = unmatched.length,
			mapped = map != null;
	
		for ( ; i < len; i++ ) {
			if ( (elem = unmatched[i]) ) {
				if ( !filter || filter( elem, context, xml ) ) {
					newUnmatched.push( elem );
					if ( mapped ) {
						map.push( i );
					}
				}
			}
		}
	
		return newUnmatched;
	}
	
	function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
		if ( postFilter && !postFilter[ expando ] ) {
			postFilter = setMatcher( postFilter );
		}
		if ( postFinder && !postFinder[ expando ] ) {
			postFinder = setMatcher( postFinder, postSelector );
		}
		return markFunction(function( seed, results, context, xml ) {
			var temp, i, elem,
				preMap = [],
				postMap = [],
				preexisting = results.length,
	
				// Get initial elements from seed or context
				elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),
	
				// Prefilter to get matcher input, preserving a map for seed-results synchronization
				matcherIn = preFilter && ( seed || !selector ) ?
					condense( elems, preMap, preFilter, context, xml ) :
					elems,
	
				matcherOut = matcher ?
					// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
					postFinder || ( seed ? preFilter : preexisting || postFilter ) ?
	
						// ...intermediate processing is necessary
						[] :
	
						// ...otherwise use results directly
						results :
					matcherIn;
	
			// Find primary matches
			if ( matcher ) {
				matcher( matcherIn, matcherOut, context, xml );
			}
	
			// Apply postFilter
			if ( postFilter ) {
				temp = condense( matcherOut, postMap );
				postFilter( temp, [], context, xml );
	
				// Un-match failing elements by moving them back to matcherIn
				i = temp.length;
				while ( i-- ) {
					if ( (elem = temp[i]) ) {
						matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
					}
				}
			}
	
			if ( seed ) {
				if ( postFinder || preFilter ) {
					if ( postFinder ) {
						// Get the final matcherOut by condensing this intermediate into postFinder contexts
						temp = [];
						i = matcherOut.length;
						while ( i-- ) {
							if ( (elem = matcherOut[i]) ) {
								// Restore matcherIn since elem is not yet a final match
								temp.push( (matcherIn[i] = elem) );
							}
						}
						postFinder( null, (matcherOut = []), temp, xml );
					}
	
					// Move matched elements from seed to results to keep them synchronized
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) &&
							(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {
	
							seed[temp] = !(results[temp] = elem);
						}
					}
				}
	
			// Add elements to results, through postFinder if defined
			} else {
				matcherOut = condense(
					matcherOut === results ?
						matcherOut.splice( preexisting, matcherOut.length ) :
						matcherOut
				);
				if ( postFinder ) {
					postFinder( null, results, matcherOut, xml );
				} else {
					push.apply( results, matcherOut );
				}
			}
		});
	}
	
	function matcherFromTokens( tokens ) {
		var checkContext, matcher, j,
			len = tokens.length,
			leadingRelative = Expr.relative[ tokens[0].type ],
			implicitRelative = leadingRelative || Expr.relative[" "],
			i = leadingRelative ? 1 : 0,
	
			// The foundational matcher ensures that elements are reachable from top-level context(s)
			matchContext = addCombinator( function( elem ) {
				return elem === checkContext;
			}, implicitRelative, true ),
			matchAnyContext = addCombinator( function( elem ) {
				return indexOf( checkContext, elem ) > -1;
			}, implicitRelative, true ),
			matchers = [ function( elem, context, xml ) {
				var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					(checkContext = context).nodeType ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml ) );
				// Avoid hanging onto element (issue #299)
				checkContext = null;
				return ret;
			} ];
	
		for ( ; i < len; i++ ) {
			if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
				matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
			} else {
				matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );
	
				// Return special upon seeing a positional matcher
				if ( matcher[ expando ] ) {
					// Find the next relative operator (if any) for proper handling
					j = ++i;
					for ( ; j < len; j++ ) {
						if ( Expr.relative[ tokens[j].type ] ) {
							break;
						}
					}
					return setMatcher(
						i > 1 && elementMatcher( matchers ),
						i > 1 && toSelector(
							// If the preceding token was a descendant combinator, insert an implicit any-element `*`
							tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
						).replace( rtrim, "$1" ),
						matcher,
						i < j && matcherFromTokens( tokens.slice( i, j ) ),
						j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
						j < len && toSelector( tokens )
					);
				}
				matchers.push( matcher );
			}
		}
	
		return elementMatcher( matchers );
	}
	
	function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
		var bySet = setMatchers.length > 0,
			byElement = elementMatchers.length > 0,
			superMatcher = function( seed, context, xml, results, outermost ) {
				var elem, j, matcher,
					matchedCount = 0,
					i = "0",
					unmatched = seed && [],
					setMatched = [],
					contextBackup = outermostContext,
					// We must always have either seed elements or outermost context
					elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
					// Use integer dirruns iff this is the outermost matcher
					dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
					len = elems.length;
	
				if ( outermost ) {
					outermostContext = context !== document && context;
				}
	
				// Add elements passing elementMatchers directly to results
				// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
				// Support: IE<9, Safari
				// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
				for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
					if ( byElement && elem ) {
						j = 0;
						while ( (matcher = elementMatchers[j++]) ) {
							if ( matcher( elem, context, xml ) ) {
								results.push( elem );
								break;
							}
						}
						if ( outermost ) {
							dirruns = dirrunsUnique;
						}
					}
	
					// Track unmatched elements for set filters
					if ( bySet ) {
						// They will have gone through all possible matchers
						if ( (elem = !matcher && elem) ) {
							matchedCount--;
						}
	
						// Lengthen the array for every element, matched or not
						if ( seed ) {
							unmatched.push( elem );
						}
					}
				}
	
				// Apply set filters to unmatched elements
				matchedCount += i;
				if ( bySet && i !== matchedCount ) {
					j = 0;
					while ( (matcher = setMatchers[j++]) ) {
						matcher( unmatched, setMatched, context, xml );
					}
	
					if ( seed ) {
						// Reintegrate element matches to eliminate the need for sorting
						if ( matchedCount > 0 ) {
							while ( i-- ) {
								if ( !(unmatched[i] || setMatched[i]) ) {
									setMatched[i] = pop.call( results );
								}
							}
						}
	
						// Discard index placeholder values to get only actual matches
						setMatched = condense( setMatched );
					}
	
					// Add matches to results
					push.apply( results, setMatched );
	
					// Seedless set matches succeeding multiple successful matchers stipulate sorting
					if ( outermost && !seed && setMatched.length > 0 &&
						( matchedCount + setMatchers.length ) > 1 ) {
	
						Sizzle.uniqueSort( results );
					}
				}
	
				// Override manipulation of globals by nested matchers
				if ( outermost ) {
					dirruns = dirrunsUnique;
					outermostContext = contextBackup;
				}
	
				return unmatched;
			};
	
		return bySet ?
			markFunction( superMatcher ) :
			superMatcher;
	}
	
	compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
		var i,
			setMatchers = [],
			elementMatchers = [],
			cached = compilerCache[ selector + " " ];
	
		if ( !cached ) {
			// Generate a function of recursive functions that can be used to check each element
			if ( !match ) {
				match = tokenize( selector );
			}
			i = match.length;
			while ( i-- ) {
				cached = matcherFromTokens( match[i] );
				if ( cached[ expando ] ) {
					setMatchers.push( cached );
				} else {
					elementMatchers.push( cached );
				}
			}
	
			// Cache the compiled function
			cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	
			// Save selector and tokenization
			cached.selector = selector;
		}
		return cached;
	};
	
	/**
	 * A low-level selection function that works with Sizzle's compiled
	 *  selector functions
	 * @param {String|Function} selector A selector or a pre-compiled
	 *  selector function built with Sizzle.compile
	 * @param {Element} context
	 * @param {Array} [results]
	 * @param {Array} [seed] A set of elements to match against
	 */
	select = Sizzle.select = function( selector, context, results, seed ) {
		var i, tokens, token, type, find,
			compiled = typeof selector === "function" && selector,
			match = !seed && tokenize( (selector = compiled.selector || selector) );
	
		results = results || [];
	
		// Try to minimize operations if there is no seed and only one group
		if ( match.length === 1 ) {
	
			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {
	
				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
	
				// Precompiled matchers will still verify ancestry, so step up a level
				} else if ( compiled ) {
					context = context.parentNode;
				}
	
				selector = selector.slice( tokens.shift().value.length );
			}
	
			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];
	
				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
					)) ) {
	
						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}
	
						break;
					}
				}
			}
		}
	
		// Compile and execute a filtering function if one is not provided
		// Provide `match` to avoid retokenization if we modified the selector above
		( compiled || compile( selector, match ) )(
			seed,
			context,
			!documentIsHTML,
			results,
			rsibling.test( selector ) && testContext( context.parentNode ) || context
		);
		return results;
	};
	
	// One-time assignments
	
	// Sort stability
	support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;
	
	// Support: Chrome 14-35+
	// Always assume duplicates if they aren't passed to the comparison function
	support.detectDuplicates = !!hasDuplicate;
	
	// Initialize against the default document
	setDocument();
	
	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});
	
	// Support: IE<8
	// Prevent attribute/property "interpolation"
	// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
	if ( !assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild.getAttribute("href") === "#" ;
	}) ) {
		addHandle( "type|href|height|width", function( elem, name, isXML ) {
			if ( !isXML ) {
				return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
			}
		});
	}
	
	// Support: IE<9
	// Use defaultValue in place of getAttribute("value")
	if ( !support.attributes || !assert(function( div ) {
		div.innerHTML = "<input/>";
		div.firstChild.setAttribute( "value", "" );
		return div.firstChild.getAttribute( "value" ) === "";
	}) ) {
		addHandle( "value", function( elem, name, isXML ) {
			if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
				return elem.defaultValue;
			}
		});
	}
	
	// Support: IE<9
	// Use getAttributeNode to fetch booleans when getAttribute lies
	if ( !assert(function( div ) {
		return div.getAttribute("disabled") == null;
	}) ) {
		addHandle( booleans, function( elem, name, isXML ) {
			var val;
			if ( !isXML ) {
				return elem[ name ] === true ? name.toLowerCase() :
						(val = elem.getAttributeNode( name )) && val.specified ?
						val.value :
					null;
			}
		});
	}
	
	return Sizzle;
	
	})( window );
	
	
	
	jQuery.find = Sizzle;
	jQuery.expr = Sizzle.selectors;
	jQuery.expr[":"] = jQuery.expr.pseudos;
	jQuery.unique = Sizzle.uniqueSort;
	jQuery.text = Sizzle.getText;
	jQuery.isXMLDoc = Sizzle.isXML;
	jQuery.contains = Sizzle.contains;
	
	
	
	var rneedsContext = jQuery.expr.match.needsContext;
	
	var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);
	
	
	
	var risSimple = /^.[^:#\[\.,]*$/;
	
	// Implement the identical functionality for filter and not
	function winnow( elements, qualifier, not ) {
		if ( jQuery.isFunction( qualifier ) ) {
			return jQuery.grep( elements, function( elem, i ) {
				/* jshint -W018 */
				return !!qualifier.call( elem, i, elem ) !== not;
			});
	
		}
	
		if ( qualifier.nodeType ) {
			return jQuery.grep( elements, function( elem ) {
				return ( elem === qualifier ) !== not;
			});
	
		}
	
		if ( typeof qualifier === "string" ) {
			if ( risSimple.test( qualifier ) ) {
				return jQuery.filter( qualifier, elements, not );
			}
	
			qualifier = jQuery.filter( qualifier, elements );
		}
	
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
		});
	}
	
	jQuery.filter = function( expr, elems, not ) {
		var elem = elems[ 0 ];
	
		if ( not ) {
			expr = ":not(" + expr + ")";
		}
	
		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	};
	
	jQuery.fn.extend({
		find: function( selector ) {
			var i,
				len = this.length,
				ret = [],
				self = this;
	
			if ( typeof selector !== "string" ) {
				return this.pushStack( jQuery( selector ).filter(function() {
					for ( i = 0; i < len; i++ ) {
						if ( jQuery.contains( self[ i ], this ) ) {
							return true;
						}
					}
				}) );
			}
	
			for ( i = 0; i < len; i++ ) {
				jQuery.find( selector, self[ i ], ret );
			}
	
			// Needed because $( selector, context ) becomes $( context ).find( selector )
			ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
			ret.selector = this.selector ? this.selector + " " + selector : selector;
			return ret;
		},
		filter: function( selector ) {
			return this.pushStack( winnow(this, selector || [], false) );
		},
		not: function( selector ) {
			return this.pushStack( winnow(this, selector || [], true) );
		},
		is: function( selector ) {
			return !!winnow(
				this,
	
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				typeof selector === "string" && rneedsContext.test( selector ) ?
					jQuery( selector ) :
					selector || [],
				false
			).length;
		}
	});
	
	
	// Initialize a jQuery object
	
	
	// A central reference to the root jQuery(document)
	var rootjQuery,
	
		// A simple way to check for HTML strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		// Strict HTML recognition (#11290: must start with <)
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
	
		init = jQuery.fn.init = function( selector, context ) {
			var match, elem;
	
			// HANDLE: $(""), $(null), $(undefined), $(false)
			if ( !selector ) {
				return this;
			}
	
			// Handle HTML strings
			if ( typeof selector === "string" ) {
				if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
					// Assume that strings that start and end with <> are HTML and skip the regex check
					match = [ null, selector, null ];
	
				} else {
					match = rquickExpr.exec( selector );
				}
	
				// Match html or make sure no context is specified for #id
				if ( match && (match[1] || !context) ) {
	
					// HANDLE: $(html) -> $(array)
					if ( match[1] ) {
						context = context instanceof jQuery ? context[0] : context;
	
						// Option to run scripts is true for back-compat
						// Intentionally let the error be thrown if parseHTML is not present
						jQuery.merge( this, jQuery.parseHTML(
							match[1],
							context && context.nodeType ? context.ownerDocument || context : document,
							true
						) );
	
						// HANDLE: $(html, props)
						if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
							for ( match in context ) {
								// Properties of context are called as methods if possible
								if ( jQuery.isFunction( this[ match ] ) ) {
									this[ match ]( context[ match ] );
	
								// ...and otherwise set as attributes
								} else {
									this.attr( match, context[ match ] );
								}
							}
						}
	
						return this;
	
					// HANDLE: $(#id)
					} else {
						elem = document.getElementById( match[2] );
	
						// Support: Blackberry 4.6
						// gEBID returns nodes no longer in the document (#6963)
						if ( elem && elem.parentNode ) {
							// Inject the element directly into the jQuery object
							this.length = 1;
							this[0] = elem;
						}
	
						this.context = document;
						this.selector = selector;
						return this;
					}
	
				// HANDLE: $(expr, $(...))
				} else if ( !context || context.jquery ) {
					return ( context || rootjQuery ).find( selector );
	
				// HANDLE: $(expr, context)
				// (which is just equivalent to: $(context).find(expr)
				} else {
					return this.constructor( context ).find( selector );
				}
	
			// HANDLE: $(DOMElement)
			} else if ( selector.nodeType ) {
				this.context = this[0] = selector;
				this.length = 1;
				return this;
	
			// HANDLE: $(function)
			// Shortcut for document ready
			} else if ( jQuery.isFunction( selector ) ) {
				return typeof rootjQuery.ready !== "undefined" ?
					rootjQuery.ready( selector ) :
					// Execute immediately if ready is not present
					selector( jQuery );
			}
	
			if ( selector.selector !== undefined ) {
				this.selector = selector.selector;
				this.context = selector.context;
			}
	
			return jQuery.makeArray( selector, this );
		};
	
	// Give the init function the jQuery prototype for later instantiation
	init.prototype = jQuery.fn;
	
	// Initialize central reference
	rootjQuery = jQuery( document );
	
	
	var rparentsprev = /^(?:parents|prev(?:Until|All))/,
		// Methods guaranteed to produce a unique set when starting from a unique set
		guaranteedUnique = {
			children: true,
			contents: true,
			next: true,
			prev: true
		};
	
	jQuery.extend({
		dir: function( elem, dir, until ) {
			var matched = [],
				truncate = until !== undefined;
	
			while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
				if ( elem.nodeType === 1 ) {
					if ( truncate && jQuery( elem ).is( until ) ) {
						break;
					}
					matched.push( elem );
				}
			}
			return matched;
		},
	
		sibling: function( n, elem ) {
			var matched = [];
	
			for ( ; n; n = n.nextSibling ) {
				if ( n.nodeType === 1 && n !== elem ) {
					matched.push( n );
				}
			}
	
			return matched;
		}
	});
	
	jQuery.fn.extend({
		has: function( target ) {
			var targets = jQuery( target, this ),
				l = targets.length;
	
			return this.filter(function() {
				var i = 0;
				for ( ; i < l; i++ ) {
					if ( jQuery.contains( this, targets[i] ) ) {
						return true;
					}
				}
			});
		},
	
		closest: function( selectors, context ) {
			var cur,
				i = 0,
				l = this.length,
				matched = [],
				pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
					jQuery( selectors, context || this.context ) :
					0;
	
			for ( ; i < l; i++ ) {
				for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
					// Always skip document fragments
					if ( cur.nodeType < 11 && (pos ?
						pos.index(cur) > -1 :
	
						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector(cur, selectors)) ) {
	
						matched.push( cur );
						break;
					}
				}
			}
	
			return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
		},
	
		// Determine the position of an element within the set
		index: function( elem ) {
	
			// No argument, return index in parent
			if ( !elem ) {
				return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
			}
	
			// Index in selector
			if ( typeof elem === "string" ) {
				return indexOf.call( jQuery( elem ), this[ 0 ] );
			}
	
			// Locate the position of the desired element
			return indexOf.call( this,
	
				// If it receives a jQuery object, the first element is used
				elem.jquery ? elem[ 0 ] : elem
			);
		},
	
		add: function( selector, context ) {
			return this.pushStack(
				jQuery.unique(
					jQuery.merge( this.get(), jQuery( selector, context ) )
				)
			);
		},
	
		addBack: function( selector ) {
			return this.add( selector == null ?
				this.prevObject : this.prevObject.filter(selector)
			);
		}
	});
	
	function sibling( cur, dir ) {
		while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
		return cur;
	}
	
	jQuery.each({
		parent: function( elem ) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) {
			return jQuery.dir( elem, "parentNode" );
		},
		parentsUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "parentNode", until );
		},
		next: function( elem ) {
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) {
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) {
			return jQuery.dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) {
			return jQuery.dir( elem, "previousSibling" );
		},
		nextUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "previousSibling", until );
		},
		siblings: function( elem ) {
			return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
		},
		children: function( elem ) {
			return jQuery.sibling( elem.firstChild );
		},
		contents: function( elem ) {
			return elem.contentDocument || jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		jQuery.fn[ name ] = function( until, selector ) {
			var matched = jQuery.map( this, fn, until );
	
			if ( name.slice( -5 ) !== "Until" ) {
				selector = until;
			}
	
			if ( selector && typeof selector === "string" ) {
				matched = jQuery.filter( selector, matched );
			}
	
			if ( this.length > 1 ) {
				// Remove duplicates
				if ( !guaranteedUnique[ name ] ) {
					jQuery.unique( matched );
				}
	
				// Reverse order for parents* and prev-derivatives
				if ( rparentsprev.test( name ) ) {
					matched.reverse();
				}
			}
	
			return this.pushStack( matched );
		};
	});
	var rnotwhite = (/\S+/g);
	
	
	
	// String to Object options format cache
	var optionsCache = {};
	
	// Convert String-formatted options into Object-formatted ones and store in cache
	function createOptions( options ) {
		var object = optionsCache[ options ] = {};
		jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
			object[ flag ] = true;
		});
		return object;
	}
	
	/*
	 * Create a callback list using the following parameters:
	 *
	 *	options: an optional list of space-separated options that will change how
	 *			the callback list behaves or a more traditional option object
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible options:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function( options ) {
	
		// Convert options from String-formatted to Object-formatted if needed
		// (we check in cache first)
		options = typeof options === "string" ?
			( optionsCache[ options ] || createOptions( options ) ) :
			jQuery.extend( {}, options );
	
		var // Last fire value (for non-forgettable lists)
			memory,
			// Flag to know if list was already fired
			fired,
			// Flag to know if list is currently firing
			firing,
			// First callback to fire (used internally by add and fireWith)
			firingStart,
			// End of the loop when firing
			firingLength,
			// Index of currently firing callback (modified by remove if needed)
			firingIndex,
			// Actual callback list
			list = [],
			// Stack of fire calls for repeatable lists
			stack = !options.once && [],
			// Fire callbacks
			fire = function( data ) {
				memory = options.memory && data;
				fired = true;
				firingIndex = firingStart || 0;
				firingStart = 0;
				firingLength = list.length;
				firing = true;
				for ( ; list && firingIndex < firingLength; firingIndex++ ) {
					if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
						memory = false; // To prevent further calls using add
						break;
					}
				}
				firing = false;
				if ( list ) {
					if ( stack ) {
						if ( stack.length ) {
							fire( stack.shift() );
						}
					} else if ( memory ) {
						list = [];
					} else {
						self.disable();
					}
				}
			},
			// Actual Callbacks object
			self = {
				// Add a callback or a collection of callbacks to the list
				add: function() {
					if ( list ) {
						// First, we save the current length
						var start = list.length;
						(function add( args ) {
							jQuery.each( args, function( _, arg ) {
								var type = jQuery.type( arg );
								if ( type === "function" ) {
									if ( !options.unique || !self.has( arg ) ) {
										list.push( arg );
									}
								} else if ( arg && arg.length && type !== "string" ) {
									// Inspect recursively
									add( arg );
								}
							});
						})( arguments );
						// Do we need to add the callbacks to the
						// current firing batch?
						if ( firing ) {
							firingLength = list.length;
						// With memory, if we're not firing then
						// we should call right away
						} else if ( memory ) {
							firingStart = start;
							fire( memory );
						}
					}
					return this;
				},
				// Remove a callback from the list
				remove: function() {
					if ( list ) {
						jQuery.each( arguments, function( _, arg ) {
							var index;
							while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
								list.splice( index, 1 );
								// Handle firing indexes
								if ( firing ) {
									if ( index <= firingLength ) {
										firingLength--;
									}
									if ( index <= firingIndex ) {
										firingIndex--;
									}
								}
							}
						});
					}
					return this;
				},
				// Check if a given callback is in the list.
				// If no argument is given, return whether or not list has callbacks attached.
				has: function( fn ) {
					return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
				},
				// Remove all callbacks from the list
				empty: function() {
					list = [];
					firingLength = 0;
					return this;
				},
				// Have the list do nothing anymore
				disable: function() {
					list = stack = memory = undefined;
					return this;
				},
				// Is it disabled?
				disabled: function() {
					return !list;
				},
				// Lock the list in its current state
				lock: function() {
					stack = undefined;
					if ( !memory ) {
						self.disable();
					}
					return this;
				},
				// Is it locked?
				locked: function() {
					return !stack;
				},
				// Call all callbacks with the given context and arguments
				fireWith: function( context, args ) {
					if ( list && ( !fired || stack ) ) {
						args = args || [];
						args = [ context, args.slice ? args.slice() : args ];
						if ( firing ) {
							stack.push( args );
						} else {
							fire( args );
						}
					}
					return this;
				},
				// Call all the callbacks with the given arguments
				fire: function() {
					self.fireWith( this, arguments );
					return this;
				},
				// To know if the callbacks have already been called at least once
				fired: function() {
					return !!fired;
				}
			};
	
		return self;
	};
	
	
	jQuery.extend({
	
		Deferred: function( func ) {
			var tuples = [
					// action, add listener, listener list, final state
					[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
					[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
					[ "notify", "progress", jQuery.Callbacks("memory") ]
				],
				state = "pending",
				promise = {
					state: function() {
						return state;
					},
					always: function() {
						deferred.done( arguments ).fail( arguments );
						return this;
					},
					then: function( /* fnDone, fnFail, fnProgress */ ) {
						var fns = arguments;
						return jQuery.Deferred(function( newDefer ) {
							jQuery.each( tuples, function( i, tuple ) {
								var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
								// deferred[ done | fail | progress ] for forwarding actions to newDefer
								deferred[ tuple[1] ](function() {
									var returned = fn && fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
									}
								});
							});
							fns = null;
						}).promise();
					},
					// Get a promise for this deferred
					// If obj is provided, the promise aspect is added to the object
					promise: function( obj ) {
						return obj != null ? jQuery.extend( obj, promise ) : promise;
					}
				},
				deferred = {};
	
			// Keep pipe for back-compat
			promise.pipe = promise.then;
	
			// Add list-specific methods
			jQuery.each( tuples, function( i, tuple ) {
				var list = tuple[ 2 ],
					stateString = tuple[ 3 ];
	
				// promise[ done | fail | progress ] = list.add
				promise[ tuple[1] ] = list.add;
	
				// Handle state
				if ( stateString ) {
					list.add(function() {
						// state = [ resolved | rejected ]
						state = stateString;
	
					// [ reject_list | resolve_list ].disable; progress_list.lock
					}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
				}
	
				// deferred[ resolve | reject | notify ]
				deferred[ tuple[0] ] = function() {
					deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
					return this;
				};
				deferred[ tuple[0] + "With" ] = list.fireWith;
			});
	
			// Make the deferred a promise
			promise.promise( deferred );
	
			// Call given func if any
			if ( func ) {
				func.call( deferred, deferred );
			}
	
			// All done!
			return deferred;
		},
	
		// Deferred helper
		when: function( subordinate /* , ..., subordinateN */ ) {
			var i = 0,
				resolveValues = slice.call( arguments ),
				length = resolveValues.length,
	
				// the count of uncompleted subordinates
				remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,
	
				// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),
	
				// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ) {
					return function( value ) {
						contexts[ i ] = this;
						values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
						if ( values === progressValues ) {
							deferred.notifyWith( contexts, values );
						} else if ( !( --remaining ) ) {
							deferred.resolveWith( contexts, values );
						}
					};
				},
	
				progressValues, progressContexts, resolveContexts;
	
			// Add listeners to Deferred subordinates; treat others as resolved
			if ( length > 1 ) {
				progressValues = new Array( length );
				progressContexts = new Array( length );
				resolveContexts = new Array( length );
				for ( ; i < length; i++ ) {
					if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
						resolveValues[ i ].promise()
							.done( updateFunc( i, resolveContexts, resolveValues ) )
							.fail( deferred.reject )
							.progress( updateFunc( i, progressContexts, progressValues ) );
					} else {
						--remaining;
					}
				}
			}
	
			// If we're not waiting on anything, resolve the master
			if ( !remaining ) {
				deferred.resolveWith( resolveContexts, resolveValues );
			}
	
			return deferred.promise();
		}
	});
	
	
	// The deferred used on DOM ready
	var readyList;
	
	jQuery.fn.ready = function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );
	
		return this;
	};
	
	jQuery.extend({
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,
	
		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,
	
		// Hold (or release) the ready event
		holdReady: function( hold ) {
			if ( hold ) {
				jQuery.readyWait++;
			} else {
				jQuery.ready( true );
			}
		},
	
		// Handle when the DOM is ready
		ready: function( wait ) {
	
			// Abort if there are pending holds or we're already ready
			if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
				return;
			}
	
			// Remember that the DOM is ready
			jQuery.isReady = true;
	
			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}
	
			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );
	
			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
				jQuery( document ).off( "ready" );
			}
		}
	});
	
	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	}
	
	jQuery.ready.promise = function( obj ) {
		if ( !readyList ) {
	
			readyList = jQuery.Deferred();
	
			// Catch cases where $(document).ready() is called after the browser event has already occurred.
			// We once tried to use readyState "interactive" here, but it caused issues like the one
			// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
			if ( document.readyState === "complete" ) {
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				setTimeout( jQuery.ready );
	
			} else {
	
				// Use the handy event callback
				document.addEventListener( "DOMContentLoaded", completed, false );
	
				// A fallback to window.onload, that will always work
				window.addEventListener( "load", completed, false );
			}
		}
		return readyList.promise( obj );
	};
	
	// Kick off the DOM ready check even if the user does not
	jQuery.ready.promise();
	
	
	
	
	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			len = elems.length,
			bulk = key == null;
	
		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}
	
		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;
	
			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}
	
			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;
	
				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}
	
			if ( fn ) {
				for ( ; i < len; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}
	
		return chainable ?
			elems :
	
			// Gets
			bulk ?
				fn.call( elems ) :
				len ? fn( elems[0], key ) : emptyGet;
	};
	
	
	/**
	 * Determines whether an object can have data
	 */
	jQuery.acceptData = function( owner ) {
		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		/* jshint -W018 */
		return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
	};
	
	
	function Data() {
		// Support: Android<4,
		// Old WebKit does not have Object.preventExtensions/freeze method,
		// return new empty object instead with no [[set]] accessor
		Object.defineProperty( this.cache = {}, 0, {
			get: function() {
				return {};
			}
		});
	
		this.expando = jQuery.expando + Data.uid++;
	}
	
	Data.uid = 1;
	Data.accepts = jQuery.acceptData;
	
	Data.prototype = {
		key: function( owner ) {
			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return the key for a frozen object.
			if ( !Data.accepts( owner ) ) {
				return 0;
			}
	
			var descriptor = {},
				// Check if the owner object already has a cache key
				unlock = owner[ this.expando ];
	
			// If not, create one
			if ( !unlock ) {
				unlock = Data.uid++;
	
				// Secure it in a non-enumerable, non-writable property
				try {
					descriptor[ this.expando ] = { value: unlock };
					Object.defineProperties( owner, descriptor );
	
				// Support: Android<4
				// Fallback to a less secure definition
				} catch ( e ) {
					descriptor[ this.expando ] = unlock;
					jQuery.extend( owner, descriptor );
				}
			}
	
			// Ensure the cache object
			if ( !this.cache[ unlock ] ) {
				this.cache[ unlock ] = {};
			}
	
			return unlock;
		},
		set: function( owner, data, value ) {
			var prop,
				// There may be an unlock assigned to this node,
				// if there is no entry for this "owner", create one inline
				// and set the unlock as though an owner entry had always existed
				unlock = this.key( owner ),
				cache = this.cache[ unlock ];
	
			// Handle: [ owner, key, value ] args
			if ( typeof data === "string" ) {
				cache[ data ] = value;
	
			// Handle: [ owner, { properties } ] args
			} else {
				// Fresh assignments by object are shallow copied
				if ( jQuery.isEmptyObject( cache ) ) {
					jQuery.extend( this.cache[ unlock ], data );
				// Otherwise, copy the properties one-by-one to the cache object
				} else {
					for ( prop in data ) {
						cache[ prop ] = data[ prop ];
					}
				}
			}
			return cache;
		},
		get: function( owner, key ) {
			// Either a valid cache is found, or will be created.
			// New caches will be created and the unlock returned,
			// allowing direct access to the newly created
			// empty data object. A valid owner object must be provided.
			var cache = this.cache[ this.key( owner ) ];
	
			return key === undefined ?
				cache : cache[ key ];
		},
		access: function( owner, key, value ) {
			var stored;
			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if ( key === undefined ||
					((key && typeof key === "string") && value === undefined) ) {
	
				stored = this.get( owner, key );
	
				return stored !== undefined ?
					stored : this.get( owner, jQuery.camelCase(key) );
			}
	
			// [*]When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set( owner, key, value );
	
			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function( owner, key ) {
			var i, name, camel,
				unlock = this.key( owner ),
				cache = this.cache[ unlock ];
	
			if ( key === undefined ) {
				this.cache[ unlock ] = {};
	
			} else {
				// Support array or space separated string of keys
				if ( jQuery.isArray( key ) ) {
					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat( key.map( jQuery.camelCase ) );
				} else {
					camel = jQuery.camelCase( key );
					// Try the string as a key before any manipulation
					if ( key in cache ) {
						name = [ key, camel ];
					} else {
						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = name in cache ?
							[ name ] : ( name.match( rnotwhite ) || [] );
					}
				}
	
				i = name.length;
				while ( i-- ) {
					delete cache[ name[ i ] ];
				}
			}
		},
		hasData: function( owner ) {
			return !jQuery.isEmptyObject(
				this.cache[ owner[ this.expando ] ] || {}
			);
		},
		discard: function( owner ) {
			if ( owner[ this.expando ] ) {
				delete this.cache[ owner[ this.expando ] ];
			}
		}
	};
	var data_priv = new Data();
	
	var data_user = new Data();
	
	
	
	//	Implementation Summary
	//
	//	1. Enforce API surface and semantic compatibility with 1.9.x branch
	//	2. Improve the module's maintainability by reducing the storage
	//		paths to a single mechanism.
	//	3. Use the same single mechanism to support "private" and "user" data.
	//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	//	5. Avoid exposing implementation details on user objects (eg. expando properties)
	//	6. Provide a clear path for implementation upgrade to WeakMap in 2014
	
	var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		rmultiDash = /([A-Z])/g;
	
	function dataAttr( elem, key, data ) {
		var name;
	
		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if ( data === undefined && elem.nodeType === 1 ) {
			name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
			data = elem.getAttribute( name );
	
			if ( typeof data === "string" ) {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :
						// Only convert to a number if it doesn't change the string
						+data + "" === data ? +data :
						rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
				} catch( e ) {}
	
				// Make sure we set the data so it isn't changed later
				data_user.set( elem, key, data );
			} else {
				data = undefined;
			}
		}
		return data;
	}
	
	jQuery.extend({
		hasData: function( elem ) {
			return data_user.hasData( elem ) || data_priv.hasData( elem );
		},
	
		data: function( elem, name, data ) {
			return data_user.access( elem, name, data );
		},
	
		removeData: function( elem, name ) {
			data_user.remove( elem, name );
		},
	
		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to data_priv methods, these can be deprecated.
		_data: function( elem, name, data ) {
			return data_priv.access( elem, name, data );
		},
	
		_removeData: function( elem, name ) {
			data_priv.remove( elem, name );
		}
	});
	
	jQuery.fn.extend({
		data: function( key, value ) {
			var i, name, data,
				elem = this[ 0 ],
				attrs = elem && elem.attributes;
	
			// Gets all values
			if ( key === undefined ) {
				if ( this.length ) {
					data = data_user.get( elem );
	
					if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
						i = attrs.length;
						while ( i-- ) {
	
							// Support: IE11+
							// The attrs elements can be null (#14894)
							if ( attrs[ i ] ) {
								name = attrs[ i ].name;
								if ( name.indexOf( "data-" ) === 0 ) {
									name = jQuery.camelCase( name.slice(5) );
									dataAttr( elem, name, data[ name ] );
								}
							}
						}
						data_priv.set( elem, "hasDataAttrs", true );
					}
				}
	
				return data;
			}
	
			// Sets multiple values
			if ( typeof key === "object" ) {
				return this.each(function() {
					data_user.set( this, key );
				});
			}
	
			return access( this, function( value ) {
				var data,
					camelKey = jQuery.camelCase( key );
	
				// The calling jQuery object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty jQuery object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if ( elem && value === undefined ) {
					// Attempt to get data from the cache
					// with the key as-is
					data = data_user.get( elem, key );
					if ( data !== undefined ) {
						return data;
					}
	
					// Attempt to get data from the cache
					// with the key camelized
					data = data_user.get( elem, camelKey );
					if ( data !== undefined ) {
						return data;
					}
	
					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr( elem, camelKey, undefined );
					if ( data !== undefined ) {
						return data;
					}
	
					// We tried really hard, but the data doesn't exist.
					return;
				}
	
				// Set the data...
				this.each(function() {
					// First, attempt to store a copy or reference of any
					// data that might've been store with a camelCased key.
					var data = data_user.get( this, camelKey );
	
					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					data_user.set( this, camelKey, value );
	
					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if ( key.indexOf("-") !== -1 && data !== undefined ) {
						data_user.set( this, key, value );
					}
				});
			}, null, value, arguments.length > 1, null, true );
		},
	
		removeData: function( key ) {
			return this.each(function() {
				data_user.remove( this, key );
			});
		}
	});
	
	
	jQuery.extend({
		queue: function( elem, type, data ) {
			var queue;
	
			if ( elem ) {
				type = ( type || "fx" ) + "queue";
				queue = data_priv.get( elem, type );
	
				// Speed up dequeue by getting out quickly if this is just a lookup
				if ( data ) {
					if ( !queue || jQuery.isArray( data ) ) {
						queue = data_priv.access( elem, type, jQuery.makeArray(data) );
					} else {
						queue.push( data );
					}
				}
				return queue || [];
			}
		},
	
		dequeue: function( elem, type ) {
			type = type || "fx";
	
			var queue = jQuery.queue( elem, type ),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = jQuery._queueHooks( elem, type ),
				next = function() {
					jQuery.dequeue( elem, type );
				};
	
			// If the fx queue is dequeued, always remove the progress sentinel
			if ( fn === "inprogress" ) {
				fn = queue.shift();
				startLength--;
			}
	
			if ( fn ) {
	
				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if ( type === "fx" ) {
					queue.unshift( "inprogress" );
				}
	
				// Clear up the last queue stop function
				delete hooks.stop;
				fn.call( elem, next, hooks );
			}
	
			if ( !startLength && hooks ) {
				hooks.empty.fire();
			}
		},
	
		// Not public - generate a queueHooks object, or return the current one
		_queueHooks: function( elem, type ) {
			var key = type + "queueHooks";
			return data_priv.get( elem, key ) || data_priv.access( elem, key, {
				empty: jQuery.Callbacks("once memory").add(function() {
					data_priv.remove( elem, [ type + "queue", key ] );
				})
			});
		}
	});
	
	jQuery.fn.extend({
		queue: function( type, data ) {
			var setter = 2;
	
			if ( typeof type !== "string" ) {
				data = type;
				type = "fx";
				setter--;
			}
	
			if ( arguments.length < setter ) {
				return jQuery.queue( this[0], type );
			}
	
			return data === undefined ?
				this :
				this.each(function() {
					var queue = jQuery.queue( this, type, data );
	
					// Ensure a hooks for this queue
					jQuery._queueHooks( this, type );
	
					if ( type === "fx" && queue[0] !== "inprogress" ) {
						jQuery.dequeue( this, type );
					}
				});
		},
		dequeue: function( type ) {
			return this.each(function() {
				jQuery.dequeue( this, type );
			});
		},
		clearQueue: function( type ) {
			return this.queue( type || "fx", [] );
		},
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function( type, obj ) {
			var tmp,
				count = 1,
				defer = jQuery.Deferred(),
				elements = this,
				i = this.length,
				resolve = function() {
					if ( !( --count ) ) {
						defer.resolveWith( elements, [ elements ] );
					}
				};
	
			if ( typeof type !== "string" ) {
				obj = type;
				type = undefined;
			}
			type = type || "fx";
	
			while ( i-- ) {
				tmp = data_priv.get( elements[ i ], type + "queueHooks" );
				if ( tmp && tmp.empty ) {
					count++;
					tmp.empty.add( resolve );
				}
			}
			resolve();
			return defer.promise( obj );
		}
	});
	var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;
	
	var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
	
	var isHidden = function( elem, el ) {
			// isHidden might be called from jQuery#filter function;
			// in that case, element will be second argument
			elem = el || elem;
			return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
		};
	
	var rcheckableType = (/^(?:checkbox|radio)$/i);
	
	
	
	(function() {
		var fragment = document.createDocumentFragment(),
			div = fragment.appendChild( document.createElement( "div" ) ),
			input = document.createElement( "input" );
	
		// Support: Safari<=5.1
		// Check state lost if the name is set (#11217)
		// Support: Windows Web Apps (WWA)
		// `name` and `type` must use .setAttribute for WWA (#14901)
		input.setAttribute( "type", "radio" );
		input.setAttribute( "checked", "checked" );
		input.setAttribute( "name", "t" );
	
		div.appendChild( input );
	
		// Support: Safari<=5.1, Android<4.2
		// Older WebKit doesn't clone checked state correctly in fragments
		support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;
	
		// Support: IE<=11+
		// Make sure textarea (and checkbox) defaultValue is properly cloned
		div.innerHTML = "<textarea>x</textarea>";
		support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
	})();
	var strundefined = typeof undefined;
	
	
	
	support.focusinBubbles = "onfocusin" in window;
	
	
	var
		rkeyEvent = /^key/,
		rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
		rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
		rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
	
	function returnTrue() {
		return true;
	}
	
	function returnFalse() {
		return false;
	}
	
	function safeActiveElement() {
		try {
			return document.activeElement;
		} catch ( err ) { }
	}
	
	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {
	
		global: {},
	
		add: function( elem, types, handler, data, selector ) {
	
			var handleObjIn, eventHandle, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = data_priv.get( elem );
	
			// Don't attach events to noData or text/comment nodes (but allow plain objects)
			if ( !elemData ) {
				return;
			}
	
			// Caller can pass in an object of custom data in lieu of the handler
			if ( handler.handler ) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
				selector = handleObjIn.selector;
			}
	
			// Make sure that the handler has a unique ID, used to find/remove it later
			if ( !handler.guid ) {
				handler.guid = jQuery.guid++;
			}
	
			// Init the element's event structure and main handler, if this is the first
			if ( !(events = elemData.events) ) {
				events = elemData.events = {};
			}
			if ( !(eventHandle = elemData.handle) ) {
				eventHandle = elemData.handle = function( e ) {
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
						jQuery.event.dispatch.apply( elem, arguments ) : undefined;
				};
			}
	
			// Handle multiple events separated by a space
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[t] ) || [];
				type = origType = tmp[1];
				namespaces = ( tmp[2] || "" ).split( "." ).sort();
	
				// There *must* be a type, no attaching namespace-only handlers
				if ( !type ) {
					continue;
				}
	
				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[ type ] || {};
	
				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;
	
				// Update special based on newly reset type
				special = jQuery.event.special[ type ] || {};
	
				// handleObj is passed to all event handlers
				handleObj = jQuery.extend({
					type: type,
					origType: origType,
					data: data,
					handler: handler,
					guid: handler.guid,
					selector: selector,
					needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
					namespace: namespaces.join(".")
				}, handleObjIn );
	
				// Init the event handler queue if we're the first
				if ( !(handlers = events[ type ]) ) {
					handlers = events[ type ] = [];
					handlers.delegateCount = 0;
	
					// Only use addEventListener if the special events handler returns false
					if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
						if ( elem.addEventListener ) {
							elem.addEventListener( type, eventHandle, false );
						}
					}
				}
	
				if ( special.add ) {
					special.add.call( elem, handleObj );
	
					if ( !handleObj.handler.guid ) {
						handleObj.handler.guid = handler.guid;
					}
				}
	
				// Add to the element's handler list, delegates in front
				if ( selector ) {
					handlers.splice( handlers.delegateCount++, 0, handleObj );
				} else {
					handlers.push( handleObj );
				}
	
				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[ type ] = true;
			}
	
		},
	
		// Detach an event or set of events from an element
		remove: function( elem, types, handler, selector, mappedTypes ) {
	
			var j, origCount, tmp,
				events, t, handleObj,
				special, handlers, type, namespaces, origType,
				elemData = data_priv.hasData( elem ) && data_priv.get( elem );
	
			if ( !elemData || !(events = elemData.events) ) {
				return;
			}
	
			// Once for each type.namespace in types; type may be omitted
			types = ( types || "" ).match( rnotwhite ) || [ "" ];
			t = types.length;
			while ( t-- ) {
				tmp = rtypenamespace.exec( types[t] ) || [];
				type = origType = tmp[1];
				namespaces = ( tmp[2] || "" ).split( "." ).sort();
	
				// Unbind all events (on this namespace, if provided) for the element
				if ( !type ) {
					for ( type in events ) {
						jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
					}
					continue;
				}
	
				special = jQuery.event.special[ type ] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				handlers = events[ type ] || [];
				tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );
	
				// Remove matching events
				origCount = j = handlers.length;
				while ( j-- ) {
					handleObj = handlers[ j ];
	
					if ( ( mappedTypes || origType === handleObj.origType ) &&
						( !handler || handler.guid === handleObj.guid ) &&
						( !tmp || tmp.test( handleObj.namespace ) ) &&
						( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
						handlers.splice( j, 1 );
	
						if ( handleObj.selector ) {
							handlers.delegateCount--;
						}
						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}
				}
	
				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if ( origCount && !handlers.length ) {
					if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
						jQuery.removeEvent( elem, type, elemData.handle );
					}
	
					delete events[ type ];
				}
			}
	
			// Remove the expando if it's no longer used
			if ( jQuery.isEmptyObject( events ) ) {
				delete elemData.handle;
				data_priv.remove( elem, "events" );
			}
		},
	
		trigger: function( event, data, elem, onlyHandlers ) {
	
			var i, cur, tmp, bubbleType, ontype, handle, special,
				eventPath = [ elem || document ],
				type = hasOwn.call( event, "type" ) ? event.type : event,
				namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];
	
			cur = tmp = elem = elem || document;
	
			// Don't do events on text and comment nodes
			if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
				return;
			}
	
			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
				return;
			}
	
			if ( type.indexOf(".") >= 0 ) {
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}
			ontype = type.indexOf(":") < 0 && "on" + type;
	
			// Caller can pass in a jQuery.Event object, Object, or just an event type string
			event = event[ jQuery.expando ] ?
				event :
				new jQuery.Event( type, typeof event === "object" && event );
	
			// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
			event.isTrigger = onlyHandlers ? 2 : 3;
			event.namespace = namespaces.join(".");
			event.namespace_re = event.namespace ?
				new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
				null;
	
			// Clean up the event in case it is being reused
			event.result = undefined;
			if ( !event.target ) {
				event.target = elem;
			}
	
			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data == null ?
				[ event ] :
				jQuery.makeArray( data, [ event ] );
	
			// Allow special events to draw outside the lines
			special = jQuery.event.special[ type ] || {};
			if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
				return;
			}
	
			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {
	
				bubbleType = special.delegateType || type;
				if ( !rfocusMorph.test( bubbleType + type ) ) {
					cur = cur.parentNode;
				}
				for ( ; cur; cur = cur.parentNode ) {
					eventPath.push( cur );
					tmp = cur;
				}
	
				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if ( tmp === (elem.ownerDocument || document) ) {
					eventPath.push( tmp.defaultView || tmp.parentWindow || window );
				}
			}
	
			// Fire handlers on the event path
			i = 0;
			while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {
	
				event.type = i > 1 ?
					bubbleType :
					special.bindType || type;
	
				// jQuery handler
				handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
				if ( handle ) {
					handle.apply( cur, data );
				}
	
				// Native handler
				handle = ontype && cur[ ontype ];
				if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
					event.result = handle.apply( cur, data );
					if ( event.result === false ) {
						event.preventDefault();
					}
				}
			}
			event.type = type;
	
			// If nobody prevented the default action, do it now
			if ( !onlyHandlers && !event.isDefaultPrevented() ) {
	
				if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
					jQuery.acceptData( elem ) ) {
	
					// Call a native DOM method on the target with the same name name as the event.
					// Don't do default actions on window, that's where global variables be (#6170)
					if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {
	
						// Don't re-trigger an onFOO event when we call its FOO() method
						tmp = elem[ ontype ];
	
						if ( tmp ) {
							elem[ ontype ] = null;
						}
	
						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;
	
						if ( tmp ) {
							elem[ ontype ] = tmp;
						}
					}
				}
			}
	
			return event.result;
		},
	
		dispatch: function( event ) {
	
			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( event );
	
			var i, j, ret, matched, handleObj,
				handlerQueue = [],
				args = slice.call( arguments ),
				handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
				special = jQuery.event.special[ event.type ] || {};
	
			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;
			event.delegateTarget = this;
	
			// Call the preDispatch hook for the mapped type, and let it bail if desired
			if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
				return;
			}
	
			// Determine handlers
			handlerQueue = jQuery.event.handlers.call( this, event, handlers );
	
			// Run delegates first; they may want to stop propagation beneath us
			i = 0;
			while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
				event.currentTarget = matched.elem;
	
				j = 0;
				while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {
	
					// Triggered event must either 1) have no namespace, or 2) have namespace(s)
					// a subset or equal to those in the bound event (both can have no namespace).
					if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {
	
						event.handleObj = handleObj;
						event.data = handleObj.data;
	
						ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
								.apply( matched.elem, args );
	
						if ( ret !== undefined ) {
							if ( (event.result = ret) === false ) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}
	
			// Call the postDispatch hook for the mapped type
			if ( special.postDispatch ) {
				special.postDispatch.call( this, event );
			}
	
			return event.result;
		},
	
		handlers: function( event, handlers ) {
			var i, matches, sel, handleObj,
				handlerQueue = [],
				delegateCount = handlers.delegateCount,
				cur = event.target;
	
			// Find delegate handlers
			// Black-hole SVG <use> instance trees (#13180)
			// Avoid non-left-click bubbling in Firefox (#3861)
			if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {
	
				for ( ; cur !== this; cur = cur.parentNode || this ) {
	
					// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
					if ( cur.disabled !== true || event.type !== "click" ) {
						matches = [];
						for ( i = 0; i < delegateCount; i++ ) {
							handleObj = handlers[ i ];
	
							// Don't conflict with Object.prototype properties (#13203)
							sel = handleObj.selector + " ";
	
							if ( matches[ sel ] === undefined ) {
								matches[ sel ] = handleObj.needsContext ?
									jQuery( sel, this ).index( cur ) >= 0 :
									jQuery.find( sel, this, null, [ cur ] ).length;
							}
							if ( matches[ sel ] ) {
								matches.push( handleObj );
							}
						}
						if ( matches.length ) {
							handlerQueue.push({ elem: cur, handlers: matches });
						}
					}
				}
			}
	
			// Add the remaining (directly-bound) handlers
			if ( delegateCount < handlers.length ) {
				handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
			}
	
			return handlerQueue;
		},
	
		// Includes some event props shared by KeyEvent and MouseEvent
		props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
	
		fixHooks: {},
	
		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function( event, original ) {
	
				// Add which for key events
				if ( event.which == null ) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}
	
				return event;
			}
		},
	
		mouseHooks: {
			props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
			filter: function( event, original ) {
				var eventDoc, doc, body,
					button = original.button;
	
				// Calculate pageX/Y if missing and clientX/Y available
				if ( event.pageX == null && original.clientX != null ) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;
	
					event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
					event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
				}
	
				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if ( !event.which && button !== undefined ) {
					event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
				}
	
				return event;
			}
		},
	
		fix: function( event ) {
			if ( event[ jQuery.expando ] ) {
				return event;
			}
	
			// Create a writable copy of the event object and normalize some properties
			var i, prop, copy,
				type = event.type,
				originalEvent = event,
				fixHook = this.fixHooks[ type ];
	
			if ( !fixHook ) {
				this.fixHooks[ type ] = fixHook =
					rmouseEvent.test( type ) ? this.mouseHooks :
					rkeyEvent.test( type ) ? this.keyHooks :
					{};
			}
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;
	
			event = new jQuery.Event( originalEvent );
	
			i = copy.length;
			while ( i-- ) {
				prop = copy[ i ];
				event[ prop ] = originalEvent[ prop ];
			}
	
			// Support: Cordova 2.5 (WebKit) (#13255)
			// All events should have a target; Cordova deviceready doesn't
			if ( !event.target ) {
				event.target = document;
			}
	
			// Support: Safari 6.0+, Chrome<28
			// Target should not be a text node (#504, #13143)
			if ( event.target.nodeType === 3 ) {
				event.target = event.target.parentNode;
			}
	
			return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
		},
	
		special: {
			load: {
				// Prevent triggered image.load events from bubbling to window.load
				noBubble: true
			},
			focus: {
				// Fire native event if possible so blur/focus sequence is correct
				trigger: function() {
					if ( this !== safeActiveElement() && this.focus ) {
						this.focus();
						return false;
					}
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function() {
					if ( this === safeActiveElement() && this.blur ) {
						this.blur();
						return false;
					}
				},
				delegateType: "focusout"
			},
			click: {
				// For checkbox, fire native event so checked state will be right
				trigger: function() {
					if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
						this.click();
						return false;
					}
				},
	
				// For cross-browser consistency, don't fire native .click() on links
				_default: function( event ) {
					return jQuery.nodeName( event.target, "a" );
				}
			},
	
			beforeunload: {
				postDispatch: function( event ) {
	
					// Support: Firefox 20+
					// Firefox doesn't alert if the returnValue field is not set.
					if ( event.result !== undefined && event.originalEvent ) {
						event.originalEvent.returnValue = event.result;
					}
				}
			}
		},
	
		simulate: function( type, elem, event, bubble ) {
			// Piggyback on a donor event to simulate a different one.
			// Fake originalEvent to avoid donor's stopPropagation, but if the
			// simulated event prevents default then we do the same on the donor.
			var e = jQuery.extend(
				new jQuery.Event(),
				event,
				{
					type: type,
					isSimulated: true,
					originalEvent: {}
				}
			);
			if ( bubble ) {
				jQuery.event.trigger( e, null, elem );
			} else {
				jQuery.event.dispatch.call( elem, e );
			}
			if ( e.isDefaultPrevented() ) {
				event.preventDefault();
			}
		}
	};
	
	jQuery.removeEvent = function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	};
	
	jQuery.Event = function( src, props ) {
		// Allow instantiation without the 'new' keyword
		if ( !(this instanceof jQuery.Event) ) {
			return new jQuery.Event( src, props );
		}
	
		// Event object
		if ( src && src.type ) {
			this.originalEvent = src;
			this.type = src.type;
	
			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = src.defaultPrevented ||
					src.defaultPrevented === undefined &&
					// Support: Android<4.0
					src.returnValue === false ?
				returnTrue :
				returnFalse;
	
		// Event type
		} else {
			this.type = src;
		}
	
		// Put explicitly provided properties onto the event object
		if ( props ) {
			jQuery.extend( this, props );
		}
	
		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();
	
		// Mark it as fixed
		this[ jQuery.expando ] = true;
	};
	
	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		isDefaultPrevented: returnFalse,
		isPropagationStopped: returnFalse,
		isImmediatePropagationStopped: returnFalse,
	
		preventDefault: function() {
			var e = this.originalEvent;
	
			this.isDefaultPrevented = returnTrue;
	
			if ( e && e.preventDefault ) {
				e.preventDefault();
			}
		},
		stopPropagation: function() {
			var e = this.originalEvent;
	
			this.isPropagationStopped = returnTrue;
	
			if ( e && e.stopPropagation ) {
				e.stopPropagation();
			}
		},
		stopImmediatePropagation: function() {
			var e = this.originalEvent;
	
			this.isImmediatePropagationStopped = returnTrue;
	
			if ( e && e.stopImmediatePropagation ) {
				e.stopImmediatePropagation();
			}
	
			this.stopPropagation();
		}
	};
	
	// Create mouseenter/leave events using mouseover/out and event-time checks
	// Support: Chrome 15+
	jQuery.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function( orig, fix ) {
		jQuery.event.special[ orig ] = {
			delegateType: fix,
			bindType: fix,
	
			handle: function( event ) {
				var ret,
					target = this,
					related = event.relatedTarget,
					handleObj = event.handleObj;
	
				// For mousenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply( this, arguments );
					event.type = fix;
				}
				return ret;
			}
		};
	});
	
	// Support: Firefox, Chrome, Safari
	// Create "bubbling" focus and blur events
	if ( !support.focusinBubbles ) {
		jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
	
			// Attach a single capturing handler on the document while someone wants focusin/focusout
			var handler = function( event ) {
					jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
				};
	
			jQuery.event.special[ fix ] = {
				setup: function() {
					var doc = this.ownerDocument || this,
						attaches = data_priv.access( doc, fix );
	
					if ( !attaches ) {
						doc.addEventListener( orig, handler, true );
					}
					data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
				},
				teardown: function() {
					var doc = this.ownerDocument || this,
						attaches = data_priv.access( doc, fix ) - 1;
	
					if ( !attaches ) {
						doc.removeEventListener( orig, handler, true );
						data_priv.remove( doc, fix );
	
					} else {
						data_priv.access( doc, fix, attaches );
					}
				}
			};
		});
	}
	
	jQuery.fn.extend({
	
		on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
			var origFn, type;
	
			// Types can be a map of types/handlers
			if ( typeof types === "object" ) {
				// ( types-Object, selector, data )
				if ( typeof selector !== "string" ) {
					// ( types-Object, data )
					data = data || selector;
					selector = undefined;
				}
				for ( type in types ) {
					this.on( type, selector, data, types[ type ], one );
				}
				return this;
			}
	
			if ( data == null && fn == null ) {
				// ( types, fn )
				fn = selector;
				data = selector = undefined;
			} else if ( fn == null ) {
				if ( typeof selector === "string" ) {
					// ( types, selector, fn )
					fn = data;
					data = undefined;
				} else {
					// ( types, data, fn )
					fn = data;
					data = selector;
					selector = undefined;
				}
			}
			if ( fn === false ) {
				fn = returnFalse;
			} else if ( !fn ) {
				return this;
			}
	
			if ( one === 1 ) {
				origFn = fn;
				fn = function( event ) {
					// Can use an empty set, since event contains the info
					jQuery().off( event );
					return origFn.apply( this, arguments );
				};
				// Use same guid so caller can remove using origFn
				fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
			}
			return this.each( function() {
				jQuery.event.add( this, types, fn, data, selector );
			});
		},
		one: function( types, selector, data, fn ) {
			return this.on( types, selector, data, fn, 1 );
		},
		off: function( types, selector, fn ) {
			var handleObj, type;
			if ( types && types.preventDefault && types.handleObj ) {
				// ( event )  dispatched jQuery.Event
				handleObj = types.handleObj;
				jQuery( types.delegateTarget ).off(
					handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
					handleObj.selector,
					handleObj.handler
				);
				return this;
			}
			if ( typeof types === "object" ) {
				// ( types-object [, selector] )
				for ( type in types ) {
					this.off( type, selector, types[ type ] );
				}
				return this;
			}
			if ( selector === false || typeof selector === "function" ) {
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if ( fn === false ) {
				fn = returnFalse;
			}
			return this.each(function() {
				jQuery.event.remove( this, types, fn, selector );
			});
		},
	
		trigger: function( type, data ) {
			return this.each(function() {
				jQuery.event.trigger( type, data, this );
			});
		},
		triggerHandler: function( type, data ) {
			var elem = this[0];
			if ( elem ) {
				return jQuery.event.trigger( type, data, elem, true );
			}
		}
	});
	
	
	var
		rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
		rtagName = /<([\w:]+)/,
		rhtml = /<|&#?\w+;/,
		rnoInnerhtml = /<(?:script|style|link)/i,
		// checked="checked" or checked
		rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
		rscriptType = /^$|\/(?:java|ecma)script/i,
		rscriptTypeMasked = /^true\/(.*)/,
		rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
	
		// We have to close these tags to support XHTML (#13200)
		wrapMap = {
	
			// Support: IE9
			option: [ 1, "<select multiple='multiple'>", "</select>" ],
	
			thead: [ 1, "<table>", "</table>" ],
			col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
			tr: [ 2, "<table><tbody>", "</tbody></table>" ],
			td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
	
			_default: [ 0, "", "" ]
		};
	
	// Support: IE9
	wrapMap.optgroup = wrapMap.option;
	
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	// Support: 1.x compatibility
	// Manipulating tables requires a tbody
	function manipulationTarget( elem, content ) {
		return jQuery.nodeName( elem, "table" ) &&
			jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?
	
			elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
			elem;
	}
	
	// Replace/restore the type attribute of script elements for safe DOM manipulation
	function disableScript( elem ) {
		elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
		return elem;
	}
	function restoreScript( elem ) {
		var match = rscriptTypeMasked.exec( elem.type );
	
		if ( match ) {
			elem.type = match[ 1 ];
		} else {
			elem.removeAttribute("type");
		}
	
		return elem;
	}
	
	// Mark scripts as having already been evaluated
	function setGlobalEval( elems, refElements ) {
		var i = 0,
			l = elems.length;
	
		for ( ; i < l; i++ ) {
			data_priv.set(
				elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
			);
		}
	}
	
	function cloneCopyEvent( src, dest ) {
		var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;
	
		if ( dest.nodeType !== 1 ) {
			return;
		}
	
		// 1. Copy private data: events, handlers, etc.
		if ( data_priv.hasData( src ) ) {
			pdataOld = data_priv.access( src );
			pdataCur = data_priv.set( dest, pdataOld );
			events = pdataOld.events;
	
			if ( events ) {
				delete pdataCur.handle;
				pdataCur.events = {};
	
				for ( type in events ) {
					for ( i = 0, l = events[ type ].length; i < l; i++ ) {
						jQuery.event.add( dest, type, events[ type ][ i ] );
					}
				}
			}
		}
	
		// 2. Copy user data
		if ( data_user.hasData( src ) ) {
			udataOld = data_user.access( src );
			udataCur = jQuery.extend( {}, udataOld );
	
			data_user.set( dest, udataCur );
		}
	}
	
	function getAll( context, tag ) {
		var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
				context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
				[];
	
		return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
			jQuery.merge( [ context ], ret ) :
			ret;
	}
	
	// Fix IE bugs, see support tests
	function fixInput( src, dest ) {
		var nodeName = dest.nodeName.toLowerCase();
	
		// Fails to persist the checked state of a cloned checkbox or radio button.
		if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
			dest.checked = src.checked;
	
		// Fails to return the selected option to the default selected state when cloning options
		} else if ( nodeName === "input" || nodeName === "textarea" ) {
			dest.defaultValue = src.defaultValue;
		}
	}
	
	jQuery.extend({
		clone: function( elem, dataAndEvents, deepDataAndEvents ) {
			var i, l, srcElements, destElements,
				clone = elem.cloneNode( true ),
				inPage = jQuery.contains( elem.ownerDocument, elem );
	
			// Fix IE cloning issues
			if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
					!jQuery.isXMLDoc( elem ) ) {
	
				// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
				destElements = getAll( clone );
				srcElements = getAll( elem );
	
				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					fixInput( srcElements[ i ], destElements[ i ] );
				}
			}
	
			// Copy the events from the original to the clone
			if ( dataAndEvents ) {
				if ( deepDataAndEvents ) {
					srcElements = srcElements || getAll( elem );
					destElements = destElements || getAll( clone );
	
					for ( i = 0, l = srcElements.length; i < l; i++ ) {
						cloneCopyEvent( srcElements[ i ], destElements[ i ] );
					}
				} else {
					cloneCopyEvent( elem, clone );
				}
			}
	
			// Preserve script evaluation history
			destElements = getAll( clone, "script" );
			if ( destElements.length > 0 ) {
				setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
			}
	
			// Return the cloned set
			return clone;
		},
	
		buildFragment: function( elems, context, scripts, selection ) {
			var elem, tmp, tag, wrap, contains, j,
				fragment = context.createDocumentFragment(),
				nodes = [],
				i = 0,
				l = elems.length;
	
			for ( ; i < l; i++ ) {
				elem = elems[ i ];
	
				if ( elem || elem === 0 ) {
	
					// Add nodes directly
					if ( jQuery.type( elem ) === "object" ) {
						// Support: QtWebKit, PhantomJS
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );
	
					// Convert non-html into a text node
					} else if ( !rhtml.test( elem ) ) {
						nodes.push( context.createTextNode( elem ) );
	
					// Convert html into DOM nodes
					} else {
						tmp = tmp || fragment.appendChild( context.createElement("div") );
	
						// Deserialize a standard representation
						tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
						wrap = wrapMap[ tag ] || wrapMap._default;
						tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];
	
						// Descend through wrappers to the right content
						j = wrap[ 0 ];
						while ( j-- ) {
							tmp = tmp.lastChild;
						}
	
						// Support: QtWebKit, PhantomJS
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( nodes, tmp.childNodes );
	
						// Remember the top-level container
						tmp = fragment.firstChild;
	
						// Ensure the created nodes are orphaned (#12392)
						tmp.textContent = "";
					}
				}
			}
	
			// Remove wrapper from fragment
			fragment.textContent = "";
	
			i = 0;
			while ( (elem = nodes[ i++ ]) ) {
	
				// #4087 - If origin and destination elements are the same, and this is
				// that element, do not do anything
				if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
					continue;
				}
	
				contains = jQuery.contains( elem.ownerDocument, elem );
	
				// Append to fragment
				tmp = getAll( fragment.appendChild( elem ), "script" );
	
				// Preserve script evaluation history
				if ( contains ) {
					setGlobalEval( tmp );
				}
	
				// Capture executables
				if ( scripts ) {
					j = 0;
					while ( (elem = tmp[ j++ ]) ) {
						if ( rscriptType.test( elem.type || "" ) ) {
							scripts.push( elem );
						}
					}
				}
			}
	
			return fragment;
		},
	
		cleanData: function( elems ) {
			var data, elem, type, key,
				special = jQuery.event.special,
				i = 0;
	
			for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
				if ( jQuery.acceptData( elem ) ) {
					key = elem[ data_priv.expando ];
	
					if ( key && (data = data_priv.cache[ key ]) ) {
						if ( data.events ) {
							for ( type in data.events ) {
								if ( special[ type ] ) {
									jQuery.event.remove( elem, type );
	
								// This is a shortcut to avoid jQuery.event.remove's overhead
								} else {
									jQuery.removeEvent( elem, type, data.handle );
								}
							}
						}
						if ( data_priv.cache[ key ] ) {
							// Discard any remaining `private` data
							delete data_priv.cache[ key ];
						}
					}
				}
				// Discard any remaining `user` data
				delete data_user.cache[ elem[ data_user.expando ] ];
			}
		}
	});
	
	jQuery.fn.extend({
		text: function( value ) {
			return access( this, function( value ) {
				return value === undefined ?
					jQuery.text( this ) :
					this.empty().each(function() {
						if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
							this.textContent = value;
						}
					});
			}, null, value, arguments.length );
		},
	
		append: function() {
			return this.domManip( arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.appendChild( elem );
				}
			});
		},
	
		prepend: function() {
			return this.domManip( arguments, function( elem ) {
				if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
					var target = manipulationTarget( this, elem );
					target.insertBefore( elem, target.firstChild );
				}
			});
		},
	
		before: function() {
			return this.domManip( arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this );
				}
			});
		},
	
		after: function() {
			return this.domManip( arguments, function( elem ) {
				if ( this.parentNode ) {
					this.parentNode.insertBefore( elem, this.nextSibling );
				}
			});
		},
	
		remove: function( selector, keepData /* Internal Use Only */ ) {
			var elem,
				elems = selector ? jQuery.filter( selector, this ) : this,
				i = 0;
	
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( getAll( elem ) );
				}
	
				if ( elem.parentNode ) {
					if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
						setGlobalEval( getAll( elem, "script" ) );
					}
					elem.parentNode.removeChild( elem );
				}
			}
	
			return this;
		},
	
		empty: function() {
			var elem,
				i = 0;
	
			for ( ; (elem = this[i]) != null; i++ ) {
				if ( elem.nodeType === 1 ) {
	
					// Prevent memory leaks
					jQuery.cleanData( getAll( elem, false ) );
	
					// Remove any remaining nodes
					elem.textContent = "";
				}
			}
	
			return this;
		},
	
		clone: function( dataAndEvents, deepDataAndEvents ) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
	
			return this.map(function() {
				return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
			});
		},
	
		html: function( value ) {
			return access( this, function( value ) {
				var elem = this[ 0 ] || {},
					i = 0,
					l = this.length;
	
				if ( value === undefined && elem.nodeType === 1 ) {
					return elem.innerHTML;
				}
	
				// See if we can take a shortcut and just use innerHTML
				if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
					!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {
	
					value = value.replace( rxhtmlTag, "<$1></$2>" );
	
					try {
						for ( ; i < l; i++ ) {
							elem = this[ i ] || {};
	
							// Remove element nodes and prevent memory leaks
							if ( elem.nodeType === 1 ) {
								jQuery.cleanData( getAll( elem, false ) );
								elem.innerHTML = value;
							}
						}
	
						elem = 0;
	
					// If using innerHTML throws an exception, use the fallback method
					} catch( e ) {}
				}
	
				if ( elem ) {
					this.empty().append( value );
				}
			}, null, value, arguments.length );
		},
	
		replaceWith: function() {
			var arg = arguments[ 0 ];
	
			// Make the changes, replacing each context element with the new content
			this.domManip( arguments, function( elem ) {
				arg = this.parentNode;
	
				jQuery.cleanData( getAll( this ) );
	
				if ( arg ) {
					arg.replaceChild( elem, this );
				}
			});
	
			// Force removal if there was no new content (e.g., from empty arguments)
			return arg && (arg.length || arg.nodeType) ? this : this.remove();
		},
	
		detach: function( selector ) {
			return this.remove( selector, true );
		},
	
		domManip: function( args, callback ) {
	
			// Flatten any nested arrays
			args = concat.apply( [], args );
	
			var fragment, first, scripts, hasScripts, node, doc,
				i = 0,
				l = this.length,
				set = this,
				iNoClone = l - 1,
				value = args[ 0 ],
				isFunction = jQuery.isFunction( value );
	
			// We can't cloneNode fragments that contain checked, in WebKit
			if ( isFunction ||
					( l > 1 && typeof value === "string" &&
						!support.checkClone && rchecked.test( value ) ) ) {
				return this.each(function( index ) {
					var self = set.eq( index );
					if ( isFunction ) {
						args[ 0 ] = value.call( this, index, self.html() );
					}
					self.domManip( args, callback );
				});
			}
	
			if ( l ) {
				fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
				first = fragment.firstChild;
	
				if ( fragment.childNodes.length === 1 ) {
					fragment = first;
				}
	
				if ( first ) {
					scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
					hasScripts = scripts.length;
	
					// Use the original fragment for the last item instead of the first because it can end up
					// being emptied incorrectly in certain situations (#8070).
					for ( ; i < l; i++ ) {
						node = fragment;
	
						if ( i !== iNoClone ) {
							node = jQuery.clone( node, true, true );
	
							// Keep references to cloned scripts for later restoration
							if ( hasScripts ) {
								// Support: QtWebKit
								// jQuery.merge because push.apply(_, arraylike) throws
								jQuery.merge( scripts, getAll( node, "script" ) );
							}
						}
	
						callback.call( this[ i ], node, i );
					}
	
					if ( hasScripts ) {
						doc = scripts[ scripts.length - 1 ].ownerDocument;
	
						// Reenable scripts
						jQuery.map( scripts, restoreScript );
	
						// Evaluate executable scripts on first document insertion
						for ( i = 0; i < hasScripts; i++ ) {
							node = scripts[ i ];
							if ( rscriptType.test( node.type || "" ) &&
								!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {
	
								if ( node.src ) {
									// Optional AJAX dependency, but won't run scripts if not present
									if ( jQuery._evalUrl ) {
										jQuery._evalUrl( node.src );
									}
								} else {
									jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
								}
							}
						}
					}
				}
			}
	
			return this;
		}
	});
	
	jQuery.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function( name, original ) {
		jQuery.fn[ name ] = function( selector ) {
			var elems,
				ret = [],
				insert = jQuery( selector ),
				last = insert.length - 1,
				i = 0;
	
			for ( ; i <= last; i++ ) {
				elems = i === last ? this : this.clone( true );
				jQuery( insert[ i ] )[ original ]( elems );
	
				// Support: QtWebKit
				// .get() because push.apply(_, arraylike) throws
				push.apply( ret, elems.get() );
			}
	
			return this.pushStack( ret );
		};
	});
	
	
	var iframe,
		elemdisplay = {};
	
	/**
	 * Retrieve the actual display of a element
	 * @param {String} name nodeName of the element
	 * @param {Object} doc Document object
	 */
	// Called only from within defaultDisplay
	function actualDisplay( name, doc ) {
		var style,
			elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
	
			// getDefaultComputedStyle might be reliably used only on attached element
			display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?
	
				// Use of this method is a temporary fix (more like optimization) until something better comes along,
				// since it was removed from specification and supported only in FF
				style.display : jQuery.css( elem[ 0 ], "display" );
	
		// We don't have any data stored on the element,
		// so use "detach" method as fast way to get rid of the element
		elem.detach();
	
		return display;
	}
	
	/**
	 * Try to determine the default display value of an element
	 * @param {String} nodeName
	 */
	function defaultDisplay( nodeName ) {
		var doc = document,
			display = elemdisplay[ nodeName ];
	
		if ( !display ) {
			display = actualDisplay( nodeName, doc );
	
			// If the simple way fails, read from inside an iframe
			if ( display === "none" || !display ) {
	
				// Use the already-created iframe if possible
				iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );
	
				// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
				doc = iframe[ 0 ].contentDocument;
	
				// Support: IE
				doc.write();
				doc.close();
	
				display = actualDisplay( nodeName, doc );
				iframe.detach();
			}
	
			// Store the correct default display
			elemdisplay[ nodeName ] = display;
		}
	
		return display;
	}
	var rmargin = (/^margin/);
	
	var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );
	
	var getStyles = function( elem ) {
			// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
			// IE throws on elements created in popups
			// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
			if ( elem.ownerDocument.defaultView.opener ) {
				return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
			}
	
			return window.getComputedStyle( elem, null );
		};
	
	
	
	function curCSS( elem, name, computed ) {
		var width, minWidth, maxWidth, ret,
			style = elem.style;
	
		computed = computed || getStyles( elem );
	
		// Support: IE9
		// getPropertyValue is only needed for .css('filter') (#12537)
		if ( computed ) {
			ret = computed.getPropertyValue( name ) || computed[ name ];
		}
	
		if ( computed ) {
	
			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}
	
			// Support: iOS < 6
			// A tribute to the "awesome hack by Dean Edwards"
			// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
	
				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;
	
				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;
	
				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}
	
		return ret !== undefined ?
			// Support: IE
			// IE returns zIndex value as an integer.
			ret + "" :
			ret;
	}
	
	
	function addGetHookIf( conditionFn, hookFn ) {
		// Define the hook, we'll check on the first run if it's really needed.
		return {
			get: function() {
				if ( conditionFn() ) {
					// Hook not needed (or it's not possible to use it due
					// to missing dependency), remove it.
					delete this.get;
					return;
				}
	
				// Hook needed; redefine it so that the support test is not executed again.
				return (this.get = hookFn).apply( this, arguments );
			}
		};
	}
	
	
	(function() {
		var pixelPositionVal, boxSizingReliableVal,
			docElem = document.documentElement,
			container = document.createElement( "div" ),
			div = document.createElement( "div" );
	
		if ( !div.style ) {
			return;
		}
	
		// Support: IE9-11+
		// Style of cloned element affects source element cloned (#8908)
		div.style.backgroundClip = "content-box";
		div.cloneNode( true ).style.backgroundClip = "";
		support.clearCloneStyle = div.style.backgroundClip === "content-box";
	
		container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
			"position:absolute";
		container.appendChild( div );
	
		// Executing both pixelPosition & boxSizingReliable tests require only one layout
		// so they're executed at the same time to save the second computation.
		function computePixelPositionAndBoxSizingReliable() {
			div.style.cssText =
				// Support: Firefox<29, Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
				"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
				"border:1px;padding:1px;width:4px;position:absolute";
			div.innerHTML = "";
			docElem.appendChild( container );
	
			var divStyle = window.getComputedStyle( div, null );
			pixelPositionVal = divStyle.top !== "1%";
			boxSizingReliableVal = divStyle.width === "4px";
	
			docElem.removeChild( container );
		}
	
		// Support: node.js jsdom
		// Don't assume that getComputedStyle is a property of the global object
		if ( window.getComputedStyle ) {
			jQuery.extend( support, {
				pixelPosition: function() {
	
					// This test is executed only once but we still do memoizing
					// since we can use the boxSizingReliable pre-computing.
					// No need to check if the test was already performed, though.
					computePixelPositionAndBoxSizingReliable();
					return pixelPositionVal;
				},
				boxSizingReliable: function() {
					if ( boxSizingReliableVal == null ) {
						computePixelPositionAndBoxSizingReliable();
					}
					return boxSizingReliableVal;
				},
				reliableMarginRight: function() {
	
					// Support: Android 2.3
					// Check if div with explicit width and no margin-right incorrectly
					// gets computed margin-right based on width of container. (#3333)
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// This support function is only executed once so no memoizing is needed.
					var ret,
						marginDiv = div.appendChild( document.createElement( "div" ) );
	
					// Reset CSS: box-sizing; display; margin; border; padding
					marginDiv.style.cssText = div.style.cssText =
						// Support: Firefox<29, Android 2.3
						// Vendor-prefix box-sizing
						"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
						"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
					marginDiv.style.marginRight = marginDiv.style.width = "0";
					div.style.width = "1px";
					docElem.appendChild( container );
	
					ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );
	
					docElem.removeChild( container );
					div.removeChild( marginDiv );
	
					return ret;
				}
			});
		}
	})();
	
	
	// A method for quickly swapping in/out CSS properties to get correct calculations.
	jQuery.swap = function( elem, options, callback, args ) {
		var ret, name,
			old = {};
	
		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}
	
		ret = callback.apply( elem, args || [] );
	
		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	
		return ret;
	};
	
	
	var
		// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
		rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),
	
		cssShow = { position: "absolute", visibility: "hidden", display: "block" },
		cssNormalTransform = {
			letterSpacing: "0",
			fontWeight: "400"
		},
	
		cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];
	
	// Return a css property mapped to a potentially vendor prefixed property
	function vendorPropName( style, name ) {
	
		// Shortcut for names that are not vendor prefixed
		if ( name in style ) {
			return name;
		}
	
		// Check for vendor prefixed names
		var capName = name[0].toUpperCase() + name.slice(1),
			origName = name,
			i = cssPrefixes.length;
	
		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in style ) {
				return name;
			}
		}
	
		return origName;
	}
	
	function setPositiveNumber( elem, value, subtract ) {
		var matches = rnumsplit.exec( value );
		return matches ?
			// Guard against undefined "subtract", e.g., when used as in cssHooks
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
	}
	
	function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
		var i = extra === ( isBorderBox ? "border" : "content" ) ?
			// If we already have the right measurement, avoid augmentation
			4 :
			// Otherwise initialize for horizontal or vertical properties
			name === "width" ? 1 : 0,
	
			val = 0;
	
		for ( ; i < 4; i += 2 ) {
			// Both box models exclude margin, so add it if we want it
			if ( extra === "margin" ) {
				val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
			}
	
			if ( isBorderBox ) {
				// border-box includes padding, so remove it if we want content
				if ( extra === "content" ) {
					val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
				}
	
				// At this point, extra isn't border nor margin, so remove border
				if ( extra !== "margin" ) {
					val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			} else {
				// At this point, extra isn't content, so add padding
				val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
	
				// At this point, extra isn't content nor padding, so add border
				if ( extra !== "padding" ) {
					val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
				}
			}
		}
	
		return val;
	}
	
	function getWidthOrHeight( elem, name, extra ) {
	
		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles( elem ),
			isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";
	
		// Some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if ( val <= 0 || val == null ) {
			// Fall back to computed then uncomputed css if necessary
			val = curCSS( elem, name, styles );
			if ( val < 0 || val == null ) {
				val = elem.style[ name ];
			}
	
			// Computed unit is not pixels. Stop here and return.
			if ( rnumnonpx.test(val) ) {
				return val;
			}
	
			// Check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox &&
				( support.boxSizingReliable() || val === elem.style[ name ] );
	
			// Normalize "", auto, and prepare for extra
			val = parseFloat( val ) || 0;
		}
	
		// Use the active box-sizing model to add/subtract irrelevant styles
		return ( val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || ( isBorderBox ? "border" : "content" ),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}
	
	function showHide( elements, show ) {
		var display, elem, hidden,
			values = [],
			index = 0,
			length = elements.length;
	
		for ( ; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
	
			values[ index ] = data_priv.get( elem, "olddisplay" );
			display = elem.style.display;
			if ( show ) {
				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !values[ index ] && display === "none" ) {
					elem.style.display = "";
				}
	
				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( elem.style.display === "" && isHidden( elem ) ) {
					values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
				}
			} else {
				hidden = isHidden( elem );
	
				if ( display !== "none" || !hidden ) {
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	
		// Set the display of most of the elements in a second loop
		// to avoid the constant reflow
		for ( index = 0; index < length; index++ ) {
			elem = elements[ index ];
			if ( !elem.style ) {
				continue;
			}
			if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
				elem.style.display = show ? values[ index ] || "" : "none";
			}
		}
	
		return elements;
	}
	
	jQuery.extend({
	
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks: {
			opacity: {
				get: function( elem, computed ) {
					if ( computed ) {
	
						// We should always get a number back from opacity
						var ret = curCSS( elem, "opacity" );
						return ret === "" ? "1" : ret;
					}
				}
			}
		},
	
		// Don't automatically add "px" to these possibly-unitless properties
		cssNumber: {
			"columnCount": true,
			"fillOpacity": true,
			"flexGrow": true,
			"flexShrink": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},
	
		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps: {
			"float": "cssFloat"
		},
	
		// Get and set the style property on a DOM Node
		style: function( elem, name, value, extra ) {
	
			// Don't set styles on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
				return;
			}
	
			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = jQuery.camelCase( name ),
				style = elem.style;
	
			name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );
	
			// Gets hook for the prefixed version, then unprefixed version
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// Check if we're setting a value
			if ( value !== undefined ) {
				type = typeof value;
	
				// Convert "+=" or "-=" to relative numbers (#7345)
				if ( type === "string" && (ret = rrelNum.exec( value )) ) {
					value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
					// Fixes bug #9237
					type = "number";
				}
	
				// Make sure that null and NaN values aren't set (#7116)
				if ( value == null || value !== value ) {
					return;
				}
	
				// If a number, add 'px' to the (except for certain CSS properties)
				if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
					value += "px";
				}
	
				// Support: IE9-11+
				// background-* props affect original clone's values
				if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
					style[ name ] = "inherit";
				}
	
				// If a hook was provided, use that value, otherwise just set the specified value
				if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
					style[ name ] = value;
				}
	
			} else {
				// If a hook was provided get the non-computed value from there
				if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
					return ret;
				}
	
				// Otherwise just get the value from the style object
				return style[ name ];
			}
		},
	
		css: function( elem, name, extra, styles ) {
			var val, num, hooks,
				origName = jQuery.camelCase( name );
	
			// Make sure that we're working with the right name
			name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );
	
			// Try prefixed name followed by the unprefixed name
			hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];
	
			// If a hook was provided get the computed value from there
			if ( hooks && "get" in hooks ) {
				val = hooks.get( elem, true, extra );
			}
	
			// Otherwise, if a way to get the computed value exists, use that
			if ( val === undefined ) {
				val = curCSS( elem, name, styles );
			}
	
			// Convert "normal" to computed value
			if ( val === "normal" && name in cssNormalTransform ) {
				val = cssNormalTransform[ name ];
			}
	
			// Make numeric if forced or a qualifier was provided and val looks numeric
			if ( extra === "" || extra ) {
				num = parseFloat( val );
				return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
			}
			return val;
		}
	});
	
	jQuery.each([ "height", "width" ], function( i, name ) {
		jQuery.cssHooks[ name ] = {
			get: function( elem, computed, extra ) {
				if ( computed ) {
	
					// Certain elements can have dimension info if we invisibly show them
					// but it must have a current display style that would benefit
					return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
						jQuery.swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						}) :
						getWidthOrHeight( elem, name, extra );
				}
			},
	
			set: function( elem, value, extra ) {
				var styles = extra && getStyles( elem );
				return setPositiveNumber( elem, value, extra ?
					augmentWidthOrHeight(
						elem,
						name,
						extra,
						jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
						styles
					) : 0
				);
			}
		};
	});
	
	// Support: Android 2.3
	jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
		function( elem, computed ) {
			if ( computed ) {
				return jQuery.swap( elem, { "display": "inline-block" },
					curCSS, [ elem, "marginRight" ] );
			}
		}
	);
	
	// These hooks are used by animate to expand properties
	jQuery.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function( prefix, suffix ) {
		jQuery.cssHooks[ prefix + suffix ] = {
			expand: function( value ) {
				var i = 0,
					expanded = {},
	
					// Assumes a single number if not a string
					parts = typeof value === "string" ? value.split(" ") : [ value ];
	
				for ( ; i < 4; i++ ) {
					expanded[ prefix + cssExpand[ i ] + suffix ] =
						parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
				}
	
				return expanded;
			}
		};
	
		if ( !rmargin.test( prefix ) ) {
			jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
		}
	});
	
	jQuery.fn.extend({
		css: function( name, value ) {
			return access( this, function( elem, name, value ) {
				var styles, len,
					map = {},
					i = 0;
	
				if ( jQuery.isArray( name ) ) {
					styles = getStyles( elem );
					len = name.length;
	
					for ( ; i < len; i++ ) {
						map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
					}
	
					return map;
				}
	
				return value !== undefined ?
					jQuery.style( elem, name, value ) :
					jQuery.css( elem, name );
			}, name, value, arguments.length > 1 );
		},
		show: function() {
			return showHide( this, true );
		},
		hide: function() {
			return showHide( this );
		},
		toggle: function( state ) {
			if ( typeof state === "boolean" ) {
				return state ? this.show() : this.hide();
			}
	
			return this.each(function() {
				if ( isHidden( this ) ) {
					jQuery( this ).show();
				} else {
					jQuery( this ).hide();
				}
			});
		}
	});
	
	
	function Tween( elem, options, prop, end, easing ) {
		return new Tween.prototype.init( elem, options, prop, end, easing );
	}
	jQuery.Tween = Tween;
	
	Tween.prototype = {
		constructor: Tween,
		init: function( elem, options, prop, end, easing, unit ) {
			this.elem = elem;
			this.prop = prop;
			this.easing = easing || "swing";
			this.options = options;
			this.start = this.now = this.cur();
			this.end = end;
			this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
		},
		cur: function() {
			var hooks = Tween.propHooks[ this.prop ];
	
			return hooks && hooks.get ?
				hooks.get( this ) :
				Tween.propHooks._default.get( this );
		},
		run: function( percent ) {
			var eased,
				hooks = Tween.propHooks[ this.prop ];
	
			if ( this.options.duration ) {
				this.pos = eased = jQuery.easing[ this.easing ](
					percent, this.options.duration * percent, 0, 1, this.options.duration
				);
			} else {
				this.pos = eased = percent;
			}
			this.now = ( this.end - this.start ) * eased + this.start;
	
			if ( this.options.step ) {
				this.options.step.call( this.elem, this.now, this );
			}
	
			if ( hooks && hooks.set ) {
				hooks.set( this );
			} else {
				Tween.propHooks._default.set( this );
			}
			return this;
		}
	};
	
	Tween.prototype.init.prototype = Tween.prototype;
	
	Tween.propHooks = {
		_default: {
			get: function( tween ) {
				var result;
	
				if ( tween.elem[ tween.prop ] != null &&
					(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
					return tween.elem[ tween.prop ];
				}
	
				// Passing an empty string as a 3rd parameter to .css will automatically
				// attempt a parseFloat and fallback to a string if the parse fails.
				// Simple values such as "10px" are parsed to Float;
				// complex values such as "rotate(1rad)" are returned as-is.
				result = jQuery.css( tween.elem, tween.prop, "" );
				// Empty strings, null, undefined and "auto" are converted to 0.
				return !result || result === "auto" ? 0 : result;
			},
			set: function( tween ) {
				// Use step hook for back compat.
				// Use cssHook if its there.
				// Use .style if available and use plain properties where available.
				if ( jQuery.fx.step[ tween.prop ] ) {
					jQuery.fx.step[ tween.prop ]( tween );
				} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
					jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
				} else {
					tween.elem[ tween.prop ] = tween.now;
				}
			}
		}
	};
	
	// Support: IE9
	// Panic based approach to setting things on disconnected nodes
	Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
		set: function( tween ) {
			if ( tween.elem.nodeType && tween.elem.parentNode ) {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	};
	
	jQuery.easing = {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return 0.5 - Math.cos( p * Math.PI ) / 2;
		}
	};
	
	jQuery.fx = Tween.prototype.init;
	
	// Back Compat <1.8 extension point
	jQuery.fx.step = {};
	
	
	
	
	var
		fxNow, timerId,
		rfxtypes = /^(?:toggle|show|hide)$/,
		rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
		rrun = /queueHooks$/,
		animationPrefilters = [ defaultPrefilter ],
		tweeners = {
			"*": [ function( prop, value ) {
				var tween = this.createTween( prop, value ),
					target = tween.cur(),
					parts = rfxnum.exec( value ),
					unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),
	
					// Starting value computation is required for potential unit mismatches
					start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
						rfxnum.exec( jQuery.css( tween.elem, prop ) ),
					scale = 1,
					maxIterations = 20;
	
				if ( start && start[ 3 ] !== unit ) {
					// Trust units reported by jQuery.css
					unit = unit || start[ 3 ];
	
					// Make sure we update the tween properties later on
					parts = parts || [];
	
					// Iteratively approximate from a nonzero starting point
					start = +target || 1;
	
					do {
						// If previous iteration zeroed out, double until we get *something*.
						// Use string for doubling so we don't accidentally see scale as unchanged below
						scale = scale || ".5";
	
						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );
	
					// Update scale, tolerating zero or NaN from tween.cur(),
					// break the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}
	
				// Update tween properties
				if ( parts ) {
					start = tween.start = +start || +target || 0;
					tween.unit = unit;
					// If a +=/-= token was provided, we're doing a relative animation
					tween.end = parts[ 1 ] ?
						start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
						+parts[ 2 ];
				}
	
				return tween;
			} ]
		};
	
	// Animations created synchronously will run synchronously
	function createFxNow() {
		setTimeout(function() {
			fxNow = undefined;
		});
		return ( fxNow = jQuery.now() );
	}
	
	// Generate parameters to create a standard animation
	function genFx( type, includeWidth ) {
		var which,
			i = 0,
			attrs = { height: type };
	
		// If we include width, step value is 1 to do all cssExpand values,
		// otherwise step value is 2 to skip over Left and Right
		includeWidth = includeWidth ? 1 : 0;
		for ( ; i < 4 ; i += 2 - includeWidth ) {
			which = cssExpand[ i ];
			attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
		}
	
		if ( includeWidth ) {
			attrs.opacity = attrs.width = type;
		}
	
		return attrs;
	}
	
	function createTween( value, prop, animation ) {
		var tween,
			collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( (tween = collection[ index ].call( animation, prop, value )) ) {
	
				// We're done with this property
				return tween;
			}
		}
	}
	
	function defaultPrefilter( elem, props, opts ) {
		/* jshint validthis: true */
		var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
			anim = this,
			orig = {},
			style = elem.style,
			hidden = elem.nodeType && isHidden( elem ),
			dataShow = data_priv.get( elem, "fxshow" );
	
		// Handle queue: false promises
		if ( !opts.queue ) {
			hooks = jQuery._queueHooks( elem, "fx" );
			if ( hooks.unqueued == null ) {
				hooks.unqueued = 0;
				oldfire = hooks.empty.fire;
				hooks.empty.fire = function() {
					if ( !hooks.unqueued ) {
						oldfire();
					}
				};
			}
			hooks.unqueued++;
	
			anim.always(function() {
				// Ensure the complete handler is called before this completes
				anim.always(function() {
					hooks.unqueued--;
					if ( !jQuery.queue( elem, "fx" ).length ) {
						hooks.empty.fire();
					}
				});
			});
		}
	
		// Height/width overflow pass
		if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
			// Make sure that nothing sneaks out
			// Record all 3 overflow attributes because IE9-10 do not
			// change the overflow attribute when overflowX and
			// overflowY are set to the same value
			opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
	
			// Set display property to inline-block for height/width
			// animations on inline elements that are having width/height animated
			display = jQuery.css( elem, "display" );
	
			// Test default display if display is currently "none"
			checkDisplay = display === "none" ?
				data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;
	
			if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
				style.display = "inline-block";
			}
		}
	
		if ( opts.overflow ) {
			style.overflow = "hidden";
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	
		// show/hide pass
		for ( prop in props ) {
			value = props[ prop ];
			if ( rfxtypes.exec( value ) ) {
				delete props[ prop ];
				toggle = toggle || value === "toggle";
				if ( value === ( hidden ? "hide" : "show" ) ) {
	
					// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
					if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
						hidden = true;
					} else {
						continue;
					}
				}
				orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
	
			// Any non-fx value stops us from restoring the original display value
			} else {
				display = undefined;
			}
		}
	
		if ( !jQuery.isEmptyObject( orig ) ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = data_priv.access( elem, "fxshow", {} );
			}
	
			// Store state if its toggle - enables .stop().toggle() to "reverse"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}
			if ( hidden ) {
				jQuery( elem ).show();
			} else {
				anim.done(function() {
					jQuery( elem ).hide();
				});
			}
			anim.done(function() {
				var prop;
	
				data_priv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			});
			for ( prop in orig ) {
				tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
	
				if ( !( prop in dataShow ) ) {
					dataShow[ prop ] = tween.start;
					if ( hidden ) {
						tween.end = tween.start;
						tween.start = prop === "width" || prop === "height" ? 1 : 0;
					}
				}
			}
	
		// If this is a noop like .hide().hide(), restore an overwritten display value
		} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
			style.display = display;
		}
	}
	
	function propFilter( props, specialEasing ) {
		var index, name, easing, value, hooks;
	
		// camelCase, specialEasing and expand cssHook pass
		for ( index in props ) {
			name = jQuery.camelCase( index );
			easing = specialEasing[ name ];
			value = props[ index ];
			if ( jQuery.isArray( value ) ) {
				easing = value[ 1 ];
				value = props[ index ] = value[ 0 ];
			}
	
			if ( index !== name ) {
				props[ name ] = value;
				delete props[ index ];
			}
	
			hooks = jQuery.cssHooks[ name ];
			if ( hooks && "expand" in hooks ) {
				value = hooks.expand( value );
				delete props[ name ];
	
				// Not quite $.extend, this won't overwrite existing keys.
				// Reusing 'index' because we have the correct "name"
				for ( index in value ) {
					if ( !( index in props ) ) {
						props[ index ] = value[ index ];
						specialEasing[ index ] = easing;
					}
				}
			} else {
				specialEasing[ name ] = easing;
			}
		}
	}
	
	function Animation( elem, properties, options ) {
		var result,
			stopped,
			index = 0,
			length = animationPrefilters.length,
			deferred = jQuery.Deferred().always( function() {
				// Don't match elem in the :animated selector
				delete tick.elem;
			}),
			tick = function() {
				if ( stopped ) {
					return false;
				}
				var currentTime = fxNow || createFxNow(),
					remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
					// Support: Android 2.3
					// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
					temp = remaining / animation.duration || 0,
					percent = 1 - temp,
					index = 0,
					length = animation.tweens.length;
	
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( percent );
				}
	
				deferred.notifyWith( elem, [ animation, percent, remaining ]);
	
				if ( percent < 1 && length ) {
					return remaining;
				} else {
					deferred.resolveWith( elem, [ animation ] );
					return false;
				}
			},
			animation = deferred.promise({
				elem: elem,
				props: jQuery.extend( {}, properties ),
				opts: jQuery.extend( true, { specialEasing: {} }, options ),
				originalProperties: properties,
				originalOptions: options,
				startTime: fxNow || createFxNow(),
				duration: options.duration,
				tweens: [],
				createTween: function( prop, end ) {
					var tween = jQuery.Tween( elem, animation.opts, prop, end,
							animation.opts.specialEasing[ prop ] || animation.opts.easing );
					animation.tweens.push( tween );
					return tween;
				},
				stop: function( gotoEnd ) {
					var index = 0,
						// If we are going to the end, we want to run all the tweens
						// otherwise we skip this part
						length = gotoEnd ? animation.tweens.length : 0;
					if ( stopped ) {
						return this;
					}
					stopped = true;
					for ( ; index < length ; index++ ) {
						animation.tweens[ index ].run( 1 );
					}
	
					// Resolve when we played the last frame; otherwise, reject
					if ( gotoEnd ) {
						deferred.resolveWith( elem, [ animation, gotoEnd ] );
					} else {
						deferred.rejectWith( elem, [ animation, gotoEnd ] );
					}
					return this;
				}
			}),
			props = animation.props;
	
		propFilter( props, animation.opts.specialEasing );
	
		for ( ; index < length ; index++ ) {
			result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
			if ( result ) {
				return result;
			}
		}
	
		jQuery.map( props, createTween, animation );
	
		if ( jQuery.isFunction( animation.opts.start ) ) {
			animation.opts.start.call( elem, animation );
		}
	
		jQuery.fx.timer(
			jQuery.extend( tick, {
				elem: elem,
				anim: animation,
				queue: animation.opts.queue
			})
		);
	
		// attach callbacks from options
		return animation.progress( animation.opts.progress )
			.done( animation.opts.done, animation.opts.complete )
			.fail( animation.opts.fail )
			.always( animation.opts.always );
	}
	
	jQuery.Animation = jQuery.extend( Animation, {
	
		tweener: function( props, callback ) {
			if ( jQuery.isFunction( props ) ) {
				callback = props;
				props = [ "*" ];
			} else {
				props = props.split(" ");
			}
	
			var prop,
				index = 0,
				length = props.length;
	
			for ( ; index < length ; index++ ) {
				prop = props[ index ];
				tweeners[ prop ] = tweeners[ prop ] || [];
				tweeners[ prop ].unshift( callback );
			}
		},
	
		prefilter: function( callback, prepend ) {
			if ( prepend ) {
				animationPrefilters.unshift( callback );
			} else {
				animationPrefilters.push( callback );
			}
		}
	});
	
	jQuery.speed = function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};
	
		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;
	
		// Normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}
	
		// Queueing
		opt.old = opt.complete;
	
		opt.complete = function() {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
	
			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			}
		};
	
		return opt;
	};
	
	jQuery.fn.extend({
		fadeTo: function( speed, to, easing, callback ) {
	
			// Show any hidden elements after setting opacity to 0
			return this.filter( isHidden ).css( "opacity", 0 ).show()
	
				// Animate to the value specified
				.end().animate({ opacity: to }, speed, easing, callback );
		},
		animate: function( prop, speed, easing, callback ) {
			var empty = jQuery.isEmptyObject( prop ),
				optall = jQuery.speed( speed, easing, callback ),
				doAnimation = function() {
					// Operate on a copy of prop so per-property easing won't be lost
					var anim = Animation( this, jQuery.extend( {}, prop ), optall );
	
					// Empty animations, or finishing resolves immediately
					if ( empty || data_priv.get( this, "finish" ) ) {
						anim.stop( true );
					}
				};
				doAnimation.finish = doAnimation;
	
			return empty || optall.queue === false ?
				this.each( doAnimation ) :
				this.queue( optall.queue, doAnimation );
		},
		stop: function( type, clearQueue, gotoEnd ) {
			var stopQueue = function( hooks ) {
				var stop = hooks.stop;
				delete hooks.stop;
				stop( gotoEnd );
			};
	
			if ( typeof type !== "string" ) {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if ( clearQueue && type !== false ) {
				this.queue( type || "fx", [] );
			}
	
			return this.each(function() {
				var dequeue = true,
					index = type != null && type + "queueHooks",
					timers = jQuery.timers,
					data = data_priv.get( this );
	
				if ( index ) {
					if ( data[ index ] && data[ index ].stop ) {
						stopQueue( data[ index ] );
					}
				} else {
					for ( index in data ) {
						if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
							stopQueue( data[ index ] );
						}
					}
				}
	
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
						timers[ index ].anim.stop( gotoEnd );
						dequeue = false;
						timers.splice( index, 1 );
					}
				}
	
				// Start the next in the queue if the last step wasn't forced.
				// Timers currently will call their complete callbacks, which
				// will dequeue but only if they were gotoEnd.
				if ( dequeue || !gotoEnd ) {
					jQuery.dequeue( this, type );
				}
			});
		},
		finish: function( type ) {
			if ( type !== false ) {
				type = type || "fx";
			}
			return this.each(function() {
				var index,
					data = data_priv.get( this ),
					queue = data[ type + "queue" ],
					hooks = data[ type + "queueHooks" ],
					timers = jQuery.timers,
					length = queue ? queue.length : 0;
	
				// Enable finishing flag on private data
				data.finish = true;
	
				// Empty the queue first
				jQuery.queue( this, type, [] );
	
				if ( hooks && hooks.stop ) {
					hooks.stop.call( this, true );
				}
	
				// Look for any active animations, and finish them
				for ( index = timers.length; index--; ) {
					if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
						timers[ index ].anim.stop( true );
						timers.splice( index, 1 );
					}
				}
	
				// Look for any animations in the old queue and finish them
				for ( index = 0; index < length; index++ ) {
					if ( queue[ index ] && queue[ index ].finish ) {
						queue[ index ].finish.call( this );
					}
				}
	
				// Turn off finishing flag
				delete data.finish;
			});
		}
	});
	
	jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
		var cssFn = jQuery.fn[ name ];
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return speed == null || typeof speed === "boolean" ?
				cssFn.apply( this, arguments ) :
				this.animate( genFx( name, true ), speed, easing, callback );
		};
	});
	
	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown: genFx("show"),
		slideUp: genFx("hide"),
		slideToggle: genFx("toggle"),
		fadeIn: { opacity: "show" },
		fadeOut: { opacity: "hide" },
		fadeToggle: { opacity: "toggle" }
	}, function( name, props ) {
		jQuery.fn[ name ] = function( speed, easing, callback ) {
			return this.animate( props, speed, easing, callback );
		};
	});
	
	jQuery.timers = [];
	jQuery.fx.tick = function() {
		var timer,
			i = 0,
			timers = jQuery.timers;
	
		fxNow = jQuery.now();
	
		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}
	
		if ( !timers.length ) {
			jQuery.fx.stop();
		}
		fxNow = undefined;
	};
	
	jQuery.fx.timer = function( timer ) {
		jQuery.timers.push( timer );
		if ( timer() ) {
			jQuery.fx.start();
		} else {
			jQuery.timers.pop();
		}
	};
	
	jQuery.fx.interval = 13;
	
	jQuery.fx.start = function() {
		if ( !timerId ) {
			timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
		}
	};
	
	jQuery.fx.stop = function() {
		clearInterval( timerId );
		timerId = null;
	};
	
	jQuery.fx.speeds = {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	};
	
	
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	jQuery.fn.delay = function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";
	
		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	};
	
	
	(function() {
		var input = document.createElement( "input" ),
			select = document.createElement( "select" ),
			opt = select.appendChild( document.createElement( "option" ) );
	
		input.type = "checkbox";
	
		// Support: iOS<=5.1, Android<=4.2+
		// Default value for a checkbox should be "on"
		support.checkOn = input.value !== "";
	
		// Support: IE<=11+
		// Must access selectedIndex to make default options select
		support.optSelected = opt.selected;
	
		// Support: Android<=2.3
		// Options inside disabled selects are incorrectly marked as disabled
		select.disabled = true;
		support.optDisabled = !opt.disabled;
	
		// Support: IE<=11+
		// An input loses its value after becoming a radio
		input = document.createElement( "input" );
		input.value = "t";
		input.type = "radio";
		support.radioValue = input.value === "t";
	})();
	
	
	var nodeHook, boolHook,
		attrHandle = jQuery.expr.attrHandle;
	
	jQuery.fn.extend({
		attr: function( name, value ) {
			return access( this, jQuery.attr, name, value, arguments.length > 1 );
		},
	
		removeAttr: function( name ) {
			return this.each(function() {
				jQuery.removeAttr( this, name );
			});
		}
	});
	
	jQuery.extend({
		attr: function( elem, name, value ) {
			var hooks, ret,
				nType = elem.nodeType;
	
			// don't get/set attributes on text, comment and attribute nodes
			if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === strundefined ) {
				return jQuery.prop( elem, name, value );
			}
	
			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[ name ] ||
					( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
			}
	
			if ( value !== undefined ) {
	
				if ( value === null ) {
					jQuery.removeAttr( elem, name );
	
				} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
					return ret;
	
				} else {
					elem.setAttribute( name, value + "" );
					return value;
				}
	
			} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;
	
			} else {
				ret = jQuery.find.attr( elem, name );
	
				// Non-existent attributes return null, we normalize to undefined
				return ret == null ?
					undefined :
					ret;
			}
		},
	
		removeAttr: function( elem, value ) {
			var name, propName,
				i = 0,
				attrNames = value && value.match( rnotwhite );
	
			if ( attrNames && elem.nodeType === 1 ) {
				while ( (name = attrNames[i++]) ) {
					propName = jQuery.propFix[ name ] || name;
	
					// Boolean attributes get special treatment (#10870)
					if ( jQuery.expr.match.bool.test( name ) ) {
						// Set corresponding property to false
						elem[ propName ] = false;
					}
	
					elem.removeAttribute( name );
				}
			}
		},
	
		attrHooks: {
			type: {
				set: function( elem, value ) {
					if ( !support.radioValue && value === "radio" &&
						jQuery.nodeName( elem, "input" ) ) {
						var val = elem.value;
						elem.setAttribute( "type", value );
						if ( val ) {
							elem.value = val;
						}
						return value;
					}
				}
			}
		}
	});
	
	// Hooks for boolean attributes
	boolHook = {
		set: function( elem, value, name ) {
			if ( value === false ) {
				// Remove boolean attributes when set to false
				jQuery.removeAttr( elem, name );
			} else {
				elem.setAttribute( name, name );
			}
			return name;
		}
	};
	jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
		var getter = attrHandle[ name ] || jQuery.find.attr;
	
		attrHandle[ name ] = function( elem, name, isXML ) {
			var ret, handle;
			if ( !isXML ) {
				// Avoid an infinite loop by temporarily removing this function from the getter
				handle = attrHandle[ name ];
				attrHandle[ name ] = ret;
				ret = getter( elem, name, isXML ) != null ?
					name.toLowerCase() :
					null;
				attrHandle[ name ] = handle;
			}
			return ret;
		};
	});
	
	
	
	
	var rfocusable = /^(?:input|select|textarea|button)$/i;
	
	jQuery.fn.extend({
		prop: function( name, value ) {
			return access( this, jQuery.prop, name, value, arguments.length > 1 );
		},
	
		removeProp: function( name ) {
			return this.each(function() {
				delete this[ jQuery.propFix[ name ] || name ];
			});
		}
	});
	
	jQuery.extend({
		propFix: {
			"for": "htmlFor",
			"class": "className"
		},
	
		prop: function( elem, name, value ) {
			var ret, hooks, notxml,
				nType = elem.nodeType;
	
			// Don't get/set properties on text, comment and attribute nodes
			if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
				return;
			}
	
			notxml = nType !== 1 || !jQuery.isXMLDoc( elem );
	
			if ( notxml ) {
				// Fix name and attach hooks
				name = jQuery.propFix[ name ] || name;
				hooks = jQuery.propHooks[ name ];
			}
	
			if ( value !== undefined ) {
				return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
					ret :
					( elem[ name ] = value );
	
			} else {
				return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
					ret :
					elem[ name ];
			}
		},
	
		propHooks: {
			tabIndex: {
				get: function( elem ) {
					return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
						elem.tabIndex :
						-1;
				}
			}
		}
	});
	
	if ( !support.optSelected ) {
		jQuery.propHooks.selected = {
			get: function( elem ) {
				var parent = elem.parentNode;
				if ( parent && parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
				return null;
			}
		};
	}
	
	jQuery.each([
		"tabIndex",
		"readOnly",
		"maxLength",
		"cellSpacing",
		"cellPadding",
		"rowSpan",
		"colSpan",
		"useMap",
		"frameBorder",
		"contentEditable"
	], function() {
		jQuery.propFix[ this.toLowerCase() ] = this;
	});
	
	
	
	
	var rclass = /[\t\r\n\f]/g;
	
	jQuery.fn.extend({
		addClass: function( value ) {
			var classes, elem, cur, clazz, j, finalValue,
				proceed = typeof value === "string" && value,
				i = 0,
				len = this.length;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each(function( j ) {
					jQuery( this ).addClass( value.call( this, j, this.className ) );
				});
			}
	
			if ( proceed ) {
				// The disjunction here is for better compressibility (see removeClass)
				classes = ( value || "" ).match( rnotwhite ) || [];
	
				for ( ; i < len; i++ ) {
					elem = this[ i ];
					cur = elem.nodeType === 1 && ( elem.className ?
						( " " + elem.className + " " ).replace( rclass, " " ) :
						" "
					);
	
					if ( cur ) {
						j = 0;
						while ( (clazz = classes[j++]) ) {
							if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
								cur += clazz + " ";
							}
						}
	
						// only assign if different to avoid unneeded rendering.
						finalValue = jQuery.trim( cur );
						if ( elem.className !== finalValue ) {
							elem.className = finalValue;
						}
					}
				}
			}
	
			return this;
		},
	
		removeClass: function( value ) {
			var classes, elem, cur, clazz, j, finalValue,
				proceed = arguments.length === 0 || typeof value === "string" && value,
				i = 0,
				len = this.length;
	
			if ( jQuery.isFunction( value ) ) {
				return this.each(function( j ) {
					jQuery( this ).removeClass( value.call( this, j, this.className ) );
				});
			}
			if ( proceed ) {
				classes = ( value || "" ).match( rnotwhite ) || [];
	
				for ( ; i < len; i++ ) {
					elem = this[ i ];
					// This expression is here for better compressibility (see addClass)
					cur = elem.nodeType === 1 && ( elem.className ?
						( " " + elem.className + " " ).replace( rclass, " " ) :
						""
					);
	
					if ( cur ) {
						j = 0;
						while ( (clazz = classes[j++]) ) {
							// Remove *all* instances
							while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
								cur = cur.replace( " " + clazz + " ", " " );
							}
						}
	
						// Only assign if different to avoid unneeded rendering.
						finalValue = value ? jQuery.trim( cur ) : "";
						if ( elem.className !== finalValue ) {
							elem.className = finalValue;
						}
					}
				}
			}
	
			return this;
		},
	
		toggleClass: function( value, stateVal ) {
			var type = typeof value;
	
			if ( typeof stateVal === "boolean" && type === "string" ) {
				return stateVal ? this.addClass( value ) : this.removeClass( value );
			}
	
			if ( jQuery.isFunction( value ) ) {
				return this.each(function( i ) {
					jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
				});
			}
	
			return this.each(function() {
				if ( type === "string" ) {
					// Toggle individual class names
					var className,
						i = 0,
						self = jQuery( this ),
						classNames = value.match( rnotwhite ) || [];
	
					while ( (className = classNames[ i++ ]) ) {
						// Check each className given, space separated list
						if ( self.hasClass( className ) ) {
							self.removeClass( className );
						} else {
							self.addClass( className );
						}
					}
	
				// Toggle whole class name
				} else if ( type === strundefined || type === "boolean" ) {
					if ( this.className ) {
						// store className if set
						data_priv.set( this, "__className__", this.className );
					}
	
					// If the element has a class name or if we're passed `false`,
					// then remove the whole classname (if there was one, the above saved it).
					// Otherwise bring back whatever was previously saved (if anything),
					// falling back to the empty string if nothing was stored.
					this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
				}
			});
		},
	
		hasClass: function( selector ) {
			var className = " " + selector + " ",
				i = 0,
				l = this.length;
			for ( ; i < l; i++ ) {
				if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
					return true;
				}
			}
	
			return false;
		}
	});
	
	
	
	
	var rreturn = /\r/g;
	
	jQuery.fn.extend({
		val: function( value ) {
			var hooks, ret, isFunction,
				elem = this[0];
	
			if ( !arguments.length ) {
				if ( elem ) {
					hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];
	
					if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
						return ret;
					}
	
					ret = elem.value;
	
					return typeof ret === "string" ?
						// Handle most common string cases
						ret.replace(rreturn, "") :
						// Handle cases where value is null/undef or number
						ret == null ? "" : ret;
				}
	
				return;
			}
	
			isFunction = jQuery.isFunction( value );
	
			return this.each(function( i ) {
				var val;
	
				if ( this.nodeType !== 1 ) {
					return;
				}
	
				if ( isFunction ) {
					val = value.call( this, i, jQuery( this ).val() );
				} else {
					val = value;
				}
	
				// Treat null/undefined as ""; convert numbers to string
				if ( val == null ) {
					val = "";
	
				} else if ( typeof val === "number" ) {
					val += "";
	
				} else if ( jQuery.isArray( val ) ) {
					val = jQuery.map( val, function( value ) {
						return value == null ? "" : value + "";
					});
				}
	
				hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];
	
				// If set returns undefined, fall back to normal setting
				if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
					this.value = val;
				}
			});
		}
	});
	
	jQuery.extend({
		valHooks: {
			option: {
				get: function( elem ) {
					var val = jQuery.find.attr( elem, "value" );
					return val != null ?
						val :
						// Support: IE10-11+
						// option.text throws exceptions (#14686, #14858)
						jQuery.trim( jQuery.text( elem ) );
				}
			},
			select: {
				get: function( elem ) {
					var value, option,
						options = elem.options,
						index = elem.selectedIndex,
						one = elem.type === "select-one" || index < 0,
						values = one ? null : [],
						max = one ? index + 1 : options.length,
						i = index < 0 ?
							max :
							one ? index : 0;
	
					// Loop through all the selected options
					for ( ; i < max; i++ ) {
						option = options[ i ];
	
						// IE6-9 doesn't update selected after form reset (#2551)
						if ( ( option.selected || i === index ) &&
								// Don't return options that are disabled or in a disabled optgroup
								( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
								( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {
	
							// Get the specific value for the option
							value = jQuery( option ).val();
	
							// We don't need an array for one selects
							if ( one ) {
								return value;
							}
	
							// Multi-Selects return an array
							values.push( value );
						}
					}
	
					return values;
				},
	
				set: function( elem, value ) {
					var optionSet, option,
						options = elem.options,
						values = jQuery.makeArray( value ),
						i = options.length;
	
					while ( i-- ) {
						option = options[ i ];
						if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
							optionSet = true;
						}
					}
	
					// Force browsers to behave consistently when non-matching value is set
					if ( !optionSet ) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		}
	});
	
	// Radios and checkboxes getter/setter
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			set: function( elem, value ) {
				if ( jQuery.isArray( value ) ) {
					return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
				}
			}
		};
		if ( !support.checkOn ) {
			jQuery.valHooks[ this ].get = function( elem ) {
				return elem.getAttribute("value") === null ? "on" : elem.value;
			};
		}
	});
	
	
	
	
	// Return jQuery for attributes-only inclusion
	
	
	jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {
	
		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	});
	
	jQuery.fn.extend({
		hover: function( fnOver, fnOut ) {
			return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
		},
	
		bind: function( types, data, fn ) {
			return this.on( types, null, data, fn );
		},
		unbind: function( types, fn ) {
			return this.off( types, null, fn );
		},
	
		delegate: function( selector, types, data, fn ) {
			return this.on( types, selector, data, fn );
		},
		undelegate: function( selector, types, fn ) {
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
		}
	});
	
	
	var nonce = jQuery.now();
	
	var rquery = (/\?/);
	
	
	
	// Support: Android 2.3
	// Workaround failure to string-cast null input
	jQuery.parseJSON = function( data ) {
		return JSON.parse( data + "" );
	};
	
	
	// Cross-browser xml parsing
	jQuery.parseXML = function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
	
		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data, "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}
	
		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	};
	
	
	var
		rhash = /#.*$/,
		rts = /([?&])_=[^&]*/,
		rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
		// #7653, #8125, #8152: local protocol detection
		rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		rnoContent = /^(?:GET|HEAD)$/,
		rprotocol = /^\/\//,
		rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
	
		/* Prefilters
		 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
		 * 2) These are called:
		 *    - BEFORE asking for a transport
		 *    - AFTER param serialization (s.data is a string if s.processData is true)
		 * 3) key is the dataType
		 * 4) the catchall symbol "*" can be used
		 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
		 */
		prefilters = {},
	
		/* Transports bindings
		 * 1) key is the dataType
		 * 2) the catchall symbol "*" can be used
		 * 3) selection will start with transport dataType and THEN go to "*" if needed
		 */
		transports = {},
	
		// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
		allTypes = "*/".concat( "*" ),
	
		// Document location
		ajaxLocation = window.location.href,
	
		// Segment location into parts
		ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];
	
	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports( structure ) {
	
		// dataTypeExpression is optional and defaults to "*"
		return function( dataTypeExpression, func ) {
	
			if ( typeof dataTypeExpression !== "string" ) {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}
	
			var dataType,
				i = 0,
				dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];
	
			if ( jQuery.isFunction( func ) ) {
				// For each dataType in the dataTypeExpression
				while ( (dataType = dataTypes[i++]) ) {
					// Prepend if requested
					if ( dataType[0] === "+" ) {
						dataType = dataType.slice( 1 ) || "*";
						(structure[ dataType ] = structure[ dataType ] || []).unshift( func );
	
					// Otherwise append
					} else {
						(structure[ dataType ] = structure[ dataType ] || []).push( func );
					}
				}
			}
		};
	}
	
	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {
	
		var inspected = {},
			seekingTransport = ( structure === transports );
	
		function inspect( dataType ) {
			var selected;
			inspected[ dataType ] = true;
			jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
				var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
				if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
					options.dataTypes.unshift( dataTypeOrTransport );
					inspect( dataTypeOrTransport );
					return false;
				} else if ( seekingTransport ) {
					return !( selected = dataTypeOrTransport );
				}
			});
			return selected;
		}
	
		return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
	}
	
	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend( target, src ) {
		var key, deep,
			flatOptions = jQuery.ajaxSettings.flatOptions || {};
	
		for ( key in src ) {
			if ( src[ key ] !== undefined ) {
				( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
			}
		}
		if ( deep ) {
			jQuery.extend( true, target, deep );
		}
	
		return target;
	}
	
	/* Handles responses to an ajax request:
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses( s, jqXHR, responses ) {
	
		var ct, type, finalDataType, firstDataType,
			contents = s.contents,
			dataTypes = s.dataTypes;
	
		// Remove auto dataType and get content-type in the process
		while ( dataTypes[ 0 ] === "*" ) {
			dataTypes.shift();
			if ( ct === undefined ) {
				ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
			}
		}
	
		// Check if we're dealing with a known content-type
		if ( ct ) {
			for ( type in contents ) {
				if ( contents[ type ] && contents[ type ].test( ct ) ) {
					dataTypes.unshift( type );
					break;
				}
			}
		}
	
		// Check to see if we have a response for the expected dataType
		if ( dataTypes[ 0 ] in responses ) {
			finalDataType = dataTypes[ 0 ];
		} else {
			// Try convertible dataTypes
			for ( type in responses ) {
				if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
					finalDataType = type;
					break;
				}
				if ( !firstDataType ) {
					firstDataType = type;
				}
			}
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}
	
		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if ( finalDataType ) {
			if ( finalDataType !== dataTypes[ 0 ] ) {
				dataTypes.unshift( finalDataType );
			}
			return responses[ finalDataType ];
		}
	}
	
	/* Chain conversions given the request and the original response
	 * Also sets the responseXXX fields on the jqXHR instance
	 */
	function ajaxConvert( s, response, jqXHR, isSuccess ) {
		var conv2, current, conv, tmp, prev,
			converters = {},
			// Work with a copy of dataTypes in case we need to modify it for conversion
			dataTypes = s.dataTypes.slice();
	
		// Create converters map with lowercased keys
		if ( dataTypes[ 1 ] ) {
			for ( conv in s.converters ) {
				converters[ conv.toLowerCase() ] = s.converters[ conv ];
			}
		}
	
		current = dataTypes.shift();
	
		// Convert to each sequential dataType
		while ( current ) {
	
			if ( s.responseFields[ current ] ) {
				jqXHR[ s.responseFields[ current ] ] = response;
			}
	
			// Apply the dataFilter if provided
			if ( !prev && isSuccess && s.dataFilter ) {
				response = s.dataFilter( response, s.dataType );
			}
	
			prev = current;
			current = dataTypes.shift();
	
			if ( current ) {
	
			// There's only work to do if current dataType is non-auto
				if ( current === "*" ) {
	
					current = prev;
	
				// Convert response if prev dataType is non-auto and differs from current
				} else if ( prev !== "*" && prev !== current ) {
	
					// Seek a direct converter
					conv = converters[ prev + " " + current ] || converters[ "* " + current ];
	
					// If none found, seek a pair
					if ( !conv ) {
						for ( conv2 in converters ) {
	
							// If conv2 outputs current
							tmp = conv2.split( " " );
							if ( tmp[ 1 ] === current ) {
	
								// If prev can be converted to accepted input
								conv = converters[ prev + " " + tmp[ 0 ] ] ||
									converters[ "* " + tmp[ 0 ] ];
								if ( conv ) {
									// Condense equivalence converters
									if ( conv === true ) {
										conv = converters[ conv2 ];
	
									// Otherwise, insert the intermediate dataType
									} else if ( converters[ conv2 ] !== true ) {
										current = tmp[ 0 ];
										dataTypes.unshift( tmp[ 1 ] );
									}
									break;
								}
							}
						}
					}
	
					// Apply converter (if not an equivalence)
					if ( conv !== true ) {
	
						// Unless errors are allowed to bubble, catch and return them
						if ( conv && s[ "throws" ] ) {
							response = conv( response );
						} else {
							try {
								response = conv( response );
							} catch ( e ) {
								return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
							}
						}
					}
				}
			}
		}
	
		return { state: "success", data: response };
	}
	
	jQuery.extend({
	
		// Counter for holding the number of active queries
		active: 0,
	
		// Last-Modified header cache for next request
		lastModified: {},
		etag: {},
	
		ajaxSettings: {
			url: ajaxLocation,
			type: "GET",
			isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
			global: true,
			processData: true,
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			/*
			timeout: 0,
			data: null,
			dataType: null,
			username: null,
			password: null,
			cache: null,
			throws: false,
			traditional: false,
			headers: {},
			*/
	
			accepts: {
				"*": allTypes,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
	
			contents: {
				xml: /xml/,
				html: /html/,
				json: /json/
			},
	
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
	
			// Data converters
			// Keys separate source (or catchall "*") and destination types with a single space
			converters: {
	
				// Convert anything to text
				"* text": String,
	
				// Text to html (true = no transformation)
				"text html": true,
	
				// Evaluate text as a json expression
				"text json": jQuery.parseJSON,
	
				// Parse text as xml
				"text xml": jQuery.parseXML
			},
	
			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions: {
				url: true,
				context: true
			}
		},
	
		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup: function( target, settings ) {
			return settings ?
	
				// Building a settings object
				ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
	
				// Extending ajaxSettings
				ajaxExtend( jQuery.ajaxSettings, target );
		},
	
		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),
	
		// Main method
		ajax: function( url, options ) {
	
			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object" ) {
				options = url;
				url = undefined;
			}
	
			// Force options to be an object
			options = options || {};
	
			var transport,
				// URL without anti-cache param
				cacheURL,
				// Response headers
				responseHeadersString,
				responseHeaders,
				// timeout handle
				timeoutTimer,
				// Cross-domain detection vars
				parts,
				// To know if global events are to be dispatched
				fireGlobals,
				// Loop variable
				i,
				// Create the final options object
				s = jQuery.ajaxSetup( {}, options ),
				// Callbacks context
				callbackContext = s.context || s,
				// Context for global events is callbackContext if it is a DOM node or jQuery collection
				globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,
				// Deferreds
				deferred = jQuery.Deferred(),
				completeDeferred = jQuery.Callbacks("once memory"),
				// Status-dependent callbacks
				statusCode = s.statusCode || {},
				// Headers (they are sent all at once)
				requestHeaders = {},
				requestHeadersNames = {},
				// The jqXHR state
				state = 0,
				// Default abort message
				strAbort = "canceled",
				// Fake xhr
				jqXHR = {
					readyState: 0,
	
					// Builds headers hashtable if needed
					getResponseHeader: function( key ) {
						var match;
						if ( state === 2 ) {
							if ( !responseHeaders ) {
								responseHeaders = {};
								while ( (match = rheaders.exec( responseHeadersString )) ) {
									responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
								}
							}
							match = responseHeaders[ key.toLowerCase() ];
						}
						return match == null ? null : match;
					},
	
					// Raw string
					getAllResponseHeaders: function() {
						return state === 2 ? responseHeadersString : null;
					},
	
					// Caches the header
					setRequestHeader: function( name, value ) {
						var lname = name.toLowerCase();
						if ( !state ) {
							name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
							requestHeaders[ name ] = value;
						}
						return this;
					},
	
					// Overrides response content-type header
					overrideMimeType: function( type ) {
						if ( !state ) {
							s.mimeType = type;
						}
						return this;
					},
	
					// Status-dependent callbacks
					statusCode: function( map ) {
						var code;
						if ( map ) {
							if ( state < 2 ) {
								for ( code in map ) {
									// Lazy-add the new callback in a way that preserves old ones
									statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
								}
							} else {
								// Execute the appropriate callbacks
								jqXHR.always( map[ jqXHR.status ] );
							}
						}
						return this;
					},
	
					// Cancel the request
					abort: function( statusText ) {
						var finalText = statusText || strAbort;
						if ( transport ) {
							transport.abort( finalText );
						}
						done( 0, finalText );
						return this;
					}
				};
	
			// Attach deferreds
			deferred.promise( jqXHR ).complete = completeDeferred.add;
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;
	
			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (prefilters might expect it)
			// Handle falsy url in the settings object (#10093: consistency with old signature)
			// We also use the url parameter if available
			s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
				.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );
	
			// Alias method option to type as per ticket #12004
			s.type = options.method || options.type || s.method || s.type;
	
			// Extract dataTypes list
			s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];
	
			// A cross-domain request is in order when we have a protocol:host:port mismatch
			if ( s.crossDomain == null ) {
				parts = rurl.exec( s.url.toLowerCase() );
				s.crossDomain = !!( parts &&
					( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
						( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
							( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
				);
			}
	
			// Convert data if not already a string
			if ( s.data && s.processData && typeof s.data !== "string" ) {
				s.data = jQuery.param( s.data, s.traditional );
			}
	
			// Apply prefilters
			inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );
	
			// If request was aborted inside a prefilter, stop there
			if ( state === 2 ) {
				return jqXHR;
			}
	
			// We can fire global events as of now if asked to
			// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
			fireGlobals = jQuery.event && s.global;
	
			// Watch for a new set of requests
			if ( fireGlobals && jQuery.active++ === 0 ) {
				jQuery.event.trigger("ajaxStart");
			}
	
			// Uppercase the type
			s.type = s.type.toUpperCase();
	
			// Determine if request has content
			s.hasContent = !rnoContent.test( s.type );
	
			// Save the URL in case we're toying with the If-Modified-Since
			// and/or If-None-Match header later on
			cacheURL = s.url;
	
			// More options handling for requests with no content
			if ( !s.hasContent ) {
	
				// If data is available, append data to url
				if ( s.data ) {
					cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}
	
				// Add anti-cache in url if needed
				if ( s.cache === false ) {
					s.url = rts.test( cacheURL ) ?
	
						// If there is already a '_' parameter, set its value
						cacheURL.replace( rts, "$1_=" + nonce++ ) :
	
						// Otherwise add one to the end
						cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
				}
			}
	
			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
				}
				if ( jQuery.etag[ cacheURL ] ) {
					jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
				}
			}
	
			// Set the correct header, if data is being sent
			if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
				jqXHR.setRequestHeader( "Content-Type", s.contentType );
			}
	
			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader(
				"Accept",
				s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
					s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
					s.accepts[ "*" ]
			);
	
			// Check for headers option
			for ( i in s.headers ) {
				jqXHR.setRequestHeader( i, s.headers[ i ] );
			}
	
			// Allow custom headers/mimetypes and early abort
			if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already and return
				return jqXHR.abort();
			}
	
			// Aborting is no longer a cancellation
			strAbort = "abort";
	
			// Install callbacks on deferreds
			for ( i in { success: 1, error: 1, complete: 1 } ) {
				jqXHR[ i ]( s[ i ] );
			}
	
			// Get transport
			transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );
	
			// If no transport, we auto-abort
			if ( !transport ) {
				done( -1, "No Transport" );
			} else {
				jqXHR.readyState = 1;
	
				// Send global event
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
				}
				// Timeout
				if ( s.async && s.timeout > 0 ) {
					timeoutTimer = setTimeout(function() {
						jqXHR.abort("timeout");
					}, s.timeout );
				}
	
				try {
					state = 1;
					transport.send( requestHeaders, done );
				} catch ( e ) {
					// Propagate exception as error if not done
					if ( state < 2 ) {
						done( -1, e );
					// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}
	
			// Callback for when everything is done
			function done( status, nativeStatusText, responses, headers ) {
				var isSuccess, success, error, response, modified,
					statusText = nativeStatusText;
	
				// Called once
				if ( state === 2 ) {
					return;
				}
	
				// State is "done" now
				state = 2;
	
				// Clear timeout if it exists
				if ( timeoutTimer ) {
					clearTimeout( timeoutTimer );
				}
	
				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;
	
				// Cache response headers
				responseHeadersString = headers || "";
	
				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;
	
				// Determine if successful
				isSuccess = status >= 200 && status < 300 || status === 304;
	
				// Get response data
				if ( responses ) {
					response = ajaxHandleResponses( s, jqXHR, responses );
				}
	
				// Convert no matter what (that way responseXXX fields are always set)
				response = ajaxConvert( s, response, jqXHR, isSuccess );
	
				// If successful, handle type chaining
				if ( isSuccess ) {
	
					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if ( s.ifModified ) {
						modified = jqXHR.getResponseHeader("Last-Modified");
						if ( modified ) {
							jQuery.lastModified[ cacheURL ] = modified;
						}
						modified = jqXHR.getResponseHeader("etag");
						if ( modified ) {
							jQuery.etag[ cacheURL ] = modified;
						}
					}
	
					// if no content
					if ( status === 204 || s.type === "HEAD" ) {
						statusText = "nocontent";
	
					// if not modified
					} else if ( status === 304 ) {
						statusText = "notmodified";
	
					// If we have data, let's convert it
					} else {
						statusText = response.state;
						success = response.data;
						error = response.error;
						isSuccess = !error;
					}
				} else {
					// Extract error from statusText and normalize for non-aborts
					error = statusText;
					if ( status || !statusText ) {
						statusText = "error";
						if ( status < 0 ) {
							status = 0;
						}
					}
				}
	
				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = ( nativeStatusText || statusText ) + "";
	
				// Success/Error
				if ( isSuccess ) {
					deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
				} else {
					deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
				}
	
				// Status-dependent callbacks
				jqXHR.statusCode( statusCode );
				statusCode = undefined;
	
				if ( fireGlobals ) {
					globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
						[ jqXHR, s, isSuccess ? success : error ] );
				}
	
				// Complete
				completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );
	
				if ( fireGlobals ) {
					globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
					// Handle the global AJAX counter
					if ( !( --jQuery.active ) ) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}
	
			return jqXHR;
		},
	
		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},
	
		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	});
	
	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {
			// Shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}
	
			return jQuery.ajax({
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			});
		};
	});
	
	
	jQuery._evalUrl = function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	};
	
	
	jQuery.fn.extend({
		wrapAll: function( html ) {
			var wrap;
	
			if ( jQuery.isFunction( html ) ) {
				return this.each(function( i ) {
					jQuery( this ).wrapAll( html.call(this, i) );
				});
			}
	
			if ( this[ 0 ] ) {
	
				// The elements to wrap the target around
				wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );
	
				if ( this[ 0 ].parentNode ) {
					wrap.insertBefore( this[ 0 ] );
				}
	
				wrap.map(function() {
					var elem = this;
	
					while ( elem.firstElementChild ) {
						elem = elem.firstElementChild;
					}
	
					return elem;
				}).append( this );
			}
	
			return this;
		},
	
		wrapInner: function( html ) {
			if ( jQuery.isFunction( html ) ) {
				return this.each(function( i ) {
					jQuery( this ).wrapInner( html.call(this, i) );
				});
			}
	
			return this.each(function() {
				var self = jQuery( this ),
					contents = self.contents();
	
				if ( contents.length ) {
					contents.wrapAll( html );
	
				} else {
					self.append( html );
				}
			});
		},
	
		wrap: function( html ) {
			var isFunction = jQuery.isFunction( html );
	
			return this.each(function( i ) {
				jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
			});
		},
	
		unwrap: function() {
			return this.parent().each(function() {
				if ( !jQuery.nodeName( this, "body" ) ) {
					jQuery( this ).replaceWith( this.childNodes );
				}
			}).end();
		}
	});
	
	
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};
	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
	
	
	
	
	var r20 = /%20/g,
		rbracket = /\[\]$/,
		rCRLF = /\r?\n/g,
		rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
		rsubmittable = /^(?:input|select|textarea|keygen)/i;
	
	function buildParams( prefix, obj, traditional, add ) {
		var name;
	
		if ( jQuery.isArray( obj ) ) {
			// Serialize array item.
			jQuery.each( obj, function( i, v ) {
				if ( traditional || rbracket.test( prefix ) ) {
					// Treat each array item as a scalar.
					add( prefix, v );
	
				} else {
					// Item is non-scalar (array or object), encode its numeric index.
					buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
				}
			});
	
		} else if ( !traditional && jQuery.type( obj ) === "object" ) {
			// Serialize object item.
			for ( name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}
	
		} else {
			// Serialize scalar item.
			add( prefix, obj );
		}
	}
	
	// Serialize an array of form elements or a set of
	// key/values into a query string
	jQuery.param = function( a, traditional ) {
		var prefix,
			s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};
	
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		}
	
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});
	
		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}
	
		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	};
	
	jQuery.fn.extend({
		serialize: function() {
			return jQuery.param( this.serializeArray() );
		},
		serializeArray: function() {
			return this.map(function() {
				// Can add propHook for "elements" to filter or add form elements
				var elements = jQuery.prop( this, "elements" );
				return elements ? jQuery.makeArray( elements ) : this;
			})
			.filter(function() {
				var type = this.type;
	
				// Use .is( ":disabled" ) so that fieldset[disabled] works
				return this.name && !jQuery( this ).is( ":disabled" ) &&
					rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
					( this.checked || !rcheckableType.test( type ) );
			})
			.map(function( i, elem ) {
				var val = jQuery( this ).val();
	
				return val == null ?
					null :
					jQuery.isArray( val ) ?
						jQuery.map( val, function( val ) {
							return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
						}) :
						{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
			}).get();
		}
	});
	
	
	jQuery.ajaxSettings.xhr = function() {
		try {
			return new XMLHttpRequest();
		} catch( e ) {}
	};
	
	var xhrId = 0,
		xhrCallbacks = {},
		xhrSuccessStatus = {
			// file protocol always yields status code 0, assume 200
			0: 200,
			// Support: IE9
			// #1450: sometimes IE returns 1223 when it should be 204
			1223: 204
		},
		xhrSupported = jQuery.ajaxSettings.xhr();
	
	// Support: IE9
	// Open requests must be manually aborted on unload (#5280)
	// See https://support.microsoft.com/kb/2856746 for more info
	if ( window.attachEvent ) {
		window.attachEvent( "onunload", function() {
			for ( var key in xhrCallbacks ) {
				xhrCallbacks[ key ]();
			}
		});
	}
	
	support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
	support.ajax = xhrSupported = !!xhrSupported;
	
	jQuery.ajaxTransport(function( options ) {
		var callback;
	
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( support.cors || xhrSupported && !options.crossDomain ) {
			return {
				send: function( headers, complete ) {
					var i,
						xhr = options.xhr(),
						id = ++xhrId;
	
					xhr.open( options.type, options.url, options.async, options.username, options.password );
	
					// Apply custom fields if provided
					if ( options.xhrFields ) {
						for ( i in options.xhrFields ) {
							xhr[ i ] = options.xhrFields[ i ];
						}
					}
	
					// Override mime type if needed
					if ( options.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( options.mimeType );
					}
	
					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !options.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}
	
					// Set headers
					for ( i in headers ) {
						xhr.setRequestHeader( i, headers[ i ] );
					}
	
					// Callback
					callback = function( type ) {
						return function() {
							if ( callback ) {
								delete xhrCallbacks[ id ];
								callback = xhr.onload = xhr.onerror = null;
	
								if ( type === "abort" ) {
									xhr.abort();
								} else if ( type === "error" ) {
									complete(
										// file: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								} else {
									complete(
										xhrSuccessStatus[ xhr.status ] || xhr.status,
										xhr.statusText,
										// Support: IE9
										// Accessing binary-data responseText throws an exception
										// (#11426)
										typeof xhr.responseText === "string" ? {
											text: xhr.responseText
										} : undefined,
										xhr.getAllResponseHeaders()
									);
								}
							}
						};
					};
	
					// Listen to events
					xhr.onload = callback();
					xhr.onerror = callback("error");
	
					// Create the abort callback
					callback = xhrCallbacks[ id ] = callback("abort");
	
					try {
						// Do send the request (this may raise an exception)
						xhr.send( options.hasContent && options.data || null );
					} catch ( e ) {
						// #14683: Only rethrow if this hasn't been notified as an error yet
						if ( callback ) {
							throw e;
						}
					}
				},
	
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	});
	
	
	
	
	// Install script dataType
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /(?:java|ecma)script/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	});
	
	// Handle cache's special case and crossDomain
	jQuery.ajaxPrefilter( "script", function( s ) {
		if ( s.cache === undefined ) {
			s.cache = false;
		}
		if ( s.crossDomain ) {
			s.type = "GET";
		}
	});
	
	// Bind script tag hack transport
	jQuery.ajaxTransport( "script", function( s ) {
		// This transport only deals with cross domain requests
		if ( s.crossDomain ) {
			var script, callback;
			return {
				send: function( _, complete ) {
					script = jQuery("<script>").prop({
						async: true,
						charset: s.scriptCharset,
						src: s.url
					}).on(
						"load error",
						callback = function( evt ) {
							script.remove();
							callback = null;
							if ( evt ) {
								complete( evt.type === "error" ? 404 : 200, evt.type );
							}
						}
					);
					document.head.appendChild( script[ 0 ] );
				},
				abort: function() {
					if ( callback ) {
						callback();
					}
				}
			};
		}
	});
	
	
	
	
	var oldCallbacks = [],
		rjsonp = /(=)\?(?=&|$)|\?\?/;
	
	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	});
	
	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {
	
		var callbackName, overwritten, responseContainer,
			jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
				"url" :
				typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
			);
	
		// Handle iff the expected data type is "jsonp" or we have a parameter to set
		if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {
	
			// Get callback name, remembering preexisting value associated with it
			callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
				s.jsonpCallback() :
				s.jsonpCallback;
	
			// Insert callback into url or form data
			if ( jsonProp ) {
				s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
			} else if ( s.jsonp !== false ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
			}
	
			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function() {
				if ( !responseContainer ) {
					jQuery.error( callbackName + " was not called" );
				}
				return responseContainer[ 0 ];
			};
	
			// force json dataType
			s.dataTypes[ 0 ] = "json";
	
			// Install callback
			overwritten = window[ callbackName ];
			window[ callbackName ] = function() {
				responseContainer = arguments;
			};
	
			// Clean-up function (fires after converters)
			jqXHR.always(function() {
				// Restore preexisting value
				window[ callbackName ] = overwritten;
	
				// Save back as free
				if ( s[ callbackName ] ) {
					// make sure that re-using the options doesn't screw things around
					s.jsonpCallback = originalSettings.jsonpCallback;
	
					// save the callback name for future use
					oldCallbacks.push( callbackName );
				}
	
				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( overwritten ) ) {
					overwritten( responseContainer[ 0 ] );
				}
	
				responseContainer = overwritten = undefined;
			});
	
			// Delegate to script
			return "script";
		}
	});
	
	
	
	
	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	jQuery.parseHTML = function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;
	
		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];
	
		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}
	
		parsed = jQuery.buildFragment( [ data ], context, scripts );
	
		if ( scripts && scripts.length ) {
			jQuery( scripts ).remove();
		}
	
		return jQuery.merge( [], parsed.childNodes );
	};
	
	
	// Keep a copy of the old load method
	var _load = jQuery.fn.load;
	
	/**
	 * Load a url into a page
	 */
	jQuery.fn.load = function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );
		}
	
		var selector, type, response,
			self = this,
			off = url.indexOf(" ");
	
		if ( off >= 0 ) {
			selector = jQuery.trim( url.slice( off ) );
			url = url.slice( 0, off );
		}
	
		// If it's a function
		if ( jQuery.isFunction( params ) ) {
	
			// We assume that it's the callback
			callback = params;
			params = undefined;
	
		// Otherwise, build a param string
		} else if ( params && typeof params === "object" ) {
			type = "POST";
		}
	
		// If we have elements to modify, make the request
		if ( self.length > 0 ) {
			jQuery.ajax({
				url: url,
	
				// if "type" variable is undefined, then "GET" method will be used
				type: type,
				dataType: "html",
				data: params
			}).done(function( responseText ) {
	
				// Save response for use in complete callback
				response = arguments;
	
				self.html( selector ?
	
					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :
	
					// Otherwise use the full result
					responseText );
	
			}).complete( callback && function( jqXHR, status ) {
				self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
			});
		}
	
		return this;
	};
	
	
	
	
	// Attach a bunch of functions for handling common AJAX events
	jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	});
	
	
	
	
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
	
	
	
	
	var docElem = window.document.documentElement;
	
	/**
	 * Gets a window from an element
	 */
	function getWindow( elem ) {
		return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
	}
	
	jQuery.offset = {
		setOffset: function( elem, options, i ) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = jQuery.css( elem, "position" ),
				curElem = jQuery( elem ),
				props = {};
	
			// Set position first, in-case top/left are set even on static elem
			if ( position === "static" ) {
				elem.style.position = "relative";
			}
	
			curOffset = curElem.offset();
			curCSSTop = jQuery.css( elem, "top" );
			curCSSLeft = jQuery.css( elem, "left" );
			calculatePosition = ( position === "absolute" || position === "fixed" ) &&
				( curCSSTop + curCSSLeft ).indexOf("auto") > -1;
	
			// Need to be able to calculate position if either
			// top or left is auto and position is either absolute or fixed
			if ( calculatePosition ) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
	
			} else {
				curTop = parseFloat( curCSSTop ) || 0;
				curLeft = parseFloat( curCSSLeft ) || 0;
			}
	
			if ( jQuery.isFunction( options ) ) {
				options = options.call( elem, i, curOffset );
			}
	
			if ( options.top != null ) {
				props.top = ( options.top - curOffset.top ) + curTop;
			}
			if ( options.left != null ) {
				props.left = ( options.left - curOffset.left ) + curLeft;
			}
	
			if ( "using" in options ) {
				options.using.call( elem, props );
	
			} else {
				curElem.css( props );
			}
		}
	};
	
	jQuery.fn.extend({
		offset: function( options ) {
			if ( arguments.length ) {
				return options === undefined ?
					this :
					this.each(function( i ) {
						jQuery.offset.setOffset( this, options, i );
					});
			}
	
			var docElem, win,
				elem = this[ 0 ],
				box = { top: 0, left: 0 },
				doc = elem && elem.ownerDocument;
	
			if ( !doc ) {
				return;
			}
	
			docElem = doc.documentElement;
	
			// Make sure it's not a disconnected DOM node
			if ( !jQuery.contains( docElem, elem ) ) {
				return box;
			}
	
			// Support: BlackBerry 5, iOS 3 (original iPhone)
			// If we don't have gBCR, just use 0,0 rather than error
			if ( typeof elem.getBoundingClientRect !== strundefined ) {
				box = elem.getBoundingClientRect();
			}
			win = getWindow( doc );
			return {
				top: box.top + win.pageYOffset - docElem.clientTop,
				left: box.left + win.pageXOffset - docElem.clientLeft
			};
		},
	
		position: function() {
			if ( !this[ 0 ] ) {
				return;
			}
	
			var offsetParent, offset,
				elem = this[ 0 ],
				parentOffset = { top: 0, left: 0 };
	
			// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
			if ( jQuery.css( elem, "position" ) === "fixed" ) {
				// Assume getBoundingClientRect is there when computed position is fixed
				offset = elem.getBoundingClientRect();
	
			} else {
				// Get *real* offsetParent
				offsetParent = this.offsetParent();
	
				// Get correct offsets
				offset = this.offset();
				if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
					parentOffset = offsetParent.offset();
				}
	
				// Add offsetParent borders
				parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
			}
	
			// Subtract parent offsets and element margins
			return {
				top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
				left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
			};
		},
	
		offsetParent: function() {
			return this.map(function() {
				var offsetParent = this.offsetParent || docElem;
	
				while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
					offsetParent = offsetParent.offsetParent;
				}
	
				return offsetParent || docElem;
			});
		}
	});
	
	// Create scrollLeft and scrollTop methods
	jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
		var top = "pageYOffset" === prop;
	
		jQuery.fn[ method ] = function( val ) {
			return access( this, function( elem, method, val ) {
				var win = getWindow( elem );
	
				if ( val === undefined ) {
					return win ? win[ prop ] : elem[ method ];
				}
	
				if ( win ) {
					win.scrollTo(
						!top ? val : window.pageXOffset,
						top ? val : window.pageYOffset
					);
	
				} else {
					elem[ method ] = val;
				}
			}, method, val, arguments.length, null );
		};
	});
	
	// Support: Safari<7+, Chrome<37+
	// Add the top/left cssHooks using jQuery.fn.position
	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
	// getComputedStyle returns percent when specified for top/left/bottom/right;
	// rather than make the css module depend on the offset module, just check for it here
	jQuery.each( [ "top", "left" ], function( i, prop ) {
		jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
			function( elem, computed ) {
				if ( computed ) {
					computed = curCSS( elem, prop );
					// If curCSS returns percentage, fallback to offset
					return rnumnonpx.test( computed ) ?
						jQuery( elem ).position()[ prop ] + "px" :
						computed;
				}
			}
		);
	});
	
	
	// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
	jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
		jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
			// Margin is only for outerHeight, outerWidth
			jQuery.fn[ funcName ] = function( margin, value ) {
				var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
					extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );
	
				return access( this, function( elem, type, value ) {
					var doc;
	
					if ( jQuery.isWindow( elem ) ) {
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement[ "client" + name ];
					}
	
					// Get document width or height
					if ( elem.nodeType === 9 ) {
						doc = elem.documentElement;
	
						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body[ "scroll" + name ], doc[ "scroll" + name ],
							elem.body[ "offset" + name ], doc[ "offset" + name ],
							doc[ "client" + name ]
						);
					}
	
					return value === undefined ?
						// Get width or height on the element, requesting but not forcing parseFloat
						jQuery.css( elem, type, extra ) :
	
						// Set width or height on the element
						jQuery.style( elem, type, value, extra );
				}, type, chainable ? margin : undefined, chainable, null );
			};
		});
	});
	
	
	// The number of elements contained in the matched element set
	jQuery.fn.size = function() {
		return this.length;
	};
	
	jQuery.fn.andSelf = jQuery.fn.addBack;
	
	
	
	
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	
	// Note that for maximum portability, libraries that are not jQuery should
	// declare themselves as anonymous modules, and avoid setting a global if an
	// AMD loader is present. jQuery is a special case. For more information, see
	// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon
	
	if ( true ) {
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return jQuery;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	
	
	
	
	var
		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,
	
		// Map over the $ in case of overwrite
		_$ = window.$;
	
	jQuery.noConflict = function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}
	
		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}
	
		return jQuery;
	};
	
	// Expose jQuery and $ identifiers, even in AMD
	// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
	// and CommonJS for browser emulators (#13566)
	if ( typeof noGlobal === strundefined ) {
		window.jQuery = window.$ = jQuery;
	}
	
	
	
	
	return jQuery;
	
	}));


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.8.3
	//     http://underscorejs.org
	//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	//     Underscore may be freely distributed under the MIT license.
	
	(function() {
	
	  // Baseline setup
	  // --------------
	
	  // Establish the root object, `window` in the browser, or `exports` on the server.
	  var root = this;
	
	  // Save the previous value of the `_` variable.
	  var previousUnderscore = root._;
	
	  // Save bytes in the minified (but not gzipped) version:
	  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
	
	  // Create quick reference variables for speed access to core prototypes.
	  var
	    push             = ArrayProto.push,
	    slice            = ArrayProto.slice,
	    toString         = ObjProto.toString,
	    hasOwnProperty   = ObjProto.hasOwnProperty;
	
	  // All **ECMAScript 5** native function implementations that we hope to use
	  // are declared here.
	  var
	    nativeIsArray      = Array.isArray,
	    nativeKeys         = Object.keys,
	    nativeBind         = FuncProto.bind,
	    nativeCreate       = Object.create;
	
	  // Naked function reference for surrogate-prototype-swapping.
	  var Ctor = function(){};
	
	  // Create a safe reference to the Underscore object for use below.
	  var _ = function(obj) {
	    if (obj instanceof _) return obj;
	    if (!(this instanceof _)) return new _(obj);
	    this._wrapped = obj;
	  };
	
	  // Export the Underscore object for **Node.js**, with
	  // backwards-compatibility for the old `require()` API. If we're in
	  // the browser, add `_` as a global object.
	  if (true) {
	    if (typeof module !== 'undefined' && module.exports) {
	      exports = module.exports = _;
	    }
	    exports._ = _;
	  } else {
	    root._ = _;
	  }
	
	  // Current version.
	  _.VERSION = '1.8.3';
	
	  // Internal function that returns an efficient (for current engines) version
	  // of the passed-in callback, to be repeatedly applied in other Underscore
	  // functions.
	  var optimizeCb = function(func, context, argCount) {
	    if (context === void 0) return func;
	    switch (argCount == null ? 3 : argCount) {
	      case 1: return function(value) {
	        return func.call(context, value);
	      };
	      case 2: return function(value, other) {
	        return func.call(context, value, other);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(context, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(context, accumulator, value, index, collection);
	      };
	    }
	    return function() {
	      return func.apply(context, arguments);
	    };
	  };
	
	  // A mostly-internal function to generate callbacks that can be applied
	  // to each element in a collection, returning the desired result — either
	  // identity, an arbitrary callback, a property matcher, or a property accessor.
	  var cb = function(value, context, argCount) {
	    if (value == null) return _.identity;
	    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
	    if (_.isObject(value)) return _.matcher(value);
	    return _.property(value);
	  };
	  _.iteratee = function(value, context) {
	    return cb(value, context, Infinity);
	  };
	
	  // An internal function for creating assigner functions.
	  var createAssigner = function(keysFunc, undefinedOnly) {
	    return function(obj) {
	      var length = arguments.length;
	      if (length < 2 || obj == null) return obj;
	      for (var index = 1; index < length; index++) {
	        var source = arguments[index],
	            keys = keysFunc(source),
	            l = keys.length;
	        for (var i = 0; i < l; i++) {
	          var key = keys[i];
	          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
	        }
	      }
	      return obj;
	    };
	  };
	
	  // An internal function for creating a new object that inherits from another.
	  var baseCreate = function(prototype) {
	    if (!_.isObject(prototype)) return {};
	    if (nativeCreate) return nativeCreate(prototype);
	    Ctor.prototype = prototype;
	    var result = new Ctor;
	    Ctor.prototype = null;
	    return result;
	  };
	
	  var property = function(key) {
	    return function(obj) {
	      return obj == null ? void 0 : obj[key];
	    };
	  };
	
	  // Helper for collection methods to determine whether a collection
	  // should be iterated as an array or as an object
	  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
	  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
	  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
	  var getLength = property('length');
	  var isArrayLike = function(collection) {
	    var length = getLength(collection);
	    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
	  };
	
	  // Collection Functions
	  // --------------------
	
	  // The cornerstone, an `each` implementation, aka `forEach`.
	  // Handles raw objects in addition to array-likes. Treats all
	  // sparse array-likes as if they were dense.
	  _.each = _.forEach = function(obj, iteratee, context) {
	    iteratee = optimizeCb(iteratee, context);
	    var i, length;
	    if (isArrayLike(obj)) {
	      for (i = 0, length = obj.length; i < length; i++) {
	        iteratee(obj[i], i, obj);
	      }
	    } else {
	      var keys = _.keys(obj);
	      for (i = 0, length = keys.length; i < length; i++) {
	        iteratee(obj[keys[i]], keys[i], obj);
	      }
	    }
	    return obj;
	  };
	
	  // Return the results of applying the iteratee to each element.
	  _.map = _.collect = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length,
	        results = Array(length);
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      results[index] = iteratee(obj[currentKey], currentKey, obj);
	    }
	    return results;
	  };
	
	  // Create a reducing function iterating left or right.
	  function createReduce(dir) {
	    // Optimized iterator function as using arguments.length
	    // in the main function will deoptimize the, see #1991.
	    function iterator(obj, iteratee, memo, keys, index, length) {
	      for (; index >= 0 && index < length; index += dir) {
	        var currentKey = keys ? keys[index] : index;
	        memo = iteratee(memo, obj[currentKey], currentKey, obj);
	      }
	      return memo;
	    }
	
	    return function(obj, iteratee, memo, context) {
	      iteratee = optimizeCb(iteratee, context, 4);
	      var keys = !isArrayLike(obj) && _.keys(obj),
	          length = (keys || obj).length,
	          index = dir > 0 ? 0 : length - 1;
	      // Determine the initial value if none is provided.
	      if (arguments.length < 3) {
	        memo = obj[keys ? keys[index] : index];
	        index += dir;
	      }
	      return iterator(obj, iteratee, memo, keys, index, length);
	    };
	  }
	
	  // **Reduce** builds up a single result from a list of values, aka `inject`,
	  // or `foldl`.
	  _.reduce = _.foldl = _.inject = createReduce(1);
	
	  // The right-associative version of reduce, also known as `foldr`.
	  _.reduceRight = _.foldr = createReduce(-1);
	
	  // Return the first value which passes a truth test. Aliased as `detect`.
	  _.find = _.detect = function(obj, predicate, context) {
	    var key;
	    if (isArrayLike(obj)) {
	      key = _.findIndex(obj, predicate, context);
	    } else {
	      key = _.findKey(obj, predicate, context);
	    }
	    if (key !== void 0 && key !== -1) return obj[key];
	  };
	
	  // Return all the elements that pass a truth test.
	  // Aliased as `select`.
	  _.filter = _.select = function(obj, predicate, context) {
	    var results = [];
	    predicate = cb(predicate, context);
	    _.each(obj, function(value, index, list) {
	      if (predicate(value, index, list)) results.push(value);
	    });
	    return results;
	  };
	
	  // Return all the elements for which a truth test fails.
	  _.reject = function(obj, predicate, context) {
	    return _.filter(obj, _.negate(cb(predicate)), context);
	  };
	
	  // Determine whether all of the elements match a truth test.
	  // Aliased as `all`.
	  _.every = _.all = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (!predicate(obj[currentKey], currentKey, obj)) return false;
	    }
	    return true;
	  };
	
	  // Determine if at least one element in the object matches a truth test.
	  // Aliased as `any`.
	  _.some = _.any = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = !isArrayLike(obj) && _.keys(obj),
	        length = (keys || obj).length;
	    for (var index = 0; index < length; index++) {
	      var currentKey = keys ? keys[index] : index;
	      if (predicate(obj[currentKey], currentKey, obj)) return true;
	    }
	    return false;
	  };
	
	  // Determine if the array or object contains a given item (using `===`).
	  // Aliased as `includes` and `include`.
	  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
	    if (!isArrayLike(obj)) obj = _.values(obj);
	    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
	    return _.indexOf(obj, item, fromIndex) >= 0;
	  };
	
	  // Invoke a method (with arguments) on every item in a collection.
	  _.invoke = function(obj, method) {
	    var args = slice.call(arguments, 2);
	    var isFunc = _.isFunction(method);
	    return _.map(obj, function(value) {
	      var func = isFunc ? method : value[method];
	      return func == null ? func : func.apply(value, args);
	    });
	  };
	
	  // Convenience version of a common use case of `map`: fetching a property.
	  _.pluck = function(obj, key) {
	    return _.map(obj, _.property(key));
	  };
	
	  // Convenience version of a common use case of `filter`: selecting only objects
	  // containing specific `key:value` pairs.
	  _.where = function(obj, attrs) {
	    return _.filter(obj, _.matcher(attrs));
	  };
	
	  // Convenience version of a common use case of `find`: getting the first object
	  // containing specific `key:value` pairs.
	  _.findWhere = function(obj, attrs) {
	    return _.find(obj, _.matcher(attrs));
	  };
	
	  // Return the maximum element (or element-based computation).
	  _.max = function(obj, iteratee, context) {
	    var result = -Infinity, lastComputed = -Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value > result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Return the minimum element (or element-based computation).
	  _.min = function(obj, iteratee, context) {
	    var result = Infinity, lastComputed = Infinity,
	        value, computed;
	    if (iteratee == null && obj != null) {
	      obj = isArrayLike(obj) ? obj : _.values(obj);
	      for (var i = 0, length = obj.length; i < length; i++) {
	        value = obj[i];
	        if (value < result) {
	          result = value;
	        }
	      }
	    } else {
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index, list) {
	        computed = iteratee(value, index, list);
	        if (computed < lastComputed || computed === Infinity && result === Infinity) {
	          result = value;
	          lastComputed = computed;
	        }
	      });
	    }
	    return result;
	  };
	
	  // Shuffle a collection, using the modern version of the
	  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
	  _.shuffle = function(obj) {
	    var set = isArrayLike(obj) ? obj : _.values(obj);
	    var length = set.length;
	    var shuffled = Array(length);
	    for (var index = 0, rand; index < length; index++) {
	      rand = _.random(0, index);
	      if (rand !== index) shuffled[index] = shuffled[rand];
	      shuffled[rand] = set[index];
	    }
	    return shuffled;
	  };
	
	  // Sample **n** random values from a collection.
	  // If **n** is not specified, returns a single random element.
	  // The internal `guard` argument allows it to work with `map`.
	  _.sample = function(obj, n, guard) {
	    if (n == null || guard) {
	      if (!isArrayLike(obj)) obj = _.values(obj);
	      return obj[_.random(obj.length - 1)];
	    }
	    return _.shuffle(obj).slice(0, Math.max(0, n));
	  };
	
	  // Sort the object's values by a criterion produced by an iteratee.
	  _.sortBy = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    return _.pluck(_.map(obj, function(value, index, list) {
	      return {
	        value: value,
	        index: index,
	        criteria: iteratee(value, index, list)
	      };
	    }).sort(function(left, right) {
	      var a = left.criteria;
	      var b = right.criteria;
	      if (a !== b) {
	        if (a > b || a === void 0) return 1;
	        if (a < b || b === void 0) return -1;
	      }
	      return left.index - right.index;
	    }), 'value');
	  };
	
	  // An internal function used for aggregate "group by" operations.
	  var group = function(behavior) {
	    return function(obj, iteratee, context) {
	      var result = {};
	      iteratee = cb(iteratee, context);
	      _.each(obj, function(value, index) {
	        var key = iteratee(value, index, obj);
	        behavior(result, value, key);
	      });
	      return result;
	    };
	  };
	
	  // Groups the object's values by a criterion. Pass either a string attribute
	  // to group by, or a function that returns the criterion.
	  _.groupBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
	  });
	
	  // Indexes the object's values by a criterion, similar to `groupBy`, but for
	  // when you know that your index values will be unique.
	  _.indexBy = group(function(result, value, key) {
	    result[key] = value;
	  });
	
	  // Counts instances of an object that group by a certain criterion. Pass
	  // either a string attribute to count by, or a function that returns the
	  // criterion.
	  _.countBy = group(function(result, value, key) {
	    if (_.has(result, key)) result[key]++; else result[key] = 1;
	  });
	
	  // Safely create a real, live array from anything iterable.
	  _.toArray = function(obj) {
	    if (!obj) return [];
	    if (_.isArray(obj)) return slice.call(obj);
	    if (isArrayLike(obj)) return _.map(obj, _.identity);
	    return _.values(obj);
	  };
	
	  // Return the number of elements in an object.
	  _.size = function(obj) {
	    if (obj == null) return 0;
	    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
	  };
	
	  // Split a collection into two arrays: one whose elements all satisfy the given
	  // predicate, and one whose elements all do not satisfy the predicate.
	  _.partition = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var pass = [], fail = [];
	    _.each(obj, function(value, key, obj) {
	      (predicate(value, key, obj) ? pass : fail).push(value);
	    });
	    return [pass, fail];
	  };
	
	  // Array Functions
	  // ---------------
	
	  // Get the first element of an array. Passing **n** will return the first N
	  // values in the array. Aliased as `head` and `take`. The **guard** check
	  // allows it to work with `_.map`.
	  _.first = _.head = _.take = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[0];
	    return _.initial(array, array.length - n);
	  };
	
	  // Returns everything but the last entry of the array. Especially useful on
	  // the arguments object. Passing **n** will return all the values in
	  // the array, excluding the last N.
	  _.initial = function(array, n, guard) {
	    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
	  };
	
	  // Get the last element of an array. Passing **n** will return the last N
	  // values in the array.
	  _.last = function(array, n, guard) {
	    if (array == null) return void 0;
	    if (n == null || guard) return array[array.length - 1];
	    return _.rest(array, Math.max(0, array.length - n));
	  };
	
	  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
	  // Especially useful on the arguments object. Passing an **n** will return
	  // the rest N values in the array.
	  _.rest = _.tail = _.drop = function(array, n, guard) {
	    return slice.call(array, n == null || guard ? 1 : n);
	  };
	
	  // Trim out all falsy values from an array.
	  _.compact = function(array) {
	    return _.filter(array, _.identity);
	  };
	
	  // Internal implementation of a recursive `flatten` function.
	  var flatten = function(input, shallow, strict, startIndex) {
	    var output = [], idx = 0;
	    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
	      var value = input[i];
	      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
	        //flatten current level of array or arguments object
	        if (!shallow) value = flatten(value, shallow, strict);
	        var j = 0, len = value.length;
	        output.length += len;
	        while (j < len) {
	          output[idx++] = value[j++];
	        }
	      } else if (!strict) {
	        output[idx++] = value;
	      }
	    }
	    return output;
	  };
	
	  // Flatten out an array, either recursively (by default), or just one level.
	  _.flatten = function(array, shallow) {
	    return flatten(array, shallow, false);
	  };
	
	  // Return a version of the array that does not contain the specified value(s).
	  _.without = function(array) {
	    return _.difference(array, slice.call(arguments, 1));
	  };
	
	  // Produce a duplicate-free version of the array. If the array has already
	  // been sorted, you have the option of using a faster algorithm.
	  // Aliased as `unique`.
	  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
	    if (!_.isBoolean(isSorted)) {
	      context = iteratee;
	      iteratee = isSorted;
	      isSorted = false;
	    }
	    if (iteratee != null) iteratee = cb(iteratee, context);
	    var result = [];
	    var seen = [];
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var value = array[i],
	          computed = iteratee ? iteratee(value, i, array) : value;
	      if (isSorted) {
	        if (!i || seen !== computed) result.push(value);
	        seen = computed;
	      } else if (iteratee) {
	        if (!_.contains(seen, computed)) {
	          seen.push(computed);
	          result.push(value);
	        }
	      } else if (!_.contains(result, value)) {
	        result.push(value);
	      }
	    }
	    return result;
	  };
	
	  // Produce an array that contains the union: each distinct element from all of
	  // the passed-in arrays.
	  _.union = function() {
	    return _.uniq(flatten(arguments, true, true));
	  };
	
	  // Produce an array that contains every item shared between all the
	  // passed-in arrays.
	  _.intersection = function(array) {
	    var result = [];
	    var argsLength = arguments.length;
	    for (var i = 0, length = getLength(array); i < length; i++) {
	      var item = array[i];
	      if (_.contains(result, item)) continue;
	      for (var j = 1; j < argsLength; j++) {
	        if (!_.contains(arguments[j], item)) break;
	      }
	      if (j === argsLength) result.push(item);
	    }
	    return result;
	  };
	
	  // Take the difference between one array and a number of other arrays.
	  // Only the elements present in just the first array will remain.
	  _.difference = function(array) {
	    var rest = flatten(arguments, true, true, 1);
	    return _.filter(array, function(value){
	      return !_.contains(rest, value);
	    });
	  };
	
	  // Zip together multiple lists into a single array -- elements that share
	  // an index go together.
	  _.zip = function() {
	    return _.unzip(arguments);
	  };
	
	  // Complement of _.zip. Unzip accepts an array of arrays and groups
	  // each array's elements on shared indices
	  _.unzip = function(array) {
	    var length = array && _.max(array, getLength).length || 0;
	    var result = Array(length);
	
	    for (var index = 0; index < length; index++) {
	      result[index] = _.pluck(array, index);
	    }
	    return result;
	  };
	
	  // Converts lists into objects. Pass either a single array of `[key, value]`
	  // pairs, or two parallel arrays of the same length -- one of keys, and one of
	  // the corresponding values.
	  _.object = function(list, values) {
	    var result = {};
	    for (var i = 0, length = getLength(list); i < length; i++) {
	      if (values) {
	        result[list[i]] = values[i];
	      } else {
	        result[list[i][0]] = list[i][1];
	      }
	    }
	    return result;
	  };
	
	  // Generator function to create the findIndex and findLastIndex functions
	  function createPredicateIndexFinder(dir) {
	    return function(array, predicate, context) {
	      predicate = cb(predicate, context);
	      var length = getLength(array);
	      var index = dir > 0 ? 0 : length - 1;
	      for (; index >= 0 && index < length; index += dir) {
	        if (predicate(array[index], index, array)) return index;
	      }
	      return -1;
	    };
	  }
	
	  // Returns the first index on an array-like that passes a predicate test
	  _.findIndex = createPredicateIndexFinder(1);
	  _.findLastIndex = createPredicateIndexFinder(-1);
	
	  // Use a comparator function to figure out the smallest index at which
	  // an object should be inserted so as to maintain order. Uses binary search.
	  _.sortedIndex = function(array, obj, iteratee, context) {
	    iteratee = cb(iteratee, context, 1);
	    var value = iteratee(obj);
	    var low = 0, high = getLength(array);
	    while (low < high) {
	      var mid = Math.floor((low + high) / 2);
	      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
	    }
	    return low;
	  };
	
	  // Generator function to create the indexOf and lastIndexOf functions
	  function createIndexFinder(dir, predicateFind, sortedIndex) {
	    return function(array, item, idx) {
	      var i = 0, length = getLength(array);
	      if (typeof idx == 'number') {
	        if (dir > 0) {
	            i = idx >= 0 ? idx : Math.max(idx + length, i);
	        } else {
	            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
	        }
	      } else if (sortedIndex && idx && length) {
	        idx = sortedIndex(array, item);
	        return array[idx] === item ? idx : -1;
	      }
	      if (item !== item) {
	        idx = predicateFind(slice.call(array, i, length), _.isNaN);
	        return idx >= 0 ? idx + i : -1;
	      }
	      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
	        if (array[idx] === item) return idx;
	      }
	      return -1;
	    };
	  }
	
	  // Return the position of the first occurrence of an item in an array,
	  // or -1 if the item is not included in the array.
	  // If the array is large and already in sort order, pass `true`
	  // for **isSorted** to use binary search.
	  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
	  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);
	
	  // Generate an integer Array containing an arithmetic progression. A port of
	  // the native Python `range()` function. See
	  // [the Python documentation](http://docs.python.org/library/functions.html#range).
	  _.range = function(start, stop, step) {
	    if (stop == null) {
	      stop = start || 0;
	      start = 0;
	    }
	    step = step || 1;
	
	    var length = Math.max(Math.ceil((stop - start) / step), 0);
	    var range = Array(length);
	
	    for (var idx = 0; idx < length; idx++, start += step) {
	      range[idx] = start;
	    }
	
	    return range;
	  };
	
	  // Function (ahem) Functions
	  // ------------------
	
	  // Determines whether to execute a function as a constructor
	  // or a normal function with the provided arguments
	  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
	    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
	    var self = baseCreate(sourceFunc.prototype);
	    var result = sourceFunc.apply(self, args);
	    if (_.isObject(result)) return result;
	    return self;
	  };
	
	  // Create a function bound to a given object (assigning `this`, and arguments,
	  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	  // available.
	  _.bind = function(func, context) {
	    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
	    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
	    var args = slice.call(arguments, 2);
	    var bound = function() {
	      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
	    };
	    return bound;
	  };
	
	  // Partially apply a function by creating a version that has had some of its
	  // arguments pre-filled, without changing its dynamic `this` context. _ acts
	  // as a placeholder, allowing any combination of arguments to be pre-filled.
	  _.partial = function(func) {
	    var boundArgs = slice.call(arguments, 1);
	    var bound = function() {
	      var position = 0, length = boundArgs.length;
	      var args = Array(length);
	      for (var i = 0; i < length; i++) {
	        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
	      }
	      while (position < arguments.length) args.push(arguments[position++]);
	      return executeBound(func, bound, this, this, args);
	    };
	    return bound;
	  };
	
	  // Bind a number of an object's methods to that object. Remaining arguments
	  // are the method names to be bound. Useful for ensuring that all callbacks
	  // defined on an object belong to it.
	  _.bindAll = function(obj) {
	    var i, length = arguments.length, key;
	    if (length <= 1) throw new Error('bindAll must be passed function names');
	    for (i = 1; i < length; i++) {
	      key = arguments[i];
	      obj[key] = _.bind(obj[key], obj);
	    }
	    return obj;
	  };
	
	  // Memoize an expensive function by storing its results.
	  _.memoize = function(func, hasher) {
	    var memoize = function(key) {
	      var cache = memoize.cache;
	      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
	      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
	      return cache[address];
	    };
	    memoize.cache = {};
	    return memoize;
	  };
	
	  // Delays a function for the given number of milliseconds, and then calls
	  // it with the arguments supplied.
	  _.delay = function(func, wait) {
	    var args = slice.call(arguments, 2);
	    return setTimeout(function(){
	      return func.apply(null, args);
	    }, wait);
	  };
	
	  // Defers a function, scheduling it to run after the current call stack has
	  // cleared.
	  _.defer = _.partial(_.delay, _, 1);
	
	  // Returns a function, that, when invoked, will only be triggered at most once
	  // during a given window of time. Normally, the throttled function will run
	  // as much as it can, without ever going more than once per `wait` duration;
	  // but if you'd like to disable the execution on the leading edge, pass
	  // `{leading: false}`. To disable execution on the trailing edge, ditto.
	  _.throttle = function(func, wait, options) {
	    var context, args, result;
	    var timeout = null;
	    var previous = 0;
	    if (!options) options = {};
	    var later = function() {
	      previous = options.leading === false ? 0 : _.now();
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    };
	    return function() {
	      var now = _.now();
	      if (!previous && options.leading === false) previous = now;
	      var remaining = wait - (now - previous);
	      context = this;
	      args = arguments;
	      if (remaining <= 0 || remaining > wait) {
	        if (timeout) {
	          clearTimeout(timeout);
	          timeout = null;
	        }
	        previous = now;
	        result = func.apply(context, args);
	        if (!timeout) context = args = null;
	      } else if (!timeout && options.trailing !== false) {
	        timeout = setTimeout(later, remaining);
	      }
	      return result;
	    };
	  };
	
	  // Returns a function, that, as long as it continues to be invoked, will not
	  // be triggered. The function will be called after it stops being called for
	  // N milliseconds. If `immediate` is passed, trigger the function on the
	  // leading edge, instead of the trailing.
	  _.debounce = function(func, wait, immediate) {
	    var timeout, args, context, timestamp, result;
	
	    var later = function() {
	      var last = _.now() - timestamp;
	
	      if (last < wait && last >= 0) {
	        timeout = setTimeout(later, wait - last);
	      } else {
	        timeout = null;
	        if (!immediate) {
	          result = func.apply(context, args);
	          if (!timeout) context = args = null;
	        }
	      }
	    };
	
	    return function() {
	      context = this;
	      args = arguments;
	      timestamp = _.now();
	      var callNow = immediate && !timeout;
	      if (!timeout) timeout = setTimeout(later, wait);
	      if (callNow) {
	        result = func.apply(context, args);
	        context = args = null;
	      }
	
	      return result;
	    };
	  };
	
	  // Returns the first function passed as an argument to the second,
	  // allowing you to adjust arguments, run code before and after, and
	  // conditionally execute the original function.
	  _.wrap = function(func, wrapper) {
	    return _.partial(wrapper, func);
	  };
	
	  // Returns a negated version of the passed-in predicate.
	  _.negate = function(predicate) {
	    return function() {
	      return !predicate.apply(this, arguments);
	    };
	  };
	
	  // Returns a function that is the composition of a list of functions, each
	  // consuming the return value of the function that follows.
	  _.compose = function() {
	    var args = arguments;
	    var start = args.length - 1;
	    return function() {
	      var i = start;
	      var result = args[start].apply(this, arguments);
	      while (i--) result = args[i].call(this, result);
	      return result;
	    };
	  };
	
	  // Returns a function that will only be executed on and after the Nth call.
	  _.after = function(times, func) {
	    return function() {
	      if (--times < 1) {
	        return func.apply(this, arguments);
	      }
	    };
	  };
	
	  // Returns a function that will only be executed up to (but not including) the Nth call.
	  _.before = function(times, func) {
	    var memo;
	    return function() {
	      if (--times > 0) {
	        memo = func.apply(this, arguments);
	      }
	      if (times <= 1) func = null;
	      return memo;
	    };
	  };
	
	  // Returns a function that will be executed at most one time, no matter how
	  // often you call it. Useful for lazy initialization.
	  _.once = _.partial(_.before, 2);
	
	  // Object Functions
	  // ----------------
	
	  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
	  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
	  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
	                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
	
	  function collectNonEnumProps(obj, keys) {
	    var nonEnumIdx = nonEnumerableProps.length;
	    var constructor = obj.constructor;
	    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
	
	    // Constructor is a special case.
	    var prop = 'constructor';
	    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);
	
	    while (nonEnumIdx--) {
	      prop = nonEnumerableProps[nonEnumIdx];
	      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
	        keys.push(prop);
	      }
	    }
	  }
	
	  // Retrieve the names of an object's own properties.
	  // Delegates to **ECMAScript 5**'s native `Object.keys`
	  _.keys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    if (nativeKeys) return nativeKeys(obj);
	    var keys = [];
	    for (var key in obj) if (_.has(obj, key)) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve all the property names of an object.
	  _.allKeys = function(obj) {
	    if (!_.isObject(obj)) return [];
	    var keys = [];
	    for (var key in obj) keys.push(key);
	    // Ahem, IE < 9.
	    if (hasEnumBug) collectNonEnumProps(obj, keys);
	    return keys;
	  };
	
	  // Retrieve the values of an object's properties.
	  _.values = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var values = Array(length);
	    for (var i = 0; i < length; i++) {
	      values[i] = obj[keys[i]];
	    }
	    return values;
	  };
	
	  // Returns the results of applying the iteratee to each element of the object
	  // In contrast to _.map it returns an object
	  _.mapObject = function(obj, iteratee, context) {
	    iteratee = cb(iteratee, context);
	    var keys =  _.keys(obj),
	          length = keys.length,
	          results = {},
	          currentKey;
	      for (var index = 0; index < length; index++) {
	        currentKey = keys[index];
	        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
	      }
	      return results;
	  };
	
	  // Convert an object into a list of `[key, value]` pairs.
	  _.pairs = function(obj) {
	    var keys = _.keys(obj);
	    var length = keys.length;
	    var pairs = Array(length);
	    for (var i = 0; i < length; i++) {
	      pairs[i] = [keys[i], obj[keys[i]]];
	    }
	    return pairs;
	  };
	
	  // Invert the keys and values of an object. The values must be serializable.
	  _.invert = function(obj) {
	    var result = {};
	    var keys = _.keys(obj);
	    for (var i = 0, length = keys.length; i < length; i++) {
	      result[obj[keys[i]]] = keys[i];
	    }
	    return result;
	  };
	
	  // Return a sorted list of the function names available on the object.
	  // Aliased as `methods`
	  _.functions = _.methods = function(obj) {
	    var names = [];
	    for (var key in obj) {
	      if (_.isFunction(obj[key])) names.push(key);
	    }
	    return names.sort();
	  };
	
	  // Extend a given object with all the properties in passed-in object(s).
	  _.extend = createAssigner(_.allKeys);
	
	  // Assigns a given object with all the own properties in the passed-in object(s)
	  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
	  _.extendOwn = _.assign = createAssigner(_.keys);
	
	  // Returns the first key on an object that passes a predicate test
	  _.findKey = function(obj, predicate, context) {
	    predicate = cb(predicate, context);
	    var keys = _.keys(obj), key;
	    for (var i = 0, length = keys.length; i < length; i++) {
	      key = keys[i];
	      if (predicate(obj[key], key, obj)) return key;
	    }
	  };
	
	  // Return a copy of the object only containing the whitelisted properties.
	  _.pick = function(object, oiteratee, context) {
	    var result = {}, obj = object, iteratee, keys;
	    if (obj == null) return result;
	    if (_.isFunction(oiteratee)) {
	      keys = _.allKeys(obj);
	      iteratee = optimizeCb(oiteratee, context);
	    } else {
	      keys = flatten(arguments, false, false, 1);
	      iteratee = function(value, key, obj) { return key in obj; };
	      obj = Object(obj);
	    }
	    for (var i = 0, length = keys.length; i < length; i++) {
	      var key = keys[i];
	      var value = obj[key];
	      if (iteratee(value, key, obj)) result[key] = value;
	    }
	    return result;
	  };
	
	   // Return a copy of the object without the blacklisted properties.
	  _.omit = function(obj, iteratee, context) {
	    if (_.isFunction(iteratee)) {
	      iteratee = _.negate(iteratee);
	    } else {
	      var keys = _.map(flatten(arguments, false, false, 1), String);
	      iteratee = function(value, key) {
	        return !_.contains(keys, key);
	      };
	    }
	    return _.pick(obj, iteratee, context);
	  };
	
	  // Fill in a given object with default properties.
	  _.defaults = createAssigner(_.allKeys, true);
	
	  // Creates an object that inherits from the given prototype object.
	  // If additional properties are provided then they will be added to the
	  // created object.
	  _.create = function(prototype, props) {
	    var result = baseCreate(prototype);
	    if (props) _.extendOwn(result, props);
	    return result;
	  };
	
	  // Create a (shallow-cloned) duplicate of an object.
	  _.clone = function(obj) {
	    if (!_.isObject(obj)) return obj;
	    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
	  };
	
	  // Invokes interceptor with the obj, and then returns obj.
	  // The primary purpose of this method is to "tap into" a method chain, in
	  // order to perform operations on intermediate results within the chain.
	  _.tap = function(obj, interceptor) {
	    interceptor(obj);
	    return obj;
	  };
	
	  // Returns whether an object has a given set of `key:value` pairs.
	  _.isMatch = function(object, attrs) {
	    var keys = _.keys(attrs), length = keys.length;
	    if (object == null) return !length;
	    var obj = Object(object);
	    for (var i = 0; i < length; i++) {
	      var key = keys[i];
	      if (attrs[key] !== obj[key] || !(key in obj)) return false;
	    }
	    return true;
	  };
	
	
	  // Internal recursive comparison function for `isEqual`.
	  var eq = function(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b) return a !== 0 || 1 / a === 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null) return a === b;
	    // Unwrap any wrapped objects.
	    if (a instanceof _) a = a._wrapped;
	    if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className !== toString.call(b)) return false;
	    switch (className) {
	      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
	      case '[object RegExp]':
	      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
	      case '[object String]':
	        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	        // equivalent to `new String("5")`.
	        return '' + a === '' + b;
	      case '[object Number]':
	        // `NaN`s are equivalent, but non-reflexive.
	        // Object(NaN) is equivalent to NaN
	        if (+a !== +a) return +b !== +b;
	        // An `egal` comparison is performed for other numeric values.
	        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
	      case '[object Date]':
	      case '[object Boolean]':
	        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	        // millisecond representations. Note that invalid dates with millisecond representations
	        // of `NaN` are not equivalent.
	        return +a === +b;
	    }
	
	    var areArrays = className === '[object Array]';
	    if (!areArrays) {
	      if (typeof a != 'object' || typeof b != 'object') return false;
	
	      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
	      // from different frames are.
	      var aCtor = a.constructor, bCtor = b.constructor;
	      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
	                               _.isFunction(bCtor) && bCtor instanceof bCtor)
	                          && ('constructor' in a && 'constructor' in b)) {
	        return false;
	      }
	    }
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	
	    // Initializing stack of traversed objects.
	    // It's done here since we only need them for objects and arrays comparison.
	    aStack = aStack || [];
	    bStack = bStack || [];
	    var length = aStack.length;
	    while (length--) {
	      // Linear search. Performance is inversely proportional to the number of
	      // unique nested structures.
	      if (aStack[length] === a) return bStack[length] === b;
	    }
	
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	
	    // Recursively compare objects and arrays.
	    if (areArrays) {
	      // Compare array lengths to determine if a deep comparison is necessary.
	      length = a.length;
	      if (length !== b.length) return false;
	      // Deep compare the contents, ignoring non-numeric properties.
	      while (length--) {
	        if (!eq(a[length], b[length], aStack, bStack)) return false;
	      }
	    } else {
	      // Deep compare objects.
	      var keys = _.keys(a), key;
	      length = keys.length;
	      // Ensure that both objects contain the same number of properties before comparing deep equality.
	      if (_.keys(b).length !== length) return false;
	      while (length--) {
	        // Deep compare each member
	        key = keys[length];
	        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
	      }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return true;
	  };
	
	  // Perform a deep comparison to check if two objects are equal.
	  _.isEqual = function(a, b) {
	    return eq(a, b);
	  };
	
	  // Is a given array, string, or object empty?
	  // An "empty" object has no enumerable own-properties.
	  _.isEmpty = function(obj) {
	    if (obj == null) return true;
	    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
	    return _.keys(obj).length === 0;
	  };
	
	  // Is a given value a DOM element?
	  _.isElement = function(obj) {
	    return !!(obj && obj.nodeType === 1);
	  };
	
	  // Is a given value an array?
	  // Delegates to ECMA5's native Array.isArray
	  _.isArray = nativeIsArray || function(obj) {
	    return toString.call(obj) === '[object Array]';
	  };
	
	  // Is a given variable an object?
	  _.isObject = function(obj) {
	    var type = typeof obj;
	    return type === 'function' || type === 'object' && !!obj;
	  };
	
	  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
	  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
	    _['is' + name] = function(obj) {
	      return toString.call(obj) === '[object ' + name + ']';
	    };
	  });
	
	  // Define a fallback version of the method in browsers (ahem, IE < 9), where
	  // there isn't any inspectable "Arguments" type.
	  if (!_.isArguments(arguments)) {
	    _.isArguments = function(obj) {
	      return _.has(obj, 'callee');
	    };
	  }
	
	  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
	  // IE 11 (#1621), and in Safari 8 (#1929).
	  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
	    _.isFunction = function(obj) {
	      return typeof obj == 'function' || false;
	    };
	  }
	
	  // Is a given object a finite number?
	  _.isFinite = function(obj) {
	    return isFinite(obj) && !isNaN(parseFloat(obj));
	  };
	
	  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
	  _.isNaN = function(obj) {
	    return _.isNumber(obj) && obj !== +obj;
	  };
	
	  // Is a given value a boolean?
	  _.isBoolean = function(obj) {
	    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
	  };
	
	  // Is a given value equal to null?
	  _.isNull = function(obj) {
	    return obj === null;
	  };
	
	  // Is a given variable undefined?
	  _.isUndefined = function(obj) {
	    return obj === void 0;
	  };
	
	  // Shortcut function for checking if an object has a given property directly
	  // on itself (in other words, not on a prototype).
	  _.has = function(obj, key) {
	    return obj != null && hasOwnProperty.call(obj, key);
	  };
	
	  // Utility Functions
	  // -----------------
	
	  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	  // previous owner. Returns a reference to the Underscore object.
	  _.noConflict = function() {
	    root._ = previousUnderscore;
	    return this;
	  };
	
	  // Keep the identity function around for default iteratees.
	  _.identity = function(value) {
	    return value;
	  };
	
	  // Predicate-generating functions. Often useful outside of Underscore.
	  _.constant = function(value) {
	    return function() {
	      return value;
	    };
	  };
	
	  _.noop = function(){};
	
	  _.property = property;
	
	  // Generates a function for a given object that returns a given property.
	  _.propertyOf = function(obj) {
	    return obj == null ? function(){} : function(key) {
	      return obj[key];
	    };
	  };
	
	  // Returns a predicate for checking whether an object has a given set of
	  // `key:value` pairs.
	  _.matcher = _.matches = function(attrs) {
	    attrs = _.extendOwn({}, attrs);
	    return function(obj) {
	      return _.isMatch(obj, attrs);
	    };
	  };
	
	  // Run a function **n** times.
	  _.times = function(n, iteratee, context) {
	    var accum = Array(Math.max(0, n));
	    iteratee = optimizeCb(iteratee, context, 1);
	    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
	    return accum;
	  };
	
	  // Return a random integer between min and max (inclusive).
	  _.random = function(min, max) {
	    if (max == null) {
	      max = min;
	      min = 0;
	    }
	    return min + Math.floor(Math.random() * (max - min + 1));
	  };
	
	  // A (possibly faster) way to get the current timestamp as an integer.
	  _.now = Date.now || function() {
	    return new Date().getTime();
	  };
	
	   // List of HTML entities for escaping.
	  var escapeMap = {
	    '&': '&amp;',
	    '<': '&lt;',
	    '>': '&gt;',
	    '"': '&quot;',
	    "'": '&#x27;',
	    '`': '&#x60;'
	  };
	  var unescapeMap = _.invert(escapeMap);
	
	  // Functions for escaping and unescaping strings to/from HTML interpolation.
	  var createEscaper = function(map) {
	    var escaper = function(match) {
	      return map[match];
	    };
	    // Regexes for identifying a key that needs to be escaped
	    var source = '(?:' + _.keys(map).join('|') + ')';
	    var testRegexp = RegExp(source);
	    var replaceRegexp = RegExp(source, 'g');
	    return function(string) {
	      string = string == null ? '' : '' + string;
	      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
	    };
	  };
	  _.escape = createEscaper(escapeMap);
	  _.unescape = createEscaper(unescapeMap);
	
	  // If the value of the named `property` is a function then invoke it with the
	  // `object` as context; otherwise, return it.
	  _.result = function(object, property, fallback) {
	    var value = object == null ? void 0 : object[property];
	    if (value === void 0) {
	      value = fallback;
	    }
	    return _.isFunction(value) ? value.call(object) : value;
	  };
	
	  // Generate a unique integer id (unique within the entire client session).
	  // Useful for temporary DOM ids.
	  var idCounter = 0;
	  _.uniqueId = function(prefix) {
	    var id = ++idCounter + '';
	    return prefix ? prefix + id : id;
	  };
	
	  // By default, Underscore uses ERB-style template delimiters, change the
	  // following template settings to use alternative delimiters.
	  _.templateSettings = {
	    evaluate    : /<%([\s\S]+?)%>/g,
	    interpolate : /<%=([\s\S]+?)%>/g,
	    escape      : /<%-([\s\S]+?)%>/g
	  };
	
	  // When customizing `templateSettings`, if you don't want to define an
	  // interpolation, evaluation or escaping regex, we need one that is
	  // guaranteed not to match.
	  var noMatch = /(.)^/;
	
	  // Certain characters need to be escaped so that they can be put into a
	  // string literal.
	  var escapes = {
	    "'":      "'",
	    '\\':     '\\',
	    '\r':     'r',
	    '\n':     'n',
	    '\u2028': 'u2028',
	    '\u2029': 'u2029'
	  };
	
	  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
	
	  var escapeChar = function(match) {
	    return '\\' + escapes[match];
	  };
	
	  // JavaScript micro-templating, similar to John Resig's implementation.
	  // Underscore templating handles arbitrary delimiters, preserves whitespace,
	  // and correctly escapes quotes within interpolated code.
	  // NB: `oldSettings` only exists for backwards compatibility.
	  _.template = function(text, settings, oldSettings) {
	    if (!settings && oldSettings) settings = oldSettings;
	    settings = _.defaults({}, settings, _.templateSettings);
	
	    // Combine delimiters into one regular expression via alternation.
	    var matcher = RegExp([
	      (settings.escape || noMatch).source,
	      (settings.interpolate || noMatch).source,
	      (settings.evaluate || noMatch).source
	    ].join('|') + '|$', 'g');
	
	    // Compile the template source, escaping string literals appropriately.
	    var index = 0;
	    var source = "__p+='";
	    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
	      source += text.slice(index, offset).replace(escaper, escapeChar);
	      index = offset + match.length;
	
	      if (escape) {
	        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
	      } else if (interpolate) {
	        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
	      } else if (evaluate) {
	        source += "';\n" + evaluate + "\n__p+='";
	      }
	
	      // Adobe VMs need the match returned to produce the correct offest.
	      return match;
	    });
	    source += "';\n";
	
	    // If a variable is not specified, place data values in local scope.
	    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
	
	    source = "var __t,__p='',__j=Array.prototype.join," +
	      "print=function(){__p+=__j.call(arguments,'');};\n" +
	      source + 'return __p;\n';
	
	    try {
	      var render = new Function(settings.variable || 'obj', '_', source);
	    } catch (e) {
	      e.source = source;
	      throw e;
	    }
	
	    var template = function(data) {
	      return render.call(this, data, _);
	    };
	
	    // Provide the compiled source as a convenience for precompilation.
	    var argument = settings.variable || 'obj';
	    template.source = 'function(' + argument + '){\n' + source + '}';
	
	    return template;
	  };
	
	  // Add a "chain" function. Start chaining a wrapped Underscore object.
	  _.chain = function(obj) {
	    var instance = _(obj);
	    instance._chain = true;
	    return instance;
	  };
	
	  // OOP
	  // ---------------
	  // If Underscore is called as a function, it returns a wrapped object that
	  // can be used OO-style. This wrapper holds altered versions of all the
	  // underscore functions. Wrapped objects may be chained.
	
	  // Helper function to continue chaining intermediate results.
	  var result = function(instance, obj) {
	    return instance._chain ? _(obj).chain() : obj;
	  };
	
	  // Add your own custom functions to the Underscore object.
	  _.mixin = function(obj) {
	    _.each(_.functions(obj), function(name) {
	      var func = _[name] = obj[name];
	      _.prototype[name] = function() {
	        var args = [this._wrapped];
	        push.apply(args, arguments);
	        return result(this, func.apply(_, args));
	      };
	    });
	  };
	
	  // Add all of the Underscore functions to the wrapper object.
	  _.mixin(_);
	
	  // Add all mutator Array functions to the wrapper.
	  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      var obj = this._wrapped;
	      method.apply(obj, arguments);
	      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
	      return result(this, obj);
	    };
	  });
	
	  // Add all accessor Array functions to the wrapper.
	  _.each(['concat', 'join', 'slice'], function(name) {
	    var method = ArrayProto[name];
	    _.prototype[name] = function() {
	      return result(this, method.apply(this._wrapped, arguments));
	    };
	  });
	
	  // Extracts the result from a wrapped and chained object.
	  _.prototype.value = function() {
	    return this._wrapped;
	  };
	
	  // Provide unwrapping proxy for some methods used in engine operations
	  // such as arithmetic and JSON stringification.
	  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;
	
	  _.prototype.toString = function() {
	    return '' + this._wrapped;
	  };
	
	  // AMD registration happens at the end for compatibility with AMD loaders
	  // that may not enforce next-turn semantics on modules. Even though general
	  // practice for AMD registration is to be anonymous, underscore registers
	  // as a named module because, like jQuery, it is a base library that is
	  // popular enough to be bundled in a third party lib, but not be part of
	  // an AMD load request. Those cases could generate an error when an
	  // anonymous define() is called outside of a loader request.
	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	      return _;
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  }
	}.call(this));


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Utils = __webpack_require__(49);
	var Exception = __webpack_require__(48)["default"];
	
	var VERSION = "2.0.0";
	exports.VERSION = VERSION;var COMPILER_REVISION = 6;
	exports.COMPILER_REVISION = COMPILER_REVISION;
	var REVISION_CHANGES = {
	  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
	  2: '== 1.0.0-rc.3',
	  3: '== 1.0.0-rc.4',
	  4: '== 1.x.x',
	  5: '== 2.0.0-alpha.x',
	  6: '>= 2.0.0-beta.1'
	};
	exports.REVISION_CHANGES = REVISION_CHANGES;
	var isArray = Utils.isArray,
	    isFunction = Utils.isFunction,
	    toString = Utils.toString,
	    objectType = '[object Object]';
	
	function HandlebarsEnvironment(helpers, partials) {
	  this.helpers = helpers || {};
	  this.partials = partials || {};
	
	  registerDefaultHelpers(this);
	}
	
	exports.HandlebarsEnvironment = HandlebarsEnvironment;HandlebarsEnvironment.prototype = {
	  constructor: HandlebarsEnvironment,
	
	  logger: logger,
	  log: log,
	
	  registerHelper: function(name, fn) {
	    if (toString.call(name) === objectType) {
	      if (fn) { throw new Exception('Arg not supported with multiple helpers'); }
	      Utils.extend(this.helpers, name);
	    } else {
	      this.helpers[name] = fn;
	    }
	  },
	  unregisterHelper: function(name) {
	    delete this.helpers[name];
	  },
	
	  registerPartial: function(name, partial) {
	    if (toString.call(name) === objectType) {
	      Utils.extend(this.partials,  name);
	    } else {
	      this.partials[name] = partial;
	    }
	  },
	  unregisterPartial: function(name) {
	    delete this.partials[name];
	  }
	};
	
	function registerDefaultHelpers(instance) {
	  instance.registerHelper('helperMissing', function(/* [args, ]options */) {
	    if(arguments.length === 1) {
	      // A missing field in a {{foo}} constuct.
	      return undefined;
	    } else {
	      // Someone is actually trying to call something, blow up.
	      throw new Exception("Missing helper: '" + arguments[arguments.length-1].name + "'");
	    }
	  });
	
	  instance.registerHelper('blockHelperMissing', function(context, options) {
	    var inverse = options.inverse,
	        fn = options.fn;
	
	    if(context === true) {
	      return fn(this);
	    } else if(context === false || context == null) {
	      return inverse(this);
	    } else if (isArray(context)) {
	      if(context.length > 0) {
	        if (options.ids) {
	          options.ids = [options.name];
	        }
	
	        return instance.helpers.each(context, options);
	      } else {
	        return inverse(this);
	      }
	    } else {
	      if (options.data && options.ids) {
	        var data = createFrame(options.data);
	        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.name);
	        options = {data: data};
	      }
	
	      return fn(context, options);
	    }
	  });
	
	  instance.registerHelper('each', function(context, options) {
	    if (!options) {
	      throw new Exception('Must pass iterator to #each');
	    }
	
	    var fn = options.fn, inverse = options.inverse;
	    var i = 0, ret = "", data;
	
	    var contextPath;
	    if (options.data && options.ids) {
	      contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
	    }
	
	    if (isFunction(context)) { context = context.call(this); }
	
	    if (options.data) {
	      data = createFrame(options.data);
	    }
	
	    if(context && typeof context === 'object') {
	      if (isArray(context)) {
	        for(var j = context.length; i<j; i++) {
	          if (data) {
	            data.index = i;
	            data.first = (i === 0);
	            data.last  = (i === (context.length-1));
	
	            if (contextPath) {
	              data.contextPath = contextPath + i;
	            }
	          }
	          ret = ret + fn(context[i], { data: data });
	        }
	      } else {
	        for(var key in context) {
	          if(context.hasOwnProperty(key)) {
	            if(data) {
	              data.key = key;
	              data.index = i;
	              data.first = (i === 0);
	
	              if (contextPath) {
	                data.contextPath = contextPath + key;
	              }
	            }
	            ret = ret + fn(context[key], {data: data});
	            i++;
	          }
	        }
	      }
	    }
	
	    if(i === 0){
	      ret = inverse(this);
	    }
	
	    return ret;
	  });
	
	  instance.registerHelper('if', function(conditional, options) {
	    if (isFunction(conditional)) { conditional = conditional.call(this); }
	
	    // Default behavior is to render the positive path if the value is truthy and not empty.
	    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
	    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
	    if ((!options.hash.includeZero && !conditional) || Utils.isEmpty(conditional)) {
	      return options.inverse(this);
	    } else {
	      return options.fn(this);
	    }
	  });
	
	  instance.registerHelper('unless', function(conditional, options) {
	    return instance.helpers['if'].call(this, conditional, {fn: options.inverse, inverse: options.fn, hash: options.hash});
	  });
	
	  instance.registerHelper('with', function(context, options) {
	    if (isFunction(context)) { context = context.call(this); }
	
	    var fn = options.fn;
	
	    if (!Utils.isEmpty(context)) {
	      if (options.data && options.ids) {
	        var data = createFrame(options.data);
	        data.contextPath = Utils.appendContextPath(options.data.contextPath, options.ids[0]);
	        options = {data:data};
	      }
	
	      return fn(context, options);
	    } else {
	      return options.inverse(this);
	    }
	  });
	
	  instance.registerHelper('log', function(message, options) {
	    var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
	    instance.log(level, message);
	  });
	
	  instance.registerHelper('lookup', function(obj, field) {
	    return obj && obj[field];
	  });
	}
	
	var logger = {
	  methodMap: { 0: 'debug', 1: 'info', 2: 'warn', 3: 'error' },
	
	  // State enum
	  DEBUG: 0,
	  INFO: 1,
	  WARN: 2,
	  ERROR: 3,
	  level: 3,
	
	  // can be overridden in the host environment
	  log: function(level, message) {
	    if (logger.level <= level) {
	      var method = logger.methodMap[level];
	      if (typeof console !== 'undefined' && console[method]) {
	        console[method].call(console, message);
	      }
	    }
	  }
	};
	exports.logger = logger;
	var log = logger.log;
	exports.log = log;
	var createFrame = function(object) {
	  var frame = Utils.extend({}, object);
	  frame._parent = object;
	  return frame;
	};
	exports.createFrame = createFrame;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// Build out our basic SafeString type
	function SafeString(string) {
	  this.string = string;
	}
	
	SafeString.prototype.toString = function() {
	  return "" + this.string;
	};
	
	exports["default"] = SafeString;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];
	
	function Exception(message, node) {
	  var line;
	  if (node && node.firstLine) {
	    line = node.firstLine;
	
	    message += ' - ' + line + ':' + node.firstColumn;
	  }
	
	  var tmp = Error.prototype.constructor.call(this, message);
	
	  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
	  for (var idx = 0; idx < errorProps.length; idx++) {
	    this[errorProps[idx]] = tmp[errorProps[idx]];
	  }
	
	  if (line) {
	    this.lineNumber = line;
	    this.column = node.firstColumn;
	  }
	}
	
	Exception.prototype = new Error();
	
	exports["default"] = Exception;

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/*jshint -W004 */
	var SafeString = __webpack_require__(47)["default"];
	
	var escape = {
	  "&": "&amp;",
	  "<": "&lt;",
	  ">": "&gt;",
	  '"': "&quot;",
	  "'": "&#x27;",
	  "`": "&#x60;"
	};
	
	var badChars = /[&<>"'`]/g;
	var possible = /[&<>"'`]/;
	
	function escapeChar(chr) {
	  return escape[chr];
	}
	
	function extend(obj /* , ...source */) {
	  for (var i = 1; i < arguments.length; i++) {
	    for (var key in arguments[i]) {
	      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
	        obj[key] = arguments[i][key];
	      }
	    }
	  }
	
	  return obj;
	}
	
	exports.extend = extend;var toString = Object.prototype.toString;
	exports.toString = toString;
	// Sourced from lodash
	// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
	var isFunction = function(value) {
	  return typeof value === 'function';
	};
	// fallback for older versions of Chrome and Safari
	/* istanbul ignore next */
	if (isFunction(/x/)) {
	  isFunction = function(value) {
	    return typeof value === 'function' && toString.call(value) === '[object Function]';
	  };
	}
	var isFunction;
	exports.isFunction = isFunction;
	/* istanbul ignore next */
	var isArray = Array.isArray || function(value) {
	  return (value && typeof value === 'object') ? toString.call(value) === '[object Array]' : false;
	};
	exports.isArray = isArray;
	
	function escapeExpression(string) {
	  // don't escape SafeStrings, since they're already safe
	  if (string instanceof SafeString) {
	    return string.toString();
	  } else if (string == null) {
	    return "";
	  } else if (!string) {
	    return string + '';
	  }
	
	  // Force a string conversion as this will be done by the append regardless and
	  // the regex test will do this transparently behind the scenes, causing issues if
	  // an object's to string has escaped characters in it.
	  string = "" + string;
	
	  if(!possible.test(string)) { return string; }
	  return string.replace(badChars, escapeChar);
	}
	
	exports.escapeExpression = escapeExpression;function isEmpty(value) {
	  if (!value && value !== 0) {
	    return true;
	  } else if (isArray(value) && value.length === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}
	
	exports.isEmpty = isEmpty;function appendContextPath(contextPath, id) {
	  return (contextPath ? contextPath + '.' : '') + id;
	}
	
	exports.appendContextPath = appendContextPath;

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Utils = __webpack_require__(49);
	var Exception = __webpack_require__(48)["default"];
	var COMPILER_REVISION = __webpack_require__(46).COMPILER_REVISION;
	var REVISION_CHANGES = __webpack_require__(46).REVISION_CHANGES;
	var createFrame = __webpack_require__(46).createFrame;
	
	function checkRevision(compilerInfo) {
	  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
	      currentRevision = COMPILER_REVISION;
	
	  if (compilerRevision !== currentRevision) {
	    if (compilerRevision < currentRevision) {
	      var runtimeVersions = REVISION_CHANGES[currentRevision],
	          compilerVersions = REVISION_CHANGES[compilerRevision];
	      throw new Exception("Template was precompiled with an older version of Handlebars than the current runtime. "+
	            "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").");
	    } else {
	      // Use the embedded version info since the runtime doesn't know about this revision yet
	      throw new Exception("Template was precompiled with a newer version of Handlebars than the current runtime. "+
	            "Please update your runtime to a newer version ("+compilerInfo[1]+").");
	    }
	  }
	}
	
	exports.checkRevision = checkRevision;// TODO: Remove this line and break up compilePartial
	
	function template(templateSpec, env) {
	  /* istanbul ignore next */
	  if (!env) {
	    throw new Exception("No environment passed to template");
	  }
	  if (!templateSpec || !templateSpec.main) {
	    throw new Exception('Unknown template object: ' + typeof templateSpec);
	  }
	
	  // Note: Using env.VM references rather than local var references throughout this section to allow
	  // for external users to override these as psuedo-supported APIs.
	  env.VM.checkRevision(templateSpec.compiler);
	
	  var invokePartialWrapper = function(partial, indent, name, context, hash, helpers, partials, data, depths) {
	    if (hash) {
	      context = Utils.extend({}, context, hash);
	    }
	
	    var result = env.VM.invokePartial.call(this, partial, name, context, helpers, partials, data, depths);
	
	    if (result == null && env.compile) {
	      var options = { helpers: helpers, partials: partials, data: data, depths: depths };
	      partials[name] = env.compile(partial, { data: data !== undefined, compat: templateSpec.compat }, env);
	      result = partials[name](context, options);
	    }
	    if (result != null) {
	      if (indent) {
	        var lines = result.split('\n');
	        for (var i = 0, l = lines.length; i < l; i++) {
	          if (!lines[i] && i + 1 === l) {
	            break;
	          }
	
	          lines[i] = indent + lines[i];
	        }
	        result = lines.join('\n');
	      }
	      return result;
	    } else {
	      throw new Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
	    }
	  };
	
	  // Just add water
	  var container = {
	    lookup: function(depths, name) {
	      var len = depths.length;
	      for (var i = 0; i < len; i++) {
	        if (depths[i] && depths[i][name] != null) {
	          return depths[i][name];
	        }
	      }
	    },
	    lambda: function(current, context) {
	      return typeof current === 'function' ? current.call(context) : current;
	    },
	
	    escapeExpression: Utils.escapeExpression,
	    invokePartial: invokePartialWrapper,
	
	    fn: function(i) {
	      return templateSpec[i];
	    },
	
	    programs: [],
	    program: function(i, data, depths) {
	      var programWrapper = this.programs[i],
	          fn = this.fn(i);
	      if (data || depths) {
	        programWrapper = program(this, i, fn, data, depths);
	      } else if (!programWrapper) {
	        programWrapper = this.programs[i] = program(this, i, fn);
	      }
	      return programWrapper;
	    },
	
	    data: function(data, depth) {
	      while (data && depth--) {
	        data = data._parent;
	      }
	      return data;
	    },
	    merge: function(param, common) {
	      var ret = param || common;
	
	      if (param && common && (param !== common)) {
	        ret = Utils.extend({}, common, param);
	      }
	
	      return ret;
	    },
	
	    noop: env.VM.noop,
	    compilerInfo: templateSpec.compiler
	  };
	
	  var ret = function(context, options) {
	    options = options || {};
	    var data = options.data;
	
	    ret._setup(options);
	    if (!options.partial && templateSpec.useData) {
	      data = initData(context, data);
	    }
	    var depths;
	    if (templateSpec.useDepths) {
	      depths = options.depths ? [context].concat(options.depths) : [context];
	    }
	
	    return templateSpec.main.call(container, context, container.helpers, container.partials, data, depths);
	  };
	  ret.isTop = true;
	
	  ret._setup = function(options) {
	    if (!options.partial) {
	      container.helpers = container.merge(options.helpers, env.helpers);
	
	      if (templateSpec.usePartial) {
	        container.partials = container.merge(options.partials, env.partials);
	      }
	    } else {
	      container.helpers = options.helpers;
	      container.partials = options.partials;
	    }
	  };
	
	  ret._child = function(i, data, depths) {
	    if (templateSpec.useDepths && !depths) {
	      throw new Exception('must pass parent depths');
	    }
	
	    return program(container, i, templateSpec[i], data, depths);
	  };
	  return ret;
	}
	
	exports.template = template;function program(container, i, fn, data, depths) {
	  var prog = function(context, options) {
	    options = options || {};
	
	    return fn.call(container, context, container.helpers, container.partials, options.data || data, depths && [context].concat(depths));
	  };
	  prog.program = i;
	  prog.depth = depths ? depths.length : 0;
	  return prog;
	}
	
	exports.program = program;function invokePartial(partial, name, context, helpers, partials, data, depths) {
	  var options = { partial: true, helpers: helpers, partials: partials, data: data, depths: depths };
	
	  if(partial === undefined) {
	    throw new Exception("The partial " + name + " could not be found");
	  } else if(partial instanceof Function) {
	    return partial(context, options);
	  }
	}
	
	exports.invokePartial = invokePartial;function noop() { return ""; }
	
	exports.noop = noop;function initData(context, data) {
	  if (!data || !('root' in data)) {
	    data = data ? createFrame(data) : {};
	    data.root = context;
	  }
	  return data;
	}

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map