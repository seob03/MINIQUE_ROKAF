import Swal from "sweetalert2";
import './style/Util.css';

export function showAlert({ title, text, icon = "info", confirmText = "확인" }) {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: confirmText,
        customClass: {
            popup: "custom-swal-popup",
            container: "custom-swal-container",
        },
        backdrop: true, // 배경은 그대로 유지
    });
}

// ✅ 확인/취소 알림창 (사용자 선택)
export function showConfirm({ title, text, icon = "warning", confirmText = "확인", cancelText = "취소" }) {
    return Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        customClass: {
            popup: "custom-swal-popup",
            container: "custom-swal-container",
        },
        backdrop: true,
    });
}