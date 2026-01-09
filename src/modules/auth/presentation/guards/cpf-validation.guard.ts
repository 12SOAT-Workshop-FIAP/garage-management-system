import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const REQUIRE_CPF_KEY = 'requireCpf';

@Injectable()
export class CpfValidationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireCpf = this.reflector.getAllAndOverride<boolean>(REQUIRE_CPF_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If CPF is not required for this route, allow access
    if (!requireCpf) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const cpfHeader = request.headers['x-cpf'];
    const user = request.user;

    if (!cpfHeader) {
      throw new ForbiddenException('CPF header (x-cpf) is required');
    }

    // The validation is already done in ExternalJwtStrategy
    // This guard just ensures the header is present when required
    return true;
  }
}
