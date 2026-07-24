import { createPortal } from "react-dom";
import "./Modal.css";

function Modal({ title, onClose, children }) {
  return createPortal(
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3>{title}</h3>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="بستن"
          >
            ×
          </button>
        </div>
        <div className="admin-modal-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
