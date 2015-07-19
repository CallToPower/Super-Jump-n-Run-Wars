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

function Tile(x, y, spriteNr, winWidth, winHeight, moveH, moveV) {
    // parameters
    this.x = x || 0;
    this.y = y || 0;
    this.spriteNr = spriteNr;
    this.plus = 1;
    this.windowWidth = winWidth;
    this.windowHeight = winHeight;
    this.moveH = moveH || false;
    this.moveV = moveV || false;
    // move horizontal
    this.movingHL = false;
    this.movingHR = false;
    this.currX = 0;
    this.maxRight = 80;
    this.maxLeft = -this.maxRight;
    this.currHDirection = 1; // 1 = right, -1 = left;
    // move vertical
    this.movingVU = false;
    this.movingVD = false;
    this.currY = 0;
    this.maxUp = 80;
    this.maxDown = 0;
    this.currVDirection = 1; // 1 = up, -1 = down;
}

Tile.prototype.up = function () {
    if (this.y > -this.windowHeight) {
        this.y -= this.plus;
    }
};

Tile.prototype.down = function () {
    if (this.y < 0) {
        this.y += this.plus;
    }
};

Tile.prototype.left = function () {
    if (this.x > 0) {
        this.x -= this.plus;
    }
};

Tile.prototype.right = function () {
    if (this.x < this.windowWidth) {
        this.x += this.plus;
    }
};

Tile.prototype.moveVertical = function () {
    if ((this.currVDirection == 1) && (this.currY < this.maxUp)) {
        this.movingVU = true;
        this.movingVD = false;
        this.up();
        this.currY++;
    } else if (this.currY > this.maxDown) {
        this.movingVU = false;
        this.movingVD = true;
        this.currVDirection = -1;
        this.down();
        this.currY--;
    } else {
        this.movingVU = false;
        this.movingVD = false;
        this.currVDirection = 1;
    }
};

Tile.prototype.moveHorizontal = function (players) {
    if ((this.currHDirection == 1) && (this.currX < this.maxRight)) {
        this.movingHR = true;
        this.movingHL = false;
        this.right();
        this.currX++;
    } else if (this.currX > this.maxLeft) {
        this.movingHR = false;
        this.movingHL = true;
        this.currHDirection = -1;
        this.left();
        this.currX--;
    } else {
        this.movingHR = false;
        this.movingHL = false;
        this.currHDirection = 1;
    }
};

// exports
exports.Tile = Tile;
