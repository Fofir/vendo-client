import { FC, useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Login: FC<{
  login: (payload: { username: string; password: string }) => Promise<any>;
}> = ({ login }) => {
  const navigate = useNavigate();

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = async () => {
    setIsLoggingIn(true);

    try {
      await login({
        username,
        password,
      });

      setIsLoggingIn(false);
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    }
  };
  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="space-y-2">
        <h3 className="font-semibold">Login</h3>
        <input
          type="text"
          className="w-full rounded"
          placeholder="Username"
          value={username}
          disabled={isLoggingIn}
          onChange={(evt) => setUsername(evt.target.value)}
        />
        <input
          type="password"
          className="w-full rounded"
          placeholder="Password"
          value={password}
          disabled={isLoggingIn}
          onChange={(evt) => setPassword(evt.target.value)}
        />
        <div className="text-right">
          <button
            className="border px-1.5 py-1 bg-blue-500 text-white rounded border-blue-500 disabled:opacity-50"
            disabled={isLoggingIn || !username || !password}
            onClick={() => submitLogin()}
          >
            Login
          </button>
        </div>
      </div>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link className="text-blue-500 underline" to="/register">
          Sign-up!
        </Link>
      </div>
    </div>
  );
};

export default Login;
