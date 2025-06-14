# Lumina - Générateur de Templates Email IA

Lumina est une application SaaS qui génère des réponses d'emails professionnels personnalisées en utilisant l'intelligence artificielle.

## Fonctionnalités

- Génération d'emails professionnels personnalisés
- Choix du ton (professionnel, amical, formel, persuasif)
- Contrôle de la longueur du message
- Interface utilisateur moderne et intuitive
- Intégration avec OpenAI GPT-4

## Prérequis

- Node.js 18+ 
- Compte OpenAI avec une clé API
- npm ou yarn

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/lumina-email-generator.git
cd lumina-email-generator
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :
```
OPENAI_API_KEY=your_openai_api_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

4. Démarrez le serveur de développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000)

## Utilisation

1. Accédez à l'application via votre navigateur
2. Entrez le contexte de l'email que vous souhaitez générer
3. Sélectionnez le ton souhaité
4. Choisissez la longueur du message
5. Cliquez sur "Générer l'email"
6. Copiez le résultat généré

## Technologies utilisées

- Next.js 14
- React 18
- Chakra UI
- OpenAI API
- TypeScript

## Licence

MIT 