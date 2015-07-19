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
 * class Player
 */
function Player(x, y, sprite, sprite_l, sprite_r, pathJumpSound, pathKillSound, pathHitSound) {
    this.x = x || 0;
    this.y = y || 0;
    this._x = x;
    this._y = y;
    this.currGround = 0;
    this.sprite = sprite;
    this.sprite_l = sprite_l;
    this.sprite_r = sprite_r;
    // "protected"
    this.plus = 5;
    this.jumpedFrom = this.currGround;
    this.isFalling = false;
    this.jumpUp = false;
    this.jumpDown = false;
    this.killedAlready = false;
    // "private"
    this.jumpMax = -145;
    this.currHeight = 0;
    this.jumpY = y;
    this.spaceKeyPressed = false;
    this.dirLeft = false;
    this.dirRight = false;
    this.pathJump = pathJumpSound || path_soundJump;
    this.pathKill = pathKillSound || path_soundKill;
    this.pathHit = pathHitSound || path_soundHit;
    // sounds
    this.soundJump = new Sound(this.pathKill);
    this.soundKill = new Sound(this.pathKill);
    this.soundHit = new Sound(this.pathHit);
}

// getter
Player.prototype.getX = function() {
    return this.x;
};

Player.prototype.getY = function() {
    return this.y;
};

Player.prototype.getCurrGround = function() {
    return this.currGround;
};

Player.prototype.getJumpMax = function() {
    return this.jumpMax;
};

Player.prototype.getSprite = function() {
    return this.sprite;
};

// getter without setter
Player.prototype.getPlus = function() {
    return this.plus;
};

Player.prototype.getJumpedFrom = function() {
    return this.jumpedFrom;
};

Player.prototype.getIsFalling = function() {
    return this.isFalling;
};

Player.prototype.getJumpUp = function() {
    return this.jumpUp;
};

Player.prototype.getJumpDown = function() {
    return this.jumpDown;
};

// setter
Player.prototype.setX = function(x) {
    this._x = this.x;
    this.x = x;
};

Player.prototype.setY = function(y) {
    this._y = this.y;
    this.y = y;
};

Player.prototype.setCurrGround = function(currGround) {
    this.currGround = currGround;
};

Player.prototype.setJumpMax = function(jMax) {
    this.jumpMax = jMax;
};

Player.prototype.setSprite = function(sprite) {
    this.sprite = sprite;
};

Player.prototype.posChanged = function() {
    return (this._x != this.x) || (this._y != this.y);
};

// sounds
Player.prototype.playJump = function() {
    var checked = $('#' + sound_id_jump).is(':checked');
    if (checked) {
        this.soundJump = new Audio(this.pathJump);
        if (this.soundJump) {
            this.soundJump.play();
        }
    }
};

Player.prototype.playKill = function() {
    var checked = $('#' + sound_id_kill).is(':checked');
    if (checked) {
        this.soundKill = new Sound(this.pathKill);
        if (this.soundKill) {
            this.soundKill.play();
        }
    }
};

Player.prototype.playHit = function() {
    var checked = $('#' + sound_id_hit).is(':checked');
    if (checked) {
        this.soundHit = new Sound(this.pathHit);
        if (this.soundHit) {
            this.soundHit.play();
        }
    }
};

// movement
Player.prototype.jump = function(spaceKeyPressed) {
    this.spaceKeyPressed = spaceKeyPressed;
    if (!(this.jumpUp || this.jumpDown || this.isFalling) && this.spaceKeyPressed) {
        this.playJump();
        this.jumpUp = true;
        this.jumpY = this.getY();
        this.jumpedFrom = this.getCurrGround();
    }
};

Player.prototype.up = function(plus) {
    plus = plus || this.plus;
    if (this.y > -windowHeight) {
        this.setY(this.y - plus);
    }
};

Player.prototype.down = function(plus) {
    plus = plus || this.plus;
    if (this.y < 0) {
        this.setY(this.y + plus);
    }
};

Player.prototype.left = function(plus) {
    this.dirLeft = true;
    this.dirRight = false;
    plus = plus || this.plus;
    if (this.x > 0 - (this.sprite.width / 2)) {
        this.setX(this.x - plus);
    } else {
        this.setX(windowWidth - this.sprite.width);
    }
};

Player.prototype.right = function(plus) {
    this.dirLeft = false;
    this.dirRight = true;
    plus = plus || this.plus;
    if (this.x < (windowWidth - this.sprite.width / 2)) {
        this.setX(this.x + plus);
    } else {
        this.setX(0);
    }
};

Player.prototype.checkWhetherToJump = function() {
    if (this.jumpUp && ((this.y - this.plus) > (this.jumpMax + this.jumpedFrom)) && this.spaceKeyPressed) {
        this.setY(this.y - this.plus);
        // dirty hack
    } else if (this.jumpUp && ((this.y - 4) > (this.jumpMax + this.jumpedFrom)) && this.spaceKeyPressed) {
        this.setY(this.y - 4);
    } else if (this.jumpUp && ((this.y - 3) > (this.jumpMax + this.jumpedFrom)) && this.spaceKeyPressed) {
        this.setY(this.y - 3);
    } else if (this.jumpUp && ((this.y - 2) > (this.jumpMax + this.jumpedFrom)) && this.spaceKeyPressed) {
        this.setY(this.y - 2);
    } else if (this.jumpUp && ((this.y - 1) > (this.jumpMax + this.jumpedFrom)) && this.spaceKeyPressed) {
        this.setY(this.y - 1);
        this.jumpUp = false;
        this.jumpDown = true;
    } else if (this.jumpUp) {
        this.jumpUp = false;
        this.jumpDown = true;
    } else if (this.jumpDown && ((this.y + this.plus) < this.currGround)) {
        this.setY(this.y + this.plus);
        // dirty hack
    } else if (this.jumpDown && ((this.y + 4) <= (this.currGround))) {
        this.setY(this.y + 4);
    } else if (this.jumpDown && ((this.y + 3) <= (this.currGround))) {
        this.setY(this.y + 3);
    } else if (this.jumpDown && ((this.y + 2) <= (this.currGround))) {
        this.setY(this.y + 2);
    } else if (this.jumpDown && ((this.y + 1) <= (this.currGround))) {
        this.setY(this.y + 1);
        this.jumpDown = false;
        this.killedAlready = false;
    } else if (this.jumpDown) {
        this.jumpDown = false;
        this.killedAlready = false;
    } else if ((this.y + this.plus) < this.currGround) {
        this.isFalling = true;
        this.setY(this.y + this.plus);
        // dirty hack
    } else if ((this.y + 4) <= this.currGround) {
        this.setY(this.y + 4);
    } else if ((this.y + 3) <= this.currGround) {
        this.setY(this.y + 3);
    } else if ((this.y + 2) <= this.currGround) {
        this.setY(this.y + 2);
    } else if ((this.y + 1) <= this.currGround) {
        this.setY(this.y + 1);
    } else {
        this.isFalling = false;
        this.killedAlready = false;
    }
};

// draw
Player.prototype.draw = function(context) {
    if (context) {
        var spr = this.dirLeft ? this.sprite_l : (this.dirRight ? this.sprite_r : this.sprite);
        context.drawImage(spr, this.getX(), this.getY() - this.getSprite().height, this.getSprite().width, this.getSprite().height);
        this.dirLeft = false;
        this.dirRight = false;
    }
};

// collision
Player.prototype.collidesWithTile = function(tile) {
    if (tile && ((this.getX() + this.getSprite().width) > tile.getX()) && (this.getX() < (tile.getX() + tile.getSprite().width)) && (inInterval(-this.plus, this.plus, this.y - (tile.getY() - tile.getSprite().height)))) {
        return true;
    }
    return false;
};

Player.prototype.isAboveAndCollidesWithPlayer = function(player) {
    if (player && (this.jumpDown || this.isFalling) && ((this.getX() + this.getSprite().width) > player.getX()) && (this.getX() < (player.getX() + player.getSprite().width)) && (inInterval(-this.plus, this.plus, this.y - (player.getY() - player.getSprite().height)))) {
        this.playKill();
        return true;
    }
    return false;
};

// misc
Player.prototype.isAboveTile = function(tile) {
    if (tile && ((this.getX() + this.getSprite().width) > tile.getX()) && (this.getX() < (tile.getX() + tile.getSprite().width)) && (this.y <= (tile.getY() - tile.getSprite().height))) {
        return true;
    }
    return false;
};
