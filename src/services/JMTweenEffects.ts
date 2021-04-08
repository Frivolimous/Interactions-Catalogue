import * as PIXI from 'pixi.js';
import { JMEasing, JMTween } from '../JMGE/JMTween';

export class JMTweenEffect {
    public static Pop(object: PIXI.Container, scale = 1.3, duration = 800) {
        let tween = new JMTween(object.scale, duration / 2).to({x: scale, y: scale}).easing(JMEasing.Back.In);
        tween.chain(object.scale, duration / 2).to({x: 1, y: 1}).easing(JMEasing.Back.Out);
        tween.start();

        return tween;
    }

    public static ShrinkAndDisappear(object: PIXI.Container, onComplete: () => void = null) {
        let tween = new JMTween(object.scale, 300).to({x: 1.4, y: 1.4}).easing(JMEasing.Sinusoidal.Out);
        let tween2 = tween.chain(object.scale, 200).to({x: 0, y: 0});
        onComplete && tween2.onComplete(onComplete);
        tween.start();

        return tween;
    }

    public static ZipTo(object: PIXI.Container, target: PIXI.Point) {
        new JMTween(object, 300).to({x: target.x, y: target.y}).easing(JMEasing.Back.GentleOut).start();
        new JMTween(object.scale, 100).to({x: 0.9, y: 0.9}).easing(JMEasing.Quadratic.Out).start()
            .chain(object.scale, 200).wait(100).to({x: 1, y: 1}).easing(JMEasing.Back.ExageratedOut);
    }

    public static RespawnAt(object: PIXI.Container, target: PIXI.Point, delay = 300) {
        new JMTween(object, 500 + delay).to({x: target.x, y: target.y}).easing(JMEasing.Circular.InOut).start();
        new JMTween(object.scale, 300).to({x: 0, y: 0}).easing(JMEasing.Back.In).start().onComplete(() => {
            // ttween.stop();
            // object.position.set(target.x, target.y);
            new JMTween(object.scale, 200).wait(delay).to({x: 1, y: 1}).easing(JMEasing.Back.Out).start();
        });
    }
}
