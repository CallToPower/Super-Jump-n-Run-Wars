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

var http = require('http'),
    url = require("url"),
    utils = require('./utils'),
    variables = require("./variables"),
    router = require("./router"),
    gameEngineC = require("./game/gameEngine"),
    player = require("./game/player"),
    tile = require("./game/tile"),
    gameVars = require("./game/variables.js");

// start server
var server = http.createServer(onRequest).listen(variables.PORT, variables.URL);
utils.logX("Server started on " + variables.URL + ":" + variables.PORT);

var io = require('socket.io').listen(server);
io.set('log level', 1); // 1 = errors, 2 = warnings + errors, 3 = info + warnings + errors
var activeClients = 0;
var gameEngine = new gameEngineC.GameEngine();
var tileUpdateRate = 50;

/**
 * initializes the tiles
 */
(function initTiles() {
    var tn = 0;
    gameEngine.setTile(new tile.Tile(90, -80, 0, gameVars.windowWidth, gameVars.windowHeight, true, false), ++tn);
    gameEngine.setTile(new tile.Tile(230, -150, 1, gameVars.windowWidth, gameVars.windowHeight, true, true), ++tn);
    gameEngine.setTile(new tile.Tile(370, -50, 0, gameVars.windowWidth, gameVars.windowHeight, true, false), ++tn);
    gameEngine.setTile(new tile.Tile(0, -230, 2, gameVars.windowWidth, gameVars.windowHeight, false, false), ++tn);
    gameEngine.setTile(new tile.Tile(gameVars.windowWidth - 40, -290, 2, gameVars.windowWidth, gameVars.windowHeight, false, false), ++tn);
    // updates all tiles every n ms
    (function updateTiles() {
        if (activeClients > 0) {
            var tiles = gameEngine.getTiles();
            if (tiles) {
                for (var t in tiles) {
                    var tile = tiles[t];
                    if (tile) {
                        if (tile.moveH) {
                            tile.moveHorizontal();
                        }
                        if (tile.moveV) {
                            tile.moveVertical();
                        }
                    }
                }
                io.sockets.json.emit('tilesUpdate', {
                    tiles: gameEngine.getTiles()
                });
            }
        }
        setTimeout(updateTiles, tileUpdateRate);
    })();
})();

/**
 * when a client connects
 */
io.sockets.on('connection', function(socket) {
    if (activeClients <= 0) {
        tileUpdateRate = 15;
    }
    ++activeClients;
    utils.logX("Client with socket id " + socket.id + " connected. Active clients: " + activeClients);
    var spriteNr = utils.getRandom(0, variables.availableSkins - 1);
    gameEngine.setPlayer(new player.Player(0, 0, spriteNr), socket.id);
    gameEngine.setScore(socket.id, 0);
    socket.on('playerUpdate', function(msg) {
        var player = gameEngine.getPlayer(socket.id);
        if (player) {
            player.x = msg.x;
            player.y = msg.y;
            player.dirLeft = msg.dl;
            player.dirRight = msg.dr;
            io.sockets.json.emit('playerUpdate', {
                id: socket.id,
                x: player.x,
                y: player.y,
                dl: player.dirLeft,
                dr: player.dirRight
            });
        }
    });
    socket.on('disconnect', function() {
        --activeClients;
        if (activeClients <= 0) {
            tileUpdateRate = 50;
        }
        utils.logX("Client with socket id " + socket.id + " disconnected. Active clients: " + activeClients);
        var dcId = socket.id;
        delete gameEngine.players[dcId];
        delete gameEngine.scores[dcId];
        io.sockets.json.emit('playerDisconnected', {
            id: dcId,
            activeClients: activeClients,
            scores: gameEngine.getScores()
        });
    });
    socket.on('chatUpdate', function(msg) {
        var date = new Date();
        utils.logX("[CHAT] " + date + " - " + socket.id + ": " + msg.msg);
        io.sockets.json.emit('chatUpdate', {
            id: socket.id,
            msg: msg.msg
        });
    });
    socket.on('playerKilled', function(msg) {
        if (gameEngine.getPlayer(socket.id) && gameEngine.getPlayer(msg.id)) {
            gameEngine.setScore(socket.id, gameEngine.getScore(socket.id) + gameVars.scorePlus);
            gameEngine.setScore(msg.id, gameEngine.getScore(msg.id) + gameVars.scoreMinus);
            io.sockets.json.emit('playerKilled', {
                activeClients: activeClients,
                scores: gameEngine.getScores(),
                killer: socket.id,
                victim: msg.id
            });
        }
    });
    // send to this socket
    socket.emit('socketId', {
        id: socket.id
    });
    socket.emit('initPlayers', {
        players: gameEngine.getPlayers()
    });
    // send to all sockets
    io.sockets.json.emit('playerConnected', {
        id: socket.id,
        activeClients: activeClients,
        x: gameEngine.getPlayer(socket.id).x,
        y: gameEngine.getPlayer(socket.id).y,
        spriteNr: gameEngine.getPlayer(socket.id).spriteNr,
        scores: gameEngine.getScores()
    });
});

/**
 * on GET request
 * @param request
 *      request
 * @param response
 *      response
 */
function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    utils.log("-----\nRequest for '" + pathname + "' received.");
    if (pathname.indexOf("..") != -1) {
        router.route("error404", response);
    } else {
        router.route(pathname, response);
    }
}
