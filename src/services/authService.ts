
import { PublicClientApplication, AuthenticationResult, AccountInfo } from '@azure/msal-browser';
import { getEnvironment } from '@/config/environments';
import apiClient from './apiClient';
import { toast } from 'sonner';

// Initialize MSAL configuration
const msalConfig = {
  auth: {
    clientId: getEnvironment().auth.clientId,
    authority: getEnvironment().auth.authority,
    redirectUri: getEnvironment().auth.redirectUri,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

// Create MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

// Mock user for development environment
const mockDevUser: AccountInfo = {
  homeAccountId: 'dev-account',
  localAccountId: 'dev-local-account',
  environment: 'development',
  tenantId: 'dev-tenant',
  username: 'dev@example.com',
  name: 'Development User',
};

export const authService = {
  // Initialize MSAL
  init: async () => {
    if (getEnvironment().name === 'Development') {
      // In development mode, check if we have a stored dev user
      const storedUser = localStorage.getItem('dev-user');
      if (storedUser) {
        // If the user exists, we're already "logged in"
        return;
      }
      return;
    }
    
    await msalInstance.initialize();
    await msalInstance.handleRedirectPromise()
      .then((response) => {
        if (response) {
          msalInstance.setActiveAccount(response.account);
          apiClient.setAuthToken(response.accessToken);
          
          // Show success notification
          toast.success('Successfully logged in');
        }
      })
      .catch((error) => {
        console.error('MSAL Redirect Error:', error);
        toast.error('Login failed. Please try again.');
      });
  },

  // Login function
  login: async () => {
    try {
      await msalInstance.loginRedirect({
        scopes: getEnvironment().auth.scopes,
      });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      throw error;
    }
  },

  // Development login function - bypass MSAL
  devLogin: async () => {
    try {
      // Store the mock user in localStorage
      localStorage.setItem('dev-user', JSON.stringify(mockDevUser));
      // Set a mock token for API client
      apiClient.setAuthToken('dev-mock-token');
      toast.success('Development login successful');
      return Promise.resolve();
    } catch (error) {
      console.error('Dev login error:', error);
      toast.error('Development login failed');
      throw error;
    }
  },

  // Logout function
  logout: async () => {
    try {
      if (getEnvironment().name === 'Development') {
        // In development mode, just clear the stored user
        localStorage.removeItem('dev-user');
        apiClient.setAuthToken(null);
        toast.success('Successfully logged out');
        return;
      }
      
      const account = msalInstance.getActiveAccount();
      if (account) {
        await msalInstance.logoutRedirect({
          account,
        });
        apiClient.setAuthToken(null);
        toast.success('Successfully logged out');
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
      throw error;
    }
  },

  // Get current user
  getCurrentUser: (): AccountInfo | null => {
    if (getEnvironment().name === 'Development') {
      // In development mode, check if we have a stored dev user
      const storedUser = localStorage.getItem('dev-user');
      if (storedUser) {
        return JSON.parse(storedUser) as AccountInfo;
      }
      return null;
    }
    
    return msalInstance.getActiveAccount();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (getEnvironment().name === 'Development') {
      return !!localStorage.getItem('dev-user');
    }
    
    const account = msalInstance.getActiveAccount();
    return !!account;
  },

  // Acquire token silently
  acquireToken: async (): Promise<AuthenticationResult | null> => {
    if (getEnvironment().name === 'Development') {
      // In development mode, return a mock token
      if (localStorage.getItem('dev-user')) {
        return {
          authority: 'dev-authority',
          uniqueId: 'dev-unique-id',
          tenantId: 'dev-tenant',
          scopes: [],
          account: mockDevUser,
          idToken: 'dev-id-token',
          idTokenClaims: {},
          accessToken: 'dev-access-token',
          fromCache: false,
          expiresOn: new Date(Date.now() + 3600 * 1000), // Token expires in 1 hour
          extExpiresOn: new Date(Date.now() + 3600 * 1000),
          state: '',
          familyId: '',
          tokenType: 'Bearer',
          correlationId: ''
        };
      }
      return null;
    }
    
    const account = msalInstance.getActiveAccount();
    if (!account) {
      return null;
    }

    try {
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: getEnvironment().auth.scopes,
        account,
      });
      
      if (tokenResponse) {
        apiClient.setAuthToken(tokenResponse.accessToken);
      }
      
      return tokenResponse;
    } catch (error) {
      console.error('Token acquisition error:', error);
      // Token expired or other error, try interactive
      try {
        const tokenResponse = await msalInstance.acquireTokenRedirect({
          scopes: getEnvironment().auth.scopes,
        });
        return tokenResponse;
      } catch (interactiveError) {
        console.error('Interactive token acquisition error:', interactiveError);
        toast.error('Your session has expired. Please log in again.');
        return null;
      }
    }
  },
};

export default authService;
