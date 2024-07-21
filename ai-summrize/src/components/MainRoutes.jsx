import { Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import TextSummarizer from "../TextSummarizer";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<TextSummarizer />} />
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};
//ello
export default MainRoutes;
