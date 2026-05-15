import { getSiteStats } from "@/lib/actions/stats"
import { PDFDocument, StandardFonts } from "pdf-lib"
import fs from "fs"
import path from "path"

const CHART_WIDTH = 800
const CHART_HEIGHT = 400

async function fetchChartPng(config: any, width = CHART_WIDTH, height = CHART_HEIGHT) {
  const qcUrl = "https://quickchart.io/chart"
  const body = JSON.stringify({ chart: config, width, height, backgroundColor: "white", format: "png" })
  const res = await fetch(qcUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body })
  if (!res.ok) throw new Error(`QuickChart error: ${res.status}`)
  const ab = await res.arrayBuffer()
  return Buffer.from(ab)
}

export async function GET() {
  const stats = await getSiteStats()

  // Prepare chart images via QuickChart
  const dailyLabels = stats.dailyStats.map((d) => d.day)
  const dailyData = stats.dailyStats.map((d) => d.views)
  const dailyConfig = {
    type: 'line',
    data: {
      labels: dailyLabels,
      datasets: [{ label: 'Vues', data: dailyData, borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.1)', fill: true, tension: 0.2 }],
    },
    options: { plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } } } },
  }
  const dailyChart = await fetchChartPng(dailyConfig)

  const catLabels = stats.categoryStats.map((c) => c.name)
  const catData = stats.categoryStats.map((c) => c.views)
  const catConfig = { type: 'pie', data: { labels: catLabels, datasets: [{ data: catData }] }, options: { plugins: { legend: { position: 'right' } } } }
  const catChart = await fetchChartPng(catConfig, 600, 400)

  const pdfDoc = await PDFDocument.create()
  let currentPage = pdfDoc.addPage([595, 842]) // A4 portrait
  const { width, height } = currentPage.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  let y = height - 48
  const left = 50
  const maxContentWidth = width - left * 2

  // Helper to truncate text to fit max width
  const truncateText = (text: string, font: any, size: number, maxWidth: number) => {
    if (font.widthOfTextAtSize(text, size) <= maxWidth) return text
    let t = text
    while (t.length > 0 && font.widthOfTextAtSize(t + "...", size) > maxWidth) {
      t = t.slice(0, -1)
    }
    return t + "..."
  }

  // Helper for page breaks
  const checkPageBreak = (neededSpace: number) => {
    if (y - neededSpace < 48) {
      currentPage = pdfDoc.addPage([595, 842])
      y = height - 48
    }
  }

  // Header
  currentPage.drawText("Rapport de statistiques site AfroTentacles", { x: left, y: y - 14, size: 18, font })

  y -= 50 // Padding below header

  checkPageBreak(100) // Ensure enough space for the summary stats

  currentPage.drawText(`Période: 30 derniers jours (détails)` , { x: left, y, size: 10, font })
  y -= 24

  currentPage.drawText(`Vues totales: ${stats.totalViews}`, { x: left, y, size: 11, font })
  y -= 16
  currentPage.drawText(`Vues mois dernier: ${stats.totalViewsLastMonth}`, { x: left, y, size: 11, font })
  y -= 16
  currentPage.drawText(`Vues mois actuel: ${stats.totalViewsCurrentMonth}`, { x: left, y, size: 11, font })
  y -= 16
  currentPage.drawText(`Articles (total/publiés/brouillons): ${stats.totalArticles} / ${stats.publishedArticles} / ${stats.draftArticles}`, { x: left, y, size: 11, font })
  y -= 30

  // Embed daily chart
  const dailyPng = await pdfDoc.embedPng(dailyChart)
  const dW = maxContentWidth
  const dH = (dailyPng.height / dailyPng.width) * dW
  
  checkPageBreak(dH)
  currentPage.drawImage(dailyPng, { x: left, y: y - dH, width: dW, height: dH })
  y -= (dH + 30)

  // Embed category chart
  const catPng = await pdfDoc.embedPng(catChart)
  const cW = maxContentWidth * 0.8 // slightly smaller for pie chart to look good
  const cH = (catPng.height / catPng.width) * cW
  
  checkPageBreak(cH)
  currentPage.drawImage(catPng, { x: left + (maxContentWidth - cW) / 2, y: y - cH, width: cW, height: cH })
  y -= (cH + 30)

  // Top articles table
  checkPageBreak(40)
  currentPage.drawText("Top articles", { x: left, y, size: 14, font })
  y -= 24

  for (let i = 0; i < stats.topArticles.length; i++) {
    const a = stats.topArticles[i]
    checkPageBreak(36) // Space for title + details + spacing
    
    // Title on first line
    const titleText = `${i + 1}. ${a.title}`
    // reduce max width slightly for safety
    const truncatedTitle = truncateText(titleText, font, 11, maxContentWidth - 10)
    currentPage.drawText(truncatedTitle, { x: left, y, size: 11, font })
    y -= 14
    
    // Details on second line
    const detailsText = `    Catégorie: ${a.category}   |   Vues totales: ${a.views}   |   Vues (30 jours): ${a.viewsMonth}`
    currentPage.drawText(detailsText, { x: left, y, size: 9, font })
    y -= 18
  }

  const pdfBytes = await pdfDoc.save()

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="site-stats.pdf"`,
    },
  })
}
