import Game from "./Game";
import * as TWEEN from '@tweenjs/tween.js';
import { InputKey } from "./input/keys";
import { HitLetterManager } from "./hitLetter";
import { Plane } from "./plane";
import { BulletManager } from "./bullet";
import { Fort } from "./fort";

export default class HitLetterGame extends Game {
  private isPuase: boolean = false;
  private plane: Plane = new Plane();
  hitLetterManager: HitLetterManager;
  fort: Fort;
  stage: HTMLElement;
  stageHeight: number;
  stageWidth: number;
  gameDuration: number = 0;

  constructor() {
    super();
    this.stage = document.body as HTMLBodyElement;
    this.stageHeight = document.body.offsetHeight;
    this.stageWidth = document.body.offsetWidth;

    this.fort = new Fort(this.stageHeight - this.plane.height - 2, this.stageWidth);
    this.stage.appendChild(this.fort.el);

    this.hitLetterManager = new HitLetterManager(this);

    this.plane.y = this.stageHeight - this.plane.height;
    this.plane.bulletManager = new BulletManager(this);
    this.stage.appendChild(this.plane.el);
  }

  onKeyDown(key: InputKey) {
    // 处理按键
    switch (key) {
      case InputKey.Enter:
        // 切换 暂停/继续 游戏状态
        this.isPuase = !this.isPuase;
        break;
      case InputKey.Space:
        this.plane.shot();
        break;
      default:
        if (this.isPuase) {
          return;
        }
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

    if (this.keyboardState.keys.isPressed(InputKey.Left)) {
      this.plane.x -= 10;
    } else if (this.keyboardState.keys.isPressed(InputKey.Right)) {
      this.plane.x += 10;
    }
  }
}