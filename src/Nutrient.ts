import { engine } from "./Sketch";
const p5 = require("p5");

export default class Nutrient {

    readonly position: p5.Vector;

    constructor(x: number, y: number, readonly nutritionalValue: number) {
        this.position = engine.createVector(x, y);
    }

    isPoison() {
        return this.nutritionalValue > 0;
    }
}