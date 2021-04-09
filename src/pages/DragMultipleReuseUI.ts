import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { Colors } from '../data/Colors';
import { DraggableGraphicsPlaceable } from '../components/draggables/DraggableGraphicsPlaceable';
import { Button } from '../components/ui/Button';
import { JMTweenEffect } from '../services/JMTweenEffects';
import { DraggableTarget } from '../components/draggables/DraggableTarget';

export class DragMultipleReuseUI extends BaseUI {
  private title: PIXI.Text;
  private restartButton: Button;

  private hintTimeout: number;

  private draggables: DraggableGraphicsPlaceable[] = [];
  private targets: DraggableTarget[] = [];

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Drag Multiple Reuse', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.restartButton = new Button({label: 'Restart', onClick: this.resetScene, width: 50, height: 30});
    this.addChild(this.title, this.restartButton);

    this.targets.push(new DraggableTarget('square', 150, Colors.TARGET));
    this.targets.push(new DraggableTarget('square', 150, Colors.TARGET));
    this.targets.push(new DraggableTarget('square', 150, Colors.TARGET));
    this.addChild(this.targets[0], this.targets[1], this.targets[2]);

    this.draggables.push(new DraggableGraphicsPlaceable('square', 70, Colors.OPTIONS[0], this.background));
    this.draggables.push(new DraggableGraphicsPlaceable('square', 70, Colors.OPTIONS[1], this.background));
    this.draggables.push(new DraggableGraphicsPlaceable('square', 70, Colors.OPTIONS[2], this.background));
    this.draggables.forEach(draggable => {
      draggable.onInteractionStart = this.resetMovingHintTimer;
      draggable.onInteractionEnd = this.resetIdleHintTimer;
      draggable.onHoverStart = this.pauseHintTimer;
      draggable.onHoverEnd = this.resetMovingHintTimer;
      this.addChild(draggable);

      draggable.addTargets(this.targets);
    });

    this.draggables[0].setStartingPosition(150, 300);
    this.draggables[1].setStartingPosition(400, 200);
    this.draggables[2].setStartingPosition(650, 300);
    this.targets[0].position.set(200, 600);
    this.targets[1].position.set(400, 600);
    this.targets[2].position.set(600, 600);

    this.resetIdleHintTimer();
  }
  public navIn = () => {

    this.draggables[0].animateAppear().wait(400);
    this.draggables[1].animateAppear().wait(300);
    this.draggables[2].animateAppear().wait(500);
    this.targets[0].animateAppear().wait(900);
    this.targets[1].animateAppear().wait(1100);
    this.targets[2].animateAppear().wait(1000);
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 50;
    this.restartButton.position.set(e.innerBounds.right - 100, e.innerBounds.top + 30);
  }

  private resetScene = () => {
    this.navForward(new DragMultipleReuseUI(), this.previousUI);
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
    // let draggable = this.draggables.find(obj => obj.exists);

    // if (draggable) {
    //   JMTweenEffect.Pop(draggable.graphic);
    //   JMTweenEffect.Pop(this.targets[0].graphic, 1.15).wait(150);
    //   this.resetIdleHintTimer();
    // }
  }

  private runMovingHint = () => {
    // JMTweenEffect.Pop(this.targets[0], 1.15);

    this.resetMovingHintTimer();
  }
}
