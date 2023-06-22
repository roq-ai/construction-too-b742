import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getRentalAgreementById, updateRentalAgreementById } from 'apiSdk/rental-agreements';
import { Error } from 'components/error';
import { rentalAgreementValidationSchema } from 'validationSchema/rental-agreements';
import { RentalAgreementInterface } from 'interfaces/rental-agreement';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CustomerInterface } from 'interfaces/customer';
import { ConstructionToolInterface } from 'interfaces/construction-tool';
import { getCustomers } from 'apiSdk/customers';
import { getConstructionTools } from 'apiSdk/construction-tools';

function RentalAgreementEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<RentalAgreementInterface>(
    () => (id ? `/rental-agreements/${id}` : null),
    () => getRentalAgreementById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: RentalAgreementInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateRentalAgreementById(id, values);
      mutate(updated);
      resetForm();
      router.push('/rental-agreements');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<RentalAgreementInterface>({
    initialValues: data,
    validationSchema: rentalAgreementValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Rental Agreement
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="rental_start_date" mb="4">
              <FormLabel>Rental Start Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.rental_start_date ? new Date(formik.values?.rental_start_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('rental_start_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="rental_end_date" mb="4">
              <FormLabel>Rental End Date</FormLabel>
              <Box display="flex" maxWidth="100px" alignItems="center">
                <DatePicker
                  dateFormat={'dd/MM/yyyy'}
                  selected={formik.values?.rental_end_date ? new Date(formik.values?.rental_end_date) : null}
                  onChange={(value: Date) => formik.setFieldValue('rental_end_date', value)}
                />
                <Box zIndex={2}>
                  <FiEdit3 />
                </Box>
              </Box>
            </FormControl>
            <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
              <FormLabel>Status</FormLabel>
              <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
              {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<CustomerInterface>
              formik={formik}
              name={'customer_id'}
              label={'Select Customer'}
              placeholder={'Select Customer'}
              fetcher={getCustomers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<ConstructionToolInterface>
              formik={formik}
              name={'construction_tool_id'}
              label={'Select Construction Tool'}
              placeholder={'Select Construction Tool'}
              fetcher={getConstructionTools}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'rental_agreement',
  operation: AccessOperationEnum.UPDATE,
})(RentalAgreementEditPage);
