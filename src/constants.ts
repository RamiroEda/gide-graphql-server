export const PORT = process.env.PORT || 80;
export const JWT_SECRET = process.env.JWT_SECRET || "DEBUG_JWT_SECRET";
export const DATABASE_NAME = process.env.DATABASE_NAME || "GIDE";
export const MONGODB_SERVER_IP = process.env.MONGODB_SERVER_IP || "localhost";
export const DATABASE_URL = `mongodb://${MONGODB_SERVER_IP}:27017/${DATABASE_NAME}?readPreference=primary&appname=gide-graphql`;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "12345678";
