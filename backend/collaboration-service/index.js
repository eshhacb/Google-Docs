import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import collaborationRoutes from "./src/routes/collaborationRoutes.js";
import Document from "./src/models/document.js";
import { transformOperation } from "./src/utils/transformOperations.js"; // OT Transformation

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// MongoDB Connection with Error Handling
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("DB Connection Error:", err);
    process.exit(1);
  });

app.use("/api/collaboration", collaborationRoutes);

// WebSocket Namespace for Collaboration
const collaborationNamespace = io.of("/collaboration");

// collaborationNamespace.on("connection", (socket) => {
io.on("connection", (socket) => {
  console.log("User connected to collaboration: ", socket.id);

  socket.on("join-document", async (documentId) => {
    socket.join(documentId);

    let document = await Document.findById(documentId);
    if (!document) {
      document = await Document.create({ _id: documentId, content: "", history: [] });
    }

    socket.emit("load-document", { content: document.content, version: document.lastUpdated });
    console.log(`User joined document ${documentId}`);
  });


  socket.on("edit-document", async ({ documentId, content }) => {
    console.log("Received content update:", content);
  
    try {
      // Fetch the document from the database
      let document = await Document.findById({_id: documentId});
  
      if (!document) {
        console.log("Document not found:", documentId);
        return;
      }
  
      console.log("Current document content:", document.content);
  
      // Broadcast the updated content to all users in the same document room
      socket.to(documentId).emit("document-updated", content);
      
      // Update document content
      document.content = content;
      // Save the updated document back to the database
      await document.save();
      console.log("Document updated successfully");
  
  
    } catch (error) {
      console.error("Error updating document:", error);
    }
  });
//   socket.on("edit-document", async ({ documentId, operation, version }) => {
//     console.log(documentId, operation, version);
//     let document = await Document.findById({_id: documentId});
  
//       if (!document) {
//         console.log("Document not found:", documentId);
//         return;
//       }
//   // ✅ Version control check with timestamps
//   if (new Date(version).getTime() !== new Date(document.lastUpdated).getTime()) {
//     socket.emit("error", "Version mismatch! Reload document.");
//     return;
//   }

//   // ✅ If a previous operation exists, transform the new operation
//   if (document.history.length > 0) {
//     operation = transformOperation(document.history[document.history.length - 1], operation);
//   }

//   // ✅ Store the operation in history
//   document.history.push(operation);
//   if (document.history.length > 100) document.history.shift(); // Limit stored history

//   // ✅ Apply the transformed operation
//   document.content = applyOperation(document.content, operation);
//   document.lastUpdated = new Date();
//   await document.save();

//   // ✅ Broadcast updated content
//   collaborationNamespace.to(documentId).emit("document-updated", {
//     content: document.content,
//     version: document.lastUpdated,
//   });
// });

socket.on("undo", async ({ documentId }) => {
  let document = await Document.findById(documentId);
  if (!document || document.history.length === 0) return;

  // ✅ Get last operation and reverse it
  const lastOp = document.history.pop();
  const reversedOp = reverseOperation(lastOp);

  // ✅ Apply the reversed operation
  document.content = applyOperation(document.content, reversedOp);
  document.lastUpdated = new Date();
  await document.save();

  // ✅ Broadcast updated content
  collaborationNamespace.to(documentId).emit("document-updated", {
    content: document.content,
    version: document.lastUpdated,
  });
});

socket.on("disconnect", () => {
  console.log("User disconnected:", socket.id);
});
});

// ✅ Function to Apply Operations (Insert/Delete)
function applyOperation(content, operation) {
  if (operation.type === "insert") {
    return content.slice(0, operation.index) + operation.text + content.slice(operation.index);
  }
  if (operation.type === "delete") {
    return content.slice(0, operation.index) + content.slice(operation.index + operation.length);
  }
  return content;
}

// ✅ Function to Reverse Operations for Undo
function reverseOperation(operation) {
  if (operation.type === "insert") {
    return { type: "delete", index: operation.index, length: operation.text.length };
  }
  if (operation.type === "delete") {
    return { type: "insert", index: operation.index, text: operation.text };
  }
  return operation;
}

// Start Server
const PORT = process.env.PORT || 5003;
server.listen(PORT, () => console.log(`Collaboration Service running on port ${PORT}`));