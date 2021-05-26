import * as TWEEN from '@tweenjs/tween.js';
import DisplayObject from "./DisplayObject";
import DisplayObjectPool from "./DisplayObjectPool";
import { HitLetter } from "./hitLetter";
import HitLetterGame from "./HitLetterGame";

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
    bullet.isExpired = false;
    bullet.appear();

    const tween = new TWEEN.Tween(bullet)
      .to({ y: 0 }, 400)
      .easing(TWEEN.Easing.Cubic.Out)
      .onUpdate(() => {
        if (bullet.y <= target.y + target.height) {
          bullet.isExpired = true;
          this.bulletManager.recycle(bullet);
          target.isHit = true;
          bullet.disappear();
          tween.stop();
        }
      })
      .start();
  }
}

export class Bullet extends DisplayObject {
  isExpired: boolean;

  constructor() {
    super();
    this.el.classList.add('bullet');

    this.width = 14;
    this.height = 14;
  }

  appear() {
    this.el.classList.remove('disappear');
  }

  disappear() {
    this.el.classList.add('disappear');
  }
}

export class BulletManager {
  private game: HitLetterGame;
  private pool: DisplayObjectPool<Bullet> = new DisplayObjectPool(50, () => new Bullet());
  private bullets: Bullet[] = [];

  constructor(game: HitLetterGame) {
    this.game = game;
  }

  createBullet() {
    const bullet = this.pool.get();
    if (!bullet) {
      return null;
    }

    this.bullets.push(bullet);
    this.game.stage.appendChild(bullet.el);

    return bullet;
  }

  recycle(bullet: Bullet) {
    if (!bullet.isExpired) {
      return;
    }
    const index = this.bullets.findIndex((b) => b == bullet);
    this.bullets.splice(index, 1);
    this.pool.add(bullet);
  }
}