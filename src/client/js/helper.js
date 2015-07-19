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
 * formats a message
 * @param timeString
 *      the time
 * @param name
 *      name of the player
 * @param msg
 *      the message
 * @return
 *      a formatted message
 */
function formatMsg(timeString, name, msg) {
    return "<br />&nbsp;<span style='color:" + timeColor + ";'>" + timeString + "</span> - <span style='color:" + nameColor + ";'>" + name + "</span>: " + msg;
}

/**
 * returns a time string
 * @return
 *      a time string
 */
function getTimeString() {
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    return ((h < 10) ? ("0" + h) : h) + ":" + ((m < 10) ? ("0" + m) : m) + ":" + ((s < 10) ? ("0" + s) : s);
}

/**
 * checks whether num is in [lower, upper]
 * @param lower
 *      lower bound
 * @param upper
 *      upper bound
 * @return
 *      true when num is in [lower, upper], false else
 */
function inInterval(lower, upper, num) {
    return ((num >= lower) && (num <= upper));
}

/**
 * returns a random number in between [min, max]
 * @param min
 *      min value
 * @param max
 *      max value
 * @return
 *      a random number in between [min, max]
 **/
function getRandom(min, max) {
    if (min == max) {
        return min;
    } else if (min > max) {
        var tmp = max;
        max = min;
        min = max;
    }
    return (min + parseInt(Math.random() * (max - min + 1)));
}
