const PageList = ({ pdfData, onSelect }) => {
  return (
    <div className="w-1/3 border-r p-4 overflow-y-auto">
      <h2 className="font-bold mb-2">Pages</h2>
      <ul>
        {pdfData.map((item, index) => (
          <li
            key={index}
            className="mb-2 cursor-pointer hover:underline"
            onClick={() => onSelect(item.fileName)}
          >
            Page {index + 1}{" "}
            {item.hasVideo && <span className="text-red-500">🎥</span>}
            <br />
            <small className="text-xs text-gray-500">{item.pageUrl}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageList;
