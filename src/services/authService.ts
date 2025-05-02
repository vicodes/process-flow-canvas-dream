
import { PublicClientApplication, AuthenticationResult, AccountInfo } from "@azure/msal-browser";
import { getEnvironment } from "@/config/environments";

// Get environment configuration
const environment = getEnvironment();

// MSAL configuration
const msalConfig = {
  auth: {
    clientId: environment.auth.clientId,
    authority: environment.auth.authority,
    redirectUri: environment.auth.redirectUri,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Define login request
const loginRequest = {
  scopes: environment.auth.scopes,
};

// AuthService class to manage authentication
class AuthService {
  // Initialize authentication
  async init(): Promise<void> {
    try {
      await msalInstance.initialize();
      // Handle redirect after login if applicable
      await msalInstance.handleRedirectPromise();
    } catch (error) {
      console.error("Auth initialization error:", error);
    }
  }

  // Handle login
  async login(): Promise<AuthenticationResult> {
    try {
      const response = await msalInstance.loginPopup(loginRequest);
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Handle logout
  async logout(): Promise<void> {
    try {
      await msalInstance.logoutPopup({
        postLogoutRedirectUri: "/",
        mainWindowRedirectUri: "/",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Get current user
  getCurrentUser(): AccountInfo | null {
    const accounts = msalInstance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  // Acquire token silently
  async acquireTokenSilent(): Promise<AuthenticationResult | null> {
    const account = this.getCurrentUser();
    if (!account) {
      return null;
    }

    const silentRequest = {
      scopes: environment.auth.scopes,
      account: account,
    };

    try {
      const response = await msalInstance.acquireTokenSilent(silentRequest);
      return response;
    } catch (error) {
      console.error("Silent token acquisition error:", error);
      return null;
    }
  }

  // Development mode login function
  devLogin(): AuthenticationResult {
    // Mock authentication result for development
    const mockAuthResult: AuthenticationResult = {
      authority: "https://login.microsoftonline.com/common",
      account: {
        homeAccountId: 'dev-account-id',
        environment: 'development',
        tenantId: 'dev-tenant',
        username: 'dev@example.com',
        localAccountId: 'dev-local-id',
        name: 'Developer User',
        idTokenClaims: {}
      },
      idToken: 'mock-id-token',
      idTokenClaims: {
        aud: 'dev-audience',
        iss: 'dev-issuer',
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        name: 'Developer User',
        preferred_username: 'dev@example.com',
        oid: 'dev-object-id',
        sub: 'dev-subject',
        tid: 'dev-tenant-id'
      },
      accessToken: 'mock-access-token',
      fromCache: false,
      expiresOn: new Date(Date.now() + 3600 * 1000),
      extExpiresOn: new Date(Date.now() + 3600 * 1000),
      familyId: '',
      tokenType: 'Bearer',
      state: '',
      uniqueId: 'dev-unique-id',
      tenantId: 'dev-tenant-id',
      scopes: ['profile', 'openid', 'email'],
      correlationId: 'dev-correlation-id'
    };

    // Store the mock authentication result
    localStorage.setItem('msal.dev.user', JSON.stringify(mockAuthResult));
    
    return mockAuthResult;
  }

  // Check if the user is logged in (for development mode)
  isLoggedIn(): boolean {
    const authResult = localStorage.getItem('msal.dev.user');
    return !!authResult;
  }

  // Get the user's name from local storage (for development mode)
  getUserName(): string {
    const authResult = localStorage.getItem('msal.dev.user');
    if (authResult) {
      const authResultParsed = JSON.parse(authResult);
      return authResultParsed.account.name || 'Developer User';
    }
    return 'Developer User';
  }
}

// Create and export a singleton instance
export const authService = new AuthService();
