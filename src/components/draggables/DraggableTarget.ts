import * as PIXI from 'pixi.js';
import { CONFIG } from '../../Config';
import { Colors } from '../../data/Colors';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { JMTweenEffect } from '../../services/JMTweenEffects';

export class DraggableTarget extends PIXI.Container {
    public graphic: PIXI.Graphics = new PIXI.Graphics();
    private hitbox: PIXI.Graphics = new PIXI.Graphics();

    private hoverTween: JMTween;

    constructor(shape: 'square' | 'circle', size: number, color: number, private canvas: PIXI.Container) {
        super();
        this.graphic.beginFill(color).lineStyle(1, Colors.OUTLINE);

        if (shape === 'square') {
            this.graphic.drawRoundedRect(-size / 2, - size / 2, size, size, size / 5);
        } else {
            this.graphic.drawCircle(0, 0, size);
        }

        this.hitbox.interactive = true;
        this.addChild(this.graphic, this.hitbox);
        this.hitbox.beginFill(0, 0.001);

        if (CONFIG.INIT.BORDER) {
            this.hitbox.lineStyle(1, 0xffff00, 0.7);
        }

        let hitsize = Math.max(size * 1.5, CONFIG.INIT.MIN_HITSIZE);
        this.hitbox.drawRect(-hitsize / 2, -hitsize / 2, hitsize, hitsize);
    }

    public getHitBox = () => {
        return new PIXI.Rectangle(this.x - this.hitbox.width / 2, this.y - this.hitbox.height / 2, this.hitbox.width, this.hitbox.height);
    }

    public animateAppear() {
        this.scale.set(0, 0);
        return new JMTween(this.scale, 300).to({x: 1, y: 1}).easing(JMEasing.Back.Out).start();
    }

    public startHoverEffect = () => {
        this.endHoverEffect();

        this.hoverTween = new JMTween(this.graphic.scale, 500).to({x: 1.05, y: 1.05}).easing(JMEasing.Quadratic.InOut).yoyo(true, Infinity).start();
    }

    public endHoverEffect = () => {
        if (this.hoverTween) {
            this.hoverTween.stop();

            this.hoverTween = null;

            new JMTween(this.graphic.scale, 300).to({x: 1, y: 1}).easing(JMEasing.Quadratic.Out).start();
        }
    }

    public incorrectEffect = () => {
        new JMTween(this.graphic, 100).colorTo({tint: 0x777777}).start()
            .chain(this.graphic, 100).colorTo({tint: 0xffffff}).wait(1400);

        JMTweenEffect.ShakeNo(this.graphic, 10, 800).wait(300);
    }
}
