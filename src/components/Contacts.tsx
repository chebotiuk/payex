import React, { memo } from "react";
import { Text, Avatar, Tip, Button, Box } from "grommet";
import { useWallets, usePrivy } from "@privy-io/react-auth";
import { parseEther } from "ethers";
import { base } from "viem/chains";
import { createWalletClient, custom, encodeFunctionData } from 'viem';
import { USDC_TRANSFER_ABI } from '../abi';

// Sample contacts list
const contacts = [
  { name: "Brandon Johnson", walletAddress: "0x190E782Ce37c224fe4FA039C03FD364a0E9588b5", twitter: "@bran" },
  { name: "Bob Smith", walletAddress: "0x513AC192AF1CAd0159530e59467F8abEEe7939B4", twitter: "@bobsmith" },
  { name: "Charlie Lee", walletAddress: "0x789...ijkl", twitter: "@charlielee" },
  { name: "Diana Ross", walletAddress: "0xabc...mnop", twitter: "@dianar" },
  { name: "Ethan Hunt", walletAddress: "0xdef...qrst", twitter: "@ethanh" },
];

export const Contacts = memo(() => {
  const { sendTransaction } = usePrivy();
  const { wallets } = useWallets();
  const wallet = wallets[0]; // Replace this with your desired wallet
                            // set Wallet switch with state

  const handleSendTransaction = async (contact: any) => {
    if (!wallet) return;

    await wallet.switchChain(base.id);

    const provider = await wallet.getEthereumProvider();
    const walletClient = createWalletClient({
      chain: base,
      transport: custom(provider),
    });

    const USDC_ADDRESS: `0x${string}` = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

    try {
      const hash = await walletClient.sendTransaction({
        account: wallet.address as `0x${string}`,
        to: USDC_ADDRESS,
        value: parseEther("0.01"),
        data: encodeFunctionData({
          abi: USDC_TRANSFER_ABI,
          functionName: "transfer",
          args: [contact.walletAddress, 100000n],
        }),
        kzg: undefined,
        chain: base
      });

      console.log("Transaction sent:", hash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };


  console.dir(wallets);
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
          {/* <Button size='xsmall' label="Send a payment" onClick={async () => {
            const amountInEther = "1.0";
            const amountInWei = parseEther(amountInEther);

            const transactionRequest = {
              to: contact.walletAddress,
              value: amountInWei,
            };
            const provider = await wallet?.getEthereumProvider()

            try {
              const transactionHash = await provider.request({
                method: 'eth_sendTransaction',
                params: [transactionRequest],
              });
              console.log('Transaction sent successfully:', transactionHash);
            } catch (error) {
              console.error('Error sending transaction:', error);
            }
          }} primary /> */}
          <Button size='xsmall' label="Send transaction" onClick={() => { handleSendTransaction(contact) }} primary />
        </Box>
      </Box>
    </Box>
  ));
});
