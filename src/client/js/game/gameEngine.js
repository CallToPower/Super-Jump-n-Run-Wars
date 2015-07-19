/*
 * Super Jump And Run Wars
 * Copyright (C) 2011-2015 Denis Meyer, CallToPower Software
 * 
 * This software is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License version 3, 29 June 2007, as published by the Free Software Foundation.
 * 
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 */

/**
 * class GameEngine
 */
function GameEngine(id) {
    this.id = id;
    this.background = null;
    this.tiles = [];
    this.players = {};
    this.context = null;
    this.lastUpdateTimestamp = 0;
    this.deltaTime = null;
    this.keySpace = false;
    this.kill = false;
    // message
    this.lastMsgTimestamp = null;
    this.msg = str_welcome;
    this.waitMsgIntv = 1500;
    this.msgAlreadyDrawn = false;
}

/**
 * constructor
 * @param context
 *      the context to render in
 */
GameEngine.prototype.init = function(context) {
    this.context = context;
};

/**
 * constructor
 * @param background
 *      the background
 */
GameEngine.prototype.setBackground = function(background) {
    this.background = background;
};

/**
 * sets up a tile
 * @param tile
 *      tile
 * @param position
 *      tile position in the container
 */
GameEngine.prototype.setTile = function(tile, position) {
    this.tiles[position] = tile;
};

/**
 * sets up a player
 * @param player
 *      player
 * @param id
 *      player id in the container
 */
GameEngine.prototype.setPlayer = function(player, id) {
    this.players[id] = player;
};

/**
 * displays a message
 * @param msg
 *      message to display
 */
GameEngine.prototype.setMessage = function(msg) {
    this.msg = msg;
    this.lastMsgTimestamp = Date.now();
    this.msgAlreadyDrawn = false;
};

/**
 * returns a tile
 * @param position
 *      tile position in the container
 */
GameEngine.prototype.getTile = function(position) {
    return this.tiles[position];
};

/**
 * returns a player
 * @param id
 *      player id in the container
 */
GameEngine.prototype.getPlayer = function(id) {
    return this.players[id];
};

/**
 * returns a list of all players
 * @return
 *      a list of all players
 */
GameEngine.prototype.getPlayers = function() {
    return this.players;
};

/**
 * draws a message when message not already displayed and timestamp ok
 */
GameEngine.prototype.drawMessage = function() {
    var now = Date.now();
    if (!this.msgAlreadyDrawn) {
        this.context.fillStyle = contextFillStyle;
        this.context.font = contextFont;
        this.context.textBaseline = 'top';
        this.context.fillText(this.msg, 0, 0);
    }
    if ((now - this.lastMsgTimestamp) > this.waitMsgIntv) {
        this.msgAlreadyDrawn = true;
        this.lastMsgTimestamp = now;
    }
};

/**
 * clears the context
 */
GameEngine.prototype.clearContext = function() {
    // save custom transformation
    this.context.save();
    // set standard transformation
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    // clear
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    // draw background
    this.background.draw(this.context);
    // draw message
    this.drawMessage();
    // restore custom transformation
    this.context.restore();
};

/**
 * draws every entity and tile
 */
GameEngine.prototype.draw = function() {
    this.clearContext();
    // draw tiles
    for (var i = 0; i < this.tiles.length; ++i) {
        if (this.tiles[i]) {
            this.tiles[i].draw(this.context);
        }
    }
    // draw players
    for (var player in this.players) {
        if (this.players[player]) {
            this.players[player].draw(this.context);
        }
    }
};

/**
 * returns the kills fo this player
 * @return
 *      an array with the kills (player IDs) of this player
 */
GameEngine.prototype.getKill = function() {
    return this.kill;
};

/**
 * checks the kills of this player
 */
GameEngine.prototype.checkKills = function() {
    this.kill = false;
    var pl1 = this.getPlayer(this.id);
    if (pl1 && !pl1.killedAlready) {
        for (var pl2ID in this.players) {
            if (this.id != pl2ID) {
                var pl2 = this.getPlayer(pl2ID);
                if (pl2 && pl1.isAboveAndCollidesWithPlayer(pl2)) {
                    this.kill = pl2ID;
                    this.killedAlready = true;
                    break;
                }
            }
        }
    }
};

/**
 * updates every player and tile
 */
GameEngine.prototype.update = function() {
    var player = this.getPlayer(this.id);
    if (player) {
        player.setX(player.getX());
        player.setY(player.getY());
        var highestGround = 0;
        for (var j = 0; j < this.tiles.length; ++j) {
            var tile = this.tiles[j];
            if (!player.jumpUp && player.collidesWithTile(tile)) {
                highestGround = tile.getY() - tile.getSprite().height;
                if (tile.movingVU) {
                    player.setY(highestGround - tile.plus);
                }
                if (tile.movingHL) {
                    player.setX(player.getX() - tile.plus);
                } else if (tile.movingHR) {
                    player.setX(player.getX() + tile.plus);
                }
                break;
            } else if (player.isAboveTile(tile)) {
                var currGround = tile.getY() - tile.getSprite().height;
                if (currGround < highestGround) {
                    highestGround = currGround;
                }
            }
        }
        player.setCurrGround(highestGround);
        player.jump(this.keySpace);
        player.checkWhetherToJump();
    }
    this.checkKills();
};

/**
 * game loop
 */
GameEngine.prototype.loop = function() {
    this.update();
    this.draw();
    this.lastUpdateTimestamp = Date.now();
};

/**
 * starts the game
 */
GameEngine.prototype.start = function() {
    this.lastUpdateTimestamp = Date.now();
    this.lastMsgTimestamp = Date.now();
    var that = this;
    this.context.translate(0, this.context.canvas.height);
    (function gameloop() {
        that.loop();
        requestAnimFrame(gameloop, that.context.canvas);
    })();
};
