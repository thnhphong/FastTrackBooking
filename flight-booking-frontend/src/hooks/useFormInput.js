import { useCallback } from 'react';
import { NUMERIC_FIELDS, getNumericValue } from '../utils/formHelpers';

/**
 * Custom hook for handling form input changes
 * Handles checkboxes, numeric fields, and regular text inputs
 */
export const useFormInput = (formData, setFormData, errors, setErrors) => {
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Handle checkbox inputs
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: Boolean(checked),
      }));
      return;
    }

    // Handle numeric fields
    if (NUMERIC_FIELDS.includes(name)) {
      const numValue = getNumericValue(value);
      setFormData(prev => ({
        ...prev,
        [name]: numValue,
      }));
      return;
    }

    // Handle regular text inputs
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, [errors, setFormData, setErrors]);

  return handleInputChange;
};

