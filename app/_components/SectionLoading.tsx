import LoadingSpinner from "./LoadingSpinner";

const SectionLoading = () => {
  return (
    <div className="z-10 h-full w-full bg-white bg-opacity-80 left-0 absolute top-0 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
};
export default SectionLoading;
