import { AwsClient } from "aws4fetch";

interface Env {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_REGION: string;
  S3_BUCKET_NAME: string;
  EXPIRATION_TIME: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Remove the check for /s3/ prefix, use entire pathname as key without leading slash
    const key = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;

    if (!key) {
      return new Response("Bad Request: Missing S3 object key", { status: 400 });
    }

    try {
      const aws = new AwsClient({
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        region: env.AWS_REGION,
        service: "s3",
      });

      const unsignedUrl = `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${encodeURIComponent(key)}?X-Amz-Expires=${env.EXPIRATION_TIME}`;
			console.log("unsignedUrl", unsignedUrl);
      // Generate signed URL for GET request with query signing
      const signedRequest = await aws.sign(
        new Request(unsignedUrl),
        {
          aws: {
            signQuery: true,
          },
        }
      );

			console.log("signedRequest", signedRequest.url);

      // The signedRequest.url contains the signed URL
      return await fetch(signedRequest.url)
    } catch (error) {
      return new Response("Internal Server Error: " + String(error), { status: 500 });
    }
  },
};
