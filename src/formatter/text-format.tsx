import * as React from 'react';
import * as numeral from 'numeral';
import * as moment from 'moment';
import TranslatorContext from '../language/translator-context';

export type ITextFormatTypes = 'date' | 'number';

export interface ITextFormatProps {
  value: string | number | Date | moment.Moment;
  type: ITextFormatTypes;
  format?: string;
  blankOnInvalid?: boolean;
  locale?: string;
}

/**
 * Formats the given value to specified type like date or number.
 * @param value value to be formatted
 * @param type type of formatting to use ${ITextFormatTypes}
 * @param format optional format to use.
 *    For date type momentJs(http://momentjs.com/docs/#/displaying) format is used
 *    For number type NumeralJS (http://numeraljs.com/#format) format is used
 * @param blankOnInvalid optional to output error or blank on null/invalid values
 * @param locale optional locale in which to format value
 */
export const TextFormat = ({ value, type, format, blankOnInvalid, locale }: ITextFormatProps) => {
  if (blankOnInvalid) {
    if (!value || !type) return null;
  }

  if (!locale) {
    // TODO: find a better way to keep track of *current* locale
    locale = TranslatorContext.context.locale;
    numeral.locale(locale);
  }

  if (type === 'date') {
    return (
      <span>
        {moment(value)
          .locale(locale)
          .format(format)}
      </span>
    );
  } else if (type === 'number') {
    return <span>{(numeral(value) as any).format(format)}</span>;
  }
  return <span>{value}</span>;
};
