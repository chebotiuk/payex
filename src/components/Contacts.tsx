import React from "react";
import { Text, Avatar, Tip, Button, Box } from "grommet";
import { useWallets } from "@privy-io/react-auth";

// Sample contacts list
const contacts = [
  { name: "Brandon Johnson", walletAddress: "0x190E782Ce37c224fe4FA039C03FD364a0E9588b5", twitter: "@bran" },
  { name: "Bob Smith", walletAddress: "0x513AC192AF1CAd0159530e59467F8abEEe7939B4", twitter: "@bobsmith" },
  { name: "Charlie Lee", walletAddress: "0x789...ijkl", twitter: "@charlielee" },
  { name: "Diana Ross", walletAddress: "0xabc...mnop", twitter: "@dianar" },
  { name: "Ethan Hunt", walletAddress: "0xdef...qrst", twitter: "@ethanh" },
];

export const Contacts = () => {
  const { wallets } = useWallets();
  const wallet = wallets[0]; // Replace this with your desired wallet
                            // set Wallet switch with state

                            console.dir(wallet);
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
          <Button size='xsmall' label="Send a payment" onClick={async () => {
            const provider = await wallet.getEthereumProvider();

            const transactionRequest = {
              to: contact.walletAddress,
              value: 0.001,
            };
            console.log(transactionRequest);
            const transactionHash = await provider.request({
              method: 'eth_sendTransaction',
              params: [transactionRequest],
            });
          }} primary />
        </Box>
      </Box>
    </Box>
  ));
};
