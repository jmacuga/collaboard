interface KonvaNodeSchema {
  attrs: any;
  className: string;
  children?: KonvaNodeSchema[] | undefined;
}

export default KonvaNodeSchema;
