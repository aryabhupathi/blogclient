import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();
  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]); 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePic) {
      formData.append("profilePicture", profilePic); 
    }
    try {
      const response = await fetch("http://localhost:5000/api/user/newusers", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        navigate("/login");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Profile Picture (Optional):</label>
          <input type="file" onChange={handleProfilePicChange} />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
export default Register;
