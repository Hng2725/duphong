import React from "react";
import CommonLayout from "./CommonLayout";
import "../../styles/GuideRegistration.css";

interface GuideRegistrationProps {
  setPage: (page: string) => void;
  currentUser?: string | null | undefined;
}

const GuideRegistration: React.FC<GuideRegistrationProps> = ({
  setPage,
  currentUser,
}) => {
  return (
    <CommonLayout
      setPage={setPage}
      currentUser={currentUser}
      activePage="guide"
    >
      <div className="guide-container">
        <h1>Hướng dẫn đăng ký xét tuyển</h1>

        <section className="guide-section">
          <h2>1. Chuẩn bị hồ sơ</h2>
          <ul>
            <li>CCCD/CMND</li>
            <li>Học bạ THPT</li>
            <li>
              Giấy chứng nhận tốt nghiệp tạm thời hoặc Bằng tốt nghiệp THPT
            </li>
            <li>Các giấy tờ ưu tiên (nếu có)</li>
          </ul>
        </section>

        <section className="guide-section">
          <h2>2. Các bước đăng ký xét tuyển</h2>
          <ol>
            <li>
              <h3>Bước 1: Đăng nhập hệ thống</h3>
              <p>
                Đăng nhập vào hệ thống bằng tài khoản đã được cấp. Nếu chưa có
                tài khoản, vui lòng đăng ký tài khoản mới.
              </p>
            </li>
            <li>
              <h3>Bước 2: Điền thông tin cá nhân</h3>
              <p>
                Điền đầy đủ và chính xác các thông tin cá nhân theo yêu cầu
                trong form đăng ký.
              </p>
            </li>
            <li>
              <h3>Bước 3: Chọn ngành và tổ hợp xét tuyển</h3>
              <p>
                Lựa chọn ngành học và tổ hợp môn xét tuyển phù hợp với nguyện
                vọng của bạn.
              </p>
            </li>
            <li>
              <h3>Bước 4: Nhập điểm thi</h3>
              <p>
                Nhập chính xác điểm thi của các môn trong tổ hợp xét tuyển đã
                chọn.
              </p>
            </li>
            <li>
              <h3>Bước 5: Tải lên hồ sơ</h3>
              <p>Upload các giấy tờ cần thiết theo yêu cầu của trường.</p>
            </li>
            <li>
              <h3>Bước 6: Xác nhận và nộp hồ sơ</h3>
              <p>Kiểm tra lại thông tin và xác nhận nộp hồ sơ.</p>
            </li>
          </ol>
        </section>

        <section className="guide-section">
          <h2>3. Lưu ý quan trọng</h2>
          <ul>
            <li>Kiểm tra kỹ thông tin trước khi nộp hồ sơ</li>
            <li>Đảm bảo các giấy tờ được upload rõ ràng, đầy đủ</li>
            <li>Theo dõi trạng thái hồ sơ sau khi nộp</li>
            <li>
              Liên hệ hotline hỗ trợ nếu gặp khó khăn trong quá trình đăng ký
            </li>
          </ul>
        </section>

        <section className="guide-section">
          <h2>4. Thông tin liên hệ hỗ trợ</h2>
          <p>Nếu bạn cần hỗ trợ, vui lòng liên hệ:</p>
          <ul>
            <li>Hotline: 1900 xxxx</li>
            <li>Email: support@example.com</li>
            <li>Thời gian hỗ trợ: 8:00 - 17:00 (Thứ 2 - Thứ 6)</li>
          </ul>
        </section>
      </div>
    </CommonLayout>
  );
};

export default GuideRegistration;
