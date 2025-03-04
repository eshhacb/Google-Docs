import { useState } from "react";
import Editor from "../components/Editor";
import Sidebar from "../components/Sidebar";
import { useParams } from "react-router-dom";
import AISuggestionModal from "../components/AISuggestionModal";
import axios from "axios";


const CollaborationPage = () => {
    const { documentId } = useParams();
    console.log("this is documentID",documentId);
    const [showModal, setShowModal] = useState(false);
    const [suggestion, setSuggestion] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAISuggestion = async () => {
      setLoading(true);
      try {
          const documentText = "Fetch actual document content here"; // Replace with Editor state
          const response = await axios.post("http://localhost:8000/api/ai-suggestion", {
              documentText,
          });
          setSuggestion(response.data.suggestion);
          setShowModal(true);
      } catch (error) {
          console.error("Error getting AI suggestion:", error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-4xl font-semibold mb-6">Collaborate on Document</h1>
        <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition mb-4"
                    onClick={handleAISuggestion}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Get AI Suggestion"}
                </button>
        <Editor documentId={documentId} />
        {showModal && (
                    <AISuggestionModal 
                        suggestion={suggestion} 
                        onClose={() => setShowModal(false)} 
                    />
                )}

      </div>
    </div>
  );
};

export default CollaborationPage;
