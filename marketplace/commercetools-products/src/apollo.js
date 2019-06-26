import SdkAuth, { TokenProvider } from '@commercetools/sdk-auth';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';

export async function getApolloClient({ authUri, projectKey, clientId, apiUri, clientSecret }) {
  // @todo how do I get the refreshed token?
  const tokenProvider = new TokenProvider({
    sdkAuth: new SdkAuth({
      host: authUri,
      projectKey,
      credentials: {
        clientId,
        clientSecret
      }
    }),
    fetchTokenInfo: sdkAuth => sdkAuth.clientCredentialsFlow()
  });

  const accessToken = await tokenProvider.getAccessToken();

  const httpLink = createHttpLink({
    uri: `${apiUri}/${projectKey}/graphql`
  });

  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : ''
      }
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });
}
