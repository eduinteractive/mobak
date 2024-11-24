import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import cz from './cz.json';
import de from './de.json';
import en from './en.json';
import es from './es.json';
import fi from './fi.json';
import fr from './fr.json';
import it from './it.json';
import mk from './mk.json';
import nl from './nl.json';
import pt from './pt.json';
import slk from './slk.json';


const resources = {
    cz: { translation: cz },
    de: { translation: de },
    en: { translation: en },
    es: { translation: es },
    fi: { translation: fi },
    fr: { translation: fr },
    it: { translation: it },
    mk: { translation: mk },
    nl: { translation: nl },
    pt: { translation: pt },
    slk: { translation: slk },
};

i18n

    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        compatibilityJSON: 'v3',
        resources,
        lng: 'en',// default language to use.
        debug: true,
    });

export default { i18n };