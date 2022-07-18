import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/register";
import Statpage from "./components/statpage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Register />} />
        <Route path="/statpage" exact element={<Statpage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
