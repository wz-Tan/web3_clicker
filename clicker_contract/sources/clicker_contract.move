module clicker_contract::clicker_contract;

// User Struct With Click Count 
public struct User has key{
    id:UID,
    owner:address,
    click_count:u64,
    level:u64,
}

public entry fun createUser(_ctx:&mut TxContext){
    //uid to mark item in the blockchain, address to find whos the owner 
    let user_id=object::new(_ctx);
    let user=User{
        id:user_id,
        owner:tx_context::sender(_ctx),
        click_count:0,
        level:0,
    };

    transfer::transfer(user,tx_context::sender(_ctx));
}



