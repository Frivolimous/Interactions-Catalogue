import * as PIXI from 'pixi.js';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { BasicGraphics } from './BasicGraphics';
import { DraggableGraphics } from './DraggableGraphics';
import { DraggableTarget } from './DraggableTarget';

type Stackable = DraggableGraphics | DraggableTarget | BasicGraphics;
export class HorizontalStack {
    private objects: Stackable[] = [];

    constructor(public positon: PIXI.Point, private padding: number) {}

    public addObject(object: Stackable) {
        this.objects.push(object);
    }

    public removeObject(object: Stackable) {
        this.objects.splice(this.objects.indexOf(object), 1);
    }

    public reposition(andStart = true, instant = false) {
        let left = this.positon.x - this.padding * (this.objects.length - 1) / 2;
        for (let i = 0; i < this.objects.length; i++) {
            let object = this.objects[i];
            if (andStart && (object instanceof DraggableGraphics)) {
                object.setStartingPosition(left + i * this.padding, this.positon.y, false);
            }

            if (instant) {
                object.position.set(left + i * this.padding, this.positon.y);
            } else {
                new JMTween(object.position, 500).to({x: left + i * this.padding, y: this.positon.y}).easing(JMEasing.Sinusoidal.InOut).start();
            }
        }
    }
}
