import { engine } from "./Sketch";
const p5 = require("p5");

export default class Nutrient {

    readonly position: p5.Vector;
    private eaten = false;

    constructor(x: number, y: number, readonly nutritionalValue: number) {
        this.position = engine.createVector(x, y);
    }

    isPoison() {
        return this.nutritionalValue > 0;
    }

    isEaten() {
        return this.eaten;
    }

    wasEaten() {
        this.eaten = true;
    }
}