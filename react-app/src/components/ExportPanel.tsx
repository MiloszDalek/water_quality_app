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
    <div className="export-panel">
      <input
        type="text"
        placeholder="File name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        className="export-input"
      />
      <select
        value={fileType}
        onChange={(e) => setFileType(e.target.value as "csv" | "excel")}
        className="export-select"
      >
        <option value="excel">Excel (.xlsx)</option>
        <option value="csv">CSV (.csv)</option>
      </select>
      <button onClick={handleExport} className="export-button">
        Export
      </button>
    </div>
  );
};

export default ExportPanel;
