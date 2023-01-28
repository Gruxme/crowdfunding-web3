import { useState, useEffect } from 'react';
import { useStateContext, ParsedCampaign } from '../context';
import { DisplayCampaigns } from '../components';

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<ParsedCampaign[]>([]);
  const { address, contract, getCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const campaigns = await getCampaigns();
    setCampaigns(campaigns);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) {
      fetchCampaigns();
    }
  }, [address, contract]);

  return (
    <DisplayCampaigns
      title='All Campaigns'
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default Home;
