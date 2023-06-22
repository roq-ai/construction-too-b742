import { RentalAgreementInterface } from 'interfaces/rental-agreement';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CustomerInterface {
  id?: string;
  name: string;
  email: string;
  phone: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  rental_agreement?: RentalAgreementInterface[];
  user?: UserInterface;
  _count?: {
    rental_agreement?: number;
  };
}

export interface CustomerGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  user_id?: string;
}
