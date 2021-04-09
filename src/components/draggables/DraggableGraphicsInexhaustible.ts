import * as PIXI from 'pixi.js';
import { Firework } from '../../JMGE/effects/Firework';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { JMTweenEffect } from '../../services/JMTweenEffects';
import { DraggableGraphics } from './DraggableGraphics';

export class DraggableGraphicsInexhaustible extends DraggableGraphics {
    constructor(shape: 'square' | 'circle', size: number, protected color: number, protected canvas: PIXI.Container) {
        super(shape, size, color, canvas);

        this.returnMode = 'respawn';
    }

    protected interactionCompleteEffect() {
        this.targetPosition = null;

        this.hitbox.interactive = false;
        JMTweenEffect.ShrinkAndDisappear(this.graphic, () => {
            Firework.makeExplosion(this.parent, {x: this.x, y: this.y, count: 70, mag_min: 2, fade: 0.06, tint: this.color});

            this.position.set(this.startingPosition.x, this.startingPosition.y);
            this.vX = 0;
            this.vY = 0;

            JMTweenEffect.Reappear(this.graphic).wait(500).onComplete(() => this.hitbox.interactive = true);
        });
    }
}
