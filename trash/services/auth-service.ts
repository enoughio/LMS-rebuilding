// This file defines all authentication-related API calls
// Used by the AuthProvider component

// Define your API base URL
const API_URL = process.env.NODE_BACKEND_URL || "http://localhost:5000/api";

// Define interfaces for authentication data
interface LoginCredentials {
  email: string;
  password: string;
}

interface UserData {
  name: string;
  email: string;
  password: string;
  role?: string;
  [key: string]: any; // Allow for additional fields
}

export const LoginUser = async (Credential: LoginCredentials) => {

  try {    
    const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(Credential)
  })


  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();
  return data;
  } catch (error) {
    console.error("Login error:", error);
    throw new Error(`Login failed ${error}`);
  }
}



export const RegisterUser = async (userData: UserData) => {

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(`Registration failed ${error}`);
  }
}



export const RegisterAdmin = async (userData: UserData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register-SUPER_ADMIN`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw new Error(`Registration failed ${error}`);
  }
}




export const LogoutUser = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Logout failed');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error(`Logout failed ${error}`);
  }
}


export const GetCurrentUser = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch current user');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};





// // Default fetch options to include credentials (cookies)
// const fetchOptions = {
//   credentials: 'include' as RequestCredentials,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// };

// /**
//  * Helper function to handle API responses with better error details
//  */
// const handleResponse = async (response: Response) => {
//   const data = await response.json();
  
//   if (!response.ok) {
//     // Extract detailed error message from the response
//     const errorMessage = data.message || `Error: ${response.status}`;
    
//     // Create an error object with additional details
//     const error: unknown = new Error(errorMessage);
//     error.status = response.status;
//     error.data = data;
    
//     throw error;
//   }
  
//   return data;
// };

// /**
//  * Authentication service for handling all auth-related API calls
//  */
// export const authService = {
//   /**
//    * Register a basic user
//    */
//   register: async (userData: any) => {
//     const response = await fetch(`${API_URL}/auth/register`, {
//       method: 'POST',
//       ...fetchOptions,
//       body: JSON.stringify(userData)
//     });
    
//     const data = await handleResponse(response);
//     return data.user;
//   },

//   /**
//    * Register a member user with additional permissions
//    */
//   registerMember: async (userData: any) => {
//     const response = await fetch(`${API_URL}/auth/register-member`, {
//       method: 'POST',
//       ...fetchOptions,
//       body: JSON.stringify(userData)
//     });
    
//     const data = await handleResponse(response);
//     return data.user;
//   },

//   /**
//    * Register an admin user
//    */
//   registerAdmin: async (userData: any) => {
//     const response = await fetch(`${API_URL}/auth/register-admin`, {
//       method: 'POST',
//       ...fetchOptions,
//       body: JSON.stringify(userData)
//     });
    
//     const data = await handleResponse(response);
//     return data.user;
//   },

//   /**
//    * Register a super admin user
//    */
//   registerSuperAdmin: async (userData: any) => {
//     const response = await fetch(`${API_URL}/auth/register-SUPER_ADMIN`, {
//       method: 'POST',
//       ...fetchOptions,
//       body: JSON.stringify(userData)
//     });
    
//     const data = await handleResponse(response);
//     return data.user;
//   },

//   /**
//    * Login a user
//    */
//   login: async (email: string, password: string) => {
//     const response = await fetch(`${API_URL}/auth/login`, {
//       method: 'POST',
//       ...fetchOptions,
//       body: JSON.stringify({ email, password })
//     });
    
//     const data = await handleResponse(response);
//     return data.user;
//   },

//   /**
//    * Logout a user
//    */
//   logout: async () => {
//     try {
//       const response = await fetch(`${API_URL}/auth/logout`, {
//         method: 'POST',
//         ...fetchOptions
//       });
      
//       await response.json();
//       return true;
//     } catch (error) {
//       console.error("Logout error:", error);
//       throw new Error("Logout failed");
//     }
//   },

//   /**
//    * Get the current user
//    */
//   getCurrentUser: async () => {
//     try {
//       const response = await fetch(`${API_URL}/auth/me`, {
//         method: 'GET',
//         ...fetchOptions
//       });
      
//       if (!response.ok) return null;
      
//       const data = await response.json();
//       return data.user;
//     } catch (error) {
//       // Don't throw an error for auth check - just return null
//       return null;
//     }
//   },
// };