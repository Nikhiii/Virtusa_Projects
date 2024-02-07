import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Login from "../Components/Login";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import Register from "../Components/Register";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import UserProducts from "../Farmer/UserProducts";
import CreateProduct from "../Farmer/CreateProduct";
import ProductsList from "../Buyer/ProductDetails";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
let  store = mockStore({});
const queryClient = new QueryClient();

test("renders_login_component", () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
  const linkElement = screen.getByText(/Login/i, { selector: "h2" });
  expect(linkElement).toBeInTheDocument();
});

test("renders_email_input", () => {
  render(
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
  );
  const emailInput = screen.getByPlaceholderText(/Email/i);
  expect(emailInput).toBeInTheDocument();
});

test("renders_password_input", () => {
  render(
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
  );
  const passwordInput = screen.getByPlaceholderText(/Password/i);
  expect(passwordInput).toBeInTheDocument();
});

test("renders_login_button", () => {
  render(
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </QueryClientProvider>
  </Provider>
  );
  const loginButton = screen.getByRole("button", { name: /Login/i });
  expect(loginButton).toBeInTheDocument();
});

test("renders_signup_link", () => {
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
  const signupLink = screen.getByText(/Signup/i);
  expect(signupLink).toBeInTheDocument();
});

test('displays_email_required_error_when_email_is_empty', async () => {
    render(
        <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });
  
  test('displays_invalid_email_error_when_email_is_invalid', async () => {
    render(
        <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
    );
    fireEvent.input(screen.getByPlaceholderText(/Email/i), { target: { value: 'invalid_email' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(await screen.findByText('Invalid email address')).toBeInTheDocument();
  });
  
  test('displays_password_required_error_when_password_is_empty', async () => {
    render(
        <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
    );
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });
  
  test('displays_password_length_error_when_password_is_too_short', async () => {
    render(
        <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
    );
    fireEvent.input(screen.getByPlaceholderText(/Password/i), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: /Login/i }));
    expect(await screen.findByText('Password must be at least 6 characters')).toBeInTheDocument();
  });

  test('updates_first_name_field_correctly', () => {
    render( <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>);
    
    userEvent.type(screen.getByLabelText(/First Name/i), 'John');
    expect(screen.getByLabelText(/First Name/i).value).toBe('John');
  });

  test('updates_last_name_field_correctly', () => {
    render( <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>);    
    userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
    expect(screen.getByLabelText(/Last Name/i).value).toBe('Doe');
  });

  test('updates_mobile_number_field_correctly', () => {
    render( <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>);    
    userEvent.type(screen.getByLabelText(/Mobile Number/i), '1234567890');
    expect(screen.getByLabelText(/Mobile Number/i).value).toBe('1234567890');
  });

  test('updates_email_field_correctly', () => {
    render( <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>);    
    userEvent.type(screen.getByLabelText(/E-mail Id/i), 'john.doe@example.com');
    expect(screen.getByLabelText(/E-mail Id/i).value).toBe('john.doe@example.com');
  });

  test('updates_confirm_password_field_correctly', () => {
    render( <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Register />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>);    
    userEvent.type(screen.getByLabelText(/Confirm password/i), 'password123');
    expect(screen.getByLabelText(/Confirm password/i).value).toBe('password123');
  });

  store = mockStore({ user: { userId: 1 } });

  test('renders_user_products_component', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserProducts />
        </BrowserRouter>
      </Provider>
    );
    const linkElement = screen.getByText(/My Products/i);
    expect(linkElement).toBeInTheDocument();
  });
  
  test('logout_button_is_present', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserProducts />
        </BrowserRouter>
      </Provider>
    );
    const logoutButton = screen.getByText(/Logout/i);
    expect(logoutButton).toBeInTheDocument();
  });
  
  test('add_new_item_button_is_present', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserProducts />
        </BrowserRouter>
      </Provider>
    );
    const addButton = screen.getByText(/Add new Item/i);
    expect(addButton).toBeInTheDocument();
  });
  
  test('search_input_field_is_present', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <UserProducts />
        </BrowserRouter>
      </Provider>
    );
    const searchInput = screen.getByPlaceholderText(/Search by product name/i);
    expect(searchInput).toBeInTheDocument();
  });


    test('renders_create_product_component', () => {
        render(
          <Provider store={store}>
            <BrowserRouter>
              <CreateProduct />
            </BrowserRouter>
          </Provider>
        );
        const linkElement = screen.getByText(/Create New Product/i);
        expect(linkElement).toBeInTheDocument();
      });
      test('create_product_button_is_present', () => {
        render(
          <Provider store={store}>
            <BrowserRouter>
              <CreateProduct />
            </BrowserRouter>
          </Provider>
        );
        const createButton = screen.getByText(/Create Product/i);
        expect(createButton).toBeInTheDocument();
      });
      test('back_button_is_present', () => {
        render(
          <Provider store={store}>
            <BrowserRouter>
              <CreateProduct />
            </BrowserRouter>
          </Provider>
        );
        const backButton = screen.getByText(/Back/i);
        expect(backButton).toBeInTheDocument();
      });
      test('category_dropdown_is_present', () => {
        render(
          <Provider store={store}>
            <BrowserRouter>
              <CreateProduct />
            </BrowserRouter>
          </Provider>
        );
        const categoryDropdown = screen.getByText(/Category:/i);
        expect(categoryDropdown).toBeInTheDocument();
      });
      test('description_is_present', () => {
        render(
          <Provider store={store}>
            <BrowserRouter>
              <CreateProduct />
            </BrowserRouter>
          </Provider>
        );
        const categoryDropdown = screen.getByText(/Description:/i);
        expect(categoryDropdown).toBeInTheDocument();
      });
      test('price_is_present', () => {
        render(
          <Provider store={store}>
            <BrowserRouter>
              <CreateProduct />
            </BrowserRouter>
          </Provider>
        );
        const categoryDropdown = screen.getByText(/Price:/i);
        expect(categoryDropdown).toBeInTheDocument();
      });
      test('product_is_present', () => {
        render(
          <Provider store={store}>
            <BrowserRouter>
              <CreateProduct />
            </BrowserRouter>
          </Provider>
        );
        const categoryDropdown = screen.getByText(/Product:/i);
        expect(categoryDropdown).toBeInTheDocument();
      });
      test('renders_products_list_component', () => {
        render(
          <Provider store={store}>
            <BrowserRouter>
              <ProductsList />
            </BrowserRouter>
          </Provider>
        );
        const linkElement = screen.getByText(/Available Products/i);
        expect(linkElement).toBeInTheDocument();
      });
      
      test('products_table_is_present', () => {
        render(
          <Provider store={store}>
            <BrowserRouter>
              <ProductsList />
            </BrowserRouter>
          </Provider>
        );
        const tableElement = screen.getByRole('table');
        expect(tableElement).toBeInTheDocument();
      });
      
      test('table_headers_are_present', () => {
        render(
          <Provider store={store}>
            <BrowserRouter>
              <ProductsList />
            </BrowserRouter>
          </Provider>
        );
        const productHeader = screen.getByText(/Product/i, { selector: 'th' });
        const descriptionHeader = screen.getByText(/Description/i);
        const priceHeader = screen.getByText(/Price/i);
        const actionHeader = screen.getByText(/Action/i);
        expect(productHeader).toBeInTheDocument();
        expect(descriptionHeader).toBeInTheDocument();
        expect(priceHeader).toBeInTheDocument();
        expect(actionHeader).toBeInTheDocument();
      });
      
      test('logout_button_is_present_in_userproducts', () => {
        render(
          <Provider store={store}>
            <BrowserRouter>
              <ProductsList />
            </BrowserRouter>
          </Provider>
        );
        const logoutButton = screen.getByText(/Logout/i);
        expect(logoutButton).toBeInTheDocument();
      });




    