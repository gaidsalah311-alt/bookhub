export type LibraryExportRow = {
  title: string;
  author: string;
  description: string | null;
  categoryName: string | null;
  publishYear: number | null;
  rating: number | null;
  readingStatus: string | null;
  personalNote: string | null;
  personalRating: number | null;
  coverImageUrl: string | null;
  createdAt: Date | string;
};

function csvCell(value: unknown) {
  const text = value instanceof Date ? value.toLocaleString("ar") : String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

export function buildCsvContent(rows: LibraryExportRow[]) {
  const headers = [
    "العنوان",
    "المؤلف",
    "الوصف",
    "التصنيف",
    "سنة النشر",
    "التقييم",
    "حالة القراءة",
    "ملاحظتي الشخصية",
    "تقييمي الشخصي",
    "رابط الغلاف",
    "تاريخ الإضافة",
  ];
  const lines = rows.map((row) =>
    [
      row.title,
      row.author,
      row.description,
      row.categoryName,
      row.publishYear,
      row.rating,
      row.readingStatus,
      row.personalNote,
      row.personalRating,
      row.coverImageUrl,
      row.createdAt,
    ]
      .map(csvCell)
      .join(","),
  );
  return "\uFEFF" + [headers.map(csvCell).join(","), ...lines].join("\n") + "\n";
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildPrintableLibraryDocument(
  rows: LibraryExportRow[],
  date = new Date(),
) {
  const tableRows = rows
    .map(
      (row) => `<tr>
        <td>${escapeHtml(row.title)}</td>
        <td>${escapeHtml(row.author)}</td>
        <td>${escapeHtml(row.categoryName || "—")}</td>
        <td>${escapeHtml(row.readingStatus || "—")}</td>
        <td>${escapeHtml(row.rating ?? "—")}</td>
        <td>${escapeHtml(row.personalRating ?? "—")}</td>
        <td>${escapeHtml(row.personalNote || "—")}</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8" /><title>مكتبتي - BookHub</title><style>
    @page { size: A4; margin: 16mm; }
    :root { color-scheme: light; }
    body { font-family: Arial, sans-serif; color: #1f2937; padding: 0; line-height: 1.6; }
    h1 { color: #1d4ed8; margin: 0 0 4px; font-size: 24px; }
    p { color: #64748b; margin: 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 11px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: right; vertical-align: top; }
    th { background: #eff6ff; color: #1e3a8a; }
    tr { break-inside: avoid; }
    @media print { body { padding: 0; } h1 { color: #111827; } }
  </style></head><body><h1>مكتبتي الشخصية</h1><p>تصدير BookHub بتاريخ ${escapeHtml(date.toLocaleDateString("ar"))}</p><table><thead><tr><th>العنوان</th><th>المؤلف</th><th>التصنيف</th><th>الحالة</th><th>التقييم</th><th>تقييمي</th><th>ملاحظتي</th></tr></thead><tbody>${tableRows || `<tr><td colspan="7">لا توجد كتب في المكتبة</td></tr>`}</tbody></table></body></html>`;
}
