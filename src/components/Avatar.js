import EditableImage from "./EditableImage";

export default function Avatar({ src, big, onChange, editable=false }) {
  const widthClass = big ? 'w-28 h-28' : 'w-12 h-12';
  
  return (
    <div className="rounded-full overflow-hidden">
      <EditableImage 
      type={'image'}
      src={src} 
      onChange={onChange} 
      editable={editable}
      className={`rounded-full overflow-hidden ${widthClass}`} />
    </div>
  );
}