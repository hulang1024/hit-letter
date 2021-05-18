import KeyboardHandler from "./input/KeyboardHandler";
import KeyboardState from "./input/KeyboardState";
import { InputKey } from "./input/keys";

export default abstract class Game {
  private KeyboardHandler: KeyboardHandler;
  protected keyboardState: KeyboardState = new KeyboardState();

  constructor() {
    this.setupUpdateLoop();

    this.KeyboardHandler = new KeyboardHandler({
      onKeyDown: (key, event) => {
        this.onKeyDown(key, event);
        this.keyboardState.keys.setPressed(key, true);
      },
      onKeyUp: (key, event) => {
        this.onKeyUp(key, event);
        this.keyboardState.keys.setPressed(key, false);
      },
    });
  }
  
  private setupUpdateLoop() {
    const onUpdate = this.onUpdate.bind(this);

    // 保存上一帧的时间戳
    let lastTime = 0;
    // 定义 update，update 是一个更新循环
    // 参数 time 是 requestAnimationFrame 传递的当前帧的时间戳
    function update(time: number) {
      // 计算上一帧和当前帧的间隔时间
      // 60FPS情况下 dt 在 16.6 左右（在这里除以1000，以得到一个小数0.0166，更适合onUpdate用）
      const dt = (time - (lastTime == 0 ? time : lastTime)) / 1000;
      // 调用 onUpdate，传递 dt
      onUpdate(dt);
      // 记录本帧时间戳
      lastTime = time;
      // 设置下一帧回调
      requestAnimationFrame(update);
    }
    // 启动循环
    requestAnimationFrame(update);
  }

  protected abstract onUpdate(dt: number): void;

  protected onKeyDown(key: InputKey, event?: KeyboardEvent) {}
  protected onKeyUp(key: InputKey, event?: KeyboardEvent) {}
}