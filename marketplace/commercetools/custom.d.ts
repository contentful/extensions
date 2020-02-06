declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '@commercetools/api-request-builder';
declare module '@commercetools/sdk-client';
declare module '@commercetools/sdk-middleware-auth';
declare module '@commercetools/sdk-middleware-http';
declare module '@commercetools/sdk-middleware-queue';
