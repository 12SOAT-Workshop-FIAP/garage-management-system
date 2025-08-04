import { randomUUID } from 'crypto';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    props: {
      name: string;
      email: string;
      password: string;
      isActive?: boolean;
    },
    id?: string,
  ) {
    this.id = id || randomUUID();
    this.name = props.name;
    this.email = props.email;
    this.password = props.password;
    this.isActive = props.isActive ?? true;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
