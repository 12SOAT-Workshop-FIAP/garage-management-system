import CustomerSeeder from './customer/customer.seeder';
import ServiceSeeder from './service/service.seeder';
import UsersSeeder from './users/users.seeder';

//Para executar rodar yarn seed:run or npm seed:run
async function bootstrap() {
  await new CustomerSeeder().run();
  await new ServiceSeeder().run();
  await new UsersSeeder().run();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
