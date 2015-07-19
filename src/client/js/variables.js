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

var URL = "localhost";
var PORT = 8182;
var themeFolder = 'supermario'; // pre-defined themes: original, supermario

// colors and more
var timeColor = "#D15705";
var nameColor = "#6195ED";
var scoreNameColor = "#3399FF";
var canvasBorder = "#000 2px solid";
var contextFillStyle = "#FFF";
var contextFont = '15px sans-serif';

// sprites/images
var spriteFolder = 'img/game/sprites/' + themeFolder + '/';
var playerSprites = [spriteFolder + 'player1',
    spriteFolder + 'player2',
    spriteFolder + 'player3',
    spriteFolder + 'player4',
    spriteFolder + 'player5',
    spriteFolder + 'player1_l', spriteFolder + 'player1_r',
    spriteFolder + 'player2_l', spriteFolder + 'player2_r',
    spriteFolder + 'player3_l', spriteFolder + 'player3_r',
    spriteFolder + 'player4_l', spriteFolder + 'player4_r',
    spriteFolder + 'player5_l', spriteFolder + 'player5_r'
];
var tileSprites = [spriteFolder + 'tile1',
    spriteFolder + 'tile2',
    spriteFolder + 'tile3'
];
var backgroundImg = 'img/game/background1';

// sounds
var path_soundBackgroundIntro = "audio/smb.ogg";
var path_soundBackground = "audio/smb_loop.ogg";
var path_soundJump = "audio/jump.wav";
var path_soundKill = "audio/kill.wav";
var path_soundHit = "audio/hit.wav";

// image suffixes
var playerSpriteSuffix = ".png";
var tileSpriteSuffix = ".png";
var backgroundSuffix = ".png";
var playerLeftStr = "_l";
var playerRightStr = "_r";

// ids
var sound_id_bg = "sound_bg";
var sound_id_jump = "sound_jump";
var sound_id_kill = "sound_kill";
var sound_id_hit = "sound_hit";
var id_mainContainer = "mainContainer";
var id_main = "main";
var id_joinGame = "joinGame";
var id_div_loading = "div_loading";
var id_chat_window = "chat_window";
var id_runLeft = "runLeft";
var id_runRight = "runRight";
var id_jump = "jump";
var id_div_canvas = "div_canvas";
var id_div_controls = "div_controls";
var id_clientCount = "clientCount";
var id_scoreTable = "scoreTable";
var id_canvas = "canvas";
var id_key_space = "key_space";
var id_key_arrowLeft = "key_arrowLeft";
var id_key_arrowRight = "key_arrowRight";
var id_newMessage = "newMessage";
