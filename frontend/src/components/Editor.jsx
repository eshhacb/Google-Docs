import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const socket = io(API_BASE_URL, { transports: ["websocket"] });

const Editor = ({ documentId }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!documentId) return;

    socket.emit("join-document", documentId);

    const handleDocumentUpdate = (newContent) => {
      setContent(newContent);
    };

    socket.on("document-updated", handleDocumentUpdate);

    axios
      .get(`${API_BASE_URL}/api/collaboration/${documentId}`)
      .then((res) => {
        setContent(res.data.content || "");
      })
      .catch((err) => console.error("Error fetching document:", err));

    return () => {
      socket.off("document-updated", handleDocumentUpdate);
      socket.emit("leave-document", documentId);
    };
  }, [documentId]);

  const handleChange = (value) => {
    setContent(value);
    socket.emit("edit-document", { documentId, content: value });
  };

  return <ReactQuill value={content} onChange={handleChange} />;
};

export default Editor;
