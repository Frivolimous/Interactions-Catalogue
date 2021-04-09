import * as PIXI from 'pixi.js';
import { CONFIG } from '../../Config';
import { Colors } from '../../data/Colors';
import { Firework } from '../../JMGE/effects/Firework';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { GameEvents } from '../../services/GameEvents';
import { JMTweenEffect } from '../../services/JMTweenEffects';
import { DraggableGraphics } from './DraggableGraphics';
import { DraggableTarget } from './DraggableTarget';

export class DraggableGraphicsContained extends DraggableGraphics {

    constructor(shape: 'square' | 'circle', size: number, protected color: number, protected canvas: PIXI.Container) {
        super(shape, size, color, canvas);

        this.graphic.scale.set(0);

    }
    protected interactionCompleteEffect() {
        this.hitbox.interactive = false;
        JMTweenEffect.ShrinkAndDisappear(this.graphic, () => {
            Firework.makeExplosion(this.parent, {x: this.x, y: this.y, count: 70, mag_min: 2, fade: 0.06, tint: this.color});
            this.hitbox.interactive = true;
            if (this.startingPosition) {
                this.position.set(this.startingPosition.x, this.startingPosition.y);
            }
        });
    }

    protected endDragEffect() {
        new JMTween(this.graphic.scale, 200).to({x: 0, y: 0}).start().onComplete(() => {
            if (this.startingPosition) {
                this.position.set(this.startingPosition.x, this.startingPosition.y);
            }
        });
    }
}
