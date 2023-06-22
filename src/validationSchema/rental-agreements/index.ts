import * as yup from 'yup';

export const rentalAgreementValidationSchema = yup.object().shape({
  rental_start_date: yup.date().required(),
  rental_end_date: yup.date().required(),
  status: yup.string().required(),
  customer_id: yup.string().nullable(),
  construction_tool_id: yup.string().nullable(),
});
