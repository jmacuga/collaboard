export class Serializer {
  static serializeDate(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.serializeDate(item));
    }

    if (obj instanceof Date) {
      return obj.toISOString();
    }

    if (typeof obj === "object") {
      const serialized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        serialized[key] = this.serializeDate(value);
      }
      return serialized;
    }

    return obj;
  }
}

export default Serializer;
