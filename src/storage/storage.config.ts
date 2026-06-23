export interface R2Config {
  endpoint: string;
  accessKeyId: string;
  accessKeySecret: string;
  bucketName: string;
}

export const getR2Config = (): R2Config => {
  return {
    endpoint: process.env.BB_ENDPOINT || '',
    accessKeyId: process.env.BB_ACCESS_KEY_ID || '',
    accessKeySecret: process.env.BB_SECRET_ACCESS_KEY || '',
    bucketName: process.env.BB_BUCKET_NAME || '',
  };
};
