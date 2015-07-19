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
 * class Tile
 */
function Tile(x, y, sprite, plus) {
    this.x = x || 0;
    this.y = y || 0;
    this.plus = plus;
    this.sprite = sprite;
    this.movingHL = false;
    this.movingHR = false;
    this.movingVU = false;
    this.movingVD = false;
}

// getter
Tile.prototype.getX = function() {
    return this.x;
};

Tile.prototype.getY = function() {
    return this.y;
};

Tile.prototype.getSprite = function() {
    return this.sprite;
};

// setter
Tile.prototype.setX = function(x) {
    this.x = x;
};

Tile.prototype.setY = function(y) {
    this.y = y;
};

Tile.prototype.setSprite = function(sprite) {
    this.sprite = sprite;
};

// draw
Tile.prototype.draw = function(context) {
    context.drawImage(this.sprite, this.x, this.y - this.sprite.height, this.sprite.width, this.sprite.height);
};
