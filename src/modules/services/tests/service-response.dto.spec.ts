import { ServiceResponseDto } from '../presentation/dtos/service-response.dto';
import { Service } from '../domain/service.entity';

describe('ServiceResponseDto', () => {
  it('should create a ServiceResponseDto from a Service entity', () => {
    const service = new Service(
      {
        name: 'Test Service',
        description: 'Test Description',
        price: 100.0,
        active: true,
        duration: 60,
      },
      'test-id',
    );

    service.createdAt = new Date('2023-01-01T10:00:00Z');
    service.updatedAt = new Date('2023-01-02T10:00:00Z');

    const responseDto = new ServiceResponseDto(service);

    expect(responseDto.id).toBe('test-id');
    expect(responseDto.name).toBe('Test Service');
    expect(responseDto.description).toBe('Test Description');
    expect(responseDto.price).toBe(100.0);
    expect(responseDto.active).toBe(true);
    expect(responseDto.duration).toBe(60);
    expect(responseDto.createdAt).toEqual(new Date('2023-01-01T10:00:00Z'));
    expect(responseDto.updatedAt).toEqual(new Date('2023-01-02T10:00:00Z'));
  });

  it('should handle service with different data types', () => {
    const service = new Service(
      {
        name: 'Another Service',
        description: 'Another Description',
        price: 0.0,
        active: false,
        duration: 0,
      },
      'another-id',
    );

    const responseDto = new ServiceResponseDto(service);

    expect(responseDto.id).toBe('another-id');
    expect(responseDto.name).toBe('Another Service');
    expect(responseDto.description).toBe('Another Description');
    expect(responseDto.price).toBe(0.0);
    expect(responseDto.active).toBe(false);
    expect(responseDto.duration).toBe(0);
    expect(responseDto.createdAt).toBeInstanceOf(Date);
    expect(responseDto.updatedAt).toBeInstanceOf(Date);
  });

  it('should handle service with decimal price', () => {
    const service = new Service(
      {
        name: 'Premium Service',
        description: 'Premium Description',
        price: 99.99,
        active: true,
        duration: 120,
      },
      'premium-id',
    );

    const responseDto = new ServiceResponseDto(service);

    expect(responseDto.price).toBe(99.99);
    expect(responseDto.duration).toBe(120);
  });
});
