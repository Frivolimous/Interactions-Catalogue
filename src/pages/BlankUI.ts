import * as PIXI from 'pixi.js';
import { BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { IResizeEvent } from '../services/GameEvents';
import { Colors } from '../data/Colors';

export class BlankUI extends BaseUI {
  private title: PIXI.Text;

  constructor() {
    super({bgColor: Colors.BACKGROUND});
    this.title = new PIXI.Text('Blank Page (WIP)', { fontSize: 30, fontFamily: Fonts.UI, fill: Colors.TEXT });
    this.addChild(this.title);
  }

  public positionElements = (e: IResizeEvent) => {
    this.title.x = (e.innerBounds.width - this.title.width) / 2;
    this.title.y = 50;
  }
}
