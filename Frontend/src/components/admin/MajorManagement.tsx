import React, { useState, useEffect } from "react";
import { useUniversity, University } from "../../contexts/UniversityContext";
import "../../styles.css";

interface MajorManagementProps {
  university: University;
  onClose: () => void;
}

const MajorManagement: React.FC<MajorManagementProps> = ({
  university,
  onClose,
}) => {
  const { universities, setUniversities } = useUniversity();
  const [majors, setMajors] = useState<string[]>([]);
  const [newMajor, setNewMajor] = useState("");

  useEffect(() => {
    // Initialize majors when university changes
    setMajors(university.majors || []);
  }, [university]);

  const handleAddMajor = async () => {
    if (!newMajor.trim()) {
      alert("Tên ngành không được để trống!");
      return;
    }

    if (majors.includes(newMajor.trim())) {
      alert("Ngành này đã tồn tại!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/majors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMajor.trim(),
          schoolId: university.id, // ID trường được lấy từ props
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi thêm ngành vào cơ sở dữ liệu");
      }

      const data = await response.json();
      setMajors(data.majors.map((major: any) => major.name)); // Cập nhật danh sách ngành từ API
      setNewMajor(""); // Reset input
      alert("Thêm ngành thành công!");
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi thêm ngành");
    }
  };

  const handleRemoveMajor = (majorToRemove: string) => {
    setMajors(majors.filter((major) => major !== majorToRemove));
  };

  const handleSave = () => {
    const updatedUniversities = universities.map((uni) =>
      uni.id === university.id ? { ...uni, majors } : uni
    );
    setUniversities(updatedUniversities);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddMajor();
    }
  };

  return (
    <div className="major-management-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h4>Quản lý ngành học - {university.name}</h4>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="add-major-section">
            <input
              type="text"
              value={newMajor}
              onChange={(e) => setNewMajor(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tên ngành mới"
              className="major-input"
            />
            <button onClick={handleAddMajor} className="add-major-button">
              Thêm ngành
            </button>
          </div>
          <div className="majors-list">
            {majors.map((major, index) => (
              <div key={index} className="major-item">
                <span>{major}</span>
                <button
                  onClick={() => handleRemoveMajor(major)}
                  className="remove-major-button"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={handleSave} className="save-button">
            Lưu thay đổi
          </button>
          <button onClick={onClose} className="cancel-button">
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default MajorManagement;
