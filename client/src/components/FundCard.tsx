import { tagType, thirdweb } from '../assets';
import { ParsedCampaign } from '../context';
import { daysLeft } from '../utils';

interface FundCardProps extends ParsedCampaign {
  handleClick: () => void;
}

const FundCard = ({
  owner,
  title,
  description,
  target,
  deadline,
  amountCollected,
  image,
  handleClick,
}: FundCardProps) => {
  const remainingDays = daysLeft(deadline);
  return (
    <button
      className='sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24]'
      onClick={handleClick}
    >
      <img
        src={image}
        alt='Campaign'
        className='w-full h-[158px] object-cover rounded-[15px]'
      />
      <div className='flex flex-col p-4'>
        <div className='flex flex-row items-center mb-[18px]'>
          <img
            src={tagType}
            alt='tag'
            className='w-[17px] h-[17px] object-contain'
          />
          <p className='font-epilogue font-medium text-[12px] text-[#808191] ml-[12px] mt-[2px]'>
            {/**
             * Todo
             * Create Category field in contract
             */}
            Category
          </p>
        </div>

        <div className='block'>
          <h3 className='font-epilogue font-semibold text-left text-[16px] text-white leading-[26px] truncate'>
            {title}
          </h3>
          <p className='mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate'>
            {description}
          </p>
        </div>

        <div className='flex justify-between mt-[15px] gap-2'>
          <div className='flex flex-col items-start justify-center'>
            <h4 className='font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]'>
              {amountCollected}
            </h4>
            <p className='mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate'>
              Raised of {target}
            </p>
          </div>
          <div className='flex flex-col items-start justify-center'>
            <h4 className='font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]'>
              {remainingDays}
            </h4>
            <p className='mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate'>
              Days left
            </p>
          </div>
        </div>

        <div className='flex items-center mt-[20px] gap-[12px]'>
          <div className='w-[30px] h-[30px] rounded-full bg-[#13131a] flex justify-center items-center'>
            <img
              src={thirdweb}
              alt='user'
              className='w-1/2 h-1/2 object-contain'
            />
          </div>
          <p className='flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate'>
            by <span className='text-[#b3b4bd]'>{owner}</span>
          </p>
        </div>
      </div>
    </button>
  );
};

export default FundCard;
