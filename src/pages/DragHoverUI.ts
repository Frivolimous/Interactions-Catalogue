import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { Colors } from '../data/Colors';
import { DraggableGraphicsHover } from '../components/draggables/DraggableGraphicsHover';
import { Button } from '../components/ui/Button';
import { JMTweenEffect } from '../services/JMTweenEffects';
import { DraggableTargetProgressive } from '../components/draggables/DraggableTargetProgressive';
import { Firework } from '../JMGE/effects/Firework';

export class DragHoverUI extends BaseUI {
  private title: PIXI.Text;
  private restartButton: Button;

  private hintTimeout: number;

  private draggable: DraggableGraphicsHover;
  private target: DraggableTargetProgressive;

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Drag Hover', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.restartButton = new Button({label: 'Restart', onClick: this.resetScene, width: 50, height: 30});
    this.addChild(this.title, this.restartButton);

    this.target = new DraggableTargetProgressive('square', 150, Colors.TARGET, Colors.TARGETS[0]);
    this.draggable = new DraggableGraphicsHover('square', 70, Colors.OPTIONS[0], this.background);
    this.draggable.onInteractionStart = this.resetMovingHintTimer;
    this.draggable.onInteractionEnd = this.resetIdleHintTimer;
    this.draggable.onHoverStart = this.pauseHintTimer;
    this.draggable.onHoverEnd = this.resetMovingHintTimer;

    this.addChild(this.target, this.draggable);

    this.draggable.setTarget(this.target);

    this.draggable.position.set(150, 400);
    this.target.position.set(600, 400);

    this.target.onProgressComplete = () => {
      this.draggable.removeTarget();
      this.pauseHintTimer();

      Firework.makeExplosion(this, {x: this.target.x, y: this.target.y, count: 70, mag_min: 2, fade: 0.06, tint: Colors.OPTIONS[0]});

      // this.draggable.completeAndDestroy();
    };

    this.resetIdleHintTimer();
  }
  public navIn = () => {

    this.draggable.animateAppear().wait(300);
    this.target.animateAppear().wait(500);
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 50;
    this.restartButton.position.set(e.innerBounds.right - 100, e.innerBounds.top + 30);

    if (this.draggable) this.draggable.outerBounds = e.innerBounds;
  }

  private resetScene = () => {
    this.navForward(new DragHoverUI(), this.previousUI);
  }

  private resetIdleHintTimer = () => {
    this.hintTimeout && window.clearTimeout(this.hintTimeout);

    this.hintTimeout = window.setTimeout(this.runIdleHint, 7000);
  }

  private resetMovingHintTimer = () => {
    this.hintTimeout && window.clearTimeout(this.hintTimeout);

    this.hintTimeout = window.setTimeout(this.runMovingHint, 3000);
  }

  private pauseHintTimer = () => {
    this.hintTimeout && window.clearTimeout(this.hintTimeout);
    this.hintTimeout = null;
  }

  private runIdleHint = () => {
    if (!this.draggable.exists || this.target.disabled) return;

    JMTweenEffect.Pop(this.draggable.graphic);
    JMTweenEffect.Pop(this.target.graphic, 1.15).wait(150);

    this.resetIdleHintTimer();
  }

  private runMovingHint = () => {
    if (this.target.disabled) return;
    JMTweenEffect.Pop(this.target, 1.15);

    this.resetMovingHintTimer();
  }
}
