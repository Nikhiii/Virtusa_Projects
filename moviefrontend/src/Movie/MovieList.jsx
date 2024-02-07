import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../app.config";
import "./MovieList.css";

const MoviesList = () => {

    const [movies, setMovies] = useState([]);
    const [showLogoutPopup, setShowLogoutPopup] = useState(false); // New state for logout popup
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortValue, setSortValue] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        // console.log(localStorage.getItem('token'));
        fun()
    }, [searchTerm, sortValue]);

    async function fun() {
        try {
            let userResponse = await axios.get(apiUrl + '/api/users', {
                headers: { Authorization: `${localStorage.getItem("token")}` },
            });
            // console.log("aaaaaaaaaaaaaa", userResponse);

            userResponse = await userResponse.data
            console.log("userResponseeeeeee", userResponse);

            let movieResponse = await axios.get(
                `${apiUrl}/api/movies?sortOrder=${sortValue}&searchValue=${searchTerm}`,
                { headers: { Authorization: `${localStorage.getItem("token")}` } }
            );
            movieResponse = movieResponse.data
            console.log("movieResponseoneeeeee", movieResponse);

            movieResponse.map((movie) => {
                userResponse.map((user) => {
                    if (movie.userId === user.userId) {
                        movie.userName = user.firstName + " " + user.lastName
                        movie.userEmail = user.email
                        movie.userPhone = user.mobileNumber
                    }
                })
            })
            console.log("FinalemovieResponse", movieResponse);
            setMovies(movieResponse)

        } catch (error) {
            console.log("error os ", error.message);
            navigate("/error")
        }

    }
    const openPopup = (movie) => {
        setSelectedMovie(movie);
        setShowPopup(true);
    }

    const closePopup = () => {
        setSelectedMovie(null);
        setShowPopup(false);
    }
    const handleLogoutClick = () => {  
        setShowLogoutPopup(true); // Show logout popup when logout is clicked
    };

    const handleLogout = () => {
       localStorage.clear();
         navigate("/login");
    }

    return(
        <div className={`MovieLists`}>
            <button className="styledbutton" onClick={handleLogoutClick}>Logout</button>
            <h1>Movie List</h1>

            <div className="search">
                <input type="text" placeholder="Search..." onChange={(e) => { setSearchTerm(e.target.value) }} />
                <select onChange={(e) => { setSortValue(e.target.value) }}>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            <div className="movie-container">
                <table>
                    <thead>
                        <tr>
                            <th>Movie Name</th>
                            <th>Genre</th>
                            <th>Rating</th>
                            <th>Release Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie) => (
                           <tr key={movie.movieId}>
                           <td>{movie.movieName}</td>
                           <td>{movie.movieType}</td>
                           <td>{movie.ticketRate}</td>
                           <td>{movie.showDate}</td>
                           <td>
                                    <button style={{ marginRight: '31%' }} className="styledbutton" onClick={() => openPopup(movie)}>View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    
                </table>
      
            </div>
            {showPopup && selectedMovie && (
                <div className="popup">
                    <div className="content">
                        <h2>{selectedMovie.movieName}</h2>
                        <p><strong>Movie Type: </strong>{selectedMovie.movieType}</p>
                        <p><strong>Tickets Available: </strong>{selectedMovie.noOfTicketsAvailable}</p>
                        <p><strong>Ticket Rate: </strong>{selectedMovie.ticketRate}</p>
                        <p><strong>Show Date: </strong>{selectedMovie.showDate}</p>
                        <p><strong>Show Time: </strong>{selectedMovie.showTime}</p>

                        <p><strong>Posted By: </strong>{selectedMovie.userName}</p>
                        <p><strong>Email: </strong>{selectedMovie.userEmail}</p>
                        <p><strong>Contact No: </strong>{selectedMovie.userPhone}</p>
                        <button className="styledbutton" onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}

            {showLogoutPopup && (
                <div className="delete-popup">
                    
                    <div className="content">
                        <h2>Are you sure you want to logout?</h2>
                        <button className="styledbutton" onClick={handleLogout}>Yes</button>
                        <button className="styledbutton" onClick={() => setShowLogoutPopup(false)}>No</button>
                    </div>
        </div>
    )}
    </div>
    );


}

export default MoviesList;