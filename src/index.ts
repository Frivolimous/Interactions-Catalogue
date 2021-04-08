import * as PIXI from 'pixi.js';
import * as _ from 'lodash';
import { MenuUI } from './pages/MenuUI';
import { CONFIG } from './Config';
import { TooltipReader } from './components/tooltip/TooltipReader';
import { JMRect } from './JMGE/others/JMRect';
import { Fonts } from './data/Fonts';
import { TextureCache } from './services/TextureCache';
import { GameEvents, IResizeEvent } from './services/GameEvents';
import { BaseUI, IFadeTiming, dFadeTiming } from './pages/_BaseUI';
import { ScreenCover } from './JMGE/effects/ScreenCover';
import { Navbar, UIReferences } from './pages/_Navbar';
import { TextureData } from './data/TextureData';
import { FontLoader } from './services/FontLoader';
import { DragTargetUI } from './pages/DragTargetUI';
import { BlankUI } from './pages/BlankUI';
import { TestUI } from './pages/TestUI';

export let interactionMode: 'desktop'|'mobile' = 'desktop';

export let Facade = new class FacadeInner {
  private static exists = false;

  public app: PIXI.Application;
  public stageBorders: JMRect;
  public innerBorders: JMRect;
  public screen: PIXI.Container;
  public border: PIXI.Graphics;

  private element: HTMLCanvasElement;
  private previousResize: IResizeEvent;
  private currentPage: BaseUI;

  constructor() {
    if (FacadeInner.exists) throw new Error('Cannot instatiate more than one Facade Singleton.');
    FacadeInner.exists = true;
    try {
      document.createEvent('TouchEvent');
      interactionMode = 'mobile';
    } catch (e) {

    }

    let border = this.queryURLParameter('border');
    let navbar = this.queryURLParameter('navbar');
    if (border && border === 'TRUE') {
      CONFIG.INIT.BORDER = true;
    }
    if (navbar && navbar === 'TRUE') {
      CONFIG.INIT.NAVBAR = true;
    }

    // Setup PIXI
    this.element = document.getElementById('game-canvas') as HTMLCanvasElement;

    this.app = new PIXI.Application({
      backgroundColor: 0x770000,
      antialias: true,
      resolution: CONFIG.INIT.RESOLUTION,
      width: this.element.offsetWidth,
      height: this.element.offsetHeight,

    });
    this.element.append(this.app.view);

    this.app.stage.scale.x = 1 / CONFIG.INIT.RESOLUTION;
    this.app.stage.scale.y = 1 / CONFIG.INIT.RESOLUTION;

    this.app.stage.interactive = true;
    this.screen = new PIXI.Container();
    this.app.stage.addChild(this.screen);
    if (CONFIG.INIT.BORDER) {
      this.border = new PIXI.Graphics();
      this.border.lineStyle(3, 0xff00ff).drawRect(0, 0, CONFIG.INIT.SCREEN_WIDTH, CONFIG.INIT.SCREEN_HEIGHT);
      this.app.stage.addChild(this.border);
    }

    this.stageBorders = new JMRect();
    this.innerBorders = new JMRect(0, 0, CONFIG.STAGE.SCREEN_WIDTH, CONFIG.STAGE.SCREEN_HEIGHT);

    // Initialize Libraries
    new TooltipReader(this.screen, this.stageBorders, {});
    TextureCache.initialize(this.app);
    // TextureData.backgrounds.forEach((bg, i) => TextureCache.addTextureBackgrounds(i, bg));
    // TextureData.paralax.forEach((para, i) => TextureCache.addTextureParalax(i, para));

    // Resize Event (for full screen mode / scaling)
    let finishResize = _.debounce(this.finishResize, 500);
    window.addEventListener('resize', finishResize);

    let fonts: string[] = _.map(Fonts);

    // load fonts then preloader!
    // GameEvents.APP_LOG.publish({type: 'INITIALIZE', text: 'Primary Setup'});
    console.log('INITIALIZE: Setup');
    window.requestAnimationFrame(() => FontLoader.load(fonts).then(this.init));
  }

  public init = () => {
    // this will happen after 'preloader'
    // GameEvents.APP_LOG.publish({type: 'INITIALIZE', text: 'Post-Loader'});
    console.log('INITIALIZE: Ready');

    let startingPage = this.queryURLParameter('page');
    let ref = _.find(UIReferences, {query: startingPage});
    if (ref) {
      this.currentPage = new ref.class();
    } else {
      this.currentPage = new MenuUI();
    }

    this.screen.addChild(this.currentPage);
    this.currentPage.navIn();

    if (CONFIG.INIT.NAVBAR) {
      let navbar = new Navbar();
      this.screen.addChild(navbar);
    }

    this.finishResize();
  }

  public setCurrentPage(nextPage: BaseUI, fadeTiming?: IFadeTiming, andDestroy?: boolean) {
    fadeTiming = _.defaults(fadeTiming || {}, dFadeTiming);

    let screen = new ScreenCover(this.previousResize.outerBounds, fadeTiming.color).onFadeComplete(() => {
      this.currentPage.navOut();
      this.screen.removeChild(this.currentPage);
      if (andDestroy) this.currentPage.destroy();

      this.currentPage = nextPage;
      this.screen.addChildAt(nextPage, 0);
      nextPage.navIn();
      if (this.previousResize) {
        nextPage.onResize(this.previousResize);
      }
      let screen2 = new ScreenCover(this.previousResize.outerBounds, fadeTiming.color).fadeOut(fadeTiming.fadeOut);
      nextPage.addChild(screen2);
    }).fadeIn(fadeTiming.fadeIn, fadeTiming.delay, fadeTiming.delayBlank);
    this.screen.addChild(screen);
  }

  private finishResize = () => {
    // resize event
    let viewWidth = this.element.offsetWidth;
    let viewHeight = this.element.offsetHeight;
    this.app.view.width = viewWidth;
    this.app.view.height = viewHeight;

    let innerWidth = CONFIG.STAGE.SCREEN_WIDTH;
    let innerHeight = CONFIG.STAGE.SCREEN_HEIGHT;
    let scale = Math.min(viewWidth / innerWidth, viewHeight / innerHeight);
    this.screen.scale.set(scale);
    this.screen.x = (viewWidth - innerWidth * scale) / 2;
    this.screen.y = (viewHeight - innerHeight * scale) / 2;
    this.stageBorders.set(0 - this.screen.x / scale, 0 - this.screen.y / scale, viewWidth / scale, viewHeight / scale);

    // to show border (for sizing / spacing tests)
    if (this.border) {
      this.border.clear();
      this.border.lineStyle(10, 0xff00ff);
      this.border.drawShape(this.stageBorders);
      this.border.lineStyle(3, 0x00ffff);
      this.border.drawShape(this.innerBorders);
      this.border.scale.set(scale);
      this.border.position.set(this.screen.x, this.screen.y);
    }

    this.previousResize = {outerBounds: this.stageBorders, innerBounds: this.innerBorders};

    GameEvents.WINDOW_RESIZE.publish(this.previousResize);
  }

  private queryURLParameter(name: string, url: string = window.location.href) {
      name = name.replace(/[\[\]]/g, '\\$&');
      let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
      let results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
}();
