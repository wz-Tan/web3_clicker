import { useCurrentAccount, useSuiClientQuery, } from "@mysten/dapp-kit";
import { SuiObjectData } from "@mysten/sui/client";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";


export function Counter({ id }: { id: string }) {
    const currentAccount = useCurrentAccount();
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
        //Todo
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