import { useState } from 'react';
import { LuCloudUpload, LuX } from "react-icons/lu";
import "../css/imagephoto.css";

function ImageUploadLabel({ onFileChange, error, helperText }) {
  const [fileName, setFileName] = useState(""); // State to store the PDF file name

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type === "application/pdf") {
        setFileName(file.name); // Store the PDF file name
        onFileChange(file); // Pass the file to the parent component
      } else {
        alert("Please upload a valid PDF file.");
      }
    }
  };

  const handleRemoveFile = () => {
    setFileName(""); // Clear the file name when the file is removed
    onFileChange(null); // Pass null to the parent component
  };

  return (
    <div className="image-upload-container">
      <input
        id="image-upload"
        type="file"
        className="image-upload-input"
        onChange={handleFileChange}
        accept="application/pdf" // Only allow PDF files
        required // Make the field required
      />

      <label
        htmlFor="image-upload"
        className="image-upload-label"
      >
        <div className="upload-content">
          <div className="upload-icon-container">
            <LuCloudUpload className="upload-icon" />
          </div>
          <p className="upload-text">Upload PDF</p> {/* Change text to "Upload PDF" */}
          <p className="upload-description">Upload a PDF file.</p> {/* Update description */}
          <p className="upload-description">
            File Format <span className="bold-text">PDF</span> Only
          </p>
          <p className="upload-description">
            Max Size <span className="bold-text">5MB</span>
          </p>
        </div>
      </label>

      {/* Display the uploaded PDF's name below the upload button */}
      {fileName && (
        <div className="file-info">
          <p className="file-name">{fileName}</p> {/* Display the PDF file name */}
          <button
            onClick={handleRemoveFile}
            className="remove-image-button"
          >
            <LuX className="remove-icon" />
          </button>
        </div>
      )}

      {/* Display error message if the field is required and not filled */}
      {error && (
        <p className="error-message" style={{ color: "red", marginTop: "5px" }}>
          {helperText}
        </p>
      )}
    </div>
  );
}

export default ImageUploadLabel;