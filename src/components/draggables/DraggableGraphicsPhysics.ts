import * as PIXI from 'pixi.js';
import { CONFIG } from '../../Config';
import { Colors } from '../../data/Colors';
import { Firework } from '../../JMGE/effects/Firework';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { GameEvents } from '../../services/GameEvents';
import { JMTweenEffect } from '../../services/JMTweenEffects';
import { DraggableGraphics } from './DraggableGraphics';
import { DraggableTarget } from './DraggableTarget';

export class DraggableGraphicsPhysics extends DraggableGraphics {
    private vX: number = 0;
    private vY: number = 0;
    private vRatio: number = 0.006;
    private friction: number = 0.85;
    // constructor(shape: 'square' | 'circle', size: number, protected color: number, protected canvas: PIXI.Container) {
    //     super(shape, size, color, canvas);
    // }

    protected onTick = () => {
        if (!this.exists) return;

        if (this.targetPosition) {
            this.vX += (this.targetPosition.x - this.x) * this.vRatio;
            this.vY += (this.targetPosition.y - this.y) * this.vRatio;
        }

        this.vX *= this.friction;
        this.vY *= this.friction;

        this.x += this.vX;
        this.y += this.vY;
    }

    protected startDragEffect() {
        new JMTween(this.graphic.scale, 300).to({x: 1.1, y: 1.1}).easing(JMEasing.Back.ExageratedOut).start();
    }

    protected endDragEffect() {
        this.targetPosition = null;
        new JMTween(this.graphic.scale, 150).to({x: 1, y: 1}).start();
    }
}
