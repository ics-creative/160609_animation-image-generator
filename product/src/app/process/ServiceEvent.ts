type Handler<T> = (param: T) => void;

/** 独自のイベントを管理するクラス */
export class ServiceEvent<T> {
  private handlers: Handler<T>[] = [];

  /** イベントを発行します */
  fire(param: T) {
    this.handlers.forEach((handler) => handler(param));
  }

  /** リスナーを登録します */
  add(handler: Handler<T>) {
    this.handlers = [...this.handlers.filter((h) => handler !== h), handler];
  }

  /** 登録済みのリスナーを削除します */
  remove(handler: Handler<T>) {
    this.handlers = this.handlers.filter((h) => handler !== h);
  }
}
