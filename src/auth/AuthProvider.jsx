import React, { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { supabase } from "../createClient";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// logout supabase
const logout = () => supabase.auth.signOut();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);

  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  // getDataUser moved here
  const getDataUser = async (userId) => {
    try {
      const { data: userData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId);

      console.log(userData);
      setUsername(userData[0].username);
      setRole(userData[0].role);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const { user: currentUser } = data;
      setUser(currentUser ?? null);
      setAuth(currentUser ? true : false);

      if (currentUser) {
        getDataUser(currentUser.id); // Now it's defined before being used
      } else {
        console.log("Data Empty");
        setLoading(false);
      }
    };

    getUser();

    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session.user);
        setAuth(true);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setAuth(false);
      }
      // setLoading(false)
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, auth, username, role, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired, // Validate children prop
// };

export default AuthProvider;
