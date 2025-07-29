import React, { useEffect, useState } from 'react';
import URLInput from './components/URLInput';
import PageList from './components/PageList';
import PDFPreview from './components/PDFPreview';
import DownloadButton from './components/DownloadButton';
import JobList from './components/JobList';

const App = () => {
  const [pdfData, setPdfData] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    console.log(selectedPdf);
    console.log("data", pdfData)
  }, [])

  const handleSelectJob = (job) => {
    setPdfData(job.pdfs);
    setSelectedPdf(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <URLInput setPdfData={setPdfData} />
      {pdfData.length > 0 && (
        <>
          <div className="flex border-t">
            <PageList pdfData={pdfData} onSelect={setSelectedPdf} />
            <PDFPreview selectedPdf={selectedPdf} />
          </div>
          <DownloadButton />
        </>
      )}

      <JobList onSelectJob={handleSelectJob} />
    </div>
  );
};

export default App;
