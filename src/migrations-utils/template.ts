import { getDb } from './db';

export const up = async () => {
  const db = await getDb();
};

export const down = async () => {
  const db = await getDb();
  /*
      Code you downgrade script here!
   */
};
