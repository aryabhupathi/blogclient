import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Grid,
  Box,
  Container,
  Fab,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MenuAppBar from "./AppBar";
const PostList = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/post/posts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, []);
  const handleViewPost = (postId) => {
    navigate(`/post/${postId}`);
  };
  return (
    <MenuAppBar>
      <Container maxWidth="lg" sx = {{backgroundColor:'#dce6f5'}}>
        <Box sx={{ display: "flex", justifyContent: "space-between", my: 4 }}>
          <Typography variant="h3" component="h1">
            All Posts
          </Typography>
          {user && (
            <Fab
              color="primary"
              aria-label="add"
              onClick={() => navigate("/new-post")}
            >
              <AddIcon />
            </Fab>
          )}
        </Box>
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease-in-out", 
                  "&:hover": {
                    transform: "scale(1.05)", 
                    boxShadow: 3, 
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      background: "#faf9d7",
                      marginBottom: "8px",
                      padding: "8px",
                    }}
                  >
                    <Typography variant="h6">{post.title}</Typography>
                    <Typography
                      variant="subtitle2"
                      color="red"
                      sx={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      Author: {post.author?.name}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      border: "1px solid black",
                      padding: "8px",
                      backgroundColor: "whitesmoke",
                      height: "150px",
                    }}
                  >
                    <Typography variant="body1">{post.content}...</Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ mt: "auto" }}>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => handleViewPost(post._id)}
                  >
                    View Post
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </MenuAppBar>
  );
};
export default PostList;
