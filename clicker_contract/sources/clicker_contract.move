module clicker_contract::example;

// User Struct With Click Count 
public struct User has key{
    id:UID,
    click_count:u64,
}

