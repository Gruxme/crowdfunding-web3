import React, { useContext, createContext, useState } from 'react';
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
  useDisconnect,
} from '@thirdweb-dev/react';
import { BigNumber, ethers } from 'ethers';
import { CreateCampaignForm } from '../types/createCampaign.interface';
import { ConnectorData } from 'wagmi-core';
import { SmartContract } from '@thirdweb-dev/sdk';

type StateContextProps = {
  children: React.ReactNode;
};

interface ContractCampaign {
  owner: string;
  title: string;
  description: string;
  target: BigNumber;
  deadline: BigNumber;
  amountCollected: BigNumber;
  image: string;
  id: number;
}

export interface ParsedCampaign {
  owner: string;
  title: string;
  description: string;
  target: string;
  deadline: number;
  amountCollected: string;
  image: string;
  id: number;
}

export type ParsedDonator = {
  donator: string;
  donation: string;
};

type StateContext = {
  address: string | undefined;
  contract: SmartContract<ethers.BaseContract> | undefined;
  setCurrentPage: (name: string) => void;
  activePage: string;
  connect: () => Promise<{
    data?: ConnectorData<any> | undefined;
    error?: Error | undefined;
    } | {
      error: Error;
    }
  >;
  disconnect: (
    options?: {
      reconnectPrevious?: boolean | undefined;
    } | undefined,
  ) => Promise<void | {
    data?: ConnectorData<any> | undefined;
    error?: Error | undefined;
  }>;
  createCampaign: (form: CreateCampaignForm) => Promise<void>;
  getCampaigns: () => Promise<ParsedCampaign[]>;
  getUserCampaigns: () => Promise<ParsedCampaign[]>;
  donate: (id: number, amount: string) => Promise<any>;
  getDonators: (id: number) => Promise<ParsedDonator[]>;
};

const StateContext = createContext({} as StateContext);
export const StateContextProvider = ({ children }: StateContextProps) => {
  const [activePage, setActivePage] = useState('dashboard');

  const setCurrentPage = (name: string) => {
    setActivePage(name);
    console.log('set current page to: ', activePage);
  };

  const { contract } = useContract(
    '0x04d0619A8b8Aa0a4667078a3DB66ddA49eC93cfA',
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    'createCampaign',
  );

  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();

  const publishCampaign = async (form: CreateCampaignForm) => {
    try {
      const data = await createCampaign([
        address, // owner
        form.title, // title
        form.description, // description
        form.target, // target
        new Date(form.deadline).getTime(), // deadline
        form.image, // image
      ]);
      console.log('campaign created: ', data);
    } catch (error) {
      console.log('campaign creation failed: ', error);
    }
  };

  const getCampaigns = async (): Promise<ParsedCampaign[]> => {
    const campaigns = (await contract?.call(
      'getCampaigns',
    )) as ContractCampaign[];
    const parsedCampaigns = campaigns.map(
      (campaign: ContractCampaign, i: number) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(campaign.amountCollected),
        image: campaign.image,
        id: i,
      }),
    );
    return parsedCampaigns;
  };

  const getUserCampaigns = async (): Promise<ParsedCampaign[]> => {
    const allCampaigns = await getCampaigns();

    const UserCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === address,
    );
    return UserCampaigns;
  };

  const donate = async (id: number, amount: string) => {
    const response = await contract?.call('donateToCampaign', id, {
      value: ethers.utils.parseEther(amount),
    });
    console.log('donate response: ', response);
    return response;
  };

  const getDonators = async (id: number): Promise<ParsedDonator[]> => {
    const donators = await contract?.call('getDonators', id);
    const numberOfDonations = donators[0].length;

    const parsedDonators = [] as ParsedDonator[];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonators.push({
        donator: donators[0][i],
        donation: ethers.utils.formatEther(donators[1][i].toString()),
      });
    }

    return parsedDonators;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        disconnect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        activePage,
        setCurrentPage,
        donate,
        getDonators,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
