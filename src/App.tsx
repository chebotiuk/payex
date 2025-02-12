import React from "react";
import { Grommet, Box, Button, Card, CardBody, CardFooter, Text, Heading } from "grommet";
import { usePrivy } from "@privy-io/react-auth";
import { grommet } from "grommet/themes";

import "./App.css";
import { Providers } from "./Providers";
import { SkeletFaded } from './SkeletFaded';

function App() {
  return (
    <Grommet theme={grommet} full>
      <Providers>
        <Main />
      </Providers>
    </Grommet>
  );
}

function Main() {
  const { login, logout, ready, authenticated, user } = usePrivy();

  console.log("User data", user);

  return (
    <Box fill align="center" justify="center" pad="medium" className="App">
      {ready ? (
        <Card width="large" background="light-1" elevation="large" pad="medium">
          <CardBody>
            {authenticated ? (
              <>
                <Heading level={3} size="small">Logged in as: </Heading>
                <Text>{user?.id ?? "Unknown User"}</Text>
              </>
            ) : (
              <Text size="large">Welcome! Please log in.</Text>
            )}
            <br />
            <Heading level={3} size="small" color="brand">
              Linked accounts:
            </Heading>
            {user?.linkedAccounts.map((account) => {
              const { address, type, walletClientType } = account as any;
              return (
                <>
                  <Text>Address: {address}</Text>
                  <Text>Type: {type}</Text>
                  <Text>Client type: {walletClientType}</Text>
                </>
              )})
            }
          </CardBody>
          <CardFooter pad={{ horizontal: "medium", vertical: "medium" }} justify="center">
            {authenticated ? (
              <Button label="Logout" onClick={logout} primary color="status-critical" />
            ) : (
              <Button label="Login with Privy" onClick={login} primary color="brand" />
            )}
          </CardFooter>
        </Card>
      ) : (
        <SkeletFaded />
      )}
    </Box>
  );
}

function Loading() {
  return (
    <Box fill align="center" justify="center">
      <Text size="large">Loading...</Text>
    </Box>
  );
}

export default App;
