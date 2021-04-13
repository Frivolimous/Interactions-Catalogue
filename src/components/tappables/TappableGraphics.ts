import * as PIXI from 'pixi.js';
import { CONFIG } from '../../Config';
import { Colors } from '../../data/Colors';
import { Firework } from '../../JMGE/effects/Firework';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { GameEvents } from '../../services/GameEvents';
import { JMTweenEffect } from '../../services/JMTweenEffects';

export class TappableGraphics extends PIXI.Container {
    public exists = true;

    public onTap: (button?: TappableGraphics) => void;
    public hitbox: PIXI.Graphics = new PIXI.Graphics();

    private graphic: PIXI.Graphics = new PIXI.Graphics();
    private shadow: PIXI.Graphics = new PIXI.Graphics();

    constructor(shape: 'square' | 'circle' | 'rectangle400', public size: number, public color: number) {
        super();
        this.graphic.beginFill(color).lineStyle(1, Colors.OUTLINE);
        this.shadow.beginFill(0, 0.25);
        this.shadow.position.set(0, 3);

        if (shape === 'square') {
            this.graphic.drawRoundedRect(-size / 2, - size / 2, size, size, size / 5);
            this.shadow.drawRoundedRect(-size / 2, - size / 2, size, size, size / 5);
        } else if (shape === 'rectangle400') {
            let w = 400;
            this.graphic.drawRoundedRect(-w / 2, - size / 2, w, size, size / 5);
            this.shadow.drawRoundedRect(-w / 2, - size / 2, w, size, size / 5);
        } else {
            this.graphic.drawCircle(0, 0, size);
            this.shadow.drawCircle(0, 0, size);
        }

        this.hitbox.interactive = true;
        this.hitbox.buttonMode = true;
        this.addChild(this.shadow, this.graphic, this.hitbox);

        // this.shadow.addChild(this.graphic);
        // this.graphic.position.set(0, -3);
        // this.graphic = this.shadow;

        if (CONFIG.INIT.BORDER) {
            this.hitbox.beginFill(0x00ffff).drawCircle(0, 0, 3);
            this.hitbox.lineStyle(1, 0xffff00, 0.7);
        }

        this.hitbox.beginFill(0, 0.001);
        let hitsize = Math.max(size * 1.5, CONFIG.INIT.MIN_HITSIZE);

        if (shape === 'rectangle400') {
            let w = 700;
            this.hitbox.drawRect(-w / 2, -hitsize / 2, w, hitsize);
        } else {
            this.hitbox.drawRect(-hitsize / 2, -hitsize / 2, hitsize, hitsize);
        }

        this.hitbox.addListener('pointerdown', this.onDown);
    }

    public destroy() {
        super.destroy();
    }

    public animateAppear() {
        this.scale.set(0, 0);
        return new JMTween(this.scale, 300).to({x: 1, y: 1}).easing(JMEasing.Back.Out).start();
    }

    public onDown = () => {
        // JMTweenEffect.Pop(this, 1.1, 500);
        this.onTap && this.onTap(this);
    }

    public interactionCompleteEffect(delay: number = 0) {
        this.exists = false;
        // JMTweenEffect.ShrinkAndDisappear(this.shadow);
        JMTweenEffect.ShrinkAndDisappearShadow(this.shadow, 1.1).wait(delay);
        JMTweenEffect.ShrinkAndDisappear(this.graphic, () => {
            Firework.makeExplosion(this.parent, {x: this.x, y: this.y, count: 70, mag_min: 2, fade: 0.06, tint: this.color});
            this.destroy();
            // this.onInteractionSuccess && this.onInteractionSuccess(this);
        }, 1.1).wait(delay);
    }

    public incorrectFadeEffect() {
        JMTweenEffect.ShakeNo(this.shadow);
        JMTweenEffect.ShakeNo(this.graphic).onComplete(() => this.fadeEffect(600));
        // this.fadeEffect();
    }

    public fadeEffect(delay: number = 0) {
        this.exists = false;
        JMTweenEffect.ShrinkAndDisappear(this.graphic, () => this.destroy(), 1).wait(delay);
        JMTweenEffect.ShrinkAndDisappearShadow(this.shadow, 1).wait(delay);
    }

    public pressEffect() {
        JMTweenEffect.PopShadow(this.shadow, 1.1, 200);
        JMTweenEffect.Pop(this.graphic, 1.1, 200);
    }

    public hintEffect(scale?: number) {
        // JMTweenEffect.Pop(this.graphic, 1.05);
        JMTweenEffect.Pop(this.graphic, scale);
        JMTweenEffect.PopShadow(this.shadow, scale);
    }
}
