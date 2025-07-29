export class Customer {
  id!: number;
  name: string;
  personType: 'INDIVIDUAL' | 'COMPANY';
  document: string;
  email?: string;
  phone: string;
  createdAt!: Date;
  updatedAt!: Date;
  status: boolean;

  constructor({
    name,
    personType,
    document,
    phone,
    email,
    createdAt,
    updatedAt,
    status = true,
  }: {
    name: string;
    personType: 'INDIVIDUAL' | 'COMPANY';
    document: string;
    phone: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    status: boolean;
  }) {
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
