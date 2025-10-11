// Jest setup file for e2e tests
process.env.POSTGRES_TEST_DB = 'garage';
process.env.POSTGRES_HOST = 'host.docker.internal';
process.env.POSTGRES_PORT = '5432';
process.env.POSTGRES_USER = 'postgres';
process.env.POSTGRES_PASSWORD = 'postgres';
