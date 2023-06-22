import axios from 'axios';
import queryString from 'query-string';
import { RentalAgreementInterface, RentalAgreementGetQueryInterface } from 'interfaces/rental-agreement';
import { GetQueryInterface } from '../../interfaces';

export const getRentalAgreements = async (query?: RentalAgreementGetQueryInterface) => {
  const response = await axios.get(`/api/rental-agreements${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRentalAgreement = async (rentalAgreement: RentalAgreementInterface) => {
  const response = await axios.post('/api/rental-agreements', rentalAgreement);
  return response.data;
};

export const updateRentalAgreementById = async (id: string, rentalAgreement: RentalAgreementInterface) => {
  const response = await axios.put(`/api/rental-agreements/${id}`, rentalAgreement);
  return response.data;
};

export const getRentalAgreementById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/rental-agreements/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRentalAgreementById = async (id: string) => {
  const response = await axios.delete(`/api/rental-agreements/${id}`);
  return response.data;
};
