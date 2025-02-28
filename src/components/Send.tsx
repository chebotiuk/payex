import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, TextInput, Box, Text, Notification } from "grommet";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, encodeFunctionData } from 'viem';
import { base } from "viem/chains";
import { USDC_TRANSFER_ABI } from '../abi';  // Assuming USDC transfer ABI is here

export const Send = () => {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setRecipientAddress(params.get("address"));
  }, [location]);

  const handleSendTransaction = async () => {
    if (!wallets[0] || !recipientAddress || !amount) return;

    setLoading(true);
    setToastMessage("Sending transaction...");

    await wallet.switchChain(base.id);
    const provider = await wallet.getEthereumProvider();
    const walletClient = createWalletClient({
      chain: base,
      transport: custom(provider),
    });

    const USDC_ADDRESS: `0x${string}` = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

    const amountIn = BigInt(Number(amount) * 1_000_000);
    try {
      const hash = await walletClient.sendTransaction({
        account: wallet.address as `0x${string}`,
        to: USDC_ADDRESS,
        data: encodeFunctionData({
          abi: USDC_TRANSFER_ABI,
          functionName: "transfer",
          args: [recipientAddress, amountIn],
        }),
        kzg: undefined,
        chain: base,
      });

      setToastMessage(`Transaction successful: ${hash}`);
    } catch (error) {
      setToastMessage(`Transaction failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1);  // Navigate back to the previous page
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Ensure that the value has at most two decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
      setAmount(value);
    }
  };

  return (
    <Box align="center" pad="medium">
      {toastMessage && (
        <Notification
          status={toastMessage.includes("successful") ? "normal" : "info"}
          title="Transaction Status"
          message={toastMessage}
          onClose={handleClose}
        />
      )}
      <Box direction="row" justify="between" pad="small" style={{ borderBottom: "1px grey solid" }}>
        <Text size="large" weight="bold">
          Send to {recipientAddress && <span style={{ color: "green" }}>{recipientAddress}</span>}
        </Text>
        <Button label="x" onClick={handleClose} />
      </Box>
      <Box pad="medium" width="medium">
        <TextInput
          placeholder="Amount (in USDC)"
          value={amount}
          onChange={handleAmountChange}
          type="number"
          disabled={loading}
        />
        <br />
        <Button
          label="Send"
          primary
          onClick={handleSendTransaction}
          disabled={loading || !amount || !recipientAddress}
        />
      </Box>
    </Box>
  );
};
