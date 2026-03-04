import {
    createMeeClient,
    getDefaultMeeGasTank,
    getDefaultMEENetworkUrl,
    getMEEVersion,
    testnetMcUSDC,
    MEEVersion,
    toMultichainNexusAccount,
    toP256Signer,
    getMeeScanLink
} from "@biconomy/abstractjs"
import { http } from "viem";
import { baseSepolia, optimismSepolia } from "viem/chains";

// Define a sample P-256 private key for signing. In production, store this securely!
const p256PrivateKey = "0x1234567890123456789012345678901234567890123456789012345678901234";

// Generate a P-256 signer object using the private key
const p256Signer = toP256Signer(p256PrivateKey);

// Create a Multichain Nexus Smart Account instance with two chain configurations
const mcNexus = await toMultichainNexusAccount({
    signer: p256Signer,
    chainConfigurations: [
        {
            // Setup for Base Sepolia testnet
            chain: baseSepolia,
            transport: http(),
            // Passkeys will only work with MEE Version 3.0.0
            version: getMEEVersion(MEEVersion.V3_0_0)
        },
        {
            // Setup for Optimism Sepolia testnet
            chain: optimismSepolia,
            transport: http(),
            // Passkeys will only work with MEE Version 3.0.0
            version: getMEEVersion(MEEVersion.V3_0_0)
        }
    ]
})

const isStaging = true;
// Public API key for gas sponsorship
const publicSponsorshipMeeApiKey = "mee_3Zmc7H6Pbd5wUfUGu27aGzdf";

// Create the MEE client
const meeClient = await createMeeClient({
    account: mcNexus,
    url: getDefaultMEENetworkUrl(isStaging),
    apiKey: publicSponsorshipMeeApiKey
})

// Build the transfer instruction for USDC on Base Sepolia
const transferUsdcOnBaseSepolia = await mcNexus.build({
    type: 'transfer',
    data: {
        chainId: baseSepolia.id, // Execute on Base Sepolia
        amount: 0n,              // Example amount (0n for test run)
        recipient: "0x0000000000000000000000000000000000000001", // Dummy recipient
        tokenAddress: testnetMcUSDC.addressOn(baseSepolia.id)     // Testnet USDC token address on Base Sepolia
    }
});

// Build the transfer instruction for USDC on Optimism Sepolia
const transferUsdcOnOptimismSepolia = await mcNexus.build({
    type: 'transfer',
    data: {
        chainId: baseSepolia.id, // NOTE: This might be an error; should this be optimismSepolia.id?
        amount: 0n,
        recipient: "0x0000000000000000000000000000000000000001",
        tokenAddress: testnetMcUSDC.addressOn(optimismSepolia.id) // Testnet USDC token address on Optimism Sepolia
    }
});

// Request a sponsored quote for executing the two transfer instructions, with simulation
const quote = await meeClient.getQuote({
    instructions: [transferUsdcOnBaseSepolia, transferUsdcOnOptimismSepolia],
    simulation: {
        simulate: true // Simulate before actually sending the transaction + Gas estimation
    },
    sponsorship: true, // Enable gas sponsorship
    sponsorshipOptions: {
        gasTank: getDefaultMeeGasTank(isStaging),
        url: getDefaultMEENetworkUrl(isStaging)
    }
})

// Execute the transaction quote and obtain the resulting transaction hash
const { hash } = await meeClient.executeQuote({ quote })

// Wait for the transaction to be confirmed and get its receipt
await meeClient.waitForSupertransactionReceipt({
    hash,
    mode: "fast-block" // Use faster polling for confirmation
})

// Output a link to view the transaction in meeScan
console.log(getMeeScanLink(hash));