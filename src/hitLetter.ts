import DisplayObject from "./DisplayObject";
import HitLetterGame from "./HitLetterGame";
import { randomInt } from "./utils";

const letterChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export class HitLetter extends DisplayObject {
  char: string;
  speedY: number; // y的速度
  accel: number; // 加速度
  isHit: boolean = false;

  show() {
    this.el.classList.remove('hit', 'disappear');
  }

  disappear(isHit: boolean) {
    this.el.classList.add(isHit ? 'hit' : 'disappear');
  }
}

class HitLetterPool {
  private objects: HitLetter[] = [];

  constructor(initalSize: number) {
    for (let i = 0; i < initalSize; i++) {
      this.objects.push(new HitLetter());
    }
  }

  get() {
    return this.objects.shift();
  }

  add(object: HitLetter) {
    this.objects.push(object);
  }
}

export class HitLetterManager {
  private game: HitLetterGame;
  private pool: HitLetterPool = new HitLetterPool(50);
  private hitLetters: HitLetter[] = [];

  constructor(game: HitLetterGame) {
    this.game = game;
  }

  create() {
    const hitLetter = this.pool.get();
    hitLetter.height = 30;
    hitLetter.width = 30;
    hitLetter.x = randomInt(0, this.game.stageWidth - hitLetter.width);
    hitLetter.y = -randomInt(0, hitLetter.height);
    hitLetter.speedY = 2;
    hitLetter.accel = 15;
    hitLetter.isHit = false;
    hitLetter.el.classList.add('hit-letter');
    hitLetter.char = letterChars[randomInt(0, 26)];
    hitLetter.el.innerText = hitLetter.char;
    hitLetter.show();

    this.hitLetters.push(hitLetter);
  
    this.game.stage.appendChild(hitLetter.el);

    return hitLetter;
  }

  count() {
    return this.hitLetters.length;
  }

  deleteByChar(char: string) {
    const index = this.hitLetters.findIndex((l) => l.char == char);
    const hitLetter = this.hitLetters[index];
    hitLetter.isHit = true;
  }

  onUpdate(dt: number) {
    this.hitLetters.forEach((o, index) => {
      // 如果还没落到底部
      if (o.y >= (this.game.bottomY - o.height) || o.isHit) {
        o.disappear(o.isHit);
        this.hitLetters.splice(index, 1);
        this.pool.add(o);
      } else {
        // 更新加速度
        o.speedY += o.accel * dt;
        // 更新y的位置
        o.y = Math.min(o.y + o.speedY * dt, this.game.bottomY - o.height);
      }
    });
  }
}