import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useEmergencyRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEmergency, setIsEmergency] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const data = { emergency: false }; // В будущем можно заменить на fetch('/emergency')
      setIsEmergency(data.emergency);

      const allowed = ['/emergency', '/reference', '/evacuation', '/support'];
      if (data.emergency && !allowed.includes(location.pathname)) {
        navigate('/emergency', { replace: true });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [navigate, location.pathname]);

  return isEmergency;
}
