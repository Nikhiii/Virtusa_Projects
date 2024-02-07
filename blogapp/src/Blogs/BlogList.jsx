import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../app.config";
import "./BlogList.css";

const BlogList = () => {

    const [blogs, setBlogs] = useState([]);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [selectedBlog, setselectedBlog] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortValue, setSortValue] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        getBlogs();
    }, [searchTerm, sortValue]);

    async function getBlogs(){
        try{
            let userResponse = await axios.get( apiUrl + `/api/users`, {
                headers: {
                    Authorization: `${localStorage.getItem("token")}`,
                },
            })
            userResponse = await userResponse.data
            console.log("userResponse", userResponse);

            let blogResponse = await axios.get(
                apiUrl + `/api/blog?searchValue=${searchTerm}&sortValue=${sortValue}`, {
                headers: {
                    Authorization: `${localStorage.getItem("token")}`,
                },
            });
            console.log("blogResponse", blogResponse);

            blogResponse = blogResponse.data;
            console.log("blogResponse", blogResponse);
            blogResponse.map((blog) => {
                userResponse.map((user) => {
                    if(blog.userId === user.userId){
                        blog.userName = user.firstName + " " + user.lastName;
                        blog.userEmail = user.email;
                        blog.userPhone = user.mobileNumber;
                    }
            });
        })
        console.log("blogresponseee",blogResponse);
        blogResponse.sort((a, b) => {
            const dateA = new Date(a.dateOfPublished);
            const dateB = new Date(b.dateOfPublished);
            return sortValue * dateA.getTime() - dateB.getTime();
        });

        setBlogs(blogResponse)
    } catch(error){
        console.log("error", error);
        navigate("/error")
    }
}
    const openPopup = (blog) => {
        setselectedBlog(blog);
        setShowPopup(true);
    }

    const closePopup = () => {
        setselectedBlog(null);
        setShowPopup(false);
    }

    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };


    return (
        <div className="create-employee-container">
            <button className='styledbutton' onClick={handleLogoutClick}>Logout</button>
            <h1>Blog List</h1>

            <div className="search-sort-container">
                <input
                    className='searchbar'
                    type="text"
                    placeholder="Search by blog title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={sortValue} onChange={(e) => setSortValue(e.target.value)}>
                    <option value="1">Newest First</option>
                    <option value="-1">Oldest First</option>
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Date Published</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {blogs.length ? blogs.map((blog) => (
                        <tr key={blog._id}>
                            <td>{blog.title}</td>
                            <td>{blog.content}</td>
                            <td>{blog.dateOfPublished}</td>
                            <td>
                                <button onClick={() => openPopup(blog)}>View Info</button>
                            </td>
                        </tr>
                    )) : (
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

            {showPopup && selectedBlog && (
                <div className="popup">
                    <div className="popup-content">
                        <span className="close" onClick={closePopup}>&times;</span>

                        <h2>{selectedBlog.title} Details</h2>
                        <p><strong>Content: </strong> {selectedBlog.content}</p>
                        <p><strong>Tags: </strong> {selectedBlog.tags}</p>
                        <p><strong>Date Published: </strong> {selectedBlog.dateOfPublished}</p>
                        <p><strong>Category: </strong> {selectedBlog.category}</p>
                        <p><strong>Country: </strong> {selectedBlog.country}</p>
                        <p><strong>Posted By: </strong>{selectedBlog.userName}</p>
                        <p><strong>Contact Email: </strong>{selectedBlog.userEmail}</p>
                        <p><strong>Contact Phone: </strong>{selectedBlog.userPhone}</p>
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

export default BlogList;