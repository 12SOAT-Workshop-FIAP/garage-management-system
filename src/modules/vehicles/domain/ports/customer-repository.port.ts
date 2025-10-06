export interface CustomerRepositoryPort {
  existsById(customerId: number): Promise<boolean>;
}
