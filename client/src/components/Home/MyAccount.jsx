import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Card, CardContent, Typography, Button, CardActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
const MyAccount = () => {
  const { user } = useAuth();
  const [myPosts, setMyPosts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchMyPosts = async () => {
        console.log(user, 'uuuuuuuuuuuuuuuuuuuuu');
      if (user) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/user/posts/user/${user._id}`
          );
          const data = await res.json();
          setMyPosts(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    console.log(myPosts, 'mpmpmpmpmmp');
    fetchMyPosts();
  }, [user, myPosts]);
  const handleViewPost = (postId) => {
    navigate(`/post/${postId}`);
  };
  const handleDelete = async (postId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/post/posts/${postId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setMyPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  return (
    <div>
      <h1>My Posts</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {myPosts.map((post) => (
          <Card key={post._id}>
            <CardContent>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                Author: {post.author?.name}
              </Typography>
              <Typography variant="body1">
                {post.content.slice(0, 100)}...
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => handleViewPost(post._id)}>
                View Post
              </Button>
              <Button
                size="small"
                color="secondary"
                onClick={() => handleDelete(post._id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default MyAccount;
