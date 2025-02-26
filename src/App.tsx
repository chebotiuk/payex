import React, { memo } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Grommet, Box, Button, Card, CardBody, CardFooter, Text, Nav, Anchor, CardHeader } from "grommet";
import { Home, User } from "grommet-icons";
import { usePrivy } from "@privy-io/react-auth";
import { grommet } from "grommet/themes";

import "./App.css";
import { Providers } from "./Providers";
import { SkeletFaded } from './SkeletFaded';
import { Contacts } from './components/Contacts';
import { Account } from './components/Account';

const App = memo(function() {
  return (
    <Grommet theme={grommet} full>
      <Providers>
        <Router>
          <Main />
        </Router>
      </Providers>
    </Grommet>
  );
});

const Main = memo(function() {
  const { login, logout, ready, authenticated, user } = usePrivy();

  console.log("User data", user);

  return (
    <Box fill align="center" justify="center" pad="medium" className="App">
      {ready ? (
        <Card width="large" background="light-1" elevation="large" pad="medium">
          <CardHeader pad="medium">
            <Nav direction="row" gap="medium">
              <Anchor
                icon={<Home />}
                label="Home"
                as={() => <Link to="/">Home</Link>}
              />
              <Anchor
                icon={<User />}
                label="Contacts"
                as={() => <Link to="/contacts">Contacts</Link>}
              />
            </Nav>
          </CardHeader>
          <CardBody>
            {authenticated ? (
              <Routes>
                <Route path="/" element={<Account user={user} />} />
                <Route path="/contacts" element={<Contacts />} />
              </Routes>
            ) : (
              <Text size="large">Welcome! Please log in.</Text>
            )}
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
});

export default App;
