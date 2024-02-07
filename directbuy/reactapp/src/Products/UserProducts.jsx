import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../apiconfig";
import './UserProducts.css';


const UserProducts = () => {
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [productToBeDeleted, setProductToBeDeleted] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [sortValue, setSortValue] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("editId", "");
        console.log("cameee");
        fetchProducts();
    },[searchText,sortValue]);

    async function fetchProducts() {
        try {
            const token = localStorage.getItem("token");
            console.log("locallllllllll",localStorage.getItem("userData"));

            const ProductResponse = await axios.get(
                apiUrl + `/api/product/user/${JSON.parse(localStorage.getItem("userData")).userId}?searchValue=${searchText}`,

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
            console.log("ProductResponse", ProductResponse);

            if (ProductResponse.status == 200) {
                setProducts(ProductResponse.data);

            }
        } catch (error) {
            console.log("error", error);
        }
    }

    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
    }

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleDeleteClick = (id) => {
        setProductToBeDeleted(id);
        setShowDeletePopup(true);
    };

    const handleViewClick = (product) => {
        setIsPopupVisible(true);
        setSelectedProduct(product);
    };

    async function deleteProduct() {
        const productId = productToBeDeleted;
        try {
            const token = localStorage.getItem("token");
            console.log("tokennnnnnnnn", token);
            const deleteProductResponse = await axios.delete(
                `${apiUrl}/api/product/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("deleteProductResponse", deleteProductResponse);

            if (deleteProductResponse.status == 200) {
                setShowDeletePopup(false);
                fetchProducts();
            }
        } catch (error) {
            console.log("error", error);
        }
    }

    return (

        <div>
            <div className={`MoviesList ${showDeletePopup || isPopupVisible && selectedProduct || showLogoutPopup ? "popup-open" : ""}`}>
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
                    Create Product
                </button>
                <h1>Our Products</h1>

                <input
                    className="searchBar"
                    type="text"
                    placeholder="Search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                <div className="card-container">
                    {products.length ? (
                        products.map((product) => (
                            <div className="card" key={product.productId}>
                                <img src={product.coverImage} alt={product.productName} />
                                <div className="card-body">
                                    <h3>{product.productName}</h3>
                                    <p>Price: {product.price}</p>
                                    <p>Description: {product.description}</p>
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
                                                if (product && product.productId) {
                                                    localStorage.setItem("editId", product.productId);
                                                    navigate("/createproduct");
                                                } else {
                                                    console.error('Product or product ID not found');
                                                }
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="styledbutton delete-button"
                                            onClick={() => handleDeleteClick(product.productId)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h1>No Product Found</h1>
                    )}
                </div>
            </div>

            {isPopupVisible && selectedProduct && (
                <div className="popup">
                    <h3>{selectedProduct.productName}</h3>
                    <div className="info">
                        <div>
                            <img src={selectedProduct.coverImage} alt={selectedProduct.productName} />
                        </div>
                        <div>
                        <p><strong>Category: </strong>{selectedProduct.category}</p>
                        <p><strong>Quantity: </strong>{selectedProduct.quantity}</p>
                        <p><strong>Origin: </strong>{selectedProduct.origin}</p>
                        <p><strong>Price: </strong>{selectedProduct.price}</p>
                        <p><strong>Description: </strong>{selectedProduct.description}</p>
                        </div>
                    </div>
                    <button onClick={() => setIsPopupVisible(false)}>Close</button>
                </div>
            )}

            {showDeletePopup && (
                <div className="delete-popup">
                    <p>Are you sure you want to delete this product?</p>
                    <button onClick={deleteProduct}>Yes, Delete</button>
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






