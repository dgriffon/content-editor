import React, {useContext} from 'react';
import {usePublicationInfo} from './PublicationInfo';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';

export const PublicationInfoContext = React.createContext({});

export const usePublicationInfoContext = () => useContext(PublicationInfoContext);

export const PublicationInfoContextProvider = ({path, lang, children}) => {
    const {t} = useTranslation();
    const {
        publicationInfoError, publicationInfoErrorMessage, publicationStatus, publicationInfoPolling, startPublicationInfoPolling, stopPublicationInfoPolling
    } = usePublicationInfo({
        path: path,
        language: lang
    }, t);

    if (publicationInfoError) {
        console.error(publicationInfoError);
        return <>{publicationInfoErrorMessage}</>;
    }

    const publicationInfoContext = {publicationStatus, publicationInfoPolling, startPublicationInfoPolling, stopPublicationInfoPolling};

    return (
        <PublicationInfoContext.Provider value={publicationInfoContext}>
            {children}
        </PublicationInfoContext.Provider>
    );
};

PublicationInfoContextProvider.propTypes = {
    path: PropTypes.string.isRequired,
    lang: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
};
