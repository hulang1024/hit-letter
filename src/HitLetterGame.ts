import Game from "./Game";
import { InputKey } from "./input/keys";

export default class HitLetterGame extends Game {
  private isPuase: boolean = false;
  private bottomY: number;

  constructor() {
    super();
    this.bottomY = document.body.offsetHeight;
  }

  onKeyDown(key: InputKey) {
    // 处理按键
    switch (key) {
      case InputKey.Right:
        // 修改block的x状态
        this.block.x += 10;
        break;
      case InputKey.Left:
        this.block.x -= 10;
        break;
      case InputKey.Enter:
        // 切换 暂停/继续 游戏状态
        this.isPuase = !this.isPuase;
        break;
    }
  }

  private block: {
    x: number,
    y: number,
    width: number,
    height: number,
    speedY: number, // y的速度
    accel: number, // 加速度
    el: HTMLElement | null,
  } = null;

  protected onUpdate(dt: number): void {
    // 判断暂停状态
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
        speedY: 0,
        accel: 300,
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

    if (block.y < (this.bottomY - block.height)) {
      // 如果还没落到底部
      // 判断当前如果 按下了空格，则将加速度设置为负方向
      if (this.keyboardState.keys.isPressed(InputKey.Space)) {
        block.accel = -Math.abs(block.accel);
      } else {
        block.accel = Math.abs(block.accel);
      }
      // 更新加速度
      block.speedY += block.accel * dt;

      // 更新y的位置
      block.y = Math.min(block.y + block.speedY * dt, this.bottomY - block.height);
      // 更新css变量
      block.el.style.setProperty('--x', `${block.x}px`);
      block.el.style.setProperty('--y', `${block.y}px`);
    }
  }
}