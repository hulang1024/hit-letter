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
  maxY: number;
  isHit: boolean;
  isExpired: boolean;

  constructor() {
    super();
    this.el.classList.add('hit-letter');
  }

  appear() {
    this.el.classList.remove('hit', 'disappear');
  }

  disappear() {
    this.el.classList.add(this.isHit ? 'hit' : 'disappear');
  }

  onUpdate(dt: number) {
    // 如果还没落到底部
    if (this.isHit || this.y >= this.maxY) {
      this.isExpired = true;
      this.disappear();
    } else {
      // 更新加速度
      this.speedY += this.accel * dt;
      // 更新y的位置
      this.y = Math.min(this.y + this.speedY * dt, this.maxY);
    }
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
    hitLetter.speedY = 2;
    hitLetter.accel = 18;
    hitLetter.maxY = this.game.stageHeight - 40 - hitLetter.height;
    hitLetter.isHit = false;
    hitLetter.isExpired = false;
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
      if (hitLetter.isExpired) {
        this.hitLetters.splice(index, 1);
        this.pool.add(hitLetter);
      }
    });
  }
}