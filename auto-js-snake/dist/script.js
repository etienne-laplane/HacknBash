/*globals document, window, setInterval*/
var TILE,
	BOARD,
	SNAKE,
	FOOD;

var i=0;
var possible=false;
TILE = function (k, x, y) {
	this.kind = k;
	this.x = x;
	this.y = y;
};
TILE.FOOD = -1;
TILE.NONE = 0;
TILE.SNAKE = 1;
TILE.WALL = 2;
TILE.SIZE = 20;

var brain= [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

var score=0;
var bestscore=-100000000000000;
var best_brain=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

var cur_gen_brain=[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
var mutant=0;
var limit_mutant=20;
var gen=0;

function mutate(brai){
	var toreturn = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
	for(var p=0;p<11;p++){
		for(var m=0;m<25;m++){
			if(Math.random()<0.5){
			if(brai[p][m]!=0||p>1&&brai[p-1][m]!=0||m>1&&brai[p][m-1]!=0||p<10&&brai[p+1][m]!=0||m<24&&brai[p][m+1]!=0)
				if(Math.random()<0.5){
					toreturn[p][m]=brai[p][m]-0.1;
				} else 	{
					toreturn[p][m]=brai[p][m]+0.1;
				}
			} else if (Math.random()<0.1){
				toreturn[p][m]=brai[p][m]-Math.random()/10;
			}else if(brain[p][m]!=0){
				toreturn[p][m]=brai[p][m];
			}
		}
		
	}
	return toreturn;
}
	

		 
TILE.prototype.clone = function () {
	return new TILE(this.kind, this.x, this.y);
};
TILE.prototype.setKind = function (k) {
	this.kind = k;
};
TILE.prototype.draw = function (ctx) {
	switch (this.kind) {

		case TILE.FOOD:
			ctx.fillStyle = "#008000";
			ctx.fillRect(this.x * TILE.SIZE, this.y * TILE.SIZE, TILE.SIZE, TILE.SIZE);
			break;
		case TILE.NONE:
			ctx.fillStyle = "#000";
			ctx.fillRect(this.x * TILE.SIZE, this.y * TILE.SIZE, TILE.SIZE, TILE.SIZE);
			ctx.fillStyle = "#fff";
			ctx.fillRect(this.x * TILE.SIZE + 1, this.y * TILE.SIZE + 1, TILE.SIZE - 2, TILE.SIZE - 2);
			break;
		case TILE.SNAKE:
			ctx.fillStyle = "#000";
			ctx.fillRect(this.x * TILE.SIZE, this.y * TILE.SIZE, TILE.SIZE, TILE.SIZE);
			ctx.fillStyle = "#fff";
			ctx.fillRect(this.x * TILE.SIZE + 1, this.y * TILE.SIZE + 1, TILE.SIZE - 2, TILE.SIZE - 2);
			break;
		case TILE.WALL:
			ctx.fillStyle = "#FF8C00";
			ctx.fillRect(this.x * TILE.SIZE, this.y * TILE.SIZE, TILE.SIZE, TILE.SIZE);
			break;
		case TILE.FLOWER:
			ctx.fillStyle = "#FFD700";
			ctx.fillRect(this.x * TILE.SIZE, this.y * TILE.SIZE, TILE.SIZE, TILE.SIZE);
			break;
	}
		ctx.font = "8px Georgia";
		ctx.fillStyle = "#000";
		ctx.fillText(Math.trunc(100*brain[this.y][this.x]),this.x * TILE.SIZE+5, this.y * TILE.SIZE+15);
};

FOOD = function (x, y) {
	this.x = x;
	this.y = y;
};
FOOD.prototype.clone = function () {
	return new FOOD(this.x, this.y);
};
FOOD.prototype.randFood = function (b) {
	var empty = [];
	for (var x = 0; x < b.mx; x++) {
		for (var y = 0; y < b.my; y++) {
			if (b.get(x, y).kind == TILE.NONE) {
				empty.push({
					x: x,
					y: y
				});
			}
		}
	}
	var xy = empty[Math.floor(empty.length * Math.random())];
	this.x = xy.x;
	this.y = xy.y;
	b.get(this.x, this.y).setKind(TILE.FOOD);
};

FOOD.prototype.petFood = function (b) {
	b.get(this.x, this.y).setKind(TILE.FOOD);
};
FOOD.prototype.petFlower = function (b) {
	b.get(this.x, this.y).setKind(TILE.FLOWER);
};
FOOD.prototype.petRien = function (b) {
	b.get(this.x, this.y).setKind(TILE.NONE);
};
SNAKE = function (d, x, y) {
	this.direction = d;
	this.queue = [];
	this.push(x, y);
};
SNAKE.PAUSE = -1;
SNAKE.LEFT = 0;
SNAKE.UP = 1;
SNAKE.RIGHT = 2;
SNAKE.DOWN = 3;
SNAKE.updatetime = 6;
SNAKE.prototype.clone = function () {
	var s = new SNAKE(this.direction);
	s.queue = this.queue.slice();
	return s;
};
SNAKE.prototype.pop = function () {
	return this.queue.pop();
};
SNAKE.prototype.tail = function () {
	return this.queue[this.queue.length - 1];
};
SNAKE.prototype.head = function () {
	return this.queue[0];
};
SNAKE.prototype.push = function (x, y) {
	this.queue.unshift({
		x: x,
		y: y
	});
};
SNAKE.prototype.distTo = function (x, y) {
	if (y === undefined) {
		y = x.y;
		x = x.x;
	}

	var head = this.head();
	for(var n=0;n<Math.abs(head.y - y);n++){
		for (var m=0;m<Math.abs(head.x - x);m++){
			
		}
	}
	return Math.abs(head.x - x) + Math.abs(head.y - y);
	
};
SNAKE.prototype.distFrom = function (x, y) {
	if (y === undefined) {
		y = x.y;
		x = x.x;
	}

	var tail = this.tail();
	return Math.abs(tail.x - x) + Math.abs(tail.y - y);
};

function cycle(){
	console.log(bestscore+" - CURRENT - "+score);
		score=0;
	mutant++;
	if(mutant==limit_mutant){
		mutant=0;
		gen++;
		cur_gen_brain=best_brain;
	}
	brain=cur_gen_brain;
	brain=mutate(brain);
	console.log(brain[1][1]);
}
BOARD = function (mx, my) {
	possible=false;
	this.allfood=[];
	this.mx = 25;
	this.my = 11;
	this.matrix = [];
	for (var x = 0; x < this.mx; x++) {
		this.matrix.push([]);
		for (var y = 0; y < this.my; y++) {
			this.matrix[x].push(new TILE(TILE.NONE, x, y));
		}
	}
	var LD;
	var LD1= [
	     [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],
		 [0,0,0,0,0,0,1,0,1,1,1,0,0,0,1,1,1,0,1,0,0,0,0,0,0],
		 [0,0,0,0,0,0,1,0,1,1,1,0,0,0,1,1,1,0,1,0,0,0,0,0,0],
		 [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
		 [0,2,2,2,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,2,2,2,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,2,2,2,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0],
		 [0,0,0,0,0,0,1,0,1,1,1,0,0,0,1,1,1,0,1,0,0,0,0,0,0],
		 [0,0,0,0,0,0,1,0,1,1,1,0,0,0,1,1,1,0,1,0,0,0,0,0,0],
		 [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0]];
		var LD2= [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
		
			if (gen<10){
				LD=LD1;
			}
			else{ LD=LD1;}
	for(var i=0;i<25;i++){
		for(var j=0;j<11;j++){
			var foods = new FOOD(i,j);
			if(LD[j][i]==0){
				foods.petFood(this);
			}
			else if (LD[j][i]==1){
				foods.petFlower(this);
			}else if (LD[j][i]==2){
				foods.petRien(this);
			}
			this.allfood.push(foods);
		}
	}

	this.food = this.allfood[i];
	this.set(TILE.SNAKE, 3,5);
	this.snake = new SNAKE(SNAKE.PAUSE, 3, 5);
	this.score = 0;
};
BOARD.prototype.clone = function () {
	possible=true;
	var b = new BOARD();
	b.mx = this.mx;
	b.my = this.my;
	b.allfood=this.allfood;
	b.matrix = [];
	for (var x = 0; x < b.mx; x++) {
		b.matrix.push([]);
		for (var y = 0; y < b.my; y++) {
			b.matrix[x].push(this.matrix[x][y].clone());
		}
	}
	b.snake = this.snake.clone();
	try {
	b.food = closest_food(this);
	} catch(err){
		b = new BOARD(23,10);
	}
	b.score = this.score;
	return b;
};

function count_food(b){
	toreturn=0;
	for (var x = 0; x < b.mx; x++) {
		for (var y = 0; y < b.my; y++) {
			if(b.matrix[x][y].kind==TILE.FOOD)toreturn++;
		}
	}
	return toreturn==0;
}

function closest_food(b){
	var p=0;//tiebreaker
	var fit=-100000;
	toreturn = b.allfood[p];
	for (var x = 0; x < b.mx; x++) {
		for (var y = 0; y < b.my; y++) {
			if(b.matrix[x][y].kind==TILE.FOOD){
				if(brain[y][x]>fit){
					fit=brain[y][x];
					toreturn=b.matrix[x][y];
					
				}
			}
		}
	}
	return toreturn;
}

function newfood(b,food,l){
	if (b.get(b.food.x, b.food.y).kind===TILE.FOOD){
		return b.food;
	} else {newfood(b,b.allfood[l++],l++);}
}
BOARD.prototype.set = function (val, x, y) {
	this.matrix[x][y].setKind(val);
};
BOARD.prototype.get = function (x, y) {
	return this.matrix[x][y];
};
BOARD.prototype.updatesnake = function () {
	if (this.snake.direction !== SNAKE.PAUSE||true) {
		var head = this.snake.head(),
			nx = head.x,
			ny = head.y;
		switch (this.snake.direction) {
			case SNAKE.LEFT:
				nx--;
				if (nx < 0) {
					this.snake.direction = SNAKE.PAUSE;
					return;
				}
				break;
			case SNAKE.UP:
				ny--;
				if (ny < 0) {
					this.snake.direction = SNAKE.PAUSE;
					return;
				}
				break;
			case SNAKE.RIGHT:
				nx++;
				if (nx >= this.mx) {
					this.snake.direction = SNAKE.PAUSE;
					return;
				}
				break;
			case SNAKE.DOWN:
				ny++;
				if (ny >= this.my) {
					this.snake.direction = SNAKE.PAUSE;
					return;
				}
				break;
		}

		var tail, kind = this.get(nx, ny).kind;
		if (kind === TILE.FOOD) {
			this.score += 1;
			i++;
			//remove_from_allfoods(this,nx,ny);	
			//this.food.randFood(this);
			//tail = this.snake.pop();
			if(this.snake.queue.length>0){
				tail = this.snake.pop();
				this.set(TILE.NONE, tail.x, tail.y);
			}
			score+=10;
		} else if (kind===TILE.SNAKE){
			this.snake.direction = SNAKE.PAUSE;
			return;
		
		} else if (kind===TILE.FLOWER){
			score-=14;
		}
		else {
			 if(this.snake.queue.length>0){
				tail = this.snake.pop();
				this.set(TILE.NONE, tail.x, tail.y);
			}
			score--;
		}
		this.set(TILE.SNAKE, nx, ny);
		this.snake.push(nx, ny);
	}
};

function remove_from_allfoods(b,i,j){
	var index=b.allfood.findIndex(function(element){
		return element.x==i;
	});
	b.allfood.splice(index,1);
}

BOARD.prototype.draw = function (ctx) {
	this.get(this.snake.head().x, this.snake.head().y).setKind(TILE.WALL);
	for (var x = 0; x < this.mx; x++) {
		for (var y = 0; y < this.my; y++) {
			this.matrix[x][y].draw(ctx);
		}
	}
	this.get(this.snake.head().x, this.snake.head().y).setKind(TILE.SNAKE);
};

BOARD.prototype.sameas = function (b) {
	if (b.food.x !== this.food.x || b.food.y !== this.food.y) return false;
	if (b.snake.queue.length !== this.snake.queue.length) return false;
	for (var i = 0; i < b.snake.queue.length; i++) {
		if (b.snake.queue[i].x !== this.snake.queue[i].x) return false;
		if (b.snake.queue[i].y !== this.snake.queue[i].y) return false;
	}
	return true;
};
BOARD.prototype.dtfood = function () {
	return this.snake.distTo(this.food);
};
BOARD.prototype.dttail = function () {
	return this.snake.distTo(this.snake.tail());
};

BOARD.prototype.space = function (st) { // To head
	var grid = [];
	for (var x = 0; x < this.mx; x++) {
		grid.push([]);
		for (var y = 0; y < this.my; y++) {
			grid[x].push({
				x: x,
				y: y,
				g: 0,
				h: 0,
			});
		}
	}
	var start = grid[st.x][st.y];

	var cols = [0, 1, 0, -1],
		rows = [-1, 0, 1, 0];
	// Not the same as the original directions but shh

	var openlist = [start];
	var closedlist = [];
	var currentNode;

	var match = function (neighb) { // not any match
			return neighb.x === neighbor.x && neighb.y === neighbor.y;
		},
		nullifier = function (i) {
			var line = me.matrix[currentNode.x + cols[i]];
			if (line === undefined) return false;
			var t = line[currentNode.y + rows[i]];
			if (t === undefined) return false;
			return t.kind <= 0;
		},
		nodefill = function (i) {
			return grid[currentNode.x + cols[i]][currentNode.y + rows[i]];
		};

	while (openlist.length > 0) {
		var l = 0;
		for (var i = 0; i < openlist.length; i++) {
			if (openlist[i].g+openlist[i].h < openlist[l].g+openlist[l].h) { // lowest estimated left
				l = i;
			}
		}
		currentNode = openlist.splice(l, 1)[0];

		currentNode.h = currentNode.h || this.snake.distTo(currentNode);
		if (currentNode.h < 2) { // DONE?
			if (st === this.food) {
				if (this.space(this.snake.tail())) return currentNode;
			} else if (st === this.snake.tail()) {
				if (currentNode.g > 0) return currentNode;
			} else 
				return currentNode;
		}
		var me = this;
		closedlist.push(currentNode);
		var neighbors = [0, 1, 2, 3].filter(nullifier).map(nodefill);

		for (i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];
			if (closedlist.some(match)) continue;

			var g = currentNode.g + 1;
			var gb = false;

			if (!openlist.some(match)) { // First time seeing the node
				gb = true;
				neighbor.h = this.snake.distTo(neighbor);
				openlist.push(neighbor);
			} else if (g < neighbor.g) {
				// Visited and now it's better
				gb = true;
			}

			if (gb)
				neighbor.g = g;
		}
	}
	
	return false;
};
BOARD.prototype.foodmagic = function() {
	var queue = new BinaryHeap(this.score);
	var a=new Date();
	
	var s = new STATE(this);
	s.moves = s.coolmoves();
	for (var j = 0; j < s.moves.length; j++) {
		var i = s.moves[j];
		if (s.clones[i].space(s.clones[i].snake.tail()))
			queue.push(s.clones[i], 0, i, j+1);
	}
	
	while (queue.content.length > 0) {
		var deep = queue.pop();
		if (deep.h === 0) return deep.head;
		if (new Date() - a > 10) return false;
		
		deep.state.moves = deep.state.coolmoves();
		for (var j = 0; j < deep.state.moves.length; j++) {
			var i = deep.state.moves[j];
			if (deep.state.clones[i].space(deep.state.clones[i].snake.tail()))
				queue.push(deep.state.clones[i], deep.g, deep.head,j+1);
		}
	}
	return false;
}

function BinaryHeap(score){
  this.content = [];
  this.scoreFunction = function(elem){
	  return elem.g+elem.h;
  };
  this.score = score;
}

BinaryHeap.prototype = {
  push: function(element,g,head,i) {
    // Add the new element to the end of the array.
    this.content.push({state:new STATE(element), g:g+1, h:(element.score > this.score)?0:element.dtfood()*i, head:head});
    // Allow it to bubble up.
    this.bubbleUp(this.content.length - 1);
  },

  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.splice(this.content.length-1,1)[0];
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },

  bubbleUp: function(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n], score = this.scoreFunction(element);
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      var parentN = Math.floor((n + 1) / 2) - 1,
      parent = this.content[parentN];
      // If the parent has a lesser score, things are in order and we
      // are done.
      if (score >= this.scoreFunction(parent))
        break;

      // Otherwise, swap the parent with the current element and
      // continue.
      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  },

  sinkDown: function(n) {
    // Look up the target element and its score.
    var length = this.content.length,
    element = this.content[n],
    elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
        child1Score = this.scoreFunction(child1);
        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
        child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }

      // No need to swap further, we are done.
      if (swap == null) break;

      // Otherwise, swap and continue.
      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }
};

var canvas, ctx, state = {},
	frames, init, loop, mainboard;

window.onresize = function () {
	frames = 0;
	canvas.height = document.body.clientHeight;
	canvas.width = document.body.clientWidth;
	mainboard = new BOARD((24) - 1, Math.floor(11) - 1);
};

init = function () {
	possible=false;
	canvas = document.createElement("canvas");
		frames = 0;
	canvas.height = 800;
	canvas.width = 800;
	mainboard = new BOARD((24) - 1, Math.floor(11) - 1);
	ctx = canvas.getContext("2d");
	document.body.appendChild(canvas);
	document.addEventListener("keyup", function (evt) {
		state[evt.keyCode] = true;
	});
	loop();
    
};
paused=false;
done=false;
var phys=0;
loop = function () {
	"coucou";
	frames++;
	phys++;
	if (state[37 + SNAKE.LEFT]) {
		state[37 + SNAKE.LEFT] = false;
		mainboard.snake.direction = SNAKE.LEFT;
	}
	if (state[37 + SNAKE.UP]) {
		state[37 + SNAKE.UP] = false;
		mainboard.snake.direction = SNAKE.UP;
	}
	if (state[37 + SNAKE.RIGHT]) {
		state[37 + SNAKE.RIGHT] = false;
		mainboard.snake.direction = SNAKE.RIGHT;
	}
	if (state[37 + SNAKE.DOWN]) {
		state[37 + SNAKE.DOWN] = false;
		mainboard.snake.direction = SNAKE.DOWN;
	}

	if (frames % SNAKE.updatetime === 0) {
		mainboard.updatesnake();
		frames = 0;
	}
	if(count_food(mainboard)){
		//console.log(score);
		//console.log(bestscore);
		//console.log(gen);
		//console.log(mutant);
		if(score>bestscore){
			
			best_brain=brain;
			bestscore=score;
		}
		cycle();
		mainboard = new BOARD((24) - 1, Math.floor(11) - 1);
		
	}
	mainboard.draw(ctx);
	window.requestAnimationFrame(loop, canvas);
	possible=true;
	
};

window.onload = init;

var STATE, AI;
/*
	state, move - copy board from state and make move
	state - state is actually just a board
*/
STATE = function (board) {
	this.board = board.clone();
	
	var me = this;
	this.clones = [0, 1, 2, 3].map(function (i) {
		var b = me.board.clone();
		b.snake.direction = i;
		b.updatesnake();
		return b;
	});
	this.moves = [0, 1, 2, 3].filter(function (i) {
		// no illegal moves.
		return me.clones[i].snake.direction !== SNAKE.PAUSE;
	});
};
STATE.prototype.coolmoves = function() {
	var me = this;

	var aim = me.board.space(me.board.food);
	var states = [0,1,2,3].map(function(i){
		return new STATE(me.clones[i])
	});
	var moves = [0,1,2,3].map(function(i){
		return states[i].moves.length;
	});
	var mindtfood = [0,1,2,3].map(function(i){
		var mm = states[i].clones[0].dtfood();
		for (var j=1;j<states[i].clones.length;j++) {
			var m = states[i].clones[j].dtfood();
			if (m < mm) mm = m;
		}
		return mm;
	});
	var maxdttail = [0,1,2,3].map(function(i){
		var mm = states[i].clones[0].dttail();
		for (var j=1;j<states[i].clones.length;j++) {
			var m = states[i].clones[j].dttail();
			if (m > mm) mm = m;
		}
		return mm;
	});
	var tailg = [0,1,2,3].map(function(i){
		return me.clones[i].space(me.clones[i].snake.tail()).g;
	});
	var oldmove = me.board.snake.direction;

	var ret = me.moves.filter(function(i){ // correct tail moves
		return !!tailg[i];
	}).sort(function(a,b){ // move old to first pos & random
		if (Math.random()>.9) return Math.random()-.5;
		if (oldmove === a) return -1;
		if (oldmove === b) return 1;
		return Math.random()-.5;
	}).sort(function(a,b){ // amount of moves
		return moves[a] - moves[b];
	}).sort(function(a,b){
	return -brain[me.clones[a].snake.head().y][me.clones[a].snake.head().x]+brain[me.clones[b].snake.head().y][me.clones[b].snake.head().x];
	}).sort(function(a,b){ // Shortest path to food
		return Math.abs(me.clones[a].snake.head().x-aim.x) + Math.abs(me.clones[a].snake.head().y-aim.y)
			 - Math.abs(me.clones[b].snake.head().x-aim.x) - Math.abs(me.clones[b].snake.head().y-aim.y)
	});
	
	return ret.sort(function (a, b) { // highest of scores
		return -me.clones[a].score + me.clones[b].score
	});
}

AI = function () {
 	var s = new STATE(mainboard.clone());
	
	if (s.moves.length === 1) {
		mainboard.snake.direction = s.moves[0];
	} else if (s.moves.length > 1) {
		var aim = false;//mainboard.foodmagic();

		if (false) {
			mainboard.snake.direction = aim;
		} else {
			mainboard.snake.direction = s.coolmoves()[0];
		}
	}
};


setInterval(AI, 100);