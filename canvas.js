// "use strict";

let canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  w = (canvas.width = window.innerHeight),
  h = (canvas.height = window.innerWidth),
  points = [],
  amount = 30, // relative to screen size
  speed = 50,
  size = 0,
  lineWidth = 0.6,
  connectionDistance = 1020, // relative to screen size
  randomSize = 0.2,
  hue = 180,
  seedSize = 800;

window.addEventListener(
  "resize",
  function () {
    (w = canvas.width = window.innerWidth),
      (h = canvas.height = window.innerHeight);

    ctx.fillStyle = "hsl(" + hue + ",40%,50%)";
    ctx.fillRect(0, 0, w, h);
  },
  false
);

function setup() {
  (w = canvas.width = window.innerWidth),
    (h = canvas.height = window.innerHeight);

  let screenDelta = Math.sqrt(w + h) / 100;
  let useAmount = amount * screenDelta;

  for (let i = 0; i < useAmount; i++) {
    let x = w * 1.125 - Math.random() * (w * 1.25);
    let y = h * 1.125 - Math.random() * (h * 1.25);

    let xSpeed = Math.random() * (speed / 10) - speed / 20;
    let ySpeed = Math.random() * (speed / 10) - speed / 20;

    points.push(new Point(x, y, xSpeed, ySpeed));
  }

  ctx.fillStyle = "hsl(" + hue + ",40%,50%)";
  ctx.fillRect(0, 0, w, h);

  draw();
}

function draw() {
  ctx.globalCompositeOperation = "source-over";

  ctx.fillStyle = "hsla(" + hue + ",1%,0%, 0.05)";
  ctx.fillRect(0, 0, w, h);

  ctx.lineWidth = lineWidth;

  let screenDelta = Math.sqrt(w + h) / 100;
  let useDistance = connectionDistance * screenDelta;

  ctx.globalCompositeOperation = "lighter";

  points.each(function (point) {
    let didConnect = false;

    points.each(function (connection) {
      let distanceX = Math.pow(connection.x - point.x, 2);
      let distanceY = Math.pow(connection.y - point.y, 2);
      let distance = Math.sqrt(distanceX + distanceY);

      if (distance <= useDistance) {
        didConnect = true;

        let alpha = 1.0 - distance / useDistance;

        ctx.strokeStyle = "hsla(" + hue + ",59%,17%, " + alpha + ")";
        ctx.beginPath();

        ctx.moveTo(point.x, point.y);
        ctx.bezierCurveTo(
          connection.x,
          connection.y,
          point.controlX,
          connection.controlY,
          point.controlX,
          connection.controlY
        );

        ctx.stroke();
        ctx.closePath();
      }
    });

    if (!didConnect) {
      point.generateSeed();
    }
  });

  ctx.globalCompositeOperation = "source-over";

  points.each(function (point) {
    point.draw();
  });

  window.requestAnimationFrame(draw);
}

let Point = function (_x, _y, _xSpeed, _ySpeed) {
  this.x = _x;
  this.y = _y;
  this.controlX = _x;
  this.controlY = _y;
  this.xSpeed = _xSpeed;
  this.ySpeed = _ySpeed;
  this.seed = seedSize / 2 - Math.random() * seedSize;
  this.count = 0;

  let _this = this;

  this.generateSeed = function () {
    _this.seed = seedSize / 2 - Math.random() * seedSize;
  };

  this.draw = function () {
    let xNoise = Math.random() * randomSize - randomSize / 2;
    let yNoise = Math.random() * randomSize - randomSize / 2;

    _this.controlX = _this.x + _this.seed;
    _this.controlY = _this.y + _this.seed;

    _this.x += _this.xSpeed + xNoise;
    _this.y += _this.ySpeed + yNoise;

    if (_this.x < -(w / 8) || _this.x > w * 1.125) {
      _this.xSpeed = -_this.xSpeed;
    }

    if (_this.y < -(h / 8) || _this.y > h * 1.125) {
      _this.ySpeed = -_this.ySpeed;
    }

    _this.count++;
  };
};

setTimeout(setup, 10);

// Faster than .forEach
Array.prototype.each = function (a) {
  let l = this.length;
  for (let i = 0; i < l; i++) a(this[i], i);
};
