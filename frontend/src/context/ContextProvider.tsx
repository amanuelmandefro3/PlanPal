"use client";

import { Session, createKeyStoreInteractor, createSingleSigAuthDescriptorRegistration, createWeb3ProviderEvmKeyStore, hours, registerAccount, registrationStrategy, ttlLoginRule } from "@chromia/ft4";
import { createClient } from "postchain-client";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getRandomUserName } from "./user";

const ChromiaContext = createContext<Session | undefined>(undefined);

declare global {
    interface Window { ethereum: any }
}

export function ContextProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | undefined>(undefined);

    useEffect(() => {
        const initSession = async () => {
            console.log("Initializing Session");
            // 1. Initialize Client
            const client = await createClient({
              nodeUrlPool: "http://localhost:7740",
              blockchainRid: "5A3C7BD299B3D864C9145128A847D07D84E86A9CB954F519FDFD68ABD4AD7E22",
            });

            // 2. Connect with metamask
            const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);

            // 3. Get all accounts associated with evm address
            const evmKeyStoreInteractor = createKeyStoreInteractor(client, evmKeyStore);
            const accounts = await evmKeyStoreInteractor.getAccounts();

            if (accounts.length > 0) {
            // 4. Start a new session
                const { session } = await evmKeyStoreInteractor.login({
                    accountId: accounts[0].id,
                    config: {
                        rules: ttlLoginRule(hours(2)),
                        flags: ["S"]
                    }
                })
                setSession(session)
            } else {
                // 5. Create a new account by signing a message using metamask
                const authDescriptor = createSingleSigAuthDescriptorRegistration(["A", "T"], evmKeyStore.id);
                const { session } = await registerAccount(client, evmKeyStore, registrationStrategy.open(authDescriptor, {
                    config: {
                        rules: ttlLoginRule(hours(2)),
                        flags: ["S"]
                    }
                }), {
                    name: "register_user", args: [getRandomUserName()]
                });
                setSession(session)
            }
            console.log("Session initialized");
        };

        initSession().catch(console.error);
    }, []);

    return (
        <ChromiaContext.Provider value={session}>
            {children}
        </ChromiaContext.Provider>
    );
}

export function useSessionContext() {
    return useContext(ChromiaContext)
}
