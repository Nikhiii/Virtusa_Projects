import React, {useEffect,useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../app.config";
import "./CreateBlog.css";


const CreateBlog = () => {

    const navigate = useNavigate();
    const [blogData, setBlogData] = useState({
        title: "",
        content: "",
        tags: [],
        dateOfPublished: "",
        category: "",
        country: "",
        coverImage: null,
    });

    const [errors, setErrors] = useState({
        title: "",
        content: "",
        tags: "",
        dateOfPublished: "",
        category: "",
        country: "",
        coverImage: "",
    });

    useEffect(() => {
        const editId = localStorage.getItem("editId");
        if (editId !=='') {
            editfun();
        }
    }, []);

    async function editfun() {
        const token = localStorage.getItem("token");
        try {
            let response = await axios.get(
                apiUrl + `/api/blog/${localStorage.getItem("editId")}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            console.log("response", response);
            setBlogData(response.data);
        } catch (error) {
            console.log("error", error);
        }
    }

    const handleInputChange = (e) => {
        if (e.target.name === "tags") {
            const checked = e.target.checked;
            setBlogData(prevState => {
                if (checked) {
                    // Add tag to array
                    return { ...prevState, tags: [...prevState.tags, e.target.value] };
                } else {
                    // Remove tag from array
                    return { ...prevState, tags: prevState.tags.filter(tag => tag !== e.target.value) };
                }
            });
        } else {
            setBlogData({ ...blogData, [e.target.name]: e.target.value });
        }
        setErrors({ ...errors, [e.target.name]: "" });
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
            setBlogData({ ...blogData, coverImage: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleCreateBlog = async (e) => {
        const validationErrors = {};

        if(!blogData.title){
            validationErrors.title = "Title is required";
        }
        if(!blogData.content){
            validationErrors.content = "Content is required";
        }
        if(!blogData.tags.length){
            validationErrors.tags = "Tags is required";
        }
        if(!blogData.dateOfPublished){
            validationErrors.dateOfPublished = "Date of Published is required";
        }
        if(!blogData.category){
            validationErrors.category = "Category is required";
        }
        if(!blogData.country){
            validationErrors.country = "Country is required";
        }
        if(!blogData.coverImage){
            validationErrors.coverImage = "Cover Image is required";
        }

        console.log("validationErrors", validationErrors);

        if(Object.keys(validationErrors).length>0){
            setErrors(validationErrors);
            return;
        }

        blogData.userId = JSON.parse(localStorage.getItem("userData")).userId;

        try {
            const token = localStorage.getItem("token");
            const editId = localStorage.getItem("editId");

            if(editId === ''){
                blogData.userId = JSON.parse(localStorage.getItem("userData")).userId;
                const CreateBlogresponse = await axios.post(
                    apiUrl + "/api/blog",
                    blogData,
                    {
                        headers: {
                            Authorization: `${token}`,
                        },
                    }
                );
                if (CreateBlogresponse.status === 200) {
                    navigate("/userblog");
                }
        } else {
            let updateBlogResponse = await axios.put(
                apiUrl + `/api/blog/${localStorage.getItem("editId")}`,
                blogData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${token}`,
                    },
                }
            );
            if (updateBlogResponse.status === 200) {
                navigate("/userblog");
            }
        }
    } catch (error) {
        console.log("error", error);
    }
};

    const categories = ["Technology","Travel","Food & Cuisine","Health & Wellness","Environment & Sustainability","Art & Culture","Business & Finance","Science & Research","Education & Learning","Lifestyle & Entertainment"];
    const countries = ["United States","Canada","United Kingdom","Australia","India","Germany","Japan","France","Brazil","South Africa"];

    const tags = ["AI", "Technology", "Future", "Food", "Cooking", "Culture", "Travel", "Adventure", "Nature", "Music", "Jazz", "History", "Sustainability", "Environment", "Lifestyle"];

    


    return (
        <div>
            <button style={{marginLeft: "37%", marginTop: "10px", backgroundColor:"rgb(89, 111, 134)"}} onClick={() => navigate(-1)}>Back</button>
            <div className="create-employee-container">
                <h1>{localStorage.getItem("editId") === '' ? "Create New Blog" : "Update Blog"}</h1>

                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={blogData.title}
                        onChange={handleInputChange}
                    />
                    <span className="error-message">{errors.title}</span>
                </div>

                <div className="form-group">
                    <label>Content:</label>
                    <input
                        type="text"
                        name="content"
                        value={blogData.content}
                        onChange={handleInputChange}
                    />
                    <span className="error-message">{errors.content}</span>
                </div>

                <div className="form-group">
                    <label>Tags:</label>
                    <div className="tags-container">
                        {tags.map((tag, index) => (
                            <div key={index} className="tag-checkbox">
                                <input
                                    type="checkbox"
                                    name="tags"
                                    value={tag}
                                    checked={blogData.tags.includes(tag)}
                                    onChange={handleInputChange}
                                />
                                <label>{tag}</label>
                            </div>
                        ))}
                    </div>
                    <span className="error-message">{errors.tags}</span>
                </div>


                <div className="form-group">
                    <label>Date of Published:</label>
                    <input
                        type="date"
                        name="dateOfPublished"
                        value={blogData.dateOfPublished}
                        onChange={handleInputChange}
                    />
                    <span className="error-message">{errors.dateOfPublished}</span>
                </div>

                <div className="form-group">
                    <label>Category:</label>
                    <select name="category" value={blogData.category} onChange={handleInputChange}>
                        <option value="">Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <span className="error-message">{errors.category}</span>
                </div>
                
                <div className="form-group">
                    <label>Country:</label>
                    <select name="country" value={blogData.country} onChange={handleInputChange}>
                        <option value="">Select Country</option>
                        {countries.map((country, index) => (
                            <option key={index} value={country}>
                                {country}
                            </option>
                        ))}
                    </select>
                    <span className="error-message">{errors.country}</span>
                </div>
                

                <div className="form-group">
                    <label>Cover Image:</label>
                    <input
                        type="file"
                        name="coverImage"
                        onChange={handleFileChange}
                    />
                    <span className="error-message">{errors.coverImage}</span>
                </div>

                <button className="submit-button" type="button" style={{margin:"auto"}} onClick={handleCreateBlog}>
                    {localStorage.getItem("editId") === '' ? "Create Blog" : "Update Blog"}
                </button>
            </div>
        </div>
    );


};

export default CreateBlog;
