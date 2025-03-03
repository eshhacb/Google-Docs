import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

const socket = io("http://localhost:5003");

const Editor = ({ documentId }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    socket.emit("join-document", documentId);

    socket.on("document-updated", (newContent) => {
      setContent(newContent);
    });

    axios
      .get(`http://localhost:5003/api/collaboration/${documentId}`)
      .then((res) => {
        setContent(res.data.content);
      });

    return () => {
      socket.off("document-updated");
    };
  }, [documentId]);

  const handleChange = (value) => {
    setContent(value);
    socket.emit("edit-document", { documentId, content: value });
  };

  return <ReactQuill value={content} onChange={handleChange} />;
};

export default Editor;
