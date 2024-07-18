import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const BUCKET_NAME = "blackjack-sim-cache";

export const initiateMultipartUpload = async (key: string) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: "application/json",
  };

  const { UploadId } = await s3.createMultipartUpload(params).promise();
  return UploadId;
};

export const uploadPart = async (
  key: string,
  uploadId: string,
  partNumber: number,
  data: Buffer | Uint8Array | Blob | string
) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    PartNumber: partNumber,
    UploadId: uploadId,
    Body: data,
  };

  const { ETag } = await s3.uploadPart(params).promise();
  return ETag;
};

export const completeMultipartUpload = async (
  key: string,
  uploadId: string,
  parts: { ETag: string; PartNumber: number }[]
) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: {
      Parts: parts,
    },
  };

  await s3.completeMultipartUpload(params).promise();
};
