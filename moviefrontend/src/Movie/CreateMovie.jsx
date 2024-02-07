import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../app.config';
import './CreateMovie.css';

const CreateMovie = () => {
    const navigate = useNavigate();

    const [movieData, setMovieData] = useState({
        movieName: '',
        movieType: '',
        noOfTicketsAvailable: 0,
        ticketRate: 0,
        showDate: '',
        showTime: '',
        coverImage: null,
    });

    const [errors, setErrors] = useState({
        movieName: '',
        movieType: '',
        noOfTicketsAvailable: '',
        ticketRate: '',
        showDate: '',
        showTime: '',
        coverImage: '',
    });

    useEffect(() => {
        const editId = localStorage.getItem('editId');
        if (editId !== '') {
            editfun();
        }
    }, []);

    async function editfun() {
        const token = localStorage.getItem('token');
        try {
            let response = await axios.get(`${apiUrl}/api/movie/${localStorage.getItem('editId')}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            console.log('response', response.data);
            setMovieData(response.data);
        } catch (error) {
            navigate('/error');
        }
    }

    const handleInputChange = (e) => {
        let value = e.target.value;

        // Convert to number if the field is 'noOfTicketsAvailable' or 'ticketRate'
        if (e.target.name === 'noOfTicketsAvailable' || e.target.name === 'ticketRate') {
            value = Number(value);
        }

        setMovieData({ ...movieData, [e.target.name]: value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            convertFileToBase64(file);
            setErrors({ ...errors, coverImage: '' });
        }
    };

    const convertFileToBase64 = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setMovieData({ ...movieData, coverImage: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const handleCreateMovie = async () => {
        const validationErrors = {};

        if (!movieData.movieName) {
            validationErrors.movieName = 'Movie Name is required';
        }
        if (!movieData.movieType) {
            validationErrors.movieType = 'Movie Type is required';
        }
        if (!movieData.noOfTicketsAvailable) {
            validationErrors.noOfTicketsAvailable = 'Seats is required';
        }
        if (!movieData.ticketRate) {
            validationErrors.ticketRate = 'Ticket Rate is required';
        }
        if (!movieData.showDate) {
            validationErrors.showDate = 'Release Date is required';
        }
        if (!movieData.showTime) {
            validationErrors.showTime = 'Show Time is required';
        }
        if (!movieData.coverImage) {
            validationErrors.coverImage = 'Cover Image is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // movieData.userId = JSON.parse(localStorage.getItem('userData')).userId;
        // movieData.showTime = `${movieData.showTime}:00`;

        // console.log('movieData', movieData);

        try {
            const token = localStorage.getItem('token');
            const editId = localStorage.getItem('editId');

            const requestData = {...movieData};

            if(editId === '') {
                requestData.showTime = `${requestData.showTime}:00`;
            }

            if (editId === '') {
                  // Append ':00' to showTime to make it in 'HH:mm:ss' format
            // movieData.showTime = `${movieData.showTime}:00`;

                let response = await axios.post(
                    `${apiUrl}/api/movie?userId=${JSON.parse(localStorage.getItem('userData')).userId}`,
                    JSON.stringify(requestData),
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );
                console.log('response', response.data);
                if (response.status === 200) {
                    navigate('/usermovie');
                }
            } else {
                let updateresponse = await axios.put(
                    `${apiUrl}/api/movie/${requestData.movieId}`,
                    requestData,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                console.log('response', updateresponse.data);
                if (updateresponse.status === 200) {
                    navigate('/usermovie');
                }
            }
        } catch (error) {
            console.log('error', error);
            navigate('/error');
        }
    };

    return (
        <div>
            <button className="btn btn-primary" onClick={() => navigate(-1)}>
                Back
            </button>
            {localStorage.getItem('editId') === '' ? (
                <h2>Create Movie</h2>
            ) : (
                <h2>Update Movie</h2>
            )}

            <div className="movie-form-container">
            <div className="form-group">
                 <label>Movie Name</label>
                <input
                    type="text"
                    name="movieName"
                    value={movieData.movieName}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <span className="error">{errors.movieName}</span>
            </div>
            <div className="form-group">
                <label>Movie Type</label>
                <input
                    type="text"
                    name="movieType"
                    value={movieData.movieType}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <span className="error">{errors.movieType}</span>
            </div>
            <div className="form-group">
                <label>No Of Tickets Required</label>
                <input
                    type="number"
                    name="noOfTicketsAvailable"
                    value={movieData.noOfTicketsAvailable}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <span className="error">{errors.noOfTicketsAvailable}</span>
            </div>
            <div className="form-group">
                <label>Ticket Rate</label>
                <input
                    type="number"
                    name="ticketRate"
                    value={movieData.ticketRate}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <span className="error">{errors.ticketRate}</span>
            </div>
            <div className="form-group">
                <label>Show Date</label>
                <input
                    type="date"
                    name="showDate"
                    value={movieData.showDate}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <span className="error">{errors.showDate}</span>
            </div>
            <div className="form-group">
                <label>Show Time</label>
                <input
                    type="time"
                    name="showTime"
                    value={movieData.showTime}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <span className="error">{errors.showTime}</span>
            </div>
            <div>
                <span className="error">{errors.releaseDate}</span>
            </div>
            <div className="form-group">
                <label>Cover Image</label>
                <input
                    type="file"
                    name="coverImage"
                    onChange={handleFileChange}
                />
            </div>
            <div>
                <span className="error">{errors.coverImage}</span>
            </div>
                <button className="submit-button" type="button" onClick={handleCreateMovie}>
                    {localStorage.getItem('editId') === '' ? 'Create Movie' : 'Update Movie'}
                </button>
            </div>
        </div>
    );
};

export default CreateMovie;
