import {Currency} from './CurrencyEnum';

export function validateInput(amount: string, currencyType: string) {
    if(isNaN(amount)) {
        throw new CurrencyConverterError(
            ErrorType.USER_ERROR,
            "Invalid amount " + amount,
            ""
        )
    }
    if(!Object.values(Currency).includes(currencyType)) {
        throw new CurrencyConverterError(
            ErrorType.USER_ERROR,
            "Invalid currencyType " + currencyType,
            ""
        );
    }
}

export enum ErrorType {
    USER_ERROR,
    THIRD_PARTY_ERROR,
    INPUT_DATA_ERROR,
    RESPONSE_DATA_ERROR,
    TIMEOUT_ERROR,
    GENERIC_ERROR,
    DATA_ERROR,
}

export class CurrencyConverterError extends Error{
    errorType = '0';
    errorMessage = '';
    httpErrorCode = 0;
constructor(errorType, errorMessage, httpErrorCode) {
        super();
        this.errorType = errorType,
        this.errorMessage = errorMessage;
        this.httpErrorCode = httpErrorCode;
    }
}