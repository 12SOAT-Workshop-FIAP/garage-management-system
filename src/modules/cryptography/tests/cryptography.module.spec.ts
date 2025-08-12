import { Test, TestingModule } from '@nestjs/testing';
import { CryptographyModule } from '../presentation/cryptography.module';
import { CryptographyService } from '../application/services/cryptography.service';
import { CryptographyRepository } from '../infrastructure/repositories/cryptography.repository';
import { ICryptographyRepository } from '../domain/cryptography.repository';

describe('CryptographyModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CryptographyModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide CryptographyService', () => {
    const service = module.get<CryptographyService>(CryptographyService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(CryptographyService);
  });

  it('should provide CryptoRepository', () => {
    const repository = module.get<CryptographyRepository>(ICryptographyRepository);
    expect(repository).toBeDefined();
    expect(repository).toBeInstanceOf(CryptographyRepository);
  });

  it('should export CryptographyService', () => {
    const service = module.get<CryptographyService>(CryptographyService);
    expect(service).toBeDefined();
  });

  it('should have correct module structure', () => {
    const moduleInstance = module.get(CryptographyModule);
    expect(moduleInstance).toBeDefined();
  });
});
