import * as PIXI from 'pixi.js';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { DraggableGraphics } from './DraggableGraphics';

export class HorizontalStack {
    private objects: DraggableGraphics[] = [];

    constructor(public positon: PIXI.Point, private padding: number) {}

    public addObject(object: DraggableGraphics) {
        this.objects.push(object);
    }

    public removeObject(object: DraggableGraphics) {
        this.objects.splice(this.objects.indexOf(object), 1);
    }

    public reposition(andStart = true, instant = false) {
        let left = this.positon.x - this.padding * (this.objects.length - 1) / 2;
        for (let i = 0; i < this.objects.length; i++) {
            if (andStart) {
                this.objects[i].setStartingPosition(left + i * this.padding, this.positon.y, false);
            }

            if (instant) {
                this.objects[i].position.set(left + i * this.padding, this.positon.y);
            } else {
                new JMTween(this.objects[i].position, 300).to({x: left + i * this.padding, y: this.positon.y}).easing(JMEasing.Back.InOut).start();
            }
        }
    }
}
