import { getSocialLinks, getYouTubeSettings, getContactLinks, getVideos } from "@/lib/actions/settings"
import { SettingsClientPage } from "./settings-client-page"

export const metadata = {
  title: "Paramètres | Administration AfroTentacles",
}

export default async function SettingsPage() {
  const [links, youtubeSettings, contactLinks, videos] = await Promise.all([
    getSocialLinks(),
    getYouTubeSettings(),
    getContactLinks(),
    getVideos()
  ])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif">Paramètres</h1>
          <p className="text-muted-foreground mt-1">
            Gérez la configuration globale du site (réseaux sociaux, vidéo YouTube, vidéos uploadées, etc.).
          </p>
        </div>
      </div>
      
      <SettingsClientPage 
        initialLinks={links} 
        initialYouTubeSettings={youtubeSettings} 
        initialContactLinks={contactLinks}
        initialVideos={videos}
      />
    </div>
  )
}
