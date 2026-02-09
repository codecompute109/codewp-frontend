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

      const response = await fetch(
        "https://codewp.onrender.com/convert",
        {
          method: "POST",
          body: formData
        }
      );

      if (!response.ok) throw new Error("Conversion failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.pdf";
      a.click();

    } catch (err) {
      alert("Error converting file");
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
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        {loading ? "Converting..." : "Convert to PDF"}
      </button>
    </div>
  );
}

export default app;

