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

(function($) {
    var ASSET_MANAGER = new AssetManager();
    var gameEngine, canvas, context, background;

    var socket, id;
    var firstRun = true;

    var keySpace = false,
        keyArrowLeft = false,
        keyArrowRight = false;

    var msgPlayers, msgTiles;

    var bgs, bgs_loop;
    var bgsPL1 = false,
        bgsPL2 = false;

    /**
     * queue downloads in the asset manager
     */
    function queueDownloads() {
        ASSET_MANAGER.queueDownload(backgroundImg + backgroundSuffix);
        var i;
        for (i = 0; i < playerSprites.length; ++i) {
            ASSET_MANAGER.queueDownload(playerSprites[i] + playerSpriteSuffix);
        }
        for (i = 0; i < tileSprites.length; ++i) {
            ASSET_MANAGER.queueDownload(tileSprites[i] + tileSpriteSuffix);
        }
    }

    /**
     * download queued downloads
     */
    function downloadAll() {
        ASSET_MANAGER.downloadAll(function() {
            // prepare canvas
            canvas = document.getElementById(id_canvas);
            canvas.width = windowWidth;
            canvas.height = windowHeight;
            canvas.style.border = canvasBorder;
            // check html5 canvas support
            if (canvas.getContext) {
                context = canvas.getContext('2d');

                context.fillStyle = contextFillStyle;
                context.font = contextFont;
                context.textBaseline = 'top';
                context.fillText(str_loading, canvas.width / 2 - str_loading.length * 2.5, canvas.height / 2);

                initSockets();
                initBGSound();
            } else {
                $('#' + id_mainContainer + ', #' + id_div_loading).html(str_errorBrowserSupportHtml5).show();
            }
        });
    }

    /**
     * sets up the background sound loop
     */
    function setupBgsLoopListener() {
        var bgs_checked = $('#' + sound_id_bg).is(':checked');
        if (bgs_loop) {
            if (typeof bgs_loop.sound.loop == 'boolean') {
                bgs_loop.sound.loop = true;
            } else {
                bgs_loop.sound.addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                }, false);
            }
            if (bgs_checked) {
                bgs_loop.play();
            }
        }
    }

    /**
     * initializes the background sounds, plays the intro and loops the loop
     */
    function initBGSound() {
        var bgs_checked = $('#' + sound_id_bg).is(':checked');
        bgs = new Sound(path_soundBackgroundIntro);
        if (bgs) {
            bgs.sound.addEventListener('canplaythrough', function() {
                if (!bgsPL1) {
                    bgsPL1 = true;
                    bgs_loop = new Sound(path_soundBackground);
                    bgs_loop.sound.addEventListener('canplaythrough', function() {
                        if (!bgsPL2) {
                            bgsPL2 = true;
                            if (bgs_checked) {
                                bgs.play();
                            }
                            bgs.sound.addEventListener('ended', function() {
                                setupBgsLoopListener();
                            });
                        }
                    });
                }
            }, false);
        }
    }

    /**
     * initializes the socket connection
     */
    function initSockets() {
        socket = io.connect(URL, {
            port: PORT
        });
        // socket.on('message', function (msg) {});
        socket.on('tilesUpdate', function(msg) {
            msgTiles = msg.tiles;
            if (!firstRun) {
                updateTiles(msgTiles);
            }
        });
        socket.on('socketId', function(msg) {
            id = msg.id;
            if (firstRun) {
                initGameEngine();
                firstRun = false;
            }
        });
        socket.on('initPlayers', function(msg) {
            updatePlayers(msg.players);
        });
        socket.on('playerUpdate', function(msg) {
            updatePlayer(msg.id, msg.x, msg.y, msg.dl, msg.dr);
        });
        socket.on('chatUpdate', function(msg) {
            $('#' + id_chat_window).prepend(formatMsg(getTimeString(), msg.id.substr(0, 5), msg.msg));
        });
        socket.on('playerConnected', function(msg) {
            setupPlayer(msg.id, msg.x, msg.y, msg.spriteNr);
            if (msg.id != id) {
                gameEngine.setMessage(getTimeString() + ": " + msg.id.substr(0, 5) + " " + str_connected);
            }
            updateScores(msg.scores, msg.activeClients);
        });
        socket.on('playerDisconnected', function(msg) {
            if (msg.id != id) {
                delete gameEngine.players[msg.id];
                gameEngine.setMessage(getTimeString() + ": " + msg.id.substr(0, 5) + " " + str_disconnected);
                updateScores(msg.scores, msg.activeClients);
            }
        });
        socket.on('playerKilled', function(msg) {
            gameEngine.setMessage(getTimeString() + ": " + msg.killer.substr(0, 5) + " " + str_killed + " " + msg.victim.substr(0, 5));
            if (id == msg.victim) {
                var player = gameEngine.getPlayer(id);
                if (player) {
                    player.playHit();
                    player.setX(getRandom(0, canvas.width));
                    player.setY(-getRandom(0, canvas.height));
                }
            }
            updateScores(msg.scores, msg.activeClients);
        });
    }

    /**
     * initializes some click events
     */
    function initClickEvents() {
        $('#' + sound_id_bg).click(function() {
            if ($(this).is(':checked')) {
                setupBgsLoopListener();
            } else {
                if (bgs) {
                    bgs.stop();
                }
                if (bgs_loop) {
                    bgs_loop.sound.pause();
                }
            }
        });
        $('#' + sound_id_bg + ', #' + sound_id_jump + ', #' + sound_id_kill + ', #' + sound_id_hit).click(function() {
            focusCanvas();
        });
    }

    /**
     * initializes the client game engine
     */
    function initGameEngine() {
        gameEngine = new GameEngine(id);
        gameEngine.init(context);

        background = new Background(ASSET_MANAGER.getAsset(backgroundImg + backgroundSuffix));
        gameEngine.setBackground(background);

        $('#' + id_div_loading).hide();
        $('#' + id_runLeft).html(str_runLeft);
        $('#' + id_runRight).html(str_runRight);
        $('#' + id_jump).html(str_jump);
        $('#' + id_mainContainer + ', #' + id_div_canvas + ', #' + id_div_controls).show();

        focusCanvas();
        setKeyEvents();
        gameEngine.start();
        updateTiles(msgTiles);
        initClickEvents();
    }

    /**
     * updates the players
     * @param players
     *      list of all players
     */
    function updatePlayers(players) {
        // update all players but own
        for (var player in players) {
            if (!gameEngine.getPlayer(player)) {
                gameEngine.setPlayer(new Player(
                    players[player].x, players[player].y, ASSET_MANAGER.getAsset(playerSprites[players[player].spriteNr] + playerSpriteSuffix), ASSET_MANAGER.getAsset(playerSprites[players[player].spriteNr] + playerLeftStr + playerSpriteSuffix), ASSET_MANAGER.getAsset(playerSprites[players[player].spriteNr] + playerRightStr + playerSpriteSuffix)), player);
            } else {
                if (player != id) {
                    var pl = gameEngine.getPlayer(player);
                    pl.setX(players[player].x);
                    pl.setY(players[player].y);
                }
            }
        }
    }

    /**
     * sets up a player
     * @param _id
     *      player id
     * @param x
     *     x coordinate
     * @param y
     *     y coordinate
     * @param spriteNr
     *     sprite number in sprite list
     */
    function setupPlayer(_id, x, y, spriteNr) {
        if (!gameEngine.getPlayer(_id)) {
            gameEngine.setPlayer(
                new Player(
                    x, y,
                    ASSET_MANAGER.getAsset(playerSprites[spriteNr] + playerSpriteSuffix),
                    ASSET_MANAGER.getAsset(playerSprites[spriteNr] + playerLeftStr + playerSpriteSuffix),
                    ASSET_MANAGER.getAsset(playerSprites[spriteNr] + playerRightStr + playerSpriteSuffix)),
                _id);
        }
    }

    /**
     * updates a player
     * @param _id
     *      player id
     * @param x
     *     x coordinate
     * @param y
     *     y coordinate
     */
    function updatePlayer(_id, x, y, dl, dr) {
        if (id != _id) {
            var player = gameEngine.getPlayer(_id);
            if (player) {
                player.setX(x);
                player.setY(y);
                player.dirLeft = dl;
                player.dirRight = dr;
            }
        }
    }

    /**
     * updates the tiles
     * @param tiles
     *     list of all tiles
     */
    function updateTiles(tiles) {
        for (var tile in tiles) {
            var t = tiles[tile];
            if (t) {
                if (!gameEngine.getTile(tile)) {
                    gameEngine.setTile(
                        new Tile(
                            tiles[tile].x, tiles[tile].y,
                            ASSET_MANAGER.getAsset(tileSprites[tiles[tile].spriteNr] + tileSpriteSuffix),
                            tiles[tile].plus),
                        tile);
                } else {
                    var pl = gameEngine.getTile(tile);
                    if (pl) {
                        pl.setX(t.x);
                        pl.setY(t.y);
                        pl.movingHL = t.movingHL;
                        pl.movingHR = t.movingHR;
                        pl.movingVU = t.movingVU;
                        pl.movingVD = t.movingVD;
                    }
                }
            }
        }
    }

    /**
     * updates the scores
     * @param scores
     *     list of scores
     */
    function updateScores(scores, activeClients) {
        var str = "<tr><th>" + str_players + " (<span id='" + id_clientCount + "'>" + activeClients + "</span>)</th><th>|</th><th>" + str_score + "</th></tr>";
        for (var score in scores) {
            var name = (score == id) ? ("<span style='color:" + scoreNameColor + ";'>" + score.substr(0, 5) + "</span>") : score.substr(0, 5);
            str += "<tr><td>" + name + "</td><td>|</td><td>" + scores[score] + "</td></tr>";
        }
        $('#' + id_scoreTable).html(str);
        $("#" + id_clientCount).html(activeClients);
    }

    /**
     * initializes the canvas
     */
    function focusCanvas() {
        $("#" + id_canvas).attr("tabindex", "0"); // for the focus
        canvas.focus();
    }

    /**
     * (un-)highlights an id
     * @param id
     *      the id to (un-)highlight
     * @param bool
     *      true when highlight, false when un-highlight
     */
    function highlightId(id, bool) {
        $('#' + id).css({
            opacity: (bool ? 1.0 : 0.5)
        });
    }

    /**
     * sets the key events and own event handling
     */
    function setKeyEvents() {
        $("#canvas").keydown(function(e) {
            switch (e.which) {
                case 32:
                    keySpace = true;
                    highlightId(id_key_space, false);
                    break;
                case 37:
                    keyArrowLeft = true;
                    highlightId(id_key_arrowLeft, false);
                    break;
                case 39:
                    keyArrowRight = true;
                    highlightId(id_key_arrowRight, false);
                    break;
            }
            e.preventDefault();
            return false;
        });

        $("#canvas").keyup(function(e) {
            switch (e.which) {
                case 32:
                    keySpace = false;
                    highlightId(id_key_space, true);
                    break;
                case 37:
                    highlightId(id_key_arrowLeft, true);
                    keyArrowLeft = false;
                    break;
                case 39:
                    keyArrowRight = false;
                    highlightId(id_key_arrowRight, true);
                    break;
            }
            e.preventDefault();
            return false;
        });

        // check keys every n ms
        (function checkKeys() {
            if (keyArrowLeft) {
                gameEngine.getPlayer(id).left();
            }
            if (keyArrowRight) {
                gameEngine.getPlayer(id).right();
            }
            var pl = gameEngine.getPlayer(id);
            if (pl) {
                if (!firstRun && pl.posChanged()) {
                    socket.emit('playerUpdate', {
                        x: gameEngine.getPlayer(id).getX(),
                        y: gameEngine.getPlayer(id).getY(),
                        dl: gameEngine.getPlayer(id).dirLeft,
                        dr: gameEngine.getPlayer(id).dirRight
                    });
                }
                var kill = gameEngine.getKill();
                if (kill !== false) {
                    socket.emit('playerKilled', {
                        id: kill
                    });
                    pl.killedAlready = true;
                }
            }
            gameEngine.keySpace = keySpace;
            setTimeout(checkKeys, keyTickRate);
        })();
    }

    /**
     * overwrites the submit handler
     */
    function submitHandler() {
        var msg = $('#' + id_newMessage).val().substr(0, 30);
        var findReplace = [
            [/&/g, "&amp;"],
            [/</g, "&lt;"],
            [/>/g, "&gt;"],
            [/"/g, "&quot;"]
        ]; //" <- only for one of my editors (TextMate) that does recognize the '/' in front of the quotation mark in the line above
        for (var item in findReplace) {
            msg = msg.replace(findReplace[item][0], findReplace[item][1]);
        }
        if (msg && (msg !== "")) {
            socket.emit('chatUpdate', {
                msg: msg
            });
            $('#' + id_newMessage).val('');
        }
        focusCanvas();
        return false;
    }

    function prepareGame() {
        $(window).bind("submit", submitHandler);
        $('#' + id_div_loading).html(str_loading);
        $('#' + id_mainContainer + ', #' + id_div_loading).show();
        $('#' + id_main + ', #' + id_div_controls).show();
        $('#' + id_chat_window).html('<br />' + str_chatInit);

        queueDownloads();
        downloadAll();
    }

    // DOM ready
    $(document).ready(function() {
        $('#' + id_div_loading).html(str_firstStart);
        $('#' + id_mainContainer + ', #' + id_div_loading).show();
        $('#' + id_main + ', #' + id_div_controls).hide();
        $('#' + id_joinGame).click(function() {
            prepareGame();
            return false;
        });
    });
})(jQuery);
