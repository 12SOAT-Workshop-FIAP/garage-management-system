import { randomUUID } from 'crypto';

export class Service {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  duration: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    props: {
      name: string;
      description: string;
      price: number;
      active: boolean;
      duration: number;
    },
    id?: string,
  ) {
    this.id = id || randomUUID();
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.active = props.active;
    this.duration = props.duration;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
