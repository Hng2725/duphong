import React, { useState } from "react";
import { FormData } from "../../types";
import CommonLayout from "./CommonLayout";
import { useUniversity } from "../../contexts/UniversityContext";
import "../../styles/CombinedForm.css";

interface CombinedFormProps {
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  nextStep: () => void;
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
}

const CombinedForm: React.FC<CombinedFormProps> = ({
  setFormData,
  nextStep,
  setPage,
  currentUser,
}) => {
  const { universities, examCombinations } = useUniversity();
  const [selectedSchool, setSelectedSchool] = useState("");
  const [localData, setLocalData] = useState<FormData>({
    school: "",
    major: "",
    examCombination: "",
    personalInfo: {
      name: "",
      dateOfBirth: "",
      address: "",
      phone: "",
      cccd: "",
      ethnicity: "",
      gender: "",
    },
    scores: {},
    transcriptScores: {
      semester1Grade12: {
        math: "",
        literature: "",
        english: "",
        physics: "",
        chemistry: "",
        biology: "",
      },
      semester2Grade12: {
        math: "",
        literature: "",
        english: "",
        physics: "",
        chemistry: "",
        biology: "",
      },
      semester1Grade11: {
        math: "",
        literature: "",
        english: "",
        physics: "",
        chemistry: "",
        biology: "",
      },
      semester2Grade11: {
        math: "",
        literature: "",
        english: "",
        physics: "",
        chemistry: "",
        biology: "",
      },
    },
    priorityCategories: [],
    documents: [],
    documents2: [],
    documents3: [],
    status: "Chờ duyệt",
    submissionDate: new Date().toLocaleDateString(),
  });

  const [errors, setErrors] = useState<{ cccd?: string; phone?: string }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "school") {
      setSelectedSchool(value);
      setLocalData((prev) => ({
        ...prev,
        school: value,
        major: "", // Reset major when school changes
      }));
    } else {
      setLocalData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Get the selected university's majors
  const selectedUniversity = universities.find(
    (uni) => uni.name === selectedSchool
  );
  const availableMajors = selectedUniversity?.majors || [];

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let updatedValue = value;

    // Kiểm tra lỗi cho CCCD và phone
    if (name === "cccd" || name === "phone") {
      if (/\D/.test(value)) {
        // Nếu có ký tự không phải số
        setErrors((prev) => ({ ...prev, [name]: " * Chỉ được nhập số" }));
        updatedValue = value.replace(/\D/g, ""); // Loại bỏ ký tự không phải số
      } else {
        setErrors((prev) => ({ ...prev, [name]: undefined })); // Xóa lỗi nếu hợp lệ
      }
    }

    setLocalData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: updatedValue },
    }));
  };

  const handleScoreChange = (subject: string, value: string) => {
    setLocalData((prev) => ({
      ...prev,
      scores: { ...prev.scores, [subject]: parseFloat(value) },
    }));
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalData((prev) => ({
      ...prev,
      priorityCategories: [e.target.value],
    }));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("text");
    if (!/^\d*$/.test(pastedText)) {
      e.preventDefault(); // Ngăn dán nếu không phải số
      setErrors((prev) => ({
        ...prev,
        [e.currentTarget.name]: " Chỉ được nhập số",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (e.currentTarget.checkValidity()) {
      setFormData(localData);
      nextStep();
    }
  };

  return (
    <CommonLayout
      setPage={setPage}
      currentUser={currentUser}
      activePage="apply"
    >
      <form className="combined-form" onSubmit={handleSubmit}>
        <h2>Đăng ký xét tuyển</h2>

        {/* Thông tin cá nhân */}
        <div className="form-section">
          <h3>A. Thông tin cá nhân</h3>
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={localData.personalInfo.name}
            onChange={handlePersonalInfoChange}
          />
          <select
            name="gender"
            value={localData.personalInfo.gender}
            onChange={handlePersonalInfoChange}
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
          <input
            type="date"
            name="dateOfBirth"
            value={localData.personalInfo.dateOfBirth}
            onChange={handlePersonalInfoChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={localData.personalInfo.address}
            onChange={handlePersonalInfoChange}
          />
          <div className="input-wrapper">
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={localData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
              onPaste={handlePaste}
              pattern="\d{10}"
              title="Vui lòng nhập 10 chữ số"
              maxLength={10}
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              name="cccd"
              placeholder="Số CCCD"
              value={localData.personalInfo.cccd}
              onChange={handlePersonalInfoChange}
              onPaste={handlePaste}
              pattern="\d{12}"
              title="Vui lòng nhập 12 chữ số"
              maxLength={12}
              inputMode="numeric"
            />
            {errors.cccd && <span className="error-text">{errors.cccd}</span>}
          </div>
          <input
            type="text"
            name="ethnicity"
            placeholder="Dân tộc"
            value={localData.personalInfo.ethnicity}
            onChange={handlePersonalInfoChange}
          />
        </div>

        {/* Chọn trường, ngành, tổ hợp */}
        <div className="form-section">
          <h3>B. Chọn trường và ngành</h3>
          <select
            name="school"
            value={localData.school}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn trường</option>
            {universities.map((uni) => (
              <option key={uni.id} value={uni.name}>
                {uni.name}
              </option>
            ))}
          </select>

          <select
            name="major"
            value={localData.major}
            onChange={handleInputChange}
            required
            disabled={!selectedSchool} // Disable if no school is selected
          >
            <option value="">Chọn ngành</option>
            {availableMajors.map((major) => (
              <option key={major} value={major}>
                {major}
              </option>
            ))}
          </select>

          <select
            name="examCombination"
            value={localData.examCombination}
            onChange={handleInputChange}
            required
          >
            <option value="">Chọn tổ hợp</option>
            {examCombinations.map((combo) => (
              <option key={combo.id} value={combo.code}>
                {combo.code} - {combo.description} ({combo.subjects.join(", ")})
              </option>
            ))}
          </select>
        </div>

        {/* Điểm thi */}
        <div className="form-section">
          <h3>C. Điểm thi</h3>
          <input
            type="number"
            placeholder="Điểm môn 1"
            onChange={(e) => handleScoreChange("subject1", e.target.value)}
          />
          <input
            type="number"
            placeholder="Điểm môn 2"
            onChange={(e) => handleScoreChange("subject2", e.target.value)}
          />
          <input
            type="number"
            placeholder="Điểm môn 3"
            onChange={(e) => handleScoreChange("subject3", e.target.value)}
          />
        </div>

        {/* Đối tượng ưu tiên */}
        <div className="form-section">
          <h3>D. Đối tượng ưu tiên</h3>
          <select onChange={handlePriorityChange}>
            <option value="">Chọn đối tượng</option>
            <option value="Ưu tiên 1">Ưu tiên 1</option>
            <option value="Ưu tiên 2">Ưu tiên 2</option>
            <option value="Không ưu tiên">Không ưu tiên</option>
          </select>
        </div>

        <button type="submit" className="next-button">
          Tiếp theo
        </button>
      </form>
    </CommonLayout>
  );
};

export default CombinedForm;
