import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../apiconfig';
import './CreateDoctor.css';

const CreateDoctor = () => {
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    experience: '',
    location: '',
    availability: [],
    photo:null
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    specialization: '',
    experience: '',
    location: '',
    availability: '',
    photo:''
  });

  useEffect(() => {
    const editId = localStorage.getItem('editId');
    console.log('editIddddddddd', editId);
    if(editId !== '') {
      editfun();
  }
  }, []);

  async function editfun() {
    const token = localStorage.getItem('token');
    try {
      let response = await axios.get(
        `${apiUrl}/api/doctor/${localStorage.getItem('editId')}`,
      { headers: { Authorization: `${token}` } }
    );
      setProductData(response.data);
    } catch (error) {
      navigate('/error');
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
    }
  };

  const convertFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductData({ ...productData, photo: reader.result });
    };
    reader.readAsDataURL(file);   
  };

  const handleCreateDoctor = async () => {
    const validationErrors = {};

    if (!productData.firstName.trim()) {
      validationErrors.firstName = 'First name is required';
    }
    if(productData.lastName=="")
    {
      validationErrors.lastName="lastName is required"
    }
    if(productData.availability=="")
    {
      validationErrors.availability="availability is required"
    }
    if(productData.location=="")
    {
      validationErrors.location="location is required"
    }
    if(productData.experience=="")
    {
      validationErrors.experience="experience is required"
    }
    if(productData.specialization=="")
    {
      validationErrors.specialization="specialization is required"
    }
    if (productData.photo == null) {
      validationErrors.photo = "Photo is required";
    }

    console.log("validationErrors",validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    productData.userId= JSON.parse(localStorage.getItem("userData")).userId;
    console.log("productData",productData);

    try {
      const token = localStorage.getItem("token");
      const editId = localStorage.getItem('editId');

      if (editId === '') {
        productData.userId= JSON.parse(localStorage.getItem("userData")).userId
        console.log("productData",productData);
        let createDoctorResponse = await axios.post(
          `${apiUrl}/api/doctor`,
          productData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`
            }
          }
        );

        if (createDoctorResponse.status == 200) {
          navigate('/userdoctor');
        }
      } else {
        let updateDoctorResponse = await axios.put(
          `${apiUrl}/api/doctor/${localStorage.getItem('editId')}`,
          productData,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`
            }
          }
        );

        if (updateDoctorResponse.status == 200) {
          navigate('/userdoctor');
        }
      }
    } catch (error) {
      console.log('error', error);
      // navigate('/error');
    }
  };
  const handleAvailabilityChange = (e, day) => {
    const { checked } = e.target;
    let updatedAvailability = [...productData.availability];
  
    if (checked && !updatedAvailability.includes(day)) {
      updatedAvailability = [...updatedAvailability, day];
    } else if (!checked && updatedAvailability.includes(day)) {
      updatedAvailability = updatedAvailability.filter((d) => d !== day);
    }
  
    setProductData({
      ...productData,
      availability: updatedAvailability
    });
  };
  
  return (
    <div className="create-product-container">
      <button onClick={() => navigate(-1)}>Back</button>

      {localStorage.getItem('editId') === '' ? (
        <h2>Create New Doctor</h2>
      ) : (
        <h2>Update Doctor</h2>
      )}

      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={productData.firstName}
          onChange={handleInputChange}
        />
        <span className="error-message">{errors.firstName}</span>
      </div>

<div className="form-group">
  <label>Last Name:</label>
  <input
    type="text"
    name="lastName"
    value={productData.lastName}
    onChange={handleInputChange}
  />
  <span className="error-message">{errors.lastName}</span>
</div>

<div className="form-group">
  <label>Specialization:</label>
  <input
    type="text"
    name="specialization"
    value={productData.specialization}
    onChange={handleInputChange}
  />
  <span className="error-message">{errors.specialization}</span>
</div>

<div className="form-group">
  <label>Experience:</label>
  <input
    type="text"
    name="experience"
    value={productData.experience}
    onChange={handleInputChange}
  />
  <span className="error-message">{errors.experience}</span>
</div>

<div className="form-group">
  <label>Location:</label>
  <input
    type="text"
    name="location"
    value={productData.location}
    onChange={handleInputChange}
  />
  <span className="error-message">{errors.location}</span>
</div>

{/* Assuming availability is a multi-select or checkbox */}
<div className="form-group">
  <label>Availability:</label>

  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
    <div key={day}>
      <input
        type="checkbox"
        name="availability"
        value={day}
        checked={productData.availability.includes(day)}
        onChange={(e) => handleAvailabilityChange(e, day)}
      />
      <label>{day}</label>
    </div>
  ))}
  <span className="error-message">{errors.availability}</span>
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

      
      <button className="submit-button" type="button" onClick={handleCreateDoctor}>
        {localStorage.getItem('editId') === '' ? 'Create Doctor' : 'Update Doctor'}
      </button>
    </div>
  );
};

export default CreateDoctor;