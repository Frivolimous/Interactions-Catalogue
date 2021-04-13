import * as PIXI from 'pixi.js';
import { Colors } from '../data/Colors';
import { GameEvents } from '../services/GameEvents';

export class Gauge extends PIXI.Container {
    public background = new PIXI.Graphics();
    public foreground = new PIXI.Graphics();
    public left: number;
    public rounding: number;

    private draining: number = 0;
    private _percent: number = 0;

    constructor(private length: number, private size: number, private colorBack: number, private color: number) {
        super();
        this.left = -length / 2;
        this.rounding = size / 5;

        this.addChild(this.background, this.foreground);

        this.drawBackground();
        this.drawMover(0);
    }

    public get percent(): number {
        return this._percent;
    }

    public set percent(n: number) {
        this._percent = Math.min(Math.max(n, 0), 1);
        this.drawMover(this._percent);
    }

    public startDrain(amount: number) {
        if (amount > 0) {
            this.draining = amount;
            GameEvents.ticker.add(this.drainOnTick);
        } else if (this.draining > 0) {
            this.draining = 0;
            GameEvents.ticker.remove(this.drainOnTick);
        }
    }

    public drainOnTick = () => {
        this.percent = this.percent - this.draining;
        // this.percent -= this.draining;
    }

    public destroy() {
        if (this.draining) {
            GameEvents.ticker.remove(this.drainOnTick);
        }
        super.destroy();
    }

    private drawBackground() {
        this.background.clear().beginFill(this.colorBack).lineStyle(1, Colors.OUTLINE).drawRoundedRect(this.left, -this.size / 2, this.length, this.size, this.rounding);
    }

    private drawMover(percent: number) {
        let length = this.rounding * 2 + percent * (this.length - this.rounding * 2);
        this.foreground.clear().beginFill(this.color).lineStyle(1, Colors.OUTLINE).drawRoundedRect(this.left, -this.size / 2, length, this.size, this.rounding);
    }
}
