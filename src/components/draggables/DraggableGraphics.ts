import * as PIXI from 'pixi.js';
import { CONFIG } from '../../Config';
import { Colors } from '../../data/Colors';
import { Firework } from '../../JMGE/effects/Firework';
import { JMEasing, JMTween } from '../../JMGE/JMTween';
import { GameEvents } from '../../services/GameEvents';
import { JMTweenEffect } from '../../services/JMTweenEffects';
import { DraggableTarget } from './DraggableTarget';

export class DraggableGraphics extends PIXI.Container {
    public exists = true;
    public boundsRatio = 0.1;
    public vRatio: number = 0.015;
    public friction: number = 0.85;

    public moveMode: 'physics' | 'discreet' | 'instant' = 'physics';
    public returnMode: 'zip' | 'drift' | 'respawn' = 'zip';

    public onInteractionStart: () => void;
    public onInteractionEnd: () => void;
    public onHoverStart: () => void;
    public onHoverEnd: () => void;
    public onInteractionSuccess: (object: DraggableGraphics) => void;

    public outerBounds: PIXI.Rectangle;

    public graphic: PIXI.Graphics = new PIXI.Graphics();
    public hitbox: PIXI.Graphics = new PIXI.Graphics();
    public offsetDot: PIXI.Graphics = new PIXI.Graphics();

    public dragOffset: PIXI.Point;
    public targetPosition: PIXI.Point;
    public overTarget: DraggableTarget | false = false;

    public startingPosition: PIXI.Point;

    public target: DraggableTarget;

    public incorrect: DraggableTarget[] = [];

    public hoverTween: JMTween;

    public vX: number = 0;
    public vY: number = 0;

    public drifting = false;

    constructor(shape: 'square' | 'circle', public size: number, public color: number, public canvas: PIXI.Container) {
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
        this.hitbox.addListener('pointerup', e => this.endDrag(e));
        this.hitbox.addListener('pointerupoutside', e => this.endDrag(e));
        GameEvents.ticker.add(() => this.onTick());
        canvas.addListener('pointermove', this.moveDrag);
    }

    public destroy() {
        super.destroy();

        GameEvents.ticker.remove(this.onTick);
        this.canvas.removeListener('pointermove', this.moveDrag);
    }

    public setStartingPosition(x: number, y: number, andUpdate = true) {
        this.startingPosition = new PIXI.Point(x, y);
        if (andUpdate) {
            this.position.set(x, y);
        }
    }

    public setTarget(target: DraggableTarget) {
        this.target = target;
    }

    public removeTarget() {
        if (this.isOverTarget(this.target)) {
            this.onOffTarget();
        }
        this.target = null;
    }

    public addIncorrectTarget(target: DraggableTarget) {
        this.incorrect.push(target);
    }

    public animateAppear() {
        this.scale.set(0, 0);
        return new JMTween(this.scale, 300).to({x: 1, y: 1}).easing(JMEasing.Back.Out).start();
    }

    public startDrag = (e: PIXI.interaction.InteractionEvent) => {
        let position = e.data.getLocalPosition(this.parent);

        this.dragOffset = new PIXI.Point(0, -50);
        this.targetPosition = new PIXI.Point(position.x + this.dragOffset.x, position.y + this.dragOffset.y);

        this.offsetDot.visible = true;
        this.offsetDot.position.set(-this.dragOffset.x, -this.dragOffset.y);
        this.startDragEffect();
        this.onInteractionStart && this.onInteractionStart();

        this.drifting = false;
    }

    public endDrag = (e: PIXI.interaction.InteractionEvent) => {
        this.dragOffset = null;
        this.offsetDot.visible = false;

        if (this.overTarget === this.target) {
            this.endHoverEffect();
            this.interactive = false;
            this.interactionCompleteEffect();
        } else if (this.overTarget) {
            this.endHoverIncorrect(this.overTarget);
            this.interactionIncorrectEffect(this.overTarget);
        } else {
            this.endDragEffect();
        }

        this.onInteractionEnd && this.onInteractionEnd();
    }

    public moveDrag = (e: PIXI.interaction.InteractionEvent) => {
        if (this.dragOffset) {
            let position = e.data.getLocalPosition(this.parent);

            this.targetPosition.x = position.x + this.dragOffset.x;
            this.targetPosition.y = position.y + this.dragOffset.y;
        }
    }

    public targetCheck = () => {
        if (this.target) {
            if (this.isOverTarget(this.target)) {
                if (this.overTarget !== this.target) {
                    this.onOverTarget();
                }
            } else {
                if (this.overTarget === this.target) {
                    this.onOffTarget();
                }

                this.incorrect.forEach(target => {
                    if (this.isOverTarget(target)) {
                        if (!this.overTarget) {
                            this.overTarget = target;
                            this.startHoverIncorrect(target);
                        }
                    } else {
                        if (this.overTarget === target) {
                            this.overTarget = null;
                            this.endHoverIncorrect(target);
                        }
                    }
                });
            }
        }
    }

    public onTick = () => {
        if (!this.exists) return;

        if (this.targetPosition) {
            if (this.moveMode === 'physics') {
                this.vX += (this.targetPosition.x - this.x) * this.vRatio;
                this.vY += (this.targetPosition.y - this.y) * this.vRatio;
            } else if (this.moveMode === 'discreet') {
                this.x = this.x + (this.targetPosition.x - this.x) * this.boundsRatio;
                this.y = this.y + (this.targetPosition.y - this.y) * this.boundsRatio;
            } else if (this.moveMode === 'instant') {
                this.x = this.targetPosition.x;
                this.y = this.targetPosition.y;
            }

            this.targetCheck();

        } else if (this.startingPosition && this.returnMode === 'drift') {
            this.vX += Math.min(Math.max(this.boundsRatio * 0.01 * (this.startingPosition.x - this.x), -0.03), 0.03);
            this.vY += Math.min(Math.max(this.boundsRatio * 0.01 * (this.startingPosition.y - this.y), -0.03), 0.03);
        }

        if (this.moveMode === 'physics') {
            this.vX *= this.friction;
            this.vY *= this.friction;

            this.x += this.vX;
            this.y += this.vY;
        }

        this.boundsCheck();
    }

    public boundsCheck = () => {
        if (this.outerBounds) {
            if (this.x < this.outerBounds.left + this.size) {
                this.x += (this.outerBounds.left + this.size - this.x) * this.boundsRatio;
            } else if (this.x > this.outerBounds.right - this.size) {
                this.x += (this.outerBounds.right - this.size - this.x) * this.boundsRatio;
            }

            if (this.y < this.outerBounds.top + this.size) {
                this.y += (this.outerBounds.top + this.size - this.y) * this.boundsRatio;
            } else if (this.y > this.outerBounds.bottom - this.size) {
                this.y += (this.outerBounds.bottom - this.size - this.y) * this.boundsRatio;
            }
        }
    }

    public isOverTarget = (target: DraggableTarget) => {
        let bounds = target.getHitBox();
        if (this.dragOffset) {
            let x = this.x - this.dragOffset.x;
            let y = this.y - this.dragOffset.y;
            if (x > bounds.left && y > bounds.top && x < bounds.right && y < bounds.bottom) {
                return true;
            }
        }

        return (this.x > bounds.left && this.y > bounds.top && this.x < bounds.right && this.y < bounds.bottom);
    }

    public onOverTarget = () => {
        this.overTarget = this.target;
        this.onHoverStart && this.onHoverStart();
        this.startHoverEffect();
    }

    public onOffTarget = () => {
        this.overTarget = false;
        this.onHoverEnd && this.onHoverEnd();
        this.endHoverEffect();
    }

    public startDragEffect() {
        new JMTween(this.graphic.scale, 300).to({x: 1.1, y: 1.1}).easing(JMEasing.Back.ExageratedOut).start();
    }

    public endDragEffect() {
        if (this.moveMode === 'physics' || this.moveMode === 'instant') {
            this.targetPosition = null;
        }
        if (this.startingPosition) {
            if (this.returnMode === 'zip') {
                JMTweenEffect.ZipTo(this, this.startingPosition);
            } else if (this.returnMode === 'respawn') {
                JMTweenEffect.RespawnAt(this, this.startingPosition);
            } else if (this.returnMode === 'drift') {

            }
            new JMTween(this.graphic.scale, 150).to({x: 1, y: 1}).start();
            if (this.moveMode === 'discreet') {
                this.targetPosition = null;
            } else if (this.moveMode === 'physics' && this.returnMode !== 'drift') {
                this.vX = 0;
                this.vY = 0;
            }
        } else {
            new JMTween(this.graphic.scale, 150).to({x: 0.9, y: 0.9}).easing(JMEasing.Quadratic.Out).start();
        }
    }

    public startHoverEffect() {
        new JMTween(this.graphic.scale, 100).to({x: 1.3, y: 1.3}).start();
        if (!this.hoverTween) {
            this.hoverTween = JMTweenEffect.InfiniteWiggle(this.graphic);
        }

        this.target && this.target.startHoverEffect();
    }

    public endHoverEffect() {
        new JMTween(this.graphic.scale, 100).to({x: 1.1, y: 1.1}).start();
        if (this.hoverTween) {
            this.hoverTween.stop();
            new JMTween(this.graphic, 100).to({rotation: 0}).start();
            this.hoverTween = null;
        }

        this.target && this.target.endHoverEffect();
    }

    public startHoverIncorrect(target: DraggableTarget) {
        new JMTween(this.graphic.scale, 100).to({x: 1.1, y: 1.1}).start();
        if (!this.hoverTween) {
            this.hoverTween = JMTweenEffect.InfiniteWiggle(this.graphic);
        }
    }

    public endHoverIncorrect(target: DraggableTarget) {
        new JMTween(this.graphic.scale, 100).to({x: 1.1, y: 1.1}).start();
        if (this.hoverTween) {
            this.hoverTween.stop();
            new JMTween(this.graphic, 100).to({rotation: 0}).start();
            this.hoverTween = null;
        }
    }

    public interactionCompleteEffect() {
        JMTweenEffect.ShrinkAndDisappear(this.graphic, () => {
            Firework.makeExplosion(this.parent, {x: this.x, y: this.y, count: 70, mag_min: 2, fade: 0.06, tint: this.color});
            this.exists = false;
            this.destroy();
            this.onInteractionSuccess && this.onInteractionSuccess(this);
        });
    }

    public interactionIncorrectEffect(target: DraggableTarget) {
        this.targetPosition = null;
        this.hitbox.interactive = false;
        new JMTween(this, 0).wait(1000).start().onComplete(() => {
            this.hitbox.interactive = true;
            this.endDragEffect();
        });
        this.overTarget = null;
        target.incorrectEffect();
    }
}
