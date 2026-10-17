// Opens the print dialog with the PDF filename "<Participant> <Activity>".
// Browsers use document.title as the default "Save as PDF" filename.
export function printPdf(participant, activity) {
  const prev = document.title;
  const name = [participant.trim(), activity.replace(/&/g, "and")].filter(Boolean).join(" ");
  document.title = name.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, " ");
  window.addEventListener("afterprint", () => (document.title = prev), { once: true });
  window.print();
}
