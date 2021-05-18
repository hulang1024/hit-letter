import Game from "./Game";

export default class HitLetterGame extends Game {
  private bottomY: number;

  constructor() {
    super();
    this.bottomY = document.body.offsetHeight;
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