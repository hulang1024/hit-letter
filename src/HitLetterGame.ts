import Game from "./Game";
import { HitLetterManager } from "./hitLetter";
import { InputKey } from "./input/keys";
import * as TWEEN from '@tweenjs/tween.js';

export default class HitLetterGame extends Game {
  private isPuase: boolean = false;
  private hitLetterManager: HitLetterManager = new HitLetterManager(this);
  stage: HTMLElement;
  bottomY: number;
  stageWidth: number;
  gameDuration: number = 0;

  constructor() {
    super();
    this.stage = document.body as HTMLBodyElement;
    this.bottomY = document.body.offsetHeight - 40;
    this.stageWidth = document.body.offsetWidth;
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
          this.hitLetterManager.deleteByChar(String.fromCharCode(65 + (key - InputKey.A)));
        }
    }
  }

  protected onUpdate(dt: number): void {
    // 判断暂停状态
    if (this.isPuase) {
      return;
    }

    TWEEN.update(dt);

    for (let cnt = this.gameDuration / 10 - this.hitLetterManager.count(); cnt > 0; cnt--) {
      this.hitLetterManager.create();
    }
    
    this.gameDuration += dt;

    this.hitLetterManager.onUpdate(dt);
  }
}