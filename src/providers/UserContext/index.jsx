import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { toast } from "react-toastify";

export const UserContext = createContext({});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [documentsList, setDocumentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [hiddenUpdateUser, setHiddenUpdateUser] = useState(true);

  const navigate = useNavigate();

  const pathname = window.location.pathname;

  useEffect(() => {
    const token = localStorage.getItem("@tokenDocExpress");

    const userAutoLogin = async () => {
      try {
        setLoading(true);

        const { data } = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);
        setDocumentsList(data.user.documents);
        navigate(pathname);
      } catch (error) {
        if (error.response?.status == 401) toast.error("Acesso expirado");
      } finally {
        setLoading(false);
      }
    };

    if (token) userAutoLogin();
  });

  const userLogin = async (formData, setLoading, reset) => {
    try {
      setLoading(true);
      const { data } = await api.post("/login", formData);

      localStorage.setItem("@tokenDocExpress", data.token);
      setUser(data.user);
      setDocumentsList(data.user.documents);

      toast.success("Usuário logado");

      reset();
      navigate("/dashboard");
    } catch (error) {
      if (error.response?.data.message === "Invalid credentials.") {
        toast.error("Email e/ou senha incorretos");
      } else if (error.message === "Request failed with status code 401") {
        toast.warn("servidor inativo. Tente novamente para iniciálo!");
      }
    } finally {
      setLoading(false);
    }
  };

  const userRegister = async (formData, setLoading, reset) => {
    try {
      setLoading(true);
      await api.post("/users", formData);
      toast.success("Usuário cadastrado");
      reset();
      navigate("/");
    } catch (error) {
      if (error.response?.data.message === "Email already exists.") {
        toast.error("Email já cadastrado");
      }
    } finally {
      setLoading(false);
    }
  };

  const userUpdate = async (formData, setLoading, id) => {
    const token = localStorage.getItem("@tokenDocExpress");

    try {
      setLoading(true);
      const { data } = await api.patch(`/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...user, ...data });
      toast.success("Usuário atualizado");
      setHiddenUpdateUser(true);
    } catch (error) {
      if (error.response?.data.message === "Email already exists.") {
        toast.error("Email já cadastrado");
      }
    } finally {
      setLoading(false);
    }
  };

  const userDelete = async (setLoading, id) => {
    const token = localStorage.getItem("@tokenDocExpress");

    try {
      setLoading(true);
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(null);
      setDocumentsList([]);

      setDeletingUser(null);
      toast.error("Usuário deletado");
      navigate("/");
      localStorage.removeItem("@tokenMyContacts");
    } catch (error) {
      if (error.response?.data.message === "User not found.") {
        toast.error("Usuário não encontrado");
      }
    } finally {
      setLoading(false);
    }
  };

  const userLogout = () => {
    setUser(null);
    setDocumentsList([]);
    toast.error("Usuário deslogado");
    navigate("/");
    localStorage.removeItem("@tokenDocExpress");
  };
  return (
    <UserContext.Provider
      value={{
        user,
        documentsList,
        setDocumentsList,
        loading,
        deletingUser,
        setDeletingUser,
        hiddenUpdateUser,
        setHiddenUpdateUser,
        userLogin,
        userRegister,
        userUpdate,
        userDelete,
        userLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export default UserProvider;
