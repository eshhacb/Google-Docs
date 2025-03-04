import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./auth/Signup";
import CollaborationPage from "./pages/CollaborationPage";
import Login from "./auth/Login";

function App() {
  return (
  
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/collaborate/:documentId" element={<CollaborationPage />} />
      </Routes>
   
  );
}

export default App;
