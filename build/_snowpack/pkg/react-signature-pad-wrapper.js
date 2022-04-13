import { r as react } from './common/index-ec604146.js';
import './common/_commonjsHelpers-37fa8da4.js';

/*!
 * Signature Pad v4.0.2 | https://github.com/szimek/signature_pad
 * (c) 2022 Szymon Nowak | Released under the MIT license
 */

class Point {
    constructor(x, y, pressure, time) {
        if (isNaN(x) || isNaN(y)) {
            throw new Error(`Point is invalid: (${x}, ${y})`);
        }
        this.x = +x;
        this.y = +y;
        this.pressure = pressure || 0;
        this.time = time || Date.now();
    }
    distanceTo(start) {
        return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
    }
    equals(other) {
        return (this.x === other.x &&
            this.y === other.y &&
            this.pressure === other.pressure &&
            this.time === other.time);
    }
    velocityFrom(start) {
        return this.time !== start.time
            ? this.distanceTo(start) / (this.time - start.time)
            : 0;
    }
}

class Bezier {
    constructor(startPoint, control2, control1, endPoint, startWidth, endWidth) {
        this.startPoint = startPoint;
        this.control2 = control2;
        this.control1 = control1;
        this.endPoint = endPoint;
        this.startWidth = startWidth;
        this.endWidth = endWidth;
    }
    static fromPoints(points, widths) {
        const c2 = this.calculateControlPoints(points[0], points[1], points[2]).c2;
        const c3 = this.calculateControlPoints(points[1], points[2], points[3]).c1;
        return new Bezier(points[1], c2, c3, points[2], widths.start, widths.end);
    }
    static calculateControlPoints(s1, s2, s3) {
        const dx1 = s1.x - s2.x;
        const dy1 = s1.y - s2.y;
        const dx2 = s2.x - s3.x;
        const dy2 = s2.y - s3.y;
        const m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
        const m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };
        const l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        const dxm = m1.x - m2.x;
        const dym = m1.y - m2.y;
        const k = l2 / (l1 + l2);
        const cm = { x: m2.x + dxm * k, y: m2.y + dym * k };
        const tx = s2.x - cm.x;
        const ty = s2.y - cm.y;
        return {
            c1: new Point(m1.x + tx, m1.y + ty),
            c2: new Point(m2.x + tx, m2.y + ty),
        };
    }
    length() {
        const steps = 10;
        let length = 0;
        let px;
        let py;
        for (let i = 0; i <= steps; i += 1) {
            const t = i / steps;
            const cx = this.point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
            const cy = this.point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
            if (i > 0) {
                const xdiff = cx - px;
                const ydiff = cy - py;
                length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
            }
            px = cx;
            py = cy;
        }
        return length;
    }
    point(t, start, c1, c2, end) {
        return (start * (1.0 - t) * (1.0 - t) * (1.0 - t))
            + (3.0 * c1 * (1.0 - t) * (1.0 - t) * t)
            + (3.0 * c2 * (1.0 - t) * t * t)
            + (end * t * t * t);
    }
}

class SignatureEventTarget {
    constructor() {
        try {
            this._et = new EventTarget();
        }
        catch (error) {
            this._et = document;
        }
    }
    addEventListener(type, listener, options) {
        this._et.addEventListener(type, listener, options);
    }
    dispatchEvent(event) {
        return this._et.dispatchEvent(event);
    }
    removeEventListener(type, callback, options) {
        this._et.removeEventListener(type, callback, options);
    }
}

function throttle$1(fn, wait = 250) {
    let previous = 0;
    let timeout = null;
    let result;
    let storedContext;
    let storedArgs;
    const later = () => {
        previous = Date.now();
        timeout = null;
        result = fn.apply(storedContext, storedArgs);
        if (!timeout) {
            storedContext = null;
            storedArgs = [];
        }
    };
    return function wrapper(...args) {
        const now = Date.now();
        const remaining = wait - (now - previous);
        storedContext = this;
        storedArgs = args;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = fn.apply(storedContext, storedArgs);
            if (!timeout) {
                storedContext = null;
                storedArgs = [];
            }
        }
        else if (!timeout) {
            timeout = window.setTimeout(later, remaining);
        }
        return result;
    };
}

class SignaturePad extends SignatureEventTarget {
    constructor(canvas, options = {}) {
        super();
        this.canvas = canvas;
        this._handleMouseDown = (event) => {
            if (event.buttons === 1) {
                this._drawningStroke = true;
                this._strokeBegin(event);
            }
        };
        this._handleMouseMove = (event) => {
            if (this._drawningStroke) {
                this._strokeMoveUpdate(event);
            }
        };
        this._handleMouseUp = (event) => {
            if (event.buttons === 1 && this._drawningStroke) {
                this._drawningStroke = false;
                this._strokeEnd(event);
            }
        };
        this._handleTouchStart = (event) => {
            event.preventDefault();
            if (event.targetTouches.length === 1) {
                const touch = event.changedTouches[0];
                this._strokeBegin(touch);
            }
        };
        this._handleTouchMove = (event) => {
            event.preventDefault();
            const touch = event.targetTouches[0];
            this._strokeMoveUpdate(touch);
        };
        this._handleTouchEnd = (event) => {
            const wasCanvasTouched = event.target === this.canvas;
            if (wasCanvasTouched) {
                event.preventDefault();
                const touch = event.changedTouches[0];
                this._strokeEnd(touch);
            }
        };
        this._handlePointerStart = (event) => {
            this._drawningStroke = true;
            event.preventDefault();
            this._strokeBegin(event);
        };
        this._handlePointerMove = (event) => {
            if (this._drawningStroke) {
                event.preventDefault();
                this._strokeMoveUpdate(event);
            }
        };
        this._handlePointerEnd = (event) => {
            this._drawningStroke = false;
            const wasCanvasTouched = event.target === this.canvas;
            if (wasCanvasTouched) {
                event.preventDefault();
                this._strokeEnd(event);
            }
        };
        this.velocityFilterWeight = options.velocityFilterWeight || 0.7;
        this.minWidth = options.minWidth || 0.5;
        this.maxWidth = options.maxWidth || 2.5;
        this.throttle = ('throttle' in options ? options.throttle : 16);
        this.minDistance = ('minDistance' in options ? options.minDistance : 5);
        this.dotSize = options.dotSize || 0;
        this.penColor = options.penColor || 'black';
        this.backgroundColor = options.backgroundColor || 'rgba(0,0,0,0)';
        this._strokeMoveUpdate = this.throttle
            ? throttle$1(SignaturePad.prototype._strokeUpdate, this.throttle)
            : SignaturePad.prototype._strokeUpdate;
        this._ctx = canvas.getContext('2d');
        this.clear();
        this.on();
    }
    clear() {
        const { _ctx: ctx, canvas } = this;
        ctx.fillStyle = this.backgroundColor;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        this._data = [];
        this._reset();
        this._isEmpty = true;
    }
    fromDataURL(dataUrl, options = {}) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            const ratio = options.ratio || window.devicePixelRatio || 1;
            const width = options.width || this.canvas.width / ratio;
            const height = options.height || this.canvas.height / ratio;
            const xOffset = options.xOffset || 0;
            const yOffset = options.yOffset || 0;
            this._reset();
            image.onload = () => {
                this._ctx.drawImage(image, xOffset, yOffset, width, height);
                resolve();
            };
            image.onerror = (error) => {
                reject(error);
            };
            image.crossOrigin = 'anonymous';
            image.src = dataUrl;
            this._isEmpty = false;
        });
    }
    toDataURL(type = 'image/png', encoderOptions) {
        switch (type) {
            case 'image/svg+xml':
                return this._toSVG();
            default:
                return this.canvas.toDataURL(type, encoderOptions);
        }
    }
    on() {
        this.canvas.style.touchAction = 'none';
        this.canvas.style.msTouchAction = 'none';
        this.canvas.style.userSelect = 'none';
        const isIOS = /Macintosh/.test(navigator.userAgent) && 'ontouchstart' in document;
        if (window.PointerEvent && !isIOS) {
            this._handlePointerEvents();
        }
        else {
            this._handleMouseEvents();
            if ('ontouchstart' in window) {
                this._handleTouchEvents();
            }
        }
    }
    off() {
        this.canvas.style.touchAction = 'auto';
        this.canvas.style.msTouchAction = 'auto';
        this.canvas.style.userSelect = 'auto';
        this.canvas.removeEventListener('pointerdown', this._handlePointerStart);
        this.canvas.removeEventListener('pointermove', this._handlePointerMove);
        document.removeEventListener('pointerup', this._handlePointerEnd);
        this.canvas.removeEventListener('mousedown', this._handleMouseDown);
        this.canvas.removeEventListener('mousemove', this._handleMouseMove);
        document.removeEventListener('mouseup', this._handleMouseUp);
        this.canvas.removeEventListener('touchstart', this._handleTouchStart);
        this.canvas.removeEventListener('touchmove', this._handleTouchMove);
        this.canvas.removeEventListener('touchend', this._handleTouchEnd);
    }
    isEmpty() {
        return this._isEmpty;
    }
    fromData(pointGroups, { clear = true } = {}) {
        if (clear) {
            this.clear();
        }
        this._fromData(pointGroups, this._drawCurve.bind(this), this._drawDot.bind(this));
        this._data = clear ? pointGroups : this._data.concat(pointGroups);
    }
    toData() {
        return this._data;
    }
    _strokeBegin(event) {
        this.dispatchEvent(new CustomEvent('beginStroke', { detail: event }));
        const newPointGroup = {
            dotSize: this.dotSize,
            minWidth: this.minWidth,
            maxWidth: this.maxWidth,
            penColor: this.penColor,
            points: [],
        };
        this._data.push(newPointGroup);
        this._reset();
        this._strokeUpdate(event);
    }
    _strokeUpdate(event) {
        if (this._data.length === 0) {
            this._strokeBegin(event);
            return;
        }
        this.dispatchEvent(new CustomEvent('beforeUpdateStroke', { detail: event }));
        const x = event.clientX;
        const y = event.clientY;
        const pressure = event.pressure !== undefined
            ? event.pressure
            : event.force !== undefined
                ? event.force
                : 0;
        const point = this._createPoint(x, y, pressure);
        const lastPointGroup = this._data[this._data.length - 1];
        const lastPoints = lastPointGroup.points;
        const lastPoint = lastPoints.length > 0 && lastPoints[lastPoints.length - 1];
        const isLastPointTooClose = lastPoint
            ? point.distanceTo(lastPoint) <= this.minDistance
            : false;
        const { penColor, dotSize, minWidth, maxWidth } = lastPointGroup;
        if (!lastPoint || !(lastPoint && isLastPointTooClose)) {
            const curve = this._addPoint(point);
            if (!lastPoint) {
                this._drawDot(point, {
                    penColor,
                    dotSize,
                    minWidth,
                    maxWidth,
                });
            }
            else if (curve) {
                this._drawCurve(curve, {
                    penColor,
                    dotSize,
                    minWidth,
                    maxWidth,
                });
            }
            lastPoints.push({
                time: point.time,
                x: point.x,
                y: point.y,
                pressure: point.pressure,
            });
        }
        this.dispatchEvent(new CustomEvent('afterUpdateStroke', { detail: event }));
    }
    _strokeEnd(event) {
        this._strokeUpdate(event);
        this.dispatchEvent(new CustomEvent('endStroke', { detail: event }));
    }
    _handlePointerEvents() {
        this._drawningStroke = false;
        this.canvas.addEventListener('pointerdown', this._handlePointerStart);
        this.canvas.addEventListener('pointermove', this._handlePointerMove);
        document.addEventListener('pointerup', this._handlePointerEnd);
    }
    _handleMouseEvents() {
        this._drawningStroke = false;
        this.canvas.addEventListener('mousedown', this._handleMouseDown);
        this.canvas.addEventListener('mousemove', this._handleMouseMove);
        document.addEventListener('mouseup', this._handleMouseUp);
    }
    _handleTouchEvents() {
        this.canvas.addEventListener('touchstart', this._handleTouchStart);
        this.canvas.addEventListener('touchmove', this._handleTouchMove);
        this.canvas.addEventListener('touchend', this._handleTouchEnd);
    }
    _reset() {
        this._lastPoints = [];
        this._lastVelocity = 0;
        this._lastWidth = (this.minWidth + this.maxWidth) / 2;
        this._ctx.fillStyle = this.penColor;
    }
    _createPoint(x, y, pressure) {
        const rect = this.canvas.getBoundingClientRect();
        return new Point(x - rect.left, y - rect.top, pressure, new Date().getTime());
    }
    _addPoint(point) {
        const { _lastPoints } = this;
        _lastPoints.push(point);
        if (_lastPoints.length > 2) {
            if (_lastPoints.length === 3) {
                _lastPoints.unshift(_lastPoints[0]);
            }
            const widths = this._calculateCurveWidths(_lastPoints[1], _lastPoints[2]);
            const curve = Bezier.fromPoints(_lastPoints, widths);
            _lastPoints.shift();
            return curve;
        }
        return null;
    }
    _calculateCurveWidths(startPoint, endPoint) {
        const velocity = this.velocityFilterWeight * endPoint.velocityFrom(startPoint) +
            (1 - this.velocityFilterWeight) * this._lastVelocity;
        const newWidth = this._strokeWidth(velocity);
        const widths = {
            end: newWidth,
            start: this._lastWidth,
        };
        this._lastVelocity = velocity;
        this._lastWidth = newWidth;
        return widths;
    }
    _strokeWidth(velocity) {
        return Math.max(this.maxWidth / (velocity + 1), this.minWidth);
    }
    _drawCurveSegment(x, y, width) {
        const ctx = this._ctx;
        ctx.moveTo(x, y);
        ctx.arc(x, y, width, 0, 2 * Math.PI, false);
        this._isEmpty = false;
    }
    _drawCurve(curve, options) {
        const ctx = this._ctx;
        const widthDelta = curve.endWidth - curve.startWidth;
        const drawSteps = Math.ceil(curve.length()) * 2;
        ctx.beginPath();
        ctx.fillStyle = options.penColor;
        for (let i = 0; i < drawSteps; i += 1) {
            const t = i / drawSteps;
            const tt = t * t;
            const ttt = tt * t;
            const u = 1 - t;
            const uu = u * u;
            const uuu = uu * u;
            let x = uuu * curve.startPoint.x;
            x += 3 * uu * t * curve.control1.x;
            x += 3 * u * tt * curve.control2.x;
            x += ttt * curve.endPoint.x;
            let y = uuu * curve.startPoint.y;
            y += 3 * uu * t * curve.control1.y;
            y += 3 * u * tt * curve.control2.y;
            y += ttt * curve.endPoint.y;
            const width = Math.min(curve.startWidth + ttt * widthDelta, options.maxWidth);
            this._drawCurveSegment(x, y, width);
        }
        ctx.closePath();
        ctx.fill();
    }
    _drawDot(point, options) {
        const ctx = this._ctx;
        const width = options.dotSize > 0
            ? options.dotSize
            : (options.minWidth + options.maxWidth) / 2;
        ctx.beginPath();
        this._drawCurveSegment(point.x, point.y, width);
        ctx.closePath();
        ctx.fillStyle = options.penColor;
        ctx.fill();
    }
    _fromData(pointGroups, drawCurve, drawDot) {
        for (const group of pointGroups) {
            const { penColor, dotSize, minWidth, maxWidth, points } = group;
            if (points.length > 1) {
                for (let j = 0; j < points.length; j += 1) {
                    const basicPoint = points[j];
                    const point = new Point(basicPoint.x, basicPoint.y, basicPoint.pressure, basicPoint.time);
                    this.penColor = penColor;
                    if (j === 0) {
                        this._reset();
                    }
                    const curve = this._addPoint(point);
                    if (curve) {
                        drawCurve(curve, {
                            penColor,
                            dotSize,
                            minWidth,
                            maxWidth,
                        });
                    }
                }
            }
            else {
                this._reset();
                drawDot(points[0], {
                    penColor,
                    dotSize,
                    minWidth,
                    maxWidth,
                });
            }
        }
    }
    _toSVG() {
        const pointGroups = this._data;
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const minX = 0;
        const minY = 0;
        const maxX = this.canvas.width / ratio;
        const maxY = this.canvas.height / ratio;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', this.canvas.width.toString());
        svg.setAttribute('height', this.canvas.height.toString());
        this._fromData(pointGroups, (curve, { penColor }) => {
            const path = document.createElement('path');
            if (!isNaN(curve.control1.x) &&
                !isNaN(curve.control1.y) &&
                !isNaN(curve.control2.x) &&
                !isNaN(curve.control2.y)) {
                const attr = `M ${curve.startPoint.x.toFixed(3)},${curve.startPoint.y.toFixed(3)} ` +
                    `C ${curve.control1.x.toFixed(3)},${curve.control1.y.toFixed(3)} ` +
                    `${curve.control2.x.toFixed(3)},${curve.control2.y.toFixed(3)} ` +
                    `${curve.endPoint.x.toFixed(3)},${curve.endPoint.y.toFixed(3)}`;
                path.setAttribute('d', attr);
                path.setAttribute('stroke-width', (curve.endWidth * 2.25).toFixed(3));
                path.setAttribute('stroke', penColor);
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-linecap', 'round');
                svg.appendChild(path);
            }
        }, (point, { penColor, dotSize, minWidth, maxWidth }) => {
            const circle = document.createElement('circle');
            const size = dotSize > 0 ? dotSize : (minWidth + maxWidth) / 2;
            circle.setAttribute('r', size.toString());
            circle.setAttribute('cx', point.x.toString());
            circle.setAttribute('cy', point.y.toString());
            circle.setAttribute('fill', penColor);
            svg.appendChild(circle);
        });
        const prefix = 'data:image/svg+xml;base64,';
        const header = '<svg' +
            ' xmlns="http://www.w3.org/2000/svg"' +
            ' xmlns:xlink="http://www.w3.org/1999/xlink"' +
            ` viewBox="${minX} ${minY} ${this.canvas.width} ${this.canvas.height}"` +
            ` width="${maxX}"` +
            ` height="${maxY}"` +
            '>';
        let body = svg.innerHTML;
        if (body === undefined) {
            const dummy = document.createElement('dummy');
            const nodes = svg.childNodes;
            dummy.innerHTML = '';
            for (let i = 0; i < nodes.length; i += 1) {
                dummy.appendChild(nodes[i].cloneNode(true));
            }
            body = dummy.innerHTML;
        }
        const footer = '</svg>';
        const data = header + body + footer;
        return prefix + btoa(data);
    }
}

/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {number}    delay -          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {boolean}   [noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
 *                                    the internal counter is reset).
 * @param  {Function}  callback -       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {boolean}   [debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @returns {Function}  A new, throttled, function.
 */
function throttle (delay, noTrailing, callback, debounceMode) {
  /*
   * After wrapper has stopped being called, this timeout ensures that
   * `callback` is executed at the proper times in `throttle` and `end`
   * debounce modes.
   */
  var timeoutID;
  var cancelled = false; // Keep track of the last time `callback` was executed.

  var lastExec = 0; // Function to clear existing timeout

  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  } // Function to cancel next exec


  function cancel() {
    clearExistingTimeout();
    cancelled = true;
  } // `noTrailing` defaults to falsy.


  if (typeof noTrailing !== 'boolean') {
    debounceMode = callback;
    callback = noTrailing;
    noTrailing = undefined;
  }
  /*
   * The `wrapper` function encapsulates all of the throttling / debouncing
   * functionality and when executed will limit the rate at which `callback`
   * is executed.
   */


  function wrapper() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }

    var self = this;
    var elapsed = Date.now() - lastExec;

    if (cancelled) {
      return;
    } // Execute `callback` and update the `lastExec` timestamp.


    function exec() {
      lastExec = Date.now();
      callback.apply(self, arguments_);
    }
    /*
     * If `debounceMode` is true (at begin) this is used to clear the flag
     * to allow future `callback` executions.
     */


    function clear() {
      timeoutID = undefined;
    }

    if (debounceMode && !timeoutID) {
      /*
       * Since `wrapper` is being called for the first time and
       * `debounceMode` is true (at begin), execute `callback`.
       */
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      /*
       * In throttle mode, if `delay` time has been exceeded, execute
       * `callback`.
       */
      exec();
    } else if (noTrailing !== true) {
      /*
       * In trailing throttle mode, since `delay` time has not been
       * exceeded, schedule `callback` to execute `delay` ms after most
       * recent execution.
       *
       * If `debounceMode` is true (at begin), schedule `clear` to execute
       * after `delay` ms.
       *
       * If `debounceMode` is false (at end), schedule `callback` to
       * execute after `delay` ms.
       */
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
    }
  }

  wrapper.cancel = cancel; // Return the wrapper function.

  return wrapper;
}

/* eslint-disable no-undefined */
/**
 * Debounce execution of a function. Debouncing, unlike throttling,
 * guarantees that a function is only executed a single time, either at the
 * very beginning of a series of calls, or at the very end.
 *
 * @param  {number}   delay -         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {boolean}  [atBegin] -     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
 *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
 *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
 * @param  {Function} callback -      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                  to `callback` when the debounced-function is executed.
 *
 * @returns {Function} A new, debounced function.
 */

function debounce (delay, atBegin, callback) {
  return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var r=function(t,e){return r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e;}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);},r(t,e)};var i=function(){return i=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},i.apply(this,arguments)},o=function(o){function a(e){var r=o.call(this,e)||this;return r.canvasRef=react.createRef(),r.state={canvasWidth:0,canvasHeight:0},r.callResizeHandler=debounce(r.props.debounceInterval,r.handleResize.bind(r)),r}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t;}r(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n);}(a,o),a.prototype.componentDidMount=function(){var t=this.canvasRef.current;t&&(this.props.width&&this.props.height||(t.style.width="100%",window.addEventListener("resize",this.callResizeHandler)),this.signaturePad=new SignaturePad(t,this.props.options),this.scaleCanvas(t));},a.prototype.componentWillUnmount=function(){this.props.width&&this.props.height||window.removeEventListener("resize",this.callResizeHandler),this.signaturePad.off();},Object.defineProperty(a.prototype,"instance",{get:function(){return this.signaturePad},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"canvas",{get:function(){return this.canvasRef},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"dotSize",{get:function(){return this.signaturePad.dotSize},set:function(t){this.signaturePad.dotSize=t;},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"minWidth",{get:function(){return this.signaturePad.minWidth},set:function(t){this.signaturePad.minWidth=t;},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"maxWidth",{get:function(){return this.signaturePad.maxWidth},set:function(t){this.signaturePad.maxWidth=t;},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"throttle",{get:function(){return this.signaturePad.throttle},set:function(t){this.signaturePad.throttle=t;},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"backgroundColor",{get:function(){return this.signaturePad.backgroundColor},set:function(t){this.signaturePad.backgroundColor=t;},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"penColor",{get:function(){return this.signaturePad.penColor},set:function(t){this.signaturePad.penColor=t;},enumerable:!1,configurable:!0}),Object.defineProperty(a.prototype,"velocityFilterWeight",{get:function(){return this.signaturePad.velocityFilterWeight},set:function(t){this.signaturePad.velocityFilterWeight=t;},enumerable:!1,configurable:!0}),a.prototype.isEmpty=function(){return this.signaturePad.isEmpty()},a.prototype.clear=function(){this.signaturePad.clear();},a.prototype.fromDataURL=function(t){this.signaturePad.fromDataURL(t);},a.prototype.toDataURL=function(t,e){return this.signaturePad.toDataURL(t,e)},a.prototype.fromData=function(t){this.signaturePad.fromData(t);},a.prototype.toData=function(){return this.signaturePad.toData()},a.prototype.off=function(){this.signaturePad.off();},a.prototype.on=function(){this.signaturePad.on();},a.prototype.handleResize=function(){var t=this.canvasRef.current;t&&this.scaleCanvas(t);},a.prototype.scaleCanvas=function(t){var e=Math.max(window.devicePixelRatio||1,1),n=(this.props.width||t.offsetWidth)*e,r=(this.props.height||t.offsetHeight)*e,i=this.state,o=i.canvasWidth,a=i.canvasHeight;if(n!==o||r!==a){var s;this.props.redrawOnResize&&this.signaturePad&&(s=this.signaturePad.toDataURL()),t.width=n,t.height=r,this.setState({canvasWidth:n,canvasHeight:r});var u=t.getContext("2d");u&&u.scale(e,e),s?this.signaturePad.fromDataURL(s):this.signaturePad&&this.signaturePad.clear();}},a.prototype.render=function(){var e=this.props.canvasProps;return react.createElement("canvas",i({ref:this.canvasRef},e))},a.displayName="react-signature-pad-wrapper",a.defaultProps={redrawOnResize:!1,debounceInterval:150},a}(react.PureComponent);

export { o as default };
