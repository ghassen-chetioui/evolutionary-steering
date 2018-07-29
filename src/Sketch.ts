// Magic for p5 importing properly in TypeScript AND Webpack
import 'p5';
import Particle from './Particle';
import Nutrient from './Nutrient';
const p5 = require("p5");



export const engine = new p5(() => { });
const particle = new Particle(300, 300);
const r = 6;
const nutrients: Nutrient[] = [];

engine.setup = () => {
  engine.createCanvas(600, 600);
  for (let i = 0; i < 10; i++) {
    nutrients.push(new Nutrient(engine.random(600), engine.random(600), 1));
    nutrients.push(new Nutrient(engine.random(600), engine.random(600), -5));
  }
}

engine.draw = () => {
  engine.background(50);
  engine.noStroke();

  const mouse = engine.createVector(engine.mouseX, engine.mouseY);

  engine.fill(127);
  engine.stroke(200);
  engine.strokeWeight(2);
  engine.ellipse(mouse.x, mouse.y, 48, 48);

  particle.seek(mouse);
  
  drawNutrients();
  drawParticle(particle);
  
  engine.text("Ceci est un text", 600, 650);
}

const drawParticle = (particle: Particle) => {
  var theta = particle.velocity.heading() + engine.PI / 2;
  engine.fill(127);
  engine.stroke(200);
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
}

const drawNutrients = () => {
  engine.noStroke();
  for (let nutrient of nutrients) {
    if (nutrient.isPoison()) {
      engine.fill(255, 0, 0);
    } else {
      engine.fill(0, 255, 0);
    }
    engine.ellipse(nutrient.position.x, nutrient.position.y, 8, 8);
  }
}