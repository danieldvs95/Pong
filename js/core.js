var canvas,ctx;
var ball;
var player1;
var player2;
const PADDLE_THICKNESS = 10;
const W_KEY = 87;
const D_KEY = 83;
const UP_ARROW_KEY = 38;
const DOWN_ARROW_KEY = 40;
var player1Score = player2Score = 0;
var keys = [];

function Ball(x,y,size,speedX,speedY){
  this.x = x;
  this.y = y;
  this.size = size;
  this.speedX = speedX;
  this.speedY = speedY;
  this.update = function(){
    this.x += this.speedX;
    this.y += this.speedY;

    if(this.y - this.size <= 0 || this.y +this.size >= canvas.height){
      this.speedY *= -1;
    }

    if(this.x >= (canvas.width - this.size)){
      this.reset();
      updatePoints("player1");
    }
    if(this.x <= 0){
      this.reset();
      updatePoints("player2");
    }

    //Player 1 Collision
    if(((this.x - this.size) <= player1.width) && (this.y > player1.y && this.y < (player1.y + player1.height))){
      this.changeDirection();
      var deltaY = this.y - (player1.y + (player1.height/2));
      this.speedY = deltaY * 0.25;
    }

    //Player 2 Collision
    if(((this.x + this.size) >= player2.x) && (this.y > player2.y && this.y < (player2.y + player2.height))){
      this.changeDirection();
      var deltaY = this.y - (player2.y + (player2.height/2));
      this.speedY = deltaY * 0.25;
    }

  }
  this.draw = function(){
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2,true);
    ctx.fill();
  }
  this.reset = function(){
    this.x = canvas.width/2 - (this.size/2);
    this.y = canvas.height/2 - (this.size/2);
    this.speedY = speedY;
    this.changeDirection();
  }
  this.changeDirection = function(){
    this.speedX *= -1;
  }
}

function Paddle(x,y,size,speed,upKey,downKey){
  this.x = x;
  this.y = y;
  this.width = PADDLE_THICKNESS;
  this.height = size;
  this.speed = speed;
  this.upKey = upKey;
  this.downKey = downKey;
  this.update = function(){
    if(keys[upKey] && keys[upKey] >= 1){
      this.y -= speed;
    }
    if(keys[downKey] && keys[downKey] >= 1){
      this.y += speed;
    }
    if(this.y <= 0){
      this.y = 0;
    }
    if(this.y >= (canvas.height - this.height)){
      this.y = canvas.height - this.height;
    }
  }
  this.draw = function(){
    ctx.fillStyle = "white";
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
}

window.onload = function(){
  canvas = document.getElementById("core");
  if(canvas){
    ctx = canvas.getContext("2d");
    initGameElements();
    //Add Key Events
    document.addEventListener("keydown",onKeyDown);
    document.addEventListener("keyup",onKeyUp);
  }
}

//Start the Game
function startGame(){
  var fps = 60;
  setInterval(function(){update();draw();},1000/fps);
  var gameButton = document.getElementById("game-button");
  gameButton.disabled = "disabled";
  gameButton.className = "disabled-button";
  gameButton.style.opacity = "0.5";
}

//Iinitialize different elements of the Game
function initGameElements(){
  //Ball instance
  var size = 8;
  var speedX = 5;
  var speedY = 1;
  ball = new Ball(canvas.width/2 - (size/2),canvas.height/2 - (size/2),size,speedX,speedY);
  //Player 1 & 2 instance
  var paddleSize = 80;
  var paddleSpeed = 7;
  player1 = new Paddle(0,canvas.height/2 - paddleSize/2,paddleSize,paddleSpeed,W_KEY,D_KEY);
  player1.draw();
  player2 = new Paddle(canvas.width - PADDLE_THICKNESS,canvas.height/2 - paddleSize/2,paddleSize,paddleSpeed,UP_ARROW_KEY,DOWN_ARROW_KEY);
  player2.draw();
  //Draw de y-center net
  drawNet();
}

function update(){
  if(ball){
    ball.update();
  }
  if(player1){
    player1.update();
  }
  if(player2){
    player2.update();
  }
}

function draw(){
  if(ctx){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    drawNet();

    if(ball){
      ball.draw();
    }
    if(player1){
      player1.draw();
    }
    if(player2){
      player2.draw();
    }
  }
}

function drawNet(){
  ctx.setLineDash([4]);
  ctx.beginPath();
  ctx.moveTo(canvas.width/2,10);
  ctx.lineTo(canvas.width/2,canvas.height-10);
  ctx.strokeStyle = 'white';
  ctx.stroke();
}

function onKeyDown(evt){
  keys[evt.keyCode] = 1;
}

function onKeyUp(evt){
  keys[evt.keyCode] = 0;
}

function updatePoints(player){
  var score1 = document.getElementById("score1");
  var score2 = document.getElementById("score2");
  if(player === 'player1'){
    player1Score++;
    score1.innerHTML = player1Score;
  }else{
    player2Score++;
    score2.innerHTML = player2Score;
  }
}


function calculateMousePos(evt){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };
}
