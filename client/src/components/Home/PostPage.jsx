import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Container,
  TextField,
  Typography,
  Collapse,
} from "@mui/material";
import MenuAppBar from "./AppBar";
const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replies, setReplies] = useState({});
  const [replyVisibility, setReplyVisibility] = useState({});
  const { user } = useAuth();
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/post/posts/${postId}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/comment/posts/${postId}/comments`);
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setComments([]);
      }
    };
    fetchPost();
    fetchComments();
  }, [postId]);
  const fetchReplies = async (commentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reply/comments/${commentId}/replies`);
      const data = await res.json();
      setReplies((prevReplies) => ({ ...prevReplies, [commentId]: data }));
    } catch (error) {
      console.error("Error fetching replies:", error);
    }
  };
  const toggleReplies = (commentId) => {
    setReplyVisibility((prevVisibility) => ({
      ...prevVisibility,
      [commentId]: !prevVisibility[commentId],
    }));
    if (!replies[commentId]) {
      fetchReplies(commentId);
    }
  };
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const userId = user._id;
    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/comment/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          post: postId,
          author: userId,
          replyToComment: replyTo,
        }),
      });
      const data = await res.json();
      setComments((prevComments) => [data, ...prevComments]);
      setNewComment("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  const handleReplySubmit = async (e, commentId) => {
    e.preventDefault();
    if (!newReply.trim()) {
      alert("Reply cannot be empty.");
      return;
    }
    const userId = user._id;
    try {
      const res = await fetch("http://localhost:5000/api/reply/replies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newReply,
          comment: commentId,
          author: userId,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to submit the reply.");
      }
      const data = await res.json();
      setReplies((prevReplies) => ({
        ...prevReplies,
        [commentId]: [
          ...(prevReplies[commentId] || []),
          data,
        ],
      }));
      setNewReply("");
      setReplyTo(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };
  const renderReplies = (commentId) => {
    const commentReplies = replies[commentId];
    if (!Array.isArray(commentReplies) || commentReplies.length === 0) {
      return <Typography variant="body2" color="textSecondary">No replies yet.</Typography>;
    }
    return (
      <Box sx={{ ml: 4, mt: 2 }}>
        {commentReplies.map((reply) => (
          <Card key={reply._id} sx={{ mb: 2, p: 2, backgroundColor: '#f0f7da' }}>
            <Typography variant="body1">{reply.content}</Typography>
            <Typography variant="caption" color="textSecondary">— {reply.author.name}</Typography>
          </Card>
        ))}
      </Box>
    );
  };
  return (
    <MenuAppBar>
      <Container maxWidth="md" sx={{backgroundColor:'dce6f5'}}>
        {post && (
          <Card sx={{ my: 4, p: 4, backgroundColor:'#faf9d7' }}>
            <Typography variant="h4" gutterBottom>
              {post.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {post.content}
            </Typography>
          </Card>
        )}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Comments
          </Typography>
          {comments.length === 0 ? (
            <Typography variant="body1" color="textSecondary">No comments yet.</Typography>
          ) : (
            <Box>
              {comments.map((comment) => (
                <Card key={comment._id} sx={{ mb: 4, p: 3, backgroundColor:'#f7daf2' }}>
                  <CardContent>
                    <Typography variant="body1">{comment.content}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Likes: {comment.likes} — {comment.author?.name}
                    </Typography>
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <Button size="small" onClick={() => toggleReplies(comment._id)}>
                        {replyVisibility[comment._id] ? "Hide Replies" : "View Replies"}
                      </Button>
                    </CardActions>
                    <Collapse in={replyVisibility[comment._id]} timeout="auto" unmountOnExit>
                      {renderReplies(comment._id)}
                      {user && (
                        <form onSubmit={(e) => handleReplySubmit(e, comment._id)} >
                          <TextField
                            fullWidth
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            placeholder="Write your reply"
                            variant="outlined"
                            sx={{ mt: 2 }}
                          />
                          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                              Add Reply
                            </Button>
                          </Box>
                        </form>
                      )}
                    </Collapse>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>
        {user ? (
          <Box sx={{ mt: 6, backgroundColor:'#f2faf8', p: 3 }}>
            <Typography variant="h6" gutterBottom>Leave a Comment</Typography>
            <form onSubmit={handleCommentSubmit}>
              <TextField
                fullWidth
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment"
                variant="outlined"
                multiline
                rows={4}
                sx={{ mb: 3 }}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                  Add Comment
                </Button>
              </Box>
            </form>
          </Box>
        ) : (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 4 }}>
            Please log in to leave a comment.
          </Typography>
        )}
      </Container>
    </MenuAppBar>
  );
};
export default PostPage;
