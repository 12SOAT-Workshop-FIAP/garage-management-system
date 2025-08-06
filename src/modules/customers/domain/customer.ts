import { Vehicle } from '@modules/vehicles/domain/vehicle.entity';

export class Customer {
  id!: number;
  name: string;
  personType: 'INDIVIDUAL' | 'COMPANY';
  document: string;
  email?: string;
  phone: string;
  vehicles?: Vehicle[];
  createdAt!: Date;
  updatedAt!: Date;
  status: boolean;

  constructor({
    id,
    name,
    personType,
    document,
    phone,
    email,
    createdAt,
    updatedAt,
    status = true,
    vehicles,
  }: {
    id?: number;
    name: string;
    personType: 'INDIVIDUAL' | 'COMPANY';
    document: string;
    phone: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    status: boolean;
    vehicles?: Vehicle[];
  }) {
    if (id !== undefined) {
      this.id = id;
    }
    if (vehicles !== undefined) {
      this.vehicles = vehicles;
    }
    this.name = name;
    this.personType = personType;
    this.document = document;
    this.phone = phone;
    this.email = email;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
    this.status = status;
  }
}
