import React from "react";
import { Text, Avatar, Tip, Button, Box } from "grommet";

// Sample contacts list
const contacts = [
  { name: "Alice Johnson", walletAddress: "0x123...abcd", twitter: "@alicej" },
  { name: "Bob Smith", walletAddress: "0x456...efgh", twitter: "@bobsmith" },
  { name: "Charlie Lee", walletAddress: "0x789...ijkl", twitter: "@charlielee" },
  { name: "Diana Ross", walletAddress: "0xabc...mnop", twitter: "@dianar" },
  { name: "Ethan Hunt", walletAddress: "0xdef...qrst", twitter: "@ethanh" },
];

export const Contacts = () => {
  return contacts.map((contact, index) => (
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
          <Button size='xsmall' label="Send a payment" onClick={() => { }} primary />
        </Box>
      </Box>
    </Box>
  ));
};
