import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const { user } = useAuth();
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/post/${id}`);
        if (!response.ok) {
          throw new Error("Error fetching post details");
        }
        const data = await response.json();
        setPost(data.post);
        setComments(data.comments || []);
      } catch (error) {
        console.error("Error fetching post details:", error);
      }
    };
    fetchPostDetails();
  }, [id]);
  const handleAddComment = async () => {
    if (!user) {
      alert("Please log in to add a comment");
      return;
    }
    if (newComment.trim()) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/comment/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              content: newComment,
              post: id,
              author: user.userId,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setComments([data, ...comments]);
          setNewComment("");
        } else {
          throw new Error("Failed to add comment");
        }
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };
  const handleAddReply = async (commentId) => {
    if (!user) {
      alert("Please log in to add a reply");
      return;
    }
    if (newReply.trim()) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/reply/${commentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
              content: newReply,
              author: user.userId,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment._id === commentId
                ? { ...comment, replies: [...comment.replies, data.reply] }
                : comment
            )
          );
          setNewReply("");
          setReplyToCommentId(null);
        } else {
          throw new Error("Failed to add reply");
        }
      } catch (error) {
        console.error("Error adding reply:", error);
      }
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      {post ? (
        <Card style={{ marginBottom: "20px" }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {post.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {post.content}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Typography>Loading post...</Typography>
      )}
      <div>
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        <TextField
          fullWidth
          label="Add a comment"
          variant="outlined"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          multiline
          rows={2}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          style={{ marginBottom: "20px" }}
        >
          Add Comment
        </Button>
        {comments.length > 0 ? (
          <List>
            {comments.map((comment) => (
              <React.Fragment key={comment._id}>
                <ListItem alignItems="flex-start">
                  <div style={{ width: "100%" }}>
                    {comment.content ? (
                      <Typography variant="body1" gutterBottom>
                        {comment.content} - by{" "}
                        {comment.author?.name || "Anonymous"}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="error">
                        Comment content missing
                      </Typography>
                    )}
                    <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                      {Array.isArray(comment.replies) &&
                      comment.replies.length > 0 ? (
                        comment.replies.map((reply) => (
                          <Card
                            key={reply._id}
                            variant="outlined"
                            style={{ marginBottom: "10px", padding: "10px" }}
                          >
                            {reply.content ? (
                              <Typography variant="body2">
                                {reply.content} - by{" "}
                                {reply.author?.name || "Anonymous"}
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="error">
                                Reply content missing
                              </Typography>
                            )}
                          </Card>
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No replies yet.
                        </Typography>
                      )}
                      {replyToCommentId === comment._id && (
                        <div>
                          <TextField
                            fullWidth
                            label="Add a reply"
                            variant="outlined"
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            multiline
                            rows={2}
                            margin="normal"
                          />
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleAddReply(comment._id)}
                            style={{ marginBottom: "10px" }}
                          >
                            Add Reply
                          </Button>
                        </div>
                      )}
                      <Button
                        size="small"
                        onClick={() =>
                          setReplyToCommentId(
                            replyToCommentId === comment._id
                              ? null
                              : comment._id
                          )
                        }
                      >
                        {replyToCommentId === comment._id ? "Cancel" : "Reply"}
                      </Button>
                    </div>
                  </div>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography>No comments yet</Typography>
        )}
      </div>
    </div>
  );
};
export default PostDetails;
