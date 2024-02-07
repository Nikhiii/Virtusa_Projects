import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { apiUrl } from "../app.config";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import './Login.css';


function Login() {
    const navigate = useNavigate();
    const{
        register,
        handleSubmit,
        setError,
        formState: { errors },
    }=useForm();

    useEffect(() => {
        localStorage.clear();
    }
    , []);
    const onSubmit = async (formData) => {
        try {
            const response = await axios.post(
                apiUrl+"/api/auth/login",
                formData
            );
            if(response.status == 200){
               if(response.data.message == "Invalid Credentials"){
                     setError("password", {
                        type: "manual", 
                        message: "Invalid Credentials"
                    });
            }else{
                const user = response.data;
                console.log("user",user);
                console.log("response.data",response.data);
                localStorage.setItem("token", response.data.token);
                // localStorage.setItem("userId", user._id);
           
                let userData = {
                    role: user.role,
                    userId: user.userId,
                    userName: user.firstName + " " + user.lastName,
                };

                console.log("userData",userData);
                localStorage.setItem("userData", JSON.stringify(userData));
                if(user.role == "Admin"){
                    navigate("/useremployee");
            }else {
                navigate("/employeelist");
            }
        }
    }
        }catch (error) {
          console.log("error",error);
            // navigate("/error");
        }
    };
    return (
        <div className="login-container">
      <div className="login-wrapper">
        <div className="login-left">
          <div className="login-box">
            <h2>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <div className="error">{errors.email.message}</div>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
              </div>
              <div>
              {errors.password && (
                  <div className="error">{errors.password.message}</div>
                )}
              </div>
              
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
            <div className="signup-link">
              Don't have an account? <Link to="/register">Signup</Link>
            </div>
          </div>
        </div>
        <div className="login-right">
         <h1>Employee Directory</h1>
         <h2>Find Your Employee</h2>
       </div>
      </div>
    </div>

    );
}

export default Login;