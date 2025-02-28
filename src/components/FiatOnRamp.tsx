import React, { useState } from "react";
import { Box, Text, Button, Spinner, Notification } from "grommet";
import { useWallets } from "@privy-io/react-auth";
import fetch from "node-fetch";

// Circle API URL for fiat-to-crypto onramping
const CIRCLE_API_URL = "https://api.circle.com/v1/fiat/onramp";

// Your Circle API key (replace with your actual API key)
const CIRCLE_API_KEY = "3b3ba8e474f6ba84be64c51b7bc8fc7a:6b2c091ab17e6f25dff0007eaaa560eb";

export const FiatOnRamp = () => {
  const { wallets } = useWallets();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [error, setError] = useState(null);

  const wallet = wallets[0]; // Assuming the first wallet is the active wallet
  const userAddress = wallet?.address;

  const handleDeposit = async () => {
    if (!userAddress || !amount) {
      alert("Please enter a valid amount and connect a wallet.");
      return;
    }

    setLoading(true);
    setTransactionStatus(null);
    setError(null);

    try {
      // Make the POST request to Circle's onramp API endpoint
      const response = await fetch(CIRCLE_API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CIRCLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: userAddress,  // User's wallet address
          amount: amount,             // Amount of fiat to convert (e.g., USD)
          currency: "USD",           // Fiat currency (e.g., USD)
          transactionType: "fiat_onramp", // Transaction type
        }),
      });

      if (!response.ok) {
        throw new Error("Onramp transaction failed");
      }

      const data = await response.json();
      console.log("Onramp response:", data);
      setTransactionStatus(data);  // Save transaction response

    } catch (err) {
      console.error("Error during fiat onramp transaction:", err);
      setError("Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box pad="medium" gap="medium">
      <Text size="large" weight="bold">
        Fiat to Crypto Onramp
      </Text>

      {/* Display transaction status */}
      {transactionStatus && (
        <Notification
          title="Transaction Status"
          message={`Transaction ${transactionStatus.status}: ${transactionStatus.amount} ${transactionStatus.currency}`}
          status={transactionStatus.status === "completed" ? "normal" : "warning"}
        />
      )}

      {/* Show error message if there was an issue */}
      {error && <Text color="red">{error}</Text>}

      <Box direction="row" gap="small">
        <Text>Amount (USD): </Text>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter USD amount"
        />
      </Box>

      <Box direction="row" justify="center" margin={{ top: "medium" }}>
        <Button
          label="Deposit"
          onClick={handleDeposit}
          primary
          color="brand"
          disabled={loading}
        />
      </Box>

      {/* Loading spinner */}
      {loading && (
        <Box justify="center" align="center" margin={{ top: "medium" }}>
          <Spinner size="large" />
        </Box>
      )}
    </Box>
  );
};
