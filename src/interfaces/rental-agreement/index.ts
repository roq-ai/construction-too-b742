import { CustomerInterface } from 'interfaces/customer';
import { ConstructionToolInterface } from 'interfaces/construction-tool';
import { GetQueryInterface } from 'interfaces';

export interface RentalAgreementInterface {
  id?: string;
  customer_id?: string;
  construction_tool_id?: string;
  rental_start_date: any;
  rental_end_date: any;
  status: string;
  created_at?: any;
  updated_at?: any;

  customer?: CustomerInterface;
  construction_tool?: ConstructionToolInterface;
  _count?: {};
}

export interface RentalAgreementGetQueryInterface extends GetQueryInterface {
  id?: string;
  customer_id?: string;
  construction_tool_id?: string;
  status?: string;
}
