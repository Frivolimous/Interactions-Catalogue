import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { Colors } from '../data/Colors';
import { DraggableGraphicsContained } from '../components/draggables/DraggableGraphicsContained';
import { Button } from '../components/ui/Button';
import { JMTweenEffect } from '../services/JMTweenEffects';
import { DraggableTarget } from '../components/draggables/DraggableTarget';
import { HorizontalStack } from '../components/draggables/HorizontalStack';
import { BasicGraphics } from '../components/draggables/BasicGraphics';

export class DragOptionContaineredUI extends BaseUI {
  private title: PIXI.Text;
  private restartButton: Button;

  private hintTimeout: number;

  private containers: BasicGraphics[] = [];
  private draggables: DraggableGraphicsContained[] = [];
  private target: DraggableTarget;

  private containerStack: HorizontalStack;
  private horizontalStack: HorizontalStack;

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Drag Option: Containered', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.restartButton = new Button({label: 'Restart', onClick: this.resetScene, width: 50, height: 30});
    this.addChild(this.title, this.restartButton);

    this.target = new DraggableTarget('square', 200, Colors.TARGET);
    this.addChild(this.target);
    this.containerStack = new HorizontalStack(new PIXI.Point(0, 0), 150);
    this.horizontalStack = new HorizontalStack(new PIXI.Point(0, 0), 150);

    this.containers.push(new BasicGraphics('square', 70, Colors.OPTIONS[0]));
    this.containers.push(new BasicGraphics('square', 70, Colors.OPTIONS[3]));
    this.containers.push(new BasicGraphics('square', 70, Colors.OPTIONS[2]));
    this.containers.forEach(container => {
      this.addChild(container);

      this.containerStack.addObject(container);
    });

    this.draggables.push(new DraggableGraphicsContained('circle', 20, Colors.OPTIONS[0], this.background));
    this.draggables.push(new DraggableGraphicsContained('circle', 20, Colors.OPTIONS[3], this.background));
    this.draggables.push(new DraggableGraphicsContained('circle', 20, Colors.OPTIONS[2], this.background));
    this.draggables.forEach(draggable => {
      draggable.onInteractionStart = this.resetMovingHintTimer;
      draggable.onInteractionEnd = this.resetIdleHintTimer;
      draggable.onHoverStart = this.pauseHintTimer;
      draggable.onHoverEnd = this.resetMovingHintTimer;
      this.addChild(draggable);

      draggable.setTarget(this.target);
      this.horizontalStack.addObject(draggable);
    });

    this.horizontalStack.positon.set(400, 700);
    this.horizontalStack.reposition(true, true);
    this.containerStack.positon.set(400, 700);
    this.containerStack.reposition(true, true);
    this.target.position.set(400, 300);

    this.resetIdleHintTimer();
  }

  public navIn = () => {

    this.containers[0].animateAppear().wait(600);
    this.containers[1].animateAppear().wait(500);
    this.containers[2].animateAppear().wait(700);
    this.target.animateAppear().wait(300);
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 50;
    this.restartButton.position.set(e.innerBounds.right - 100, e.innerBounds.top + 30);
  }

  private resetScene = () => {
    this.navForward(new DragOptionContaineredUI(), this.previousUI);
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
    JMTweenEffect.Pop(this.containers[0].graphic);
    JMTweenEffect.Pop(this.target.graphic, 1.15).wait(150);
    this.resetIdleHintTimer();
  }

  private runMovingHint = () => {
    JMTweenEffect.Pop(this.target, 1.15);

    this.resetMovingHintTimer();
  }
}
