const DownloadButton = () => {
  const handleDownload = () => {
    window.open("https://url-to-pdf-converter.onrender.com//api/pdf/download", "_blank");
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-green-600 text-white px-4 py-2 rounded m-4"
    >
      Download All PDFs (ZIP)
    </button>
  );
};

export default DownloadButton;
