import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


// TODO надо добавить в Redux а так же логику для получения данных из API и еще пользак купил подписку или нет чекалка или это в реадкс должно быть 
export function useAdLogic() {
  const location = useLocation();
  const [adClicks, setAdClicks] = useState(0);
  const [adData, setAdData] = useState<{
    name: string;
    mediaUrl: string;
    targetUrl: string;
  } | null>(null);

  useEffect(() => {
    setAdClicks(prev => prev + 1);
  }, [location.pathname]); 
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;

    if (adClicks > 0 && adClicks % 10 === 0) {
      setAdData({
        name: "Ad Name",
        mediaUrl: "https://example.com/ad.jpg",
        targetUrl: "https://example.com"
      });

      timer = setTimeout(() => {
        setAdData(null);
      }, 10000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [adClicks]); 

  const handleCloseAd = () => setAdData(null);

  return { adData, handleCloseAd };
}
