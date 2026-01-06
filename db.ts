
import Dexie, { Table } from 'dexie';
import { User, Transaction, Material } from './types';

// Define the database class extending Dexie to inherit its methods including .version()
// Fix: Using the default import for Dexie ensures that inheritance is correctly resolved by TypeScript.
export class MedPreventivaDB extends Dexie {
  users!: Table<User>;
  transactions!: Table<Transaction>;
  materials!: Table<Material>;

  constructor() {
    super('MedPreventivaProDB');
    // Call the version method from the parent Dexie class to define the schema.
    // Fixed: 'version' is an instance method inherited from Dexie.
    this.version(3).stores({
      users: 'id, &ficha, role',
      transactions: 'id, date, type, material, lot, createdBy',
      materials: '++id, &name'
    });
  }
}

export const db = new MedPreventivaDB();
