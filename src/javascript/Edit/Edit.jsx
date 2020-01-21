import React from 'react';
import {ProgressOverlay} from '@jahia/react-material';
import {Formik} from 'formik';
import EditPanel from '~/EditPanel';
import * as PropTypes from 'prop-types';
import {useFormDefinition} from '~/EditPanel/FormDefinitions';
import {ContentEditorContext} from '~/ContentEditor.context';
import {validate} from '~/Validation/validation';
import {saveNode} from './save/save.request';
import {PublicationInfoContextProvider} from '~/PublicationInfo/PublicationInfo.context';
import {Constants} from '~/ContentEditor.constants';
import {registerEngineTabActions} from './engineTabs/engineTabs.utils';
import {LockedEditorContextProvider} from '~/Lock/LockedEditor.context';
import {useTranslation} from 'react-i18next';

export const Edit = ({
    client,
    notificationContext,
    setUrl,
    path,
    lang,
    uiLang,
    site,
    siteDisplayableName,
    siteInfo,
    formQuery,
    formQueryParams,
    close
}) => {
    const {t} = useTranslation();
    const {
        loading, error, errorMessage, nodeData, initialValues, details, technicalInfo, sections, title
    } = useFormDefinition(formQuery, formQueryParams, t);

    if (error) {
        console.error(error);
        return <>{errorMessage}</>;
    }

    if (loading) {
        return <ProgressOverlay/>;
    }

    // Engines tabs need the node Data to be registered
    registerEngineTabActions(nodeData);

    const editorContext = {
        path,
        lang,
        uiLang,
        site,
        siteInfo,
        siteDisplayableName,
        sections,
        nodeData,
        details,
        technicalInfo,
        mode: Constants.routes.baseEditRoute
    };

    const handleSubmit = (values, actions) => {
        saveNode({
            client,
            t,
            notificationContext,
            actions,
            setUrl,
            data: {
                ...formQueryParams,
                nodeData,
                sections,
                values
            }
        });
    };

    return (
        <ContentEditorContext.Provider value={editorContext}>
            <LockedEditorContextProvider path={path}>
                <PublicationInfoContextProvider path={path} lang={lang}>
                    <Formik
                        initialValues={initialValues}
                        render={props => <EditPanel {...props} title={title} close={close}/>}
                        validate={validate(sections)}
                        onSubmit={handleSubmit}
                    />
                </PublicationInfoContextProvider>
            </LockedEditorContextProvider>
        </ContentEditorContext.Provider>
    );
};

Edit.defaultProps = {
    setUrl: () => {},
    close: undefined
};

Edit.propTypes = {
    client: PropTypes.object.isRequired,
    setUrl: PropTypes.func,
    path: PropTypes.string.isRequired,
    notificationContext: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    uiLang: PropTypes.string.isRequired,
    site: PropTypes.string.isRequired,
    siteDisplayableName: PropTypes.string.isRequired,
    siteInfo: PropTypes.object.isRequired,
    formQuery: PropTypes.object.isRequired,
    formQueryParams: PropTypes.object.isRequired,
    close: PropTypes.func
};
