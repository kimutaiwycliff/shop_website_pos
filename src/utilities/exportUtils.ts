'use client'

export interface ExportData {
  salesOverview: any
  topProducts: any[]
  customerAnalytics: any
  inventoryAlerts: any[]
  paymentMethods: any[]
  recentOrders: any[]
}

// Simple CSV export function
export const exportToCSV = (data: ExportData, title: string) => {
  // Convert data to CSV format
  let csvContent = ''

  // Add headers
  csvContent += 'Section,Data\n'

  // Add data
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      csvContent += `${key},${JSON.stringify(value)}\n`
    } else {
      csvContent += `${key},${JSON.stringify(value)}\n`
    }
  })

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute(
    'download',
    `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`,
  )
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Simple PDF-like export using browser print functionality
export const exportToPDF = (data: ExportData, title: string) => {
  // Create a new window with the data
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h1 { color: #333; }
            h2 { color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Generated on: ${new Date().toLocaleDateString()}</p>
    `)

    // Add data sections
    Object.entries(data).forEach(([key, value]) => {
      printWindow.document.write(
        `<h2>${key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</h2>`,
      )
      if (Array.isArray(value)) {
        if (value.length > 0) {
          // Create table for array data
          printWindow.document.write('<table>')

          // Add headers
          const headers = Object.keys(value[0])
          printWindow.document.write('<tr>')
          headers.forEach((header) => {
            printWindow.document.write(
              `<th>${header.charAt(0).toUpperCase() + header.slice(1)}</th>`,
            )
          })
          printWindow.document.write('</tr>')

          // Add rows
          value.forEach((row: any) => {
            printWindow.document.write('<tr>')
            headers.forEach((header) => {
              printWindow.document.write(`<td>${row[header as keyof typeof row]}</td>`)
            })
            printWindow.document.write('</tr>')
          })

          printWindow.document.write('</table>')
        }
      } else {
        // For object data
        printWindow.document.write('<table>')
        Object.entries(value).forEach(([k, v]) => {
          printWindow.document.write(`<tr><td>${k}</td><td>${v}</td></tr>`)
        })
        printWindow.document.write('</table>')
      }
    })

    printWindow.document.write(`
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}
