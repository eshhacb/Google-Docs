import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import collaborationRoutes from "./src/routes/collaborationRoutes.js";
import Document from "./src/models/document.js";

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

// MongoDB Connection with error handling
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("DB Connection Error:", err);
    process.exit(1); // Exit process if DB connection fails
  });

app.use("/api/collaboration", collaborationRoutes);

// WebSocket Namespace for Collaboration
const collaborationNamespace = io.of("/collaboration");

collaborationNamespace.on("connection", (socket) => {
  console.log("User connected to collaboration:", socket.id);

  socket.on("join-document", async (documentId) => {
    socket.join(documentId);

    let document = await Document.findById(documentId);
    if (!document) {
      document = await Document.create({ _id: documentId, content: "" });
    }

    socket.emit("load-document", { content: document.content, version: document.lastUpdated });
    console.log(`User joined document ${documentId}`);
  });

  socket.on("edit-document", async ({ documentId, operation, version }) => {
    let document = await Document.findById(documentId);
    if (!document) return;

    if (new Date(version) !== new Date(document.lastUpdated)) {
      socket.emit("error", "Version mismatch! Reload document.");
      return;
    }

    if (operation.type === "delete") {
      operation.text = document.content.slice(operation.index, operation.index + operation.length);
    }

    const newContent = applyOperation(document.content, operation);
    document.content = newContent;
    document.lastUpdated = new Date();
    await document.save();

    collaborationNamespace.to(documentId).emit("document-updated", {
      content: newContent,
      version: document.lastUpdated,
    });
  });

  socket.on("undo", async ({ documentId }) => {
    let document = await Document.findById(documentId);
    if (!document) return;

    if (!document.history || document.history.length === 0) return;

    const lastOp = document.history.pop();
    const reversedOp = reverseOperation(lastOp);
    document.content = applyOperation(document.content, reversedOp);
    document.lastUpdated = new Date();
    await document.save();

    collaborationNamespace.to(documentId).emit("document-updated", {
      content: document.content,
      version: document.lastUpdated,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Function to Apply Operations (Insert/Delete)
function applyOperation(content, operation) {
  if (operation.type === "insert") {
    return content.slice(0, operation.index) + operation.text + content.slice(operation.index);
  }
  if (operation.type === "delete") {
    return content.slice(0, operation.index) + content.slice(operation.index + operation.length);
  }
  return content;
}

// Function to Reverse Operations for Undo
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
