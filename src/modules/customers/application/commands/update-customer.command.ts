export class UpdateCustomerCommand {
  constructor(
    public readonly id: number,
    public readonly name?: string,
    public readonly personType?: 'INDIVIDUAL' | 'COMPANY',
    public readonly document?: string,
    public readonly phone?: string,
    public readonly email?: string,
    public readonly status?: boolean,
  ) {}
}
