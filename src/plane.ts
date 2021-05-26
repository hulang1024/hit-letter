import * as TWEEN from '@tweenjs/tween.js';
import { BulletManager } from './bullet';
import DisplayObject from "./DisplayObject";
import { HitLetter } from "./hitLetter";

export class Plane extends DisplayObject {
  bulletManager: BulletManager;

  constructor() {
    super();
    this.el.classList.add('plane');
    this.width = 30;
    this.height = 30;
  }

  attack(target: HitLetter) {
    this.x = target.x + (target.width - this.width) / 2;
    const bullet = this.bulletManager.createBullet();
    bullet.x = this.x + (this.width - bullet.width) / 2;
    bullet.y = this.y - bullet.height;
    bullet.appear();

    const tween = new TWEEN.Tween(bullet)
      .to({ y: 0 }, 400)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(() => {
        if (bullet.y <= target.y + target.height) {
          bullet.disappear();
          target.isHit = true;
          this.bulletManager.recycle(bullet);
          tween.stop();
        }
      })
      .onComplete(() => {
        bullet.disappear();
        this.bulletManager.recycle(bullet);
      })
      .start();
  }
}
