// S3 multipart upload helpers — disabled until AWS SDK v3 migration.
// Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION to enable.

export const initiateMultipartUpload = async (
  _key: string
): Promise<string | undefined> => {
  return undefined;
};

export const uploadPart = async (
  _key: string,
  _uploadId: string,
  _partNumber: number,
  _data: Buffer | Uint8Array | Blob | string
): Promise<string | undefined> => {
  return undefined;
};

export const completeMultipartUpload = async (
  _key: string,
  _uploadId: string,
  _parts: { ETag: string; PartNumber: number }[]
): Promise<void> => {};
