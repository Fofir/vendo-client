import Spinner from "./Spinner";

const LoadingScreen = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-20">
      <Spinner className="w-10 h-10" />
    </div>
  );
};

export default LoadingScreen;
