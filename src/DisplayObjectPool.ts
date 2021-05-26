export default class DisplayObjectPool<T> {
  private objects: T[] = [];

  constructor(initalSize: number, create: () => T) {
    for (let i = 0; i < initalSize; i++) {
      this.objects.push(create());
    }
  }

  get() {
    return this.objects.shift();
  }

  add(object: T) {
    this.objects.push(object);
  }
}