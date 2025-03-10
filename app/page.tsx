"use client";
import { useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";

export default function Home() {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Wait for MSAL instance to be initialized
  useEffect(() => {
    instance.initialize().then(() => {
      setIsInitialized(true);
    });
  }, [instance]);

  // Function to acquire token silently
  const acquireToken = async () => {
    if (!isInitialized || accounts.length === 0) return;

    try {
      const response = await instance.acquireTokenSilent({
        scopes: [process.env.NEXT_PUBLIC_AZURE_BACKEND_API_SCOPE!],
        account: accounts[0],
      });
      setToken(response.accessToken);
    } catch (error) {
      console.error("Silent token acquisition failed, acquiring via popup", error);
    }
  };

  const handleLogin = async () => {
    if (!isInitialized) return;

    try {
      const response = await instance.acquireTokenPopup({
        scopes: [process.env.NEXT_PUBLIC_AZURE_BACKEND_API_SCOPE!],
      });
      setToken(response.accessToken);
    } catch (error) {
      console.error("Login Error", error);
    }
  };

  const handleLogout = () => {
    instance.logoutPopup();
    setUser(null);
    setProducts([]);
    setToken(null);
  };

  const fetchUserInfo = () => {
    if (accounts.length > 0) {
      setUser(accounts[0]);
    }
  };

  const fetchProtectedData = async () => {
    if (!token) return;

    try {
      const response = await fetch("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error("Failed to fetch data", await response.text());
      }
    } catch (error) {
      console.error("Fetch Error", error);
    }
  };

  useEffect(() => {
    if (isInitialized) {
      fetchUserInfo();
      acquireToken();
    }
  }, [accounts, isInitialized]);

  return (
    <div>
      <h1>Microsoft Entra ID Authentication</h1>

      {user ? (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.username}</p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={fetchProtectedData}>Fetch Products</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Microsoft</button>
      )}

      <h2>Protected Data:</h2>
      <ul>
        {products.length > 0 ? products.map((p, i) => (
          <li key={i}>{p.name} - ${p.price}</li>
        )) : <p>No data available.</p>}
      </ul>
    </div>
  );
}
