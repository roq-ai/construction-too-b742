import { RentalAgreementInterface } from 'interfaces/rental-agreement';
import { OutletInterface } from 'interfaces/outlet';
import { GetQueryInterface } from 'interfaces';

export interface ConstructionToolInterface {
  id?: string;
  name: string;
  outlet_id?: string;
  created_at?: any;
  updated_at?: any;
  rental_agreement?: RentalAgreementInterface[];
  outlet?: OutletInterface;
  _count?: {
    rental_agreement?: number;
  };
}

export interface ConstructionToolGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  outlet_id?: string;
}
