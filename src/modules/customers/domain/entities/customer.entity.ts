import { CustomerId } from '../value-objects/customer-id.vo';
import { CustomerName } from '../value-objects/customer-name.vo';
import { PersonType } from '../value-objects/person-type.vo';
import { Document } from '../value-objects/document.vo';
import { Email } from '../value-objects/email.vo';
import { Phone } from '../value-objects/phone.vo';
import { CustomerStatus } from '../value-objects/customer-status.vo';

export class Customer {
  private _id?: CustomerId;
  private _name: CustomerName;
  private _personType: PersonType;
  private _document: Document;
  private _email?: Email;
  private _phone: Phone;
  private _vehicleIds?: number[];
  private _createdAt: Date;
  private _updatedAt: Date;
  private _status: CustomerStatus;

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
    vehicleIds,
  }: {
    id?: number;
    name: string;
    personType: 'INDIVIDUAL' | 'COMPANY';
    document: string;
    phone: string;
    email?: string;
    createdAt?: Date;
    updatedAt?: Date;
    status?: boolean;
    vehicleIds?: number[];
  }) {
    this._name = new CustomerName(name);
    this._personType = new PersonType(personType);
    this._document = new Document(document);
    this._phone = new Phone(phone);
    this._status = new CustomerStatus(status);

    if (email) {
      this._email = new Email(email);
    }

    if (id) {
      this._id = new CustomerId(id);
    }

    this._vehicleIds = vehicleIds;
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();

    this.validateDocumentType(this._document, this._personType);
  }

  get id(): CustomerId | undefined {
    return this._id;
  }

  get name(): CustomerName {
    return this._name;
  }

  get personType(): PersonType {
    return this._personType;
  }

  get document(): Document {
    return this._document;
  }

  get email(): Email | undefined {
    return this._email;
  }

  get phone(): Phone {
    return this._phone;
  }

  get vehicleIds(): number[] | undefined {
    return this._vehicleIds;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get status(): CustomerStatus {
    return this._status;
  }

  updateName(name: string): void {
    this._name = new CustomerName(name);
    this._updatedAt = new Date();
  }

  updateEmail(email: string): void {
    this._email = new Email(email);
    this._updatedAt = new Date();
  }

  updatePhone(phone: string): void {
    this._phone = new Phone(phone);
    this._updatedAt = new Date();
  }

  updateDocument(document: string): void {
    const newDocument = new Document(document);
    this.validateDocumentType(newDocument, this._personType);
    this._document = newDocument;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._status = this._status.activate();
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this.canBeDeleted();
    this._status = this._status.deactivate();
    this._updatedAt = new Date();
  }

  addVehicle(vehicleId: number): void {
    if (!this._vehicleIds) {
      this._vehicleIds = [];
    }
    this._vehicleIds.push(vehicleId);
    this._updatedAt = new Date();
  }

  removeVehicle(vehicleId: number): void {
    if (this._vehicleIds) {
      this._vehicleIds = this._vehicleIds.filter((id) => id !== vehicleId);
      this._updatedAt = new Date();
    }
  }

  getBusinessKey(): string {
    return `${this._personType.value}-${this._document.value}`;
  }

  canBeDeleted(): boolean {
    if (!this._status.isActive) {
      throw new Error('Cannot delete an inactive customer');
    }

    if (this._vehicleIds && this._vehicleIds.length > 0) {
      throw new Error('Cannot delete customer with associated vehicles');
    }

    return true;
  }

  canBeUpdated(): boolean {
    if (!this._status.isActive) {
      throw new Error('Cannot update an inactive customer');
    }

    return true;
  }

  private validateDocumentType(document: Document, personType: PersonType): void {
    if (personType.isIndividual && !document.isCPF) {
      throw new Error('Individual customers must have a CPF');
    }

    if (personType.isCompany && !document.isCNPJ) {
      throw new Error('Company customers must have a CNPJ');
    }
  }

  static create(props: {
    name: string;
    personType: 'INDIVIDUAL' | 'COMPANY';
    document: string;
    phone: string;
    email?: string;
    vehicleIds?: number[];
  }): Customer {
    return new Customer({
      ...props,
      status: true,
    });
  }

  static restore(props: {
    id: number;
    name: string;
    personType: 'INDIVIDUAL' | 'COMPANY';
    document: string;
    phone: string;
    email?: string;
    createdAt: Date;
    updatedAt: Date;
    status: boolean;
    vehicleIds?: number[];
  }): Customer {
    return new Customer(props);
  }
}
