import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProducts.css";
import axios from "axios";
import { apiUrl } from "../apiconfig.js";
const UserProducts = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [productToBeDelete, setProductToBeDelete] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {

    localStorage.setItem("editId","");
    console.log("came in grid");
    fun();
  }, [searchTerm, sortValue]);

  async function fun() {
    try {
      const token = localStorage.getItem("token");
      console.log("locallllllllll",localStorage.getItem("userData"));

      console.log("inside function");
      const productResponse = await axios.get(
        apiUrl + `/api/medicine/user/${JSON.parse(localStorage.getItem("userData")).userId}?searchValue=${searchTerm}`  ,
        { headers: { Authorization: `${token}`,
        "Content-Type": "application/json"
       }, }
      );
console.log("productResponse",productResponse);
      if (productResponse.status == 200) {
        setProducts(productResponse.data);
      }
    } catch (error) {
      console.log("error", error);
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
    setProductToBeDelete(id);
    setShowDeletePopup(true);
  };

  const handleViewClick = (product) => {
    setSelectedProduct(product);
    setIsPopupVisible(true);
  };

  async function deletefunction() {
    const medicineId = productToBeDelete; // The ID of the product you want to delete

 try{
    const token = localStorage.getItem("token");

    let deleteResponse = await axios.delete(
      apiUrl+`/api/medicine/${medicineId}`,
        
        { headers: { Authorization: `${token}` } }
      );
      if (deleteResponse.status === 200) {
        fun();
      }
      setShowDeletePopup(false);
 }
 catch(error){
  console.log("error",error);
// navigate("/error")
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
          onClick={() => navigate("/createproduct")}
        >
          Add new Medicine
        </button>
        <h1>My Medicines</h1>
        {/* Search functionality */}
        <input
         className="searchBar"
          type="text"
          placeholder="Search by product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="card-container">
          {products.length ? (
            products?.map((product) => (
              <div className="card" key={product.medicineId}>
                <img src={product.photo} alt={`${product.product}`} />
                <div className="card-body">
                  <h3>{product.product}</h3>
                  <p>Description: {product.description}</p>
                  <p>Price: {product.price}</p>
                  <p>Expiry Date: {new Date(product.expiryDate).toLocaleDateString('en-GB')}</p>

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
                      localStorage.setItem("editId", product.medicineId);
                      navigate("/createproduct");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="styledbutton delete-button"
                    onClick={() => handleDeleteClick(product.medicineId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              </div>
            ))
          ) : (
            <h3>No Product Found</h3>
          )}
        </div>
      </div>

      {isPopupVisible && selectedProduct && (
        <div className="popup">
          <h3>{selectedProduct.product}</h3>
          <div className="info">
            <div className="key">Description:</div>
            <div className="value">{selectedProduct.description}</div>
          </div>
          <div className="info">
            <div className="key">Price:</div>
            <div className="value">{selectedProduct.price}</div>
          </div>
          <div className="info">
            <div className="key">Expiry Date:</div>
            <div className="value">{new Date(selectedProduct.expiryDate).toLocaleDateString('en-GB')}</div>
          </div>
          <div className="info">
            <div className="key">Category:</div>
            <div className="value">{selectedProduct.category}</div>
          </div>
          <div className="info">
            <div className="key">Manufacturer:</div>
            <div className="value">{selectedProduct.manufacturer}</div>
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

export default UserProducts;
