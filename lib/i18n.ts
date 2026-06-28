import en from '../messages/en.json';
import hi from '../messages/hi.json';
import mr from '../messages/mr.json';
import { headers } from 'next/headers';

const dictionaries: Record<string, any> = {
  en,
  hi,
  mr
};

export function getDictionary() {
  const headersList = headers();
  const acceptLanguage = headersList.get('accept-language') || 'en';
  
  // Basic parsing to find the preferred language
  let lang = 'en';
  if (acceptLanguage.includes('mr')) {
    lang = 'mr';
  } else if (acceptLanguage.includes('hi')) {
    lang = 'hi';
  }
  
  return dictionaries[lang];
}
