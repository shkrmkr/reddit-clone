import axios from "axios";
import {
  createContext,
  Dispatch,
  Reducer,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { User } from "../types";

const LOGIN = "auth/LOGIN" as const;
const LOGOUT = "auth/LOGOUT" as const;
const STOP_LOADING = "auth/STOP_LOADING" as const;

export const login = (user: User) => ({
  type: LOGIN,
  payload: user,
});
export const logout = () => ({ type: LOGOUT });
export const stopLoading = () => ({ type: STOP_LOADING });

interface AuthState {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

type AuthAction =
  | ReturnType<typeof login>
  | ReturnType<typeof logout>
  | ReturnType<typeof stopLoading>;

const AuthContext = createContext<AuthState>({
  authenticated: false,
  user: undefined,
  loading: true,
});

const DispatchContext = createContext<Dispatch<AuthAction>>(null);

const reducer: Reducer<AuthState, AuthAction> = (state, action) => {
  switch (action.type) {
    case "auth/LOGIN":
      return {
        ...state,
        authenticated: true,
        user: action.payload,
      };
    case "auth/LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: undefined,
      };
    case "auth/STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, {
    user: undefined,
    authenticated: false,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const { data: user } = await axios.get("/auth/me");
        dispatch(login(user));
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(stopLoading());
      }
    })();
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthContext);
export const useAuthDispatch = () => useContext(DispatchContext);
