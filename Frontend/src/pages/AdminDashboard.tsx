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
type ExamCombinationFormData = Partial<Omit<ExamCombination, "id">> & {
  subject1?: string;
  subject2?: string;
  subject3?: string;
};
type FormDataType = UniversityFormData | ExamCombinationFormData;

const isUniversityForm = (data: FormDataType): data is UniversityFormData => {
  return "name" in data || "majors" in data;
};

const isExamCombinationForm = (
  data: FormDataType
): data is ExamCombinationFormData => {
  return (
    "subject1" in data ||
    "subject2" in data ||
    "subject3" in data ||
    "description" in data
  );
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

  const handleDelete = async (id: number) => {
    try {
      if (editTab === "universities") {
        // Gọi API để xóa trường
        const response = await fetch(
          `http://localhost:5000/api/schools/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Lỗi khi xóa trường khỏi cơ sở dữ liệu");
        }

        const data = await response.json();
        setUniversities(data.schools); // Cập nhật danh sách trường từ API
      } else {
        setExamCombinations(
          examCombinations.filter((combo) => combo.id !== id)
        );
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi xóa dữ liệu");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "selectedUniversities") {
      // Xử lý khi chọn trường từ dropdown
      const selectedOptions = Array.from(
        (e.target as HTMLSelectElement).selectedOptions
      ).map((option) => option.value);
      setFormData((prev) => ({
        ...prev,
        selectedUniversities: selectedOptions,
      }));
    } else {
      // Cập nhật trực tiếp các trường subject1, subject2, subject3 hoặc các trường khác
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

  const handleSave = async () => {
    try {
      if (editTab === "universities" && isUniversityForm(formData)) {
        const universityData = formData as UniversityFormData;

        if (editingItem) {
          // Gọi API để sửa trường (PUT)
          const response = await fetch(
            `http://localhost:5000/api/schools/${editingItem.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ schoolName: universityData.name }),
            }
          );

          if (!response.ok) {
            throw new Error("Lỗi khi sửa trường trong cơ sở dữ liệu");
          }

          const data = await response.json();
          setUniversities(data.schools); // Cập nhật danh sách trường từ API
        } else {
          // Gọi API để thêm trường mới (POST)
          const response = await fetch("http://localhost:5000/api/schools", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ schoolName: universityData.name }),
          });

          if (!response.ok) {
            throw new Error("Lỗi khi thêm trường vào cơ sở dữ liệu");
          }

          const data = await response.json();
          setUniversities(data.schools); // Cập nhật danh sách trường từ API
        }
      } else if (
        editTab === "combinations" &&
        isExamCombinationForm(formData)
      ) {
        const examCombinationData = formData as ExamCombinationFormData;

        if (editingItem) {
          // Gọi API để sửa tổ hợp (PUT)
          const response = await fetch(
            `http://localhost:5000/api/combinations/${editingItem.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(examCombinationData),
            }
          );

          if (!response.ok) {
            throw new Error("Lỗi khi sửa tổ hợp trong cơ sở dữ liệu");
          }

          const data = await response.json();
          setExamCombinations(data.combinations); // Cập nhật danh sách tổ hợp từ API
        } else {
          // Gọi API để thêm tổ hợp mới (POST)
          const response = await fetch(
            "http://localhost:5000/api/combinations",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(examCombinationData),
            }
          );

          if (!response.ok) {
            throw new Error("Lỗi khi thêm tổ hợp vào cơ sở dữ liệu");
          }

          const data = await response.json();
          setExamCombinations(data.combinations); // Cập nhật danh sách tổ hợp từ API
        }
      }

      setShowModal(false);
      setFormData({});
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi lưu dữ liệu");
    }
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
                        value={
                          (formData as ExamCombinationFormData).subject1 || ""
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="subject-input">
                      <label>Môn 2:</label>
                      <input
                        type="text"
                        name="subject2"
                        placeholder="Nhập môn thi thứ hai"
                        value={
                          (formData as ExamCombinationFormData).subject2 || ""
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="subject-input">
                      <label>Môn 3:</label>
                      <input
                        type="text"
                        name="subject3"
                        placeholder="Nhập môn thi thứ ba"
                        value={
                          (formData as ExamCombinationFormData).subject3 || ""
                        }
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
                      Số ngành:{" "}
                      {(item as University).majors
                        ? (item as University).majors.length
                        : 0}
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
                      <span className="subject-tag">
                        {(item as ExamCombination).subject1}
                      </span>
                      <span className="subject-tag">
                        {(item as ExamCombination).subject2}
                      </span>
                      <span className="subject-tag">
                        {(item as ExamCombination).subject3}
                      </span>
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
