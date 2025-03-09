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

