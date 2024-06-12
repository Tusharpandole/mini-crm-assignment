import { CustomerT } from '@assets/types/types';
import { faker } from '@faker-js/faker';

const generateRandomCustomers = (num: number) => {
  const customers: CustomerT[] = [];

  for (let i = 0; i < num; i++) {
    const customer = {
      user_id: faker.datatype.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phno: faker.phone.number(),
      total_spends: faker.finance.amount({min:1000, max: 500000}),
      visits: faker.datatype.number({min:0, max: 2000}),
      last_visit: faker.date.past(),
    };

    customers.push(customer as unknown as CustomerT);
  }

  return customers;
};

export const generateAndWriteCustomers = () => {
  try {
    const customers = generateRandomCustomers(50);
    console.log('File has been written successfully');
    return customers;
  } catch (err) {
    console.error('Error writing file:', err);
  }
};
