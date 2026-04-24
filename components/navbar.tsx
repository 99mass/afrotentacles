import { NavbarClient } from "./navbar-client"
import { getCategories } from "@/lib/actions/articles"
import { getActiveSocialLinks } from "@/lib/actions/settings"

export async function Navbar() {
  const [categories, socialLinks] = await Promise.all([
    getCategories(),
    getActiveSocialLinks()
  ])
  return <NavbarClient categories={categories} socialLinks={socialLinks} />
}
