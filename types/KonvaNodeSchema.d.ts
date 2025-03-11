interface KonvaNodeSchema {
  attrs: any;
  className: string;
  children?: KonvaNodeSchema[];
}

interface LayerSchema extends Record<string, KonvaNodeSchema> {}

export { KonvaNodeSchema, LayerSchema };
