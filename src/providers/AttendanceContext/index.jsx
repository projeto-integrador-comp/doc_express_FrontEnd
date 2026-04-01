// src/providers/AttendanceContext.jsx
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AttendanceContext = createContext({});

export const AttendanceProvider = ({ children }) => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estados para controle de Modais
  const [hiddenCreateAttendance, setHiddenCreateAttendance] = useState(true);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [viewingAttendance, setViewingAttendance] = useState(null);

  // Função para carregar os dados (Mocked para desenvolvimento)
  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      // Simulando delay de rede
      await new Promise((resolve) => setTimeout(resolve, 600));

      const mockData = [
        { id: 1, studentName: "Ana Clara", class: "8º A", frequencyRate: 95, absences: 2, status: "Normal" },
        { id: 2, studentName: "Bruno Oliveira", class: "8º A", frequencyRate: 72, absences: 14, status: "Risco" },
        { id: 3, studentName: "Carla Dias", class: "9º B", frequencyRate: 82, absences: 8, status: "Normal" },
        { id: 4, studentName: "Gustavo Silva", class: "3º Ano", frequencyRate: 60, absences: 22, status: "Crítico" },
      ];

      setAttendanceList(mockData);
      console.log("Attendance: Dados carregados via Mock.");
    } catch (error) {
      console.error("Erro ao carregar frequência:", error);
      toast.error("Erro ao carregar dados de assiduidade.");
    } finally {
      setLoading(false);
    }
  };

  // Simulação de Adicionar (C do CRUD)
  const createAttendance = (newData) => {
    const newItem = {
      ...newData,
      id: Math.floor(Math.random() * 1000), // ID temporário
      status: newData.frequencyRate < 75 ? "Crítico" : "Normal"
    };
    setAttendanceList((prev) => [newItem, ...prev]);
    toast.success("Presença registrada com sucesso (Mock)!");
  };

  // Simulação de Deletar (D do CRUD)
  const deleteAttendance = (id) => {
    setAttendanceList((prev) => prev.filter((item) => item.id !== id));
    toast.info("Registro removido do estado local.");
  };

  // Simulação de Editar (U do CRUD)
  const updateAttendance = (id, updatedData) => {
    setAttendanceList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
    toast.success("Dados atualizados localmente!");
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  return (
    <AttendanceContext.Provider
      value={{
        attendanceList,
        loading,
        hiddenCreateAttendance,
        setHiddenCreateAttendance,
        editingAttendance,
        setEditingAttendance,
        viewingAttendance,
        setViewingAttendance,
        loadAttendanceData,
        createAttendance,
        deleteAttendance,
        updateAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};