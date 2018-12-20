// Magic for p5 importing properly in TypeScript AND Webpack
import 'p5';
import Particle from './Particle';
import Nutrient from './Nutrient';
import Population from './Population';
const p5 = require("p5");

export const engine: p5 = new p5(() => { });

const widht = 1200;
const height = 800;
const r = 6;
let nutrients: Nutrient[] = [];

const population = new Population(100)

engine.setup = () => {
  engine.createCanvas(widht, height);
  initNutrients();
}

engine.draw = () => {
  engine.background(50);
  engine.noStroke();


  if (population.aliveIndividual().length > 0) {
    population.aliveIndividual().forEach(p => {
      p.seek(nutrients);
      p.decreaseHealth();
      drawParticle(p);
    })
    nutrients = nutrients.filter(n => !n.isEaten());
  } else {
    population.print();
    initNutrients();
    population.nextGeneration(0.1);
  }
  drawNutrients();
}

const initNutrients = () => {
  nutrients.splice(0)
  for (let i = 0; i < 300; i++) {
    nutrients.push(new Nutrient(engine.random(widht), engine.random(height), 0.3));
    nutrients.push(new Nutrient(engine.random(widht), engine.random(height), -0.5));
  }
}



const drawParticle = (particle: Particle) => {
  const theta = particle.velocity.heading() + engine.PI / 2;
  const color = engine.lerpColor(engine.color(255, 0, 0), engine.color(0, 255, 0), particle.getHealth())

  engine.fill(color);
  engine.stroke(color);
  engine.strokeWeight(1);
  engine.push();
  engine.translate(particle.position.x, particle.position.y);
  engine.rotate(theta);
  engine.beginShape();
  engine.vertex(0, -r * 2);
  engine.vertex(-r, r * 2);
  engine.vertex(r, r * 2);
  engine.endShape(engine.CLOSE);
  engine.pop();

  engine.noFill();
  if (debug) {
    engine.ellipse(particle.position.x, particle.position.y, particle.dna.visibility * 2);
  }
}

const drawNutrients = () => {
  const luck = engine.random()

  if (luck < 0.2 && nutrients.filter(n => n.isHarmful()).length < 200) {
    nutrients.push(new Nutrient(engine.random(widht), engine.random(height), -0.6));
  } else if (luck > 0.7 && nutrients.filter(n => !n.isHarmful()).length < 200) {
    nutrients.push(new Nutrient(engine.random(widht), engine.random(height), 0.3));
  }

  engine.noStroke();
  for (let nutrient of nutrients) {
    if (nutrient.isHarmful()) {
      engine.fill(255, 0, 0);
    } else {
      engine.fill(0, 255, 0);
    }
    engine.ellipse(nutrient.position.x, nutrient.position.y, 8, 8);
  }
}

const debug = false;