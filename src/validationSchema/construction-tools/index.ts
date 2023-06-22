import * as yup from 'yup';

export const constructionToolValidationSchema = yup.object().shape({
  name: yup.string().required(),
  outlet_id: yup.string().nullable(),
});
