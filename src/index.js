import {
  bemNames,
  customBemNames,
  bemNamesFactory,
  StringModifiers,
  StylesPolicy,
} from './bem-names';

const bemNamesEnums = {
  StringModifiers,
  StylesPolicy,
};

bemNames.factory = bemNamesFactory;
bemNames.custom = customBemNames;
bemNames.StringModifiers = StringModifiers;
bemNames.StringModifiers = StringModifiers;

export {
  bemNames,
  customBemNames,
  bemNamesFactory,
  bemNamesEnums,
};

export default bemNames;
