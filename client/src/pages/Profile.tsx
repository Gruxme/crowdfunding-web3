import { useState, useEffect } from 'react';
import { useStateContext, ParsedCampaign } from '../context';
import { DisplayCampaigns } from '../components';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<ParsedCampaign[]>([]);
  const { address, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const campaigns = await getUserCampaigns();
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
      title='My Campaigns'
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default Profile;
