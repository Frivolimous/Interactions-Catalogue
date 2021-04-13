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
import { BasicGraphics } from '../components/draggables/BasicGraphics';

export class TapMultipleChoiceUI extends BaseUI {
  private title: PIXI.Text;
  private restartButton: Button;

  private hintTimeout: number;

  private buttons: TappableGraphics[] = [];
  private target: BasicGraphics;

  private pressed = 0;

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Tap Multiple Choice', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.restartButton = new Button({label: 'Restart', onClick: this.resetScene, width: 50, height: 30});
    this.addChild(this.title, this.restartButton);

    this.target = new BasicGraphics('square', 100, Colors.TARGETS[0]);

    this.buttons.push(new TappableGraphics('square', 50, Colors.OPTIONS[0]));
    this.buttons.push(new TappableGraphics('square', 50, Colors.OPTIONS[1]));
    this.buttons.push(new TappableGraphics('square', 50, Colors.OPTIONS[2]));
    this.buttons[0].onTap = this.completeInteraction;
    this.buttons[1].onTap = this.incorrectInteraction;
    this.buttons[2].onTap = this.incorrectInteraction;

    this.addChild(this.target);
    this.addChild(this.buttons[0]);
    this.addChild(this.buttons[1]);
    this.addChild(this.buttons[2]);

    this.resetHintTimer();
  }
  public navIn = () => {
    this.buttons[0].animateAppear().wait(500);
    this.buttons[1].animateAppear().wait(300);
    this.buttons[2].animateAppear().wait(700);
    this.target.animateAppear().wait(1200);
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 20;
    this.restartButton.position.set(e.innerBounds.right - 100, e.innerBounds.top + 30);

    this.target.position.set(e.innerBounds.width / 2, e.innerBounds.height / 2.5);

    this.buttons[0].position.set(e.innerBounds.width / 2 - e.innerBounds.width / 6, e.innerBounds.height * 5 / 6);
    this.buttons[1].position.set(e.innerBounds.width / 2, e.innerBounds.height * 5 / 6);
    this.buttons[2].position.set(e.innerBounds.width / 2 + e.innerBounds.width / 6, e.innerBounds.height * 5 / 6);
  }

  private resetScene = () => {
    this.navForward(new TapMultipleChoiceUI(), this.previousUI);
  }

  private completeInteraction = (button: TappableGraphics) => {
    button.interactionCompleteEffect(500);
    this.buttons[1].exists && this.buttons[1].fadeEffect();
    this.buttons[2].exists && this.buttons[2].fadeEffect();
  }

  private incorrectInteraction = (button: TappableGraphics) => {
    button.incorrectFadeEffect();
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
    let first = this.buttons.find(button => button.exists);

    if (first) {
      first.hintEffect();

      this.resetHintTimer();
    }
  }
}
