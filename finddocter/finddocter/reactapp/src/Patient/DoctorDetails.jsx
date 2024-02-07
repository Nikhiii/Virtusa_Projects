import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./DoctorDetails.css";
//import { useDispatch, useSelector } from "react-redux";
import doctorImage from '../assets/doctor.jpeg';
import axios from 'axios';
import { apiUrl } from '../apiconfig';

const DoctorLists
 = () => {

    const [products, setProducts] = useState([]);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortValue, setSortValue] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
       fun()
    }, [searchTerm, sortValue]);


async function fun() {
 try{
        
    let userResponse= await axios.get(apiUrl+'/api/users',
    { headers: { Authorization: `${localStorage.getItem("token")}` } }
    )
    userResponse = await userResponse.data.users
    console.log("userResponse",userResponse);

    let productResponse = await axios.get(
        `${apiUrl}/api/doctor?searchValue=${searchTerm}&sortValue=${sortValue}`,
        {
            searchValue: searchTerm,
            sortValue: sortValue,
        }
        ,
        { headers: { Authorization: `${localStorage.getItem("token")}` } }
      );
      console.log("productResponseeeeeeeee",productResponse);
      productResponse=productResponse.data.doctors
      console.log("productResponse", productResponse);     
        productResponse.map((product) => {
        userResponse.map((user) => {
            if (product.userId === user.userId) {
                product.userName = user.firstName + " " + user.lastName
                product.userEmail = user.email
                product.userPhone = user.mobileNumber
            }
        })
    })
    console.log("productResponse", productResponse);
    setProducts(productResponse)
 }catch(error){
    console.log("error os ",error);
// navigate("/error")

}
    }

    const openPopup = (product) => {
        setSelectedProduct(product);
        setShowPopup(true);
    };

    const closePopup = () => {
        setSelectedProduct(null);
        setShowPopup(false);
    };

    const handleLogoutClick = () => {
        setShowLogoutPopup(true); // Show logout popup when logout is clicked
      };
    
    const handleLogout = () => {
        localStorage.clear(); // Clear local storage
        navigate("/login"); // Navigate to login
    };
    


    return (
        <div className={`DoctorLists
         }`}>
            <button className='styledbutton' onClick={handleLogoutClick}>Logout</button>
            <h1>Available Doctors</h1>
            {/* Search functionality */}
            <input
                className='searchBar'
                type="text"
                placeholder="Search by doctor name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Table layout */}
            <table>
                <thead>
                    <tr>
                        <th>FirstName</th>
                        <th>LastName</th>
                        <th>Specialization</th>
                        <th>Experience <div>
                       
                  <button
                    className="sortButtons"
                    onClick={() => setSortValue(1)}
                  >
                    ⬆️
                  </button>
                  <button
                    className="sortButtons"
                    onClick={() => setSortValue(-1)}
                  >
                    ⬇️
                  </button>
                </div></th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length?products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.firstName}</td>
                            <td>{product.lastName}</td>
                            <td>{product.specialization}</td>
                            <td>{product.experience}</td>
                            <td>
                                <button onClick={() => openPopup(product)}>View Info</button>
                            </td>
                        </tr>
                    )): (
                        <tr>
                          <td
                            className="norecord"
                            colSpan={4}
                            style={{ textAlign: "center", verticalAlign: "middle" }}
                          >
                            No records found
                          </td>
                        </tr>
                      )}
                </tbody>
            </table>

            {/* Popup to display additional information */}
            {showPopup && selectedProduct && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>
                        <img src={doctorImage} alt="Doctor" style={{width: '100px', height: '100px'}} />
                        <h2>{selectedProduct.product} Details</h2>
                        <p>Doctor Name: {selectedProduct.firstName} {selectedProduct.lastName}</p>
                        <p>Experience: {selectedProduct.experience} years</p>
                        <p>Location: {selectedProduct.location}</p>
                        <p>Availability: {selectedProduct.availability.join(", ")}</p>
                        <p>Posted By: {selectedProduct.userName}</p>
                        <p>Contact Email: {selectedProduct.userEmail}</p>
                        <p>Contact Phone: {selectedProduct.userPhone}</p>
                        
                    </div>
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

export default DoctorLists;

