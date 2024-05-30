import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import User from "../User/User";
import { useReactToPrint } from "react-to-print";
import "../UserDetails/users.css"; // Importing the CSS file
import "./users.css";

const URL = "http://localhost:5000/users";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users || []));
  }, []);

  const ComponentsRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => ComponentsRef.current,
    DocumentTitle: "Users Report",
    onafterprint: () => "Users Report Successfully Downloaded !",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredUsers = data.users.filter((user) =>
        Object.values(user).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setUsers(filteredUsers);
      setNoResults(filteredUsers.length === 0);
    });
  };

  const handleSendReport =() =>{

    const phonenumber ="+94714153371";
    const message ="Selected User Report"
    const WhatsAppUrl =`https://web.whatsapp.com/send?phone=${phonenumber}&text=${encodeURIComponent(
      message
    )}`;

    window.open(WhatsAppUrl,"_blank");
  }

  return (
    <div className="ful_detail_box">
      <h1 className="topic_auth">
        User <span className="sub_auth">Details</span>
      </h1>
      <div className="btnbox">
        <button
          onClick={() => (window.location.href = "/Adduser")}
          className="btn_dash_admin"
        >
          Add User
        </button>
        <div>
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            className="serch_inpt"
            name="Search"
            placeholder="Search User Details"
          ></input>

          <button className="btn_dash_admin" onClick={handleSearch}>
            Search
          </button>
        </div>

        <button className="btn_dash_admin" onClick={handlePrint}>
          Download Report
        </button>
      </div>
      {noResults ? (
        <div className="no-results">
          <h1>No users available</h1>
        </div>
      ) : (
        <div ref={ComponentsRef}>
          <table className="table_details_admin">
            <thead>
              <tr>
                <th className="admin_tbl_th">id</th>
                <th className="admin_tbl_th">first name</th>
                <th className="admin_tbl_th">last name</th>
                <th className="admin_tbl_th">age</th>
                <th className="admin_tbl_th">country</th>
                <th className="admin_tbl_th">email</th>
                <th className="admin_tbl_th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <User key={i} user={user} />
              ))}
            </tbody>
          </table>
          <br></br>
          <button className="btn_dash_admin" onClick={handleSendReport}>Send Message</button>
        </div>
      )}
    </div>
  );
}

export default Users;
