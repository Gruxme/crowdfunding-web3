import { loader } from '../assets';

const Loader = () => {
  return (
    <div className='fixed inset-0 z-10 h-screen flex flex-col items-center justify-center bg-[rgba(0,0,0,0.7)]'>
      <img
        src={loader}
        alt='loader'
        className='w-[100px] h-[100px] object-contain'
      />
      <p className='text-white font-epilogue font-bold text-[20px] text-center mt-[20px]'>
        Transaction in progress...
      </p>
    </div>
  );
};

export default Loader;
