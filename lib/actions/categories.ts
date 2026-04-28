"use server"

import { createClient } from "@/lib/supabase/server"

export async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from("categories").select("*")
  
  if (!data) return []
  
  // Define the desired order
  const categoryOrder = [
    "À la Une",
    "Géoéconomie",
    "Géopolitique",
    "Ressources & Énergie",
    "Flux & Corridors",
    "Institutions & Politiques publiques",
    "Influences & Puissances",
    "Données & Insights"
  ]
  
  // Sort categories according to the defined order
  const sortedData = data.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.name)
    const indexB = categoryOrder.indexOf(b.name)
    
    // If both are in the order list, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }
    
    // If only a is in the list, it comes first
    if (indexA !== -1) return -1
    if (indexB !== -1) return 1
    
    // If neither is in the list, maintain original order
    return 0
  })
  
  return sortedData
}
