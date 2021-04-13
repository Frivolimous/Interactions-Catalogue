import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { Colors } from '../data/Colors';
import { DraggableGraphics } from '../components/draggables/DraggableGraphics';
import { Button } from '../components/ui/Button';
import { JMTweenEffect } from '../services/JMTweenEffects';
import { DraggableTarget } from '../components/draggables/DraggableTarget';
import { TappableGraphics } from '../components/tappables/TappableGraphics';

export class TapObjectUI extends BaseUI {
  private title: PIXI.Text;
  private restartButton: Button;

  private hintTimeout: number;

  private button: TappableGraphics;

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Tap Object', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.restartButton = new Button({label: 'Restart', onClick: this.resetScene, width: 50, height: 30});
    this.addChild(this.title, this.restartButton);

    this.button = new TappableGraphics('square', 50, Colors.OPTIONS[0]);
    this.button.onTap = this.completeInteraction;

    this.addChild(this.button);

    this.resetHintTimer();
  }
  public navIn = () => {
    this.button.animateAppear().wait(300);
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 20;
    this.restartButton.position.set(e.innerBounds.right - 100, e.innerBounds.top + 30);

    this.button.position.set(e.innerBounds.width / 2, e.innerBounds.height / 2);
  }

  private resetScene = () => {
    this.navForward(new TapObjectUI(), this.previousUI);
  }

  private completeInteraction = () => {
    this.button.interactionCompleteEffect();
  }

  private resetHintTimer = () => {
    this.hintTimeout && window.clearTimeout(this.hintTimeout);

    this.hintTimeout = window.setTimeout(this.runIdleHint, 7000);
  }

  private pauseHintTimer = () => {
    this.hintTimeout && window.clearTimeout(this.hintTimeout);
    this.hintTimeout = null;
  }

  private runIdleHint = () => {
    if (!this.button.exists) return;

    this.button.hintEffect();

    this.resetHintTimer();
  }
}
