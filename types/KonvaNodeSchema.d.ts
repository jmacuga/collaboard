interface KonvaNodeSchema {
  attrs: any;
  className: RawString | string;
  children?: KonvaNodeSchema[];
}

interface LayerSchema extends Record<string, KonvaNodeSchema> {}

export { KonvaNodeSchema, LayerSchema };
