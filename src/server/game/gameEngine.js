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
function GameEngine() {
    this.tiles = [];
    this.players = {};
    this.scores = {};
}

/**
 * sets up a tile
 * @param tile
 *      tile
 * @param position
 *      tile position in the container
 */
GameEngine.prototype.setTile = function (tile, position) {
    this.tiles[position] = tile;
};

/**
 * sets up a player
 * @param player
 *      player
 * @param id
 *      player id in the container
 */
GameEngine.prototype.setPlayer = function (player, id) {
    this.players[id] = player;
};

/**
 * sets up a score
 * @param player
 *      player
 * @param score
 *      new score
 */
GameEngine.prototype.setScore = function (playerId, score) {
    this.scores[playerId] = score;
};

/**
 * returns a tile
 * @param position
 *      tile position in the container
 */
GameEngine.prototype.getTile = function (position) {
    return this.tiles[position];
};

/**
 * returns a player
 * @param id
 *      player id in the container
 */
GameEngine.prototype.getPlayer = function (id) {
    return this.players[id];
};

/**
 * returns a score
 * @param id
 *      player score
 */
GameEngine.prototype.getScore = function (id) {
    return this.scores[id];
};

/**
 * returns a list of all tiles
 * @return a list of all tiles
 *      
 */
GameEngine.prototype.getTiles = function () {
    return this.tiles;
};

/**
 * returns a list of all players
 * @return a list of all players
 *      
 */
GameEngine.prototype.getPlayers = function () {
    return this.players;
};

/**
 * returns a list of scores
 * @return a list of scores
 *      
 */
GameEngine.prototype.getScores = function () {
    return this.scores;
};

// exports
exports.GameEngine = GameEngine;

