import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const AttendanceContext = createContext({});

export const AttendanceProvider = ({ children }) => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hiddenCreateAttendance, setHiddenCreateAttendance] = useState(true);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [viewingAttendance, setViewingAttendance] = useState(null);

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const mockData = [
        { id: 1, studentName: "Ana Clara", class: "Maternal I", frequencyRate: 95, absences: 2, status: "Normal" },
        { id: 2, studentName: "Bruno Oliveira", class: "Maternal I", frequencyRate: 72, absences: 14, status: "Risco" },
        { id: 3, studentName: "Carla Dias", class: "Berçário II", frequencyRate: 82, absences: 8, status: "Normal" },
        { id: 4, studentName: "Gustavo Silva", class: "Maternal II", frequencyRate: 60, absences: 22, status: "Crítico" },
      ];
      setAttendanceList(mockData);
    } catch (error) {
      toast.error("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, []);

  const prepareData = (data) => {
    return data.map(item => ({
      ID: item.id,
      Aluno: item.studentName,
      Turma: item.class,
      "Frequência (%)": `${item.frequencyRate}%`,
      Faltas: item.absences,
      Status: item.status
    }));
  };

  const exportToXLSX = (dataToExport) => {
    if (!dataToExport || dataToExport.length === 0) return toast.warn("Sem dados para exportar");
    
    const worksheet = XLSX.utils.json_to_sheet(prepareData(dataToExport));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Frequência");
    XLSX.writeFile(workbook, `frequencia_creche_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast.success("Arquivo Excel (.xlsx) gerado com sucesso!"); // Mensagem corrigida
  };

  const exportToPDF = (dataToExport) => {
    if (!dataToExport || dataToExport.length === 0) return toast.warn("Sem dados para exportar");

    try {
      const doc = new jsPDF();
      doc.text("Relatório de Frequência - Creche Amor e Luz", 14, 15);
      
      const tableColumn = ["ID", "Aluno", "Turma", "Freq %", "Faltas", "Status"];
      const tableRows = dataToExport.map(item => [
        item.id, 
        item.studentName, 
        item.class, 
        `${item.frequencyRate}%`, 
        item.absences, 
        item.status
      ]);

      autoTable(doc,{
        head: [tableColumn],
        body: tableRows,
        startY: 25,
        theme: 'grid',
        headStyles: { fillColor: [30, 64, 175] } 
      });

      doc.save(`relatorio_creche_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("Documento PDF (.pdf) gerado com sucesso!"); // Mensagem corrigida
    } catch (error) {
      console.error("Erro no PDF:", error);
      toast.error("Falha ao gerar PDF. Verifique o console.");
    }
  };

  const exportToCSV = (dataToExport) => {
    if (!dataToExport || dataToExport.length === 0) return toast.warn("Sem dados para exportar");
    
    const headers = ["ID", "Aluno", "Turma", "Freq", "Faltas", "Status"];
    const csvContent = "\uFEFF" + [headers.join(","), ...dataToExport.map(i => [
      i.id, i.studentName, i.class, i.frequencyRate, i.absences, i.status
    ].join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `frequencia_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();    
    toast.success("Arquivo CSV (.csv) gerado com sucesso!");
  };

  return (
    <AttendanceContext.Provider value={{ 
      attendanceList, 
      loading,
      exportToXLSX, 
      exportToPDF, 
      exportToCSV,      
      hiddenCreateAttendance,
      setHiddenCreateAttendance,
      editingAttendance,
      setViewingAttendance,
      viewingAttendance,
    }}>
      {children}
    </AttendanceContext.Provider>
  );
};