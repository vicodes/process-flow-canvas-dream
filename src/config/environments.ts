
export type Environment = {
  name: string;
  apiUrl: string;
  auth: {
    clientId: string;
    authority: string;
    redirectUri: string;
    scopes: string[];
  };
};

export type EnvironmentConfig = {
  current: string;
  environments: Record<string, Environment>;
};

const config: EnvironmentConfig = {
  current: import.meta.env.VITE_ENVIRONMENT || 'development',
  environments: {
    development: {
      name: 'Development',
      apiUrl: 'https://dev-api.orchestt.example.com',
      auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '',
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || ''}`,
        redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
        scopes: ['User.Read', 'api://your-client-id/access_as_user'],
      },
    },
    staging: {
      name: 'Staging',
      apiUrl: 'https://stage-api.orchestt.example.com',
      auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '',
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || ''}`,
        redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
        scopes: ['User.Read', 'api://your-client-id/access_as_user'],
      },
    },
    production: {
      name: 'Production',
      apiUrl: 'https://api.orchestt.example.com',
      auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID || '',
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID || ''}`,
        redirectUri: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
        scopes: ['User.Read', 'api://your-client-id/access_as_user'],
      },
    },
  },
};

export const getEnvironment = (): Environment => {
  const currentEnv = config.current;
  if (!config.environments[currentEnv]) {
    console.warn(`Environment ${currentEnv} not found. Using development instead.`);
    return config.environments.development;
  }
  return config.environments[currentEnv];
};

export const getCurrentEnvironment = (): string => {
  return config.current;
};

export default config;
