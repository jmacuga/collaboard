interface KonvaNodeSchema {
  attrs: any;
  className: string;
  children?: KonvaNodeSchema[];
}

export default KonvaNodeSchema;
