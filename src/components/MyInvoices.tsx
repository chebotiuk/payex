import { useState, useEffect } from "react";
import { Box, Button, Heading, List, Text, Spinner } from "grommet";
import axios from "axios";
import { base } from "viem/chains";
import { createWalletClient, custom, encodeFunctionData } from 'viem';
import { useWallets } from "@privy-io/react-auth";
import { ERC20_ABI, INVOICE_CONTRACT_ABI } from '../abi';

export function MyInvoices() {
  const { wallets } = useWallets();
  const wallet = wallets[0]; // Assume first wallet is the active one
  const walletAddress = wallet?.address || "";
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;
    fetchInvoices();
  }, [walletAddress]);

  const fetchInvoices = async () => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/invoice?requester=` + wallet?.address);
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const INVOICE_CONTRACT_ADDRESS = "0x1bbA654d259Eb0330B2171ee89D3066DEA9541B4";
  const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  const approveUSDC = async (amount) => {
    if (!wallet) return;

    try {
      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        chain: base,
        transport: custom(provider),
      });

      const paymentAmount = BigInt(Math.round(parseFloat(amount) * 1_000_000));

      const approveData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: "approve",
        args: [INVOICE_CONTRACT_ADDRESS, paymentAmount],
      });

      const txHash = await walletClient.sendTransaction({
        account: wallet.address as `0x${string}`,
        to: USDC_ADDRESS,
        data: approveData,
        chain: base,
        kzg: undefined,
      });

      console.log("Approval successful! Transaction Hash:", txHash);
    } catch (error) {
      console.error("Approve failed:", error);
    }
  };

  const payInvoice = async (invoiceId, amount, celestiaHash = "default_hash") => {
    if (!wallet) return;

    try {
      // Switch to the desired blockchain TO-DO
      await wallet.switchChain(base.id);

      const provider = await wallet.getEthereumProvider();
      const walletClient = createWalletClient({
        chain: base,
        transport: custom(provider),
      });

      const paymentAmount = BigInt(Number(amount) * 1_000_000); // Convert to contract format

      await approveUSDC(amount);

      // Encode the transaction data for payInvoice function
      const txData = encodeFunctionData({
        abi: INVOICE_CONTRACT_ABI,
        functionName: "payInvoice",
        args: [invoiceId, celestiaHash, paymentAmount], // Pass all required arguments
      });

      console.log(txData);

      const txHash = await walletClient.sendTransaction({
        account: wallet.address as `0x${string}`,
        to: INVOICE_CONTRACT_ADDRESS,
        data: txData,
        chain: base,
        kzg: undefined,
      });

      console.log("Invoice paid! Transaction Hash:", txHash);
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };



  console.log(invoices)
  return (
    <Box pad="medium" width="large" alignSelf="center">
      <Heading level={2} margin={{ bottom: "small" }}>My Invoices (out)</Heading>
      <Text size="small" margin={{ bottom: "small" }} color="dark-3">
        Wallet: {walletAddress || "Not connected"}
      </Text>
      <Box margin={{ top: "medium" }} style={{ overflow: "scroll" }}>
        {loading ? (
          <Box justify="center" align="center">
            <Spinner size="medium" />
          </Box>
        ) : invoices.length === 0 ? (
          <Text>No invoices found for this address.</Text>
        ) : (
          <List
            data={invoices}
            primaryKey={(item) => <></>}
            secondaryKey={(item) => (
              <>
                <Text size="small"><b>Amount:</b> {item.amount} USDC</Text>
                <Text size="small"><b>ID:</b> {item.id}</Text>
                <Text size="small"><b>Comment:</b> {item.comment}</Text>
                <Text size="small"><b>To:</b> {item.to ? (item.to.substring(0, 6) + '...' + item.to.substring(item.to.length - 4)) : 'N/A'}</Text>
                {item.status === "paid"
                  ? <Text size="small" color="green" style={{ flexBasis: '80px' }}><b>Paid</b></Text>
                  : <Text size="small" color="status-warning" style={{ flexBasis: '80px' }}><b>Pending</b></Text>
                }
              </>
            )}
          />
        )}
      </Box>
      <br />
      <Button label="Fetch Invoices" onClick={fetchInvoices} primary disabled={!walletAddress || loading} />
    </Box>
  );
}
