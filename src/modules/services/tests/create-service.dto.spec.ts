import { validate } from 'class-validator';
import { CreateServiceDto } from '../application/dtos/create-service.dto';

describe('CreateServiceDto', () => {
  it('should validate a valid CreateServiceDto', async () => {
    const dto = new CreateServiceDto();
    dto.name = 'Test Service';
    dto.description = 'Test Description';
    dto.price = 100.0;
    dto.active = true;
    dto.duration = 60;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should fail validation when name is empty', async () => {
    const dto = new CreateServiceDto();
    dto.name = '';
    dto.description = 'Test Description';
    dto.price = 100.0;
    dto.active = true;
    dto.duration = 60;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail validation when name is not a string', async () => {
    const dto = new CreateServiceDto();
    (dto as any).name = 123;
    dto.description = 'Test Description';
    dto.price = 100.0;
    dto.active = true;
    dto.duration = 60;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isString).toBeDefined();
  });

  it('should fail validation when description is empty', async () => {
    const dto = new CreateServiceDto();
    dto.name = 'Test Service';
    dto.description = '';
    dto.price = 100.0;
    dto.active = true;
    dto.duration = 60;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isNotEmpty).toBeDefined();
  });

  it('should fail validation when description is not a string', async () => {
    const dto = new CreateServiceDto();
    dto.name = 'Test Service';
    (dto as any).description = 123;
    dto.price = 100.0;
    dto.active = true;
    dto.duration = 60;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isString).toBeDefined();
  });

  it('should fail validation when price is negative', async () => {
    const dto = new CreateServiceDto();
    dto.name = 'Test Service';
    dto.description = 'Test Description';
    dto.price = -10.0;
    dto.active = true;
    dto.duration = 60;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.min).toBeDefined();
  });

  it('should fail validation when price is not a number', async () => {
    const dto = new CreateServiceDto();
    dto.name = 'Test Service';
    dto.description = 'Test Description';
    (dto as any).price = 'invalid';
    dto.active = true;
    dto.duration = 60;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isNumber).toBeDefined();
  });

  it('should fail validation when active is not a boolean', async () => {
    const dto = new CreateServiceDto();
    dto.name = 'Test Service';
    dto.description = 'Test Description';
    dto.price = 100.0;
    (dto as any).active = 'invalid';
    dto.duration = 60;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isBoolean).toBeDefined();
  });

  it('should fail validation when duration is negative', async () => {
    const dto = new CreateServiceDto();
    dto.name = 'Test Service';
    dto.description = 'Test Description';
    dto.price = 100.0;
    dto.active = true;
    dto.duration = -10;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.min).toBeDefined();
  });

  it('should fail validation when duration is not an integer', async () => {
    const dto = new CreateServiceDto();
    dto.name = 'Test Service';
    dto.description = 'Test Description';
    dto.price = 100.0;
    dto.active = true;
    (dto as any).duration = 60.5;

    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].constraints?.isInt).toBeDefined();
  });

  it('should validate with zero values', async () => {
    const dto = new CreateServiceDto();
    dto.name = 'Test Service';
    dto.description = 'Test Description';
    dto.price = 0.0;
    dto.active = false;
    dto.duration = 0;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should validate with decimal price', async () => {
    const dto = new CreateServiceDto();
    dto.name = 'Test Service';
    dto.description = 'Test Description';
    dto.price = 99.99;
    dto.active = true;
    dto.duration = 60;

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
