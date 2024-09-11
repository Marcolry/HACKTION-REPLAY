// gameState.js

// Gestion de l'état du jeu
const GameState = {
    saveState: function(state) {
        localStorage.setItem('gameState', JSON.stringify(state));
    },

    loadState: function() {
        const state = localStorage.getItem('gameState');
        return state ? JSON.parse(state) : null;
    },

    clearState: function() {
        localStorage.removeItem('gameState');
    },

    // Gestion de la connexion Phantom
    savePhantomConnection: function(isConnected) {
        localStorage.setItem('phantomConnected', isConnected);
    },

    isPhantomConnected: function() {
        return localStorage.getItem('phantomConnected') === 'true';
    },

    // Gestion de l'ID de la partie
    saveGameId: function(gameId) {
        localStorage.setItem('currentGameId', gameId);
    },

    getGameId: function() {
        return localStorage.getItem('currentGameId');
    },

    // Fonction de reconnexion globale
    reconnect: async function() {
        const state = this.loadState();
        if (state) {
            // Restaurer l'état du jeu
            // Vous devrez implémenter cette fonction selon la structure de votre jeu
            restoreGameState(state);

            if (this.isPhantomConnected()) {
                // Reconnecter Phantom
                await reconnectPhantomWallet();
            }

            const gameId = this.getGameId();
            if (gameId) {
                // Reconnecter à la partie Firebase
                await reconnectToFirebaseGame(gameId);
            }
        }
    }
};

// Exportez l'objet pour pouvoir l'utiliser dans d'autres fichiers
export default GameState;