const PhantomConnection = {
    async connect() {
        try {
            const { solana } = window;
            if (!solana || !solana.isPhantom) {
                throw new Error("Phantom wallet is not installed!");
            }
            const response = await solana.connect();
            const walletAddress = response.publicKey.toString();
            localStorage.setItem('phantomConnected', 'true');
            localStorage.setItem('walletAddress', walletAddress);
            this.updateUI(true, walletAddress);
            await this.updateWalletBalance(walletAddress);
            return walletAddress;
        } catch (error) {
            console.error("Error connecting to Phantom wallet:", error);
            this.updateUI(false);
        }
    },

    disconnect() {
        if (window.solana && window.solana.isConnected) {
            window.solana.disconnect();
        }
        localStorage.removeItem('phantomConnected');
        localStorage.removeItem('walletAddress');
        this.updateUI(false);
    },

    async checkConnection() {
        const isConnected = localStorage.getItem('phantomConnected') === 'true';
        if (isConnected) {
            const walletAddress = localStorage.getItem('walletAddress');
            if (walletAddress) {
                this.updateUI(true, walletAddress);
                await this.updateWalletBalance(walletAddress);
                return true;
            }
        }
        return false;
    },

    updateUI(isConnected, walletAddress = '') {
        const connectButton = document.getElementById('connect-phantom');
        const walletInfo = document.getElementById('wallet-info');
        if (connectButton && walletInfo) {
            if (isConnected) {
                connectButton.textContent = 'Disconnect Phantom';
                connectButton.onclick = () => this.disconnect();
                walletInfo.style.display = 'block';
                const addressElement = document.getElementById('wallet-address');
                if (addressElement) {
                    addressElement.textContent = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
                }
            } else {
                connectButton.textContent = 'Connect Phantom';
                connectButton.onclick = () => this.connect();
                walletInfo.style.display = 'none';
            }
        }
    },

    async updateWalletBalance(address) {
        try {
            const balance = await this.fetchSolanaBalance(address);
            const balanceElement = document.getElementById('wallet-balance');
            if (balanceElement) {
                balanceElement.textContent = `SOL: ${balance.toFixed(6)}`;
            }
        } catch (error) {
            console.error("Error updating wallet balance:", error);
            const balanceElement = document.getElementById('wallet-balance');
            if (balanceElement) {
                balanceElement.textContent = 'Error fetching balance';
            }
        }
    },

    async fetchSolanaBalance(address) {
        const response = await fetch('https://askmoona.app.n8n.cloud/webhook/SOLBalance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Address: address })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.Balance !== undefined) {
            return parseFloat(data.Balance);
        }
        throw new Error("Unexpected response format");
    },

    getWalletAddress() {
        return localStorage.getItem('walletAddress');
    },

    updateNetworkIndicator() {
        const indicator = document.getElementById('network-indicator');
        if (indicator) {
            indicator.textContent = 'Network: Mainnet';
            indicator.style.color = '#4CAF50';
        }
    }
};

export default PhantomConnection;