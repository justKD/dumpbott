export class KDHistoryArray extends Array {
  max: (size?: number) => number;
  push: (...items: any) => number;
  constructor() {
    super();
    let max = 10;
    this.max = size => {
      if (Number.isSafeInteger(size as number)) max = size as number;
      return max;
    };
    this.push = (...items) => {
      let count = items.length;
      while (count--) if (this.length >= max) this.shift();
      items.forEach((item: any) => super.push(item));
      return this.length;
    };
  }
}
