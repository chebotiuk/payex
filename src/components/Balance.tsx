import React, { useEffect, useState } from "react";
import { Text, Box, Button, Avatar, Spinner } from "grommet";
import { useWallets } from "@privy-io/react-auth";
import { ethers, Contract } from "ethers";
import { ERC20_ABI } from '../abi';  // Replace with your actual USDC ABI

const USDC_ADDRESS: `0x${string}` = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// URL for Circle API
const CIRCLE_API_URL = "https://api.circle.com/v1"; // Replace with the correct Circle API URL
const CIRCLE_API_KEY = "76867aa08063af283b1688e66f2a363c:ae4a45e4f048d45fcb0b248e55eb335e"; // Replace with your Circle API Key

export const Balance = () => {
  const { wallets } = useWallets();
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingDeposit, setLoadingDeposit] = useState<boolean>(false);
  const [depositSuccess, setDepositSuccess] = useState<boolean | null>(null);

  const wallet = wallets[0]; // Assuming the first wallet in the array is the active wallet

  useEffect(() => {
    const fetchBalances = async () => {
      if (!wallet) return;

      try {
        // Get Ethereum provider (BrowserProvider in v6)
        const provider = await wallet.getEthereumProvider();
        const web3Provider = new ethers.BrowserProvider(provider);

        // Fetch ETH balance
        const ethBalance = await web3Provider.getBalance(wallet.address);
        setEthBalance(ethers.formatEther(ethBalance)); // Convert to human-readable format

        // Initialize USDC contract
        const usdcContract = new Contract(USDC_ADDRESS, ERC20_ABI, web3Provider);

        // Fetch USDC balance (using balanceOf method)
        const usdcBalance = await usdcContract.balanceOf(wallet.address);
        const decimals = await usdcContract.decimals();
        setUsdcBalance(ethers.formatUnits(usdcBalance, decimals)); // Convert using decimals
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [wallet]);

  // Deposit through Circle API
  const handleDeposit = async (amount: number) => {
    setLoadingDeposit(true);
    setDepositSuccess(null); // Reset deposit success state

    try {
      const response = await fetch(`${CIRCLE_API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${CIRCLE_API_KEY}` // Use Circle API key for authorization
        },
        body: JSON.stringify({
          userAddress: wallet?.address, // Add the user address to the deposit request
          amount: amount, // Amount to deposit
          currency: "USDC", // The currency for the deposit (USDC)
        }),
      });

      if (!response.ok) {
        throw new Error("Deposit failed");
      }

      const data = await response.json();
      console.log("Deposit response:", data);
      // After successful deposit, you can update balance (maybe call fetchBalances again)
      setDepositSuccess(true);
    } catch (error) {
      console.error("Error during deposit:", error);
      setDepositSuccess(false);
    } finally {
      setLoadingDeposit(false);
    }
  };

  return (
    <Box pad="medium" gap="medium">
      <Text size="large" weight="bold">Balance</Text>

      {loading ? (
        <Box justify="center" align="center">
          <Spinner size="medium" />
        </Box>
      ) : (
        <>
          <Box direction="row" justify="between" align="center">
            <Box direction="row" align="center" gap="small">
              <Avatar background="brand">ETH</Avatar>
              <Text size="large">ETH: {ethBalance} ETH</Text>
            </Box>
          </Box>
          <br />
          <Box direction="row" justify="between" align="center">
            <Box direction="row" align="center" gap="small">
              <Avatar background="neutral-3">USDC</Avatar>
              <Text size="large">USDC: {usdcBalance} USDC</Text>
            </Box>
          </Box>

          {/* Deposit Button */}
          <Box direction="row" justify="center" margin={{ top: "medium" }}>
            <Button
              label="Deposit USDC"
              onClick={() => handleDeposit(100)} // Example: Deposit 100 USDC
              primary
              color="brand"
              disabled={loadingDeposit}
            />
          </Box>

          {/* Success or Failure Message */}
          {loadingDeposit && (
            <Box justify="center" align="center" margin={{ top: "small" }}>
              <Spinner size="small" />
            </Box>
          )}
          {depositSuccess !== null && (
            <Box justify="center" align="center" margin={{ top: "small" }}>
              {depositSuccess ? (
                <Text color="green">Deposit successful!</Text>
              ) : (
                <Text color="red">Deposit failed. Please try again.</Text>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};
