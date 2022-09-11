import "./App.css";
import Register from "./Pages/Register";
import { BrowserRouter, Route } from "react-router-dom";
import { Routes } from "react-router-dom";

import Login from "./Pages/Login";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import Private from "./Routes/Private";
import Public from "./Routes/Public";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="">
          <Routes>
            <Route to="/" element={<Public />}>
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={<NotFound />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route path="/" element={<Private />}>
              <Route path="/" element={<Home />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
