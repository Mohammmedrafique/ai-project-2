import { Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import TextSummarizer from "../TextSummarizer";

const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TextSummarizer />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};
export default MainRoutes;
