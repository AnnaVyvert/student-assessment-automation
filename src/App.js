import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import NotFoundPage from "./page/404page";
import EditMarksPage from "./page/edit_marks_page";
import FinalList from "./page/final_page";
import ListPage from "./page/list_page";
import SignPage from "./page/sign";
// import MenuBar from './components/sideMenu/sideMenu';

const App = () => {
  return (
    <div className="App">
      <Router>
        <>
          {/* <MenuBar /> */}
          <Routes>
            {/* <Route path="/sign" element={<SignPage />} /> */}
            <Route path="/group-list" element={<ListPage role_id={1}/>} />
            <Route path="/student-list" element={<ListPage role_id={2}/>} />
            <Route path="/subject-list" element={<ListPage role_id={3}/>} />
            <Route path="/edit-mark-form" element={<EditMarksPage/>} />

            {/* <Route path="/edit-mark-form" element={<ListPage role_id={3}/>} /> */}
            <Route path="/final-form" element={<FinalList />} />
           
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </>
      </Router>
    </div>
  );
};

export default App;
