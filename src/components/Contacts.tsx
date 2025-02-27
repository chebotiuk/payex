import React, { memo } from "react";
import { Text, Avatar, Tip, Button, Box } from "grommet";
import { ethers } from "ethers";
import { useWallets } from "@privy-io/react-auth";
import { base } from "viem/chains";
import { createWalletClient, custom, encodeFunctionData } from 'viem';
import { INVOICE_CONTRACT_ABI, USDC_TRANSFER_ABI } from '../abi';

// Sample contacts list
const contacts = [
  { name: "Brandon Johnson", walletAddress: "0x6E5a3d13F1c4A163965baef0AA11D7717B877478", twitter: "@bran" },
  { name: "Bob Smith", walletAddress: "0x513AC192AF1CAd0159530e59467F8abEEe7939B4", twitter: "@bobsmith" },
  { name: "Charlie Lee", walletAddress: "0x789...ijkl", twitter: "@charlielee" },
  { name: "Diana Ross", walletAddress: "0xabc...mnop", twitter: "@dianar" },
  { name: "Ethan Hunt", walletAddress: "0xdef...qrst", twitter: "@ethanh" },
];

export const Contacts = memo(() => {
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
        data: encodeFunctionData({
          abi: USDC_TRANSFER_ABI,
          functionName: "transfer",
          args: [contact.walletAddress, 100000n], // @ts-ignore
        }),
        kzg: undefined,
        chain: base
      });

      console.log("Transaction sent:", hash);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  const addInvoice = async (recipient, invoiceId = '5555', invoiceAmount = 100000n, description = 'test', celestiaHash ='55231da2ad21') => {
    if (!wallet) return;

    // Switch to the desired blockchain if needed
    await wallet.switchChain(base.id);

    const provider = await wallet.getEthereumProvider();
    const walletClient = createWalletClient({
      chain: base,
      transport: custom(provider),
    });

    const INVOICE_CONTRACT_ADDRESS = "0x7867Eb147ecF109B8dee98462801E716C40A01D2";

    try {
      const txData = encodeFunctionData({
        abi: INVOICE_CONTRACT_ABI,
        functionName: "addInvoice",
        args: [invoiceId, invoiceAmount, description, celestiaHash, recipient.walletAddress],
      });

      const hash = await walletClient.sendTransaction({
        account: wallet.address as `0x${string}`,
        to: INVOICE_CONTRACT_ADDRESS,
        data: txData,
        kzg: undefined,
        chain: base,
      });

      console.log("Transaction sent:", hash);
    } catch (error) {
      console.error("Transaction failed:", error);
    };
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
          <Button size='xsmall' label="Send transaction" onClick={() => { handleSendTransaction(contact) }} primary />
          <Button size='xsmall' label="Send invoice" onClick={() => { addInvoice(contact) }} primary />
        </Box>
      </Box>
    </Box>
  ));
});
