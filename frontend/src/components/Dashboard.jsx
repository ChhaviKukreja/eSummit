import EntrepreneurDashboard from './EntrepreneurDashboard';
import ProfessionalDashboard from './ProfessionalDashboard';
import { useLocation } from 'react-router-dom';

const Dashboard = ({ userRole: defaultRole = 'professional' }) => {
  // Get userRole from location state if available
  const location = useLocation();
  const userRole = location.state?.userRole || defaultRole;

  return (
    <>
      {userRole === 'entrepreneur' && <EntrepreneurDashboard />}
      {userRole === 'professional' && <ProfessionalDashboard />}
    </>
  );
};

export default Dashboard;
