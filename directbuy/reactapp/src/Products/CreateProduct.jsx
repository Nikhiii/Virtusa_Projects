import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../apiconfig";
import './CreateProduct.css';

const CreateProduct = () => {

    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        productName: "",
        price: 0,
        description: "",
        category: "",
        origin: "",
        quantity: 0,
        coverImage: null,
    });

    const [error, setError] = useState({
        productName: "",
        price: "",
        description: "",
        category: "",
        origin: "",
        quantity: "",
        coverImage: "",
    });

    useEffect(() => {
        const editId = localStorage.getItem("editId");
        if (editId !== '') {
            editfun();
        }
    }, []);

    async function editfun() {
        const token = localStorage.getItem("token");
        try {
            let response = await axios.get(
                apiUrl + "/api/product/" + localStorage.getItem("editId"),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("response", response);
            setProductData(response.data);
        }
        catch (error) {
            console.log("error", error);
        }
    }

    const handleInputChange = (e) => {
        setProductData({ ...productData, [e.target.name]: e.target.value });
        setError({ ...error, [e.target.name]: "" });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if(file){
            convertFileToBase64(file);
        }
    };

    const convertFileToBase64 = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setProductData({ ...productData, coverImage: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleCreateProduct = async (e) => {
        const validationErrors ={};

        if (!productData.productName) {
            validationErrors.productName = "Product name is required";
        }
        if (!productData.price) {
            validationErrors.price = "Price is required";
        }
        if (!productData.description) {
            validationErrors.description = "Description is required";
        }
        if (!productData.category) {
            validationErrors.category = "Category is required";
        }
        if (!productData.origin) {
            validationErrors.origin = "Origin is required";
        }
        if (!productData.quantity) {
            validationErrors.quantity = "Quantity is required";
        }
        if (!productData.coverImage) {
            validationErrors.coverImage = "Image is required";
        }

        console.log("validationErrors", validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors);
            return;
        }

        productData.userId = JSON.parse(localStorage.getItem("userData")).userId;
        console.log("productData", productData);

        try {
            const token = localStorage.getItem("token");
            const editId = localStorage.getItem("editId");

            const requestData = {...productData};
            
            if(editId === ''){
                productData.userId = JSON.parse(localStorage.getItem("userData")).userId;
                console.log("productData", productData);

                let CreateProductResponse = await axios.post(
                    `${apiUrl}/api/product?userId=${JSON.parse(localStorage.getItem('userData')).userId}`,
                    JSON.stringify(requestData),
                    {
                        headers: {
                            'Content-Type': 'application/json', 
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                console.log("CreateProductResponse", CreateProductResponse);

                if (CreateProductResponse.status == 200) {
                    navigate("/userproduct");
                }
        }else{
            let updateProductResponse = await axios.put(
                `${apiUrl}/api/product/${requestData.productId}`,
                requestData,
                {
                    headers: {
                        'Content-Type': 'application/json', 
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if(updateProductResponse.status === 200){
                navigate("/userproduct");
            }
        }
    } catch (error) {
        console.log("error", error);
    }
};

const categories = ["Electronics", "Accessories", "Kitchen Appliances", "Computer Accessories", "Wearable Technology"];
const origins = ["South Korea", "China", "Italy", "USA", "Germany"];

    return (
        <div>
            <button onClick={() => navigate(-1)} className="button">Back</button>
            <div className="create-product-container">

                <h1>{localStorage.getItem("editId") === '' ? "Create New Product" : "Update Product"} </h1>

                <div className="form-group">
                    <label>Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="productName"
                        value={productData.productName}
                        onChange={handleInputChange}
                    />
                    {error.productName && <p className="text-danger">{error.productName}</p>}
                </div>
                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                    />
                    {error.price && <p className="text-danger">{error.price}</p>}
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={productData.description}
                        onChange={handleInputChange}
                    />
                    {error.description && <p className="text-danger">{error.description}</p>}
                </div>
                <div className="form-group">
                    <label>Category</label>
                    <select
                        className="form-control"
                        name="category"
                        value={productData.category}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                    {error.category && <p className="text-danger">{error.category}</p>}
                </div>
                <div className="form-group">
                    <label>Origin</label>
                    <select
                        className="form-control"
                        name="origin"
                        value={productData.origin}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Origin</option>
                        {origins.map((origin, index) => (
                            <option key={index} value={origin}>{origin}</option>
                        ))}
                    </select>
                    {error.origin && <p className="text-danger">{error.origin}</p>}
                </div>
                <div className="form-group">
                    <label>Quantity</label>
                    <input
                        type="number"
                        className="form-control"
                        name="quantity"
                        value={productData.quantity}
                        onChange={handleInputChange}
                    />
                    {error.quantity && <p className="text-danger">{error.quantity}</p>}
                </div>
                <div className="form-group">
                    <label>Image</label>
                    <input
                        type="file"
                        className="form-control"
                        name="coverImage"
                        onChange={handleFileChange}
                    />
                    {error.coverImage && <p className="text-danger">{error.coverImage}</p>}
                </div>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleCreateProduct}
                >
                    {localStorage.getItem("editId") === '' ? "Create" : "Update"}
                </button>
            </div>
        </div>
    );
};

export default CreateProduct;