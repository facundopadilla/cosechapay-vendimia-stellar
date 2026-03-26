#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Env, String};

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Agreement(String),
}

#[contract]
pub struct WorkAgreementRegistry;

#[contractimpl]
impl WorkAgreementRegistry {
    pub fn register(env: Env, claimable_balance_id: String, agreement_hash: String) {
        let key = DataKey::Agreement(claimable_balance_id);
        env.storage().persistent().set(&key, &agreement_hash);
    }

    pub fn get(env: Env, claimable_balance_id: String) -> Option<String> {
        let key = DataKey::Agreement(claimable_balance_id);
        env.storage().persistent().get(&key)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address};

    #[test]
    fn stores_and_reads_an_agreement_hash() {
        let env = Env::default();
        let contract_id = env.register_contract(None, WorkAgreementRegistry);
        let client = WorkAgreementRegistryClient::new(&env, &contract_id);

        let claimable_balance_id = String::from_str(
            &env,
            "0000000000000000000000000000000000000000000000000000000000000001",
        );
        let agreement_hash = String::from_str(&env, "abc123");

        client.register(&claimable_balance_id, &agreement_hash);

        assert_eq!(client.get(&claimable_balance_id), Some(agreement_hash));
    }

    #[test]
    fn returns_none_when_balance_was_not_registered() {
        let env = Env::default();
        let contract_id = env.register_contract(None, WorkAgreementRegistry);
        let client = WorkAgreementRegistryClient::new(&env, &contract_id);

        let missing_balance_id = String::from_str(&env, "missing-balance");

        assert_eq!(client.get(&missing_balance_id), None);
    }

    #[test]
    fn allows_overwriting_the_existing_hash() {
        let env = Env::default();
        let contract_id = env.register_contract(None, WorkAgreementRegistry);
        let client = WorkAgreementRegistryClient::new(&env, &contract_id);

        let _signer = Address::generate(&env);
        let claimable_balance_id = String::from_str(&env, "balance-123");
        let first_hash = String::from_str(&env, "hash-v1");
        let second_hash = String::from_str(&env, "hash-v2");

        client.register(&claimable_balance_id, &first_hash);
        client.register(&claimable_balance_id, &second_hash);

        assert_eq!(client.get(&claimable_balance_id), Some(second_hash));
    }
}
