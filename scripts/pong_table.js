var p_canvas = document.getElementById("pongTable");
var p_context = p_canvas.getContext("2d");

var animate = window.requestAnimationFrame || function(callback) { window.setTimeout(callback, 1000/60) };

function step() {
    render_game();
    window.requestAnimationFrame(step);
}

function Player(x, y, width, height) {
    this.x_position = x;
    this.y_position = y;
    this.width = width;
    this.height = height;
    this.speed = 15;
    this.score = 0;
    this.move_up = function() {
        if (this.y_position <= 0) {
            this.y_position = 0;
        } else {
            p_context.clearRect(this.x_position - 1, this.y_position - 1, this.width + 1, this.height + 1);
            this.y_position -= this.speed;
        }  
    }
    this.move_down = function() {
        if (this.y_position >= (p_canvas.height - this.height)) {
            this.y_position = (p_canvas.height - this.height);
        } else {
            p_context.clearRect(this.x_position - 1, this.y_position - 1, this.width + 1, this.height + 1);
            this.y_position += this.speed;
        }  
    }
    this.render = function() {
         p_context.fillRect(this.x_position, this.y_position, this.width, this.height);
    }
}
function Computer(x, y, width, height) {
    this.x_position = x;
    this.y_position = y;
    this.width = width;
    this.height = height;
    this.speed = 1;
    this.score = 0;
    this.render = function() {
         p_context.fillRect(this.x_position, this.y_position, this.width, this.height);
    }
    this.update = function() {
        if (this.y_position < 0) {
            p_context.clearRect(this.x_position - 1, this.y_position - 1, this.width + 1, this.height + 1);
            this.y_position = 0;
        } else if (this.y_position > (p_canvas.height - this.height)) {
            p_context.clearRect(this.x_position - 1, this.y_position - 1, this.width + 1, this.height + 1);
            this.y_position = (p_canvas.height - this.height);
        } else if ((this.y_position + (height / 2)) < pong_ball.y_position) {
            p_context.clearRect(this.x_position - 1, this.y_position - 1, this.width + 1, this.height + 1);
            this.y_position += this.speed;
        } else if ((this.y_position + (height / 2)) > pong_ball.y_position) {
            p_context.clearRect(this.x_position - 1, this.y_position - 1, this.width + 1, this.height + 1);
            this.y_position -= this.speed;
        }
        this.render()
    }
}
function Ball(x, y, radius) {
    this.x_position = x;
    this.y_position = y;
    this.h_speed = -4;
    this.v_speed = ((Math.floor(Math.random() * 8) - 4));
    this.radius = radius;
    this.start_angle = 0;
    this.end_angle = 2 * Math.PI;
    this.render = function() {
        p_context.beginPath();
        p_context.arc(this.x_position, this.y_position, this.radius, this.start_angle, this.end_angle, false);
        p_context.fill();
        p_context.closePath();
    }
    this.serveReset = function() {
        this.h_speed = -5;
        this.v_speed = ((Math.floor(Math.random() * 8) - 4) * 2);
        this.x_position = 500;
        this.y_position = 300;
    }
    this.serve = function() {
        if (this.v_speed == 0) {
            this.v_speed += 3;
        }
        p_context.globalCompositeOperation="destination-out";
        p_context.beginPath();
        p_context.arc(this.x_position, this.y_position, this.radius + 1, this.start_angle, this.end_angle, false);
        p_context.fill();
        p_context.closePath();
        p_context.globalCompositeOperation="source-over";
        if (this.y_position >= (p_canvas.height - this.radius)) {
            this.v_speed = this.v_speed * (-1);
            this.y_position += this.v_speed;
        } else if (this.y_position <= this.radius) {
            this.v_speed = this.v_speed * (-1);
            this.y_position += this.v_speed;
        } else {
            this.y_position += this.v_speed;
        }
        if ((this.x_position + this.radius >= (right_paddle.x_position)) && (this.x_position <= (right_paddle.x_position + right_paddle.width / 10)) && (this.y_position >= right_paddle.y_position && this.y_position <= (right_paddle.y_position + right_paddle.height))) {
            this.h_speed = this.h_speed * (-1);
            this.x_position += this.h_speed;
        } else if ((this.x_position - this.radius <= (left_paddle.x_position + left_paddle.width)) && (this.x_position >= (left_paddle.x_position + left_paddle.width * 0.8)) && (this.y_position >= left_paddle.y_position && this.y_position <= (left_paddle.y_position + left_paddle.height))) {
            this.h_speed = this.h_speed * (-1);
            this.x_position += this.h_speed;
        } else {
            this.x_position += this.h_speed;
        }

        if ((this.x_position - this.radius) >= p_canvas.width) {
            left_paddle.score += 1;
            left_score.innerHTML = "Player's score: " + left_paddle.score;
            this.serveReset();
        }
        if ((this.x_position + this.radius) <= 0) {
            right_paddle.score += 1;
            right_score.innerHTML = "Computer's score: " + right_paddle.score;
            this.serveReset();
        }

        this.render();
    }
}
var left_paddle = new Player(25, 250, 25, 100);
var right_paddle = new Computer(750, 250, 25, 100);
var pong_ball = new Ball(400, 250, 15);
var render_game = function() {
    left_paddle.render();
    right_paddle.update();
    pong_ball.serve();
}
window.addEventListener('keydown', function(e) {
    if (e.keyCode == 38) {
        left_paddle.move_up();
    }
    else if (e.keyCode == 40) {
        left_paddle.move_down();
    }
})

left_score = document.getElementById("leftScore");
right_score = document.getElementById("rightScore");
left_score.innerHTML = "Player's score: " + left_paddle.score;
right_score.innerHTML = "Computer's score: " + right_paddle.score;