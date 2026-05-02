import styles from "./style.module.scss";
import { useState, useRef, useEffect } from "react";

export const AttendanceFilter = ({
  searchName,
  setSearchName,
  selectedClass,
  setSelectedClass,
  selectedPeriod,
  setSelectedPeriod,
  selectedFilter,
  setSelectedFilter,
  classes = [],
  studentsForSuggestions = [], 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  
  const suggestions = studentsForSuggestions.filter(student => {    
    const matchesName = searchName && student.name.toLowerCase().includes(searchName.toLowerCase());
    if (!matchesName) return false;
    
    const matchesClass = selectedClass === "all" || student.turma === selectedClass;
    if (!matchesClass) return false;
    
    const matchesPeriod = selectedPeriod === "all" || student.periodo === selectedPeriod;
    if (!matchesPeriod) return false;
    
    const matchesStatus = 
      selectedFilter === "all" || 
      (selectedFilter === "risk" && student.frequencyRate < 75) ||
      (selectedFilter === "warning" && student.frequencyRate >= 75 && student.frequencyRate <= 85) ||
      (selectedFilter === "perfect" && student.frequencyRate === 100);
    if (!matchesStatus) return false;

    return true;
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSuggestion = (student) => {
    setSearchName(student.name); 
    setShowSuggestions(false); 
  };

  return (
    <div className={styles.filterContainer}>
      <fieldset className={styles.filterFieldset}>
        <legend>Busca e Filtros Avançados</legend>
        
        <div className={styles.filterLayout}>
          <div className={styles.inputsColumn}>            
            
            <div className={styles.inputGroup} ref={wrapperRef}>
              <label>Nome do Aluno:</label>
              <div className={styles.autocompleteWrapper}>
                <input 
                  type="text" 
                  placeholder="Pesquisar por nome do aluno..." 
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    setShowSuggestions(true); 
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
                
                {showSuggestions && searchName && suggestions.length > 0 && (
                  <ul className={styles.suggestionsList}>
                    {suggestions.map((student) => (
                      <li key={student.id} onMouseDown={() => handleSelectSuggestion(student)}>
                        <span className={styles.suggName}>{student.name}</span>
                        <span className={styles.suggClass}>{student.turma} • {student.periodo}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className={styles.rowInputs}>
              <div className={styles.inputGroup}>
                <label>Turma:</label>
                <select value={selectedClass} onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setSearchName(""); 
                }}>
                  <option value="all">Todas</option>
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Período:</label>
                <select value={selectedPeriod} onChange={(e) => {
                  setSelectedPeriod(e.target.value);
                  setSearchName(""); 
                }}>
                  <option value="all">Todos</option>
                  <option value="Matutino">Matutino</option>
                  <option value="Vespertino">Vespertino</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.statusColumn}>
            <label className={styles.statusTitle}>Assiduidade:</label>
            <div className={styles.statusCardsGroup}>
              {[
                { id: "all", label: "Todos", sub: "Geral" },
                { id: "risk", label: "Risco", sub: "<75%" },
                { id: "warning", label: "Atenção", sub: "75-85%" },
                { id: "perfect", label: "100%", sub: "Frequência" }
              ].map((item) => (
                <label 
                  key={item.id} 
                  className={`${styles.statusCard} ${selectedFilter === item.id ? styles.activeCard : ""}`}
                >
                  <input 
                    type="radio" 
                    name="attFilter" 
                    value={item.id} 
                    checked={selectedFilter === item.id} 
                    onChange={(e) => {
                      setSelectedFilter(e.target.value);
                      setSearchName(""); 
                    }} 
                  />
                  <span className={styles.cardLabel}>{item.label}</span>
                  <span className={styles.cardSub}>{item.sub}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};