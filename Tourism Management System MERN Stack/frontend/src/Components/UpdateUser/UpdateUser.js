import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../Register/regi.css";
function UpdateUser() {
  const [input, setInputs] = useState({});
  const navigate = useNavigate(); // Changed from history to navigate
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/users/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.user));
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios
      .put(`http://localhost:5000/users/${id}`, {
        Firstname: String(input.Firstname),
        Lastname: String(input.Lastname),
        age: Number(input.age),
        country: String(input.country),
        Email: String(input.Email),
      })
      .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(input);
    try {
      await sendRequest();
      // Show success message
      window.alert("Update successful!");
      // Navigate to the profile page
      navigate("/userdetails");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      // Handle error if needed
      // You can show an error message or take other actions
    }
  };

  return (
    <div>
     <h1 className="topic_auth">
        Update <span className="sub_auth">User Details</span>
      </h1>
      <div className="form_main_box">
        <form className="form_user_details" onSubmit={handleSubmit}>
          <label className="auth_lable">Firstname:</label>
          <br />
          <input
            className="auth_input"
            type="text"
            name="Firstname"
            onChange={handleChange}
            value={input.Firstname || ""}
            required
          />
          <br />
          <br />
          <label className="auth_lable">Lastname:</label>
          <br />
          <input
            className="auth_input"
            type="text"
            name="Lastname"
            onChange={handleChange}
            value={input.Lastname || ""}
            required
          />
          <br />
          <br />
          <label className="auth_lable">Age:</label>
          <br />
          <input
            className="auth_input"
            type="text"
            name="age"
            onChange={handleChange}
            value={input.age || ""}
            required
          />
          <br />
          <br />
          <label className="auth_lable">Country:</label>
          <br />
          <input
            className="auth_input"
            type="text"
            name="country"
            onChange={handleChange}
            value={input.country || ""}
            required
          />
          <br />
          <br />
          <label className="auth_lable">Email:</label>
          <br />
          <input
            className="auth_input"
            type="email"
            name="Email"
            onChange={handleChange}
            value={input.Email || ""}
            required
          />
          <br />
          <br />
          <button className="admin_form_cneter_btn" type="submit">
            Submit
          </button>
          {/* Added type attribute */}
        </form>
      </div>
    </div>
  );
}

export default UpdateUser;
