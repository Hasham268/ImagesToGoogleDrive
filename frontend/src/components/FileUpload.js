import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();

    for (const file of selectedFiles) {
      formData.append("files", file);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Folder link:", response.data.folderLink);
    } catch (error) {
      console.error("Error uploading files:", error);
     
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
