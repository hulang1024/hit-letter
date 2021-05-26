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

  shot(target?: HitLetter) {
    if (target) {
      this.x = target.x + (target.width - this.width) / 2;
    }
    setTimeout(() => {
      const bullet = this.bulletManager.createBullet();
      bullet.x = this.x + (this.width - bullet.width) / 2;
      bullet.y = this.y - bullet.height;
      bullet.shot(target);
    }, target ? 120 : 0);
  }
}
