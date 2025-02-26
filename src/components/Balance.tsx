import React, { useEffect, useState } from "react";
import { Text, Box, Button, Avatar, Spinner } from "grommet";
import { useWallets } from "@privy-io/react-auth";
import { ethers, Contract } from "ethers";
import { ERC20_ABI } from '../abi';  // Replace with your actual USDC ABI

const USDC_ADDRESS: `0x${string}` = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// URL для интеграции с Bridge API (замените на реальный)
const BRIDGE_API_URL = "https://your-bridge-api.com/transfer"; 

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

  // Пополнение через Bridge API
  const handleDeposit = async (amount: number) => {
    setLoadingDeposit(true);
    setDepositSuccess(null); // Reset deposit success state

    try {
      const response = await fetch(BRIDGE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: wallet?.address, // Добавить адрес пользователя для пополнения
          amount: amount, // Сумма пополнения
          currency: "USDC", // Тип валюты
        }),
      });

      if (!response.ok) {
        throw new Error("Deposit failed");
      }

      const data = await response.json();
      console.log("Deposit response:", data);
      // После успешного пополнения можно обновить баланс (например, через API или локально)
      setDepositSuccess(true);

      // Обновим баланс после пополнения
      // fetchBalances();
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
          
          {/* Кнопка пополнения */}
          <Box direction="row" justify="center" margin={{ top: "medium" }}>
            <Button
              label="Deposit USDC"
              onClick={() => handleDeposit(100)} // Пополнение на 100 USDC (например)
              primary
              color="brand"
              disabled={loadingDeposit}
            />
          </Box>

          {/* Сообщение об успешном или неудачном пополнении */}
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
