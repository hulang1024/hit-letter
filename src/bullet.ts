import DisplayObject from "./DisplayObject";
import DisplayObjectPool from "./DisplayObjectPool";
import HitLetterGame from "./HitLetterGame";

export class Bullet extends DisplayObject {
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
    const index = this.bullets.findIndex((b) => b == bullet);
    this.bullets.splice(index, 1);
    this.pool.add(bullet);
  }
}