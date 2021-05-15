export const PORT = process.env.PORT || 80;
export const DATABASE_NAME = process.env.DATABASE_NAME || "GIDE";
export const DATABASE_URL = `mongodb://localhost:27017/${DATABASE_NAME}?readPreference=primary&appname=gide-graphql&ssl=false`;