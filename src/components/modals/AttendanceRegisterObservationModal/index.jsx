import { useState, useEffect } from "react";

export const AttendanceRegisterObservationModal = ({ isOpen, onClose, studentName, initialObs, onSave }) => {
  const [obs, setObs] = useState("");
  
  useEffect(() => {
    if (isOpen) {
      setObs(initialObs || "");
    }
  }, [isOpen, initialObs]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(obs);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999 }}>
      <div style={{ backgroundColor: '#ffffff', width: '90%', maxWidth: '400px', padding: '25px', borderRadius: '8px', boxShadow: '0px 10px 30px rgba(0,0,0,0.1)' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f3f5', paddingBottom: '15px', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, color: '#343b41', fontSize: '1.2rem' }}>Observação</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#adb5bd', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
        </header>

        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '10px' }}>
          Adicionando observação para: <strong>{studentName}</strong>
        </p>

        <textarea
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          placeholder="Digite a observação aqui..."
          rows={4}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none', resize: 'none', backgroundColor: '#f8fafc', marginBottom: '20px' }}
          autoFocus
        />

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '10px 15px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Cancelar
          </button>
          <button onClick={handleSave} style={{ padding: '10px 15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            Salvar
          </button>
        </div>

      </div>
    </div>
  );
};