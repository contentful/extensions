import { Hash } from './../interfaces';
import { createClient } from '@commercetools/sdk-client';
import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth';
import { createHttpMiddleware } from '@commercetools/sdk-middleware-http';
import { createQueueMiddleware } from '@commercetools/sdk-middleware-queue';

export function makeCommerceToolsClient({
  parameters: {
    installation: { apiEndpoint, authApiEndpoint, projectKey, clientId, clientSecret }
  }
}: Hash) {
  const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: authApiEndpoint,
    projectKey: projectKey,
    credentials: {
      clientId: clientId,
      clientSecret: clientSecret
    }
  });

  const httpMiddleware = createHttpMiddleware({
    host: apiEndpoint
  });

  const queueMiddleware = createQueueMiddleware({
    concurrency: 5
  });

  return createClient({
    middlewares: [authMiddleware, httpMiddleware, queueMiddleware]
  });
}
