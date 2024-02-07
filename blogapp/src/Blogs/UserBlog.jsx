import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../app.config";
import "./UserBlog.css";

const UserBlog = () => {

    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);
    const [blogToBeDeleted, setBlogToBeDeleted] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedBlog, setselectedBlog] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortValue, setSortValue] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("editId", "");
        console.log("cameeeeeeeeee");
        getBlogs();
    }, [searchTerm, sortValue]);

    async function getBlogs() {
        try {
            const token = localStorage.getItem("token");

            const blogResponse = await axios.get(
                apiUrl + `/api/blog/user/${JSON.parse(localStorage.getItem("userData")).userId}?searchValue=${searchTerm}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            if (blogResponse.status == 200) {
                setBlogs(blogResponse.data);
            }

        } catch (error) {
            console.log("error", error);
        }
    }

    const handleLogoutClick = () => {
        setShowLogoutPopup(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleDeleteClick = (id) => {
        setBlogToBeDeleted(id);
        setShowDeletePopup(true);
    };

    const handleViewClick = (blog) => {
        setselectedBlog(blog);
        setIsPopupVisible(true);
    };

    async function deleteBlog() {
        const blogId = blogToBeDeleted;
        try {
            const token = localStorage.getItem("token");

            const blogResponse = await axios.delete(
                apiUrl + `/api/blog/${blogId}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            if (blogResponse.status == 200) {
                setShowDeletePopup(false);
                getBlogs();
            }

        } catch (error) {
            console.log("error", error);
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
                onClick={() => navigate("/createblog")}
            >
                Add new Blog
            </button>
        </div>
        <div className={`BlogsList ${showDeletePopup || isPopupVisible && selectedBlog || showLogoutPopup ? "popup-open" : ""}`}>            
            <h1 style = {{marginLeft: "12%"}}>OUR BLOGS</h1>
            <input
                className="searchBar"
                type="text"
                placeholder="Search by blog title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="card-container">
                {blogs.length ? (
                    blogs?.map((blog) => (
                        <div className="card" key={blog.blogId}>
                            <img src={blog.coverImage} alt={blog.title} />
                            <div className="card-body">
                                <h3>{blog.title}</h3>
                                <p><strong>CONTENT:</strong> {blog.content}</p>
                                <p><strong>TAGS:</strong> {blog.tags.join(', ')}</p>
                                <div className="button-group">
                                <button
                                    className="styledbutton view-button"
                                    onClick={() => handleViewClick(blog)}
                                >
                                    View
                                </button>
                                <button
                                    className="styledbutton"
                                    onClick={() => {
                                        localStorage.setItem("editId", blog.blogId);
                                        navigate("/createblog");
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="styledbutton delete-button"
                                    onClick={() => handleDeleteClick(blog.blogId)}
                                >
                                    Delete
                                </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <h3>No Blog Found</h3>
                )}
            </div>
           
        </div>

        {isPopupVisible && selectedBlog && (
            <div className="delete-popup popup">
                <h3>{selectedBlog.title}</h3>
                <div className="info">
                    <div className="key">Content:</div>
                    <div className="value">{selectedBlog.content}</div>
                    </div>
                    <div className="info">
                    <div className="key">Tags:</div>
                    <div className="value">{selectedBlog.tags.join(', ')}</div>
                    </div>
                    <div className="info">
                    <div className="key">Date of Published:</div>
                    <div className="value">{selectedBlog.dateOfPublished}</div>
                    </div>
                    <div className="info">
                    <div className="key">Category</div>
                    <div className="value">{selectedBlog.category}</div>
                    </div>
                    <div className="info">
                    <div className="key">Country</div>
                    <div className="value">{selectedBlog.country}</div>
                    </div>

                <button onClick={() => setIsPopupVisible(false)}>Close</button>
            </div>
        )}

        {showDeletePopup && (
            <div className="delete-popup">
                <p>Are you sure you want to delete?</p>
                <button onClick={deleteBlog}>Yes, Delete</button>
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

export default UserBlog;