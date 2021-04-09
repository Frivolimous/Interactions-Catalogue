import * as PIXI from 'pixi.js';
import { CONFIG } from '../../Config';
import { Colors } from '../../data/Colors';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { GameEvents } from '../../services/GameEvents';
import { JMTweenEffect } from '../../services/JMTweenEffects';
import { DraggableTarget } from './DraggableTarget';

export class DraggableTargetProgressive extends DraggableTarget {
    public increment = 0.005;

    public onProgressComplete: () => void;
    private percent: number = 0;

    private overlay = new PIXI.Graphics();

    constructor(shape: 'square' | 'circle', private size: number, color: number, private colorOver: number) {
        super(shape, size, color);

        this.addChild(this.overlay);
    }

    public startHoverEffect = () => {
        if (this.disabled) return;
        this.endHoverEffect();

        GameEvents.ticker.add(this.tickProgress);
    }

    public endHoverEffect = () => {
        GameEvents.ticker.remove(this.tickProgress);
    }

    public tickProgress = () => {
        if (this.disabled) return;

        this.progressBy(this.increment);
    }

    public progressBy = (percent: number) => {
        this.percent += percent;

        if (this.percent >= 1) {
            this.disabled = true;
            this.onProgressComplete && this.onProgressComplete();
            this.endHoverEffect();
        }

        let size = this.size * this.percent;
        this.overlay.clear().beginFill(this.colorOver).lineStyle(1, Colors.OUTLINE)
            .drawRoundedRect(-size / 2, -size / 2, size, size, size / 5);
    }
}
