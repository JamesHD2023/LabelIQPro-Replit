// Multi-language translations for IPICIA.COM
// Supporting 8 languages: English, German, French, Spanish, Portuguese, Dutch, Norwegian, Swedish

export const supportedLanguages = {
  'en': { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  'de': { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  'fr': { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  'es': { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  'pt': { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  'nl': { name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  'no': { name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  'sv': { name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' }
};

export const translations = {
  // App-wide translations
  app: {
    name: {
      en: 'IPICIA.COM',
      de: 'IPICIA.COM',
      fr: 'IPICIA.COM',
      es: 'IPICIA.COM',
      pt: 'IPICIA.COM',
      nl: 'IPICIA.COM',
      no: 'IPICIA.COM',
      sv: 'IPICIA.COM'
    }
  },

  // Home Screen translations
  home: {
    subtitle: {
      en: 'Scan it - every choice matters!',
      de: 'Scanne es - jede Wahl zählt!',
      fr: 'Scannez-le - chaque choix compte !',
      es: '¡Escanéalo - cada elección importa!',
      pt: 'Escaneie - toda escolha importa!',
      nl: 'Scan het - elke keuze telt!',
      no: 'Skann det - hvert valg betyr noe!',
      sv: 'Skanna det - varje val räknas!'
    },
    taglineSub: {
      en: 'Ingredient & Product Intelligence: in Contact, Ingested or Applied',
      de: 'Inhaltsstoff- & Produktintelligenz: in Kontakt, Eingenommen oder Angewendet',
      fr: 'Intelligence des Ingrédients & Produits : en Contact, Ingéré ou Appliqué',
      es: 'Inteligencia de Ingredientes y Productos: en Contacto, Ingerido o Aplicado',
      pt: 'Inteligência de Ingredientes e Produtos: em Contato, Ingerido ou Aplicado',
      nl: 'Ingrediënt & Product Intelligentie: in Contact, Ingenomen of Toegepast',
      no: 'Ingrediens- & Produktintelligens: i Kontakt, Inntatt eller Påført',
      sv: 'Ingrediens- & Produktintelligens: i Kontakt, Intaget eller Applicerat'
    },
    selectCategory: {
      en: 'What would you like to scan?',
      de: 'Was möchten Sie scannen?',
      fr: 'Que souhaitez-vous scanner ?',
      es: '¿Qué le gustaría escanear?',
      pt: 'O que você gostaria de escanear?',
      nl: 'Wat wilt u scannen?',
      no: 'Hva vil du skanne?',
      sv: 'Vad vill du skanna?'
    },
    selectCategorySubtitle: {
      en: 'Choose a category to get started with your analysis',
      de: 'Wählen Sie eine Kategorie, um mit Ihrer Analyse zu beginnen',
      fr: 'Choisissez une catégorie pour commencer votre analyse',
      es: 'Elija una categoría para comenzar con su análisis',
      pt: 'Escolha uma categoria para começar sua análise',
      nl: 'Kies een categorie om te beginnen met uw analyse',
      no: 'Velg en kategori for å komme i gang med analysen',
      sv: 'Välj en kategori för att komma igång med din analys'
    },
    startScan: {
      en: 'Start Scanning',
      de: 'Scannen starten',
      fr: 'Commencer le scan',
      es: 'Comenzar escaneo',
      pt: 'Iniciar escaneamento',
      nl: 'Begin met scannen',
      no: 'Start skanning',
      sv: 'Börja skanna'
    },
    scanOptions: {
      food: {
        title: {
          en: 'Food Products',
          de: 'Lebensmittel',
          fr: 'Produits alimentaires',
          es: 'Productos alimentarios',
          pt: 'Produtos alimentares',
          nl: 'Voedingsproducten',
          no: 'Matprodukter',
          sv: 'Livsmedelsprodukter'
        },
        subtitle: {
          en: 'Analyze ingredients in food items and get nutritional insights',
          de: 'Analysieren Sie Inhaltsstoffe in Lebensmitteln und erhalten Sie Ernährungseinblicke',
          fr: 'Analysez les ingrédients des aliments et obtenez des informations nutritionnelles',
          es: 'Analice ingredientes en alimentos y obtenga información nutricional',
          pt: 'Analise ingredientes em alimentos e obtenha insights nutricionais',
          nl: 'Analyseer ingrediënten in voedingsmiddelen en krijg voedingsinzichten',
          no: 'Analyser ingredienser i matvarer og få ernæringsinnsikt',
          sv: 'Analysera ingredienser i livsmedel och få näringsinsikter'
        }
      },
      cosmetic: {
        title: {
          en: 'Cosmetics & Beauty',
          de: 'Kosmetik & Schönheit',
          fr: 'Cosmétiques et beauté',
          es: 'Cosméticos y belleza',
          pt: 'Cosméticos e beleza',
          nl: 'Cosmetica en schoonheid',
          no: 'Kosmetikk og skjønnhet',
          sv: 'Kosmetika och skönhet'
        },
        subtitle: {
          en: 'Check ingredients in skincare, makeup, and personal care products',
          de: 'Überprüfen Sie Inhaltsstoffe in Hautpflege, Make-up und Körperpflegeprodukten',
          fr: 'Vérifiez les ingrédients des soins de la peau, maquillage et produits de soins personnels',
          es: 'Verifique ingredientes en cuidado de la piel, maquillaje y productos de cuidado personal',
          pt: 'Verifique ingredientes em cuidados da pele, maquiagem e produtos de cuidado pessoal',
          nl: 'Controleer ingrediënten in huidverzorging, make-up en persoonlijke verzorgingsproducten',
          no: 'Sjekk ingredienser i hudpleie, sminke og personlige pleieprodukter',
          sv: 'Kontrollera ingredienser i hudvård, smink och personliga vårdprodukter'
        }
      },
      household: {
        title: {
          en: 'Household Products',
          de: 'Haushaltsprodukte',
          fr: 'Produits ménagers',
          es: 'Productos domésticos',
          pt: 'Produtos domésticos',
          nl: 'Huishoudproducten',
          no: 'Husholdningsprodukter',
          sv: 'Hushållsprodukter'
        },
        subtitle: {
          en: 'Analyze cleaning products and household chemicals for safety',
          de: 'Analysieren Sie Reinigungsprodukte und Haushaltschemikalien auf Sicherheit',
          fr: 'Analysez les produits de nettoyage et les produits chimiques ménagers pour la sécurité',
          es: 'Analice productos de limpieza y químicos domésticos para seguridad',
          pt: 'Analise produtos de limpeza e produtos químicos domésticos para segurança',
          nl: 'Analyseer schoonmaakproducten en huishoudchemicaliën op veiligheid',
          no: 'Analyser rengjøringsprodukter og husholdningskjemikalier for sikkerhet',
          sv: 'Analysera rengöringsprodukter och hushållskemikalier för säkerhet'
        }
      }
    },
    quickActions: {
      history: {
        en: 'View History',
        de: 'Verlauf anzeigen',
        fr: 'Voir l\'historique',
        es: 'Ver historial',
        pt: 'Ver histórico',
        nl: 'Geschiedenis bekijken',
        no: 'Se historikk',
        sv: 'Visa historik'
      },
      insights: {
        en: 'Health Insights',
        de: 'Gesundheitseinblicke',
        fr: 'Informations de santé',
        es: 'Información de salud',
        pt: 'Insights de saúde',
        nl: 'Gezondheidsinzichten',
        no: 'Helseinnsikt',
        sv: 'Hälsoinsikter'
      }
    }
  },

  // Calorie Tracker Translations
  calorieTracker: {
    title: {
      en: 'Daily Calorie Tracker',
      de: 'Täglicher Kalorientracker',
      fr: 'Suivi Calorique Quotidien',
      es: 'Rastreador de Calorías Diario',
      pt: 'Rastreador de Calorias Diário',
      nl: 'Dagelijkse Calorieënteller',
      no: 'Daglig Kaloriteller',
      sv: 'Daglig Kaloriräknare'
    },
    today: {
      en: 'Today',
      de: 'Heute',
      fr: 'Aujourd\'hui',
      es: 'Hoy',
      pt: 'Hoje',
      nl: 'Vandaag',
      no: 'I dag',
      sv: 'Idag'
    },
    history: {
      en: 'History',
      de: 'Verlauf',
      fr: 'Historique',
      es: 'Historial',
      pt: 'Histórico',
      nl: 'Geschiedenis',
      no: 'Historikk',
      sv: 'Historik'
    },
    insights: {
      en: 'Insights',
      de: 'Einblicke',
      fr: 'Analyses',
      es: 'Información',
      pt: 'Insights',
      nl: 'Inzichten',
      no: 'Innsikt',
      sv: 'Insikter'
    },
    calories: {
      en: 'calories',
      de: 'Kalorien',
      fr: 'calories',
      es: 'calorías',
      pt: 'calorias',
      nl: 'calorieën',
      no: 'kalorier',
      sv: 'kalorier'
    },
    cal: {
      en: 'cal',
      de: 'kcal',
      fr: 'cal',
      es: 'cal',
      pt: 'cal',
      nl: 'cal',
      no: 'kcal',
      sv: 'kcal'
    },
    of: {
      en: 'of',
      de: 'von',
      fr: 'de',
      es: 'de',
      pt: 'de',
      nl: 'van',
      no: 'av',
      sv: 'av'
    },
    remaining: {
      en: 'Remaining',
      de: 'Verbleibend',
      fr: 'Restant',
      es: 'Restante',
      pt: 'Restante',
      nl: 'Resterend',
      no: 'Gjenstående',
      sv: 'Kvar'
    },
    meals: {
      en: 'Meals',
      de: 'Mahlzeiten',
      fr: 'Repas',
      es: 'Comidas',
      pt: 'Refeições',
      nl: 'Maaltijden',
      no: 'Måltider',
      sv: 'Måltider'
    },
    ofGoal: {
      en: 'of Goal',
      de: 'vom Ziel',
      fr: 'de l\'Objectif',
      es: 'del Objetivo',
      pt: 'da Meta',
      nl: 'van Doel',
      no: 'av Mål',
      sv: 'av Mål'
    },
    todaysMeals: {
      en: 'Today\'s Meals',
      de: 'Heutige Mahlzeiten',
      fr: 'Repas d\'Aujourd\'hui',
      es: 'Comidas de Hoy',
      pt: 'Refeições de Hoje',
      nl: 'Vandaag\'s Maaltijden',
      no: 'Dagens Måltider',
      sv: 'Dagens Måltider'
    },
    items: {
      en: 'items',
      de: 'Artikel',
      fr: 'articles',
      es: 'artículos',
      pt: 'itens',
      nl: 'items',
      no: 'elementer',
      sv: 'objekt'
    },
    scanMeal: {
      en: 'Scan Meal',
      de: 'Mahlzeit scannen',
      fr: 'Scanner le repas',
      es: 'Escanear comida',
      pt: 'Escanear refeição',
      nl: 'Maaltijd scannen',
      no: 'Skann måltid',
      sv: 'Skanna måltid'
    },
    loadingCalorieData: {
      en: 'Loading calorie data...',
      de: 'Lade Kaloriendaten...',
      fr: 'Chargement des données caloriques...',
      es: 'Cargando datos de calorías...',
      pt: 'Carregando dados de calorias...',
      nl: 'Caloriegegevens laden...',
      no: 'Laster kaloridata...',
      sv: 'Laddar kaloridata...'
    },
    loadingHistory: {
      en: 'Loading history...',
      de: 'Lade Verlauf...',
      fr: 'Chargement de l\'historique...',
      es: 'Cargando historial...',
      pt: 'Carregando histórico...',
      nl: 'Geschiedenis laden...',
      no: 'Laster historikk...',
      sv: 'Laddar historik...'
    },
    loadingInsights: {
      en: 'Loading insights...',
      de: 'Lade Einblicke...',
      fr: 'Chargement des analyses...',
      es: 'Cargando información...',
      pt: 'Carregando insights...',
      nl: 'Inzichten laden...',
      no: 'Laster innsikt...',
      sv: 'Laddar insikter...'
    },
    sevenDayHistory: {
      en: '7-Day History',
      de: '7-Tage-Verlauf',
      fr: 'Historique 7 jours',
      es: 'Historial de 7 días',
      pt: 'Histórico de 7 dias',
      nl: '7-dagen geschiedenis',
      no: '7-dagers historikk',
      sv: '7-dagars historik'
    },
    withinTarget: {
      en: 'Within target',
      de: 'Innerhalb des Ziels',
      fr: 'Dans l\'objectif',
      es: 'Dentro del objetivo',
      pt: 'Dentro da meta',
      nl: 'Binnen doel',
      no: 'Innenfor mål',
      sv: 'Inom mål'
    },
    overTarget: {
      en: 'Over target',
      de: 'Über dem Ziel',
      fr: 'Au-dessus de l\'objectif',
      es: 'Sobre el objetivo',
      pt: 'Acima da meta',
      nl: 'Boven doel',
      no: 'Over mål',
      sv: 'Över mål'
    },
    weeklyInsights: {
      en: 'Weekly Insights',
      de: 'Wöchentliche Einblicke',
      fr: 'Analyses Hebdomadaires',
      es: 'Información Semanal',
      pt: 'Insights Semanais',
      nl: 'Wekelijkse Inzichten',
      no: 'Ukentlig Innsikt',
      sv: 'Veckoinsikter'
    },
    dailyAverage: {
      en: 'Daily Average',
      de: 'Tagesdurchschnitt',
      fr: 'Moyenne Quotidienne',
      es: 'Promedio Diario',
      pt: 'Média Diária',
      nl: 'Dagelijks Gemiddelde',
      no: 'Daglig Gjennomsnitt',
      sv: 'Dagligt Genomsnitt'
    },
    daysTracked: {
      en: 'Days Tracked',
      de: 'Getrackte Tage',
      fr: 'Jours Suivis',
      es: 'Días Rastreados',
      pt: 'Dias Rastreados',
      nl: 'Dagen Gevolgd',
      no: 'Dager Sporet',
      sv: 'Dagar Spårade'
    },
    trend: {
      en: 'Trend',
      de: 'Trend',
      fr: 'Tendance',
      es: 'Tendencia',
      pt: 'Tendência',
      nl: 'Trend',
      no: 'Trend',
      sv: 'Trend'
    },
    mealDistribution: {
      en: 'Meal Distribution',
      de: 'Mahlzeitenverteilung',
      fr: 'Répartition des Repas',
      es: 'Distribución de Comidas',
      pt: 'Distribuição de Refeições',
      nl: 'Maaltijdverdeling',
      no: 'Måltidsfordeling',
      sv: 'Måltidsfördelning'
    },
    recommendations: {
      en: 'Recommendations',
      de: 'Empfehlungen',
      fr: 'Recommandations',
      es: 'Recomendaciones',
      pt: 'Recomendações',
      nl: 'Aanbevelingen',
      no: 'Anbefalinger',
      sv: 'Rekommendationer'
    },

    // Warning Messages
    warnings: {
      exceededCalories: {
        en: 'You\'ve exceeded your daily calorie goal by {calories} calories',
        de: 'Sie haben Ihr tägliches Kalorienziel um {calories} Kalorien überschritten',
        fr: 'Vous avez dépassé votre objectif calorique quotidien de {calories} calories',
        es: 'Ha superado su objetivo diario de calorías en {calories} calorías',
        pt: 'Você excedeu sua meta diária de calorias em {calories} calorias',
        nl: 'U heeft uw dagelijkse caloriedoel met {calories} calorieën overschreden',
        no: 'Du har overskredet ditt daglige kalorimål med {calories} kalorier',
        sv: 'Du har överskridit ditt dagliga kalorimål med {calories} kalorier'
      },
      lighterMeals: {
        en: 'Consider lighter meals for the rest of the day or increase physical activity',
        de: 'Erwägen Sie leichtere Mahlzeiten für den Rest des Tages oder erhöhen Sie die körperliche Aktivität',
        fr: 'Envisagez des repas plus légers pour le reste de la journée ou augmentez l\'activité physique',
        es: 'Considere comidas más ligeras para el resto del día o aumente la actividad física',
        pt: 'Considere refeições mais leves para o resto do dia ou aumente a atividade física',
        nl: 'Overweeg lichtere maaltijden voor de rest van de dag of verhoog de lichaamsbeweging',
        no: 'Vurder lettere måltider for resten av dagen eller øk fysisk aktivitet',
        sv: 'Överväg lättare måltider för resten av dagen eller öka fysisk aktivitet'
      },
      reachedGoal: {
        en: 'You\'ve reached your daily calorie goal ({percent}%)',
        de: 'Sie haben Ihr tägliches Kalorienziel erreicht ({percent}%)',
        fr: 'Vous avez atteint votre objectif calorique quotidien ({percent}%)',
        es: 'Ha alcanzado su objetivo diario de calorías ({percent}%)',
        pt: 'Você atingiu sua meta diária de calorias ({percent}%)',
        nl: 'U heeft uw dagelijkse caloriedoel bereikt ({percent}%)',
        no: 'Du har nådd ditt daglige kalorimål ({percent}%)',
        sv: 'Du har nått ditt dagliga kalorimål ({percent}%)'
      },
      maintainLevel: {
        en: 'Try to maintain this level for the rest of the day',
        de: 'Versuchen Sie, dieses Niveau für den Rest des Tages beizubehalten',
        fr: 'Essayez de maintenir ce niveau pour le reste de la journée',
        es: 'Trate de mantener este nivel por el resto del día',
        pt: 'Tente manter este nível pelo resto do dia',
        nl: 'Probeer dit niveau voor de rest van de dag te behouden',
        no: 'Prøv å opprettholde dette nivået for resten av dagen',
        sv: 'Försök att behålla denna nivå för resten av dagen'
      },
      significantlyUnder: {
        en: 'You\'re significantly under your daily calorie goal ({percent}%)',
        de: 'Sie liegen deutlich unter Ihrem täglichen Kalorienziel ({percent}%)',
        fr: 'Vous êtes significativement en dessous de votre objectif calorique quotidien ({percent}%)',
        es: 'Está significativamente por debajo de su objetivo diario de calorías ({percent}%)',
        pt: 'Você está significativamente abaixo de sua meta diária de calorias ({percent}%)',
        nl: 'U ligt significant onder uw dagelijkse caloriedoel ({percent}%)',
        no: 'Du er betydelig under ditt daglige kalorimål ({percent}%)',
        sv: 'Du ligger betydligt under ditt dagliga kalorimål ({percent}%)'
      },
      healthySnacks: {
        en: 'Consider adding healthy snacks or larger portions to meet your nutritional needs',
        de: 'Erwägen Sie gesunde Snacks oder größere Portionen, um Ihren Ernährungsbedürfnissen gerecht zu werden',
        fr: 'Envisagez d\'ajouter des collations saines ou de plus grandes portions pour répondre à vos besoins nutritionnels',
        es: 'Considere agregar bocadillos saludables o porciones más grandes para satisfacer sus necesidades nutricionales',
        pt: 'Considere adicionar lanches saudáveis ou porções maiores para atender às suas necessidades nutricionais',
        nl: 'Overweeg het toevoegen van gezonde snacks of grotere porties om aan uw voedingsbehoeften te voldoen',
        no: 'Vurder å legge til sunne snacks eller større porsjoner for å dekke dine ernæringsbehov',
        sv: 'Överväg att lägga till nyttiga mellanmål eller större portioner för att möta dina näringsbehov'
      },
      lateEveningCalories: {
        en: 'Late evening calories can affect sleep quality',
        de: 'Späte Abendkalorien können die Schlafqualität beeinträchtigen',
        fr: 'Les calories tardives le soir peuvent affecter la qualité du sommeil',
        es: 'Las calorías tardías de la noche pueden afectar la calidad del sueño',
        pt: 'Calorias tardias à noite podem afetar a qualidade do sono',
        nl: 'Late avond calorieën kunnen de slaapkwaliteit beïnvloeden',
        no: 'Seine kveldskalorier kan påvirke søvnkvaliteten',
        sv: 'Sena kvällskalorier kan påverka sömnkvaliteten'
      },
      lighterOptions: {
        en: 'Consider lighter options if you need to eat before bed',
        de: 'Erwägen Sie leichtere Optionen, wenn Sie vor dem Schlafengehen essen müssen',
        fr: 'Envisagez des options plus légères si vous devez manger avant de vous coucher',
        es: 'Considere opciones más ligeras si necesita comer antes de acostarse',
        pt: 'Considere opções mais leves se precisar comer antes de dormir',
        nl: 'Overweeg lichtere opties als u voor het slapen moet eten',
        no: 'Vurder lettere alternativer hvis du må spise før sengetid',
        sv: 'Överväg lättare alternativ om du behöver äta innan du går och lägger dig'
      }
    }
  },

  // Expert Consultation Screen Translations
  expert: {
    // Header
    askExpert: {
      en: 'Ask Expert',
      de: 'Experten fragen',
      fr: 'Demander à l\'expert',
      es: 'Consultar experto',
      pt: 'Perguntar ao especialista',
      nl: 'Expert vragen',
      no: 'Spør ekspert',
      sv: 'Fråga expert'
    },
    askAnExpert: {
      en: 'Ask An Expert',
      de: 'Einen Experten fragen',
      fr: 'Demander à un expert',
      es: 'Consultar a un experto',
      pt: 'Perguntar a um especialista',
      nl: 'Een expert vragen',
      no: 'Spør en ekspert',
      sv: 'Fråga en expert'
    },

    // Welcome Screen
    askMedicalExperts: {
      en: 'Ask Our Medical Experts',
      de: 'Fragen Sie unsere medizinischen Experten',
      fr: 'Consultez nos experts médicaux',
      es: 'Consulte a nuestros expertos médicos',
      pt: 'Consulte nossos especialistas médicos',
      nl: 'Raadpleeg onze medische experts',
      no: 'Spør våre medisinske eksperter',
      sv: 'Fråga våra medicinska experter'
    },
    personalizedAdvice: {
      en: 'Get personalized advice from AI specialists about ingredient safety, health effects, and more.',
      de: 'Erhalten Sie personalisierte Beratung von KI-Spezialisten über Inhaltsstoffsicherheit, Gesundheitseffekte und mehr.',
      fr: 'Obtenez des conseils personnalisés d\'experts IA sur la sécurité des ingrédients, les effets sur la santé, etc.',
      es: 'Obtenga consejos personalizados de especialistas en IA sobre seguridad de ingredientes, efectos en la salud y más.',
      pt: 'Obtenha conselhos personalizados de especialistas em IA sobre segurança de ingredientes, efeitos na saúde e muito mais.',
      nl: 'Krijg gepersonaliseerd advies van AI-specialisten over ingrediëntveiligheid, gezondheidseffecten en meer.',
      no: 'Få personlig råd fra AI-spesialister om ingredienssikkerhet, helseeffekter og mer.',
      sv: 'Få personlig rådgivning från AI-specialister om ingredienssäkerhet, hälsoeffekter och mer.'
    },

    // Quick Questions
    quickQuestions: {
      en: 'Quick Questions',
      de: 'Schnelle Fragen',
      fr: 'Questions rapides',
      es: 'Preguntas rápidas',
      pt: 'Perguntas rápidas',
      nl: 'Snelle vragen',
      no: 'Raske spørsmål',
      sv: 'Snabba frågor'
    },
    safeSensitiveSkin: {
      en: 'Is this ingredient safe for sensitive skin?',
      de: 'Ist dieser Inhaltsstoff für empfindliche Haut sicher?',
      fr: 'Cet ingrédient est-il sûr pour les peaux sensibles ?',
      es: '¿Es seguro este ingrediente para pieles sensibles?',
      pt: 'Este ingrediente é seguro para peles sensíveis?',
      nl: 'Is dit ingrediënt veilig voor gevoelige huid?',
      no: 'Er denne ingrediensen trygg for sensitiv hud?',
      sv: 'Är denna ingrediens säker för känslig hud?'
    },
    allergyRisks: {
      en: 'What are the allergy risks?',
      de: 'Was sind die Allergierisiken?',
      fr: 'Quels sont les risques d\'allergie ?',
      es: '¿Cuáles son los riesgos de alergia?',
      pt: 'Quais são os riscos de alergia?',
      nl: 'Wat zijn de allergierisico\'s?',
      no: 'Hva er allergirisikoen?',
      sv: 'Vilka är allergiriskererna?'
    },
    digestiveIssues: {
      en: 'Could this cause digestive issues?',
      de: 'Könnte dies Verdauungsprobleme verursachen?',
      fr: 'Cela pourrait-il causer des problèmes digestifs ?',
      es: '¿Podría esto causar problemas digestivos?',
      pt: 'Isso poderia causar problemas digestivos?',
      nl: 'Zou dit spijsverteringsproblemen kunnen veroorzaken?',
      no: 'Kan dette forårsake fordøyelsesproblemer?',
      sv: 'Kan detta orsaka matsmältningsproblem?'
    },

    // Input and Voice
    inputPlaceholder: {
      en: 'Ask about ingredient safety, health effects, or get expert advice...',
      de: 'Fragen Sie nach Inhaltsstoffsicherheit, Gesundheitseffekten oder holen Sie sich Expertenrat...',
      fr: 'Posez des questions sur la sécurité des ingrédients, les effets sur la santé ou obtenez des conseils d\'experts...',
      es: 'Pregunte sobre seguridad de ingredientes, efectos en la salud u obtenga consejos de expertos...',
      pt: 'Pergunte sobre segurança de ingredientes, efeitos na saúde ou obtenha conselhos de especialistas...',
      nl: 'Vraag naar ingrediëntveiligheid, gezondheidseffecten of krijg deskundig advies...',
      no: 'Spør om ingredienssikkerhet, helseeffekter eller få ekspertråd...',
      sv: 'Fråga om ingredienssäkerhet, hälsoeffekter eller få expertrådgivning...'
    },
    voiceInput: {
      en: 'Voice input',
      de: 'Spracheingabe',
      fr: 'Saisie vocale',
      es: 'Entrada de voz',
      pt: 'Entrada de voz',
      nl: 'Spraakinvoer',
      no: 'Taleinngang',
      sv: 'Röstinmatning'
    },
    sendMessage: {
      en: 'Send message',
      de: 'Nachricht senden',
      fr: 'Envoyer le message',
      es: 'Enviar mensaje',
      pt: 'Enviar mensagem',
      nl: 'Bericht verzenden',
      no: 'Send melding',
      sv: 'Skicka meddelande'
    },
    listening: {
      en: 'Listening... Speak your question',
      de: 'Höre zu... Sprechen Sie Ihre Frage',
      fr: 'Écoute... Posez votre question',
      es: 'Escuchando... Haga su pregunta',
      pt: 'Escutando... Faça sua pergunta',
      nl: 'Luisteren... Stel je vraag',
      no: 'Lytter... Still spørsmålet ditt',
      sv: 'Lyssnar... Ställ din fråga'
    },

    // System Messages
    multipleExpertsFound: {
      en: 'I found multiple experts who can help with your question. Which would you prefer?',
      de: 'Ich habe mehrere Experten gefunden, die bei Ihrer Frage helfen können. Welchen bevorzugen Sie?',
      fr: 'J\'ai trouvé plusieurs experts qui peuvent vous aider avec votre question. Lequel préférez-vous ?',
      es: 'Encontré varios expertos que pueden ayudar con su pregunta. ¿Cuál preferiría?',
      pt: 'Encontrei vários especialistas que podem ajudar com sua pergunta. Qual você preferiria?',
      nl: 'Ik heb meerdere experts gevonden die kunnen helpen met uw vraag. Welke heeft uw voorkeur?',
      no: 'Jeg fant flere eksperter som kan hjelpe med spørsmålet ditt. Hvilken foretrekker du?',
      sv: 'Jag hittade flera experter som kan hjälpa dig med din fråga. Vilken föredrar du?'
    },
    noExpertMatch: {
      en: 'I\'m not sure which expert would be best for your question. Could you provide more details or choose an expert from the list below?',
      de: 'Ich bin mir nicht sicher, welcher Experte für Ihre Frage am besten wäre. Könnten Sie mehr Details angeben oder einen Experten aus der Liste unten wählen?',
      fr: 'Je ne suis pas sûr quel expert serait le mieux pour votre question. Pourriez-vous donner plus de détails ou choisir un expert dans la liste ci-dessous ?',
      es: 'No estoy seguro qué experto sería mejor para su pregunta. ¿Podría proporcionar más detalles o elegir un experto de la lista siguiente?',
      pt: 'Não tenho certeza de qual especialista seria melhor para sua pergunta. Poderia fornecer mais detalhes ou escolher um especialista da lista abaixo?',
      nl: 'Ik weet niet zeker welke expert het beste zou zijn voor uw vraag. Kunt u meer details geven of een expert kiezen uit de onderstaande lijst?',
      no: 'Jeg er ikke sikker på hvilken ekspert som ville være best for spørsmålet ditt. Kan du gi flere detaljer eller velge en ekspert fra listen nedenfor?',
      sv: 'Jag är inte säker på vilken expert som skulle vara bäst för din fråga. Kan du ge fler detaljer eller välja en expert från listan nedan?'
    },
    processingError: {
      en: 'Sorry, I encountered an error processing your question. Please try again.',
      de: 'Entschuldigung, beim Verarbeiten Ihrer Frage ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.',
      fr: 'Désolé, j\'ai rencontré une erreur lors du traitement de votre question. Veuillez réessayer.',
      es: 'Lo siento, encontré un error al procesar su pregunta. Por favor, inténtelo de nuevo.',
      pt: 'Desculpe, encontrei um erro ao processar sua pergunta. Por favor, tente novamente.',
      nl: 'Sorry, ik kreeg een fout bij het verwerken van uw vraag. Probeer het opnieuw.',
      no: 'Beklager, jeg støtte på en feil ved behandling av spørsmålet ditt. Prøv igjen.',
      sv: 'Ursäkta, jag stötte på ett fel när jag bearbetade din fråga. Försök igen.'
    },
    expertUnavailable: {
      en: 'The expert is currently unavailable. Please try again later.',
      de: 'Der Experte ist derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.',
      fr: 'L\'expert n\'est actuellement pas disponible. Veuillez réessayer plus tard.',
      es: 'El experto no está disponible actualmente. Por favor, inténtelo más tarde.',
      pt: 'O especialista não está disponível no momento. Por favor, tente novamente mais tarde.',
      nl: 'De expert is momenteel niet beschikbaar. Probeer het later opnieuw.',
      no: 'Eksperten er for øyeblikket ikke tilgjengelig. Prøv igjen senere.',
      sv: 'Experten är för närvarande otillgänglig. Försök igen senare.'
    },
    voiceNotSupported: {
      en: 'Voice input not supported in this browser',
      de: 'Spracheingabe in diesem Browser nicht unterstützt',
      fr: 'Saisie vocale non supportée dans ce navigateur',
      es: 'Entrada de voz no compatible con este navegador',
      pt: 'Entrada de voz não suportada neste navegador',
      nl: 'Spraakinvoer niet ondersteund in deze browser',
      no: 'Taleinngang ikke støttet i denne nettleseren',
      sv: 'Röstinmatning stöds inte i denna webbläsare'
    },

    // Expert Response Elements
    recommendations: {
      en: 'Recommendations:',
      de: 'Empfehlungen:',
      fr: 'Recommandations :',
      es: 'Recomendaciones:',
      pt: 'Recomendações:',
      nl: 'Aanbevelingen:',
      no: 'Anbefalinger:',
      sv: 'Rekommendationer:'
    },
    recommended: {
      en: 'Recommended',
      de: 'Empfohlen',
      fr: 'Recommandé',
      es: 'Recomendado',
      pt: 'Recomendado',
      nl: 'Aanbevolen',
      no: 'Anbefalt',
      sv: 'Rekommenderad'
    },
    disclaimer: {
      en: 'This is AI-generated information for educational purposes only and does not replace professional medical advice.',
      de: 'Dies sind KI-generierte Informationen nur zu Bildungszwecken und ersetzen keine professionelle medizinische Beratung.',
      fr: 'Il s\'agit d\'informations générées par l\'IA à des fins éducatives uniquement et ne remplacent pas les conseils médicaux professionnels.',
      es: 'Esta es información generada por IA solo con fines educativos y no reemplaza el consejo médico profesional.',
      pt: 'Esta é uma informação gerada por IA apenas para fins educacionais e não substitui o conselho médico profissional.',
      nl: 'Dit is door AI gegenereerde informatie alleen voor educatieve doeleinden en vervangt geen professioneel medisch advies.',
      no: 'Dette er AI-generert informasjon kun for utdanningsformål og erstatter ikke profesjonelle medisinske råd.',
      sv: 'Detta är AI-genererad information endast för utbildningsändamål och ersätter inte professionell medicinsk rådgivning.'
    },

    // Expert Names and Titles
    experts: {
      allergist: {
        name: {
          en: 'AI Allergist Assistant',
          de: 'KI-Allergologe-Assistent',
          fr: 'Assistant allergologue IA',
          es: 'Asistente alergólogo IA',
          pt: 'Assistente alergista IA',
          nl: 'AI allergoloog assistent',
          no: 'AI allergolog assistent',
          sv: 'AI allergolog assistent'
        },
        title: {
          en: 'Allergy & Immunology AI',
          de: 'Allergie & Immunologie KI',
          fr: 'IA Allergie & Immunologie',
          es: 'IA Alergia e Inmunología',
          pt: 'IA Alergia e Imunologia',
          nl: 'Allergie & Immunologie AI',
          no: 'Allergi & immunologi AI',
          sv: 'Allergi & immunologi AI'
        }
      },
      dermatologist: {
        name: {
          en: 'AI Dermatology Consultant',
          de: 'KI-Dermatologie-Berater',
          fr: 'Consultant dermatologie IA',
          es: 'Consultor dermatología IA',
          pt: 'Consultor dermatologia IA',
          nl: 'AI dermatologie consultant',
          no: 'AI dermatologi konsulent',
          sv: 'AI dermatologi konsulent'
        },
        title: {
          en: 'Skin Health AI',
          de: 'Hautgesundheits-KI',
          fr: 'IA Santé de la peau',
          es: 'IA Salud de la piel',
          pt: 'IA Saúde da pele',
          nl: 'Huidgezondheid AI',
          no: 'Hudhelse AI',
          sv: 'Hudhälsa AI'
        }
      },
      gastroenterologist: {
        name: {
          en: 'AI Digestive Health Advisor',
          de: 'KI-Verdauungsgesundheits-Berater',
          fr: 'Conseiller santé digestive IA',
          es: 'Asesor salud digestiva IA',
          pt: 'Consultor saúde digestiva IA',
          nl: 'AI spijsvertering gezondheidsadviseur',
          no: 'AI fordøyelseshelse rådgiver',
          sv: 'AI matsmältningshälsa rådgivare'
        },
        title: {
          en: 'Gut Health AI',
          de: 'Darmgesundheits-KI',
          fr: 'IA Santé intestinale',
          es: 'IA Salud intestinal',
          pt: 'IA Saúde intestinal',
          nl: 'Darmgezondheid AI',
          no: 'Tarmhelse AI',
          sv: 'Tarmhälsa AI'
        }
      },
      endocrinologist: {
        name: {
          en: 'AI Metabolic Health Specialist',
          de: 'KI-Stoffwechselgesundheits-Spezialist',
          fr: 'Spécialiste santé métabolique IA',
          es: 'Especialista salud metabólica IA',
          pt: 'Especialista saúde metabólica IA',
          nl: 'AI metabolische gezondheidsspecialist',
          no: 'AI metabolsk helse spesialist',
          sv: 'AI metabolisk hälsa specialist'
        },
        title: {
          en: 'Hormone & Metabolism AI',
          de: 'Hormon & Stoffwechsel KI',
          fr: 'IA Hormones & Métabolisme',
          es: 'IA Hormonas y Metabolismo',
          pt: 'IA Hormônios e Metabolismo',
          nl: 'Hormoon & stofwisseling AI',
          no: 'Hormon & metabolisme AI',
          sv: 'Hormon & ämnesomsättning AI'
        }
      },
      toxicologist: {
        name: {
          en: 'AI Chemical Safety Analyst',
          de: 'KI-Chemische-Sicherheits-Analyst',
          fr: 'Analyste sécurité chimique IA',
          es: 'Analista seguridad química IA',
          pt: 'Analista segurança química IA',
          nl: 'AI chemische veiligheidsanalist',
          no: 'AI kjemisk sikkerhetsanalytiker',
          sv: 'AI kemisk säkerhetsanalytiker'
        },
        title: {
          en: 'Toxicology AI',
          de: 'Toxikologie KI',
          fr: 'IA Toxicologie',
          es: 'IA Toxicología',
          pt: 'IA Toxicologia',
          nl: 'Toxicologie AI',
          no: 'Toksikologi AI',
          sv: 'Toxikologi AI'
        }
      },
      nutritionist: {
        name: {
          en: 'AI Nutrition Advisor',
          de: 'KI-Ernährungsberater',
          fr: 'Conseiller nutrition IA',
          es: 'Asesor nutrición IA',
          pt: 'Consultor nutrição IA',
          nl: 'AI voeding adviseur',
          no: 'AI ernæringsrådgiver',
          sv: 'AI näringskonsult'
        },
        title: {
          en: 'Digital Nutritionist',
          de: 'Digitaler Ernährungsexperte',
          fr: 'Nutritionniste numérique',
          es: 'Nutricionista digital',
          pt: 'Nutricionista digital',
          nl: 'Digitale voedingskundige',
          no: 'Digital ernæringsfysiolog',
          sv: 'Digital näringsexpert'
        }
      },
      pediatrician: {
        name: {
          en: 'AI Child Health Specialist',
          de: 'KI-Kinderarztspezialist',
          fr: 'Spécialiste santé enfant IA',
          es: 'Especialista salud infantil IA',
          pt: 'Especialista saúde infantil IA',
          nl: 'AI kindergezondheidsspecialist',
          no: 'AI barnehelse spesialist',
          sv: 'AI barnhälsa specialist'
        },
        title: {
          en: 'Pediatric Safety AI',
          de: 'Pädiatrische Sicherheits-KI',
          fr: 'IA Sécurité pédiatrique',
          es: 'IA Seguridad pediátrica',
          pt: 'IA Segurança pediátrica',
          nl: 'Pediatrische veiligheid AI',
          no: 'Pediatrisk sikkerhet AI',
          sv: 'Pediatrisk säkerhet AI'
        }
      }
    }
  },

  // History Screen Translations
  history: {
    // Header
    scanHistory: {
      en: 'Scan History',
      de: 'Scan-Verlauf',
      fr: 'Historique des scans',
      es: 'Historial de escaneos',
      pt: 'Histórico de digitalizações',
      nl: 'Scan geschiedenis',
      no: 'Skannehistorikk',
      sv: 'Skanningshistorik'
    },

    // Loading States
    loadingHistory: {
      en: 'Loading your scan history...',
      de: 'Ihr Scan-Verlauf wird geladen...',
      fr: 'Chargement de votre historique de scans...',
      es: 'Cargando su historial de escaneos...',
      pt: 'Carregando seu histórico de digitalizações...',
      nl: 'Uw scan geschiedenis wordt geladen...',
      no: 'Laster din skannehistorikk...',
      sv: 'Laddar din skanningshistorik...'
    },

    // Filter Buttons
    filterAll: {
      en: 'All',
      de: 'Alle',
      fr: 'Tous',
      es: 'Todos',
      pt: 'Todos',
      nl: 'Alles',
      no: 'Alle',
      sv: 'Alla'
    },
    filterFood: {
      en: 'Food',
      de: 'Lebensmittel',
      fr: 'Alimentation',
      es: 'Alimentación',
      pt: 'Alimentação',
      nl: 'Voeding',
      no: 'Mat',
      sv: 'Mat'
    },
    filterCosmetic: {
      en: 'Cosmetic',
      de: 'Kosmetik',
      fr: 'Cosmétique',
      es: 'Cosmético',
      pt: 'Cosmético',
      nl: 'Cosmetica',
      no: 'Kosmetikk',
      sv: 'Kosmetik'
    },
    filterHousehold: {
      en: 'Household',
      de: 'Haushalt',
      fr: 'Ménager',
      es: 'Hogar',
      pt: 'Doméstico',
      nl: 'Huishouden',
      no: 'Husholdning',
      sv: 'Hushåll'
    },

    // Error Messages
    loadError: {
      en: 'Failed to load scan history. Please try again.',
      de: 'Scan-Verlauf konnte nicht geladen werden. Bitte versuchen Sie es erneut.',
      fr: 'Échec du chargement de l\'historique des scans. Veuillez réessayer.',
      es: 'Error al cargar el historial de escaneos. Por favor, inténtelo de nuevo.',
      pt: 'Falha ao carregar o histórico de digitalizações. Por favor, tente novamente.',
      nl: 'Scan geschiedenis kon niet worden geladen. Probeer het opnieuw.',
      no: 'Kunne ikke laste skannehistorikk. Prøv igjen.',
      sv: 'Kunde inte ladda skanningshistorik. Försök igen.'
    },
    retry: {
      en: 'Retry',
      de: 'Wiederholen',
      fr: 'Réessayer',
      es: 'Reintentar',
      pt: 'Tentar novamente',
      nl: 'Opnieuw proberen',
      no: 'Prøv igjen',
      sv: 'Försök igen'
    },

    // Empty State
    noScans: {
      en: 'No Scans Yet',
      de: 'Noch keine Scans',
      fr: 'Aucun scan encore',
      es: 'Aún no hay escaneos',
      pt: 'Ainda não há digitalizações',
      nl: 'Nog geen scans',
      no: 'Ingen skanninger ennå',
      sv: 'Inga skanningar än'
    },
    startScanning: {
      en: 'Start scanning products to see your history here',
      de: 'Beginnen Sie mit dem Scannen von Produkten, um Ihren Verlauf hier zu sehen',
      fr: 'Commencez à scanner des produits pour voir votre historique ici',
      es: 'Comience a escanear productos para ver su historial aquí',
      pt: 'Comece a digitalizar produtos para ver seu histórico aqui',
      nl: 'Begin met scannen van producten om uw geschiedenis hier te zien',
      no: 'Start å skanne produkter for å se historikken din her',
      sv: 'Börja skanna produkter för att se din historik här'
    },
    startScanningButton: {
      en: 'Start Scanning',
      de: 'Scannen beginnen',
      fr: 'Commencer le scan',
      es: 'Comenzar escaneo',
      pt: 'Começar digitalização',
      nl: 'Begin scannen',
      no: 'Start skanning',
      sv: 'Börja skanna'
    },

    // Scan Item Details
    ingredientsCount: {
      en: '{count} ingredients',
      de: '{count} Inhaltsstoffe',
      fr: '{count} ingrédients',
      es: '{count} ingredientes',
      pt: '{count} ingredientes',
      nl: '{count} ingrediënten',
      no: '{count} ingredienser',
      sv: '{count} ingredienser'
    },
    deleteScan: {
      en: 'Delete scan',
      de: 'Scan löschen',
      fr: 'Supprimer le scan',
      es: 'Eliminar escaneo',
      pt: 'Excluir digitalização',
      nl: 'Scan verwijderen',
      no: 'Slett skanning',
      sv: 'Ta bort skanning'
    },
    confirmDelete: {
      en: 'Are you sure you want to delete this scan?',
      de: 'Sind Sie sicher, dass Sie diesen Scan löschen möchten?',
      fr: 'Êtes-vous sûr de vouloir supprimer ce scan?',
      es: '¿Está seguro de que desea eliminar este escaneo?',
      pt: 'Tem certeza de que deseja excluir esta digitalização?',
      nl: 'Weet u zeker dat u deze scan wilt verwijderen?',
      no: 'Er du sikker på at du vil slette denne skanningen?',
      sv: 'Är du säker på att du vill ta bort denna skanning?'
    },

    // Category Labels
    categoryFood: {
      en: 'Food',
      de: 'Lebensmittel',
      fr: 'Alimentation',
      es: 'Alimentación', 
      pt: 'Alimentação',
      nl: 'Voeding',
      no: 'Mat',
      sv: 'Mat'
    },
    categoryCosmetic: {
      en: 'Cosmetic',
      de: 'Kosmetik',
      fr: 'Cosmétique',
      es: 'Cosmético',
      pt: 'Cosmético',
      nl: 'Cosmetica',
      no: 'Kosmetikk',
      sv: 'Kosmetik'
    },
    categoryHousehold: {
      en: 'Household',
      de: 'Haushalt',
      fr: 'Ménager',
      es: 'Hogar',
      pt: 'Doméstico',
      nl: 'Huishouden',
      no: 'Husholdning',
      sv: 'Hushåll'
    }
  },

  // Camera Screen Translations
  camera: {
    // Mode configurations
    mode: {
      ingredientList: {
        title: {
          en: 'Ingredient List',
          de: 'Zutatenliste',
          fr: 'Liste d\'ingrédients',
          es: 'Lista de ingredientes',
          pt: 'Lista de ingredientes',
          nl: 'Ingrediëntenlijst',
          no: 'Ingrediensliste',
          sv: 'Ingredienslista'
        },
        description: {
          en: 'Scan text from product labels',
          de: 'Scannen Sie Text von Produktetiketten',
          fr: 'Scanner le texte des étiquettes de produits',
          es: 'Escanear texto de las etiquetas de productos',
          pt: 'Digitalizar texto de rótulos de produtos',
          nl: 'Scan tekst van productlabels',
          no: 'Skann tekst fra produktetiketter',
          sv: 'Skanna text från produktetiketter'
        }
      },
      preparedMeal: {
        title: {
          en: 'Prepared Meal',
          de: 'Zubereitete Mahlzeit',
          fr: 'Repas préparé',
          es: 'Comida preparada',
          pt: 'Refeição preparada',
          nl: 'Bereide maaltijd',
          no: 'Tilberedt måltid',
          sv: 'Tillagad måltid'
        },
        description: {
          en: 'Analyze prepared meals with AI',
          de: 'Analysiere zubereitete Mahlzeiten mit KI',
          fr: 'Analyser les repas préparés avec l\'IA',
          es: 'Analizar comidas preparadas con IA',
          pt: 'Analisar refeições preparadas com IA',
          nl: 'Analyseer bereide maaltijden met AI',
          no: 'Analyser tilberedte måltider med AI',
          sv: 'Analysera tillagade måltider med AI'
        }
      }
    },

    // Processing steps
    processing: {
      preparing: {
        en: 'Preparing image...',
        de: 'Bild wird vorbereitet...',
        fr: 'Préparation de l\'image...',
        es: 'Preparando imagen...',
        pt: 'Preparando imagem...',
        nl: 'Afbeelding voorbereiden...',
        no: 'Forbereder bilde...',
        sv: 'Förbereder bild...'
      },
      analyzing: {
        en: 'Analyzing meal...',
        de: 'Mahlzeit wird analysiert...',
        fr: 'Analyse du repas...',
        es: 'Analizando comida...',
        pt: 'Analisando refeição...',
        nl: 'Maaltijd analyseren...',
        no: 'Analyserer måltid...',
        sv: 'Analyserar måltid...'
      },
      extracting: {
        en: 'Extracting text...',
        de: 'Text wird extrahiert...',
        fr: 'Extraction du texte...',
        es: 'Extrayendo texto...',
        pt: 'Extraindo texto...',
        nl: 'Tekst extraheren...',
        no: 'Trekker ut tekst...',
        sv: 'Extraherar text...'
      },
      parsing: {
        en: 'Parsing ingredients...',
        de: 'Zutaten werden analysiert...',
        fr: 'Analyse des ingrédients...',
        es: 'Analizando ingredientes...',
        pt: 'Analisando ingredientes...',
        nl: 'Ingrediënten analyseren...',
        no: 'Analyserer ingredienser...',
        sv: 'Analyserar ingredienser...'
      },
      nutrition: {
        en: 'Calculating nutrition...',
        de: 'Nährwerte werden berechnet...',
        fr: 'Calcul de la nutrition...',
        es: 'Calculando nutrición...',
        pt: 'Calculando nutrição...',
        nl: 'Voeding berekenen...',
        no: 'Beregner ernæring...',
        sv: 'Beräknar näring...'
      },
      health: {
        en: 'Assessing health impact...',
        de: 'Gesundheitsauswirkungen werden bewertet...',
        fr: 'Évaluation de l\'impact sur la santé...',
        es: 'Evaluando impacto en la salud...',
        pt: 'Avaliando impacto na saúde...',
        nl: 'Gezondheidsimpact beoordelen...',
        no: 'Vurderer helsepåvirkning...',
        sv: 'Bedömer hälsopåverkan...'
      },
      complete: {
        en: 'Complete!',
        de: 'Fertig!',
        fr: 'Terminé!',
        es: '¡Completado!',
        pt: 'Completo!',
        nl: 'Voltooid!',
        no: 'Fullført!',
        sv: 'Klar!'
      }
    },

    // Instructions
    instructions: {
      'ingredient-list': {
        en: 'Align ingredient list within the frame and tap to scan',
        de: 'Richten Sie die Zutatenliste im Rahmen aus und tippen Sie zum Scannen',
        fr: 'Alignez la liste d\'ingrédients dans le cadre et appuyez pour scanner',
        es: 'Aline la lista de ingredientes en el marco y toque para escanear',
        pt: 'Alinhe a lista de ingredientes no quadro e toque para digitalizar',
        nl: 'Lijn de ingrediëntenlijst uit in het frame en tik om te scannen',
        no: 'Juster ingredienslisten innenfor rammen og trykk for å skanne',
        sv: 'Rikta in ingredienslistan i ramen och tryck för att skanna'
      },
      'prepared-meal': {
        en: 'Center the prepared meal in view and tap to analyze',
        de: 'Zentrieren Sie die zubereitete Mahlzeit im Bild und tippen Sie zum Analysieren',
        fr: 'Centrez le repas préparé dans la vue et appuyez pour analyser',
        es: 'Centre la comida preparada en la vista y toque para analizar',
        pt: 'Centre a refeição preparada na visualização e toque para analisar',
        nl: 'Centreer de bereide maaltijd in beeld en tik om te analyseren',
        no: 'Sentrer det tilberedte måltidet i visningen og trykk for å analysere',
        sv: 'Centrera den tillagade måltiden i vyn och tryck för att analysera'
      },
      food: {
        en: 'Align the product label within the frame',
        de: 'Richten Sie das Produktetikett im Rahmen aus',
        fr: 'Alignez l\'étiquette du produit dans le cadre',
        es: 'Aline la etiqueta del producto en el marco',
        pt: 'Alinhe o rótulo do produto no quadro',
        nl: 'Lijn het productlabel uit in het frame',
        no: 'Juster produktetiketten innenfor rammen',
        sv: 'Rikta in produktetiketten i ramen'
      },
      cosmetic: {
        en: 'Align the cosmetic label within the frame',
        de: 'Richten Sie das Kosmetiketikett im Rahmen aus',
        fr: 'Alignez l\'étiquette cosmétique dans le cadre',
        es: 'Aline la etiqueta cosmética en el marco',
        pt: 'Alinhe o rótulo cosmético no quadro',
        nl: 'Lijn het cosmetica label uit in het frame',
        no: 'Juster kosmetikketiketten innenfor rammen',
        sv: 'Rikta in kosmetiketiketten i ramen'
      },
      household: {
        en: 'Align the household product label within the frame',
        de: 'Richten Sie das Haushaltsprodukt-Etikett im Rahmen aus',
        fr: 'Alignez l\'étiquette du produit ménager dans le cadre',
        es: 'Aline la etiqueta del producto doméstico en el marco',
        pt: 'Alinhe o rótulo do produto doméstico no quadro',
        nl: 'Lijn het huishoudproduct label uit in het frame',
        no: 'Juster husholdningsprodukt-etiketten innenfor rammen',
        sv: 'Rikta in hushållsproduktetiketten i ramen'
      }
    },

    // Error messages
    errors: {
      processingFailed: {
        en: 'Processing failed. Please try again.',
        de: 'Verarbeitung fehlgeschlagen. Bitte versuchen Sie es erneut.',
        fr: 'Échec du traitement. Veuillez réessayer.',
        es: 'Error de procesamiento. Por favor, inténtelo de nuevo.',
        pt: 'Falha no processamento. Por favor, tente novamente.',
        nl: 'Verwerking mislukt. Probeer het opnieuw.',
        no: 'Behandlingen mislyktes. Prøv igjen.',
        sv: 'Behandlingen misslyckades. Försök igen.'
      },
      noTextFound: {
        en: 'No text found in image. Try taking a clearer photo.',
        de: 'Kein Text im Bild gefunden. Versuchen Sie ein klareres Foto.',
        fr: 'Aucun texte trouvé dans l\'image. Essayez de prendre une photo plus claire.',
        es: 'No se encontró texto en la imagen. Intente tomar una foto más clara.',
        pt: 'Nenhum texto encontrado na imagem. Tente tirar uma foto mais clara.',
        nl: 'Geen tekst gevonden in afbeelding. Probeer een scherpere foto.',
        no: 'Ingen tekst funnet i bildet. Prøv å ta et klarere bilde.',
        sv: 'Ingen text hittades i bilden. Försök ta ett tydligare foto.'
      },
      noIngredientsFound: {
        en: 'No ingredients detected. Please try a different image.',
        de: 'Keine Zutaten erkannt. Bitte versuchen Sie ein anderes Bild.',
        fr: 'Aucun ingrédient détecté. Veuillez essayer une autre image.',
        es: 'No se detectaron ingredientes. Por favor, pruebe con una imagen diferente.',
        pt: 'Nenhum ingrediente detectado. Por favor, tente uma imagem diferente.',
        nl: 'Geen ingrediënten gedetecteerd. Probeer een andere afbeelding.',
        no: 'Ingen ingredienser oppdaget. Prøv et annet bilde.',
        sv: 'Inga ingredienser upptäcktes. Försök med en annan bild.'
      },
      noFoodFound: {
        en: 'No food items detected in image',
        de: 'Keine Lebensmittel im Bild erkannt',
        fr: 'Aucun aliment détecté dans l\'image',
        es: 'No se detectaron alimentos en la imagen',
        pt: 'Nenhum alimento detectado na imagem',
        nl: 'Geen voedingsmiddelen gedetecteerd in afbeelding',
        no: 'Ingen matvarer oppdaget i bildet',
        sv: 'Inga livsmedelsprodukter upptäcktes i bilden'
      },
      visionApiFailed: {
        en: 'AI food recognition failed. Try taking a clearer photo or switch to ingredient list mode.',
        de: 'KI-Lebensmittelerkennung fehlgeschlagen. Versuchen Sie ein klareres Foto oder wechseln Sie zum Zutatenlisten-Modus.',
        fr: 'La reconnaissance alimentaire IA a échoué. Essayez de prendre une photo plus claire ou passez au mode liste d\'ingrédients.',
        es: 'El reconocimiento de alimentos IA falló. Intente tomar una foto más clara o cambie al modo de lista de ingredientes.',
        pt: 'Reconhecimento de alimentos IA falhou. Tente tirar uma foto mais clara ou mude para o modo lista de ingredientes.',
        nl: 'AI voedselherkenning mislukt. Probeer een scherpere foto of schakel over naar ingrediëntenlijst modus.',
        no: 'AI mat-gjenkjenning mislyktes. Prøv å ta et klarere bilde eller bytt til ingrediensliste-modus.',
        sv: 'AI-matidentifiering misslyckades. Försök ta ett tydligare foto eller byt till ingredienslista-läge.'
      },
      ocrFailed: {
        en: 'Text extraction failed. Try taking a clearer photo.',
        de: 'Textextraktion fehlgeschlagen. Versuchen Sie ein klareres Foto.',
        fr: 'Extraction de texte échouée. Essayez de prendre une photo plus claire.',
        es: 'Extracción de texto falló. Intente tomar una foto más clara.',
        pt: 'Extração de texto falhou. Tente tirar uma foto mais clara.',
        nl: 'Tekstextractie mislukt. Probeer een scherpere foto.',
        no: 'Tekstutvinning mislyktes. Prøv å ta et klarere bilde.',
        sv: 'Textextrahering misslyckades. Försök ta ett tydligare foto.'
      }
    },

    // Headers and titles
    scanFood: {
      en: 'Scan Food',
      de: 'Lebensmittel scannen',
      fr: 'Scanner alimentation',
      es: 'Escanear alimento',
      pt: 'Digitalizar alimento',
      nl: 'Voeding scannen',
      no: 'Skann mat',
      sv: 'Skanna mat'
    },
    scanLabel: {
      en: 'Scan Label',
      de: 'Etikett scannen',
      fr: 'Scanner étiquette',
      es: 'Escanear etiqueta',
      pt: 'Digitalizar rótulo',
      nl: 'Label scannen',
      no: 'Skann etikett',
      sv: 'Skanna etikett'
    },
    retry: {
      en: 'Retry',
      de: 'Wiederholen',
      fr: 'Réessayer',
      es: 'Reintentar',
      pt: 'Tentar novamente',
      nl: 'Opnieuw proberen',
      no: 'Prøv igjen',
      sv: 'Försök igen'
    }
  },

  // Profile Screen Translations
  profile: {
    // Headers
    title: {
      en: 'Profile Settings',
      de: 'Profil-Einstellungen',
      fr: 'Paramètres du Profil',
      es: 'Configuración del Perfil',
      pt: 'Configurações do Perfil',
      nl: 'Profielinstellingen',
      no: 'Profilinnstillinger',
      sv: 'Profilinställningar'
    },
    personalInfo: {
      en: 'Personal Information',
      de: 'Persönliche Informationen',
      fr: 'Informations Personnelles',
      es: 'Información Personal',
      pt: 'Informações Pessoais',
      nl: 'Persoonlijke Informatie',
      no: 'Personlig Informasjon',
      sv: 'Personlig Information'
    },
    biometricInfo: {
      en: 'Biometric Information',
      de: 'Biometrische Informationen',
      fr: 'Informations Biométriques',
      es: 'Información Biométrica',
      pt: 'Informações Biométricas',
      nl: 'Biometrische Informatie',
      no: 'Biometrisk Informasjon',
      sv: 'Biometrisk Information'
    },
    allergiesTitle: {
      en: 'Allergies & Dietary Restrictions',
      de: 'Allergien & Ernährungseinschränkungen',
      fr: 'Allergies & Restrictions Alimentaires',
      es: 'Alergias y Restricciones Dietéticas',
      pt: 'Alergias e Restrições Alimentares',
      nl: 'Allergieën & Dieetbeperkingen',
      no: 'Allergier & Kostrestriksjoner',
      sv: 'Allergier & Kostrestriktioner'
    },
    privacyTitle: {
      en: 'Privacy & Storage',
      de: 'Datenschutz & Speicher',
      fr: 'Confidentialité & Stockage',
      es: 'Privacidad y Almacenamiento',
      pt: 'Privacidade e Armazenamento',
      nl: 'Privacy & Opslag',
      no: 'Personvern & Lagring',
      sv: 'Integritet & Lagring'
    },
    aboutTitle: {
      en: 'About IPICIA.COM',
      de: 'Über IPICIA.COM',
      fr: 'À propos de IPICIA.COM',
      es: 'Acerca de IPICIA.COM',
      pt: 'Sobre IPICIA.COM',
      nl: 'Over IPICIA.COM',
      no: 'Om IPICIA.COM',
      sv: 'Om IPICIA.COM'
    },
    
    // Labels
    language: {
      en: 'Language',
      de: 'Sprache',
      fr: 'Langue',
      es: 'Idioma',
      pt: 'Idioma',
      nl: 'Taal',
      no: 'Språk',
      sv: 'Språk'
    },
    pushNotifications: {
      en: 'Push Notifications',
      de: 'Push-Benachrichtigungen',
      fr: 'Notifications Push',
      es: 'Notificaciones Push',
      pt: 'Notificações Push',
      nl: 'Push-meldingen',
      no: 'Push-varsler',
      sv: 'Push-notiser'
    },
    units: {
      en: 'Units',
      de: 'Einheiten',
      fr: 'Unités',
      es: 'Unidades',
      pt: 'Unidades',
      nl: 'Eenheden',
      no: 'Enheter',
      sv: 'Enheter'
    },
    age: {
      en: 'Age',
      de: 'Alter',
      fr: 'Âge',
      es: 'Edad',
      pt: 'Idade',
      nl: 'Leeftijd',
      no: 'Alder',
      sv: 'Ålder'
    },
    gender: {
      en: 'Gender',
      de: 'Geschlecht',
      fr: 'Genre',
      es: 'Género',
      pt: 'Gênero',
      nl: 'Geslacht',
      no: 'Kjønn',
      sv: 'Kön'
    },
    weight: {
      en: 'Weight',
      de: 'Gewicht',
      fr: 'Poids',
      es: 'Peso',
      pt: 'Peso',
      nl: 'Gewicht',
      no: 'Vekt',
      sv: 'Vikt'
    },
    height: {
      en: 'Height',
      de: 'Größe',
      fr: 'Taille',
      es: 'Altura',
      pt: 'Altura',
      nl: 'Lengte',
      no: 'Høyde',
      sv: 'Längd'
    },
    activityLevel: {
      en: 'Activity Level',
      de: 'Aktivitätslevel',
      fr: 'Niveau d\'Activité',
      es: 'Nivel de Actividad',
      pt: 'Nível de Atividade',
      nl: 'Activiteitsniveau',
      no: 'Aktivitetsnivå',
      sv: 'Aktivitetsnivå'
    },
    healthGoal: {
      en: 'Health Goal',
      de: 'Gesundheitsziel',
      fr: 'Objectif Santé',
      es: 'Objetivo de Salud',
      pt: 'Objetivo de Saúde',
      nl: 'Gezondheidsdoel',
      no: 'Helsemål',
      sv: 'Hälsomål'
    },
    
    // Options and Values
    metric: {
      en: 'Metric (kg, cm)',
      de: 'Metrisch (kg, cm)',
      fr: 'Métrique (kg, cm)',
      es: 'Métrico (kg, cm)',
      pt: 'Métrico (kg, cm)',
      nl: 'Metrisch (kg, cm)',
      no: 'Metrisk (kg, cm)',
      sv: 'Metrisk (kg, cm)'
    },
    imperial: {
      en: 'Imperial (lbs, inches)',
      de: 'Imperial (lbs, Zoll)',
      fr: 'Impérial (lbs, pouces)',
      es: 'Imperial (lbs, pulgadas)',
      pt: 'Imperial (lbs, polegadas)',
      nl: 'Imperiaal (lbs, inches)',
      no: 'Imperial (lbs, tommer)',
      sv: 'Imperial (lbs, tum)'
    },
    selectGender: {
      en: 'Select gender',
      de: 'Geschlecht auswählen',
      fr: 'Sélectionner le genre',
      es: 'Seleccionar género',
      pt: 'Selecionar gênero',
      nl: 'Selecteer geslacht',
      no: 'Velg kjønn',
      sv: 'Välj kön'
    },
    male: {
      en: 'Male',
      de: 'Männlich',
      fr: 'Homme',
      es: 'Masculino',
      pt: 'Masculino',
      nl: 'Man',
      no: 'Mann',
      sv: 'Man'
    },
    female: {
      en: 'Female',
      de: 'Weiblich',
      fr: 'Femme',
      es: 'Femenino',
      pt: 'Feminino',
      nl: 'Vrouw',
      no: 'Kvinne',
      sv: 'Kvinna'
    },
    
    // Activity Levels
    sedentary: {
      en: 'Sedentary (Little/no exercise)',
      de: 'Sitzend (Wenig/kein Sport)',
      fr: 'Sédentaire (Peu/pas d\'exercice)',
      es: 'Sedentario (Poco/sin ejercicio)',
      pt: 'Sedentário (Pouco/sem exercício)',
      nl: 'Zittend (Weinig/geen beweging)',
      no: 'Stillesittende (Lite/ingen trening)',
      sv: 'Stillasittande (Lite/ingen träning)'
    },
    light: {
      en: 'Light (Light exercise 1-3 days/week)',
      de: 'Leicht (Leichter Sport 1-3 Tage/Woche)',
      fr: 'Léger (Exercice léger 1-3 jours/semaine)',
      es: 'Ligero (Ejercicio ligero 1-3 días/semana)',
      pt: 'Leve (Exercício leve 1-3 dias/semana)',
      nl: 'Licht (Lichte beweging 1-3 dagen/week)',
      no: 'Lett (Lett trening 1-3 dager/uke)',
      sv: 'Lätt (Lätt träning 1-3 dagar/vecka)'
    },
    moderate: {
      en: 'Moderate (Moderate exercise 3-5 days/week)',
      de: 'Mäßig (Mäßiger Sport 3-5 Tage/Woche)',
      fr: 'Modéré (Exercice modéré 3-5 jours/semaine)',
      es: 'Moderado (Ejercicio moderado 3-5 días/semana)',
      pt: 'Moderado (Exercício moderado 3-5 dias/semana)',
      nl: 'Matig (Matige beweging 3-5 dagen/week)',
      no: 'Moderat (Moderat trening 3-5 dager/uke)',
      sv: 'Måttlig (Måttlig träning 3-5 dagar/vecka)'
    },
    active: {
      en: 'Active (Heavy exercise 6-7 days/week)',
      de: 'Aktiv (Intensiver Sport 6-7 Tage/Woche)',
      fr: 'Actif (Exercice intense 6-7 jours/semaine)',
      es: 'Activo (Ejercicio intenso 6-7 días/semana)',
      pt: 'Ativo (Exercício intenso 6-7 dias/semana)',
      nl: 'Actief (Zware beweging 6-7 dagen/week)',
      no: 'Aktiv (Tung trening 6-7 dager/uke)',
      sv: 'Aktiv (Tung träning 6-7 dagar/vecka)'
    },
    veryActive: {
      en: 'Very Active (Very heavy exercise, physical job)',
      de: 'Sehr Aktiv (Sehr intensiver Sport, körperliche Arbeit)',
      fr: 'Très Actif (Exercice très intense, travail physique)',
      es: 'Muy Activo (Ejercicio muy intenso, trabajo físico)',
      pt: 'Muito Ativo (Exercício muito intenso, trabalho físico)',
      nl: 'Zeer Actief (Zeer zware beweging, fysiek werk)',
      no: 'Svært Aktiv (Svært tung trening, fysisk jobb)',
      sv: 'Mycket Aktiv (Mycket tung träning, fysiskt arbete)'
    },
    
    // Health Goals
    loseWeight: {
      en: 'Lose Weight (500 cal deficit)',
      de: 'Gewicht verlieren (500 Kal Defizit)',
      fr: 'Perdre du Poids (déficit 500 cal)',
      es: 'Perder Peso (déficit 500 cal)',
      pt: 'Perder Peso (déficit 500 cal)',
      nl: 'Afvallen (500 cal tekort)',
      no: 'Gå ned i vekt (500 cal underskudd)',
      sv: 'Gå ner i vikt (500 cal underskott)'
    },
    maintainWeight: {
      en: 'Maintain Weight',
      de: 'Gewicht halten',
      fr: 'Maintenir le Poids',
      es: 'Mantener Peso',
      pt: 'Manter Peso',
      nl: 'Gewicht behouden',
      no: 'Opprettholde vekt',
      sv: 'Behålla vikt'
    },
    gainWeight: {
      en: 'Gain Weight (500 cal surplus)',
      de: 'Gewicht zunehmen (500 Kal Überschuss)',
      fr: 'Prendre du Poids (surplus 500 cal)',
      es: 'Ganar Peso (exceso 500 cal)',
      pt: 'Ganhar Peso (excesso 500 cal)',
      nl: 'Aankomen (500 cal overschot)',
      no: 'Øke vekt (500 cal overskudd)',
      sv: 'Öka vikt (500 cal överskott)'
    },
    
    // Descriptions
    biometricDescription: {
      en: 'Required for accurate daily calorie calculations and personalized recommendations.',
      de: 'Erforderlich für genaue tägliche Kalorienberechnungen und personalisierte Empfehlungen.',
      fr: 'Requis pour des calculs caloriques quotidiens précis et des recommandations personnalisées.',
      es: 'Requerido para cálculos calóricos diarios precisos y recomendaciones personalizadas.',
      pt: 'Necessário para cálculos calóricos diários precisos e recomendações personalizadas.',
      nl: 'Vereist voor nauwkeurige dagelijkse calorieberekeningen en gepersonaliseerde aanbevelingen.',
      no: 'Nødvendig for nøyaktige daglige kaloriberegninger og personlig tilpassede anbefalinger.',
      sv: 'Krävs för noggranna dagliga kaloriberäkningar och personliga rekommendationer.'
    },
    allergiesDescription: {
      en: 'Add your allergies and dietary restrictions for personalized recommendations',
      de: 'Fügen Sie Ihre Allergien und Ernährungseinschränkungen für personalisierte Empfehlungen hinzu',
      fr: 'Ajoutez vos allergies et restrictions alimentaires pour des recommandations personnalisées',
      es: 'Agregue sus alergias y restricciones dietéticas para recomendaciones personalizadas',
      pt: 'Adicione suas alergias e restrições alimentares para recomendações personalizadas',
      nl: 'Voeg uw allergieën en dieetbeperkingen toe voor gepersonaliseerde aanbevelingen',
      no: 'Legg til dine allergier og kostrestriksjoner for personlig tilpassede anbefalinger',
      sv: 'Lägg till dina allergier och kostrestriktioner för personliga rekommendationer'
    },
    
    // Common Allergies
    commonAllergies: {
      en: 'Common Allergies',
      de: 'Häufige Allergien',
      fr: 'Allergies Courantes',
      es: 'Alergias Comunes',
      pt: 'Alergias Comuns',
      nl: 'Veelvoorkomende Allergieën',
      no: 'Vanlige Allergier',
      sv: 'Vanliga Allergier'
    },
    nuts: {
      en: 'Nuts',
      de: 'Nüsse',
      fr: 'Noix',
      es: 'Nueces',
      pt: 'Nozes',
      nl: 'Noten',
      no: 'Nøtter',
      sv: 'Nötter'
    },
    dairy: {
      en: 'Dairy',
      de: 'Milchprodukte',
      fr: 'Laitier',
      es: 'Lácteos',
      pt: 'Laticínios',
      nl: 'Zuivel',
      no: 'Melk',
      sv: 'Mejeri'
    },
    eggs: {
      en: 'Eggs',
      de: 'Eier',
      fr: 'Œufs',
      es: 'Huevos',
      pt: 'Ovos',
      nl: 'Eieren',
      no: 'Egg',
      sv: 'Ägg'
    },
    gluten: {
      en: 'Gluten',
      de: 'Gluten',
      fr: 'Gluten',
      es: 'Gluten',
      pt: 'Glúten',
      nl: 'Gluten',
      no: 'Gluten',
      sv: 'Gluten'
    },
    soy: {
      en: 'Soy',
      de: 'Soja',
      fr: 'Soja',
      es: 'Soja',
      pt: 'Soja',
      nl: 'Soja',
      no: 'Soya',
      sv: 'Soja'
    },
    shellfish: {
      en: 'Shellfish',
      de: 'Schalentiere',
      fr: 'Fruits de mer',
      es: 'Mariscos',
      pt: 'Frutos do mar',
      nl: 'Schaaldieren',
      no: 'Skalldyr',
      sv: 'Skaldjur'
    },
    nickel: {
      en: 'Nickel',
      de: 'Nickel',
      fr: 'Nickel',
      es: 'Níquel',
      pt: 'Níquel',
      nl: 'Nikkel',
      no: 'Nikkel',
      sv: 'Nickel'
    },
    fragrances: {
      en: 'Fragrances',
      de: 'Duftstoffe',
      fr: 'Parfums',
      es: 'Fragancias',
      pt: 'Fragrâncias',
      nl: 'Geurstoffen',
      no: 'Parfyme',
      sv: 'Parfymer'
    },
    latex: {
      en: 'Latex',
      de: 'Latex',
      fr: 'Latex',
      es: 'Látex',
      pt: 'Látex',
      nl: 'Latex',
      no: 'Latex',
      sv: 'Latex'
    },
    preservatives: {
      en: 'Preservatives',
      de: 'Konservierungsstoffe',
      fr: 'Conservateurs',
      es: 'Conservantes',
      pt: 'Conservantes',
      nl: 'Conserveermiddelen',
      no: 'Konserveringsmidler',
      sv: 'Konserveringsmedel'
    },
    lanolin: {
      en: 'Lanolin',
      de: 'Lanolin',
      fr: 'Lanoline',
      es: 'Lanolina',
      pt: 'Lanolina',
      nl: 'Lanoline',
      no: 'Lanolin',
      sv: 'Lanolin'
    },
    cosmetics: {
      en: 'Cosmetics',
      de: 'Kosmetika',
      fr: 'Cosmétiques',
      es: 'Cosméticos',
      pt: 'Cosméticos',
      nl: 'Cosmetica',
      no: 'Kosmetikk',
      sv: 'Kosmetika'
    },
    
    // Storage and Actions
    storageUsage: {
      en: 'Storage Usage',
      de: 'Speichernutzung',
      fr: 'Utilisation du Stockage',
      es: 'Uso del Almacenamiento',
      pt: 'Uso do Armazenamento',
      nl: 'Opslaggebruik',
      no: 'Lagringsbruk',
      sv: 'Lagringsanvändning'
    },
    used: {
      en: 'Used',
      de: 'Verwendet',
      fr: 'Utilisé',
      es: 'Usado',
      pt: 'Usado',
      nl: 'Gebruikt',
      no: 'Brukt',
      sv: 'Använt'
    },
    available: {
      en: 'Available',
      de: 'Verfügbar',
      fr: 'Disponible',
      es: 'Disponible',
      pt: 'Disponível',
      nl: 'Beschikbaar',
      no: 'Tilgjengelig',
      sv: 'Tillgängligt'
    },
    clearAllData: {
      en: 'Clear All Data',
      de: 'Alle Daten löschen',
      fr: 'Effacer toutes les données',
      es: 'Borrar todos los datos',
      pt: 'Limpar todos os dados',
      nl: 'Alle gegevens wissen',
      no: 'Slett alle data',
      sv: 'Rensa all data'
    },
    clearDataWarning: {
      en: 'This will permanently delete all your scan history and settings',
      de: 'Dies löscht dauerhaft alle Ihre Scan-Verläufe und Einstellungen',
      fr: 'Cela supprimera définitivement tout votre historique de scan et vos paramètres',
      es: 'Esto eliminará permanentemente todo su historial de escaneo y configuraciones',
      pt: 'Isso excluirá permanentemente todo seu histórico de verificação e configurações',
      nl: 'Dit zal permanent al uw scangeschiedenis en instellingen verwijderen',
      no: 'Dette vil permanent slette all scanhistorikk og innstillinger',
      sv: 'Detta kommer permanent ta bort all din skanningshistorik och inställningar'
    },
    clearDataConfirm: {
      en: 'Are you sure you want to clear all data? This cannot be undone.',
      de: 'Sind Sie sicher, dass Sie alle Daten löschen möchten? Dies kann nicht rückgängig gemacht werden.',
      fr: 'Êtes-vous sûr de vouloir effacer toutes les données ? Cette action ne peut pas être annulée.',
      es: '¿Está seguro de que desea borrar todos los datos? Esto no se puede deshacer.',
      pt: 'Tem certeza de que deseja limpar todos os dados? Isso não pode ser desfeito.',
      nl: 'Weet u zeker dat u alle gegevens wilt wissen? Dit kan niet ongedaan worden gemaakt.',
      no: 'Er du sikker på at du vil slette alle data? Dette kan ikke angres.',
      sv: 'Är du säker på att du vill rensa all data? Detta kan inte ångras.'
    },
    
    // Status Messages
    loadingProfile: {
      en: 'Loading profile...',
      de: 'Profil wird geladen...',
      fr: 'Chargement du profil...',
      es: 'Cargando perfil...',
      pt: 'Carregando perfil...',
      nl: 'Profiel laden...',
      no: 'Laster profil...',
      sv: 'Laddar profil...'
    },
    saving: {
      en: 'Saving...',
      de: 'Speichern...',
      fr: 'Enregistrement...',
      es: 'Guardando...',
      pt: 'Salvando...',
      nl: 'Opslaan...',
      no: 'Lagrer...',
      sv: 'Sparar...'
    },
    
    // App Info
    version: {
      en: 'Version',
      de: 'Version',
      fr: 'Version',
      es: 'Versión',
      pt: 'Versão',
      nl: 'Versie',
      no: 'Versjon',
      sv: 'Version'
    },
    builtWith: {
      en: 'Built with',
      de: 'Erstellt mit',
      fr: 'Créé avec',
      es: 'Construido con',
      pt: 'Construído com',
      nl: 'Gebouwd met',
      no: 'Bygget med',
      sv: 'Byggd med'
    },
    
    // Calorie Estimates
    estimatedDailyCalories: {
      en: 'Estimated Daily Calorie Need',
      de: 'Geschätzter täglicher Kalorienbedarf',
      fr: 'Besoin Calorique Quotidien Estimé',
      es: 'Necesidad Calórica Diaria Estimada',
      pt: 'Necessidade Calórica Diária Estimada',
      nl: 'Geschatte Dagelijkse Caloriebehoefte',
      no: 'Estimert Daglig Kaloribehov',
      sv: 'Uppskattat Dagligt Kaloribehov'
    },
    bmr: {
      en: 'BMR (Base Metabolic Rate)',
      de: 'BMR (Grundumsatz)',
      fr: 'BMR (Métabolisme de Base)',
      es: 'BMR (Tasa Metabólica Basal)',
      pt: 'BMR (Taxa Metabólica Basal)',
      nl: 'BMR (Basaal Metabolisme)',
      no: 'BMR (Grunnomsetning)',
      sv: 'BMR (Basalmetabolism)'
    },
    tdee: {
      en: 'TDEE (Total Daily Energy)',
      de: 'TDEE (Gesamter Tagesenergiebedarf)',
      fr: 'TDEE (Énergie Quotidienne Totale)',
      es: 'TDEE (Energía Diaria Total)',
      pt: 'TDEE (Energia Diária Total)',
      nl: 'TDEE (Totale Dagelijkse Energie)',
      no: 'TDEE (Total Daglig Energi)',
      sv: 'TDEE (Total Daglig Energi)'
    },
    dailyTarget: {
      en: 'Daily Target',
      de: 'Tägliches Ziel',
      fr: 'Objectif Quotidien',
      es: 'Objetivo Diario',
      pt: 'Meta Diária',
      nl: 'Dagelijkse Doelstelling',
      no: 'Daglig Mål',
      sv: 'Dagligt Mål'
    },
    calories: {
      en: 'calories',
      de: 'Kalorien',
      fr: 'calories',
      es: 'calorías',
      pt: 'calorias',
      nl: 'calorieën',
      no: 'kalorier',
      sv: 'kalorier'
    },
    weightLossNote: {
      en: '500 calorie deficit for 1 lb/week weight loss',
      de: '500 Kalorien Defizit für 0,45 kg/Woche Gewichtsverlust',
      fr: 'Déficit de 500 calories pour une perte de 0,45 kg/semaine',
      es: 'Déficit de 500 calorías para una pérdida de 0,45 kg/semana',
      pt: 'Déficit de 500 calorias para perda de 0,45 kg/semana',
      nl: '500 calorie tekort voor 0,45 kg/week gewichtsverlies',
      no: '500 kalori underskudd for 0,45 kg/uke vekttap',
      sv: '500 kalori underskott för 0,45 kg/vecka viktminskning'
    },
    weightGainNote: {
      en: '500 calorie surplus for 1 lb/week weight gain',
      de: '500 Kalorien Überschuss für 0,45 kg/Woche Gewichtszunahme',
      fr: 'Surplus de 500 calories pour un gain de 0,45 kg/semaine',
      es: 'Exceso de 500 calorías para un aumento de 0,45 kg/semana',
      pt: 'Excesso de 500 calorias para ganho de 0,45 kg/semana',
      nl: '500 calorie overschot voor 0,45 kg/week gewichtstoename',
      no: '500 kalori overskudd for 0,45 kg/uke vektøkning',
      sv: '500 kalori överskott för 0,45 kg/vecka viktökning'
    },
    removeAllergy: {
      en: 'Remove allergy',
      de: 'Allergie entfernen',
      fr: 'Supprimer l\'allergie',
      es: 'Eliminar alergia',
      pt: 'Remover alergia',
      nl: 'Allergie verwijderen',
      no: 'Fjern allergi',
      sv: 'Ta bort allergi'
    }
  },

  // Dashboard Screen Translations
  dashboard: {
    // Header
    title: {
      en: 'Health Dashboard',
      de: 'Gesundheits-Dashboard',
      fr: 'Tableau de Bord Santé',
      es: 'Panel de Salud',
      pt: 'Painel de Saúde',
      nl: 'Gezondheid Dashboard',
      no: 'Helse Dashboard',
      sv: 'Hälso Dashboard'
    },
    healthScore: {
      en: 'Health Score',
      de: 'Gesundheitswert',
      fr: 'Score de Santé',
      es: 'Puntuación de Salud',
      pt: 'Pontuação de Saúde',
      nl: 'Gezondheidsscore',
      no: 'Helsescore',
      sv: 'Hälsopoäng'
    },
    improving: {
      en: 'improving',
      de: 'verbessernd',
      fr: 'amélioration',
      es: 'mejorando',
      pt: 'melhorando',
      nl: 'verbeterend',
      no: 'forbedrer seg',
      sv: 'förbättras'
    },

    // Tab Navigation
    overview: {
      en: 'Overview',
      de: 'Übersicht',
      fr: 'Aperçu',
      es: 'Resumen',
      pt: 'Visão Geral',
      nl: 'Overzicht',
      no: 'Oversikt',
      sv: 'Översikt'
    },
    nutrition: {
      en: 'Nutrition',
      de: 'Ernährung',
      fr: 'Nutrition',
      es: 'Nutrición',
      pt: 'Nutrição',
      nl: 'Voeding',
      no: 'Ernæring',
      sv: 'Näring'
    },
    safety: {
      en: 'Safety',
      de: 'Sicherheit',
      fr: 'Sécurité',
      es: 'Seguridad',
      pt: 'Segurança',
      nl: 'Veiligheid',
      no: 'Sikkerhet',
      sv: 'Säkerhet'
    },
    impact: {
      en: 'Impact',
      de: 'Auswirkung',
      fr: 'Impact',
      es: 'Impacto',
      pt: 'Impacto',
      nl: 'Impact',
      no: 'Innvirkning',
      sv: 'Påverkan'
    },

    // Overview Tab
    totalScans: {
      en: 'Total Scans',
      de: 'Gesamt-Scans',
      fr: 'Scans Totaux',
      es: 'Escaneos Totales',
      pt: 'Varreduras Totais',
      nl: 'Totale Scans',
      no: 'Totale Skanninger',
      sv: 'Totala Skanningar'
    },
    ingredientScans: {
      en: 'Ingredient Scans',
      de: 'Zutat-Scans',
      fr: 'Scans d\'Ingrédients',
      es: 'Escaneos de Ingredientes',
      pt: 'Varreduras de Ingredientes',
      nl: 'Ingrediënt Scans',
      no: 'Ingrediens Skanninger',
      sv: 'Ingrediens Skanningar'
    },
    mealAnalysis: {
      en: 'Meal Analysis',
      de: 'Mahlzeit-Analyse',
      fr: 'Analyse des Repas',
      es: 'Análisis de Comidas',
      pt: 'Análise de Refeições',
      nl: 'Maaltijd Analyse',
      no: 'Måltidsanalyse',
      sv: 'Måltidsanalys'
    },
    healthImprovement: {
      en: 'Health Improvement',
      de: 'Gesundheitsverbesserung',
      fr: 'Amélioration de la Santé',
      es: 'Mejora de la Salud',
      pt: 'Melhoria da Saúde',
      nl: 'Gezondheidsverbetering',
      no: 'Helseforbedring',
      sv: 'Hälsoförbättring'
    },
    thisMonth: {
      en: 'This month',
      de: 'Diesen Monat',
      fr: 'Ce mois-ci',
      es: 'Este mes',
      pt: 'Este mês',
      nl: 'Deze maand',
      no: 'Denne måneden',
      sv: 'Denna månad'
    },
    productsAnalyzed: {
      en: 'Products analyzed',
      de: 'Produkte analysiert',
      fr: 'Produits analysés',
      es: 'Productos analizados',
      pt: 'Produtos analisados',
      nl: 'Producten geanalyseerd',
      no: 'Produkter analysert',
      sv: 'Produkter analyserade'
    },
    foodsIdentified: {
      en: 'Foods identified',
      de: 'Lebensmittel identifiziert',
      fr: 'Aliments identifiés',
      es: 'Alimentos identificados',
      pt: 'Alimentos identificados',
      nl: 'Voedingsmiddelen geïdentificeerd',
      no: 'Mat identifisert',
      sv: 'Livsmedel identifierade'
    },
    thisWeek: {
      en: 'This week',
      de: 'Diese Woche',
      fr: 'Cette semaine',
      es: 'Esta semana',
      pt: 'Esta semana',
      nl: 'Deze week',
      no: 'Denne uken',
      sv: 'Denna vecka'
    },
    goalProgress: {
      en: 'Goal Progress',
      de: 'Ziel-Fortschritt',
      fr: 'Progrès des Objectifs',
      es: 'Progreso de Objetivos',
      pt: 'Progresso dos Objetivos',
      nl: 'Doelvoortgang',
      no: 'Målframgang',
      sv: 'Målframsteg'
    },
    calorieGoals: {
      en: 'Calorie Goals',
      de: 'Kalorien-Ziele',
      fr: 'Objectifs Caloriques',
      es: 'Objetivos de Calorías',
      pt: 'Objetivos de Calorias',
      nl: 'Calorie Doelen',
      no: 'Kalorimål',
      sv: 'Kalorimål'
    },
    nutritionQuality: {
      en: 'Nutrition Quality',
      de: 'Ernährungsqualität',
      fr: 'Qualité Nutritionnelle',
      es: 'Calidad Nutricional',
      pt: 'Qualidade Nutricional',
      nl: 'Voedingskwaliteit',
      no: 'Ernæringskvalitet',
      sv: 'Näringskvalitet'
    },
    safetyScore: {
      en: 'Safety Score',
      de: 'Sicherheitswert',
      fr: 'Score de Sécurité',
      es: 'Puntuación de Seguridad',
      pt: 'Pontuação de Segurança',
      nl: 'Veiligheidsscore',
      no: 'Sikkerhetsscore',
      sv: 'Säkerhetspoäng'
    },

    // Nutrition Tab
    dailyNutritionTracking: {
      en: 'Daily Nutrition Tracking',
      de: 'Tägliche Ernährungsverfolgung',
      fr: 'Suivi Nutritionnel Quotidien',
      es: 'Seguimiento Nutricional Diario',
      pt: 'Rastreamento Nutricional Diário',
      nl: 'Dagelijkse Voedingsvervolging',
      no: 'Daglig Ernæringssporing',
      sv: 'Daglig Näringsspårning'
    },
    calories: {
      en: 'Calories',
      de: 'Kalorien',
      fr: 'Calories',
      es: 'Calorías',
      pt: 'Calorias',
      nl: 'Calorieën',
      no: 'Kalorier',
      sv: 'Kalorier'
    },
    target: {
      en: 'Target',
      de: 'Ziel',
      fr: 'Objectif',
      es: 'Objetivo',
      pt: 'Meta',
      nl: 'Doel',
      no: 'Mål',
      sv: 'Mål'
    },
    macrosDistribution: {
      en: 'Macros Distribution',
      de: 'Makro-Verteilung',
      fr: 'Répartition des Macros',
      es: 'Distribución de Macros',
      pt: 'Distribuição de Macros',
      nl: 'Macro Verdeling',
      no: 'Makro Fordeling',
      sv: 'Makrofördelning'
    },
    carbs: {
      en: 'Carbs',
      de: 'Kohlenhydrate',
      fr: 'Glucides',
      es: 'Carbohidratos',
      pt: 'Carboidratos',
      nl: 'Koolhydraten',
      no: 'Karbohydrater',
      sv: 'Kolhydrater'
    },
    protein: {
      en: 'Protein',
      de: 'Protein',
      fr: 'Protéines',
      es: 'Proteínas',
      pt: 'Proteínas',
      nl: 'Eiwitten',
      no: 'Protein',
      sv: 'Protein'
    },
    fat: {
      en: 'Fat',
      de: 'Fett',
      fr: 'Lipides',
      es: 'Grasas',
      pt: 'Gorduras',
      nl: 'Vetten',
      no: 'Fett',
      sv: 'Fett'
    },

    // Safety Tab
    mostConcerningIngredients: {
      en: 'Most Concerning Ingredients',
      de: 'Bedenklichste Inhaltsstoffe',
      fr: 'Ingrédients les Plus Préoccupants',
      es: 'Ingredientes Más Preocupantes',
      pt: 'Ingredientes Mais Preocupantes',
      nl: 'Meest Zorgwekkende Ingrediënten',
      no: 'Mest Bekymringsfulle Ingredienser',
      sv: 'Mest Oroväckande Ingredienser'
    },
    highRisk: {
      en: 'High Risk',
      de: 'Hohes Risiko',
      fr: 'Risque Élevé',
      es: 'Alto Riesgo',
      pt: 'Alto Risco',
      nl: 'Hoog Risico',
      no: 'Høy Risiko',
      sv: 'Hög Risk'
    },
    mediumRisk: {
      en: 'Medium Risk',
      de: 'Mittleres Risiko',
      fr: 'Risque Moyen',
      es: 'Riesgo Medio',
      pt: 'Risco Médio',
      nl: 'Gemiddeld Risico',
      no: 'Middels Risiko',
      sv: 'Medel Risk'
    },
    improvementSuggestions: {
      en: 'Improvement Suggestions',
      de: 'Verbesserungsvorschläge',
      fr: 'Suggestions d\'Amélioration',
      es: 'Sugerencias de Mejora',
      pt: 'Sugestões de Melhoria',
      nl: 'Verbeteringsuggesties',
      no: 'Forbedringsforslag',
      sv: 'Förbättringsförslag'
    },
    reduceProcessedFoods: {
      en: 'Reduce processed foods consumption',
      de: 'Verbrauche weniger verarbeitete Lebensmittel',
      fr: 'Réduire la consommation d\'aliments transformés',
      es: 'Reducir el consumo de alimentos procesados',
      pt: 'Reduzir o consumo de alimentos processados',
      nl: 'Verminder het verbruik van bewerkte voeding',
      no: 'Reduser konsum av bearbeidet mat',
      sv: 'Minska konsumtionen av bearbetade livsmedel'
    },
    chooseOrganic: {
      en: 'Choose organic alternatives when possible',
      de: 'Wähle organische Alternativen wenn möglich',
      fr: 'Choisir des alternatives biologiques quand possible',
      es: 'Elegir alternativas orgánicas cuando sea posible',
      pt: 'Escolher alternativas orgânicas quando possível',
      nl: 'Kies biologische alternatieven wanneer mogelijk',
      no: 'Velg økologiske alternativer når mulig',
      sv: 'Välj ekologiska alternativ när möjligt'
    },
    readLabels: {
      en: 'Read ingredient labels more carefully',
      de: 'Lies Zutatenlisten sorgfältiger',
      fr: 'Lire les étiquettes d\'ingrédients plus attentivement',
      es: 'Leer las etiquetas de ingredientes más cuidadosamente',
      pt: 'Ler os rótulos de ingredientes com mais cuidado',
      nl: 'Lees ingrediëntenlabels zorgvuldiger',
      no: 'Les ingrediensetiketter mer nøye',
      sv: 'Läs ingrediensetiketter mer noggrant'
    },

    // Impact Tab
    healthImpactAnalysis: {
      en: 'Health Impact Analysis',
      de: 'Gesundheits-Auswirkungsanalyse',
      fr: 'Analyse de l\'Impact sur la Santé',
      es: 'Análisis de Impacto en la Salud',
      pt: 'Análise de Impacto na Saúde',
      nl: 'Gezondheidsimpact Analyse',
      no: 'Helsekonsekvensanalyse',
      sv: 'Hälsopåverkan Analys'
    },
    cardiovascularHealth: {
      en: 'Cardiovascular Health',
      de: 'Herz-Kreislauf-Gesundheit',
      fr: 'Santé Cardiovasculaire',
      es: 'Salud Cardiovascular',
      pt: 'Saúde Cardiovascular',
      nl: 'Cardiovasculaire Gezondheid',
      no: 'Kardiovaskulær Helse',
      sv: 'Kardiovaskulär Hälsa'
    },
    metabolicHealth: {
      en: 'Metabolic Health',
      de: 'Stoffwechsel-Gesundheit',
      fr: 'Santé Métabolique',
      es: 'Salud Metabólica',
      pt: 'Saúde Metabólica',
      nl: 'Metabolische Gezondheid',
      no: 'Metabolsk Helse',
      sv: 'Metabolisk Hälsa'
    },
    improvingTrend: {
      en: 'Improving trend',
      de: 'Verbesserungstrend',
      fr: 'Tendance d\'amélioration',
      es: 'Tendencia de mejora',
      pt: 'Tendência de melhoria',
      nl: 'Verbeterende trend',
      no: 'Forbedringstrend',
      sv: 'Förbättrande trend'
    },
    stableImprovement: {
      en: 'Stable improvement',
      de: 'Stabile Verbesserung',
      fr: 'Amélioration stable',
      es: 'Mejora estable',
      pt: 'Melhoria estável',
      nl: 'Stabiele verbetering',
      no: 'Stabil forbedring',
      sv: 'Stabil förbättring'
    },
    personalizedRecommendations: {
      en: 'Personalized Recommendations',
      de: 'Personalisierte Empfehlungen',
      fr: 'Recommandations Personnalisées',
      es: 'Recomendaciones Personalizadas',
      pt: 'Recomendações Personalizadas',
      nl: 'Gepersonaliseerde Aanbevelingen',
      no: 'Personlig Tilpassede Anbefalinger',
      sv: 'Personliga Rekommendationer'
    },
    increaseVegetables: {
      en: 'Increase vegetables in your daily meals',
      de: 'Erhöhe Gemüse in deinen täglichen Mahlzeiten',
      fr: 'Augmenter les légumes dans vos repas quotidiens',
      es: 'Aumentar las verduras en las comidas diarias',
      pt: 'Aumentar vegetais nas refeições diárias',
      nl: 'Verhoog groenten in je dagelijkse maaltijden',
      no: 'Øk grønnsaker i de daglige måltidene',
      sv: 'Öka grönsaker i dina dagliga måltider'
    },
    reduceSodium: {
      en: 'Reduce sodium intake by 20%',
      de: 'Reduziere die Natriumaufnahme um 20%',
      fr: 'Réduire l\'apport en sodium de 20%',
      es: 'Reducir la ingesta de sodio en un 20%',
      pt: 'Reduzir a ingestão de sódio em 20%',
      nl: 'Verminder natriuminname met 20%',
      no: 'Reduser natriuminntak med 20%',
      sv: 'Minska natriumintag med 20%'
    },
    addWholeGrains: {
      en: 'Add more whole grains to your diet',
      de: 'Füge mehr Vollkornprodukte deiner Ernährung hinzu',
      fr: 'Ajouter plus de grains entiers à votre alimentation',
      es: 'Agregar más granos integrales a su dieta',
      pt: 'Adicionar mais grãos integrais à dieta',
      nl: 'Voeg meer volkoren producten toe aan je dieet',
      no: 'Legg til mer fullkorn i kostholdet',
      sv: 'Lägg till mer fullkorn i din kost'
    },
    
    // Social sharing translations
    sharing: {
      title: {
        en: 'Share Your Results',
        de: 'Teilen Sie Ihre Ergebnisse',
        fr: 'Partagez vos résultats',
        es: 'Comparte tus resultados',
        pt: 'Compartilhe seus resultados',
        nl: 'Deel je resultaten',
        no: 'Del resultatene dine',
        sv: 'Dela dina resultat'
      },
      button: {
        en: 'Share',
        de: 'Teilen',
        fr: 'Partager',
        es: 'Compartir',
        pt: 'Compartilhar',
        nl: 'Delen',
        no: 'Del',
        sv: 'Dela'
      },
      privacy: {
        public: {
          en: 'Public',
          de: 'Öffentlich',
          fr: 'Public',
          es: 'Público',
          pt: 'Público',
          nl: 'Openbaar',
          no: 'Offentlig',
          sv: 'Offentlig'
        },
        limited: {
          en: 'Limited',
          de: 'Begrenzt',
          fr: 'Limité',
          es: 'Limitado',
          pt: 'Limitado',
          nl: 'Beperkt',
          no: 'Begrenset',
          sv: 'Begränsad'
        },
        minimal: {
          en: 'Minimal',
          de: 'Minimal',
          fr: 'Minimal',
          es: 'Mínimo',
          pt: 'Mínimo',
          nl: 'Minimaal',
          no: 'Minimal',
          sv: 'Minimal'
        },
        publicDesc: {
          en: 'Share with detailed results and app promotion',
          de: 'Teilen mit detaillierten Ergebnissen und App-Werbung',
          fr: 'Partager avec des résultats détaillés et la promotion de l\'application',
          es: 'Compartir con resultados detallados y promoción de la aplicación',
          pt: 'Compartilhar com resultados detalhados e promoção do aplicativo',
          nl: 'Delen met gedetailleerde resultaten en app-promotie',
          no: 'Del med detaljerte resultater og app-markedsføring',
          sv: 'Dela med detaljerade resultat och app-marknadsföring'
        },
        limitedDesc: {
          en: 'Share basic results without detailed scores',
          de: 'Grundlegende Ergebnisse ohne detaillierte Bewertungen teilen',
          fr: 'Partager les résultats de base sans scores détaillés',
          es: 'Compartir resultados básicos sin puntuaciones detalladas',
          pt: 'Compartilhar resultados básicos sem pontuações detalhadas',
          nl: 'Basis resultaten delen zonder gedetailleerde scores',
          no: 'Del grunnleggende resultater uten detaljerte poengsummer',
          sv: 'Dela grundläggande resultat utan detaljerade poäng'
        },
        minimalDesc: {
          en: 'Share only general discovery without specifics',
          de: 'Nur allgemeine Entdeckung ohne Details teilen',
          fr: 'Partager uniquement la découverte générale sans détails',
          es: 'Compartir solo descubrimiento general sin detalles',
          pt: 'Compartilhar apenas descoberta geral sem detalhes',
          nl: 'Alleen algemene ontdekking delen zonder details',
          no: 'Del bare generell oppdagelse uten detaljer',
          sv: 'Dela bara allmän upptäckt utan detaljer'
        }
      },
      choosePlatform: {
        en: 'Choose Platform',
        de: 'Plattform wählen',
        fr: 'Choisir la plateforme',
        es: 'Elegir plataforma',
        pt: 'Escolher plataforma',
        nl: 'Platform kiezen',
        no: 'Velg plattform',
        sv: 'Välj plattform'
      },
      sharePreview: {
        en: 'Share Preview',
        de: 'Vorschau teilen',
        fr: 'Aperçu du partage',
        es: 'Vista previa del compartir',
        pt: 'Prévia do compartilhamento',
        nl: 'Delen voorbeeld',
        no: 'Del forhåndsvisning',
        sv: 'Dela förhandsvisning'
      },
      privacyLevel: {
        en: 'Privacy Level',
        de: 'Datenschutzstufe',
        fr: 'Niveau de confidentialité',
        es: 'Nivel de privacidad',
        pt: 'Nível de privacidade',
        nl: 'Privacyniveau',
        no: 'Personvernnivå',
        sv: 'Integritetsnivå'
      },
      success: {
        en: 'Shared successfully!',
        de: 'Erfolgreich geteilt!',
        fr: 'Partagé avec succès!',
        es: '¡Compartido exitosamente!',
        pt: 'Compartilhado com sucesso!',
        nl: 'Succesvol gedeeld!',
        no: 'Delt med suksess!',
        sv: 'Delat framgångsrikt!'
      },
      failed: {
        en: 'Share failed',
        de: 'Teilen fehlgeschlagen',
        fr: 'Échec du partage',
        es: 'Error al compartir',
        pt: 'Falha ao compartilhar',
        nl: 'Delen mislukt',
        no: 'Deling mislyktes',
        sv: 'Delning misslyckades'
      },
      preparing: {
        en: 'Preparing share...',
        de: 'Teilen vorbereiten...',
        fr: 'Préparation du partage...',
        es: 'Preparando compartir...',
        pt: 'Preparando compartilhamento...',
        nl: 'Delen voorbereiden...',
        no: 'Forbereder deling...',
        sv: 'Förbereder delning...'
      },
      close: {
        en: 'Close',
        de: 'Schließen',
        fr: 'Fermer',
        es: 'Cerrar',
        pt: 'Fechar',
        nl: 'Sluiten',
        no: 'Lukk',
        sv: 'Stäng'
      },
      mealDescription: {
        en: 'Share your healthy meal analysis with friends and inspire others to make better food choices!',
        de: 'Teilen Sie Ihre gesunde Mahlzeitanalyse mit Freunden und inspirieren Sie andere zu besseren Lebensmittelwahlen!',
        fr: 'Partagez votre analyse de repas sains avec vos amis et inspirez les autres à faire de meilleurs choix alimentaires!',
        es: '¡Comparte tu análisis de comida saludable con amigos e inspira a otros a tomar mejores decisiones alimentarias!',
        pt: 'Compartilhe sua análise de refeição saudável com amigos e inspire outros a fazer melhores escolhas alimentares!',
        nl: 'Deel je gezonde maaltijdanalyse met vrienden en inspireer anderen om betere voedselkeuzes te maken!',
        no: 'Del din sunne måltidsanalyse med venner og inspirer andre til å ta bedre matvalg!',
        sv: 'Dela din hälsosamma måltidsanalys med vänner och inspirera andra att göra bättre matval!'
      },
      ingredientDescription: {
        en: 'Share your ingredient analysis and help others make safer product choices!',
        de: 'Teilen Sie Ihre Inhaltsstoffanalyse und helfen Sie anderen, sicherere Produktentscheidungen zu treffen!',
        fr: 'Partagez votre analyse d\'ingrédients et aidez les autres à faire des choix de produits plus sûrs!',
        es: '¡Comparte tu análisis de ingredientes y ayuda a otros a tomar decisiones de productos más seguras!',
        pt: 'Compartilhe sua análise de ingredientes e ajude outros a fazer escolhas de produtos mais seguras!',
        nl: 'Deel je ingrediëntenanalyse en help anderen veiligere productkeuses te maken!',
        no: 'Del ingrediensanalysen din og hjelp andre med å ta tryggere produktvalg!',
        sv: 'Dela din ingrediensanalys och hjälp andra att göra säkrare produktval!'
      }
    }
  },

  // Insights Screen Translations
  insights: {
    title: {
      en: 'Health Insights',
      de: 'Gesundheitseinblicke',
      fr: 'Informations de santé',
      es: 'Información de salud',
      pt: 'Insights de saúde',
      nl: 'Gezondheidsinzichten',
      no: 'Helseinnsikt',
      sv: 'Hälsoinsikter'
    },
    loading: {
      en: 'Loading insights...',
      de: 'Einblicke werden geladen...',
      fr: 'Chargement des informations...',
      es: 'Cargando información...',
      pt: 'Carregando insights...',
      nl: 'Inzichten laden...',
      no: 'Laster innsikt...',
      sv: 'Laddar insikter...'
    },
    timeRange: {
      week: {
        en: 'Last Week',
        de: 'Letzte Woche',
        fr: 'Semaine dernière',
        es: 'Última semana',
        pt: 'Última semana',
        nl: 'Afgelopen week',
        no: 'Siste uke',
        sv: 'Senaste veckan'
      },
      month: {
        en: 'Last Month',
        de: 'Letzter Monat',
        fr: 'Mois dernier',
        es: 'Último mes',
        pt: 'Último mês',
        nl: 'Afgelopen maand',
        no: 'Siste måned',
        sv: 'Senaste månaden'
      },
      quarter: {
        en: 'Last Quarter',
        de: 'Letztes Quartal',
        fr: 'Dernier trimestre',
        es: 'Último trimestre',
        pt: 'Último trimestre',
        nl: 'Afgelopen kwartaal',
        no: 'Siste kvartal',
        sv: 'Senaste kvartalet'
      }
    },
    overview: {
      totalScans: {
        en: 'Total Scans',
        de: 'Gesamte Scans',
        fr: 'Total des scans',
        es: 'Escaneos totales',
        pt: 'Total de escaneamentos',
        nl: 'Totaal scans',
        no: 'Totale skanninger',
        sv: 'Totala skanningar'
      },
      averageScore: {
        en: 'Average Score',
        de: 'Durchschnittliche Bewertung',
        fr: 'Score moyen',
        es: 'Puntuación promedio',
        pt: 'Pontuação média',
        nl: 'Gemiddelde score',
        no: 'Gjennomsnittlig poengsum',
        sv: 'Genomsnittlig poäng'
      },
      trend: {
        en: 'Trend',
        de: 'Trend',
        fr: 'Tendance',
        es: 'Tendencia',
        pt: 'Tendência',
        nl: 'Trend',
        no: 'Trend',
        sv: 'Trend'
      }
    },
    categories: {
      title: {
        en: 'Category Breakdown',
        de: 'Kategorienaufschlüsselung',
        fr: 'Répartition par catégorie',
        es: 'Desglose por categoría',
        pt: 'Divisão por categoria',
        nl: 'Categorie-uitsplitsing',
        no: 'Kategorifordeling',
        sv: 'Kategorifördelning'
      }
    },
    concerns: {
      title: {
        en: 'Top Concerns',
        de: 'Hauptanliegen',
        fr: 'Principales préoccupations',
        es: 'Principales preocupaciones',
        pt: 'Principais preocupações',
        nl: 'Belangrijkste zorgen',
        no: 'Hovedbekymringer',
        sv: 'Största bekymmer'
      },
      found: {
        en: 'Found {{count}} times',
        de: '{{count}} mal gefunden',
        fr: 'Trouvé {{count}} fois',
        es: 'Encontrado {{count}} veces',
        pt: 'Encontrado {{count}} vezes',
        nl: '{{count}} keer gevonden',
        no: 'Funnet {{count}} ganger',
        sv: 'Hittades {{count}} gånger'
      }
    },
    recommendations: {
      title: {
        en: 'Recommendations',
        de: 'Empfehlungen',
        fr: 'Recommandations',
        es: 'Recomendaciones',
        pt: 'Recomendações',
        nl: 'Aanbevelingen',
        no: 'Anbefalinger',
        sv: 'Rekommendationer'
      },
      lowScore: {
        title: {
          en: 'Improve Product Choices',
          de: 'Produktauswahl verbessern',
          fr: 'Améliorer les choix de produits',
          es: 'Mejorar las opciones de productos',
          pt: 'Melhorar as escolhas de produtos',
          nl: 'Verbeter productkeuzes',
          no: 'Forbedre produktvalg',
          sv: 'Förbättra produktval'
        },
        description: {
          en: 'Your recent scans show low safety scores. Consider choosing products with fewer additives.',
          de: 'Ihre letzten Scans zeigen niedrige Sicherheitsbewertungen. Erwägen Sie Produkte mit weniger Zusatzstoffen.',
          fr: 'Vos récents scans montrent de faibles scores de sécurité. Considérez choisir des produits avec moins d\'additifs.',
          es: 'Sus escaneos recientes muestran puntuaciones de seguridad bajas. Considere elegir productos con menos aditivos.',
          pt: 'Seus escaneamentos recentes mostram pontuações de segurança baixas. Considere escolher produtos com menos aditivos.',
          nl: 'Uw recente scans tonen lage veiligheidsscores. Overweeg producten met minder additieven te kiezen.',
          no: 'Dine nylige skanninger viser lave sikkerhetsscorer. Vurder å velge produkter med færre tilsetningsstoffer.',
          sv: 'Dina senaste skanningar visar låga säkerhetspoäng. Överväg att välja produkter med färre tillsatser.'
        }
      },
      concerns: {
        title: {
          en: 'Common Problematic Ingredient',
          de: 'Häufiger problematischer Inhaltsstoff',
          fr: 'Ingrédient problématique commun',
          es: 'Ingrediente problemático común',
          pt: 'Ingrediente problemático comum',
          nl: 'Veelvoorkomend problematisch ingrediënt',
          no: 'Vanlig problematisk ingrediens',
          sv: 'Vanlig problematisk ingrediens'
        },
        description: {
          en: 'This ingredient appears frequently in your scans. Look for alternatives.',
          de: 'Dieser Inhaltsstoff erscheint häufig in Ihren Scans. Suchen Sie nach Alternativen.',
          fr: 'Cet ingrédient apparaît fréquemment dans vos scans. Cherchez des alternatives.',
          es: 'Este ingrediente aparece frecuentemente en sus escaneos. Busque alternativas.',
          pt: 'Este ingrediente aparece frequentemente em seus escaneamentos. Procure por alternativas.',
          nl: 'Dit ingrediënt verschijnt vaak in uw scans. Zoek naar alternatieven.',
          no: 'Denne ingrediensen forekommer ofte i dine skanninger. Se etter alternativer.',
          sv: 'Denna ingrediens förekommer ofta i dina skanningar. Leta efter alternativ.'
        }
      },
      foodFocus: {
        title: {
          en: 'Focus on Food',
          de: 'Fokus auf Lebensmittel',
          fr: 'Concentration sur la nourriture',
          es: 'Enfoque en comida',
          pt: 'Foco na comida',
          nl: 'Focus op voedsel',
          no: 'Fokuser på mat',
          sv: 'Fokus på mat'
        },
        description: {
          en: 'You scan mostly food items. Great! Keep making conscious food choices.',
          de: 'Sie scannen hauptsächlich Lebensmittel. Großartig! Machen Sie weiterhin bewusste Lebensmittelwahlen.',
          fr: 'Vous scannez principalement des aliments. Génial ! Continuez à faire des choix alimentaires conscients.',
          es: 'Escanea principalmente alimentos. ¡Genial! Siga tomando decisiones alimentarias conscientes.',
          pt: 'Você escaneia principalmente alimentos. Ótimo! Continue fazendo escolhas alimentares conscientes.',
          nl: 'Je scant voornamelijk voedingsmiddelen. Geweldig! Blijf bewuste voedselkeuzes maken.',
          no: 'Du skanner mest matvarer. Bra! Fortsett å gjøre bevisste matvalg.',
          sv: 'Du skannar mest livsmedel. Bra! Fortsätt göra medvetna matval.'
        }
      }
    },
    noData: {
      title: {
        en: 'No Data Available',
        de: 'Keine Daten verfügbar',
        fr: 'Aucune donnée disponible',
        es: 'No hay datos disponibles',
        pt: 'Nenhum dado disponível',
        nl: 'Geen gegevens beschikbaar',
        no: 'Ingen data tilgjengelig',
        sv: 'Ingen data tillgänglig'
      },
      description: {
        en: 'Start scanning products to see your health insights and analysis trends',
        de: 'Beginnen Sie mit dem Scannen von Produkten, um Ihre Gesundheitseinblicke und Analysetrends zu sehen',
        fr: 'Commencez à scanner des produits pour voir vos informations de santé et tendances d\'analyse',
        es: 'Comience a escanear productos para ver sus insights de salud y tendencias de análisis',
        pt: 'Comece a escanear produtos para ver seus insights de saúde e tendências de análise',
        nl: 'Begin met het scannen van producten om uw gezondheidsinzichten en analysetrends te zien',
        no: 'Begynn å skanne produkter for å se dine helseinnsikter og analysetrender',
        sv: 'Börja skanna produkter för att se dina hälsoinsikter och analystrender'
      },
      startScanning: {
        en: 'Start Scanning',
        de: 'Scannen starten',
        fr: 'Commencer le scan',
        es: 'Comenzar escaneo',
        pt: 'Iniciar escaneamento',
        nl: 'Begin met scannen',
        no: 'Start skanning',
        sv: 'Börja skanna'
      }
    }
  },

  // Category Translations
  categories: {
    food: {
      en: 'Food',
      de: 'Lebensmittel',
      fr: 'Alimentation',
      es: 'Comida',
      pt: 'Alimentos',
      nl: 'Voedsel',
      no: 'Mat',
      sv: 'Mat'
    },
    cosmetic: {
      en: 'Cosmetic',
      de: 'Kosmetik',
      fr: 'Cosmétique',
      es: 'Cosmético',
      pt: 'Cosmético',
      nl: 'Cosmetica',
      no: 'Kosmetikk',
      sv: 'Kosmetik'
    },
    household: {
      en: 'Household',
      de: 'Haushalt',
      fr: 'Ménager',
      es: 'Doméstico',
      pt: 'Doméstico',
      nl: 'Huishouden',
      no: 'Husholdning',
      sv: 'Hushåll'
    }
  },

  // Navigation translations
  navigation: {
    home: {
      en: 'Home',
      de: 'Start',
      fr: 'Accueil',
      es: 'Inicio',
      pt: 'Início',
      nl: 'Home',
      no: 'Hjem',
      sv: 'Hem'
    },
    scan: {
      en: 'Scan',
      de: 'Scannen',
      fr: 'Scanner',
      es: 'Escanear',
      pt: 'Escanear',
      nl: 'Scannen',
      no: 'Skann',
      sv: 'Skanna'
    },
    expert: {
      en: 'Expert',
      de: 'Experte',
      fr: 'Expert',
      es: 'Experto',
      pt: 'Especialista',
      nl: 'Expert',
      no: 'Ekspert',
      sv: 'Expert'
    },
    history: {
      en: 'History',
      de: 'Verlauf',
      fr: 'Historique',
      es: 'Historial',
      pt: 'Histórico',
      nl: 'Geschiedenis',
      no: 'Historie',
      sv: 'Historik'
    },
    dashboard: {
      en: 'Dashboard',
      de: 'Dashboard',
      fr: 'Tableau de bord',
      es: 'Panel',
      pt: 'Painel',
      nl: 'Dashboard',
      no: 'Dashboard',
      sv: 'Dashboard'
    },
    profile: {
      en: 'Profile',
      de: 'Profil',
      fr: 'Profil',
      es: 'Perfil',
      pt: 'Perfil',
      nl: 'Profiel',
      no: 'Profil',
      sv: 'Profil'
    }
  }
};

// Translation helper function
export const t = (key, lang = 'en') => {
  const keys = key.split('.');
  let value = translations;
  
  for (const k of keys) {
    value = value[k];
    if (!value) break;
  }
  
  if (value && typeof value === 'object') {
    return value[lang] || value['en'] || key;
  }
  
  return key;
};

// Language persistence helper
export const getCurrentLanguage = () => {
  return localStorage.getItem('labeliq_language') || 'en';
};

export const setCurrentLanguage = (lang) => {
  localStorage.setItem('labeliq_language', lang);
};