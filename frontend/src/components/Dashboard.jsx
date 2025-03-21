import EntrepreneurDashboard from './EntrepreneurDashboard';
import ProfessionalDashboard from './ProfessionalDashboard';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  // Get user role from auth context
  const { user } = useAuth();
  const userRole = user?.role || 'professional';

  return (
    <>
      {userRole === 'entrepreneur' && <EntrepreneurDashboard />}
      {userRole === 'professional' || userRole === 'mentor' && <ProfessionalDashboard />}
    </>
  );
};

export default Dashboard;
