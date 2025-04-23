import { RawString } from "@automerge/automerge-repo";

type KonvaNodeSchema = {
  attrs: any;
  className: RawString | string;
  children?: KonvaNodeSchema[];
};

type StageSchema = Record<string, KonvaNodeSchema>;

export type { KonvaNodeSchema, StageSchema };
