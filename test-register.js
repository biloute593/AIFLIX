const fetch = require('node-fetch');

async function testRegistration() {
  const userData = {
    name: "BILOUTE",
    email: "DIMSAKAYA@FREE.FR",
    password: "DIMOH59!"
  };

  try {
    console.log('🧪 Test d\'inscription AIFLIX...');
    console.log('📤 Données:', userData);

    const response = await fetch('https://aiflix-7faz7hhry-biloutes-593.vercel.app/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();

    console.log('📊 Status:', response.status);
    console.log('📄 Réponse:', result);

    if (response.ok) {
      console.log('✅ Inscription réussie !');
    } else {
      console.log('❌ Erreur d\'inscription:', result.error);
    }

  } catch (error) {
    console.error('💥 Erreur de connexion:', error.message);
  }
}

testRegistration();