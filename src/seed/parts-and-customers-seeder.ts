import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';
import { CustomerEntity } from '../modules/customers/infrastructure/customer.entity';
import { Vehicle } from '../modules/vehicles/domain/vehicle.entity';
import { Part } from '../modules/parts/infrastructure/entities/part.entity';
import { User } from '../modules/users/infrastructure/entities/user.entity';

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    // Seed Users
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create({
      name: 'Admin User',
      email: 'admin@workshop.com',
      password: '$2b$10$K5vwP3..SampleHashedPassword',
      isActive: true,
    });
    await userRepository.save(user);
    console.log('User seeded');

    // Seed Customers  
    const customerRepository = AppDataSource.getRepository(CustomerEntity);
    const customer = customerRepository.create({
      name: 'João Silva',
      personType: 'INDIVIDUAL',
      document: '12345678901',
      phone: '11999999999',
      email: 'joao@email.com',
      status: true,
    });
    await customerRepository.save(customer);
    console.log('Customer seeded');

    // Seed Vehicle
    const vehicleRepository = AppDataSource.getRepository(Vehicle);
    const vehicle = vehicleRepository.create({
      brand: 'Toyota',
      model: 'Corolla',
      plate: 'ABC1234',
      year: 2020,
      customer: customer,
    });
    await vehicleRepository.save(vehicle);
    console.log('Vehicle seeded');

    // Seed Parts
    const partRepository = AppDataSource.getRepository(Part);
    const parts = [
      {
        name: 'Brake Pad Set',
        description: 'Front brake pads for sedans',
        partNumber: 'BP-001',
        category: 'Brakes',
        price: 150.00,
        costPrice: 100.00,
        stockQuantity: 50,
        minStockLevel: 5,
        unit: 'set',
        supplier: 'Brake Masters Inc',
        active: true,
      },
      {
        name: 'Engine Oil Filter',
        description: 'Oil filter for 4-cylinder engines',
        partNumber: 'OF-002',
        category: 'Engine',
        price: 25.00,
        costPrice: 15.00,
        stockQuantity: 100,
        minStockLevel: 10,
        unit: 'piece',
        supplier: 'Filter Pro Ltd',
        active: true,
      },
      {
        name: 'Spark Plugs',
        description: 'Set of 4 spark plugs',
        partNumber: 'SP-003',
        category: 'Engine',
        price: 80.00,
        costPrice: 50.00,
        stockQuantity: 30,
        minStockLevel: 8,
        unit: 'set',
        supplier: 'Ignition Parts Co',
        active: true,
      }
    ];

    for (const partData of parts) {
      const part = partRepository.create(partData);
      await partRepository.save(part);
    }
    console.log('Parts seeded');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
