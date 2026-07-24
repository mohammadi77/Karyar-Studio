import "./Toast.css";

const ToastContainer = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
          <button
            type="button"
            className="toast-close"
            onClick={() => onClose(toast.id)}
            aria-label="بستن"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
