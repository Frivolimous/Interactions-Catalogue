import * as PIXI from 'pixi.js';
import { CONFIG } from '../../Config';
import { Colors } from '../../data/Colors';
import { Firework } from '../../JMGE/effects/Firework';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { GameEvents } from '../../services/GameEvents';
import { JMTweenEffect } from '../../services/JMTweenEffects';
import { DraggableGraphics } from './DraggableGraphics';
import { DraggableTarget } from './DraggableTarget';

export class DraggableGraphicsInexhaustible extends DraggableGraphics {
    protected interactionCompleteEffect() {
        this.hitbox.interactive = false;
        JMTweenEffect.ShrinkAndDisappear(this.graphic, () => {
            Firework.makeExplosion(this.parent, {x: this.x, y: this.y, count: 70, mag_min: 2, fade: 0.06, tint: this.color});

            this.position.set(this.startingPosition.x, this.startingPosition.y);

            JMTweenEffect.Reappear(this.graphic).wait(500).onComplete(() => this.hitbox.interactive = true);
        });
    }

    protected endDragEffect() {
        if (this.startingPosition) {
            JMTweenEffect.RespawnAt(this, this.startingPosition);
            new JMTween(this.graphic.scale, 150).to({x: 1, y: 1}).start();
        } else {
            new JMTween(this.graphic.scale, 150).to({x: 0.9, y: 0.9}).easing(JMEasing.Quadratic.Out).start();
        }
    }
}
