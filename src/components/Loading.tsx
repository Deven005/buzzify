const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-lg font-medium text-primary mt-4">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
