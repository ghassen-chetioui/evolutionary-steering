import { engine } from "./Sketch";
import Nutrient from "./Nutrient";
import DNA from "./DNA";
const p5 = require("p5");

const MAX_SPEED = 5;
const MAX_FORCE = 0.5;

export default class Particle {

    readonly acceleration: p5.Vector;
    readonly velocity: p5.Vector;
    readonly position: p5.Vector;
    readonly dna: DNA;
    private health = 1;
    private age = 0;

    constructor(x: number, y: number, dna: DNA) {
        this.acceleration = engine.createVector(0.1, 0.1);
        this.velocity = engine.createVector(0, -2);
        this.position = engine.createVector(x, y);
        this.dna = dna;
    }

    seek(nutrients: Nutrient[]) {
        const nutrient = nutrients.filter(n => this.position.dist(n.position) <= this.dna.visibility)
            .reduce((previous, current) => {
                if (previous)
                    return this.position.dist(previous.position) <= this.position.dist(current.position) ? previous : current;
                else return current
            }, undefined);
        if (nutrient) {
            const dist = nutrient.position.dist(this.position);
            const attraction = nutrient.isHarmful() ? this.dna.poisonAttraction : this.dna.foodAttraction;
            const position = nutrient.isHarmful()
                ? nutrient.position.copy().add(engine.random(-100, 100), engine.random(-100, 100))
                //engine.createVector(nutrient.position.x + engine.random(-100, 100), nutrient.position.y + engine.random(-100, 100))
                : nutrient.position
                
            const desired = p5.Vector.sub(position /*nutrient.position*/, this.position).mult(attraction).mult(10000 / dist);

            desired.setMag(MAX_SPEED);
            const steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(MAX_FORCE);

            this.applyForce(steer);
            nutrients.forEach(nutrient => {
                if (this.position.dist(nutrient.position) < 5) {
                    this.health += nutrient.nutritionalValue;
                    nutrient.wasEaten();
                }
            })
            this.acceleration.mult(0);
        } else {
            this.keepGoing();
        }
        this.age++;

    }

    private applyForce(steer: p5.Vector) {
        this.acceleration.add(steer);
        this.velocity.add(this.acceleration);
        this.velocity.limit(MAX_SPEED);
        this.position.add(this.velocity);
    }

    decreaseHealth() { this.health -= 0.006; }

    isAlive() { return this.health > 0; }

    getHealth() { return this.health }

    getAge() { return this.age }

    keepGoing() {
        this.position.add(this.velocity);

        let desired = null;

        if (this.position.x < 25) {
            desired = new p5.Vector(MAX_SPEED, this.velocity.y);
        }
        else if (this.position.x > 1200 - 25) {
            desired = new p5.Vector(-MAX_SPEED, this.velocity.y);
        }

        if (this.position.y < 25) {
            desired = new p5.Vector(this.velocity.x, MAX_SPEED);
        }
        else if (this.position.y > 800 - 25) {
            desired = new p5.Vector(this.velocity.x, -MAX_SPEED);
        }

        if (desired != null) {
            desired.normalize();
            desired.mult(MAX_SPEED);
            const steer = desired.sub(this.velocity);
            steer.limit(MAX_FORCE);
            this.applyForce(steer);
        }
    }

}