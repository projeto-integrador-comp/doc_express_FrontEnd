import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { toast } from "react-toastify";

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [documentsList, setDocumentsList] = useState([]);
  const [deletingUser, setDeletingUser] = useState(null);
  const [allUsersList, setAllUsersList] = useState([]);
  const [updatingUser, setUpdatingUser] = useState(null);

  // AJUSTE: O loading começa como TRUE se houver um token para evitar o "pisca"
  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem("@tokenDocExpress");
    return !!token;
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("@tokenDocExpress");

    const userAutoLogin = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data } = await api.get("/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);
        setDocumentsList(data.user.documents);
        
        // Aqui não fazemos navigate, deixamos o PrivateRoutes cuidar da rota atual
      } catch (error) {
        console.error(error);
        localStorage.removeItem("@tokenDocExpress");
        setUser(null);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    userAutoLogin();
  }, [navigate]);

  const userLogin = async (formData, setFormLoading, reset) => {
    try {
      setFormLoading(true);
      const { data } = await api.post("/login", formData);
      localStorage.setItem("@tokenDocExpress", data.token);
      setUser(data.user);
      setDocumentsList(data.user.documents);
      toast.success("Usuário logado");
      reset();
      navigate("/dashboard");
    } catch (error) {
      toast.error("Email e/ou senha incorretos");
    } finally {
      setFormLoading(false);
    }
  };

  const userRegister = async (formData, setFormLoading, reset) => {
    try {
      setFormLoading(true);
      await api.post("/users", formData);
      toast.success("Usuário cadastrado!");
      reset();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data.message || "Erro ao cadastrar");
    } finally {
      setFormLoading(false);
    }
  };

  const adminRegisterUser = async (formData, setFormLoading, reset) => {
    const token = localStorage.getItem("@tokenDocExpress");
    try {
      setFormLoading(true);
      await api.post("/users", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Colaborador cadastrado!");
      if (reset) reset();
      await getAllUsers();
    } catch (error) {
      toast.error(error.response?.data.message || "Erro ao cadastrar");
    } finally {
      setFormLoading(false);
    }
  };

  const getAllUsers = async () => {
    const token = localStorage.getItem("@tokenDocExpress");
    try {
      const { data } = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllUsersList(data);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
    }
  };

  const userUpdate = async (formData, id) => {
    const token = localStorage.getItem("@tokenDocExpress");
    try {
      setLoading(true);
      const { data } = await api.patch(`/users/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (id === user?.id) {
        setUser({ ...user, ...data });
      }

      toast.success("Colaborador atualizado!");
      await getAllUsers();
      setUpdatingUser(null);
    } catch (error) {
      toast.error("Erro na atualização");
    } finally {
      setLoading(false);
    }
  };

  const userDelete = async (id) => {
    const token = localStorage.getItem("@tokenDocExpress");
    try {
      setLoading(true);
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (id === user?.id) {
        userLogout();
      } else {
        toast.success("Colaborador removido");
        await getAllUsers();
      }
    } catch (error) {
      toast.error("Erro ao deletar usuário.");
    } finally {
      setLoading(false);
    }
  };

  const userLogout = () => {
    setUser(null);
    setDocumentsList([]);
    localStorage.removeItem("@tokenDocExpress");
    navigate("/");
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
        allUsersList,
        updatingUser,
        setUpdatingUser,
        userLogin,
        userRegister,
        adminRegisterUser,
        getAllUsers,
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