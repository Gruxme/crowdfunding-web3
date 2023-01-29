import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logo, logout, sun } from '../assets';
import { navlinks } from '../constants';
import { useStateContext } from '../context';

type IconProps = {
  imgUrl: string;
  name?: string;
  isActive?: string;
  handleclick?: () => void;
  styles?: string;
  disabled?: boolean;
};

const Icon = ({
  styles,
  imgUrl,
  name,
  isActive,
  disabled,
  handleclick,
}: IconProps) => (
  <button
    className={`w-[48px] h-[48px] rounded-[10px] ${
      isActive && isActive === name && 'bg-[#2c2f32]'
    } flex justify-center items-center ${
      disabled && 'cursor-default'
    } ${styles}`}
    onClick={handleclick}
  >
    {!isActive ? (
      <img src={imgUrl} alt='fund_logo' className='w-1/2 h-1/2' />
    ) : (
      <img
        src={imgUrl}
        alt='fund_logo'
        className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`}
      />
    )}
  </button>
);

const Sidebar = () => {
  const { activePage, setCurrentPage, disconnect } = useStateContext();
  const navigate = useNavigate();
  return (
    <div className='flex justify-between items-center flex-col sticky top-5 h-[93vh]'>
      <Link to='/' onClick={() => setCurrentPage('dashboard')}>
        <Icon styles='w-[52px] h-[52px] bg-[#2c2f32]' imgUrl={logo} />
      </Link>

      <div className='flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12'>
        <div className='flex flex-col justify-center items-center gap-10'>
          {navlinks.map(
            (link) =>
              link.name !== 'logout' && (
                <Icon
                  key={link.name}
                  name={link.name}
                  imgUrl={link.imgUrl}
                  disabled={link.disabled}
                  isActive={activePage}
                  handleclick={() => {
                    if (!link.disabled) {
                      setCurrentPage(link.name);
                      navigate(link.link);
                    }
                  }}
                />
              ),
          )}
        </div>

        <Icon
          imgUrl={logout}
          handleclick={() => {
            disconnect();
            navigate('/');
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
