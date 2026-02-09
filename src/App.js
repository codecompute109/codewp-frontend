import { useState } from "react";

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a Word file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await fetch("https://codewp.onrender.com/convert", {
        method: "POST",
        body: formData,
      });

      // Show backend error message (instead of generic alert)
      if (!response.ok) {
        const errText = await response.text().catch(() => "");
        throw new Error(
          `HTTP ${response.status}: ${errText || "Conversion failed"}`
        );
      }

      // Ensure the response is actually a PDF
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/pdf")) {
        const errText = await response.text().catch(() => "");
        throw new Error(
          `Expected PDF but got "${contentType}". ${errText || ""}`
        );
      }

      // Download PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Convert error:", err);
      alert(err.message || "Error converting file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>Word to PDF Converter</h1>

      <input
        type="file"
        accept=".doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        disabled={loading}
      />

      <br />
      <br />

      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Converting..." : "Convert to PDF"}
      </button>

      <p style={{ marginTop: 16, fontSize: 12, opacity: 0.8 }}>
        Backend: https://codewp.onrender.com/convert
      </p>
    </div>
  );
}

export default App;

