
export interface StorageProvider {
    /**
     * Uploads a file to the storage.
     * @param ownerId - The ID of the owner of the file.
     * @param storedName - The unique name of the file to be stored.
     * @param buffer - The file content as a Buffer.
     * @returns The relative path or key where the file is stored.
     */
    upload(ownerId: string, storedName: string, buffer: Buffer): Promise<string>;

    /**
     * Downloads a file from the storage.
     * @param pathOrKey - The relative path or key of the file.
     * @returns A ReadableStream to read the file content.
     */
    download(pathOrKey: string): Promise<ReadableStream>;

    /**
     * Deletes a file from the storage.
     * @param pathOrKey - The relative path or key of the file.
     */
    delete(pathOrKey: string): Promise<void>;

    /**
     * Checks if a file exists in the storage.
     * @param pathOrKey - The relative path or key of the file.
     */
    exists(pathOrKey: string): Promise<boolean>;

    /**
     * Generates a signed URL for direct download or viewing.
     * @param pathOrKey - The relative path or key of the file.
     * @param expiresSeconds - (Optional) The duration for which the URL is valid.
     */
    getSignedDownloadUrl(pathOrKey: string, expiresSeconds?: number): Promise<string>;
}
