import CustomerSeeder from './customer/customer.seeder';
import ServiceSeeder from './service/service.seeder';
import UsersSeeder from './users/users.seeder';
import VehiclesSeeder from './vehicles/vehicles.seeder';
import PartsSeeder from './parts/parts.seeder';

//Para executar rodar yarn seed:run or npm seed:run
async function bootstrap() {
  await new CustomerSeeder().run();
  await new ServiceSeeder().run();
  await new UsersSeeder().run();
  await new VehiclesSeeder().run();
  await new PartsSeeder().run();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
