
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

export const authService = {
  // Initialize MSAL
  init: async () => {
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

  // Logout function
  logout: async () => {
    try {
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
    return msalInstance.getActiveAccount();
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const account = msalInstance.getActiveAccount();
    return !!account;
  },

  // Acquire token silently
  acquireToken: async (): Promise<AuthenticationResult | null> => {
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
