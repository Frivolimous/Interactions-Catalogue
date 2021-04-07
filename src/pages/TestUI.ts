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

export class TestUI extends BaseUI {
  private title: PIXI.Text;

  constructor() {
    super({bgColor: 0x777777});

    AssetLoader.getBody('sheep', data => {
      let dragon = new DragonSpriteBasic(data);
      this.addChild(dragon.display);
      dragon.display.scale.set(0.5);
      dragon.display.position.set(500, 500);
      dragon.display.interactive = true;
      dragon.display.buttonMode = true;
      dragon.display.addListener('pointerdown', () => {
        dragon.nextAnim();
      });
      TooltipReader.addTooltip(dragon.display, {title: 'Sheep!!!', description: 'Tap to change the animation'});
    });

    let width = 50;
    let iconb = new PIXI.Graphics();
    let icon = new PIXI.Graphics();
    this.addChild(iconb, icon);
    iconb.beginFill(0x00ff00).lineStyle(2).drawCircle(width / 2, width / 2, width / 2);
    iconb.position.set(200, 200);
    icon.position.set(200, 200);
    iconb.interactive = true;
    iconb.buttonMode = true;
    iconb.addListener('pointerdown', e => {
      new JMTween({percent: 0}, 5000).to({percent: 1}).start().onUpdate(obj => {
        icon.clear().beginFill(0xff0000).lineStyle(2)
          .moveTo(width / 2, width / 2)
          // .lineTo(0, width / 2)
          .arc(width / 2, width / 2, width / 2, - Math.PI / 2, - Math.PI / 2 + Math.PI * 2 - Math.PI * 2 * obj.percent)
          .lineTo(width / 2, width / 2);
      });
    });

    TooltipReader.addTooltip(iconb, {title: 'Round Gauge', description: 'Tap to make this go round and round!'});
  }

  public navIn = () => {
  }

  public positionElements = (e: IResizeEvent) => {
  }
}
