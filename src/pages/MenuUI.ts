import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Button } from '../components/ui/Button';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { StringData } from '../data/StringData';
import { JMTween } from '../JMGE/JMTween';
import { AssetLoader } from '../services/AssetLoader';
import { DragonSpriteBasic } from '../components/DragonAvatar/DragonSpriteBasic';
import { TooltipReader } from '../components/tooltip/TooltipReader';
import { BlankUI } from './BlankUI';
import { Colors } from '../data/Colors';

export class MenuUI extends BaseUI {
  private title: PIXI.Text;

  private startB: Button;

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Interactions Catalogue', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.addChild(this.title);

    this.startB = new Button({ width: 100, height: 30, label: 'Start', onClick: this.startGame });
    this.startB.position.set(150, 200);
    this.addChild(this.startB);

    TooltipReader.addTooltip(this.startB, {title: 'NON-FUNCTIONAL', description: 'This button currently goes nowhere'});
  }

  public navIn = () => {
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 50;
  }

  private startGame = () => {
    this.navForward(new BlankUI());
  }
}
