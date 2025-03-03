import Editor from "../components/Editor";
import Sidebar from "../components/Sidebar"; 
import { useParams } from "react-router-dom";

const CollaborationPage = () => {
    const { documentId } = useParams();
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-4xl font-semibold mb-6">Collaborate on Document</h1>
        <Editor documentId={documentId} />
      </div>
    </div>
  );
};

export default CollaborationPage;
