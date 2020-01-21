import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {ApolloProvider as ApolloHooksProvider} from 'react-apollo-hooks';
import {withApollo} from 'react-apollo';

import {Create} from '~/Create/Create.container';
import {Edit} from '~/Edit/Edit.container';
import {EditorIdContextProvider} from './ContentEditorId.context';
import {Constants} from '~/ContentEditor.constants';

const Routes = {
    edit: Edit,
    create: Create
};

const ContentEditorCmp = ({client, mode, exposeJS}) => {
    const [customProps, setCustomProps] = useState({open: false});

    window.top.CE_API = window.top.CE_API || {};
    window.top.CE_API = exposeJS ? {
        edit: ({path, language, uilang, site, siteDisplayableName}) => {
            setCustomProps({
                path: path,
                language: language,
                uilang: uilang,
                site: site,
                siteDisplayableName: siteDisplayableName,
                mode: Constants.routes.baseEditRoute,
                open: true
            });
        },
        create: ({path, language, uilang, site, siteDisplayableName, contentType}) => {
            setCustomProps({
                path: path,
                language: language,
                uilang: uilang,
                site: site,
                siteDisplayableName: siteDisplayableName,
                mode: Constants.routes.baseCreateRoute,
                contentType: contentType,
                open: true
            });
        }
    } : undefined;

    const CurrentRouteCmp = Routes[customProps.mode || mode] || Routes.create;
    const contentEditor = props => (
        <EditorIdContextProvider>
            <ApolloHooksProvider client={client}>
                <CurrentRouteCmp {...props}/>
            </ApolloHooksProvider>
        </EditorIdContextProvider>
    );
    if (exposeJS) {
        if (customProps.open) {
            customProps.close = () => {
                setCustomProps({open: false});
            };

            return contentEditor(customProps);
        }

        return <></>;
    }

    return contentEditor();
};

ContentEditorCmp.defaultProps = {
    hasState: false,
    setMainDisplayed: undefined
};

ContentEditorCmp.propTypes = {
    client: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(['create', 'edit']).isRequired,
    hasState: PropTypes.bool,
    setMainDisplayed: PropTypes.func
};

const ContentEditor = withApollo(ContentEditorCmp);
ContentEditor.displayName = 'ContentEditor';
export default ContentEditor;
