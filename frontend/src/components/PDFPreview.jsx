const PDFPreview = ({ selectedPdf }) => {
  if (!selectedPdf)
    return <div className="w-2/3 p-4">Select a page to preview the PDF.</div>;

  return (
    <div className="w-2/3 p-4">
      <iframe
        src={`https://url-to-pdf-converter.onrender.com/${selectedPdf}`}
        title="PDF Preview"
        className="w-full h-[80vh] border"
      />
    </div>
  );
};

export default PDFPreview;
