import { randomUUID } from 'crypto';
import { UserId } from './value-objects/user-id.vo';
import { UserName } from './value-objects/user-name.vo';
import { UserEmail } from './value-objects/user-email.vo';
import { UserPassword } from './value-objects/user-password.vo';
import { UserStatus } from './value-objects/user-status.vo';

export class User {
  private _id?: UserId;
  private _name: UserName;
  private _email: UserEmail;
  private _password: UserPassword;
  private _status: UserStatus;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor({
    id,
    name,
    email,
    password,
    status = true,
    createdAt,
    updatedAt,
  }: {
    id?: string;
    name: string;
    email: string;
    password: string;
    status?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._name = new UserName(name);
    this._email = new UserEmail(email);
    this._password = new UserPassword(password);
    this._status = new UserStatus(status);

    if (id) {
      this._id = new UserId(id);
    } else {
      this._id = new UserId(randomUUID());
    }

    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
  }

  get id(): UserId | undefined {
    return this._id;
  }

  get name(): UserName {
    return this._name;
  }

  get email(): UserEmail {
    return this._email;
  }

  get password(): UserPassword {
    return this._password;
  }

  get status(): UserStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateName(name: string): void {
    this._name = new UserName(name);
    this._updatedAt = new Date();
  }

  updateEmail(email: string): void {
    this._email = new UserEmail(email);
    this._updatedAt = new Date();
  }

  updatePassword(password: string): void {
    this._password = new UserPassword(password);
    this._updatedAt = new Date();
  }

  activate(): void {
    this._status = this._status.activate();
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._status = this._status.deactivate();
    this._updatedAt = new Date();
  }

  canBeDeleted(): boolean {
    if (!this._status.isActive) {
      throw new Error('Cannot delete an inactive user');
    }
    return true;
  }

  canBeUpdated(): boolean {
    if (!this._status.isActive) {
      throw new Error('Cannot update an inactive user');
    }
    return true;
  }

  static create(props: { name: string; email: string; password: string; status?: boolean }): User {
    return new User({
      ...props,
      status: props.status ?? true,
    });
  }

  static restore(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(props);
  }
}
