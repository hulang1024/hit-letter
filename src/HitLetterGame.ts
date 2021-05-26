import Game from "./Game";
import * as TWEEN from '@tweenjs/tween.js';
import { InputKey } from "./input/keys";
import { HitLetterManager } from "./hitLetter";
import { Plane } from "./plane";
import { BulletManager } from "./bullet";

export default class HitLetterGame extends Game {
  private isPuase: boolean = false;
  private hitLetterManager: HitLetterManager = new HitLetterManager(this);
  private plane: Plane = new Plane();
  stage: HTMLElement;
  stageHeight: number;
  stageWidth: number;
  gameDuration: number = 0;

  constructor() {
    super();
    this.stage = document.body as HTMLBodyElement;
    this.stageHeight = document.body.offsetHeight;
    this.stageWidth = document.body.offsetWidth;

    this.plane.y = this.stageHeight - this.plane.height;
    this.plane.bulletManager = new BulletManager(this);
    this.stage.appendChild(this.plane.el);

    console.log(TWEEN)
  }

  onKeyDown(key: InputKey) {
    // 处理按键
    switch (key) {
      case InputKey.Enter:
        // 切换 暂停/继续 游戏状态
        this.isPuase = !this.isPuase;
        break;
      default:
        if (InputKey.A <= key && key <= InputKey.Z) {
          const keyChar = String.fromCharCode(65 + (key - InputKey.A));
          const hitLetter = this.hitLetterManager.findHitLetterByChar(keyChar);
          if (hitLetter) {
            this.plane.shot(hitLetter);
          }
        }
    }
  }

  protected onUpdate(dt: number): void {
    // 判断暂停状态
    if (this.isPuase) {
      return;
    }

    TWEEN.update();

    this.hitLetterManager.onUpdate(dt);

    this.gameDuration += dt;

    for (let cnt = this.gameDuration / 10 - this.hitLetterManager.count(); cnt > 0; cnt--) {
      this.hitLetterManager.createHitLetter();
    }
  }
}