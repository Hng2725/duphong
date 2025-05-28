import React, { useState } from "react";
import { FormData, FormDataSetter, SemesterKey, SubjectKey } from "../../types";
import CommonLayout from "./CommonLayout";
import { useUniversity } from "../../contexts/UniversityContext";
import "../../styles/CombinedForm.css";
import "../../styles/Upload.css";

interface TranscriptFormProps {
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
  setFormData: FormDataSetter;
  nextStep: () => void;
}

const TranscriptForm: React.FC<TranscriptFormProps> = ({
  setFormData,
  nextStep,
  setPage,
  currentUser,
}) => {
  const { universities } = useUniversity();
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

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "documents" | "documents2" | "documents3"
  ) => {
    const files = Array.from(e.target.files || []);
    setLocalData((prev) => ({
      ...prev,
      [field]: files,
    }));
  };

  const handleRemoveFile = (
    field: "documents" | "documents2" | "documents3",
    index: number
  ) => {
    setLocalData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }));
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

    if (name === "cccd" || name === "phone") {
      if (/\D/.test(value)) {
        setErrors((prev) => ({ ...prev, [name]: " * Chỉ được nhập số" }));
        updatedValue = value.replace(/\D/g, "");
      } else {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }

    setLocalData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [name]: updatedValue },
    }));
  };

  const handleTranscriptScoreChange = (
    semester: SemesterKey,
    subject: SubjectKey,
    value: string
  ) => {
    const score = parseFloat(value);
    if (value === "" || (!isNaN(score) && score >= 0 && score <= 10)) {
      setLocalData((prev) => ({
        ...prev,
        transcriptScores: {
          ...prev.transcriptScores,
          [semester]: {
            ...prev.transcriptScores[semester],
            [subject]: value,
          },
        },
      }));
    }
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    console.log("Priority selected:", value);
    setLocalData((prev) => {
      const newData = {
        ...prev,
        priorityCategories: value ? [value] : [],
      };
      console.log("Updated localData:", newData);
      return newData;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if priority category is selected
    if (
      !localData.priorityCategories ||
      localData.priorityCategories.length === 0 ||
      !localData.priorityCategories[0]
    ) {
      alert("Vui lòng chọn đối tượng ưu tiên");
      return;
    }

    // Check if all transcript scores are filled and valid
    const semesters: SemesterKey[] = [
      "semester1Grade12",
      "semester2Grade12",
      "semester1Grade11",
      "semester2Grade11",
    ];
    const subjects: SubjectKey[] = [
      "math",
      "literature",
      "english",
      "physics",
      "chemistry",
      "biology",
    ];

    for (const semester of semesters) {
      for (const subject of subjects) {
        const score = localData.transcriptScores[semester][subject];
        if (!score) {
          alert(`Vui lòng nhập điểm ${subject} cho ${semester}`);
          return;
        }
        const numScore = parseFloat(score);
        if (isNaN(numScore) || numScore < 0 || numScore > 10) {
          alert(`Điểm ${subject} cho ${semester} phải từ 0 đến 10`);
          return;
        }
      }
    }

    // Check if required documents are uploaded
    if (!localData.documents || localData.documents.length === 0) {
      alert("Vui lòng tải lên học bạ THPT");
      return;
    }

    if (!localData.documents2 || localData.documents2.length === 0) {
      alert("Vui lòng tải lên CCCD/CMND");
      return;
    }

    // Set form data with examCombination explicitly set to empty string for transcript-based applications
    setFormData({
      ...localData,
      examCombination: "", // Use empty string for transcript-based applications
    });
    nextStep();
  };

  return (
    <CommonLayout
      setPage={setPage}
      currentUser={currentUser}
      activePage="apply-transcript"
    >
      <form className="combined-form" onSubmit={handleSubmit}>
        <h2>Đăng ký xét tuyển học bạ</h2>

        {/* Thông tin cá nhân */}
        <div className="form-section">
          <h3>A. Thông tin cá nhân</h3>
          <input
            type="text"
            name="name"
            placeholder="Họ tên"
            value={localData.personalInfo.name}
            onChange={handlePersonalInfoChange}
            required
          />
          <select
            name="gender"
            value={localData.personalInfo.gender}
            onChange={handlePersonalInfoChange}
            required
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
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={localData.personalInfo.address}
            onChange={handlePersonalInfoChange}
            required
          />
          <div className="input-wrapper">
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại"
              value={localData.personalInfo.phone}
              onChange={handlePersonalInfoChange}
              pattern="\d{10}"
              title="Vui lòng nhập 10 chữ số"
              maxLength={10}
              required
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
              pattern="\d{12}"
              title="Vui lòng nhập 12 chữ số"
              maxLength={12}
              required
            />
            {errors.cccd && <span className="error-text">{errors.cccd}</span>}
          </div>
          <input
            type="text"
            name="ethnicity"
            placeholder="Dân tộc"
            value={localData.personalInfo.ethnicity}
            onChange={handlePersonalInfoChange}
            required
          />
        </div>

        {/* Chọn trường và ngành */}
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
        </div>

        {/* Điểm học bạ */}
        <div className="form-section">
          <h3>C. Điểm học bạ</h3>

          {/* Lớp 12 - Học kỳ 1 */}
          <div className="semester-section">
            <h4>Lớp 12 - Học kỳ 1</h4>
            <div className="grades-grid">
              <input
                type="number"
                placeholder="Điểm Toán"
                value={localData.transcriptScores.semester1Grade12.math}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester1Grade12",
                    "math",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Văn"
                value={localData.transcriptScores.semester1Grade12.literature}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester1Grade12",
                    "literature",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Anh"
                value={localData.transcriptScores.semester1Grade12.english}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester1Grade12",
                    "english",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Lý"
                value={localData.transcriptScores.semester1Grade12.physics}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester1Grade12",
                    "physics",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Hóa"
                value={localData.transcriptScores.semester1Grade12.chemistry}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester1Grade12",
                    "chemistry",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Sinh"
                value={localData.transcriptScores.semester1Grade12.biology}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester1Grade12",
                    "biology",
                    e.target.value
                  )
                }
                required
              />
            </div>
          </div>

          {/* Lớp 12 - Học kỳ 2 */}
          <div className="semester-section">
            <h4>Lớp 12 - Học kỳ 2</h4>
            <div className="grades-grid">
              <input
                type="number"
                placeholder="Điểm Toán"
                value={localData.transcriptScores.semester2Grade12.math}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester2Grade12",
                    "math",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Văn"
                value={localData.transcriptScores.semester2Grade12.literature}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester2Grade12",
                    "literature",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Anh"
                value={localData.transcriptScores.semester2Grade12.english}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester2Grade12",
                    "english",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Lý"
                value={localData.transcriptScores.semester2Grade12.physics}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester2Grade12",
                    "physics",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Hóa"
                value={localData.transcriptScores.semester2Grade12.chemistry}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester2Grade12",
                    "chemistry",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Sinh"
                value={localData.transcriptScores.semester2Grade12.biology}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester2Grade12",
                    "biology",
                    e.target.value
                  )
                }
                required
              />
            </div>
          </div>

          {/* Lớp 11 - Học kỳ 1 */}
          <div className="semester-section">
            <h4>Lớp 11 - Học kỳ 1</h4>
            <div className="grades-grid">
              <input
                type="number"
                placeholder="Điểm Toán"
                value={localData.transcriptScores.semester1Grade11.math}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester1Grade11",
                    "math",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Văn"
                value={localData.transcriptScores.semester1Grade11.literature}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester1Grade11",
                    "literature",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Anh"
                value={localData.transcriptScores.semester1Grade11.english}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester1Grade11",
                    "english",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Lý"
                value={localData.transcriptScores.semester1Grade11.physics}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester1Grade11",
                    "physics",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Hóa"
                value={localData.transcriptScores.semester1Grade11.chemistry}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester1Grade11",
                    "chemistry",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Sinh"
                value={localData.transcriptScores.semester1Grade11.biology}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester1Grade11",
                    "biology",
                    e.target.value
                  )
                }
                required
              />
            </div>
          </div>

          {/* Lớp 11 - Học kỳ 2 */}
          <div className="semester-section">
            <h4>Lớp 11 - Học kỳ 2</h4>
            <div className="grades-grid">
              <input
                type="number"
                placeholder="Điểm Toán"
                value={localData.transcriptScores.semester2Grade11.math}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester2Grade11",
                    "math",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Văn"
                value={localData.transcriptScores.semester2Grade11.literature}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester2Grade11",
                    "literature",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Anh"
                value={localData.transcriptScores.semester2Grade11.english}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester2Grade11",
                    "english",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Lý"
                value={localData.transcriptScores.semester2Grade11.physics}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester2Grade11",
                    "physics",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Hóa"
                value={localData.transcriptScores.semester2Grade11.chemistry}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester2Grade11",
                    "chemistry",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Điểm Sinh"
                value={localData.transcriptScores.semester2Grade11.biology}
                min="0"
                max="10"
                step="0.1"
                onChange={(e) =>
                  handleTranscriptScoreChange(
                    "semester2Grade11",
                    "biology",
                    e.target.value
                  )
                }
                required
              />
            </div>
          </div>
        </div>

        {/* Đối tượng ưu tiên */}
        <div className="form-section">
          <h3>D. Đối tượng ưu tiên</h3>
          <select
            name="priorityCategory"
            value={localData.priorityCategories[0] || ""}
            onChange={handlePriorityChange}
            required
          >
            <option value="">Chọn đối tượng</option>
            <option value="Ưu tiên 1">Ưu tiên 1</option>
            <option value="Ưu tiên 2">Ưu tiên 2</option>
            <option value="Không ưu tiên">Không ưu tiên</option>
          </select>
        </div>

        {/* File upload section */}
        <div className="form-section">
          <h3>E. Tải lên minh chứng</h3>

          {/* First file upload */}
          <div className="form-group">
            <label>Học bạ THPT (PDF, JPEG, PNG)</label>
            <div className="file-input-container">
              <input
                type="file"
                accept=".pdf,.jpeg,.jpg,.png"
                multiple
                onChange={(e) => handleFileChange(e, "documents")}
                className="file-input"
                id="document-upload-1"
                required
              />
              <label htmlFor="document-upload-1" className="file-input-label">
                Chọn tệp...
              </label>
            </div>
            {localData.documents && localData.documents.length > 0 && (
              <div className="file-list-container">
                <h4>Các tệp đã chọn:</h4>
                <ul className="file-list">
                  {localData.documents.map((file: File, index: number) => (
                    <li key={`doc1-${index}`} className="file-list-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                      <button
                        type="button"
                        className="remove-file-button"
                        onClick={() => handleRemoveFile("documents", index)}
                      >
                        Xóa
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Second file upload */}
          <div className="form-group">
            <label>CCCD/CMND (PDF, JPEG, PNG)</label>
            <div className="file-input-container">
              <input
                type="file"
                accept=".pdf,.jpeg,.jpg,.png"
                multiple
                onChange={(e) => handleFileChange(e, "documents2")}
                className="file-input"
                id="document-upload-2"
                required
              />
              <label htmlFor="document-upload-2" className="file-input-label">
                Chọn tệp...
              </label>
            </div>
            {localData.documents2 && localData.documents2.length > 0 && (
              <div className="file-list-container">
                <h4>Các tệp đã chọn:</h4>
                <ul className="file-list">
                  {localData.documents2.map((file: File, index: number) => (
                    <li key={`doc2-${index}`} className="file-list-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                      <button
                        type="button"
                        className="remove-file-button"
                        onClick={() => handleRemoveFile("documents2", index)}
                      >
                        Xóa
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Third file upload */}
          <div className="form-group">
            <label>Giấy tờ khác (nếu có) (PDF, JPEG, PNG)</label>
            <div className="file-input-container">
              <input
                type="file"
                accept=".pdf,.jpeg,.jpg,.png"
                multiple
                onChange={(e) => handleFileChange(e, "documents3")}
                className="file-input"
                id="document-upload-3"
              />
              <label htmlFor="document-upload-3" className="file-input-label">
                Chọn tệp...
              </label>
            </div>
            {localData.documents3 && localData.documents3.length > 0 && (
              <div className="file-list-container">
                <h4>Các tệp đã chọn:</h4>
                <ul className="file-list">
                  {localData.documents3.map((file: File, index: number) => (
                    <li key={`doc3-${index}`} className="file-list-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                      <button
                        type="button"
                        className="remove-file-button"
                        onClick={() => handleRemoveFile("documents3", index)}
                      >
                        Xóa
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="next-button">
          Tiếp theo
        </button>
      </form>
    </CommonLayout>
  );
};

export default TranscriptForm;
