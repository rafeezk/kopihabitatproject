import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ListData from "./admin/ListData";
import AuthAdmin from "./auth/AuthAdmin";
import AuthRoute from "./auth/AuthRoute"; 
import BeanDetail from "./pages/BeanDetail";
import CoffeeDetail from "./pages/CoffeeDetail";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage"

// library
import { library } from "@fortawesome/fontawesome-svg-core";

// icons
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import SettingPage from "./pages/SettingPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/detail/:id" element={<BeanDetail />} />
        <Route path="/coffee-detail/:id" element={<CoffeeDetail />} />
        
        <Route element={<AuthRoute />}>
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
          <Route path="/setting" element={<SettingPage/>} />
          {/* <Route path="/history" element={<HistoryPage/>} /> */}
        </Route>

        <Route element={<AuthAdmin />}>
          <Route path="/admin" element={<ListData />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
library.add(fab, fas, far);
