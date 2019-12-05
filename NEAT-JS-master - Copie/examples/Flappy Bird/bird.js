class Bird {
  constructor() {
    this.y = 5;
	this.oldy=0;
    this.x = 3;
	this.oldx=0;
	this.dead = false;
    this.score = 0;
	this.fuel=84;
	this.fuelx=0;
	this.fuely=0;
	this.size=10;
	this.nextfuelx=2;
	this.nextfuely=5;
	this.mov_since_fuel=0;
	this.spawn=true;
	this.willdie=0;
	//0=grass
	//1=nothing
	//2=flower
	//3=rock
	//4=fuel
	// this.garden=[[0,0,0,0,0,0,0,0,0,0,0],
				 // [0,2,2,0,1,1,1,0,2,2,0],
				 // [0,2,0,0,1,1,1,0,0,2,0],
				 // [0,2,0,0,1,1,1,0,0,2,0],
				 // [0,2,0,0,0,0,0,0,0,2,0],
				 // [0,2,2,2,0,0,0,2,2,2,0],
				 // [0,0,0,0,0,0,0,0,0,0,0],
				 // [0,2,2,2,2,0,2,2,2,2,0],
				 // [0,2,0,0,0,0,2,0,0,0,0],
				 // [0,2,0,0,0,0,2,0,0,0,0],
				 // [0,2,0,0,0,0,2,0,0,0,0],
				 // [0,2,2,2,2,0,2,2,2,2,0],
				 // [0,0,0,0,0,0,0,0,0,0,0],
				 // [0,2,2,2,2,0,2,2,2,2,0],
				 // [0,0,0,0,2,0,0,0,0,2,0],
				 // [0,0,0,0,2,0,0,0,0,2,0],
				 // [0,0,0,0,2,0,0,0,0,2,0],
				 // [0,2,2,2,2,0,2,2,2,2,0],
				 // [0,0,0,0,0,0,0,0,0,0,0],
				 // [0,2,2,2,0,0,0,2,2,2,0],
				 // [0,2,0,0,0,0,0,0,0,2,0],
				 // [0,2,0,0,0,0,0,0,0,2,0],
				 // [0,2,0,0,0,0,0,0,0,2,0],
				 // [0,2,2,0,0,0,0,0,2,2,0],
				 // [0,0,0,0,0,0,0,0,0,0,0]
				 // ];
				 	this.garden=[[1,1,1,1,1,1,1,1,1,1,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,1,1,1,0,0,0,1],
				 [1,0,0,0,1,1,1,0,0,0,1],
				 [1,0,0,0,1,1,1,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,0,0,0,0,0,0,0,0,0,1],
				 [1,1,1,1,1,1,1,1,1,1,1]
				 ];
  }

//todo
  show(i) {
	stroke(111);
				   fill('rgba(0,255,0, 0.25)');
	rect(0,115,this.fuel,5);
	textSize(16);
	text(this.score, 0,138);

	for(var i=0;i<25;i++){
		for(var j=0;j<11;j++){
			if(this.garden[i][j]==0){
				stroke(111);
				   fill('rgba(0,255,0, 0.25)');
					rect(i*this.size,j*this.size,this.size,this.size);
			}
			if(this.garden[i][j]==2){
				stroke(188);
				   fill(255, 204, 0);
					rect(i*this.size,j*this.size,this.size,this.size);
			}
						if(this.garden[i][j]==4){
				stroke(188);
				   fill('rgb(100%,0%,10%)');
					rect(i*this.size,j*this.size,this.size,this.size);
			}
			
		}
	}
	if (!this.dead) {
    stroke(255);
    fill(255, 100);
	rect(this.x*this.size,this.y*this.size,this.size,this.size);
	}
	
  }

  up() {
    if (!this.dead) {
		this.y -= 1;
		if(this.y<0){this.dead=true;this.y=0;}
	}

  }
   left() {
    if (!this.dead) {
		this.x -= 1;
		if(this.x<0){this.dead=true;this.x=0;}
	}

  }
  down() {
    if (!this.dead) {
		this.y += 1;
		if(this.y>10){this.dead=true;this.y=10;}
	}

  }
  right() {
    if (!this.dead) {
		this.x += 1;
		if(this.x>24){this.dead=true;this.x=24;}
	}

  }
  
  update_garden(){
	var tile=this.garden[this.x][this.y];
	  switch(tile){
		case 1:
		this.score--;
			break;
		case 0:
			this.score+=10;
			this.willdie=0;
			this.garden[this.x][this.y]=1;

			break;
		case 2:
			this.fuel-=1;
			this.garden[this.x][this.y]=1;
			break;
		case 3:			
			this.fuel-=27;
			break;
		case 4:
			if(this.willdie>10){
				this.dead=true;
			}
			this.score++;
			this.fuel=84;
			this.willdie++;
			this.spawn=true;
			this.garden[this.x][this.y]=1;
			break;
	  }
	  if (this.fuel<0){
		this.dead=true;
	  }
	  if(this.count_grass()==0){
		  if(this.score>2000)
			console.log("WINNER2000");else console.log("WINNER1000");
		  this.dead=true;
	  }
  }
  
  count_grass(){
	var toreturn=0;
	this.garden.forEach(function(row){
		row.forEach(function(tile){
			if(tile==0){
				toreturn++;
			}
		})
	});
	return toreturn;
  }
  
getW(){
	var toreturn=0;
	for(var i=0;i<this.x;i++){
			if(this.garden[i][this.y]==0){
				toreturn++;
		}
	}
	if(toreturn>1)
		toreturn=1;
	return toreturn;
  }
  getE(){
	var toreturn=0;
	for(var i=this.x;i<25;i++){
			if(this.garden[i][this.y]==0){
				toreturn++;
		}
	}
	if(toreturn>1)
		toreturn=1;
	return toreturn;
  }
 getN(){
	var toreturn=0;
	for(var i=0;i<this.y;i++){
			if(this.garden[this.x][i]==0){
				toreturn++;
		}
	}
	if(toreturn>1)
		toreturn=1;
	return toreturn;
  }
  getS(){
	var toreturn=0;
	for(var i=this.y;i<11;i++){
			if(this.garden[this.x][i]==0){
				toreturn++;
		}
	}
	if(toreturn>1)
		toreturn=1;
	return toreturn;
  }
  // getNW(){
	// var toreturn=0;
	// for(var i=0;i<this.x;i++){
		// for(var j=0;j<this.y;j++){
			// if(this.garden[i][j]==0){
				// toreturn++;
			// }
		// }
	// }
		// if(toreturn>30)
		// toreturn=1;
	// else toreturn=toreturn/50;
	// return toreturn;
  // }
     getNE(){
	var toreturn=0;
	for(var i=this.x;i<25;i++){
		for(var j=this.y;j<11;j++){
			if(this.garden[i][j]==0){
				toreturn++;
			}
		}
	}
	if(toreturn>30)
		toreturn=1;
	else toreturn=toreturn/50;
	return toreturn;
  }
     getSW(){
	var toreturn=0;
	for(var i=0;i<this.x;i++){
		for(var j=0;j<this.y;j++){
			if(this.garden[i][j]==0){
				toreturn++;
			}
		}
	}
		if(toreturn>30)
		toreturn=1;
	else toreturn=toreturn/50;
	return toreturn;
  }
     getSE(){
	var toreturn=0;
	for(var i=0;i<this.x;i++){
		for(var j=this.y;j<11;j++){
			if(this.garden[i][j]==0){
				toreturn++;
			}
		}
	}
		if(toreturn>30)
		toreturn=1;
	else toreturn=toreturn/50;
	return toreturn;
  }
  
    fup(){
	  if(this.y==0){
		  return 0;
	  }
	  if(this.garden[this.x][this.y-1]==2){
		  return 1;
	  }
	  else {
		  return 0;
	  }
  }
  
    fdown(){
	  if(this.y==10){
		  return 0;
	  }
	  if(this.garden[this.x][this.y+1]==2){
		  return 1;
	  }
	  else {
		  return 0;
	  }
  }
  
    fleft(){
	  if(this.x==0){
		  return 0;
	  }
	  if(this.garden[this.x-1][this.y]==2){
		  return 1;
	  }
	  else {
		  return 0;
	  }
  }
  
    fright(){
	  if(this.x==24){
		  return 0;
	  }
	  if(this.garden[this.x+1][this.y]==2){
		  return 1;
	  }
	  else {
		  return 0;
	  }
  }
  
  gup(){
	  if(this.y==0){
		  return 0;
	  }
	  if(this.garden[this.x][this.y-1]==0){
		  return 1;
	  }
	  else {
		  return 0;
	  }
  }
  
    gdown(){
	  if(this.y==10){
		  return 0;
	  }
	  if(this.garden[this.x][this.y+1]==0){
		  return 1;
	  }
	  else {
		  return 0;
	  }
  }
  
    gleft(){
	  if(this.x==0){
		  return 0;
	  }
	  if(this.garden[this.x-1][this.y]==0){
		  return 1;
	  }
	  else {
		  return 0;
	  }
  }
  
    gright(){
	  if(this.x==24){
		  return 0;
	  }
	  if(this.garden[this.x+1][this.y]==0){
		  return 1;
	  }
	  else {
		  return 0;
	  }
  }
  
  inputss() {
	  var fxu=0;
	  var fxd=0;
	  var fyu=0;
	  var fyd=0;
	  if(this.fuelx>this.x&&this.fuel<54)fxu=1-this.fuel/54;
		  if(this.fuely>this.y&&this.fuel<54)fyu=1-this.fuel/54;
			  if(this.fuelx<this.x&&this.fuel<54)fxd=1-this.fuel/54;
				  if(this.fuely<this.y&&this.fuel<54)fyd=1-this.fuel/54;
	  let inputs = [];
	  inputs.push(fxu);
	  inputs.push(fyu);
	  inputs.push(fxd);
	  inputs.push(fyd);
     inputs.push(this.getW());
      // herbe cadran NW
      inputs.push(this.getE());
      // bottom of closest pipe opening
      inputs.push(this.getS());
      // bird's y position
      inputs.push(this.getN());
      // bird's y velocity
      // inputs.push(this.gup());
	  // inputs.push(this.gdown());
	// inputs.push(this.gleft());
				        // inputs.push(this.gright());
						      inputs.push(this.fup());
	  inputs.push(this.fdown());
	inputs.push(this.fleft());
				        inputs.push(this.fright());
	// var fx=0;
	// if(this.fuel<54){
		// fx=1-Math.abs(this.fuelx-this.x)/24;
	// }
		// var fy=0;
	// if(this.fuel<54){
		// fy=1-Math.abs(this.fuely-this.y)/10;
	// }
	// inputs.push(fx);
	// inputs.push(fy);
	  //x
	  //y
	return inputs;
  }
  genfuel(){

	  var i=Math.trunc(Math.random()*24);
	var j=Math.trunc(Math.random()*10);
	if(this.garden[i][j]==1){

			  this.fuelx=this.nextfuelx;
	  this.fuely=this.nextfuely;
	  			  this.nextfuelx=i;
	this.nextfuely=j;
	  this.garden[this.fuelx][this.fuely]=4;
		return;
	} else {
		this.genfuel();
	}
  }
  update() {
	  this.update_garden();
	  this.fuel--;
	  if(this.fuel<56&&this.spawn){
		  	this.genfuel();
			this.spawn=false;
	  }

}
}


