
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { apiUrl } from '../app.config';

const EmployeeList= () => {

    const [employees, setEmployees] = useState([]);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false); // New state for logout popup
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortValue, setSortValue] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        // console.log(localStorage.getItem('token'));
       fun()
    }, [searchTerm, sortValue]);

    
async function fun() {
 try{
    let userResponse = await axios.get(apiUrl+'/api/users', {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      });
      

    // console.log(userResponse);
    userResponse = await userResponse.data.users

    console.log("userResponseline34",userResponse);

    let employeeResponse = await axios.get(
        `${apiUrl}/api/employee?searchValue=${searchTerm}&sortValue=${sortValue}`,
        {
            searchValue: searchTerm,
            sortValue: sortValue,
        }
        ,
        { headers: { Authorization: `${localStorage.getItem("token")}` } }
      );
    //   console.log("employeeResponse", employeeResponse);
      employeeResponse=employeeResponse.data.data

    console.log("employeeResponseonel47", employeeResponse);  

      employeeResponse.map((employee) => {
        userResponse.map((user) => {
            if (employee.userId === user.userId) {
                employee.userName = user.firstName + " " + user.lastName
                employee.userEmail = user.email
                employee.userPhone = user.mobileNumber
            }
        })
    })
    console.log("FinalemployeeResponse", employeeResponse);
    setEmployees(employeeResponse)

 }catch(error){
    console.log("error os ",error.message);
// navigate("/error")

}
    }

    const openPopup = (employee) => {
        setSelectedEmployee(employee)
        setShowPopup(true);
    };

    // console.log("selectedEmployee",selectedEmployee);

    const closePopup = () => {
        setSelectedEmployee(null);
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
        <div className={`EmployeeLists
         }`}>
            <button className='styledbutton' onClick={handleLogoutClick}>Logout</button>
            <h1>Available Employees</h1>
            {/* Search functionality */}
            <input
                className='searchBar'
                type="text"
                placeholder="Search by employee name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Table layout */}
            <table>
                <thead>
                    <tr>
                    <th>firstName</th>
                    <th>lastName</th>
                    <th>mobileNumber</th>
                    <th>mailID</th>
                    <th>dateOfBirth</th>
                    <th>age</th>
                    <th>education</th>
                    <th>gender</th>
                    <th>
                    experience
                        <div>
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
                </div>
                </th>
                    <th>Action</th>
            </tr>
                </thead>
                <tbody>
                    {employees.length?employees.map((employee) => (
                        <tr key={employee._id}>
                            <td>{employee.firstName}</td>
                            <td>{employee.lastName}</td>
                            <td>{employee.mobileNumber}</td>
                            <td>{employee.mailId}</td>
                            <td>{employee.dateOfBirth}</td>
                            <td>{employee.age}</td>
                            <td>{employee.education}</td>
                            <td>{employee.gender}</td>
                            <td>{employee.experience}</td>
                            <td>
                                <button onClick={() => openPopup(employee)}>View Info</button>
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
            {showPopup && selectedEmployee && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>
                        {/* <img src={doctorImage} alt="Doctor" style={{width: '100px', height: '100px'}} /> */}
                        <h2>{selectedEmployee.employee} Details</h2>
                        <p>Employee Name: {selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                        <p>Experience: {selectedEmployee.experience} years</p>
                        <p>MobileNumber: {selectedEmployee.mobileNumber} </p>
                        <p>Education: {selectedEmployee.education} </p>
                        <p>Gender: {selectedEmployee.gender} </p>
                        <p>Posted By: {selectedEmployee.userName}</p>
                        <p>Contact Email: {selectedEmployee.userEmail}</p>
                        <p>Contact Phone: {selectedEmployee.userPhone}</p>
                        
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

export default EmployeeList;

