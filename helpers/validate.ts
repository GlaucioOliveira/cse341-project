import Validator, { Rules, ErrorMessages, Errors } from 'validatorjs';

type ValidationCallback = (errors: Errors | null, isValid: boolean) => void;

const validator = async (body: Record<string, any>, rules: Rules, customMessages: ErrorMessages, callback: ValidationCallback): Promise<void> => {
    const validation = new Validator(body, rules, customMessages);

    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

export default validator;
