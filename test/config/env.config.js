import dotenv from 'dotenv';

dotenv.config();

/**
 * @type {{
 *   baseURL: string,
 *   httpCredentials: { username: string, password: string },
 *   user: { email: string, password: string },
 *   storageStatePath: string,
 * }}
 */
export const envConfig = {
  baseURL: process.env.BASE_URL || '',
  httpCredentials: {
    username: process.env.HTTP_CREDENTIALS_USERNAME || '',
    password: process.env.HTTP_CREDENTIALS_PASSWORD || '',
  },
  user: {
    email: process.env.USER_EMAIL || '',
    password: process.env.USER_PASSWORD || '',
  },
  storageStatePath: 'playwright/.auth/user.json',
};
