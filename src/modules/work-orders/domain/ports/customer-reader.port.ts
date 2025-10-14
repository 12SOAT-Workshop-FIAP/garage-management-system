export interface CustomerData {
  id: string;
  name: string;
  email: string;
}

export abstract class CustomerReaderPort {
  abstract findById(customerId: number): Promise<CustomerData | null>;
}
