import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { Colors } from '../data/Colors';
import { Button } from '../components/ui/Button';
import { JMTweenEffect } from '../services/JMTweenEffects';
import { DraggableTargetProgressive } from '../components/draggables/DraggableTargetProgressive';
import { Firework } from '../JMGE/effects/Firework';
import { DraggableGraphicsPhysics } from '../components/draggables/DraggableGraphicsPhysics';

export class DragFollowUI extends BaseUI {
  private title: PIXI.Text;
  private restartButton: Button;

  private draggable: DraggableGraphicsPhysics;

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Drag Follow', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.restartButton = new Button({label: 'Restart', onClick: this.resetScene, width: 50, height: 30});
    this.addChild(this.title, this.restartButton);

    this.draggable = new DraggableGraphicsPhysics('square', 70, Colors.OPTIONS[0], this.background);

    this.addChild(this.draggable);
    this.draggable.position.set(400, 400);

  }
  public navIn = () => {

    this.draggable.animateAppear().wait(300);
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 50;
    this.restartButton.position.set(e.innerBounds.right - 100, e.innerBounds.top + 30);
  }

  private resetScene = () => {
    this.navForward(new DragFollowUI(), this.previousUI);
  }
}
