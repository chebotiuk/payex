import React from "react";
import { usePrivy } from "@privy-io/react-auth";

import "./App.css";
import { Providers } from "./Providers";

function App() {
  return (
    <Providers>
      <Main />
    </Providers>
  );
}

function Main() {
  const { login, logout, ready, authenticated, user } = usePrivy();

  if (!ready) return <p>Loading...</p>;

  return (
    <div className="App">
      <h1>Welcome to My App</h1>
      
      {authenticated ? (
        <>
          {/* Ensure user?.email is treated as a string */}
          <p>Logged in as: {user?.email?.toString() ?? "Unknown User"}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Login with Privy</button>
      )}
    </div>
  );
}

export default App;
