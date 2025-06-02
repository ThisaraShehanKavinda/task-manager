import { createContext } from 'react';

const AuthContext = createContext({
  user: null,
  login: () => {},
  register: () => {},
  logout: () => {},
  loading: true
});

export default AuthContext;