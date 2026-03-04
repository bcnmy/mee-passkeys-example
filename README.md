# mee-passkeys-example
This codebase demonstrates how to use Passkeys with MEE stack

## ⚠️ Experimental Passkeys Support (P256) in MEE v3.0.0

> **Note:**  
> The MEE version **3.0.0** adds support for Passkeys P256 authentication, enabling you to use passkeys for secure smart account access with the MEE stack.  
> However, this version is powered by unaudited smart contracts and is marked **experimental**: while the feature is fully developed and tested, use it with caution in production environments.

---

## How to Run the Example (`index.ts`)

### 1. Install Dependencies

This project uses [Bun](https://bun.sh/) as its package manager. Make sure you have Bun installed.

```bash
bun install
```

### 2. Execute the Example

Run the code using Bun:

```bash
bun index.ts
```

### 3. What Does This Example Do?

- **Setup:**  
  The script demonstrates how to use Passkeys (P256) authentication to interact with the MEE stack using experimental MEE v3.0.0.  
  It initializes a Multichain Nexus Smart Account configured for two testnets:
    - **Base Sepolia**
    - **Optimism Sepolia**

- **Key Steps:**
  1. **Signer Initialization:**  
     Generates a P-256 signer from a sample private key (replace with secure key for real use).
  2. **Account & Client Creation:**  
     Creates a multichain smart account and configures the MEE client (with gas sponsorship).
  3. **Transfer Instructions:**  
     Builds two sample instructions to transfer testnet USDC tokens on each network.
  4. **Simulate and Quote:**  
     Simulates the instructions and fetches a sponsored execution quote, including gas estimates.
  5. **Execution:**  
     Executes the quoted multi-chain transaction and waits for confirmation.
  6. **Result:**  
     Outputs a [meeScan](https://meescan.xyz) explorer link to view the transaction details.

---

### ⚠️ Production Caution

- The Passkeys integration and v3.0.0 contract set are experimental and unaudited. Test thoroughly before integrating into production!
- Always replace the example private key with a secure, user-controlled passkey in real deployments.

---