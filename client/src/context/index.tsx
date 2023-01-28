import React, { useContext, createContext } from 'react';
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from '@thirdweb-dev/react';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import { CreateCampaignForm } from '../types/createCampaign.interface';
import { ConnectorData } from 'wagmi-core';
import { SmartContract } from '@thirdweb-dev/sdk';

type StateContextProps = {
  children: React.ReactNode;
};

type StateContext = {
  address: string | undefined;
  contract: SmartContract<ethers.BaseContract> | undefined;
  connect: () => Promise<
    | {
        data?: ConnectorData<any> | undefined;
        error?: Error | undefined;
      }
    | {
        error: Error;
      }
  >;
  createCampaign: (form: CreateCampaignForm) => Promise<void>;
  getCampaigns: () => Promise<ParsedCampaign[]>;
  getUserCampaigns: () => Promise<ParsedCampaign[]>;
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

const StateContext = createContext({} as StateContext);
export const StateContextProvider = ({ children }: StateContextProps) => {
  const { contract } = useContract(
    '0x04d0619A8b8Aa0a4667078a3DB66ddA49eC93cfA',
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    'createCampaign',
  );

  const address = useAddress();
  const connect = useMetamask();

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
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString(),
        ),
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

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
