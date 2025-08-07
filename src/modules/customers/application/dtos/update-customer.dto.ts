import { PartialType } from '@nestjs/swagger';
import { CreateCustomerDto } from './create-customer.dto';

/**
 * UpdateCustomerDto
 * Data Transfer Object for updating a customer (Cliente).
 * All fields are optional.
 */
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
