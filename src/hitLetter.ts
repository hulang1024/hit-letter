import DisplayObject from "./DisplayObject";
import DisplayObjectPool from "./DisplayObjectPool";
import HitLetterGame from "./HitLetterGame";
import { randomInt } from "./utils";

const letterChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class HitLetter extends DisplayObject {
  _char: string;
  get char() { return this._char; }
  set char(char: string) {
    this._char = char;
    this.el.innerText = char;
  }

  speedY: number; // y的速度
  accel: number; // 加速度
  isHit: boolean;

  constructor() {
    super();
    this.el.classList.add('hit-letter');
  }

  appear() {
    this.el.style.display = 'flex';
    this.el.classList.remove('hit', 'disappear');
  }

  disappear() {
    this.el.classList.add(this.isHit ? 'hit' : 'disappear');
    setTimeout(() => {
      this.el.style.display = 'none';
    }, 220);
  }

  onUpdate(dt: number) {
    // 更新加速度
    this.speedY += this.accel * dt;
    // 更新y的位置
    this.y = this.y + this.speedY * dt;
  }
}

export class HitLetterManager {
  private game: HitLetterGame;
  private pool: DisplayObjectPool<HitLetter> = new DisplayObjectPool(100, () => new HitLetter());
  private hitLetters: HitLetter[] = [];

  constructor(game: HitLetterGame) {
    this.game = game;
  }

  createHitLetter() {
    const hitLetter = this.pool.get();
    if (!hitLetter) {
      return null;
    }

    hitLetter.width = 30;
    hitLetter.height = 30;
    hitLetter.x = randomInt(0, this.game.stageWidth - hitLetter.width);
    hitLetter.y = -hitLetter.height;
    hitLetter.speedY = 100;
    hitLetter.accel = 18;
    hitLetter.isHit = false;
    hitLetter.char = letterChars[randomInt(0, 26)];
    hitLetter.appear();

    this.hitLetters.push(hitLetter);
    this.game.stage.appendChild(hitLetter.el);

    return hitLetter;
  }

  count() {
    return this.hitLetters.length;
  }

  findHitLetterByChar(char: string) {
    const index = this.hitLetters.findIndex((l) => l.char == char);
    return index > -1 ? this.hitLetters[index] : null;
  }

  onUpdate(dt: number) {
    this.hitLetters.forEach((hitLetter, index) => {
      hitLetter.onUpdate(dt);
      let isExpired = false;
      if (hitLetter.isHit) {
        isExpired = true;
      } else if (hitLetter.y >= this.game.stageHeight - hitLetter.height) {
        isExpired = true;
      } else if (hitLetter.y >= this.game.fort.y - hitLetter.height) {
        if (this.game.fort.isCollision(hitLetter)) {
          isExpired = true;
        }
      }

      if (isExpired) {
        hitLetter.disappear();
        this.hitLetters.splice(index, 1);
        this.pool.add(hitLetter);
      }
    });
  }
}