import axios from 'axios';
import {Currency} from './CurrencyEnum';
import {validateInput, ErrorType, CurrencyConverterError} from './CurrencyConverterHelper';

var prevDate = 0;
var exchangeMap = new Map();
const thirdPartyUrl = 'https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt';

export async function convertCurrency(amount: string, currencyType: string) {
    console.log(amount, currencyType);
    validateInput(amount, currencyType);
    let currentDate = Math.floor(new Date().getTime() / 1000)
    if(currentDate > (prevDate + 24*60*60*1000) || exchangeMap.size==0) {
        var result = await fetchDataFromThirdParty();
        populateExchangeMap(result);
        prevDate = currentDate;
    }
    var targetCurrency = Currency[currencyType];
    if(!exchangeMap.has(targetCurrency)) {
        throw new CurrencyConverterError(
            ErrorType.DATA_ERROR, 
            "Conversion currently not available for " + currencyType, 
            '');
    }
    var convertedVal = amount/exchangeMap.get(targetCurrency);
    convertedVal = Math.round(convertedVal * 100) / 100;
    return convertedVal;
}

function populateExchangeMap(result: string) {
    const lines = result.split(/\r?\n/);
    var dateString = lines[0].trim();
    dateString = dateString.substring(0, 11);
    var date = Date.parse(dateString);
    exchangeMap = new Map();
    for (let i = 2; i < lines.length; i++) {
        var params = lines[i].split("|");
        var p4 = parseFloat(params[4]);
        var p2 = parseFloat(params[2]);
        exchangeMap.set(Currency[params[3]], p4/p2);
    }
}

async function fetchDataFromThirdParty() {
    console.log("making http call");
    var res = axios.get(thirdPartyUrl)
        .catch(function (error) {
            // Kiran: here I am assuming that if this call fails, we dont return the (stale) data from old map, 
            // instead throw an error
            if (error.response) {
                // responseCode != 200
                throw new CurrencyConverterError(ErrorType.THIRD_PARTY_ERROR, "", error.response.status);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                throw new CurrencyConverterError(ErrorType.TIMEOUT_ERROR, "", error.response.status);
              } else {
                // Something happened in setting up the request that triggered an Error
                throw new CurrencyConverterError(ErrorType.GENERIC_ERROR, "", error.message);
              }
        }
    );
    var response = (await res).data;
    return response;
}
