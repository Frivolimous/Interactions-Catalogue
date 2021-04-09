import * as PIXI from 'pixi.js';
import { Colors } from '../../data/Colors';
import { JMEasing, JMTween } from '../../JMGE/JMTween';

export class BasicGraphics extends PIXI.Container {
    public graphic: PIXI.Graphics = new PIXI.Graphics();

    constructor(shape: 'square' | 'circle', size: number, protected color: number) {
        super();
        this.addChild(this.graphic);
        this.graphic.beginFill(color).lineStyle(1, Colors.OUTLINE);

        if (shape === 'square') {
            this.graphic.drawRoundedRect(-size / 2, - size / 2, size, size, size / 5);
        } else {
            this.graphic.drawCircle(0, 0, size);
        }
    }

    public animateAppear() {
        this.scale.set(0, 0);
        return new JMTween(this.scale, 300).to({x: 1, y: 1}).easing(JMEasing.Back.Out).start();
    }
}
