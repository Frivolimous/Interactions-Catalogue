import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { Colors } from '../data/Colors';
import { DraggableGraphics } from '../components/draggables/DraggableGraphics';
import { Button } from '../components/ui/Button';
import { JMTweenEffect } from '../services/JMTweenEffects';
import { DraggableTarget } from '../components/draggables/DraggableTarget';
import { HorizontalStack } from '../components/draggables/HorizontalStack';

export class DragOptionSingleUI extends BaseUI {
  private title: PIXI.Text;
  private restartButton: Button;

  private hintTimeout: number;

  private draggables: DraggableGraphics[] = [];
  private target: DraggableTarget;

  private horizontalStack: HorizontalStack;

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Drag Option: Single Use', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.restartButton = new Button({label: 'Restart', onClick: this.resetScene, width: 50, height: 30});
    this.addChild(this.title, this.restartButton);

    this.target = new DraggableTarget('square', 150, Colors.TARGET);
    this.addChild(this.target);
    this.horizontalStack = new HorizontalStack(new PIXI.Point(0, 0), 150);

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
      draggable.onInteractionSuccess = this.onOptionSuccess;
      this.horizontalStack.addObject(draggable);
    });

    this.resetIdleHintTimer();
  }

  public navIn = () => {

    this.draggables[0].animateAppear().wait(600);
    this.draggables[1].animateAppear().wait(500);
    this.draggables[2].animateAppear().wait(700);
    this.target.animateAppear().wait(300);
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 20;
    this.restartButton.position.set(e.innerBounds.right - 100, e.innerBounds.top + 30);

    this.horizontalStack.positon.set(e.innerBounds.width / 2, e.innerBounds.height * 5 / 6);
    this.horizontalStack.padding = e.innerBounds.width / 6;
    this.horizontalStack.reposition(true, true);
    this.target.position.set(e.innerBounds.width / 2, e.innerBounds.height / 2.5);
  }

  private resetScene = () => {
    this.navForward(new DragOptionSingleUI(), this.previousUI);
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

  private onOptionSuccess = (option: DraggableGraphics) => {
    this.horizontalStack.removeObject(option);
    this.horizontalStack.reposition(true, false);
  }
}
