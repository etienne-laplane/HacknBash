const TOTAL = 200;
let birds = [];
let slider;
let neat;
var toshow=0;

let config = {
	model: [
		{nodeCount:12, type: "input"},
		{nodeCount: 4, type: "output", activationfunc: activation.RELU}
	],
	mutationRate: 0.1,
	crossoverMethod: crossover.RANDOM,
	mutationMethod: mutate.RANDOM,
	populationSize: TOTAL
};

function setup() {
  createCanvas(250, 145);
  slider = createSlider(1, 100, 1);
  for (let i = 0; i < TOTAL; i++) {
    birds[i] = new Bird();
  }
  neat = new NEAT(config);
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {


    for (let bird of birds) {
      if (!bird.dead) bird.update();
    }

    for (let i = 0; i < TOTAL; i++) {
      neat.setInputs(birds[i].inputss(), i);
    }

    neat.feedForward();

	let desicions = neat.getDesicions();
    for (let i = 0; i < TOTAL; i++) {
      if (desicions[i] ==0) {
        birds[i].up();
      }
	     else   if (desicions[i]  ==1) {
        birds[i].down();
      }	     else   if (desicions[i] ==2) {
        birds[i].left();
      }	     else {
        birds[i].right();
      }
    }

    let finish = true;
    for (let z = 0; z < birds.length; z++) {
      if (!birds[z].dead) {
		  toshow=z;
        finish = false;
        break;
      }
    }
	bestscore=-100000000;
    if (finish) {
      for (let i = 0; i < TOTAL; i++) {
        neat.setFitness(birds[i].score, i);
		if(birds[i].score>bestscore){
			bestscore=birds[i].score;
		}
        birds[i] = new Bird();
      }
	  
      neat.doGen();
    }
  }

  // All the drawing stuff
  background(0);
birds[toshow].show(0);

}