import { NextResponse } from 'next/server'

// Templates de base pour différents tons
const templates = {
  professionnel: {
    court: "Cher {destinataire},\n\n{contenu}\n\nCordialement,\n{expediteur}",
    moyen: "Cher {destinataire},\n\n{contenu}\n\nJe reste à votre disposition pour toute question.\n\nCordialement,\n{expediteur}",
    long: "Cher {destinataire},\n\n{contenu}\n\nJe reste à votre disposition pour toute question ou précision supplémentaire.\n\nJe vous remercie de votre attention.\n\nCordialement,\n{expediteur}"
  },
  amical: {
    court: "Bonjour {destinataire},\n\n{contenu}\n\nÀ bientôt,\n{expediteur}",
    moyen: "Bonjour {destinataire},\n\n{contenu}\n\nN'hésitez pas si vous avez des questions.\n\nÀ bientôt,\n{expediteur}",
    long: "Bonjour {destinataire},\n\n{contenu}\n\nN'hésitez pas si vous avez des questions ou besoin de plus d'informations.\n\nJe serai ravi d'échanger avec vous.\n\nÀ bientôt,\n{expediteur}"
  },
  formel: {
    court: "Madame, Monsieur,\n\n{contenu}\n\nVeuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n{expediteur}",
    moyen: "Madame, Monsieur,\n\n{contenu}\n\nJe reste à votre disposition pour tout complément d'information.\n\nVeuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n{expediteur}",
    long: "Madame, Monsieur,\n\n{contenu}\n\nJe reste à votre disposition pour tout complément d'information ou précision supplémentaire.\n\nDans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n{expediteur}"
  },
  persuasif: {
    court: "Cher {destinataire},\n\n{contenu}\n\nJe vous remercie de votre attention.\n\nCordialement,\n{expediteur}",
    moyen: "Cher {destinataire},\n\n{contenu}\n\nJe vous invite à me contacter pour en discuter plus en détail.\n\nCordialement,\n{expediteur}",
    long: "Cher {destinataire},\n\n{contenu}\n\nJe vous invite à me contacter pour en discuter plus en détail et explorer ensemble les opportunités qui s'offrent à nous.\n\nJe reste à votre disposition pour toute question.\n\nCordialement,\n{expediteur}"
  }
}

function generateEmail(context: string, tone: string, length: string, language: string): string {
  // Sélectionner le template approprié
  const template = templates[tone as keyof typeof templates]?.[length as keyof typeof templates.professionnel] || templates.professionnel.moyen

  // Générer le contenu de l'email
  const content = `Suite à votre demande concernant "${context}", je vous propose la solution suivante.`

  // Remplacer les variables dans le template
  return template
    .replace('{destinataire}', 'Destinataire')
    .replace('{contenu}', content)
    .replace('{expediteur}', 'Votre nom')
}

export async function POST(request: Request) {
  try {
    const { context, tone, length, language } = await request.json()

    const generatedEmail = generateEmail(context, tone, length, language)

    return NextResponse.json({
      email: generatedEmail
    })
  } catch (error) {
    console.error('Erreur lors de la génération de l\'email:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la génération de l\'email' },
      { status: 500 }
    )
  }
} 