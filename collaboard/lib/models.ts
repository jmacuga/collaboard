export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  name: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
  canvas: any;
  canvasId: string;
}

export interface Canvas {
  id: string;
  name: string;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;
  canvas: any;
  canvasId: string;
}
