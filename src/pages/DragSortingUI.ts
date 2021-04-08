import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { Colors } from '../data/Colors';
import { DraggableGraphics } from '../components/draggables/DraggableGraphics';
import { Button } from '../components/ui/Button';
import { JMTweenEffect } from '../services/JMTweenEffects';
import { DraggableTarget } from '../components/draggables/DraggableTarget';

export class DragSortingUI extends BaseUI {
  private title: PIXI.Text;
  private restartButton: Button;

  private hintTimeout: number;

  private draggable: DraggableGraphics;
  private targets: DraggableTarget[] = [];

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Drag Sorting', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.restartButton = new Button({label: 'Restart', onClick: this.resetScene, width: 50, height: 30});
    this.addChild(this.title, this.restartButton);

    this.targets = [
      new DraggableTarget('square', 150, Colors.TARGETS[1], this.background),
      new DraggableTarget('square', 150, Colors.TARGETS[0], this.background),
      new DraggableTarget('square', 150, Colors.TARGETS[2], this.background),
    ];

    this.draggable = new DraggableGraphics('square', 70, Colors.OPTIONS[0], this.background);
    this.draggable.onInteractionStart = this.resetMovingHintTimer;
    this.draggable.onInteractionEnd = this.resetIdleHintTimer;
    this.draggable.onHoverStart = this.pauseHintTimer;
    this.draggable.onHoverEnd = this.resetMovingHintTimer;

    this.addChild(this.targets[0], this.targets[1], this.targets[2], this.draggable);

    this.draggable.setTarget(this.targets[1]);
    this.draggable.addIncorrectTarget(this.targets[0]);
    this.draggable.addIncorrectTarget(this.targets[2]);

    this.draggable.setStartingPosition(400, 200);
    this.targets[0].position.set(200, 600);
    this.targets[1].position.set(400, 600);
    this.targets[2].position.set(600, 600);

    this.resetIdleHintTimer();
  }
  public navIn = () => {

    this.draggable.animateAppear().wait(300);
    this.targets[0].animateAppear().wait(600);
    this.targets[1].animateAppear().wait(500);
    this.targets[2].animateAppear().wait(700);
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 50;
    this.restartButton.position.set(e.innerBounds.right - 100, e.innerBounds.top + 30);
  }

  private resetScene = () => {
    this.navForward(new DragSortingUI(), this.previousUI);
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
    JMTweenEffect.Pop(this.targets[1].graphic, 1.15).wait(300);

    this.resetIdleHintTimer();
  }

  private runMovingHint = () => {
    JMTweenEffect.Pop(this.targets[1], 1.15);

    this.resetMovingHintTimer();
  }
}
