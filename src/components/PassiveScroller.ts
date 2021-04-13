import * as PIXI from 'pixi.js';
import { Colors } from '../data/Colors';

export class PassiveScroller extends PIXI.Container {
    public background = new PIXI.Graphics();
    public mover = new PIXI.Graphics();
    public left: number;

    constructor(private length: number, size: number, color: number) {
        super();
        this.left = -length / 2;

        this.addChild(this.background, this.mover);

        this.drawBackground(length);
        this.drawMover(size, color);

        this.mover.position.set(this.left, 0);
    }

    public get percent(): number {
        return (this.mover.x - this.left) / this.length;
    }

    public set percent(n: number) {
        this.mover.x = this.left + this.length * Math.min(Math.max(n, 0), 1);
    }

    private drawBackground(length: number) {
        this.background.clear().lineStyle(2, Colors.OUTLINE).moveTo(-length / 2, 0).lineTo(length / 2, 0);
    }

    private drawMover(size: number, color: number) {
        this.mover.clear().beginFill(color).lineStyle(1, Colors.OUTLINE).drawCircle(0, 0, size);
    }
}
