export default abstract class DisplayObject {
  private _x: number;
  public get x() { return this._x; }
  public set x(val) {
    this.setPosition(val, this._y);
  }

  private _y: number;
  public get y() { return this._y; }
  public set y(val) {
    this.setPosition(this._x, val);
  }

  private _width: number;
  public get width() { return this._width; }
  public set width(val) {
    if (val != this._width) {
      this._width = val;
      this.el.style.setProperty('--width', `${val}px`);
    }
  }

  private _height: number;
  public get height() { return this._height; }
  public set height(val) {
    if (val != this._height) {
      this._height = val;
      this.el.style.setProperty('--height', `${val}px`);
    }
  }

  protected _el: HTMLElement;
  public get el() { return this._el; }

  constructor() {
    this._el = document.createElement('div');
    this._el.classList.add('display-object');
    this.setPosition(0, 0);
    this.height = 20;
    this.width = 20;
  }

  public setPosition(x: number, y: number) {
    if (this.x != x) {
      this._x = x;
      this.el.style.setProperty('--x', `${x}px`);
    }
    if (this.y != y) {
      this._y = y;
      this.el.style.setProperty('--y', `${y}px`);
    }
  }

  public onUpdate(dt: number): void {}
}
