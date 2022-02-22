import React from "react";
import { useState, useEffect } from "react";
import "./index.css";

const API_BASE = process.env.REACT_APP_DB_API;

function App() {
  //add new contacts

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // search bar
  const [jsonData, setJsonData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  //search for data
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    console.log(value);
    result = jsonData.filter((data) => {
      return (
        data.firstName.toLowerCase().search(value) !== -1 ||
        data.lastName.toLowerCase().search(value) !== -1 ||
        data.phoneNumber.search(value) !== -1
      );
    });
    setFilteredData(result);
  };

  //add new data
  function newData() {
    fetch(API_BASE + "/contacts")
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setJsonData(res);
        setFilteredData(res);
      });
  }
  useEffect(() => {
    newData();
  }, []);

  //post data to backend
  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(API_BASE + "/contacts/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        phoneNumber,
      }),
    }).then((res) => {
      console.log(res);
      //function to refresh list of contacts
      newData();
    });
    console.log("New Contact Added");
  };

  return (
    <div>
      <div
        className="search"
        style={{
          margin: "0 auto",
          marginTop: "10%",
        }}
      >
        <input
          type="text"
          placeholder="Search Contacts"
          onChange={(event) => handleSearch(event)}
        />
      </div>
      <form onSubmit={handleSubmit}>
        {/* onchange call api with the keystrokes, filter data from model */}
        <div className="newContacts">
          <h1>Add New Contact</h1>
          <input
            type="text"
            defaultValue={firstName}
            placeholder="Enter First Name"
            onChange={(event) => setFirstName(event.target.value)}
          />
          <input
            type="text"
            defaultValue={lastName}
            placeholder="Enter Last Name"
            onChange={(event) => setLastName(event.target.value)}
          />
          <input
            type="number"
            defaultValue={phoneNumber}
            placeholder="Enter Phone Number"
            onChange={(event) => setPhoneNumber(event.target.value)}
          />

          <button type="submit">Submit</button>
        </div>
      </form>
      <div className="storedContacts">
        <h1>Contacts</h1>
        {filteredData.map((value, index) => {
          return (
            <div key={value.id} style={{}}>
              <div className="test">
                <p>{value.firstName}</p>
                <p>{value.lastName}</p>
              </div>
              <p>
                <label>Phone Number: {value.phoneNumber}</label>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
