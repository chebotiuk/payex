import React, { Fragment } from "react";
import { Button, Text, Heading } from "grommet";
import { useFundWallet } from "@privy-io/react-auth";

export const Account = ({ user }) => {
  const { fundWallet } = useFundWallet();

  return (
    <>
      <Heading level={3} size="small">Logged in as: </Heading>
      <Text>{user?.id ?? "Unknown User"}</Text>
      <br />
      <Heading level={3} size="small" color="brand">
        Linked accounts:
      </Heading>
      {
        user?.linkedAccounts.map((account) => {
          const { address, type, walletClientType } = account as any;
          return (
            <Fragment key={address}>
              <Text>Address: {address}</Text>
              <Text>Type: {type}</Text>
              <Text>Client type: {walletClientType}</Text>
              <br />
              <Button label="Fund wallet" onClick={() => fundWallet(address)} primary color="brand" />
              <br />
            </Fragment>
          )
        })
      }
    </>
  );
}
