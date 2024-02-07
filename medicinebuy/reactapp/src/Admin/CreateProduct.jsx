// CreateProduct.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreateProduct.css";
import axios from 'axios';
import { apiUrl } from '../apiconfig';

const CreateProduct = () => {
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    product: '',
    price: '',
    description: '',
    expiryDate: '',
    category: '',
    manufacturer: '',
    photo: null,
  });

  const [errors, setErrors] = useState({
    product: '',
    price: '',
    description: '',
    expiryDate: '',
    category: '',
    manufacturer: '',
    photo:''
  });

  useEffect(() => {
    const editId = localStorage.getItem("editId");
    console.log("editId", editId);
    if (editId) {
      editfun();
    }
  }, []);
  

async function editfun(){ 
  const token = localStorage.getItem("token");
  try{
    let response=await axios.get(
      `${apiUrl}/api/medicine/${localStorage.getItem('editId')}`,
      { 
        headers: { 
          Authorization: `${token}` 
      }}
      );
      setProductData(response.data);
  }
  catch(error){
    console.log("error",error);
    navigate("/error")
  }
}

  const handleInputChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      convertFileToBase64(file);
      setErrors({ ...errors, photo: '' });
    } else {
      setErrors({ ...errors, photo: 'Photo is required' });
    }
  };

  const convertFileToBase64 = (file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          setProductData({ ...productData, photo: reader.result });
      };
      reader.readAsDataURL(file);
  };

  const handleCreateProduct = async() => {
    // Validate the form before submitting
    const validationErrors = {};
   
    if(productData.price=="")
    {
      validationErrors.price="Price is required"
    }
    if(productData.expiryDate=="")
    {
      validationErrors.expiryDate="ExpiryDate is required"
    }
    if(productData.description=="")
    {
      validationErrors.description="Description is required"
    }
    if(productData.category=="")
    {
      validationErrors.category="Category is required"
    }
    if(productData.manufacturer=="")
    {
      validationErrors.manufacturer="Manufacturer is required"
    }
    if(productData.product=="")
    {
      validationErrors.product="Product is required"
    }
    if(productData.photo==null)
    {
      validationErrors.photo="Photo is required"
    }

    console.log("validationErrors",validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Rest of the code remains the same
    // ...
    // productData.imageUrl= "./assets/"+productData.product+".png"
    //productData.imageurl= "./assets/demo.jpg"
    productData.userId=JSON.parse(localStorage.getItem("userData")).userId;

    console.log("productData", productData);
try{
  const token = localStorage.getItem("token");
  const editId=localStorage.getItem("editId")
  if(editId === '')
  {
    productData.userId = JSON.parse(localStorage.getItem("userData")).userId;

    let createProductRespose=await axios.post(apiUrl+"/api/medicine", productData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`
      },

    });
  
    if(createProductRespose.status == 200){
      navigate("/userproducts")
    }
  }else{

    let updateProduct=await axios.put( `${apiUrl}/api/medicine/${localStorage.getItem('editId')}`, productData,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`

      }
    })
  
    if(updateProduct.status == 200){
      navigate("/userproducts")
    }
  }
}
    catch(error){
      console.log("error",error);
      navigate("/error")
    }


  };
  const antibioticsArray = ['Amoxicillin', 'Ciprofloxacin', 'Clindamycin', 'Metronidazole', 'Azithromycin'];
  const painkillersArray = ['Ibuprofen', 'Aspirin', 'Paracetamol'];
  const antisepticsArray = ['Chlorhexidine', 'Hydrogen peroxide'];
  const antifungalsArray = ['Clotrimazole', 'Miconazole'];
  const productCategories = {
    "Antibiotics": antibioticsArray,
    "Painkillers": painkillersArray,
    "Antiseptics": antisepticsArray,
    "Antifungals": antifungalsArray
 
  };
 
   const manufactureOptions = ["Sun Pharma", "Cipla", "Lupin", "Aurobindo", "Dr. Reddy's", "Cadila", "Torrent Pharma", "Glenmark", "Alkem Labs", "Mankind Pharma", "Abbott India", "Biocon", "Pfizer", "Sanofi India", "Ipca Labs", "Intas Pharma", "Suven Life"];

  return (
    <div className="create-product-container">
      <button onClick={() => navigate(-1)}>Back</button>

      {localStorage.getItem("editId")==""? <h2>Create New Product</h2>:<h2>Update Product</h2>}
      <div className="form-group">
        <label >Category:</label>
        <select
          name="category"
          value={productData.category}
          onChange={handleInputChange}
        >
          <option value="" disabled>Select a category</option>

          {Object.keys(productCategories).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <span className="error-message">{errors.category}</span>
      </div>
      <div className="form-group">
        <label>Product:</label>
        <select
          name="product"
          value={productData.product}
          onChange={handleInputChange}
        >
          <option value="" disabled>Select a product</option>
          {productData.category && productCategories[productData.category].map((product) => (
            <option key={product} value={product}>
              {product}
            </option>
          ))}
        </select>
        <span className="error-message">{errors.product}</span>
      </div>
      <div className="form-group">
        <label>Price:</label>
        <input
          type="text"
          name="price"
          value={productData.price}
          onChange={handleInputChange}
        />
        <span className="error-message">{errors.price}</span>
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea
          name="description"
          value={productData.description}
          onChange={handleInputChange}
        />
        <span className="error-message">{errors.description}</span>
      </div>

      <div className="form-group">
        <label>Manufacturer:</label>
        <select
          name="manufacturer"
          value={productData.manufacturer}
          onChange={handleInputChange}
        >
          <option value="" disabled>Select a manufacturer</option>
          {manufactureOptions.map((manufacturer) => (
            <option key={manufacturer} value={manufacturer}>
              {manufacturer}
            </option>
          ))}
        </select>
        <span className="error-message">{errors.manufacturer}</span>
      </div>
      <div className="form-group">
        <label>Expiry Date:</label>
        <input
          type="date"
          name="expiryDate"
          value={productData.expiryDate}
          onChange={handleInputChange}
        />
        <span className="error-message">{errors.expiryDate}</span>
      </div>

      <div className="form-group">
        <label>Photo:</label>
        <input
          type="file"
          name="photo"
          onChange={handleFileChange}
        />
        <span className="error-message">{errors.photo}</span>
      </div>
      
      <button className='submit-button' type="button" onClick={handleCreateProduct}>
      {localStorage.getItem("editId")==""?"Create Medicine":"Update Medicine"}
      </button>
    </div>
  );
};

export default CreateProduct;