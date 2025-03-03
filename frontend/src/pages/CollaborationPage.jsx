import Editor from "../components/Editor";
import { useParams } from "react-router-dom";

const CollaborationPage = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Collaborate on Document: {id}</h1>
      <Editor documentId={id} />
    </div>
  );
};

export default CollaborationPage;
