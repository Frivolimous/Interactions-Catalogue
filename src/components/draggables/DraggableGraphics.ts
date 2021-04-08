import * as PIXI from 'pixi.js';
import { CONFIG } from '../../Config';
import { Colors } from '../../data/Colors';
import { Firework } from '../../JMGE/effects/Firework';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { GameEvents } from '../../services/GameEvents';
import { JMTweenEffect } from '../../services/JMTweenEffects';
import { DraggableTarget } from './DraggableTarget';

export class DraggableGraphics extends PIXI.Container {
    public onInteractionStart: () => void;
    public onInteractionEnd: () => void;
    public onHoverStart: () => void;
    public onHoverEnd: () => void;

    public graphic: PIXI.Graphics = new PIXI.Graphics();
    private hitbox: PIXI.Graphics = new PIXI.Graphics();
    private offsetDot: PIXI.Graphics = new PIXI.Graphics();

    private dragOffset: PIXI.Point;
    private targetPosition: PIXI.Point;
    private overTarget = false;
    private moveRatio = 0.1;
    private startingPosition: PIXI.Point;

    private target: DraggableTarget;

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
        this.hitbox.buttonMode = true;
        this.addChild(this.graphic, this.hitbox);

        if (CONFIG.INIT.BORDER) {
            this.hitbox.beginFill(0x00ffff).drawCircle(0, 0, 3);
            this.hitbox.lineStyle(1, 0xffff00, 0.7);

            this.offsetDot.beginFill(0x00ffff);
            this.offsetDot.drawCircle(0, 0, 3);
            this.addChild(this.offsetDot);
            this.offsetDot.visible = false;
        }

        this.hitbox.beginFill(0, 0.001);
        let hitsize = Math.max(size * 1.5, CONFIG.INIT.MIN_HITSIZE);
        this.hitbox.drawRect(-hitsize / 2, -hitsize / 2, hitsize, hitsize);

        this.hitbox.addListener('pointerdown', this.startDrag);
        this.hitbox.addListener('pointerup', this.endDrag);
        this.hitbox.addListener('pointerupoutside', this.endDrag);
        GameEvents.ticker.add(this.onTick);
        canvas.addListener('pointermove', this.moveDrag);
    }

    public setStartingPosition(x: number, y: number) {
        this.position.set(x, y);
        this.startingPosition = new PIXI.Point(x, y);
    }

    public setTarget(target: DraggableTarget) {
        this.target = target;
    }

    public animateAppear() {
        this.scale.set(0, 0);
        return new JMTween(this.scale, 300).to({x: 1, y: 1}).easing(JMEasing.Back.Out).start();
    }

    private startDrag = (e: PIXI.interaction.InteractionEvent) => {
        let position = e.data.getLocalPosition(this.parent);

        this.dragOffset = new PIXI.Point(0, -50);
        this.targetPosition = new PIXI.Point(position.x + this.dragOffset.x, position.y + this.dragOffset.y);

        this.offsetDot.visible = true;
        this.offsetDot.position.set(-this.dragOffset.x, -this.dragOffset.y);
        this.startDragEffect();
        this.onInteractionStart && this.onInteractionStart();
    }

    private endDrag = (e: PIXI.interaction.InteractionEvent) => {
        this.dragOffset = null;
        this.targetPosition = null;
        this.offsetDot.visible = false;

        if (this.overTarget) {
            this.endHoverEffect();
            this.interactive = false;
            this.interactionCompleteEffect();
        } else {
            this.endDragEffect();
        }

        this.onInteractionEnd && this.onInteractionEnd();
    }

    private moveDrag = (e: PIXI.interaction.InteractionEvent) => {
        if (this.dragOffset) {
            let position = e.data.getLocalPosition(this.parent);

            this.targetPosition.x = position.x + this.dragOffset.x;
            this.targetPosition.y = position.y + this.dragOffset.y;
        }
    }

    private onTick = () => {
        if (this.targetPosition) {
            this.x = this.x + (this.targetPosition.x - this.x) * this.moveRatio;
            this.y = this.y + (this.targetPosition.y - this.y) * this.moveRatio;

            if (this.target) {
                if (this.isOverTarget()) {
                    if (!this.overTarget) {
                        this.onOverTarget();
                    }
                } else {
                    if (this.overTarget) {
                        this.onOffTarget();
                    }
                }
            }
        }
    }

    private isOverTarget = () => {
        let bounds = this.target.getHitBox();
        if (this.dragOffset) {
            let x = this.x - this.dragOffset.x;
            let y = this.y - this.dragOffset.y;
            if (x > bounds.left && y > bounds.top && x < bounds.right && y < bounds.bottom) {
                return true;
            }
        }
        // this.targetPosition.x = position.x + this.dragOffset.x;
        return (this.x > bounds.left && this.y > bounds.top && this.x < bounds.right && this.y < bounds.bottom);
    }

    private onOverTarget = () => {
        this.overTarget = true;
        this.onHoverStart && this.onHoverStart();
        this.startHoverEffect();
    }

    private onOffTarget = () => {
        this.overTarget = false;
        this.onHoverEnd && this.onHoverEnd();
        this.endHoverEffect();
    }

    private startDragEffect() {
        new JMTween(this.graphic.scale, 300).to({x: 1.1, y: 1.1}).easing(JMEasing.Back.ExageratedOut).start();
    }

    private endDragEffect() {
        if (this.startingPosition) {
            // JMTweenEffect.RespawnAt(this, this.startingPosition);
            JMTweenEffect.ZipTo(this, this.startingPosition);
            new JMTween(this.graphic.scale, 150).to({x: 1, y: 1}).start();
        } else {
            new JMTween(this.graphic.scale, 150).to({x: 0.9, y: 0.9}).easing(JMEasing.Quadratic.Out).start();
        }
    }

    private startHoverEffect() {
        new JMTween(this.graphic.scale, 100).to({x: 1.3, y: 1.3}).start();
        this.hoverTween = new JMTween(this.graphic, 200).to({rotation: Math.PI / 6}).start().onComplete(() => {
            this.hoverTween.reverse();
            this.hoverTween.reset();
            this.hoverTween.start();
        });
        this.target && this.target.startHoverEffect();
    }

    private endHoverEffect() {
        new JMTween(this.graphic.scale, 100).to({x: 1.1, y: 1.1}).start();
        if (this.hoverTween) {
            this.hoverTween.stop();
            new JMTween(this.graphic, 100).to({rotation: 0}).start();
            this.hoverTween = null;
        }

        this.target && this.target.endHoverEffect();
    }

    private interactionCompleteEffect() {
        JMTweenEffect.ShrinkAndDisappear(this.graphic, () => {
            Firework.makeExplosion(this.parent, {x: this.x, y: this.y, count: 70, mag_min: 2, fade: 0.06, tint: Colors.OPTIONS[0]});
            this.destroy();
        });
    }
}
