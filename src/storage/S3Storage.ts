import { StorageProvider } from "./StorageProvider";
import { S3Client, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";

export class S3Storage implements StorageProvider {
    private client: S3Client;
    private bucket: string;

    constructor() {
        this.bucket = process.env.S3_BUCKET || "vaultdrive";
        this.client = new S3Client({
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION || "us-east-1",
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY || "",
                secretAccessKey: process.env.S3_SECRET_KEY || "",
            },
            forcePathStyle: true, // Required for MinIO
        });
    }

    async upload(ownerId: string, storedName: string, buffer: Buffer): Promise<string> {
        const key = `${ownerId}/${storedName}`;

        const upload = new Upload({
            client: this.client,
            params: {
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
            },
        });

        await upload.done();
        return key;
    }

    async download(pathOrKey: string): Promise<ReadableStream> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: pathOrKey,
        });

        try {
            const response = await this.client.send(command);
            if (!response.Body) {
                throw new Error("Empty response body from S3");
            }

            return response.Body.transformToWebStream() as ReadableStream;
        } catch (error: any) {
            console.error(`[S3Storage] download error for ${pathOrKey}:`, error);
            throw new Error(`File not found or inaccessible in S3: ${pathOrKey}`);
        }
    }

    async delete(pathOrKey: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: this.bucket,
            Key: pathOrKey,
        });

        try {
            await this.client.send(command);
        } catch (error: any) {
            console.error(`[S3Storage] delete error for ${pathOrKey}:`, error);
        }
    }

    async exists(pathOrKey: string): Promise<boolean> {
        const command = new HeadObjectCommand({
            Bucket: this.bucket,
            Key: pathOrKey,
        });

        try {
            await this.client.send(command);
            return true;
        } catch (error: any) {
            if (error.name === "NotFound") {
                return false;
            }
            console.error(`[S3Storage] exists error for ${pathOrKey}:`, error);
            return false;
        }
    }

    async getSignedDownloadUrl(pathOrKey: string, expiresSeconds = 3600): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucket,
            Key: pathOrKey,
        });

        return await getSignedUrl(this.client, command, { expiresIn: expiresSeconds });
    }
}
