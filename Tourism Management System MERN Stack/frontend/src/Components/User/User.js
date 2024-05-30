import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./user.css"; // Importing the CSS file

function User(props) {
  const { _id, Firstname, Lastname, age, country, Email } = props.user || {};


  const deleteHandler = async () => {
    await axios.delete(`http://localhost:5000/users/${_id}`);
    // Refresh the user list after deletion
    window.location.reload();
  };

  return (
    <tr className="user-container">
      <td className="admin_tbl_td">{_id}</td>
      <td className="admin_tbl_td">{Firstname}</td>
      <td className="admin_tbl_td">{Lastname}</td>
      <td className="admin_tbl_td">{age}</td>
      <td className="admin_tbl_td">{country}</td>
      <td className="admin_tbl_td">{Email}</td>
      <td className="admin_tbl_td">
        <Link className="btn_dash_admin" to={`/userdetails/${_id}`}>Update</Link>
        <button className="btn_dash_admin_dlt" onClick={deleteHandler}>Delete</button>
      </td>
    </tr>
  );
}

export default User;
