import Game from "./Game";
import { InputKey } from "./input/keys";

export default class HitLetterGame extends Game {
  private isPuase: boolean = false;

  constructor() {
    super();
  }

  onKeyDown(key: InputKey) {
    switch (key) {
      case InputKey.Up:
        this.block.speedX = 0;
        this.block.speedY = -100;
        break;
      case InputKey.Right:
        this.block.speedX = 100;
        this.block.speedY = 0;
        break;
      case InputKey.Down:
        this.block.speedX = 0;
        this.block.speedY = 100;
        break;
      case InputKey.Left:
        this.block.speedX = -100;
        this.block.speedY = 0;
        break;
      case InputKey.Enter:
        this.isPuase = !this.isPuase;
        break;
    }
  }

  private block: {
    x: number,
    y: number,
    width: number,
    height: number,
    speedX: number,
    speedY: number,
    el: HTMLElement | null,
  } = null;

  protected onUpdate(dt: number): void {
    if (this.isPuase) {
      return;
    }

    let { block } = this;
    if (block == null) {
      // 如果block还没有创建，现在创建
      // 初始状态
      this.block = block = {
        x: (document.body.offsetWidth - 50) / 2,
        y: 0,
        width: 50,
        height: 50,
        speedX: 0,
        speedY: 100,
        // 创建一个div
        el: document.createElement('div'),
      };
      // div设置css类
      block.el.classList.add('block');
      // 设置css初始变量
      block.el.style.setProperty('--width', `${this.block.width}px`);
      block.el.style.setProperty('--height', `${this.block.height}px`);
      // 加到DOM中
      document.body.appendChild(block.el);
    }

    // 更新位置
    block.x += block.speedX * dt;
    block.y += block.speedY * dt;
    // 更新css变量
    block.el.style.setProperty('--x', `${block.x}px`);
    block.el.style.setProperty('--y', `${block.y}px`);
  }
}