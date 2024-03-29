export const PORT = process.env.PORT || 80;
export const JWT_SECRET = process.env.JWT_SECRET || "DEBUG_JWT_SECRET";
export const DATABASE_NAME = process.env.DATABASE_NAME || "GIDE";
export const MONGODB_SERVER_IP = process.env.MONGODB_SERVER_IP || "localhost:27017";
export const DATABASE_URL = `mongodb+srv://${MONGODB_SERVER_IP}/${DATABASE_NAME}?retryWrites=true&w=majority`;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "12345678";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ""
export const ADMIN_EMAIL_PASSWORD = process.env.ADMIN_EMAIL_PASSWORD || "";