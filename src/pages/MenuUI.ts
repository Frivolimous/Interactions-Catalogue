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

export class MenuUI extends BaseUI {
  private title: PIXI.Text;

  private startB: Button;
  private creditsB: Button;
  private langB: Button;

  constructor() {
    super({bgColor: 0x777777});
    this.title = new PIXI.Text(StringData.TITLE, { fontSize: 30, fontFamily: Fonts.UI, fill: 0x3333ff });
    this.addChild(this.title);

    this.startB = new Button({ width: 100, height: 30, label: 'Start', onClick: this.startGame });
    this.startB.position.set(150, 200);
    this.addChild(this.startB);

    TooltipReader.addTooltip(this.startB, {title: 'NON-FUNCTIONAL', description: 'This button currently goes nowhere'});

    // AssetLoader.getBody('sheep', data => {
    //   let dragon = new DragonSpriteBasic(data);
    //   this.addChild(dragon.display);
    //   dragon.display.scale.set(0.5);
    //   dragon.display.position.set(500, 500);
    //   window.addEventListener('keydown', (e) => {
    //     if (e.key === ' ') {
    //       dragon.nextAnim();
    //     }
    //   });
    // });

    // let width = 50;
    // let iconb = new PIXI.Graphics();
    // let icon = new PIXI.Graphics();
    // this.addChild(iconb, icon);
    // iconb.beginFill(0x00ff00).lineStyle(2).drawCircle(width / 2, width / 2, width / 2);
    // iconb.position.set(200, 200);
    // icon.position.set(200, 200);

    // window.addEventListener('keydown', e => {
    //   if (e.key === 'e') {
    //     new JMTween({percent: 0}, 5000).to({percent: 1}).start().onUpdate(obj => {
    //       icon.clear().beginFill(0xff0000).lineStyle(2)
    //         .moveTo(width / 2, width / 2)
    //         // .lineTo(0, width / 2)
    //         .arc(width / 2, width / 2, width / 2, - Math.PI / 2, - Math.PI / 2 + Math.PI * 2 - Math.PI * 2 * obj.percent)
    //         .lineTo(width / 2, width / 2);
    //     });
    //   }
    // });
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
