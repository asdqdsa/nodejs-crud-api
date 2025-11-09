import dotenv from 'dotenv';

dotenv.config({
  path:
    process.env.NODE_ENV === 'production'
      ? process.cwd() + '/.env.production'
      : process.cwd() + '/.env.development',
});

export const config = {
  port: process.env.PORT || 4000,
};
