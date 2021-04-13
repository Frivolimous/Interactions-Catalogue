import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { GameEvents, IResizeEvent } from '../services/GameEvents';
import { Colors } from '../data/Colors';
import { DraggableGraphics } from '../components/draggables/DraggableGraphics';
import { Button } from '../components/ui/Button';
import { JMTweenEffect } from '../services/JMTweenEffects';
import { DraggableTarget } from '../components/draggables/DraggableTarget';
import { TappableGraphics } from '../components/tappables/TappableGraphics';
import { Gauge } from '../components/Gauge';
import { PassiveScroller } from '../components/PassiveScroller';

export class TapRepeatedlyUI extends BaseUI {
  private title: PIXI.Text;
  private restartButton: Button;

  private hintTimeout: number;

  private button: TappableGraphics;
  private speedGauge: Gauge;
  private progressGauge: PassiveScroller;

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Tap Repeatedly', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.restartButton = new Button({label: 'Restart', onClick: this.resetScene, width: 50, height: 30});
    this.addChild(this.title, this.restartButton);

    this.button = new TappableGraphics('rectangle400', 50, Colors.OPTIONS[1]);
    this.speedGauge = new Gauge(50, 15, Colors.TARGET, Colors.TARGETS[0]);
    this.progressGauge = new PassiveScroller(400, 15, Colors.TARGETS[0]);

    this.button.onTap = this.buttonPress;
    this.speedGauge.startDrain(0.005);
    this.speedGauge.rotation = -Math.PI / 2;

    this.addChild(this.speedGauge, this.progressGauge, this.button);

    this.resetHintTimer();
  }
  public navIn = () => {
    this.button.animateAppear().wait(300);
    GameEvents.ticker.add(this.onTick);
  }

  public navOut = () => {
    GameEvents.ticker.remove(this.onTick);
  }

  public onTick = () => {
    this.progressGauge.percent += this.speedGauge.percent * 0.01;
    if (this.progressGauge.percent >= 1) {
      this.completeInteraction();
    }
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 20;
    this.restartButton.position.set(e.innerBounds.right - 100, e.innerBounds.top + 30);

    this.progressGauge.position.set(e.innerBounds.width / 2, e.innerBounds.height / 3);
    this.speedGauge.position.set(e.innerBounds.width - 150, e.innerBounds.height * 5 / 6);
    this.button.position.set(e.innerBounds.width / 2, e.innerBounds.height * 5 / 6);
  }

  private resetScene = () => {
    this.navForward(new TapRepeatedlyUI(), this.previousUI);
  }

  private buttonPress = () => {
    // this.button.interactionCompleteEffect();
    this.button.pressEffect();
    this.speedGauge.percent += 0.1;

    this.resetHintTimer();
  }

  private completeInteraction = () => {
    this.button.interactionCompleteEffect();
    // this.speedGauge.startDrain(0);
    this.pauseHintTimer();
    GameEvents.ticker.remove(this.onTick);
  }

  private resetHintTimer = () => {
    this.hintTimeout && window.clearTimeout(this.hintTimeout);

    this.hintTimeout = window.setTimeout(this.runIdleHint, 3000);
  }

  private pauseHintTimer = () => {
    this.hintTimeout && window.clearTimeout(this.hintTimeout);
    this.hintTimeout = null;
  }

  private runIdleHint = () => {
    if (!this.button.exists) return;

    this.button.hintEffect(1.05);

    this.resetHintTimer();
  }
}
