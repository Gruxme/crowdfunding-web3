interface CountBoxProps {
  title: string;
  value: number;
}

const CountBox = ({ title, value }: CountBoxProps) => {
  return (
    <div className='flex flex-col items-center w-[150px]'>
      <h4 className='text-white font-epilogue font-bold text-[30px] p-3 bg-[#1c1c24] rounded-t-[10px] w-full text-center truncate'>
        {value}
      </h4>
      <p className='font-epilogue text-[#808191] text-[16px] bg-[#28282e] font-normal px-3 py-2 w-full rounded-b-[10px] text-center'>
        {title}
      </p>
    </div>
  );
};

export default CountBox;
