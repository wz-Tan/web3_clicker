import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery, } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { Transaction } from "@mysten/sui/transactions";
import { SuiObjectData } from "@mysten/sui/client";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";


export function Counter({ id }: { id: string }) {
    const counterPackageId = useNetworkVariable("counterPackageId")
    const suiClient = useSuiClient();
    const currentAccount = useCurrentAccount();
    const { mutate: signAndExecute } = useSignAndExecuteTransaction()
    //Get Object And Destructure the Data
    const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
        id,
        options: {
            showContent: true,
            showOwner: true,
        }
    });

    const [waitingForTxn, setWaitingForTxn] = useState("");

    const executeMoveCall = (method: "increment" | "reset") => {
        setWaitingForTxn(method);
        const tx = new Transaction();
        //Run the Blockchain function
        if (method === "reset") {
            console.log(`Running Reset .object id is ${id}`)
            tx.moveCall({
  			arguments: [tx.object(id), tx.pure.u64(0)],
  			target: `${counterPackageId}::clicker_contract::set_value`,
  		    });
        }
        else {
            tx.moveCall({
                arguments: [tx.object(id)],
                target: `${counterPackageId}::clicker_contract::increment`
            })
        }

        //Verify the Transaction
        signAndExecute({ transaction: tx }, {
            onSuccess: (tx) => {
                //wait for transaction and get the digest (feedback)
                suiClient.waitForTransaction({ digest: tx.digest }).then(async () => {
                    //Refetch is refresh the value
                    await refetch();
                    setWaitingForTxn("")
                }
                )
            }

        }
        )
    }

    //Display or Return Information of The Counter Object
    function getCounterFields(data: SuiObjectData) {
        if (data?.content?.dataType !== "moveObject") {
            return null
        }
        //Categorise the data fields into object types since they are u64 in the move contract
        return data.content.fields as { value: number, owner: string };
    }

    //Displaying Outcomes
    if (isPending) return <Text>Is Loading</Text>

    if (error) return <Text>An Error Has Occured:  {error.message}</Text>

    if (!data.data) return <Text>Data Is Not Found :(</Text>

    //Verifying Owner
    const ownedByCurrentAccount = getCounterFields(data.data)?.owner === currentAccount?.address;

    //Value Is Valid And We Return the Actual Program
    return (
        <>
            <Heading size="3">Counter: {id}</Heading>
            <Flex direction="column" gap="2">
                <Text>Value of Counter : {getCounterFields(data.data)?.value}</Text>
                <Flex direction="row" gap="2">
                    <Button onClick={() => {
                        executeMoveCall("increment")
                    }
                    }
                        disabled={waitingForTxn != ""}>
                        {waitingForTxn === "increment" ? (<ClipLoader size={20} />) : "Increment"}
                    </Button>
                    {ownedByCurrentAccount ? (

                        <Button
                            onClick={() => executeMoveCall("reset")}
                            disabled={waitingForTxn !== ""}>
                            {waitingForTxn === "reset" ? (
                                <ClipLoader size={20} />
                            ) :
                                ("Reset")}
                        </Button>
                    ) :
                        null
                    }
                </Flex>
            </Flex>
        </>
    )


}