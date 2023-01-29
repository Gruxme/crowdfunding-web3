import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { money } from '../assets';
import { CustomButton, Loader, FormField } from '../components';
import { checkIfImage } from '../utils';
import { CreateCampaignForm } from '../types/createCampaign.interface';
import { useStateContext } from '../context';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState<CreateCampaignForm>({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: '',
  });

  const handleFormFieldChange = (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({
          ...form,
          target: ethers.utils.parseUnits(form.target, 18).toString(),
        });
        setIsLoading(false);
        navigate('/');
      } else {
        alert('provide a valid image url');
        setForm({ ...form, image: '' });
      }
    });
  };

  return (
    <div className='bg-[#1c1c24] flex justify-center items-center flex-col rounded-lg sm:p-10 p-4'>
      {isLoading && <Loader />}
      <div className='flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]'>
        <h1 className='font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white'>
          Start a campaign
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className='w-full mt-[65px] flex flex-col gap-[30px] '
      >
        <div className='flex flex-wrap gap-[40px]'>
          <FormField
            LabelName='Your Name *'
            placeholder='John Doe'
            inputType='text'
            value={form.name}
            handleChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => handleFormFieldChange('name', e)}
          />
          <FormField
            LabelName='Campaign Title *'
            placeholder='Write a title'
            inputType='text'
            value={form.title}
            handleChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => handleFormFieldChange('title', e)}
          />
        </div>
        <FormField
          LabelName='Story *'
          placeholder='Write your story'
          isTextArea
          value={form.description}
          handleChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => handleFormFieldChange('description', e)}
        />

        <div className='w-full flex justify-start items-center bg-[#8c6dfd] p-4 h-[120px] rounded-[10px]'>
          <img
            src={money}
            alt='money'
            className='w-[40px] h-[40px] object-contain'
          />
          <h4 className='font-epilogue font-bold text-[25px] text-white ml-[20px]'>
            You will get 100% of the raised amount
          </h4>
        </div>

        <div className='flex flex-wrap gap-[40px]'>
          <FormField
            LabelName='Goal *'
            placeholder='ETH 0.50'
            inputType='text'
            value={form.target}
            handleChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => handleFormFieldChange('target', e)}
          />
          <FormField
            LabelName='End Date *'
            placeholder='Write a title'
            inputType='date'
            value={form.deadline}
            handleChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            ) => handleFormFieldChange('deadline', e)}
          />
        </div>
        <FormField
          LabelName='Campaign image *'
          placeholder='Place image URL of your campaign'
          inputType='url'
          value={form.image}
          handleChange={(
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => handleFormFieldChange('image', e)}
        />
        <div className='flex justify-center items-center mt-[40px]'>
          <CustomButton
            btnType='submit'
            title='Submit new campaign'
            styles='bg-[#1dc071]'
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;
