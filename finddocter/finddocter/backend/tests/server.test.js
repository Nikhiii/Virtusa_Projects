const userController = require('../controllers/userController');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const { getAllDoctors, addDoctor, updateDoctor, getDoctorByUserId, getDoctorById, deleteDoctor } = require('../controllers/doctorController');
const mongoose = require('mongoose');
const { validateToken } = require('../authUtils');


describe('getAllDoctors_Controller', () => {
  test('getalldoctors_should_return_doctors_with_a_200_status_code', async () => {
    // Sample doctors data
    const doctorsData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        specialization: 'Cardiologist',
        location: 'City Hospital',
        experience: 10,
        availability: ['Monday', 'Wednesday', 'Friday'],
        userId: new mongoose.Types.ObjectId(),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        specialization: 'Pediatrician',
        location: 'Children Hospital',
        experience: 8,
        availability: ['Tuesday', 'Thursday'],
        userId: new mongoose.Types.ObjectId(),
      },
    ];

    // Mock Express request and response objects
    const req = {
      body: { sortValue: 1, searchValue: 'John' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Doctor.find method to resolve with the sample doctors data
    const doctorQuery = {
      sort: jest.fn().mockResolvedValue(doctorsData), // Mocking the sort function
    };
    Doctor.find = jest.fn().mockReturnValue(doctorQuery);

    // Call the controller function
    await getAllDoctors(req, res);

    // Assertions
    expect(Doctor.find).toHaveBeenCalledWith({ firstName: new RegExp('John', 'i') });
    expect(doctorQuery.sort).toHaveBeenCalledWith({ experience: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ doctors: doctorsData });
  });

  test('getalldoctors_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Doctor.find
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = {
      body: { sortValue: 1, searchValue: 'John' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Doctor.find method to reject with an error
    const doctorQuery = {
      sort: jest.fn().mockRejectedValue(error), // Mocking the sort function with error
    };
    Doctor.find = jest.fn().mockReturnValue(doctorQuery);

    // Call the controller function
    await getAllDoctors(req, res);
    // Assertions
    expect(Doctor.find).toHaveBeenCalledWith({ firstName: new RegExp('John', 'i') });
    expect(doctorQuery.sort).toHaveBeenCalledWith({ experience: 1 });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('addDoctor_Controller', () => {
  test('adddoctor_should_add_a_doctor_and_respond_with_a_200_status_code_and_success_message', async () => {
    // Sample doctor data to be added
    const doctorToAdd = {
      firstName: 'New',
      lastName: 'Doctor',
      specialization: 'New Specialization',
      location: 'New Hospital',
      experience: 3,
      availability: ['Monday', 'Wednesday'],
      userId: new mongoose.Types.ObjectId(),
    };

    // Mock the Doctor.create method to resolve successfully
    Doctor.create = jest.fn().mockResolvedValue(doctorToAdd);

    // Mock Express request and response objects
    const req = { body: doctorToAdd };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await addDoctor(req, res);

    // Assertions
    expect(Doctor.create).toHaveBeenCalledWith(doctorToAdd);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Docter added Successfully' });
  });

  test('adddoctor_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Doctor.create
    const error = new Error('Database error');

    // Mock the Doctor.create method to reject with an error
    Doctor.create = jest.fn().mockRejectedValue(error);

    // Mock Express request and response objects
    const req = { body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await addDoctor(req, res);

    // Assertions
    expect(Doctor.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('updateDoctor_Controller', () => {
  test('updatedoctor_should_update_doctor_and_respond_with_a_200_status_code_and_success_message', async () => {
    // Sample doctor ID and updated doctor data
    const doctorId = new mongoose.Types.ObjectId();
    const updatedDoctorData = {
      firstName: 'Updated',
      lastName: 'Doctor',
      specialization: 'Updated Specialization',
      location: 'Updated Hospital',
      experience: 15,
      availability: ['Monday', 'Wednesday', 'Friday'],
      userId: new mongoose.Types.ObjectId(),
    };

    // Mock Express request and response objects
    const req = { params: { id: doctorId }, body: updatedDoctorData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Doctor.findByIdAndUpdate method to resolve with the updated doctor data
    Doctor.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedDoctorData);

    // Call the controller function
    await updateDoctor(req, res);

    // Assertions
    expect(Doctor.findByIdAndUpdate).toHaveBeenCalledWith(doctorId, updatedDoctorData, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Doctor Updated Successfully' });
  });

  test('updatedoctor_should_handle_not_finding_a_doctor_and_respond_with_a_404_status_code', async () => {
    // Mock Express request and response objects
    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Doctor.findByIdAndUpdate method to resolve with null (doctor not found)
    Doctor.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await updateDoctor(req, res);

    // Assertions
    expect(Doctor.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, {}, { new: true });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Doctor not found' });
  });

  test('updatedoctor_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Doctor.findByIdAndUpdate
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Doctor.findByIdAndUpdate method to reject with an error
    Doctor.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await updateDoctor(req, res);

    // Assertions
    expect(Doctor.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, {}, { new: true });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('deleteDoctor_Controller', () => {
  test('deletedoctor_should_delete_doctor_and_respond_with_a_200_status_code_and_success_message', async () => {
    // Sample doctor ID to be deleted
    const doctorId = new mongoose.Types.ObjectId();

    // Mock Express request and response objects
    const req = { params: { id: doctorId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Doctor.findByIdAndDelete method to resolve with the deleted doctor data
    Doctor.findByIdAndDelete = jest.fn().mockResolvedValue({
      _id: doctorId,
      firstName: 'Deleted',
      lastName: 'Doctor',
      specialization: 'Deleted Specialization',
      location: 'Deleted Hospital',
      experience: 10,
      availability: ['Monday', 'Wednesday', 'Friday'],
      userId: new mongoose.Types.ObjectId(),
    });

    // Call the controller function
    await deleteDoctor(req, res);

    // Assertions
    expect(Doctor.findByIdAndDelete).toHaveBeenCalledWith(doctorId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Doctor Deleted Successfully' });
  });

  test('deletedoctor_should_handle_not_finding_a_doctor_and_respond_with_a_404_status_code', async () => {
    // Mock Express request and response objects
    const req = { params: { id:new mongoose.Types.ObjectId() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Doctor.findByIdAndDelete method to resolve with null (doctor not found)
    Doctor.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await deleteDoctor(req, res);

    // Assertions
    expect(Doctor.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Doctor not found' });
  });

  test('deletedoctor_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Doctor.findByIdAndDelete
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Doctor.findByIdAndDelete method to reject with an error
    Doctor.findByIdAndDelete = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await deleteDoctor(req, res);

    // Assertions
    expect(Doctor.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('getDoctorById_Controller', () => {
  test('getdoctorbyid_should_return_a_doctor_with_a_200_status_code', async () => {
    // Sample doctor ID and corresponding doctor
    const doctorId = new mongoose.Types.ObjectId();
    const doctorData = {
      _id: doctorId,
      firstName: 'Sample',
      lastName: 'Doctor',
      specialization: 'Sample Specialization',
      location: 'Sample Hospital',
      experience: 5,
      availability: ['Monday', 'Wednesday'],
      userId: new mongoose.Types.ObjectId(),
    };

    // Mock the Doctor.findById method to resolve with the sample doctor
    Doctor.findById = jest.fn().mockResolvedValue(doctorData);

    // Mock Express request and response objects
    const req = { params: { id: doctorId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await getDoctorById(req, res);

    // Assertions
    expect(Doctor.findById).toHaveBeenCalledWith(doctorId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(doctorData);
  });

  test('getdoctorbyid_should_return_not_found_with_a_404_status_code', async () => {
    // Mock Express request and response objects
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Doctor.findById method to resolve with null (doctor not found)
    Doctor.findById = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await getDoctorById(req, res);

    // Assertions
    expect(Doctor.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Doctor not found' });
  });


  test('getdoctorbyid_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Doctor.findById
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = { params: { id: new mongoose.Types.ObjectId() } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Doctor.findById method to reject with an error
    Doctor.findById = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await getDoctorById(req, res);

    // Assertions
    expect(Doctor.findById).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('getDoctorByUserId_Controller', () => {
  test('getdoctorbyuserid_should_return_doctors_for_a_valid_userId_with_a_200_status_code', async () => {
    // Sample user ID and doctor data
    const userId = new mongoose.Types.ObjectId();
    const doctorsData = [
      {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'Doctor1',
        lastName: 'Sample',
        specialization: 'Sample Specialization',
        location: 'Sample Hospital',
        experience: 5,
        availability: ['Monday', 'Wednesday'],
        userId,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        firstName: 'Doctor2',
        lastName: 'Sample',
        specialization: 'Sample Specialization',
        location: 'Sample Hospital',
        experience: 10,
        availability: ['Tuesday', 'Thursday'],
        userId,
      },
    ];

    // Mock Express request and response objects
    const req = { body: { userId, sortValue: 1, searchValue: '' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Doctor.find method to resolve with a query
    Doctor.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue(doctorsData),
    });

    // Call the controller function
    await getDoctorByUserId(req, res);

    // Assertions
    expect(Doctor.find).toHaveBeenCalledWith({ userId, firstName: new RegExp('', 'i') });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(doctorsData);
  });

  test('getdoctorbyuserid_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling Doctor.find
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = { body: { userId: new mongoose.Types.ObjectId(), sortValue: 1, searchValue: '' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Doctor.find method to resolve with a query
    const doctorQuery = {
      sort: jest.fn().mockRejectedValue(error), // Mocking the sort function with error
    };
    Doctor.find = jest.fn().mockReturnValue(doctorQuery);

    // Call the controller function
    await getDoctorByUserId(req, res);

    // Assertions

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});


describe('getUserByUsernameAndPassword', () => {

  test('getuserbyusernameandpassword_should_return_invalid_credentials_with_a_200_status_code', async () => {
    // Sample user credentials
    const userCredentials = {
      email: 'nonexistent@example.com',
      password: 'incorrect_password',
    };

    // Mock Express request and response objects
    const req = {
      body: userCredentials,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.findOne method to resolve with null (user not found)
    User.findOne = jest.fn().mockResolvedValue(null);

    // Call the controller function
    await userController.getUserByUsernameAndPassword(req, res);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith(userCredentials);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Credentials' });
  });

  test('getuserbyusernameandpassword_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling User.findOne
    const error = new Error('Database error');

    // Sample user credentials
    const userCredentials = {
      email: 'john@example.com',
      password: 'password123',
    };

    // Mock Express request and response objects
    const req = {
      body: userCredentials,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.findOne method to reject with an error
    User.findOne = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await userController.getUserByUsernameAndPassword(req, res);

    // Assertions
    expect(User.findOne).toHaveBeenCalledWith(userCredentials);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('addUser', () => {
  test('adduser_should_add_user_and_respond_with_a_200_status_code_and_success_message', async () => {
    // Sample user data
    const userData = {
      username: 'john_doe',
      email: 'john@example.com',
      password: 'password123',
    };

    // Mock Express request and response objects
    const req = {
      body: userData,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.create method to resolve with the sample user data
    User.create = jest.fn().mockResolvedValue(userData);

    // Call the controller function
    await userController.addUser(req, res);

    // Assertions
    expect(User.create).toHaveBeenCalledWith(userData);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Success' });
  });

  test('adduser_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling User.create
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = {
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.create method to reject with an error
    User.create = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await userController.addUser(req, res);

    // Assertions
    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('getAllUsers', () => {
  test('getallusers_should_return_users_and_respond_with_a_200_status_code', async () => {
    // Sample user data
    const usersData = [
      {
        _id: 'user1',
        username: 'john_doe',
        email: 'john@example.com',
        password: 'hashed_password1',
      },
      {
        _id: 'user2',
        username: 'jane_doe',
        email: 'jane@example.com',
        password: 'hashed_password2',
      },
    ];

    // Mock Express request and response objects
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.find method to resolve with the sample user data
    User.find = jest.fn().mockResolvedValue(usersData);

    // Call the controller function
    await userController.getAllUsers(req, res);

    // Assertions
    expect(User.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({"users" : usersData});
  });

  test('getallusers_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
    // Mock an error to be thrown when calling User.find
    const error = new Error('Database error');

    // Mock Express request and response objects
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the User.find method to reject with an error
    User.find = jest.fn().mockRejectedValue(error);

    // Call the controller function
    await userController.getAllUsers(req, res);

    // Assertions
    expect(User.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});
describe('User Model Schema Validation', () => {
  test('user_model_should_validate_a_user_with_valid_data', async () => {
    const validUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'john.doe@example.com',
      role: 'user',
      password: 'validpassword',
    };

    const user = new User(validUserData);

    // Validate the user data against the schema
    await expect(user.validate()).resolves.toBeUndefined();
  });

  test('user_model_should_validate_a_user_with_missing_required_fields', async () => {
    const invalidUserData = {
      // Missing required fields
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
    await expect(user.validate()).rejects.toThrowError();
  });

  test('user_model_should_validate_a_user_with_invalid_mobile_number_format', async () => {
    const invalidUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: 'not-a-number',
      email: 'john.doe@example.com',
      role: 'user',
      password: 'validpassword',
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
    await expect(user.validate()).rejects.toThrowError(/is not a valid mobile number/);
  });

  test('user_model_should_validate_a_user_with_invalid_email_format', async () => {
    const invalidUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'invalid-email',
      role: 'user',
      password: 'validpassword',
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
    await expect(user.validate()).rejects.toThrowError(/is not a valid email address/);
  });

  test('user_model_should_validate_a_user_with_a_password_shorter_than_the_minimum_length', async () => {
    const invalidUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'john.doe@example.com',
      role: 'user',
      password: 'short',
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
    await expect(user.validate()).rejects.toThrowError(/is shorter than the minimum allowed length/);
  });

  test('user_model_should_validate_a_user_with_a_password_longer_than_the_maximum_length', async () => {
    const invalidUserData = {
      firstName: 'John',
      lastName: 'Doe',
      mobileNumber: '1234567890',
      email: 'john.doe@example.com',
      role: 'user',
      password: 'a'.repeat(256),
    };

    const user = new User(invalidUserData);

    // Validate the user data against the schema
    await expect(user.validate()).rejects.toThrowError(/is longer than the maximum allowed length /);
  });
});

describe('Doctor Model Validation', () => {
  test('doctor_model_should_be_valid_with_correct_data', async () => {
    const validDoctorData = {
      firstName: 'John',
      lastName: 'Doe',
      specialization: 'Cardiologist',
      location: 'City Hospital',
      experience: 5,
      availability: ['Monday', 'Wednesday', 'Friday'],
      userId: new mongoose.Types.ObjectId(),
    };

    const doctor = new Doctor(validDoctorData);
    await expect(doctor.validate()).resolves.toBeUndefined();
  });

  test('doctor_model_should_throw_validation_error_without_required_fields', async () => {
    const invalidDoctorData = {
    };

    const doctor = new Doctor(invalidDoctorData);
    await expect(doctor.validate()).rejects.toThrow();
  });

  test('doctor_model_should_throw_validation_error_with_invalid_data', async () => {
    const invalidDoctorData = {
      firstName: 'John',
      lastName: 'Doe',
      specialization: 'Cardiologist',
      location: 'City Hospital',
      experience: -5, // Invalid experience
      availability: ['Monday', 'Wednesday', 'Friday'],
      userId: 'invalidUserId', // Invalid ObjectId
    };

    const doctor = new Doctor(invalidDoctorData);
    await expect(doctor.validate()).rejects.toThrow();
  });

});

describe('validateToken', () => {
  test('validatetoken_should_respond_with_400_status_and_error_message_if_invalid_token_is_provided', () => {
    // Mock the req, res, and next objects
    const req = {
      header: jest.fn().mockReturnValue('invalidToken'),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call the validateToken function
    validateToken(req, res, next);

    // Assertions
    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication failed' });
  });

  test('validatetoken_should_respond_with_400_status_and_error_message_if_no_token_is_provided', () => {
    // Mock the req, res, and next objects
    const req = {
      header: jest.fn().mockReturnValue(null),
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call the validateToken function
    validateToken(req, res, next);

    // Assertions
    expect(req.header).toHaveBeenCalledWith('Authorization');
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication failed' });
  });
});