import React, { memo, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Grommet, Box, Button, Card, CardBody, CardFooter, Text, Nav, Anchor, CardHeader } from "grommet";
import { Home, User, Grow, Atm, History } from "grommet-icons";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { grommet } from "grommet/themes";

import "./App.css";
import { Providers } from "./Providers";
import { SkeletFaded } from './SkeletFaded';
import { Contacts } from './components/Contacts';
import { Account } from './components/Account';
import { Balance } from './components/Balance';
import { FiatOnRamp } from './components/FiatOnRamp';
import { Send } from './components/Send';
import { Invoices } from './components/Invoices';
import { SendInvoice } from './components/SendInvoice';
import axios from 'axios';
import { MyInvoices } from './components/MyInvoices';

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

  useEffect(() => {
    if (!user) return;
    axios.get(`${process.env.REACT_APP_API_URL}/auth?address=` + user.wallet?.address || '');
  }, [user])

  return (
    <Box fill align="center" justify="center" pad="medium" className="App">
      {ready ? (
        <Card width="large" background="light-1" elevation="large" pad="medium">
          <CardHeader pad="medium">
            <Nav direction="row" gap="medium">
              {/* @ts-ignore */}
              <Anchor icon={<Home />} label="Home" as={Link} to="/" />
              {/* @ts-ignore */}
              <Anchor icon={<User />} label="Contacts" as={Link} to="/contacts" />
              {/* @ts-ignore */}
              <Anchor icon={<Grow />} label="Balance" as={Link} to="/balance" />
              {/* @ts-ignore */}
              <Anchor icon={<Atm />} label="Invoices" as={Link} to="/invoices" />
              {/* @ts-ignore */}
              <Anchor icon={<History />} label="Issued docs" as={Link} to="/myinvoices" />
            </Nav>
          </CardHeader>
          <CardBody>
            {authenticated ? (
              <Routes>
                <Route path="/" element={<Account user={user} />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/balance" element={<Balance />} />
                <Route path="/onramp" element={<FiatOnRamp />} />
                <Route path="/send" element={<Send />} />
                <Route path="/send-invoice" element={<SendInvoice />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/myinvoices" element={<MyInvoices />} />
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
