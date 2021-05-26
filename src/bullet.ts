import * as TWEEN from '@tweenjs/tween.js';
import DisplayObject from "./DisplayObject";
import DisplayObjectPool from "./DisplayObjectPool";
import { HitLetter } from './hitLetter';
import HitLetterGame from "./HitLetterGame";

export class Bullet extends DisplayObject {
  bulletManager: BulletManager;

  constructor(bulletManager: BulletManager) {
    super();
    this.bulletManager = bulletManager;
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

  shot(target: HitLetter) {
    this.appear();
    const tween = new TWEEN.Tween(this)
    .to({ y: 0 }, 250)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(() => {
      if (this.y <= target.y + target.height) {
        this.disappear();
        target.isHit = true;
        this.bulletManager.recycle(this);
        tween.stop();
      }
    })
    .onComplete(() => {
      this.disappear();
      this.bulletManager.recycle(this);
    })
    .start();
  }
}

export class BulletManager {
  private game: HitLetterGame;
  private pool: DisplayObjectPool<Bullet> = new DisplayObjectPool(50, () => new Bullet(this));
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
    const index = this.bullets.findIndex((b) => b == bullet);
    this.bullets.splice(index, 1);
    this.pool.add(bullet);
  }
}