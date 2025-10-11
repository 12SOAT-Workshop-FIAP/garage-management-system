// Jest setup file for e2e tests
process.env.POSTGRES_TEST_DB = 'garage';
process.env.POSTGRES_DB = 'garage';
process.env.POSTGRES_HOST = 'localhost';
process.env.POSTGRES_PORT = '5432';
process.env.POSTGRES_USER = 'postgres';
process.env.POSTGRES_PASSWORD = 'postgres';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.CRYPTO_SECRET_KEY = 'test-crypto-secret-key-32-chars!';
process.env.BCRYPT_ROUNDS = '4';
