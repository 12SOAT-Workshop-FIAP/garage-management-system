import { IsString, IsNotEmpty, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class EmailRecipientDto {
  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class SendEmailNotificationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmailRecipientDto)
  recipients!: EmailRecipientDto[];

  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  templateName!: string;

  @IsObject()
  templateData!: Record<string, any>;
}
