import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register: FC<{
  register: (payload: { username: string; password: string }) => Promise<any>;
}> = ({ register }) => {
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = async () => {
    setIsRegistering(true);
    await register({
      username,
      password,
    });

    setIsRegistering(false);

    navigate("/");
  };
  return (
    <div className="max-w-xl mx-auto p-8">
      <div className="space-y-2">
        <h3 className="font-semibold">Sign-up</h3>
        <input
          type="text"
          className="w-full rounded"
          placeholder="Username"
          value={username}
          disabled={isRegistering}
          onChange={(evt) => setUsername(evt.target.value)}
        />
        <input
          type="password"
          className="w-full rounded"
          placeholder="Password"
          value={password}
          disabled={isRegistering}
          onChange={(evt) => setPassword(evt.target.value)}
        />
        <div className="text-right">
          <button
            className="border px-1.5 py-1 bg-blue-500 text-white rounded border-blue-500 disabled:opacity-50"
            disabled={isRegistering || !username || !password}
            onClick={() => submitLogin()}
          >
            Login
          </button>
        </div>
      </div>
      <div className="text-center text-sm">
        Already signed-up?{" "}
        <Link className="text-blue-500 underline" to="/login">
          Login!
        </Link>
      </div>
    </div>
  );
};

export default Register;
