import React, { useEffect, useState } from "react";
import axios from "axios";

const JobList = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await axios.get("https://url-to-pdf-converter.onrender.com/api/pdf/jobs");
      setJobs(res.data);
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-4 border-t bg-gray-50">
      <h2 className="text-xl font-bold mb-4">📄 Past Jobs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="p-4 bg-white rounded-xl shadow hover:ring-2 ring-blue-400 cursor-pointer"
            onClick={() => onSelectJob(job)}
          >
            <div className="font-semibold text-blue-700 truncate">
              {job.url}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              🧾 {job.pdfs.length} pages — 🎥{" "}
              {job.pdfs.filter((p) => p.hasVideo).length} with video
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ⏱️ {new Date(job.createdAt).toLocaleString()}
            </div>
            <div
              className={`mt-2 text-sm font-medium ${
                job.status === "done"
                  ? "text-green-600"
                  : job.status === "failed"
                  ? "text-red-500"
                  : "text-yellow-600"
              }`}
            >
              {job.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList;
