import { StorageProvider } from "./StorageProvider";
import { LocalStorage } from "./LocalStorage";
import { S3Storage } from "./S3Storage";

const driver = process.env.STORAGE_DRIVER || "local";

let storage: StorageProvider;

switch (driver.toLowerCase()) {
    case "s3":
        storage = new S3Storage();
        break;
    case "local":
    default:
        storage = new LocalStorage();
        break;
}

export { storage };
export type { StorageProvider };
