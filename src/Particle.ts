import { engine } from "./Sketch";
const p5 = require("p5");

const MAX_SPEED = 5;
const MAX_FORCE = 2;

export default class Particle {
    readonly acceleration: p5.Vector;
    readonly velocity: p5.Vector;
    readonly position: p5.Vector;

    constructor(x: number, y: number) {
        this.acceleration = engine.createVector(0, 0);
        this.velocity = engine.createVector(0, -2);
        this.position = engine.createVector(x, y);
    }

    seek(target: p5.Vector) {
        const desired = p5.Vector.sub(target, this.position);
        desired.setMag(MAX_SPEED);

        const steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(MAX_FORCE);

        this.acceleration.add(steer);
        this.velocity.add(this.acceleration);
        this.velocity.limit(MAX_SPEED);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

}