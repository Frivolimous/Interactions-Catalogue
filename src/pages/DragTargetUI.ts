import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { Colors } from '../data/Colors';
import { DraggableGraphics } from '../components/draggables/DraggableGraphics';
import { Button } from '../components/ui/Button';
import { JMTweenEffect } from '../services/JMTweenEffects';
import { DraggableTarget } from '../components/draggables/DraggableTarget';

export class DragTargetUI extends BaseUI {
  private title: PIXI.Text;
  private restartButton: Button;

  private hintTimeout: number;

  private draggable: DraggableGraphics;
  private target: DraggableTarget;

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Drag Target', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.restartButton = new Button({label: 'Restart', onClick: this.resetScene, width: 50, height: 30});
    this.addChild(this.title, this.restartButton);

    this.target = new DraggableTarget('square', 150, Colors.TARGET);
    this.draggable = new DraggableGraphics('square', 70, Colors.OPTIONS[0], this.background);
    this.draggable.onInteractionStart = this.resetMovingHintTimer;
    this.draggable.onInteractionEnd = this.resetIdleHintTimer;
    this.draggable.onHoverStart = this.pauseHintTimer;
    this.draggable.onHoverEnd = this.resetMovingHintTimer;

    this.addChild(this.target, this.draggable);

    this.draggable.setTarget(this.target);

    this.resetIdleHintTimer();
  }
  public navIn = () => {

    this.draggable.animateAppear().wait(300);
    this.target.animateAppear().wait(500);
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 20;
    this.restartButton.position.set(e.innerBounds.right - 100, e.innerBounds.top + 30);

    this.draggable.setStartingPosition(e.innerBounds.width / 4, e.innerBounds.height / 2);
    this.target.position.set(e.innerBounds.width * 3 / 4, e.innerBounds.height / 2);
  }

  private resetScene = () => {
    this.navForward(new DragTargetUI(), this.previousUI);
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
    if (!this.draggable.exists) return;

    JMTweenEffect.Pop(this.draggable.graphic);
    JMTweenEffect.Pop(this.target.graphic, 1.15).wait(150);

    this.resetIdleHintTimer();
  }

  private runMovingHint = () => {
    JMTweenEffect.Pop(this.target, 1.15);

    this.resetMovingHintTimer();
  }
}
