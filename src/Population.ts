import Particle from "./Particle";
import { engine } from "./Sketch";
import DNA from "./DNA";

export default class Population {


    private particles: Array<Particle> = new Array

    constructor(readonly size: number) {
        for (let i = 0; i < size; i++) {
            const x = Math.floor(engine.random(1800))
            const y = Math.floor(engine.random(800))
            
            const dna = new DNA(
                Math.floor(engine.random(20, 100)),
                engine.random(0, 2),
                engine.random(-1, 0)
            )
            
            this.particles.push(new Particle(x, y, dna))
        }
    }

    nextGeneration(mutationFactor: number) {
        const selected = this.evaluateAndSelect();
        const nextGeneration = this.cross(selected);
        this.mutate(nextGeneration, mutationFactor);
        this.particles = nextGeneration;
    }

    private evaluateAndSelect(): Array<Particle> {
        // TODO: implement better selection technique
        return this.particles.sort((p1, p2) => { return p2.getAge() - p1.getAge() }).splice(20)
    }

    private cross(selected: Array<Particle>): Array<Particle> {
        const newGeneration = [];
        const visibilities = selected.map(p => p.dna.visibility)
        const foodAttractions = selected.map(p => p.dna.foodAttraction)
        const poisonAttraction = selected.map(p => p.dna.poisonAttraction)
        for (let i = 0; i < this.size; i++) {
            const x = Math.floor(engine.random(1200))
            const y = Math.floor(engine.random(800))
            const dna = new DNA(
                this.randomValue(visibilities),
                this.randomValue(foodAttractions),
                this.randomValue(poisonAttraction)
            )
            newGeneration.push(new Particle(x, y, dna))
        }
        return newGeneration;
    }

    private mutate(crossed: Array<Particle>, mutationFactor: number) {
        crossed.forEach(p => {
            if (Math.random() < mutationFactor) {
                const att = engine.random(3)
                if (att < 1) {
                    p.dna.visibility += engine.random(-5, 5)
                } else if (att < 2) {
                    p.dna.foodAttraction += engine.random(-0.05, 0.05)
                } else {
                    p.dna.poisonAttraction += engine.random(-0.05, 0.05)
                }
            }
        })
    }

    private randomValue(values: Array<any>) {
        return values[Math.floor(engine.random(values.length))]
    }

    aliveIndividual() {
        return this.particles.filter(p => p.isAlive())
    }

    print() {
        const oldest = this.particles.sort((p1, p2) => { return p2.getAge() - p1.getAge() })[0]
        console.log(`${oldest.getAge()}, ${JSON.stringify(oldest.dna)}`)

    }

}