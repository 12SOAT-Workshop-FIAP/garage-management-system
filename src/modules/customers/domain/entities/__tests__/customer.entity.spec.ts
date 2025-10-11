import { Customer } from '../customer.entity';

describe('Customer Entity', () => {
  const validCustomerData = {
    name: 'João Silva',
    personType: 'INDIVIDUAL' as const,
    document: '11144477735',
    phone: '+5511999999999',
    email: 'joao@example.com',
  };

  describe('Creation', () => {
    it('should create a customer with valid data', () => {
      const customer = Customer.create(validCustomerData);

      expect(customer.name.value).toBe('João Silva');
      expect(customer.personType.value).toBe('INDIVIDUAL');
      expect(customer.document.value).toBe('11144477735');
      expect(customer.phone.value).toBe('+5511999999999');
      expect(customer.email?.value).toBe('joao@example.com');
      expect(customer.status.isActive).toBe(true);
    });

    it('should create a customer without email', () => {
      const { email, ...dataWithoutEmail } = validCustomerData;
      const customer = Customer.create(dataWithoutEmail);

      expect(customer.email).toBeUndefined();
    });

    it('should restore a customer with all data', () => {
      const customer = Customer.restore({
        id: 1,
        ...validCustomerData,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        status: true,
      });

      expect(customer.id?.value).toBe(1);
      expect(customer.createdAt).toEqual(new Date('2023-01-01'));
      expect(customer.updatedAt).toEqual(new Date('2023-01-02'));
    });

    it('should throw error for invalid document type', () => {
      expect(() =>
        Customer.create({
          ...validCustomerData,
          personType: 'INDIVIDUAL',
          document: '11222333000181', // CNPJ for individual
        }),
      ).toThrow('Individual customers must have a CPF');
    });
  });

  describe('Business Methods', () => {
    let customer: Customer;

    beforeEach(() => {
      customer = Customer.create(validCustomerData);
    });

    it('should update name', () => {
      customer.updateName('Maria Santos');
      expect(customer.name.value).toBe('Maria Santos');
      expect(customer.updatedAt).toBeInstanceOf(Date);
    });

    it('should update email', () => {
      customer.updateEmail('maria@example.com');
      expect(customer.email?.value).toBe('maria@example.com');
      expect(customer.updatedAt).toBeInstanceOf(Date);
    });

    it('should update phone', () => {
      customer.updatePhone('+5511888888888');
      expect(customer.phone.value).toBe('+5511888888888');
      expect(customer.updatedAt).toBeInstanceOf(Date);
    });

    it('should update document', () => {
      customer.updateDocument('11144477735'); // Use a valid CPF
      expect(customer.document.value).toBe('11144477735');
      expect(customer.updatedAt).toBeInstanceOf(Date);
    });

    it('should activate customer', () => {
      customer.deactivate();
      expect(customer.status.isInactive).toBe(true);

      customer.activate();
      expect(customer.status.isActive).toBe(true);
      expect(customer.updatedAt).toBeInstanceOf(Date);
    });

    it('should deactivate customer', () => {
      customer.deactivate();
      expect(customer.status.isInactive).toBe(true);
      expect(customer.updatedAt).toBeInstanceOf(Date);
    });

    it('should add vehicle', () => {
      customer.addVehicle(1);

      expect(customer.vehicleIds).toContain(1);
      expect(customer.updatedAt).toBeInstanceOf(Date);
    });

    it('should remove vehicle', () => {
      customer.addVehicle(1);
      customer.addVehicle(2);
      customer.removeVehicle(1);

      expect(customer.vehicleIds).not.toContain(1);
      expect(customer.vehicleIds).toContain(2);
      expect(customer.updatedAt).toBeInstanceOf(Date);
    });

    it('should generate business key', () => {
      const businessKey = customer.getBusinessKey();
      expect(businessKey).toBe('INDIVIDUAL-11144477735');
    });

    it('should check if can be updated', () => {
      expect(customer.canBeUpdated()).toBe(true);

      customer.deactivate();
      expect(() => customer.canBeUpdated()).toThrow('Cannot update an inactive customer');
    });

    it('should check if can be deleted', () => {
      expect(customer.canBeDeleted()).toBe(true);

      customer.addVehicle(1);
      expect(() => customer.canBeDeleted()).toThrow(
        'Cannot delete customer with associated vehicles',
      );
    });
  });

  describe('Validation', () => {
    it('should throw error when updating document with wrong type', () => {
      const customer = Customer.create({
        ...validCustomerData,
        personType: 'INDIVIDUAL',
      });

      expect(() => customer.updateDocument('11222333000181')).toThrow(
        'Individual customers must have a CPF',
      );
    });

    it('should throw error when deactivating customer with vehicles', () => {
      const customer = Customer.create(validCustomerData);
      customer.addVehicle(1);

      expect(() => customer.deactivate()).toThrow(
        'Cannot delete customer with associated vehicles',
      );
    });
  });
});
