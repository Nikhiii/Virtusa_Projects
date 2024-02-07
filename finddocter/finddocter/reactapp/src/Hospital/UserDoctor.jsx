import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDoctor.css";
import axios from "axios";
import { apiUrl } from "../apiconfig.js";
const UserDoctor = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // New state for logout popup
  const [doctorToBeDelete, setDoctorToBeDelete] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {

    localStorage.setItem("editId", "");
    console.log("came in grid");
    fun();
  }, [searchTerm, sortValue]);

  async function fun() {
    try {
      const token = localStorage.getItem("token");


      console.log("inside function");
      console.log("local",localStorage.getItem("userData"));

      const productResponse = await axios.get(
        apiUrl + `/api/doctor/user/${JSON.parse(localStorage.getItem("userData")).userId}?searchValue=${searchTerm}`,
        { 
          headers: { Authorization: `${token}`
        }, }
      );
console.log("doctorResponse",productResponse);
      if (productResponse.status == 200) {
        setProducts(productResponse.data);
      }
    } catch (error) {
      console.log("error in fun",error);
      // navigate("/error");
    }
  }
  const handleLogoutClick = () => {
    setShowLogoutPopup(true); // Show logout popup when logout is clicked
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    navigate("/login"); // Navigate to login
  };

  const handleDeleteClick = (id) => {
    setDoctorToBeDelete(id);
    setShowDeletePopup(true);
  };

  const handleViewClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsPopupVisible(true);
  };

  async function deletefunction() {
    const doctorId = doctorToBeDelete; // The ID of the product you want to delete

 try{
    const token = localStorage.getItem("token");

    let deleteResponse = await axios.delete(
      apiUrl+`/api/doctor/${doctorId}`,
        
        { headers: { Authorization: `${token}` } }
      );
      if (deleteResponse.status === 200) {
        fun();
      }
      setShowDeletePopup(false);
 }
 catch(error){
navigate("/error")
 }
  }

  return (
    <div>
      <div className={`ProductsList ${showDeletePopup ? "popup-open" : ""}`}>
        <button
          className="styledbutton"
          onClick={handleLogoutClick}
        >
          Logout
        </button>
        <button
          className="styledbutton"
          onClick={() => navigate("/createdoctor")}
        >
          Add new Doctor
        </button>
        <h1>Our Doctors</h1>
        {/* Search functionality */}
        <input
          className="searchBar"
          type="text"
          placeholder="Search by doctor name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="card-container">
          {products.length ? (
            products?.map((product) => (
              <div className="card" key={product.doctorId}>
                <img src={product.photo} alt={`${product.firstName} ${product.lastName}`} />
                <div className="card-body">
                  <h3>{product.firstName + " " + product.lastName}</h3>
                  <p>Experience: {product.experience}</p>
                  <p>Specialization: {product.specialization}</p>
                  <div className="button-group">
                  <button
                      className="styledbutton view-button"
                      onClick={() => handleViewClick(product)}
                  >
                  View
                  </button>
                  <button
                    className="styledbutton"
                    onClick={() => {
                      localStorage.setItem("editId", product.doctorId);
                      navigate("/createdoctor");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="styledbutton delete-button"
                    onClick={() => handleDeleteClick(product.doctorId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              </div>
            ))
          ) : (
            <h3>No Doctor Found</h3>
          )}
        </div>
      </div>

      {isPopupVisible && selectedDoctor && (
        <div className="popup">
          <h3>{selectedDoctor.firstName + " " + selectedDoctor.lastName}</h3>
          <div className="info">
            <div className="key">Experience:</div>
            <div className="value">{selectedDoctor.experience}</div>
            </div>
            <div className="info">
            <div className="key">Specialization:</div>
            <div className="value">{selectedDoctor.specialization}</div>
            </div>
            <div className="info">
            <div className="key">Location:</div>
            <div className="value">{selectedDoctor.location}</div>
            </div>
            <div className="info">
            <div className="key">availability:</div>
            <div className="value">{selectedDoctor.availability.join(', ')}</div>
            </div>
            <button onClick={() => setIsPopupVisible(false)}>Close</button>
          </div>
      )}

      {showDeletePopup && (
        <div className="delete-popup">
          <p>Are you sure you want to delete?</p>
          <button onClick={deletefunction}>Yes, Delete</button>
          <button
            onClick={() => {
              setShowDeletePopup(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {showLogoutPopup && (
            <div className="delete-popup">
                <p>Are you sure you want to logout?</p>
                <button onClick={handleLogout}>Yes, Logout</button>
                <button
                    onClick={() => {
                        setShowLogoutPopup(false);
                    }}
                >
                    Cancel
                </button>
            </div>
        )}

    </div>
  );
};

export default UserDoctor;
