import dotenv from 'dotenv';

dotenv.config();

/**
 * @type {{
 *   baseURL: string,
 *   httpCredentials: { username: string, password: string }
 * }}
 */
export const envConfig = {
  baseURL: process.env.BASE_URL || '',
  httpCredentials: {
    username: process.env.HTTP_CREDENTIALS_USERNAME || '',
    password: process.env.HTTP_CREDENTIALS_PASSWORD || '',
  },
};
