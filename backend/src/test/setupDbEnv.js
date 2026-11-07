// db project only: load backend/.env so DB_HOST, DB_USER, DB_PASSWORD and DB_NAME_TEST come from it.
// setupEnv.js runs next and forces NODE_ENV=test and throwaway JWT secrets.
import dotenv from 'dotenv';

dotenv.config({ quiet: true });
