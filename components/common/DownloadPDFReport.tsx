"use client";

import { useState } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { FileDown } from "lucide-react";
import { usePermissions } from "@/context/permissions-context";

export default function DownloadPDFReport({
  period,
  contentRef,
  reportTitle = "Dashboard Report",
  disabled = false,
}: {
  period: number;
  contentRef: React.RefObject<HTMLDivElement | null>;
  reportTitle?: string;
  disabled?: boolean;
}) {
  const canExport = usePermissions("data:export");
  const [isGenerating, setIsGenerating] = useState(false);

  if (!canExport) return null;

  async function handleDownload() {
    if (!contentRef.current) return;

    setIsGenerating(true);

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc) => {
          const style = clonedDoc.createElement("style");
          style.textContent = `
            @media (prefers-color-scheme: dark) {
              .dark\\:bg-zinc-900 { background-color: #ffffff !important; }
              .dark\\:text-zinc-50 { color: #09090b !important; }
              .dark\\:text-zinc-400 { color: #71717a !important; }
              .dark\\:text-zinc-300 { color: #52525b !important; }
              .dark\\:border-zinc-800 { border-color: #e4e4e7 !important; }
              .dark\\:border-blue-800 { border-color: #bfdbfe !important; }
              .dark\\:from-blue-950\\/20 { background-image: none !important; }
              .dark\\:to-indigo-950\\/20 { background-image: none !important; }
            }
          `;
          clonedDoc.head.appendChild(style);
        },
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.setFontSize(18);
      pdf.text(reportTitle, pageWidth / 2, 20, { align: "center" });
      pdf.setFontSize(11);
      pdf.text(`Period: Last ${period} days`, pageWidth / 2, 28, {
        align: "center",
      });
      pdf.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        34,
        { align: "center" },
      );

      const margin = 10;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight + 50 > pageHeight) {
        const pageHeightRemaining = pageHeight - 50;
        const ratio = pageHeightRemaining / imgHeight;
        pdf.addImage(imgData, "PNG", margin, 40, imgWidth * ratio, pageHeightRemaining);
      } else {
        pdf.addImage(imgData, "PNG", margin, 40, imgWidth, imgHeight);
      }

      pdf.save(
        `dashboard-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to generate PDF",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || isGenerating}
      className="flex items-center gap-2 px-4 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
    >
      <FileDown className="h-4 w-4" />
      {isGenerating ? "Generating..." : "Download PDF"}
    </button>
  );
}
