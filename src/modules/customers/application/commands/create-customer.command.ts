export class CreateCustomerCommand {
  constructor(
    public readonly name: string,
    public readonly personType: 'INDIVIDUAL' | 'COMPANY',
    public readonly document: string,
    public readonly phone: string,
    public readonly email?: string,
  ) {}
}
