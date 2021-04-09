import * as PIXI from 'pixi.js';
import { Firework } from '../../JMGE/effects/Firework';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { JMTweenEffect } from '../../services/JMTweenEffects';
import { DraggableGraphics } from './DraggableGraphics';
import { DraggableTarget } from './DraggableTarget';

export class DraggableGraphicsPlaceable extends DraggableGraphics {
    public targets: DraggableTarget[] = [];

    constructor(shape: 'square' | 'circle', size: number, public color: number, public canvas: PIXI.Container) {
        super(shape, size, color, canvas);
    }

    public addTargets(targets: DraggableTarget[]) {
        this.targets = targets;
    }

    public targetCheck = () => {
        this.targets.forEach(target => {
            if (this.overTarget) {
                if (!this.isOverTarget(target)) {
                    this.overTarget = null;
                }
            } else {
                if (this.isOverTarget(target)) {
                    this.overTarget = target;
                }
            }
        });
    }

    public interactionCompleteEffect() {
        this.targetPosition = null;

    }
}
