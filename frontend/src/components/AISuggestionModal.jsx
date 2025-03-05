const AISuggestionModal = ({ suggestion, onClose,onAdd }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-semibold mb-4">AI Suggestion</h2>
                <p className="text-gray-700 mb-6">{suggestion}</p>
                <div className="flex gap-2">
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={() => {
                            onAdd(suggestion); // Only update when clicked
                            onClose();
                        }}  
                    >
                        Add Suggestion
                    </button>
                    <button 
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AISuggestionModal;
