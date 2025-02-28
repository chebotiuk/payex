import React, { memo, useEffect, useState } from "react";
import { Text, Avatar, Tip, Button, Box } from "grommet";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios

import { useWallets } from "@privy-io/react-auth";

export const Contacts = memo(() => {
  const { wallets } = useWallets();
  const wallet = wallets[0]; // Replace this with your desired wallet
  const [contacts, setContacts] = useState([]); // State to hold contacts data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Fetch contacts from the API when the component mounts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
        setContacts(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching contacts");
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  console.dir(wallets);

  if (loading) {
    return <Text>Loading...</Text>; // Display loading text while fetching data
  }

  if (error) {
    return <Text>{error}</Text>; // Display error message if there is an issue
  }

  // do not show my account
  return contacts.map((contact, index) => contact.walletAddress !== wallet.address as string && (
    <Box direction="row" align="center" gap="small" key={index} pad="small" style={{ flex: "0 1 auto", borderBottom: "1px grey solid" }}>
      <Tip content={`Twitter: ${contact.twitter}`} dropProps={{ align: { top: "bottom" } }}>
        <Avatar size="medium" background="brand" style={{ cursor: 'pointer' }}>
          {contact.name.charAt(0)}
        </Avatar>
      </Tip>
      <Box flex="grow">
        <Text weight="bold" style={{ cursor: 'pointer' }}>{contact.name}</Text>
        <Box direction='row' justify="between" align='center'>
          <Text size="small" color="dark-6">
            {contact.walletAddress}
          </Text>
          <Box direction='column' gap="xsmall">
            <Link to={`/send?address=${contact.walletAddress}`}>
              <Button size='xsmall' label="Send transaction" primary />
            </Link>
            <Link to={`/send-invoice?address=${contact.walletAddress}`}>
              <Button size='xsmall' label="Send invoice" primary />
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  ));
});
