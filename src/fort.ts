import DisplayObject from "./DisplayObject";

export class Fort extends DisplayObject {
  private blocks: Block[] = [];

  constructor(fortY: number, stageWidth: number) {
    super();
    this.el.classList.add('fort');
    this.y = fortY - this.height;
    this.height = 10;

    const BLOCKS = 50;
    const BLOCK_WIDTH = stageWidth / BLOCKS;
    for (let cnt = 0; cnt < BLOCKS; cnt++) {
      const block = new Block();
      block.x = cnt * BLOCK_WIDTH;
      block.width = BLOCK_WIDTH;
      block.height = this.height;

      this.blocks.push(block);

      this.el.appendChild(block.el);
    }
  }

  isCollision(source: DisplayObject) {
    let found = false;
    let block;
    for (let index = 0; index < this.blocks.length; index++) {
      block = this.blocks[index];
      if (((block.x + block.width > source.x) && (source.x >= block.x))
        ||((source.x + source.width > block.x) && (source.x <= block.x))) {
        this.blocks[index].destroy();
        this.blocks.splice(index, 1);
        found = true;
      }
    }
    return found;
  }
}

class Block extends DisplayObject {
  constructor() {
    super();
    this.el.classList.add('fort-block');
  }

  destroy() {
    this.el.parentElement.removeChild(this.el);
  }
}