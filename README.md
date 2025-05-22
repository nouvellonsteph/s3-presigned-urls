# S3 Presigned URLs Cloudflare Worker

This project contains a Cloudflare Worker that generates signed URLs for objects stored in an AWS S3 bucket. The worker signs requests dynamically using the `aws4fetch` library and proxies requests to S3, enabling caching via Cloudflare without using the Cache API explicitly.

## Deploy with Cloudflare workers

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Fnouvellonsteph%2Fs3-presigned-urls)

## Features

- Signs S3 object URLs on the fly using AWS Signature Version 4.
- Removes the need for clients to have AWS credentials.
- Supports configurable URL expiration time.
- Caches responses using Cloudflare's default caching mechanism.
- Configurable entirely via `wrangler.jsonc` environment variables.

## Setup

1. Clone the repository.

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure your AWS credentials and S3 bucket in `wrangler.jsonc`:

   ```jsonc
   {
     "vars": {
       "AWS_ACCESS_KEY_ID": "your-access-key-id",
       "AWS_SECRET_ACCESS_KEY": "your-secret-access-key",
       "AWS_REGION": "your-aws-region",
       "S3_BUCKET_NAME": "your-s3-bucket-name",
       "EXPIRATION_TIME": "900" // URL expiration time in seconds
     }
   }
   ```

4. Run the worker locally for development:

   ```bash
   wrangler dev
   ```

5. Deploy the worker:

   ```bash
   wrangler deploy
   ```

## Usage

- Make requests to the worker with the path corresponding to the S3 object key. For example, to get a signed URL for the object `images/photo.jpg`, request:

  ```
  https://your-worker-domain/images/photo.jpg
  ```

- The worker will return the object while signing the request with AWS Signature Version 4.

## Dependencies

- [aws4fetch](https://www.npmjs.com/package/aws4fetch) - AWS Signature Version 4 signing library for Fetch API.

