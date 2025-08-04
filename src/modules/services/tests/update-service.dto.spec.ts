import { validate } from 'class-validator';
import { UpdateServiceDto } from '../application/dtos/update-service.dto';

describe('UpdateServiceDto', () => {
  it('should validate a valid UpdateServiceDto with all fields', async () => {
    const dto = new UpdateServiceDto();
    dto.name = 'Updated Service';
    dto.description = 'Updated Description';
    dto.price = 150.0;
    dto.active = false;
    dto.duration = 90;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate a valid UpdateServiceDto with partial fields', async () => {
    const dto = new UpdateServiceDto();
    dto.name = 'Updated Service';
    dto.price = 150.0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate an empty UpdateServiceDto', async () => {
    const dto = new UpdateServiceDto();

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when name is empty string', async () => {
    const dto = new UpdateServiceDto();
    dto.name = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail validation when name is not a string', async () => {
    const dto = new UpdateServiceDto();
    (dto as any).name = 123;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isString).toBeDefined();
  });

  it('should fail validation when description is empty string', async () => {
    const dto = new UpdateServiceDto();
    dto.description = '';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail validation when description is not a string', async () => {
    const dto = new UpdateServiceDto();
    (dto as any).description = 123;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isString).toBeDefined();
  });

  it('should fail validation when price is negative', async () => {
    const dto = new UpdateServiceDto();
    dto.price = -10.0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.min).toBeDefined();
  });

  it('should fail validation when price is not a number', async () => {
    const dto = new UpdateServiceDto();
    (dto as any).price = 'invalid';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isNumber).toBeDefined();
  });

  it('should fail validation when active is not a boolean', async () => {
    const dto = new UpdateServiceDto();
    (dto as any).active = 'invalid';

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isBoolean).toBeDefined();
  });

  it('should fail validation when duration is negative', async () => {
    const dto = new UpdateServiceDto();
    dto.duration = -10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.min).toBeDefined();
  });

  it('should fail validation when duration is not an integer', async () => {
    const dto = new UpdateServiceDto();
    (dto as any).duration = 60.5;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isInt).toBeDefined();
  });

  it('should validate with zero values', async () => {
    const dto = new UpdateServiceDto();
    dto.price = 0.0;
    dto.duration = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with decimal price', async () => {
    const dto = new UpdateServiceDto();
    dto.price = 99.99;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with multiple validation errors', async () => {
    const dto = new UpdateServiceDto();
    dto.name = '';
    dto.price = -10.0;
    dto.duration = -5;

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(1);
  });
});
