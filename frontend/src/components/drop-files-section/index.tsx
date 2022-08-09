import React, { useState } from "react";
import { BsCloudUploadFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { uploadFile } from "../../utils/functions";
import ImagesPreview from "../images-preview";

import "./drop-files-section.styles.scss";

interface IDropFileSectionProps {
  children: JSX.Element;
}

// Showed when a file is beign dropped in the input
const DropFilesSection = ({ children }: IDropFileSectionProps) => {
  const [showDropSection, setShowDropSection] = useState(false);
  const dispatch = useDispatch();

  // Show the drop files section if are files that are being droped
  const handleDragIn = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    // setDragsQuantity(dragsQuantity + 1);

    if (ev.dataTransfer.items && ev.dataTransfer.items.length > 0)
      setShowDropSection(true);
  };

  // Hide the file drop section
  const handleDragLeave = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    // setDragsQuantity(dragsQuantity - 1);
    // if (dragsQuantity > 0) return;
    setShowDropSection(false);
  };

  // Get the files droped
  const handleDrop = async (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    const { files } = ev.dataTransfer;
    // Read the files droped
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)!;
      uploadFile(dispatch, file);
    }
    setShowDropSection(false);
  };

  return (
    <>
      <ImagesPreview />
      <div
        draggable="true"
        onDragEnter={handleDragIn}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="drop-section"
      >
        {children}
      </div>
      {showDropSection && (
        <div className="drop-section">
          <div className="icon">
            <BsCloudUploadFill size={60} />
          </div>
          <p>Upload file(s)</p>
        </div>
      )}
    </>
  );
};

export default DropFilesSection;
