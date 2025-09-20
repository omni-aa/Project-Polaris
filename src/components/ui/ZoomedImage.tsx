interface ZoomedImageProps {
    imageUrl: string;
    onClose: () => void;
}

export default function ZoomedImage({ imageUrl, onClose }: ZoomedImageProps) {
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center cursor-zoom-out z-50"
        >
            <img
                src={imageUrl}
                alt="Zoomed"
                className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
}