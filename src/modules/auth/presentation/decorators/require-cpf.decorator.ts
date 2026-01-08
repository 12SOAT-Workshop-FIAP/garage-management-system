import { SetMetadata } from '@nestjs/common';

export const REQUIRE_CPF_KEY = 'requireCpf';
export const RequireCpf = () => SetMetadata(REQUIRE_CPF_KEY, true);
