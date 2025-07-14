import {FileDrop} from "react-file-drop";
import { useState } from "react";

export default function Upload({children, onUploadFinish}) {
    const [isFileNearby, setIsFileNearby] = useState(false);
    const [isFileOver, setIsFileOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    async function uploadImage(files, e) {
        e.preventDefault();
        setIsFileNearby(false);
        setIsFileOver(false);
        setIsUploading(true);
        const formData = new FormData();
        formData.append('post', files[0]);
        await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })
        .then (async response => {
            const json = await response.json();
            if (json?.src && typeof onUploadFinish === 'function') {
                onUploadFinish(json.src);
            }
        })
        .catch((err) => {
            //console.error("Upload error:", err);
        })
        .finally(() => {
            setIsUploading(false);
        });
    }

    return (
        <FileDrop
              onDrop={uploadImage}
              onDragOver={() => setIsFileOver(true)}
              onDragLeave={() => setIsFileOver(false)}
              onFrameDragEnter={() => setIsFileNearby(true)}
              onFrameDragLeave={() => {
                setIsFileNearby(false);
                setIsFileOver(false);
              }}
              onFrameDrop={() => {
                setIsFileNearby(false);
                setIsFileOver(false);
              }}
            >
            <div className="relative">
                {( isFileNearby || isFileOver) && (
                    <div className="bg-twitterBlue absolute inset-0 flex items-center justify-center">
                        Drop your images here
                    </div>    
                )}
                {children({ isUploading })}
            </div>    
        </FileDrop>
    );
}