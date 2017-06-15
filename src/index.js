import {
  bemNames,
  customBemNames,
  bemNamesFactory,
  StringModifiers,
  StylesPolicy,
} from './bem-names';

bemNames.factory = bemNamesFactory;
bemNames.custom = customBemNames;
bemNames.StringModifiers = StringModifiers;
bemNames.StylesPolicy = StylesPolicy;

export {
  bemNames,
  customBemNames,
  bemNamesFactory,
  StringModifiers,
  StylesPolicy,
};

export default bemNames;
