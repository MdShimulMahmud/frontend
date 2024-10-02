import { useAuth } from "../hooks/useAuth";

const Dashboard: React.FC = () => {
  const user = useAuth();

  if (!user) return null; // or a loading spinner

  return <div>Welcome, {user.username}!</div>;
};
