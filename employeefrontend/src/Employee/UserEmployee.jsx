import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserEmployee.css";
import axios from "axios";
import { apiUrl } from "../app.config";

const UserEmployee = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // New state for logout popup
  const [employeeToBeDelete, setEmployeeToBeDelete] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortValue, setSortValue] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("editId", "");
    console.log("came in grid");

    // console.log("useeeerrr",localStorage.getItem("userId"));
    fetchEmployees();
  }, [searchTerm, sortValue]);

  async function fetchEmployees() {
    try {
      const token = localStorage.getItem("token");
console.log("local",localStorage.getItem("userData"));
      const employeeResponse = await axios.get(
        apiUrl + `/api/employee/user/${JSON.parse(localStorage.getItem("userData")).userId}?searchValue=${searchTerm}`  ,
        // apiUrl + `/api/employee`  ,

        {
            headers: { Authorization: `${token}` ,
                'Content-Type': 'application/json'
        },
        }
      );
      console.log("employeeResponse", employeeResponse);

      if (employeeResponse.status == 200) {
        setEmployees(employeeResponse.data);
        console.log("came",employeeResponse.data);
      }
    } catch (error) {
        console.log(error);
    //   navigate("/error");
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
    setEmployeeToBeDelete(id);
    setShowDeletePopup(true);
  };

    const handleViewClick = (employee) => {
        setSelectedEmployee(employee);
        setIsPopupVisible(true);
    };

  async function deleteEmployee() {
    const employeeId = employeeToBeDelete;
    try {
      const token = localStorage.getItem("token");
      let deleteResponse = await axios.delete(
        apiUrl+`/api/employee/${employeeId}`,
        { headers: { Authorization: `${token}` } }
      );
      if (deleteResponse.status === 200) {
        fetchEmployees();
      }
      setShowDeletePopup(false);
    } catch(error) {
        console.log(error);
    //   navigate("/error");
    }
  }

return (
    <div>
        <div className="button-container">
        <button
                className="styledbutton"
                onClick={handleLogoutClick}
            >
                Logout
            </button>
            <button
                className="styledbutton"
                onClick={() => navigate("/createemployee")}
            >
                Add new Employee
            </button>
        </div>
        <div className={`EmployeesList ${showDeletePopup ? "popup-open" : ""}`}>
            
            <h1>Our Employees</h1>
            <input
                className="searchBar"
                type="text"
                placeholder="Search by employee name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="card-container">
                {employees.length ? (
                    employees?.map((employee) => (
                        <div className="card" key={employee.employeeId}>
                            <img src={employee.photo} alt={`${employee.firstName} ${employee.lastName}`} />
                            <div className="card-body">
                                <h3>{employee.firstName + " " + employee.lastName}</h3>
                                <p>Email: {employee.mailId}</p>
                                <p>Education: {employee.education}</p>
                                <p>Experience: {employee.experience}</p>
                                <div className="button-group">
                                <button
                                    className="styledbutton view-button"
                                    onClick={() => handleViewClick(employee)}
                                >
                                    View
                                </button>
                                <button
                                    className="styledbutton"
                                    onClick={() => {
                                        localStorage.setItem("editId", employee.employeeId);
                                        navigate("/createemployee");
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="styledbutton delete-button"
                                    onClick={() => handleDeleteClick(employee.employeeId)}
                                >
                                    Delete
                                </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <h3>No Employee Found</h3>
                )}
            </div>
           
        </div>

        {isPopupVisible && selectedEmployee && (
            <div className="popup">
                <h3>{selectedEmployee.firstName + " " + selectedEmployee.lastName}</h3>
                <div className="info">
                    <div className="key">Email:</div>
                    <div className="value">{selectedEmployee.mailId}</div>
                    </div>
                    <div className="info">
                    <div className="key">Mobile Number:</div>
                    <div className="value">{selectedEmployee.mobileNumber}</div>
                    </div>
                    <div className="info">
                    <div className="key">Date-Of-Birth:</div>
                    <div className="value">{selectedEmployee.dateOfBirth}</div>
                    </div>
                    <div className="info">
                    <div className="key">Age:</div>
                    <div className="value">{selectedEmployee.age}</div>
                    </div>
                    <div className="info">
                    <div className="key">Gender:</div>
                    <div className="value">{selectedEmployee.gender}</div>
                    </div>
                    <div className="info">
                    <div className="key">Education:</div>
                    <div className="value">{selectedEmployee.education}</div>
                    </div>
                    <div className="info">
                    <div className="key">Experience:</div>
                    <div className="value">{selectedEmployee.experience}</div>
                    </div>

                <button onClick={() => setIsPopupVisible(false)}>Close</button>
            </div>
        )}

        {showDeletePopup && (
            <div className="delete-popup">
                <p>Are you sure you want to delete?</p>
                <button onClick={deleteEmployee}>Yes, Delete</button>
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

export default UserEmployee;