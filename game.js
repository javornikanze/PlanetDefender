class Player {
	constructor(x, y, imageSource, shootingInterval, velocity){
		this.x = x;
		this.y = y;
		this.ship = new Image();
		this.ship.src = imageSource;
		this.shootingInterval = shootingInterval;
		this.velocity = velocity;
	}
}

class Bullet{
	constructor(x, y, dir, imageSource){
		this.x = x;
		this.y = y;
		this.dir = dir;
		this.img = new Image();
		this.img.src = imageSource;
	}
}

class Enemy{
	constructor(imageSource){
		this.x = Math.random()*400+50;
		this.y = 0;
		this.velocity = Math.random()/2+1;
		this.img = new Image();
		this.img.src = imageSource;
	}
}

var canvas, ctx, buffer, player, score = 0, lives = 3, left, right, up, down, 
	shoot, bg, planet, line, rotate = 0, spawn = 0, spawnRate = 100, pause = false, pauseDrawn = false;
var bullets = [];
var enemies = [];
var keyboard = [];

function pauseGame() {
	pause = !pause;
	pauseDrawn = false;
}

function initBackground(){
	ctx.fillStyle = 'rgb(150, 150, 150)';
}

function initElements(){
	canvas = document.getElementById("canvas");

	canvas.width = 500;
	canvas.height = 800;

	ctx = canvas.getContext("2d");
	buffer = canvas.getContext("2d");

	document.body.appendChild(canvas)
}

function drawBackground () {
	rotate += 0.0025;
	if(rotate > 360) {
		rotate = 0;
	}
	
	var x = canvas.width / 2;
	var y = canvas.height / 2;
	
	buffer.translate(x, y);
	buffer.rotate(rotate/Math.PI);
	buffer.drawImage(bg, -550, -550, 1050, 1050)	
	buffer.rotate(-rotate/Math.PI);
	buffer.translate(-x, -y)

	y = 1080;
	buffer.translate(x, y);
	buffer.rotate(rotate/Math.PI);
	buffer.drawImage(planet, -400, -400)
	buffer.rotate(-rotate/Math.PI);
	buffer.translate(-x, -y)
	buffer.drawImage(line, 0, 670)
}
const keys = {
    RIGHT: 0,
	LEFT: 1,
	SPACE: 2,
	UP: 3,
	DOWN: 4
}

function playerInput (e) {

	var keyIsPressed=false;
    if(e.type=='keydown'){
        keyIsPressed=true;
    }
    else if(e.type=='keyup'){
        keyIsPressed=false;
    }
    switch(e.key){
        case left: keyboard[keys.LEFT] = keyIsPressed; break;
        case right: keyboard[keys.RIGHT] = keyIsPressed; break;
		case shoot: keyboard[keys.SPACE] = keyIsPressed; break;
		case up: keyboard[keys.UP] = keyIsPressed; break;
		case down: keyboard[keys.DOWN] = keyIsPressed; break;
        default:break;
	}

}

function left_down() {
	keyboard[keys.LEFT] = true;
}
function left_up() {
	keyboard[keys.LEFT] = false;
}
function right_down() {
	keyboard[keys.RIGHT] = true;
}
function right_up() {
	keyboard[keys.RIGHT] = false;
}
function shoot_up() {
	keyboard[keys.SPACE] = false;
}
function shoot_down() {
	keyboard[keys.SPACE] = true;
}



function drawPlayer (keyboard) {

        if(keyboard[keys.LEFT]){
            if(player.x > 0)
				player.x -= player.velocity;
			else{
				player.x = 500;
			}
        }
        if(keyboard[keys.RIGHT]){
			if(player.x < 500)
				player.x += player.velocity;
			else{
				player.x = 0;
			}
		}
		if(keyboard[keys.DOWN]){
			if(player.y < 670)
				player.y += player.velocity;
		}
		if(keyboard[keys.UP]){
			if(player.y > 0)
				player.y -= player.velocity;
		}
		if(keyboard[keys.SPACE]){
			if (bullets.length == 0){
				bullets.push(new Bullet(player.x, player.y, 1, "resources/bullet1.png"));
			}
			else if(bullets.length > 0){
				if((player.y - bullets[bullets.length-1].y) > player.shootingInterval)
					if(score <= 100){
						bullets.push(new Bullet(player.x, player.y - 20, 1, "resources/bullet1.png"));
						spawnRate = 50;
						player.shootingInterval = 50;
					}
					else if(score > 100 && score < 500){
						bullets.push(new Bullet(player.x - 10, player.y - 20, 1, "resources/bullet1.png"));
						bullets.push(new Bullet(player.x + 10, player.y - 20, 1, "resources/bullet1.png"));
						spawnRate = 20;
						player.shootingInterval = 60;
					}
					else if(score >= 500){
						bullets.push(new Bullet(player.x - 10, player.y - 20, 0, "resources/bullet0.png"));
						bullets.push(new Bullet(player.x, player.y - 20, 1, "resources/bullet1.png"));
						bullets.push(new Bullet(player.x + 10, player.y - 20, 2, "resources/bullet2.png"));
						spawnRate = 10;
						player.shootingInterval = 80;
					}
				}
		}		

	buffer.drawImage(player.ship, player.x - 17, player.y - 20, 40, 40)
}

function updateBullets () {
	if(bullets.length == 0)
		return;

	for(var i = 0; i < bullets.length; i++){
		switch(bullets[i].dir){
			case 0: bullets[i].y -= 3; bullets[i].x -= 1; break;
			case 1: bullets[i].y -= 3; break;
			case 2: bullets[i].y -= 3; bullets[i].x += 1; break;
		}
		
 
		if(bullets[i].y <= 0)
			bullets.splice(i, 1);		
	}
}

function updateEnemies () {
	for(var i = 0; i < enemies.length; i++){
		enemies[i].y += enemies[i].velocity;
	
		if(enemies[i].y >= 675){
			enemies.splice(i, 1);
			score -= 25;		
		}
	}
}

function drawBullets () {
	if(bullets.length == 0)
		return;
	
	buffer.shadowColor = "rgb(255, 141, 133)"; // string https://stackoverflow.com/questions/7814398/a-glow-effect-on-html5-canvas
	buffer.shadowOffsetX = 0;
	buffer.shadowOffsetY = 0; 
	buffer.shadowBlur = 10;

	for(var i = 0; i < bullets.length; i++){
		buffer.drawImage(bullets[i].img, bullets[i].x, bullets[i].y, 8, 8);		
	}
	updateBullets();
	buffer.shadowBlur = 0;
}

function drawEnemies (){
	if(enemies.length == 0)
		return;

	for(var i = 0; i < enemies.length; i++){
		buffer.drawImage(enemies[i].img, enemies[i].x, enemies[i].y, 8, 18);
	}
	updateEnemies();
}

function draw () {
	if(lives > 0){
		if(!pause){
			detectCollision();
			spawnEnemy();
			drawBackground();		
			drawBullets();
			drawPlayer(keyboard);
			drawEnemies();
			drawScore();
		}
		else{
			if(!pauseDrawn){
				ctx.font = "45px Arial";
				ctx.fillStyle = "rgb(228, 229, 255)";
				ctx.shadowColor = "rgb(228, 229, 255)"; // string https://stackoverflow.com/questions/7814398/a-glow-effect-on-html5-canvas
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = 0; 
				ctx.shadowBlur = 20;
				ctx.fillText("GAME PAUSED", canvas.width/2-155, canvas.height/2);
				ctx.font = "20px Arial";
				pauseDrawn = true;
				ctx.shadowBlur = 0;
			}			
		}
		setTimeout(() => {
			window.requestAnimationFrame(draw);
		  }, 1000 / 60);		
	}
	else if(lives <= 0) {
		var username = prompt("Please enter your name to save your score:");
		if(username == null || username == "") {
			reset();
		}
		else {
			saveScore(username);
			reset();
		}
	}
}

function saveScore(username) {
	var date = new Date();
	var insert = true;
	if(localStorage.scoreboard) {
		var scoreboard = JSON.parse(localStorage.getItem("scoreboard"));
		for(var i = 0; i < scoreboard.length; i++) {
			if(score >= scoreboard[i][1]) {
				scoreboard.splice(i, 0, [username, score, date.toLocaleTimeString() + " " + date.toLocaleDateString()]); //https://stackoverflow.com/questions/586182/how-to-insert-an-item-into-an-array-at-a-specific-index-javascript
				insert = false;
				break;
			}
		}
		if(insert) {
			scoreboard.push([username, score, date.toLocaleTimeString() + " " + date.toLocaleDateString()]);
		}
		localStorage.scoreboard = JSON.stringify(scoreboard);
	}
	else {
		scoreboard = Array();
		scoreboard.push([username, score, date.toLocaleTimeString() + " " + date.toLocaleDateString()]);
		localStorage.scoreboard = JSON.stringify(scoreboard);
	}	
}

function drawScoreboard() {
	var query = document.getElementById("search").value;
	if(!query) {
		query = "";
	}
	table = document.getElementById("table")
	table.innerHTML = "";
	
	var header = document.createElement('thead');
	var row = header.insertRow(0);
	var c1 = row.insertCell(0);
	var c2 = row.insertCell(1);
	var c3 = row.insertCell(2);
	
	c1.innerHTML = '<b>Username</b>';
	c2.innerHTML = "<b>Score</b>";			
	c3.innerHTML = "<b>Time</b>";
	table.appendChild(header);
	var body = document.createElement('tbody');
	if(localStorage.scoreboard) {		
		JSON.parse(localStorage.getItem("scoreboard")).forEach(s => {	
			if(s[0].includes(query)){		
				var row = body.insertRow(-1);
				if(s[1] < 0) {
					row.style.backgroundColor = "rgb(120, 71, 122)";
				}
				c1 = row.insertCell(0);
				c2 = row.insertCell(1);
				c3 = row.insertCell(2);
				c1.innerHTML = s[0];
				c2.innerHTML = s[1];			
				c3.innerHTML = s[2];
				row.addEventListener("dblclick", deleteRow);
			}
		});	
		table.appendChild(body);
	}	
}

function deleteRow() {
    sb = JSON.parse(localStorage["scoreboard"]);
	var deleted = event.target.parentNode.innerHTML.replace(/<td>/g, "").split("</td>");	
	for(var i = 0; i < sb.length; i++) {
		if(sb[i][0] == deleted[0] && sb[i][1] == parseInt(deleted[1])) {
			sb.splice(i, 1);
		}
	}
	localStorage["scoreboard"] = JSON.stringify(sb);
	drawScoreboard();
}

function reset() {
	player.x = canvas.width/2;
	player.y = canvas.height - 140;
	player.shootingInterval = 50;
	spawnRate = 50;
	lives = 3;
	score = 0;
	bullets = [];
	enemies = [];
	keyboard = [];
	drawScoreboard("");
	draw();
}

function spawnEnemy(){
	spawn += 1;
	if(spawn > spawnRate) {
		enemies.push(new Enemy("resources/rocket.png"));
		spawn = 0;
	}
}


function drawScore(){
	ctx.shadowColor = "rgb(228, 229, 255)"; // string https://stackoverflow.com/questions/7814398/a-glow-effect-on-html5-canvas
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0; 
	ctx.shadowBlur = 20;
	ctx.fillStyle = "rgb(228, 229, 255)";
	ctx.fillText("Score: " + score, 15, 30);
	ctx.fillText("Lives: " + lives, 15, 55);
	ctx.shadowBlur = 0;
}

function init() {
	getInputValue();
	document.addEventListener('keydown', playerInput);
	document.addEventListener('keyup', playerInput);
	initElements(); 
	initBackground();
	player = new Player(canvas.width/2, canvas.height-140, "resources/ship.png", 50, 2);
	bg = new Image();
	bg.src = "resources/bg.png";
	planet = new Image();
	planet.src = "resources/planet.png";
	line = new Image();
	line.src = "resources/line.png";	
	ctx.font = "20px Arial";
	drawScoreboard("");
	let el = document.getElementById('left_button');
	el.ontouchstart = left_down;
	el.ontouchend = left_up;
	el = document.getElementById('right_button');
	el.ontouchstart = right_down;
	el.ontouchend = right_up;
	el = document.getElementById('shoot_button');
	el.ontouchstart = shoot_down;
	el.ontouchend = shoot_up;
	draw();
}



function detectCollision(){
	if(enemies.length == 0)
		return;
	else
	for(var i = 0; i < enemies.length; i++){
		if((Math.floor(enemies[i].x) < Math.floor(player.x)+20) && (Math.floor(enemies[i].x) > Math.floor(player.x)-20) && (Math.floor(enemies[i].y) < Math.floor(player.y)+20) && (Math.floor(enemies[i].y) > Math.floor(player.y)-20)){
			enemies.splice(i, 1);
			lives--;
			return;
		}	
	}

	if(enemies.length == 0 || bullets.length == 0)
		return;
	else
	for(var i = 0; i < enemies.length; i++){
		for(var j = 0; j < bullets.length; j++){
			if(Math.floor((Math.floor(bullets[j].x) < Math.floor(enemies[i].x) + 7) && (Math.floor(bullets[j].x) > Math.floor(enemies[i].x)-7))){
				if(Math.floor((Math.floor(bullets[j].y) < Math.floor(enemies[i].y) + 7) && (Math.floor(bullets[j].y) > Math.floor(enemies[i].y)-7))){
					enemies.splice(i, 1);
					bullets.splice(j, 1);
					score += 10;
					return;
				}
			}
		}
	}
	
}

function getInputValue() {
    left = document.getElementById("left").value;
    right = document.getElementById("right").value;
	shoot = document.getElementById("shoot").value;
	up = document.getElementById("up").value;
	down = document.getElementById("down").value;
}

window.addEventListener('keydown', function(e) { //https://stackoverflow.com/questions/22559830/html-prevent-space-bar-from-scrolling-page
	if(e.keyCode == 32 && e.target == document.body) {
	  e.preventDefault();
	}
  });
