# Next.js with Azure Entra ID Authentication

This project demonstrates how to implement authentication in a Next.js app using Azure Entra ID. It includes frontend authentication with MSAL and backend token verification using JWKS.

## Prerequisites

- An **Azure Entra ID (Azure AD)** tenant
- A **Next.js** project
- **Node.js** installed on your local machine
- An **Azure account** with permissions to register applications

## Setting Up Azure Entra ID

### 1. Register the Backend Application

1. Go to the [Azure Portal](https://portal.azure.com).
2. Navigate to **Azure Active Directory** > **App Registrations**.
3. Click **New Registration**.
4. Give your app a name (e.g., `NextJS Backend API`).
5. Choose **Accounts in this organizational directory only**.
6. Click **Register**.
7. Navigate to **Expose an API**.
   - Click **Add a Scope**.
   - Set the scope name (e.g., `access_as_user`).
   - Set **Who can consent** to `Admins and users`.
   - Set the **Admin consent display name** and **description**.
   - Click **Add Scope**.
8. Copy the **Application (client) ID**, which will be used as `NEXT_PUBLIC_AZURE_BACKEND_APP_ID`.

### 2. Register the Frontend Application

1. In **Azure AD**, go to **App Registrations** and click **New Registration**.
2. Name it (e.g., `NextJS Frontend`).
3. Choose **Accounts in this organizational directory only**.
4. Under **Redirect URI**, select **Single Page Application (SPA)** and enter `http://localhost:3000`.
5. Click **Register**.
6. Navigate to **API Permissions**.
   - Click **Add a permission** > **My APIs**.
   - Select your backend API app.
   - Choose the scope (e.g., `access_as_user`) and grant admin consent.
7. Copy the **Application (client) ID**, which will be used as `NEXT_PUBLIC_AZURE_CLIENT_ID`.
8. Copy the **Directory (tenant) ID**, which will be used as `NEXT_PUBLIC_AZURE_TENANT_ID`.

## Setting Up the Next.js Project

### 1. Dependencies

This project requires the following dependencies:

- **@azure/msal-browser**: Handles authentication flows with Azure Entra ID in the browser.
- **@azure/msal-react**: Provides React hooks and components to manage authentication state.
- **jwks-rsa**: Fetches and validates JSON Web Key Sets (JWKS) for token verification.
- **jsonwebtoken**: Decodes and verifies JSON Web Tokens (JWTs) for authentication.
- **dotenv**: Manages environment variables securely in the project.

### 2. Configure Environment Variables

Create a `.env` file in the root of your Next.js project and add the following variables:

```sh
NEXT_PUBLIC_AZURE_CLIENT_ID=<Your Frontend App Client ID>
NEXT_PUBLIC_AZURE_TENANT_ID=<Your Azure Tenant ID>
NEXT_PUBLIC_AZURE_BACKEND_API_SCOPE=<Your Backend API Scope>
NEXT_PUBLIC_AZURE_BACKEND_APP_ID=<Your Backend App Client ID>
```

### 3. Project Files Configuration

- **Authentication Configuration**: [`auth.config.ts`](./auth.config.ts)
- **MSAL Provider in Layout**: [`layout.tsx`](./layout.tsx)
- **Authentication Handling in Home Component**: [`home.tsx`](./home.tsx)
- **Token Verification in Backend API**: [`api/auth.ts`](./api/auth.ts)

## Running the Project

```sh
npm run dev
```

Your Next.js app is now integrated with Azure Entra ID authentication! 

To learn more and go further with authentication in Next.js using Azure Entra ID, check out the following resources:
- [Microsoft Identity Platform Documentation](https://learn.microsoft.com/en-us/azure/active-directory/develop/)
- [MSAL.js Documentation](https://learn.microsoft.com/en-us/azure/active-directory/develop/msal-overview)
- [JWKS and JSON Web Token (JWT) Validation](https://auth0.com/docs/secure/tokens/json-web-tokens/json-web-key-sets)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
- [Azure App Registration Overview](https://learn.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)