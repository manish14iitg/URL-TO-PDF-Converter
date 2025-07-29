import React, { useState } from "react";
import axios from "axios";

const URLInput = ({ setPdfData }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("https://url-to-pdf-converter.onrender.com/api/pdf/generate", {
        url,
      });
      const jobId = res.data.jobId;

      const pollJob = async () => {
        const statusRes = await axios.get(
          `https://url-to-pdf-converter.onrender.com//api/pdf/status/${jobId}`
        );
        if (statusRes.data.status === "done") {
          setPdfData(statusRes.data.pdfs);
          setLoading(false);
        } else if (statusRes.data.status === "failed") {
          alert("PDF generation failed: " + statusRes.data.error);
          setLoading(false);
        } else {
          setTimeout(pollJob, 2000); // poll again after 2 seconds
        }
      };

      pollJob();
    } catch (err) {
      alert("Error submitting URL");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex gap-2">
      <input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Generating..." : "Generate PDFs"}
      </button>
    </div>
  );
};

export default URLInput;
