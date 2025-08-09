import CustomerSeeder from './customer/customer.seeder';

//Para executar rodar yarn seed:run or npm seed:run
async function bootstrap() {
  await new CustomerSeeder().run();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
