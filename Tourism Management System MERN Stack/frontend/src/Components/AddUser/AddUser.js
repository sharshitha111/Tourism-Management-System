import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddUser() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    Firstname: "",
    Lastname: "",
    age: "",
    country: "",
    Email: "",
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    await sendRequest().then(() => {
      alert("User added successfully!"); // Display an alert
      history("/userdetails");
    });
  };

  const sendRequest = async () => {
    await axios
      .post("http://localhost:5000/users", {
        Firstname: String(inputs.Firstname),
        Lastname: String(inputs.Lastname),
        age: Number(inputs.age),
        country: String(inputs.country),
        Email: String(inputs.Email),
      })
      .then((res) => res.data);
  };

  return (
    <div>
      <h1 className="topic_auth">
        Add <span className="sub_auth">User Details</span>
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
            value={inputs.Firstname}
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
            value={inputs.Lastname}
            required
          />
          <br />
          <br />
          <label className="auth_lable">Age:</label>
          <br />
          <input
            className="auth_input"
            type="number"
            name="age"
            onChange={handleChange}
            value={inputs.age}
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
            value={inputs.country}
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
            value={inputs.Email}
            required
          />
          <br />
          <br />
          <button className="admin_form_cneter_btn" type="submit">
            Submit
          </button>{" "}
        </form>
      </div>
    </div>
  );
}

export default AddUser;
