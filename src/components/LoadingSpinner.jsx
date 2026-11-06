import "../index.css";

const LoadingSpinner = ({ label = "Loading..." }) => (

  <div className="loading-state" role="status" aria-live="polite">
    <span className="loading-spinner" aria-hidden="true" />
    <span>{label}</span>
  </div>
);

export default LoadingSpinner;
