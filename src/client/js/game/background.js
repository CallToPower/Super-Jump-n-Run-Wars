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
 * class Background
 */
function Background(sprite) {
    this.sprite = sprite;
}

/**
 * returns the sprite
 * @return
 *      the sprite
 */
Background.prototype.getSprite = function() {
    return this.sprite;
};

/**
 * sets the sprite
 * @param sprite
 *      the sprite
 */
Background.prototype.setSprite = function(sprite) {
    this.sprite = sprite;
};

/**
 * draws the background
 * @param context
 *      context to draw in
 */
Background.prototype.draw = function(context) {
    context.drawImage(this.sprite, 0, 0, context.canvas.width, context.canvas.height);
};
