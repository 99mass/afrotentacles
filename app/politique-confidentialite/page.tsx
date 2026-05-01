import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { getContactLinks } from "@/lib/actions/settings"

export const metadata = {
  title: 'Politique de confidentialité',
  description: "Politique de confidentialité d'AfroTentacles - Protection de vos données personnelles",
  alternates: {
    canonical: 'https://afrotentacles.com/politique-confidentialite',
  },
  openGraph: {
    type: 'website',
    url: 'https://afrotentacles.com/politique-confidentialite',
    title: 'Politique de confidentialité - AfroTentacles',
    description: "Protection de vos données personnelles sur AfroTentacles.",
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'AfroTentacles' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Politique de confidentialité - AfroTentacles',
    description: "Protection de vos données personnelles sur AfroTentacles.",
    images: ['/og-default.png'],
  },
}

export default async function PolitiqueConfidentialitePage() {
  const contactLinks = await getContactLinks();
  const contactEmail = contactLinks?.email_address || "contact@afrotentacles.org";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        <article className="py-12 font-serif">
          <div className="mx-auto max-w-3xl px-4">
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold font-serif mb-2">Politique de confidentialité</h1>
              <p className="text-muted-foreground">Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}</p>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none space-y-8 text-foreground">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-4">1. Introduction</h2>
                <p className="leading-relaxed">
                  La présente politique de confidentialité décrit les modalités de collecte, d'utilisation et de protection des données personnelles des utilisateurs du site d'analyse prospective africaine. Elle est conforme à la loi sénégalaise n°2008-12 du 25 janvier 2008 relative à la protection des données à caractère personnel et aux exigences de la Commission Protection des Données Personnelles (CDP).
                </p>
                <p className="leading-relaxed mt-4">
                  L'utilisation du site implique l'acceptation de la présente politique.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-4">2. Responsable du traitement</h2>
                <p className="leading-relaxed mb-4">Le responsable du traitement est :</p>
                <div className="bg-muted/50 p-4 rounded-lg border border-border">
                  <p className="font-semibold">AFRO TENTACLES</p>
                  <p>Dakar</p>
                  <p>Sénégal</p>
                  <p className="mt-2">
                    <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                      {contactEmail}
                    </a>
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-4">3. Données collectées</h2>
                <p className="leading-relaxed mb-4">
                  Le site collecte uniquement les données strictement nécessaires à ses activités éditoriales et analytiques :
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Données d'identification :</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Nom, prénom, adresse e-mail (inscription newsletter, contact)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Données de navigation :</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Adresse IP, type d'appareil, pages consultées, durée de consultation</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Données professionnelles :</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                      <li>Organisation, fonction (si fournie en cadre d'analyses ou contributions)</li>
                    </ul>
                  </div>
                </div>

                <p className="leading-relaxed mt-6 text-muted-foreground italic">
                  Lorsque certaines informations ne sont pas renseignées, l'accès à certains services peut être limité.
                </p>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-4">4. Finalités du traitement</h2>
                <p className="leading-relaxed mb-4">
                  Les données collectées sont utilisées pour :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>Fournir et améliorer les contenus d'analyse géopolitique et économique</li>
                  <li>Gérer les abonnements et newsletters</li>
                  <li>Répondre aux demandes des utilisateurs</li>
                  <li>Produire des statistiques d'audience anonymisées</li>
                </ul>
                <p className="leading-relaxed mt-4 font-semibold">
                  Aucune décision automatisée produisant des effets juridiques n'est réalisée.
                </p>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-4">5. Base légale</h2>
                <p className="leading-relaxed">
                  Les traitements reposent sur :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2 mt-4">
                  <li>Le consentement explicite de l'utilisateur</li>
                  <li>L'exécution d'un contrat auquel l'utilisateur est partie</li>
                  <li>Le respect d'une obligation légale</li>
                  <li>Les intérêts légitimes du responsable de traitement</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-4">6. Droits des utilisateurs</h2>
                <p className="leading-relaxed mb-4">
                  Conformément à la loi sénégalaise de protection des données, vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
                  <li>Droit d'accès à vos données</li>
                  <li>Droit de rectification des données inexactes</li>
                  <li>Droit à l'oubli (suppression)</li>
                  <li>Droit de limitation du traitement</li>
                  <li>Droit à la portabilité des données</li>
                  <li>Droit d'opposition au traitement</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  Pour exercer ces droits, veuillez contacter :{" "}
                  <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">
                    {contactEmail}
                  </a>
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-4">7. Conservation des données</h2>
                <p className="leading-relaxed">
                  Les données personnelles sont conservées pour la durée nécessaire aux finalités énoncées ci-dessus, ou selon les obligations légales applicables. Les données de navigation sont généralement conservées pour une période de 12 mois.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-4">8. Sécurité des données</h2>
                <p className="leading-relaxed">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre l'accès non autorisé, la modification ou la suppression. Cependant, aucune transmission de données sur Internet n'est totalement sécurisée.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-4">9. Cookies et technologies de suivi</h2>
                <p className="leading-relaxed">
                  Le site utilise des cookies à des fins analytiques et fonctionnelles. Vous pouvez les désactiver via les paramètres de votre navigateur. Certains cookies sont essentiels au fonctionnement du site.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl font-bold font-serif mb-4">10. Modification de cette politique</h2>
                <p className="leading-relaxed">
                  Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Les modifications entrent en vigueur dès leur publication sur le site. Nous vous encourageons à consulter régulièrement cette page.
                </p>
              </section>

              {/* Contact */}
              <section className="bg-primary/10 p-6 rounded-lg border border-primary/20 mt-12">
                <h2 className="text-xl font-bold font-serif mb-3">Questions ou préoccupations ?</h2>
                <p className="leading-relaxed">
                  Pour toute question concernant cette politique ou vos données personnelles, veuillez nous contacter à :{" "}
                  <a href={`mailto:${contactEmail}`} className="text-primary hover:underline font-semibold">
                    {contactEmail}
                  </a>
                </p>
              </section>
            </div>

            {/* Back Link */}
            <div className="mt-12">
              <Link href="/" className="text-primary hover:underline font-serif">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
