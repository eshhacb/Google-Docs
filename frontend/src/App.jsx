import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CollaborationPage from "./pages/CollaborationPage";

function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collaborate/:documentId" element={<CollaborationPage />} />
      </Routes>
   
  );
}

export default App;
