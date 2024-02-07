import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserMovie.css";
import axios from "axios";
import { apiUrl } from "../app.config";

const UserMovie = () => {

    const [DeletePopup, setDeletePopup] = useState(false);
    const [LogoutPopup, setLogoutPopup] = useState(false);
    const [DeleteMovie, setDeleteMovie] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortValue, setSortValue] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("editId","");
        console.log("came in grid");
        fun();
    }, [searchTerm, sortValue]);

    async function fun() {
        try {
            const token = localStorage.getItem("token");
            console.log("asdfghjkkkkkkkk",token);
            console.log("locallllllllll",localStorage.getItem("userData"));

            console.log("inside function");
            const movieResponse = await axios.get(
                // apiUrl + `/api/movie`  ,
                apiUrl + `/api/movie/user/${JSON.parse(localStorage.getItem("userData")).userId}?searchValue=${searchTerm}`  ,
                { headers: { Authorization: `${token}`,
                "Content-Type": "application/json"
            }, }
            );
            console.log("movieResponse",movieResponse);
            if (movieResponse.status == 200) {
                setMovies(movieResponse.data);
            }
        } catch (error) {
            console.log("error", error);
            // navigate("/error");
        }
    }

    const handleLogoutClick = () => {  
        setLogoutPopup(true); // Show logout popup when logout is clicked
    };

    const handleLogout = () => {
        localStorage.clear(); // Clear local storage
        navigate("/login"); // Navigate to login
    };

    const handleDeleteClick = (id) => {
        setDeleteMovie(id);
        setDeletePopup(true);
    };

    const handleViewClick = (movie) => {
        setSelectedMovie(movie);
        setIsPopupVisible(true);
    };

    async function deletefunction() {
        const movieId = DeleteMovie;
        try {
            const token = localStorage.getItem("token");
            console.log("inside function");
            const movieResponse = await axios.delete(
                apiUrl + `/api/movie/${movieId}`,
                { headers: { Authorization: `${token}`,
                "Content-Type": "application/json"
            }, }
            );
            console.log("movieResponse",movieResponse);
            if (movieResponse.status == 200) {
                setDeletePopup(false);
                fun();
            }
        } catch (error) {
            console.log("error", error);
            // navigate("/error");
        }
    }


    return(
        <div>
            <div className={`MoviesList ${DeletePopup || isPopupVisible && selectedMovie || LogoutPopup ? "popup-open" : ""}`}>
                <button
                    className="styledbutton"
                    onClick={handleLogoutClick}
                >
                    Logout
                </button>
                <button
                    className="styledbutton"
                    onClick={() => navigate("/createmovie")}
                >
                    Create Movie
                </button>
                <h1>MOVIE LIST</h1>

                <input
                    className="searchBar"
                    type="text"
                    placeholder="Search by movie name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="card-container">
                    {movies.length ?(
                        movies.map((movie) => (
                            <div className="card" key={movie.movieId}>
                                <img src={movie.coverImage} alt={`${movie.movieName}`} />
                                <div className="card-body">
                                    <h3>{movie.movieName}</h3>
                                    <p>MovieType: {movie.movieType}</p>
                                    <p>ReleaseDate: {movie.showDate}</p>
                                    <div className="button-group">
                                        <button
                                            className="styledbutton view-button"
                                            onClick={() => handleViewClick(movie)}
                                        >
                                            View
                                        </button>
                                        <button
                                            className="styledbutton"
                                            onClick={() => {
                                                localStorage.setItem("editId", movie.movieId);
                                                navigate("/createmovie");
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="styledbutton delete-button"
                                            onClick={() => handleDeleteClick(movie.movieId)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h1>No Movies Found</h1>
                    )}
                    
            </div>
        </div>
    {isPopupVisible && selectedMovie && (
        <div className="popup">
            <h3>{selectedMovie.movieName}</h3>
            <div className="info">
                <div>
                    <img src={selectedMovie.coverImage} alt={`${selectedMovie.movieName}`} />
                </div>
                <div>
                    <p><strong>Movie Type: </strong>{selectedMovie.movieType}</p>
                    <p><strong>Show Date: </strong>{selectedMovie.showDate}</p>
                    <p><strong>Ticket Rate: </strong>{selectedMovie.ticketRate}</p>
                    <p><strong>Tickets Available: </strong>{selectedMovie.noOfTicketsAvailable}</p>
                </div>
            </div>
            <button onClick={() => setIsPopupVisible(false)}>Close</button>
        </div>
    )}
    {DeletePopup && (
        <div className="delete-popup">
          <p>Are you sure you want to delete?</p>
          <button onClick={deletefunction}>Yes, Delete</button>
          <button
            onClick={() => {
              setDeletePopup(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {LogoutPopup && (
            <div className="delete-popup">
                <p>Are you sure you want to logout?</p>
                <button onClick={handleLogout}>Yes, Logout</button>
                <button
                    onClick={() => {
                        setLogoutPopup(false);
                    }}
                >
                    Cancel
                </button>
            </div>
        )}

    </div>
    );
    };

export default UserMovie;
