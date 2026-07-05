export interface Position {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  children?: Position[];
  parent?: Position;
}

export interface CreatePositionPayload {
  name: string;
  description: string;
  parentId?: string | null;
}

export interface UpdatePositionPayload extends Partial<CreatePositionPayload> {}
