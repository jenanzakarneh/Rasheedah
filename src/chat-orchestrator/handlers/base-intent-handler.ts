export abstract class BaseIntentHandler {
  readonly intent: string;

  constructor() {
    const ctor = this.constructor as any;

    if (!ctor.intent) {
      throw new Error(`${ctor.name} must define a static "intent" property.`);
    }

    this.intent = ctor.intent;
  }

  abstract execute(payload: any): Promise<string>;

  protected ok(message: string) {
    return `${message}`;
  }

  protected fail(message: string) {
    return ` ${message}`;
  }
}
