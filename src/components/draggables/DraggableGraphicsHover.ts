import * as PIXI from 'pixi.js';
import { CONFIG } from '../../Config';
import { Colors } from '../../data/Colors';
import { Firework } from '../../JMGE/effects/Firework';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { GameEvents } from '../../services/GameEvents';
import { JMTweenEffect } from '../../services/JMTweenEffects';
import { DraggableGraphics } from './DraggableGraphics';
import { DraggableTarget } from './DraggableTarget';
import { DraggableTargetProgressive } from './DraggableTargetProgressive';

export class DraggableGraphicsHover extends DraggableGraphics {

    // constructor(shape: 'square' | 'circle', size: number, public color: number, public canvas: PIXI.Container) {
    //     super(shape, size, color, canvas);
    // }

    public completeAndDestroy() {
        this.exists = false;

        this.interactionCompleteEffect();
    }

    public endDrag = (e: PIXI.interaction.InteractionEvent) => {
        this.dragOffset = null;
        this.offsetDot.visible = false;

        this.endDragEffect();

        this.onInteractionEnd && this.onInteractionEnd();
    }

    public startHoverEffect() {
        new JMTween(this.graphic, 200).to({rotation: Math.PI / 6}).easing(JMEasing.Quadratic.Out).start();
        new JMTween(this.graphic.scale, 100).to({x: 1.2, y: 1.2}).start();
        // if (!this.hoverTween) {
        //     this.hoverTween = JMTweenEffect.InfiniteWiggle(this.graphic);
        // }

        this.target && this.target.startHoverEffect();
    }

    public endHoverEffect() {
        new JMTween(this.graphic.scale, 100).to({x: 1.1, y: 1.1}).start();

        new JMTween(this.graphic, 200).to({rotation: 0}).easing(JMEasing.Quadratic.Out).start();
        this.target && this.target.endHoverEffect();
    }
}
