import * as dotenv from 'dotenv';
import * as path from 'path';

const envPath =
  process.env.NODE_ENV === 'dev' ? path.join(__dirname, `../envs/dev.env`) : ``;

dotenv.config({
  path: envPath,
});

export default () => {
  const output = {
    HOST: process.env.HOST,
    DBPORT: parseInt(process.env.PORT, 10) || 3306,
    DB_DATABASE: process.env.DATABASE,
    DB_USERNAME: process.env.USERNAME,
    DB_PASSWORD: process.env.PASSWORD,
  };
  return output;
};
