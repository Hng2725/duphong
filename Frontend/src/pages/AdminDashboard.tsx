import React, { useState } from "react";
import { FormData } from "../types";
import {
  useUniversity,
  University,
  ExamCombination,
} from "../contexts/UniversityContext";
import MajorManagement from "../components/admin/MajorManagement";
import ExamCombinationManagement from "../components/admin/ExamCombinationManagement";
import "../styles.css";

interface AdminDashboardProps {
  setPage: (page: string) => void;
  currentUser?: string | null;
  applications: FormData[];
  onUpdateStatus: (applicationId: number, newStatus: string) => void;
}

type UniversityFormData = Partial<Omit<University, "id">>;
type ExamCombinationFormData = Partial<Omit<ExamCombination, "id">>;
type FormDataType = UniversityFormData | ExamCombinationFormData;

const isUniversityForm = (data: FormDataType): data is UniversityFormData => {
  return "name" in data || "majors" in data;
};

const isExamCombinationForm = (
  data: FormDataType
): data is ExamCombinationFormData => {
  return "subjects" in data || "description" in data;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  setPage,
  currentUser,
  applications,
  onUpdateStatus,
}) => {
  const {
    universities,
    setUniversities,
    examCombinations,
    setExamCombinations,
  } = useUniversity();
  const [activeTab, setActiveTab] = useState<"applications" | "edit">(
    "applications"
  );
  const [editTab, setEditTab] = useState<"universities" | "combinations">(
    "universities"
  );
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState<
    University | ExamCombination | null
  >(null);
  const [formData, setFormData] = useState<FormDataType>({});
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);
  const [showExamCombinations, setShowExamCombinations] = useState(false);

  if (currentUser !== "admin") {
    return (
      <div className="unauthorized">
        <h2>Không có quyền truy cập</h2>
        <button onClick={() => setPage("dashboard")} className="back-button">
          Quay lại
        </button>
      </div>
    );
  }

  const handleAdd = () => {
    setEditingItem(null);
    setFormData(
      editTab === "universities"
        ? ({ majors: [], examCombinations: [] } as UniversityFormData)
        : ({} as ExamCombinationFormData)
    );
    setShowModal(true);
  };

  const handleEdit = (item: University | ExamCombination) => {
    setEditingItem(item);
    const { id, ...rest } = item;
    setFormData(rest);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (editTab === "universities") {
      setUniversities(universities.filter((uni) => uni.id !== id));
    } else {
      setExamCombinations(examCombinations.filter((combo) => combo.id !== id));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("subject")) {
      const subjectIndex = parseInt(name.replace("subject", "")) - 1;
      setFormData((prev) => {
        const currentForm = prev as ExamCombinationFormData;
        const subjects = [...(currentForm.subjects || ["", "", ""])];
        subjects[subjectIndex] = value;
        return {
          ...prev,
          subjects,
        };
      });
    } else if (name === "selectedUniversities") {
      // Xử lý khi chọn trường từ dropdown
      const selectedOptions = Array.from(
        (e.target as HTMLSelectElement).selectedOptions
      ).map((option) => option.value);
      setFormData((prev) => ({
        ...prev,
        selectedUniversities: selectedOptions,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (editTab === "universities") {
      const uniForm = formData as UniversityFormData;
      if (!uniForm.name?.trim()) return "Vui lòng nhập tên trường";
      if (!uniForm.code?.trim()) return "Vui lòng nhập mã trường";

      // Kiểm tra mã trường trùng lặp
      const existingUni = universities.find(
        (u) =>
          u.code === uniForm.code && (!editingItem || u.id !== editingItem.id)
      );
      if (existingUni) return "Mã trường đã tồn tại";
    } else {
      const examForm = formData as ExamCombinationFormData;
      if (!examForm.code?.trim()) return "Vui lòng nhập mã tổ hợp";
      if (!examForm.subjects?.length) return "Vui lòng nhập ít nhất một môn";
      if (!examForm.description?.trim()) return "Vui lòng nhập mô tả tổ hợp";

      // Kiểm tra mã tổ hợp trùng lặp
      const existingCombo = examCombinations.find(
        (c) =>
          c.code === examForm.code && (!editingItem || c.id !== editingItem.id)
      );
      if (existingCombo) return "Mã tổ hợp đã tồn tại";
    }
    return null;
  };

  const handleSave = () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    if (editTab === "universities" && isUniversityForm(formData)) {
      const universityData = formData as UniversityFormData;
      if (editingItem) {
        setUniversities(
          universities.map((uni) =>
            uni.id === editingItem.id
              ? ({ ...universityData, id: uni.id } as University)
              : uni
          )
        );
      } else {
        setUniversities([
          ...universities,
          {
            ...universityData,
            id: universities.length + 1,
            majors: universityData.majors || [],
            examCombinations: universityData.examCombinations || [],
          } as University,
        ]);
      }
    } else if (editTab === "combinations" && isExamCombinationForm(formData)) {
      const combinationData = formData as ExamCombinationFormData;
      const selectedUniversities = (formData as any).selectedUniversities || [];
      const combinationCode = combinationData.code || "";

      // Cập nhật tổ hợp
      if (editingItem) {
        setExamCombinations(
          examCombinations.map((combo) =>
            combo.id === editingItem.id
              ? ({ ...combinationData, id: combo.id } as ExamCombination)
              : combo
          )
        );
      } else {
        setExamCombinations([
          ...examCombinations,
          {
            ...combinationData,
            id: examCombinations.length + 1,
          } as ExamCombination,
        ]);
      }

      // Cập nhật danh sách tổ hợp trong các trường được chọn
      const updatedUniversities = universities.map((uni) => {
        const currentCombinations = uni.examCombinations || [];

        if (selectedUniversities.includes(uni.code)) {
          // Thêm tổ hợp nếu trường được chọn và chưa có tổ hợp này
          if (!currentCombinations.includes(combinationCode)) {
            return {
              ...uni,
              examCombinations: [...currentCombinations, combinationCode],
            } as University;
          }
        } else {
          // Loại bỏ tổ hợp nếu trường không được chọn
          return {
            ...uni,
            examCombinations: currentCombinations.filter(
              (code) => code !== combinationCode
            ),
          } as University;
        }
        return uni;
      });

      setUniversities(updatedUniversities);
    }
    setShowModal(false);
    setFormData({});
  };

  const renderModal = () => {
    const universityForm =
      editTab === "universities" ? (formData as UniversityFormData) : null;
    const examForm =
      editTab === "combinations" ? (formData as ExamCombinationFormData) : null;

    // Khởi tạo mảng subjects với 3 phần tử nếu chưa có
    const subjects = examForm?.subjects || ["", "", ""];

    // Lấy danh sách các trường đã chọn tổ hợp này
    const selectedUniversities = universities
      .filter((uni) => uni.examCombinations?.includes(examForm?.code || ""))
      .map((uni) => uni.code);

    return (
      <div className="admin-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h4>{editingItem ? "Chỉnh sửa" : "Thêm mới"}</h4>
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
          </div>
          <div className="modal-form">
            {editTab === "universities" ? (
              <>
                <div className="form-group">
                  <label>Tên trường:</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Tên trường"
                    value={universityForm?.name || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Mã trường:</label>
                  <input
                    type="text"
                    name="code"
                    placeholder="Mã trường"
                    value={formData.code || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Mã tổ hợp:</label>
                  <input
                    type="text"
                    name="code"
                    placeholder="Mã tổ hợp (VD: A00, B00)"
                    value={examForm?.code || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Các môn thi:</label>
                  <div className="subjects-inputs">
                    <div className="subject-input">
                      <label>Môn 1:</label>
                      <input
                        type="text"
                        name="subject1"
                        placeholder="Nhập môn thi thứ nhất"
                        value={subjects[0]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="subject-input">
                      <label>Môn 2:</label>
                      <input
                        type="text"
                        name="subject2"
                        placeholder="Nhập môn thi thứ hai"
                        value={subjects[1]}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="subject-input">
                      <label>Môn 3:</label>
                      <input
                        type="text"
                        name="subject3"
                        placeholder="Nhập môn thi thứ ba"
                        value={subjects[2]}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Mô tả:</label>
                  <textarea
                    name="description"
                    placeholder="Mô tả tổ hợp"
                    value={examForm?.description || ""}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label>Áp dụng cho các trường:</label>
                  <select
                    name="selectedUniversities"
                    multiple
                    value={selectedUniversities}
                    onChange={handleInputChange}
                    className="universities-select"
                  >
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.code}>
                        {uni.name} ({uni.code})
                      </option>
                    ))}
                  </select>
                  <small className="select-hint">
                    Giữ Ctrl (Windows) hoặc Command (Mac) để chọn nhiều trường
                  </small>
                </div>
              </>
            )}
            <div className="modal-footer">
              <button onClick={handleSave} className="save-button">
                {editingItem ? "Cập nhật" : "Thêm mới"}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="cancel-button"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEditContent = () => {
    const filteredItems =
      editTab === "universities"
        ? universities.filter((uni) =>
            uni.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : examCombinations.filter((combo) =>
            combo.code.toLowerCase().includes(searchTerm.toLowerCase())
          );

    return (
      <div className="edit-content">
        <div className="edit-header">
          <div className="edit-tabs">
            <button
              className={editTab === "universities" ? "active" : ""}
              onClick={() => setEditTab("universities")}
            >
              Quản lý trường
            </button>
            <button
              className={editTab === "combinations" ? "active" : ""}
              onClick={() => setEditTab("combinations")}
            >
              Quản lý tổ hợp
            </button>
          </div>
          <div className="search-add">
            <input
              type="text"
              placeholder={
                editTab === "universities"
                  ? "Tìm kiếm trường..."
                  : "Tìm kiếm tổ hợp..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleAdd} className="add-button">
              Thêm mới
            </button>
          </div>
        </div>

        <div className="items-list">
          {filteredItems.map((item) => (
            <div key={item.id} className="item-card">
              {editTab === "universities" ? (
                <>
                  <h3>{(item as University).name}</h3>
                  <p>Mã trường: {item.code}</p>
                  <div className="university-actions">
                    <p>
                      Số ngành: {(item as University).majors.length}
                      <button
                        onClick={() =>
                          setSelectedUniversity(item as University)
                        }
                        className="manage-button manage-majors-button"
                      >
                        Quản lý ngành
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h3>Tổ hợp {item.code}</h3>
                  <div className="combo-details">
                    <p className="subjects">
                      <strong>Môn thi:</strong>{" "}
                      {(item as ExamCombination).subjects.map(
                        (subject, idx) => (
                          <span key={idx} className="subject-tag">
                            {subject}
                          </span>
                        )
                      )}
                    </p>
                    <p className="description">
                      <strong>Mô tả:</strong>{" "}
                      {(item as ExamCombination).description}
                    </p>
                    <div className="universities-using">
                      <strong>Các trường sử dụng:</strong>
                      <div className="university-tags">
                        {universities
                          .filter((uni) =>
                            uni.examCombinations?.includes(item.code)
                          )
                          .map((uni) => (
                            <span key={uni.id} className="university-tag">
                              {uni.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="item-actions">
                <button onClick={() => handleEdit(item)}>Sửa</button>
                <button onClick={() => handleDelete(item.id)}>Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderApplicationsTab = () => (
    <div className="applications-list">
      {applications.length === 0 ? (
        <div className="no-applications">
          <p>Chưa có hồ sơ xét tuyển nào.</p>
        </div>
      ) : (
        applications.map((application, index) => (
          <div key={index} className="admin-application-card">
            <div className="application-header">
              <h3>Hồ sơ #{index + 1}</h3>
              <div className="status-controls">
                <select
                  value={application.status}
                  onChange={(e) => onUpdateStatus(index, e.target.value)}
                  className="status-select"
                >
                  <option value="Chờ duyệt">Chờ duyệt</option>
                  <option value="Đã duyệt">Duyệt</option>
                  <option value="Từ chối">Từ chối</option>
                </select>
              </div>
            </div>

            <div className="application-details">
              <div className="detail-section">
                <h4>Thông tin cá nhân</h4>
                <div className="info-grid">
                  {application.personalInfo ? (
                    <>
                      <p>
                        <strong>Họ tên:</strong> {application.personalInfo.name}
                      </p>
                      <p>
                        <strong>CCCD:</strong> {application.personalInfo.cccd}
                      </p>
                      <p>
                        <strong>Ngày sinh:</strong>{" "}
                        {application.personalInfo.dateOfBirth}
                      </p>
                      <p>
                        <strong>Giới tính:</strong>{" "}
                        {application.personalInfo.gender}
                      </p>
                    </>
                  ) : (
                    <p>Thông tin cá nhân không khả dụng.</p>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h4>Thông tin đăng ký</h4>
                <div className="info-grid">
                  <p>
                    <strong>Trường:</strong> {application.school}
                  </p>
                  <p>
                    <strong>Ngành:</strong> {application.major}
                  </p>
                  <p>
                    <strong>Tổ hợp xét tuyển:</strong>{" "}
                    {application.examCombination}
                  </p>
                </div>
              </div>

              <div className="detail-section">
                <h4>Điểm xét tuyển</h4>
                <div className="info-grid">
                  {application.transcriptScores ? (
                    <>
                      <p>
                        <strong>Học kỳ 1 - Lớp 12:</strong>
                      </p>
                      {Object.entries(
                        application.transcriptScores.semester1Grade12
                      ).map(([subject, score]) => (
                        <p key={subject}>
                          <strong>{subject}:</strong> {score}
                        </p>
                      ))}
                    </>
                  ) : application.scores ? (
                    Object.entries(application.scores).map(
                      ([subject, score]) => (
                        <p key={subject}>
                          <strong>{subject}:</strong> {score}
                        </p>
                      )
                    )
                  ) : (
                    <p>Không có điểm xét tuyển.</p>
                  )}
                </div>
              </div>

              <div className="submission-info">
                <p>
                  <strong>Ngày nộp:</strong> {application.submissionDate}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h2>Trang quản trị</h2>
        <div className="admin-nav">
          <button
            className={activeTab === "applications" ? "active" : ""}
            onClick={() => setActiveTab("applications")}
          >
            Hồ sơ
          </button>
          <button
            className={activeTab === "edit" ? "active" : ""}
            onClick={() => setActiveTab("edit")}
          >
            Chỉnh sửa
          </button>
          <button onClick={() => setPage("logout")}>Đăng xuất</button>
        </div>
      </div>

      {activeTab === "applications"
        ? renderApplicationsTab()
        : renderEditContent()}

      {showModal && renderModal()}

      {selectedUniversity && (
        <MajorManagement
          university={selectedUniversity}
          onClose={() => setSelectedUniversity(null)}
        />
      )}

      {showExamCombinations && selectedUniversity && (
        <ExamCombinationManagement
          university={selectedUniversity}
          onClose={() => {
            setShowExamCombinations(false);
            setSelectedUniversity(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
