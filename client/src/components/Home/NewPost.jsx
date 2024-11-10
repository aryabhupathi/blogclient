import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import MenuAppBar from "./AppBar";
const NewPost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      title: newPost.title,
      content: newPost.content,
      tags: newPost.tags,
      authorId: user._id,
    };
    try {
      const res = await fetch("http://localhost:5000/api/post/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await res.json();
      if (data._id) {
        navigate("/"); 
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  return (
    <MenuAppBar>
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Create a New Post
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Content"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Tags"
              value={newPost.tags}
              onChange={(e) =>
                setNewPost({ ...newPost, tags: e.target.value })
              }
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Create Post
            </Button>
          </form>
        </Box>
      </Container>
    </MenuAppBar>
  );
};
export default NewPost;
