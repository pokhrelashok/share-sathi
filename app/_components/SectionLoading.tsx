import LoadingSpinner from "./LoadingSpinner";

const SectionLoading = ({ className = "" }) => {
  return (
    <div
      className={`z-10 h-full w-full bg-white bg-opacity-80 left-0 absolute top-0 flex items-center justify-center ${className}`}
    >
      <LoadingSpinner className="h-5 w-5" />
    </div>
  );
};
export default SectionLoading;
