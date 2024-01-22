
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import ForgetPassword from "./components/ForgetPassword";
import { Routes, Route, useNavigate } from "react-router-dom";

import AddExpense from "./components/AddExpense";
function App() {
  return (

    <div className="bg-black h-screen">
      <Routes>
        <Route index element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/add-expense' element={<AddExpense />} />
        <Route path='/forget-password' element={<ForgetPassword />} />
      </Routes>
    </div>

  );
}

export default App;
