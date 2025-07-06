import { Transaction } from "@mysten/sui/transactions";
import { Button, Container } from "@radix-ui/themes";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { Spinner } from "@radix-ui/themes";


export function CreateCounter({ onCreated }: { onCreated: (id: string) => void }) {
    const counterPackageId = useNetworkVariable("counterPackageId");
    const suiClient = useSuiClient();

    //Get 3 variables after destructuring the return
    const {
        mutate: signAndExecute,
        isSuccess,
        isPending,
    } = useSignAndExecuteTransaction()


    function create() {
        const tx = new Transaction();

        //use the transaction to call an item in move
        tx.moveCall({
            arguments: [],
            //Call the create function in the clicker contract module
            target: `${counterPackageId}::clicker_contract::create`
        });
        


        //Execute the transaction
        signAndExecute({ transaction: tx }, {
            //On success verify the transaction via digest (hashcode/code for the function run)
            onSuccess: async ({ digest }) => {
                
                //effects is the created items
                const { effects } = await suiClient.waitForTransaction({
                    digest: digest,
                    options: {
                        showEffects: true,
                    }
                });

                //Get the object ID of the first created item from the effect
                onCreated(effects?.created?.[0]?.reference?.objectId!)
            }
            }
        );

        
    }

    return (
        <Container>
            {/* If success or pending For Txn then disable button and show the loader */}
            <Button size="3" onClick={() => create()} disabled={isSuccess||isPending}>
                {isSuccess||isPending ?  <Spinner/>: "Create Counter"}
            </Button>
        </Container>
    )
}

