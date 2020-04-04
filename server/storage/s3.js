const AWS = require('aws-sdk');
const config = require('../config');

const s3 = new AWS.S3({
  accessKeyId: config.s3_access_key,
  secretAccessKey: config.s3_secret_access_key,
  endpoint: config.s3_endpoint,
  s3ForcePathStyle: true, // needed with minio?
  signatureVersion: 'v4'
});

class S3Storage {
  constructor(config, log) {
    this.bucket = config.s3_bucket;
    this.log = log;
  }

  async length(id) {
    const result = await s3
      .headObject({ Bucket: this.bucket, Key: id })
      .promise();
    return result.ContentLength;
  }

  getStream(id) {
    return s3.getObject({ Bucket: this.bucket, Key: id }).createReadStream();
  }

  set(id, file) {
    const upload = s3.upload({
      Bucket: this.bucket,
      Key: id,
      Body: file
    });
    file.on('error', () => upload.abort());
    return upload.promise();
  }

  del(id) {
    return s3.deleteObject({ Bucket: this.bucket, Key: id }).promise();
  }

  ping() {
    return s3.headBucket({ Bucket: this.bucket }).promise();
  }
}

module.exports = S3Storage;
