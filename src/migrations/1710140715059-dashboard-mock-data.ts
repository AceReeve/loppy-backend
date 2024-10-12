import { getDb } from '../migrations-utils/db';
import { ObjectId } from 'mongodb';

export const up = async () => {
  try {
    const db = await getDb();

    const mockdataDashboard = [
      {
        _id: new ObjectId(),
        first_name: 'John',
        middle_name: 'Quincy',
        last_name: 'Adam',
        date: '3/1/24',
        source: 'Google',
        lead_type: 'Phone Call',
        call_duration: 3.27,
        ltv: '0',
        existing_customer: 'No',
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      {
        _id: new ObjectId(),
        first_name: 'Thomas',
        last_name: 'Jefferson',
        date: '3/1/24',
        source: 'FB',
        lead_type: 'Lead Form',
        call_duration: 'N/A',
        ltv: 3293,
        existing_customer: 'Yes',
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      {
        _id: new ObjectId(),
        first_name: 'Abraham',
        last_name: 'Lincoln',
        date: '3/1/24',
        source: 'FB',
        lead_type: 'Lead Form',
        call_duration: 'N/A',
        ltv: 0,
        existing_customer: 'No',
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      {
        _id: new ObjectId(),
        first_name: 'Andrew',
        last_name: 'Jackson',
        date: '3/1/24',
        source: 'Tiktok',
        lead_type: 'Lead Form',
        call_duration: 'N/A',
        ltv: 10278,
        existing_customer: 'Yes',
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      {
        _id: new ObjectId(),
        first_name: 'John',
        middle_name: 'F.',
        last_name: 'Kennedy',
        date: '3/1/24',
        source: 'Yelp',
        lead_type: 'Phone Call',
        call_duration: '1:33',
        ltv: 7432,
        existing_customer: 'Yes',
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      {
        _id: new ObjectId(),
        first_name: 'George',
        last_name: 'Washington',
        date: '3/1/24',
        source: 'Home Advisory',
        lead_type: 'Phone Call',
        call_duration: '4.77',
        ltv: 0,
        existing_customer: 'No',
        created_at: Date.now(),
        updated_at: Date.now(),
      },
    ];

    for (const md of mockdataDashboard) {
      await db.collection('dashboard').insertOne(md);
    }
    console.log('mock data Dashboard populated.');
  } catch (error) {
    console.error('Error inserting documents:', error);
  }
};

export const down = async () => {};
