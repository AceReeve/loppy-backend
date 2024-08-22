import { getDb } from '../migrations-utils/db';
import { ObjectId } from 'mongodb';

export const up = async () => {
  try {
    const db = await getDb();

    const defaultRole = [
      {
        _id: new ObjectId(),
        role_name: 'Owner',
        description:
          'Highest level of access with full control over the system',
      },
      {
        _id: new ObjectId(),
        role_name: 'Administrator',
        description:
          'Highest level of access with full control over the system',
      },
      {
        _id: new ObjectId(),
        role_name: 'Member',
        description: 'Basic level of access for regular users',
      },
      {
        _id: new ObjectId(),
        role_name: 'Manager',
        description: 'Can manage specific sections of the system or resources',
      },
      {
        _id: new ObjectId(),
        role_name: 'Guest',
        description: 'Minimal access for users who are not logged in',
      },
    ];

    for (const role of defaultRole) {
      const existingRole = await db
        .collection('role')
        .findOne({ role_name: role.role_name });
      if (!existingRole) {
        await db.collection('role').insertOne(role);
      } else {
        console.log(
          `Role '${role.role_name}' already exists. Skipping insertion.`,
        );
      }
    }

    console.log('default role populated.');
  } catch (error) {
    console.error('Error inserting role:', error);
  }
};

export const down = async () => {};
