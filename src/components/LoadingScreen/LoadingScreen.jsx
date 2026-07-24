import "./LoadingScreen.css";

const LoadingScreen = () => {
  return (
    <div className="loading-screen" dir="rtl">
      <div className="loading-screen-spinner" />
      <p className="loading-screen-title">در حال بارگذاری کاریار استودیو...</p>
    </div>
  );
};

export default LoadingScreen;
