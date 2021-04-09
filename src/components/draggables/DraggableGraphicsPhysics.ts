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
    // constructor(shape: 'square' | 'circle', size: number, public color: number, public canvas: PIXI.Container) {
    //     super(shape, size, color, canvas);
    // }

    public startDragEffect() {
        new JMTween(this.graphic.scale, 300).to({x: 1.1, y: 1.1}).easing(JMEasing.Back.ExageratedOut).start();
    }

    public endDragEffect() {
        this.targetPosition = null;
        new JMTween(this.graphic.scale, 150).to({x: 1, y: 1}).start();
    }
}
