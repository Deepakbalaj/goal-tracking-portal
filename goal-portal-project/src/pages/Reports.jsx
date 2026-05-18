import toast from "react-hot-toast";

export default function Reports() {
  function download(format) {
    const token = localStorage.getItem("goal_portal_token");
    fetch(`/api/reports/achievements?format=${format}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `achievement-report.${format === "xlsx" ? "xlsx" : "csv"}`;
        link.click();
        URL.revokeObjectURL(url);
      })
      .catch((error) => toast.error(error.message));
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-bold">Achievement Report Export</h3>
      <p className="mt-2 text-sm text-slate-500">Includes employee, goal, target, actual achievement, progress, and status.</p>
      <div className="mt-5 flex gap-3">
        <button onClick={() => download("csv")} className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white">Export CSV</button>
        <button onClick={() => download("xlsx")} className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white">Export Excel</button>
      </div>
    </div>
  );
}
