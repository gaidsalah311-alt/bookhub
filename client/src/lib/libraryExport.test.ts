import { describe, expect, it } from "vitest";
import { buildCsvContent, buildPrintableLibraryDocument, type LibraryExportRow } from "./libraryExport";

const row: LibraryExportRow = {
  title: "كتاب، مهم",
  author: "مؤلف",
  description: "وصف",
  categoryName: "تطوير",
  publishYear: 2026,
  rating: 4,
  readingStatus: "قيد القراءة",
  personalNote: 'ملاحظة فيها "اقتباس"',
  personalRating: 5,
  coverImageUrl: "https://example.com/cover.webp",
  createdAt: "2026-08-17T10:00:00.000Z",
};

describe("library export", () => {
  it("builds valid CSV headers, escaped cells, and one data row", () => {
    const content = buildCsvContent([row]);
    const lines = content.replace(/^\uFEFF/, "").trimEnd().split("\n");

    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain('"العنوان"');
    expect(lines[0]).toContain('"ملاحظتي الشخصية"');
    expect(lines[1]).toContain('"كتاب، مهم"');
    expect(lines[1]).toContain('"ملاحظة فيها ""اقتباس"""');
    expect(content.startsWith("\uFEFF")).toBe(true);
  });

  it("builds a header-only CSV for an empty library", () => {
    const content = buildCsvContent([]);
    const lines = content.replace(/^\uFEFF/, "").trimEnd().split("\n");

    expect(lines).toHaveLength(1);
    expect(lines[0]?.split(",")).toHaveLength(11);
  });

  it("builds an RTL A4 print document with library-specific print styles", () => {
    const document = buildPrintableLibraryDocument([row], new Date("2026-08-17T10:00:00.000Z"));

    expect(document).toContain('<html lang="ar" dir="rtl">');
    expect(document).toContain("@page { size: A4");
    expect(document).toContain("@media print");
    expect(document).toContain("كتاب، مهم");
    expect(document).toContain("ملاحظة فيها &quot;اقتباس&quot;");
    expect(document).toContain("تصدير BookHub");
  });

  it("builds an explicit empty-library print state", () => {
    const document = buildPrintableLibraryDocument([], new Date("2026-08-17T10:00:00.000Z"));

    expect(document).toContain("لا توجد كتب في المكتبة");
    expect(document).toContain("colspan=\"7\"");
  });
});
