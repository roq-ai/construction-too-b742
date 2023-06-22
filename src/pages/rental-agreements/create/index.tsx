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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createRentalAgreement } from 'apiSdk/rental-agreements';
import { Error } from 'components/error';
import { rentalAgreementValidationSchema } from 'validationSchema/rental-agreements';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { CustomerInterface } from 'interfaces/customer';
import { ConstructionToolInterface } from 'interfaces/construction-tool';
import { getCustomers } from 'apiSdk/customers';
import { getConstructionTools } from 'apiSdk/construction-tools';
import { RentalAgreementInterface } from 'interfaces/rental-agreement';

function RentalAgreementCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RentalAgreementInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRentalAgreement(values);
      resetForm();
      router.push('/rental-agreements');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RentalAgreementInterface>({
    initialValues: {
      rental_start_date: new Date(new Date().toDateString()),
      rental_end_date: new Date(new Date().toDateString()),
      status: '',
      customer_id: (router.query.customer_id as string) ?? null,
      construction_tool_id: (router.query.construction_tool_id as string) ?? null,
    },
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
            Create Rental Agreement
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'rental_agreement',
  operation: AccessOperationEnum.CREATE,
})(RentalAgreementCreatePage);
