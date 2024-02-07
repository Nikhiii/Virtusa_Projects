const userController = require('../controllers/userController');
const User = require('../models/userModel');
const Medicine = require('../models/medicineModel');
const { getMedicineByUserId, getMedicineById, deleteMedicine, updateMedicine, addMedicine, getAllMedicines } = require('../controllers/medicineController');
const mongoose = require('mongoose');
const { validateToken } = require('../authUtils');


describe('getAllMedicine_Controller', () => {
  test('getallmedicine_should_return_medicines_with_a_200_status_code', async () => {
      // Sample medicines data
      const medicinesData = [
        {
          product: 'Medicine 1',
          manufacturer: 'Manufacturer 1',
          expiryDate: new Date('2023-12-31'),
          price: 20.5,
          description: 'Description 1',
          category: 'Category 1',
          imageUrl: 'http://example.com/images/1.jpg',
          userId: new mongoose.Types.ObjectId(),
        },
        {
          product: 'Medicine 2',
          manufacturer: 'Manufacturer 2',
          expiryDate: new Date('2024-12-31'),
          price: 30.5,
          description: 'Description 2',
          category: 'Category 2',
          imageUrl: 'http://example.com/images/2.jpg',
          userId: new mongoose.Types.ObjectId(),
        },
      ];

      // Mock Express request and response objects
      const req = {
        body: { sortValue: 1, searchValue: 'Medicine 1' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Medicine.find method to resolve with the sample medicines data
      const medicineQuery = {
        sort: jest.fn().mockResolvedValue(medicinesData), // Mocking the sort function
      };
      Medicine.find = jest.fn().mockReturnValue(medicineQuery);

      // Call the controller function
      await getAllMedicines(req, res);

      // Assertions
      expect(Medicine.find).toHaveBeenCalledWith({ product: new RegExp('Medicine 1', 'i') });
      expect(medicineQuery.sort).toHaveBeenCalledWith({ price: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ medicines: medicinesData });
  });

  test('getallmedicine_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling Medicine.find
      const error = new Error('Database error');

      // Mock Express request and response objects
      const req = {
        body: { sortValue: 1, searchValue: 'Medicine 1' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Medicine.find method to reject with an error
      const medicineQuery = {
        sort: jest.fn().mockRejectedValue(error), // Mocking the sort function with error
      };
      Medicine.find = jest.fn().mockReturnValue(medicineQuery);

      // Call the controller function
      await getAllMedicines(req, res);

      // Assertions
      expect(Medicine.find).toHaveBeenCalledWith({ product: new RegExp('Medicine 1', 'i') });
      expect(medicineQuery.sort).toHaveBeenCalledWith({ price: 1 });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('addMedicine_Controller', () => {
  test('addmedicine_should_add_a_medicine_and_respond_with_a_200_status_code_and_success_message', async () => {
      // Sample medicine data to be added
      const medicineToAdd = {
        product: 'New Medicine',
        manufacturer: 'New Manufacturer',
        expiryDate: new Date('2023-12-31'),
        price: 20.5,
        description: 'New Description',
        category: 'New Category',
        imageUrl: 'http://example.com/images/new.jpg',
        userId: new mongoose.Types.ObjectId(),
      };

      // Mock the Medicine.create method to resolve successfully
      Medicine.create = jest.fn().mockResolvedValue(medicineToAdd);

      // Mock Express request and response objects
      const req = { body: medicineToAdd };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the controller function
      await addMedicine(req, res);

      // Assertions
      expect(Medicine.create).toHaveBeenCalledWith(medicineToAdd);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Medicine added Successfully' });
  });

  test('addmedicine_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling Medicine.create
      const error = new Error('Database error');

      // Mock the Medicine.create method to reject with an error
      Medicine.create = jest.fn().mockRejectedValue(error);

      // Mock Express request and response objects
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the controller function
      await addMedicine(req, res);

      // Assertions
      expect(Medicine.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('updateMadicine_Controller', () => {
  test('updatemedicine_should_update_medicine_and_respond_with_a_200_status_code_and_success_message', async () => {
      // Sample medicine ID and updated medicine data
      const medicineId = new mongoose.Types.ObjectId();
      const updatedMedicineData = {
        product: 'Updated Medicine',
        manufacturer: 'Updated Manufacturer',
        expiryDate: new Date('2023-12-31'),
        price: 20.5,
        description: 'Updated Description',
        category: 'Updated Category',
        imageUrl: 'http://example.com/images/updated.jpg',
        userId: new mongoose.Types.ObjectId(),
      };

      // Mock Express request and response objects
      const req = { params: { id: medicineId }, body: updatedMedicineData };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Medicine.findByIdAndUpdate method to resolve with the updated medicine data
      Medicine.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedMedicineData);

      // Call the controller function
      await updateMedicine(req, res);

      // Assertions
      expect(Medicine.findByIdAndUpdate).toHaveBeenCalledWith(medicineId, updatedMedicineData, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Medicine Updated Successfully' });
  });

  test('updatemedicine_should_handle_not_finding_a_medicine_and_respond_with_a_404_status_code', async () => {
      // Mock Express request and response objects
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Medicine.findByIdAndUpdate method to resolve with null (medicine not found)
      Medicine.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      // Call the controller function
      await updateMedicine(req, res);

      // Assertions
      expect(Medicine.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, {}, { new: true });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Medicine not found' });
  });

  test('updatemedicine_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling Medicine.findByIdAndUpdate
      const error = new Error('Database error');

      // Mock Express request and response objects
      const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Medicine.findByIdAndUpdate method to reject with an error
      Medicine.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      // Call the controller function
      await updateMedicine(req, res);

      // Assertions
      expect(Medicine.findByIdAndUpdate).toHaveBeenCalledWith(req.params.id, {}, { new: true });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('deleteMedicine_Controller', () => {
  test('deletemedicine_should_delete_medicine_and_respond_with_a_200_status_code_and_success_message', async () => {
      // Sample medicine ID to be deleted
      const medicineId = new mongoose.Types.ObjectId();

      // Mock Express request and response objects
      const req = { params: { id: medicineId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Medicine.findByIdAndDelete method to resolve with the deleted medicine data
      Medicine.findByIdAndDelete = jest.fn().mockResolvedValue({
        _id: medicineId,
        product: 'Deleted Medicine',
        manufacturer: 'Deleted Manufacturer',
        expiryDate: new Date('2023-12-31'),
        price: 20.5,
        description: 'Deleted Description',
        category: 'Deleted Category',
        imageUrl: 'http://example.com/images/deleted.jpg',
        userId: new mongoose.Types.ObjectId(),
      });

      // Call the controller function
      await deleteMedicine(req, res);

      // Assertions
      expect(Medicine.findByIdAndDelete).toHaveBeenCalledWith(medicineId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Medicine Deleted Successfully' });
  });

  test('deletemedicine_should_handle_not_finding_a_medicine_and_respond_with_a_404_status_code', async () => {
      // Mock Express request and response objects
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Medicine.findByIdAndDelete method to resolve with null (medicine not found)
      Medicine.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      // Call the controller function
      await deleteMedicine(req, res);

      // Assertions
      expect(Medicine.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Medicine not found' });
  });

  test('deletemedicine_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling Medicine.findByIdAndDelete
      const error = new Error('Database error');

      // Mock Express request and response objects
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Medicine.findByIdAndDelete method to reject with an error
      Medicine.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      // Call the controller function
      await deleteMedicine(req, res);

      // Assertions
      expect(Medicine.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('getMedicineById_Controller', () => {
  test('getmedicinebyid_should_return_a_medicine_with_a_200_status_code', async () => {
    // Sample medicine ID and corresponding medicine
    const medicineId = new mongoose.Types.ObjectId();
    const medicineData = {
      _id: medicineId,
      product: 'Paracetamol',
      manufacturer: 'Sun Pharmaceuticals Industries Ltd',
      expiryDate: new Date('2023-12-31'),
      price: 20.5,
      description: 'Paracetamol 500mg tablets',
      category: 'Pain Relief',
      imageUrl: 'http://example.com/images/paracetamol.jpg',
      userId: new mongoose.Types.ObjectId(),
    };

    // Mock the Medicine.findById method to resolve with the sample medicine
    Medicine.findById = jest.fn().mockResolvedValue(medicineData);

    // Mock Express request and response objects
    const req = { params: { id: medicineId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await getMedicineById(req, res);

    // Assertions
    expect(Medicine.findById).toHaveBeenCalledWith(medicineId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(medicineData);
  });

  test('getmedicinebyid_should_return_not_found_with_a_404_status_code', async () => {
      // Mock Express request and response objects
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Medicine.findById method to resolve with null (medicine not found)
      Medicine.findById = jest.fn().mockResolvedValue(null);

      // Call the controller function
      await getMedicineById(req, res);

      // Assertions
      expect(Medicine.findById).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Medicine not found' });
  });


  test('getmedicinebyid_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling Medicine.findById
      const error = new Error('Database error');

      // Mock Express request and response objects
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Medicine.findById method to reject with an error
      Medicine.findById = jest.fn().mockRejectedValue(error);

      // Call the controller function
      await getMedicineById(req, res);

      // Assertions
      expect(Medicine.findById).toHaveBeenCalledWith(req.params.id);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});

describe('getMedicineByUserId_Controller', () => {
  test('getmedicinebyuserid_should_return_medicines_for_a_valid_userid_with_a_200_status_code', async () => {
    // Sample user ID and medicine data
    const userId = new mongoose.Types.ObjectId();
    const medicinesData = [
      {
        _id: new mongoose.Types.ObjectId(),
        product: 'Medicine1',
        manufacturer: 'Manufacturer1',
        expiryDate: new Date('2023-12-31'),
        price: 20.5,
        description: 'Medicine1 Description',
        category: 'Category1',
        imageUrl: 'http://example.com/images/medicine1.jpg',
        userId,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        product: 'Medicine2',
        manufacturer: 'Manufacturer2',
        expiryDate: new Date('2024-12-31'),
        price: 30.5,
        description: 'Medicine2 Description',
        category: 'Category2',
        imageUrl: 'http://example.com/images/medicine2.jpg',
        userId,
      },
    ];

    // Mock Express request and response objects
    const req = { body: { userId, sortValue: 1, searchValue: '' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Medicine.find method to resolve with a query
    Medicine.find = jest.fn().mockReturnValue({
      sort: jest.fn().mockResolvedValue(medicinesData),
    });

    // Call the controller function
    await getMedicineByUserId(req, res);

    // Assertions
    expect(Medicine.find).toHaveBeenCalledWith({ userId, product: new RegExp('', 'i') });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(medicinesData);
  });

  test('getmedicinebyuserid_should_handle_errors_and_respond_with_a_500_status_code_and_an_error_message', async () => {
      // Mock an error to be thrown when calling Medicine.find
      const error = new Error('Database error');

      // Mock Express request and response objects
      const req = { body: { userId: new mongoose.Types.ObjectId(), sortValue: 1, searchValue: '' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Mock the Medicine.find method to resolve with a query
      const medicineQuery = {
        sort: jest.fn().mockRejectedValue(error), // Mocking the sort function with error
      };
      Medicine.find = jest.fn().mockReturnValue(medicineQuery);

      // Call the controller function
      await getMedicineByUserId(req, res);

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

describe('Medicine Model Validation', () => {
  test('medicine_model_should_be_valid_with_correct_data', async () => {
    const validMedicineData = {
      product: 'Paracetamol',
      manufacturer: 'Sun Pharmaceuticals Industries Ltd',
      expiryDate: new Date('2023-12-31'),
      price: 20.5,
      description: 'Paracetamol 500mg tablets',
      category: 'Pain Relief',
      imageUrl: 'http://example.com/images/paracetamol.jpg',
      userId: new mongoose.Types.ObjectId(),
    };
  
    const medicine = new Medicine(validMedicineData);
    // await expect(medicine.validate()).resolves.toBeUndefined();
    const error = medicine.validateSync();
    expect(error).toBeUndefined();
  });

  test('medicine_model_should_throw_validation_error_without_required_fields', async () => {
    const invalidMedicineData = {};

    const medicine = new Medicine(invalidMedicineData);
    await expect(medicine.validate()).rejects.toThrow();
  });

  test('medicine_model_should_throw_validation_error_with_invalid_data', async () => {
    const invalidMedicineData = {
      product: 'Pa',
      manufacturer: 'Su',
      expiryDate: 'invalidDate', // Invalid date
      price: -20.5, // Invalid price
      description: 'P',
      category: 'P',
      imageUrl: 'invalidUrl', // Invalid URL
      userId: 'invalidUserId', // Invalid ObjectId
    };

    const medicine = new Medicine(invalidMedicineData);
    await expect(medicine.validate()).rejects.toThrow();
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