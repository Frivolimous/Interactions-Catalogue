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
    public percent: number = 0;

    private overlay = new PIXI.Graphics();

    private draining: number = 0;

    constructor(private shape: 'square' | 'circle' | 'tall', private size: number, color: number, private colorOver: number) {
        super(shape, size, color);

        this.addChild(this.overlay);
    }

    public startDrain(amount: number) {
        if (amount > 0) {
            this.draining = amount;
            GameEvents.ticker.add(this.drainOnTick);
        } else if (this.draining > 0) {
            this.draining = 0;
            GameEvents.ticker.remove(this.drainOnTick);
        }
    }

    public drainOnTick = () => {
        this.percent = Math.max(0, this.percent - this.draining);
        // this.percent -= this.draining;

        this.redrawOverlay();
    }

    public destroy() {
        if (this.draining) {
            GameEvents.ticker.remove(this.drainOnTick);
        }
        super.destroy();
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
            this.percent = 1;
            this.disabled = true;
            this.onProgressComplete && this.onProgressComplete();
            this.endHoverEffect();
        }

        this.redrawOverlay();
    }

    public redrawOverlay() {
        let size = this.size * this.percent;

        if (this.shape === 'square') {
            this.overlay.clear().beginFill(this.colorOver).lineStyle(1, Colors.OUTLINE)
                .drawRoundedRect(-size / 2, - size / 2, size, size, size / 5);
        } else if (this.shape === 'tall') {
            this.overlay.clear().beginFill(this.colorOver).lineStyle(1, Colors.OUTLINE)
                .drawRoundedRect(-size / 2, - size, size, size * 2, size / 5);
        } else {
            this.overlay.clear().beginFill(this.colorOver).lineStyle(1, Colors.OUTLINE)
                .drawCircle(0, 0, size);
        }
    }
}
