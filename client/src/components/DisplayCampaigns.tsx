import { useNavigate } from 'react-router-dom';
import { loader } from '../assets';
import { ParsedCampaign } from '../context';
import { FundCard } from '.';

interface DisplayCampaignsProps {
  title: string;
  isLoading: boolean;
  campaigns: ParsedCampaign[];
}

const DisplayCampaigns = ({
  title,
  isLoading,
  campaigns,
}: DisplayCampaignsProps) => {
  const navigate = useNavigate();
  const handleNavigate = (campaign: ParsedCampaign) => {
    navigate(`/campaign-details/${campaign.id}`, {
      state: { campaign },
    });
  };
  return (
    <div>
      <h1 className='text-white text-[18px] text-left font-epilogue font-semibold'>
        {title} ({campaigns.length})
      </h1>

      <div className='flex flex-wrap mt-[20px] gap-[26px]'>
        {isLoading && (
          <img
            src={loader}
            alt='loader'
            className='w-[100px] h-[100px] object-contain'
          />
        )}
        {!isLoading && campaigns.length === 0 && (
          <p className='font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]'>
            No campaigns available.
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign) => (
            <FundCard
              key={campaign.id}
              {...campaign}
              handleClick={() => handleNavigate(campaign)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayCampaigns;
