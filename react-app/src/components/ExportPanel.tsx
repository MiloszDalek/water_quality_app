import React, { useState } from "react";
import '../pages/History.css'

interface ExportPanelProps {
  onExport: (fileName: string, fileType: "csv" | "excel") => void;
}

const ExportPanel: React.FC<ExportPanelProps> = ({ onExport }) => {
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<"csv" | "excel">("excel");

  const handleExport = () => {
    if (!fileName) {
      alert("Input file name");
      return;
    }
    onExport(fileName.trim(), fileType);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
      <input
        type="text"
        placeholder="File name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="px-3 py-2 border rounded w-full sm:w-40 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <select
        value={fileType}
        onChange={(e) => setFileType(e.target.value as "csv" | "excel")}
        className="px-3 py-2 border rounded w-full cursor-pointer sm:w-40 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <option value="excel">Excel (.xlsx)</option>
        <option value="csv">CSV (.csv)</option>
      </select>
      <button 
        onClick={handleExport} 
        className="px-4 py-2 bg-[#1e3a8a] text-white rounded hover:bg-blue-700 transition-all text-sm w-full sm:w-auto cursor-pointer"
      >
        Export
      </button>
    </div>
  );
};

export default ExportPanel;
