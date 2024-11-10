import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostList from "./components/Home/PostList";
import { AuthProvider } from "./components/Context/AuthContext";
import Login from "./components/Home/Login";
import Register from "./components/Home/Register";
import PostPage from "./components/Home/PostPage";
import MyAccount from "./components/Home/MyAccount";
import NewPost from "./components/Home/NewPost";
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/post" element={<PostList />} />
          <Route path="/my-posts" element={<MyAccount />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path = "/new-post" element = {<NewPost/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

