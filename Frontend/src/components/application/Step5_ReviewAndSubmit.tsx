// hiển thị tóm tắt dữ liệu biểu mẫu và nút gửi.
import React from 'react';
import { FormData } from '../../types';
import '../../styles.css';

interface Step5Props {
  formData: FormData;
  prevStep: () => void;
  submitForm: () => void;
}

const Step5_ReviewAndSubmit: React.FC<Step5Props> = ({ formData, prevStep, submitForm }) => (
  <div className="form-step">
    <h2>Xem lại và gửi hồ sơ</h2>
    <p><strong>Trường:</strong> {formData.school}</p>
    <p><strong>Ngành:</strong> {formData.major}</p>
    <p><strong>Tổ hợp:</strong> {formData.examCombination}</p>
    <p><strong>Họ tên:</strong> {formData.personalInfo.name}</p>
    <p><strong>Ngày sinh:</strong> {formData.personalInfo.dateOfBirth}</p>
    <p><strong>Địa chỉ:</strong> {formData.personalInfo.address}</p>
     <p><strong>Dân tộc:</strong> {formData.personalInfo.ethnicity}</p>
    <p><strong>Số điện thoại:</strong> {formData.personalInfo.phone}</p>
    <p><strong>CCCD:</strong> {formData.personalInfo.cccd}</p>
    <p><strong>Điểm:</strong> {JSON.stringify(formData.scores)}</p>
    <p><strong>Ưu tiên:</strong> {formData.priorityCategories.join(', ')}</p>
    <p><strong>Minh chứng:</strong> {formData.documents.map(file => file.name).join(', ')}</p>
    <div className="form-navigation">
      <button className="prev-button" onClick={prevStep}>Quay lại</button>
      <button className="submit-button" onClick={submitForm}>Gửi hồ sơ</button>
    </div>
  </div>
);

export default Step5_ReviewAndSubmit;