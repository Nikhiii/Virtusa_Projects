import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../apiconfig";
import './ProductList.css';


const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false); // New state for logout popup
    const [selectedProduct, setSelectedProduct] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [sortValue, setSortValue] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fun();
    },[searchText,sortValue]);

    async function fun() {
        try {
            let userResponse = await axios.get(apiUrl+'/api/users',{
                    headers: { Authorization: `${localStorage.getItem("token")}` },
                });

                userResponse = await userResponse.data;

                console.log("userResponse",userResponse);

                let ProductResponse = await axios.get(
                    apiUrl + `/api/products?searchValue=${searchText}&sortValue=${sortValue}`,
                    {
                        headers: {
                            Authorization: `${localStorage.getItem("token")}`,
                        },
                    }
                );
                ProductResponse = ProductResponse.data;
                console.log("ProductResponse", ProductResponse);

                ProductResponse.map((product) => {
                    userResponse.map((user) => {
                        if (product.userId === user.userId) {
                            product.userName = user.firstName + " " + user.lastName;
                            product.userEmail = user.email;
                            product.userPhone = user.mobileNumber
                        }
                    });
                });
                console.log("ProductResponse", ProductResponse);

                if( sortValue === "asc"){
                    ProductResponse.sort((a, b) => a.price - b.price);
                } else if (sortValue === "desc"){
                    ProductResponse.sort((a, b) => b.price - a.price);
                }

                setProducts(ProductResponse);
        } catch (error) {
            console.log("error", error);
        }
        

    }

    const openPopup = (product) => {
        setSelectedProduct(product);
        setShowPopup(true);        
        }
    
    const closePopup = () => {
        setSelectedProduct(null);
        setShowPopup(false);
    };

    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };
        

    return (
        <div className={`ProductLists`}>
            <button className='styledbutton' onClick={handleLogoutClick}>Logout</button>
            <h1>Available Products</h1>
            {/* Search functionality */}
            <input
                className='searchBar'
                type="text"
                placeholder="Search by product name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
            />
            {/* Sort functionality */}
            <select value = {sortValue} onChange={(e) => setSortValue(e.target.value)}>
                <option value="">Sort by</option>
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
            </select>


            {/* Table layout */}
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Origin</th>
                        <th>Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.length ? products.map((product) => (
                        <tr key={product._id}>
                            <td>{product.productName}</td>
                            <td>{product.price}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td>{product.origin}</td>
                            <td>{product.quantity}</td>
                            <td>
                                <button onClick={() => openPopup(product)}>View Info</button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td
                                className="norecord"
                                colSpan={6}
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
                        <h2>{selectedProduct.productName} Details</h2>
                        <p><strong>Price: </strong>{selectedProduct.price}</p>
                        <p><strong>Description: </strong>{selectedProduct.description}</p>
                        <p><strong>Category: </strong>{selectedProduct.category}</p>
                        <p><strong>Origin: </strong>{selectedProduct.origin}</p>
                        <p><strong>Quantity: </strong>{selectedProduct.quantity}</p>

                        <p><strong>Posted By: </strong>{selectedProduct.userName}</p>
                        <p><strong>Email: </strong>{selectedProduct.userEmail}</p>
                        <p><strong>Contact No: </strong>{selectedProduct.userPhone}</p>
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

export default ProductList;