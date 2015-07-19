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

/*jshint -W083 */

/**
 * class AssetManager
 */
function AssetManager() {
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = {};
    this.downloadQueue = [];
}

/**
 * puts a new download to the queue
 * @param path
 *      path to the asset
 */
AssetManager.prototype.queueDownload = function(path) {
    this.downloadQueue.push(path);
};

/**
 * returns whether everything has been downloaded
 * @return
 *      true when downloads finished, false else
 */
AssetManager.prototype.isDone = function() {
    return (this.downloadQueue.length == this.successCount + this.errorCount);
};

/**
 * downloads all downloads in the queue and saves it in the cache
 * @param callback
 *      callback function when everything has been downloaded
 */
AssetManager.prototype.downloadAll = function(callback) {
    for (var i = 0; i < this.downloadQueue.length; ++i) {
        var path = this.downloadQueue[i];
        var img = new Image();
        var that = this;
        img.addEventListener("load", function() {
            that.successCount += 1;
            if (that.isDone()) {
                callback();
            }
        });
        img.addEventListener("error", function() {
            that.errorCount += 1;
            if (that.isDone()) {
                callback();
            }
        });
        img.src = path;
        this.cache[path] = img;
    }
};

/**
 * returns a downloaded asset
 * @param path
 *      path to the asset
 * @return
 *      a downloaded asset
 */
AssetManager.prototype.getAsset = function(path) {
    return this.cache[path];
};
