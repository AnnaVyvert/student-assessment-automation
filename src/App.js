import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NotFoundPage from "./page/404page";
import SignPage from "./page/sign";
// import MenuBar from './components/sideMenu/sideMenu';

const App = () => {
  return (
    <div className="App">
      <Router>
        <>
          {/* <MenuBar /> */}
          <Routes>
            <Route path="/sign" element={<SignPage />} />
           
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </>
      </Router>
    </div>
  );
};

export default App;
