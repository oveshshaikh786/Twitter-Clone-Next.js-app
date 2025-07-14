import EditableImage from "./EditableImage";

export default function Cover({src, onChange, editable}) {
    return (
        <EditableImage 
            type="cover" 
            src={src} 
            editable={editable} 
            onChange={onChange} 
            className={'h-36'} 
        />
    ); 
}