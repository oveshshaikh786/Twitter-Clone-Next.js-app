import { useState } from "react";
import {FileDrop} from "react-file-drop";
import {PulseLoader} from "react-spinners";

export  default function EditableImage({type, src, onChange, className, editable=false}) {
    const [coverUrl, setCoverUrl] = useState(src);
    const [isFileNearby, setIsFileNearby] = useState(false);
    const [isFileOver, setIsFileOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    
    let extraClasses = '';
    if (isFileNearby && !isFileOver) extraClasses += 'bg-blue-500 opacity-40';
    if (isFileOver) extraClasses += 'bg-blue-500 opacity-90';
    if (!editable) extraClasses = '';

    async function updateImage(files, e) {
        if(!editable) {
            return;
        }
        e.preventDefault();
        setIsFileNearby(false);
        setIsFileOver(false);
        setIsUploading(true);
        const formData = new FormData();
        formData.append(type, files[0]);
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })
        // .then(async response => {
        //     const json = await response.json();
        //     onChange(json.src);
        //     setIsUploading(false);
        // });

        const json = await res.json();
        if (json.src) {
            setCoverUrl(json.src); // Store in local state if needed
            onChange(json.src);
        }
        // onChange(json.src);  
        setIsUploading(false);
    }

    return (
    <FileDrop
      onDrop={updateImage}
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
      //className={"flex h-36 bg-twitterBorder text-white" + extraClasses}
    >
    <div className={`relative bg-twitterBorder text-white ${className}`}>
      <div className={`absolute inset-0 ${extraClasses}`}>
      </div>
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center" 
                style={{backgroundColor: 'rgba(48, 140, 216, 0.9)'}}>
            <PulseLoader size={14} color={'#fff'} />        
        </div>
      )} 

        <div className="h-full w-full flex overflow-hidden">
            {coverUrl && (
              <img
                src={coverUrl}
                alt="Cover"
                className={`w-full h-full object-cover ${type === 'image' ? 'rounded-full' : ''}`}
              />
            )}
        </div>
        
    </div>
    </FileDrop>
  );

}