import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { Colors } from '../data/Colors';
import { DraggableGraphics } from '../components/draggables/DraggableGraphics';
import { Button } from '../components/ui/Button';
import { JMTweenEffect } from '../services/JMTweenEffects';
import { DraggableTarget } from '../components/draggables/DraggableTarget';

export class DragAllTargetUI extends BaseUI {
  private title: PIXI.Text;
  private restartButton: Button;

  private hintTimeout: number;

  private draggables: DraggableGraphics[] = [];
  private target: DraggableTarget;

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Drag All Target', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.restartButton = new Button({label: 'Restart', onClick: this.resetScene, width: 50, height: 30});
    this.addChild(this.title, this.restartButton);

    this.target = new DraggableTarget('square', 150, Colors.TARGET);
    this.addChild(this.target);

    this.draggables.push(new DraggableGraphics('square', 70, Colors.OPTIONS[0], this.background));
    this.draggables.push(new DraggableGraphics('square', 70, Colors.OPTIONS[1], this.background));
    this.draggables.push(new DraggableGraphics('square', 70, Colors.OPTIONS[2], this.background));
    this.draggables.forEach(draggable => {
      draggable.onInteractionStart = this.resetMovingHintTimer;
      draggable.onInteractionEnd = this.resetIdleHintTimer;
      draggable.onHoverStart = this.pauseHintTimer;
      draggable.onHoverEnd = this.resetMovingHintTimer;
      this.addChild(draggable);

      draggable.setTarget(this.target);
    });

    this.draggables[0].setStartingPosition(150, 300);
    this.draggables[1].setStartingPosition(400, 200);
    this.draggables[2].setStartingPosition(650, 300);
    this.target.position.set(400, 600);

    this.resetIdleHintTimer();
  }
  public navIn = () => {

    this.draggables[0].animateAppear().wait(400);
    this.draggables[1].animateAppear().wait(300);
    this.draggables[2].animateAppear().wait(500);
    this.target.animateAppear().wait(1000);
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 50;
    this.restartButton.position.set(e.innerBounds.right - 100, e.innerBounds.top + 30);
  }

  private resetScene = () => {
    this.navForward(new DragAllTargetUI(), this.previousUI);
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
    let draggable = this.draggables.find(obj => obj.exists);

    if (draggable) {
      JMTweenEffect.Pop(draggable.graphic);
      JMTweenEffect.Pop(this.target.graphic, 1.15).wait(150);
      this.resetIdleHintTimer();
    }
  }

  private runMovingHint = () => {
    JMTweenEffect.Pop(this.target, 1.15);

    this.resetMovingHintTimer();
  }
}
