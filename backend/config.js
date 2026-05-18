import 'dotenv/config'

export const {
  PORT = 3000,
  SALT_ROUNDS = 10,
  SECRET_JWT_KEY = 'clave_jsonwebtoken_maravillosa',
  NODE_ENV = 'development',

  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT = 3306
} = process.env
