import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { user, token } = useAuth();
  console.log(user, "Logged-in User");
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user && token) {
        console.log("User ID:", user._id);
        try {
          const response = await fetch(
            `http://localhost:5000/api/post/my/${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Error fetching user posts");
          }
          const data = await response.json();
          setPosts(data);
        } catch (error) {
          console.error("Error fetching user posts:", error);
        }
      }
    };
    if (user) {
      fetchUserPosts();
    }
  }, [user, token]);
  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);
  };
  const handleBackToAllPosts = () => {
    navigate("/");
  };
  return (
    <div>
      <Typography variant="h5" style={{ marginTop: 20 }}>
        My Posts
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: 10 }}
        onClick={handleBackToAllPosts}
      >
        Back to All Posts
      </Button>
      {posts.length === 0 && (
        <Typography
          variant="body1"
          color="textSecondary"
          style={{ marginTop: 20 }}
        >
          You have not created any posts yet.
        </Typography>
      )}
      <Grid container spacing={2} style={{ marginTop: 10 }}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {post.content.slice(0, 100)}...
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handlePostClick(post._id)}
                >
                  View Post
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
export default MyPost;
