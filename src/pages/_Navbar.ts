import * as PIXI from 'pixi.js';
import { GameEvents, IResizeEvent } from '../services/GameEvents';
import { IBaseUI, BaseUI } from './_BaseUI';
import { Fonts } from '../data/Fonts';
import { Colors } from '../data/Colors';
import { MenuUI } from './MenuUI';
import { Facade } from '../index';
import { BlankUI } from './BlankUI';
import { TestUI } from './TestUI';
import { DragTargetUI } from './DragTargetUI';
import { DragSortingUI } from './DragSortingUI';
import { DragAllTargetUI } from './DragAllTargetUI';
import { DragOptionInexhaustibleUI } from './DragOptionInexhaustibleUI';
import { DragOptionSingleUI } from './DragOptionSingleUI';

export const UIReferences: {name: string, query: string, class: any}[] = [
  {name: 'Main Menu', query: 'menu', class: MenuUI},
  {name: 'Testing', query: 'test', class: TestUI},
  {name: 'Drag Target', query: 'drag-target', class: DragTargetUI},
  {name: 'Drag Sorting', query: 'drag-sorting', class: DragSortingUI},
  {name: 'Drag All Target', query: 'drag-all-target', class: DragAllTargetUI },
  {name: 'Drag Option: Inexhaustible', query: 'drag-option-inexhaustible', class: DragOptionInexhaustibleUI },
  {name: 'Drag Option: Single Use', query: 'drag-option-single', class: DragOptionSingleUI },
  {name: 'Nowhere', query: 'blank', class: BlankUI},
];
export class Navbar extends PIXI.Container {
  private background = new PIXI.Graphics();
  private contents: PIXI.Container[] = [];

  constructor() {
    super();
    GameEvents.WINDOW_RESIZE.addListener(this.onResize);
    this.addChild(this.background);
    UIReferences.forEach(ref => {
      this.addContent(ref.name, ref.class);
    });
  }

  private addContent(title: string, PageConstructor: typeof BaseUI, nowhere: boolean = null) {
    let content = new PIXI.Text(title, {fontFamily: Fonts.UI, fill: nowhere ? 0xff7777 : nowhere === false ? 0xaaaa77 : 0xffffff, fontSize: 20});
    this.addChild(content);
    this.contents.push(content);
    content.interactive = true;
    content.buttonMode = true;

    content.addListener('pointerdown', () => {
      let page = new PageConstructor();
      Facade.setCurrentPage(page, null, true);
    });

    if (nowhere === null) {
      content.addListener('pointerover', () => content.tint = 0x00ffff);
      content.addListener('pointerout', () => content.tint = 0xffffff);
    }
  }

  private onResize = (e: IResizeEvent) => {
    let bounds = new PIXI.Rectangle(0, 0, e.innerBounds.x - e.outerBounds.x, e.outerBounds.height);
    this.background.clear().beginFill(0x333333, 0.8).drawShape(bounds);
    this.position.set(e.outerBounds.x, e.outerBounds.y);

    let top = 20;
    let left = 20;
    let inc = 30;

    for (let i = 0; i < this.contents.length; i++) {
      this.contents[i].position.set(left, top + i * inc);
    }
  }
}
