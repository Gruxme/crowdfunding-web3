import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ParsedCampaign, ParsedDonator, useStateContext } from '../context';
import { CustomButton, CountBox, FormField, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';

interface LocationState {
  campaign: ParsedCampaign;
}

const CampaignDetails = () => {
  const location = useLocation();
  const { campaign } = location.state as LocationState;
  const { address, contract, getDonators, donate } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState<ParsedDonator[]>([]);

  const remainingDays = daysLeft(campaign.deadline);

  const fetchDonations = async () => {
    try {
      const donations = await getDonators(campaign.id);
      setDonators(donations);
    } catch (error) {
      console.log('Failed to fetch donations. Error: ', error);
    }
  };
  useEffect(() => {
    if (contract) {
      fetchDonations();
    }
  }, [contract, address]);

  const handleDonate = async () => {
    setIsLoading(true);
    try {
      await donate(campaign.id, amount);
    } catch (error) {
      console.log('Failed to donate to campaign. Error: ', error);
    }
    await fetchDonations();
    setIsLoading(false);
  };

  return (
    <div>
      {isLoading && <Loader />}
      <div className='w-full flex md:flex-row flex-col mt-10 gap-[30px]'>
        <div className='flex-1 flex-col'>
          <img
            src={campaign.image}
            alt='campaign'
            className='w-full h-[410px] object-cover rounded-xl'
          />
          <div className='relative w-full h-[5px] bg-[#3a3a43] mt-2 rounded-xl'>
            <div
              className='absolute h-full bg-[#4acd8d] rounded-xl'
              style={{
                width: `${calculateBarPercentage(
                  parseFloat(campaign.target),
                  parseFloat(campaign.amountCollected),
                )}%`,
                maxWidth: '100%',
              }}
            ></div>
          </div>
        </div>

        <div className='flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]'>
          <CountBox title='Days Left' value={remainingDays} />
          <CountBox
            title={`Raised of ${campaign.target}`}
            value={campaign.amountCollected}
          />
          <CountBox
            title='Total Donations'
            value={donators.length.toString(10)}
          />
        </div>
      </div>

      <div className='mt-[60px] flex lg:flex-row flex-col gap-5'>
        <div className='flex-[2] flex flex-col gap-[40px]'>
          <div>
            <h4 className='text-white font-epilogue font-semibold text-[18px] uppercase'>
              Creator
            </h4>
            <div className='mt-[20px] flex flex-row items-center flex-wrap gap-[14px]'>
              <button className='w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex items-center justify-center'>
                <img
                  src={thirdweb}
                  alt='user'
                  className='w-[60%] h-[60%] object-contain'
                />
              </button>
              <div>
                <h4 className='font-epilogue font-semibold text-[14px] text-white break-all'>
                  {campaign.owner}
                </h4>
                <p className='mt-[4px] font-epilogue font-normal text-[#808191] text-[12px]'>
                  10 campaigns
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className='text-white font-epilogue font-semibold text-[18px] uppercase'>
              Story
            </h4>
            <div className='mt-[20px]'>
              <p className='font-epilogue font-normal text-[#808191] text-[16px] leading-[26px] text-justify'>
                {campaign.description}
              </p>
            </div>
          </div>

          <div>
            <h4 className='text-white font-epilogue font-semibold text-[18px] uppercase'>
              Donations
            </h4>
            <div className='mt-[20px] flex flex-col gap-4'>
              {donators.length > 0 ? (
                donators.map((donator, index) => (
                  <div
                    className='flex justify-between items-center gap-4'
                    key={index}
                  >
                    <span className='font-epilogue font-normal text-[#b2b3bd] text-[16px] leading-[26px] break-all'>
                      {index + 1}. {donator.donator}
                    </span>
                    <span className='font-epilogue font-normal text-[16px] text-[#808191] leading-[26px]'>
                      {donator.donation}
                    </span>
                  </div>
                ))
              ) : (
                <p className='font-epilogue font-normal text-[#808191] text-[16px] leading-[26px] text-justify'>
                  No donators yet. Be the first one!
                </p>
              )}
            </div>
          </div>
        </div>

        <div className='flex-1'>
          <h4 className='text-white font-epilogue font-semibold text-[18px] uppercase'>
            Fund
          </h4>
          <div className='mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]'>
            <p className='text-[#808191] font-epilogue font-medium text-[20px] leading-[30px] text-center'>
              Fund this campaign
            </p>
            <div className='mt-[30px]'>
              <FormField
                inputType='number'
                placeholder='ETH 0.1'
                step={0.01}
                value={amount}
                handleChange={(e) => setAmount(e.target.value)}
              />

              <div className='bg-[#13131a] rounded-[10px] p-4 my-[20px]'>
                <h4 className='text-white font-epilogue font-semibold leading-[22px] text-[14px]'>
                  Back it because you believe in it.
                </h4>
                <p className='text-[#808191] font-epilogue font-normal leading-[22px] mt-[20px]'>
                  Support the project for no reward, just because it speaks to
                  you.
                </p>
              </div>

              <CustomButton
                btnType={'button'}
                title='Fund Campaign'
                styles='w-full bg-[#8c6dfd]'
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
