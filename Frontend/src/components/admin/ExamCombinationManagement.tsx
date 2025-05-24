import React, { useState, useEffect } from "react";
import {
  useUniversity,
  University,
  ExamCombination,
} from "../../contexts/UniversityContext";
import "../../styles.css";

interface ExamCombinationManagementProps {
  university: University;
  onClose: () => void;
}

const ExamCombinationManagement: React.FC<ExamCombinationManagementProps> = ({
  university,
  onClose,
}) => {
  const { examCombinations, universities, setUniversities } = useUniversity();
  const [selectedCombinations, setSelectedCombinations] = useState<string[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSelectedCombinations(university.examCombinations || []);
  }, [university]);

  const handleToggleCombination = (code: string) => {
    setSelectedCombinations((prev) => {
      if (prev.includes(code)) {
        return prev.filter((c) => c !== code);
      } else {
        return [...prev, code];
      }
    });
  };

  const handleSave = () => {
    const updatedUniversities = universities.map((uni: University) =>
      uni.id === university.id
        ? { ...uni, examCombinations: selectedCombinations }
        : uni
    );
    setUniversities(updatedUniversities);
    onClose();
  };

  const filteredCombinations = examCombinations.filter((combo) =>
    combo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="major-management-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h4>Quản lý tổ hợp xét tuyển - {university.name}</h4>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm tổ hợp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="combinations-list">
            {filteredCombinations.map((combo) => (
              <div key={combo.id} className="combination-item">
                <label className="combination-label">
                  <input
                    type="checkbox"
                    checked={selectedCombinations.includes(combo.code)}
                    onChange={() => handleToggleCombination(combo.code)}
                  />
                  <span className="combination-code">{combo.code}</span>
                  <span className="combination-subjects">
                    {combo.subjects.map((subject, idx) => (
                      <span key={idx} className="subject-tag">
                        {subject}
                      </span>
                    ))}
                  </span>
                  <span className="combination-description">
                    {combo.description}
                  </span>
                </label>
              </div>
            ))}
            {filteredCombinations.length === 0 && (
              <div className="no-results">Không tìm thấy tổ hợp phù hợp</div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <div className="selected-count">
            Đã chọn: {selectedCombinations.length} tổ hợp
          </div>
          <div className="modal-buttons">
            <button onClick={handleSave} className="save-button">
              Lưu thay đổi
            </button>
            <button onClick={onClose} className="cancel-button">
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCombinationManagement;
