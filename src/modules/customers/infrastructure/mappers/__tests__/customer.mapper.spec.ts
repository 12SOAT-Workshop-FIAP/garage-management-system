import { CustomerMapper } from '../customer.mapper';
import { CustomerEntity } from '../../customer.entity';
import { Customer } from '../../../domain/entities/customer.entity';

describe('CustomerMapper', () => {
  describe('toDomain', () => {
    it('should map from infrastructure entity to domain entity', () => {
      const entity = new CustomerEntity();
      entity.id = 1;
      entity.name = 'João Silva';
      entity.personType = 'INDIVIDUAL';
      entity.document = '11144477735';
      entity.phone = '+5511999999999';
      entity.email = 'joao@example.com';
      entity.status = true;
      entity.createdAt = new Date('2023-01-01');
      entity.updatedAt = new Date('2023-01-02');

      const domain = CustomerMapper.toDomain(entity);

      expect(domain.id?.value).toBe(1);
      expect(domain.name.value).toBe('João Silva');
      expect(domain.personType.value).toBe('INDIVIDUAL');
      expect(domain.document.value).toBe('11144477735');
      expect(domain.phone.value).toBe('+5511999999999');
      expect(domain.email?.value).toBe('joao@example.com');
      expect(domain.status.value).toBe(true);
      expect(domain.createdAt).toEqual(new Date('2023-01-01'));
      expect(domain.updatedAt).toEqual(new Date('2023-01-02'));
    });
  });

  describe('toInfrastructure', () => {
    it('should map from domain entity to infrastructure entity', () => {
      const domain = Customer.restore({
        id: 1,
        name: 'João Silva',
        personType: 'INDIVIDUAL',
        document: '11144477735',
        phone: '+5511999999999',
        email: 'joao@example.com',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        status: true,
      });

      const infrastructure = CustomerMapper.toInfrastructure(domain);

      expect(infrastructure.id).toBe(1);
      expect(infrastructure.name).toBe('João Silva');
      expect(infrastructure.personType).toBe('INDIVIDUAL');
      expect(infrastructure.document).toBe('11144477735');
      expect(infrastructure.phone).toBe('+5511999999999');
      expect(infrastructure.email).toBe('joao@example.com');
      expect(infrastructure.status).toBe(true);
    });
  });

  describe('toInfrastructureUpdate', () => {
    it('should map from domain entity to infrastructure entity for updates', () => {
      const domain = Customer.restore({
        id: 1,
        name: 'João Silva',
        personType: 'INDIVIDUAL',
        document: '11144477735',
        phone: '+5511999999999',
        email: 'joao@example.com',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        status: true,
      });

      const infrastructure = CustomerMapper.toInfrastructureUpdate(domain);

      expect(infrastructure.name).toBe('João Silva');
      expect(infrastructure.personType).toBe('INDIVIDUAL');
      expect(infrastructure.document).toBe('11144477735');
      expect(infrastructure.phone).toBe('+5511999999999');
      expect(infrastructure.email).toBe('joao@example.com');
      expect(infrastructure.status).toBe(true);
      expect(infrastructure.updatedAt).toEqual(new Date('2023-01-02'));
      expect(infrastructure.id).toBeUndefined();
    });
  });
});
