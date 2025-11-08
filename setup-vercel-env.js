const { execSync } = require('child_process');

// Variables d'environnement Azure
// REMPLACEZ LES VALEURS PLACEHOLDER PAR VOS VRAIES VALEURS AVANT D'EXECUTER
const envVars = {
    'AZURE_COSMOS_ENDPOINT': 'https://your-cosmos-account.documents.azure.com:443/',
    'AZURE_COSMOS_KEY': 'your-cosmos-key-here',
    'AZURE_COSMOS_DATABASE': 'aiflix',
    'AZURE_COSMOS_CONNECTION_STRING': 'https://your-cosmos-account.documents.azure.com:443/',
    'AZURE_STORAGE_ACCOUNT_NAME': 'your-storage-account-name',
    'AZURE_STORAGE_ACCOUNT_KEY': 'your-storage-account-key-here',
    'AZURE_STORAGE_CONNECTION_STRING': 'DefaultEndpointsProtocol=https;AccountName=your-storage-account-name;AccountKey=your-storage-account-key-here;EndpointSuffix=core.windows.net',
    'AZURE_STORAGE_CONTAINER': 'videos',
    'JWT_SECRET': 'your-super-secure-jwt-secret-here-change-this-in-production'
};

console.log('🚀 Ajout automatique des variables d\'environnement Vercel pour AIFLIX...\n');

// Fonction pour ajouter une variable d'environnement
function addEnvVar(name, value) {
    try {
        console.log(`📝 Ajout de ${name}...`);

        // Créer un fichier temporaire avec la valeur
        const tempFile = `temp_${name}.txt`;
        require('fs').writeFileSync(tempFile, value);

        // Ajouter la variable pour Production
        execSync(`vercel env add ${name} production < ${tempFile}`, { stdio: 'inherit' });

        // Ajouter la variable pour Preview
        execSync(`vercel env add ${name} preview < ${tempFile}`, { stdio: 'inherit' });

        // Ajouter la variable pour Development
        execSync(`vercel env add ${name} development < ${tempFile}`, { stdio: 'inherit' });

        // Supprimer le fichier temporaire
        require('fs').unlinkSync(tempFile);

        console.log(`✅ ${name} ajouté avec succès\n`);
    } catch (error) {
        console.error(`❌ Erreur lors de l'ajout de ${name}:`, error.message);
    }
}

// Ajouter toutes les variables
Object.entries(envVars).forEach(([name, value]) => {
    addEnvVar(name, value);
});

console.log('🎉 Toutes les variables d\'environnement ont été ajoutées à Vercel !');
console.log('🔗 Votre application AIFLIX est maintenant prête pour le déploiement.');