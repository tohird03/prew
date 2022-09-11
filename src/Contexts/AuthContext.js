import { createContext, useContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const AuthStateContext = createContext();
const AuthDispatchContext = createContext();

let user = null;
const token = window.localStorage.getItem("acces_token");

if (token) {
  const decodedToken = jwtDecode(token);
  const expiresAt = new Date(decodedToken.exp * 1000);

  if (new Date() > expiresAt) {
    window.localStorage.removeItem("acces_token");
  } else {
    user = decodedToken;
  }
} else console.log("Token not found");

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      window.localStorage.setItem("acces_token", action.payload.acces_token);
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      window.localStorage.removeItem("acces_token");
      return {
        ...state,
        user: null,
      };
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user });
  return (
    <AuthDispatchContext.Provider value={dispatch}>
      <AuthStateContext.Provider value={state}>
        {children}
      </AuthStateContext.Provider>
    </AuthDispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);
