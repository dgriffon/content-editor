import {connect} from 'react-redux';
import {compose, withApollo} from 'react-apollo';
import {withNotifications} from '@jahia/react-material';
import {withSiteInfo} from '~/SiteData';

import {FormQuery} from './CreateForm/createForm.gql-queries';
import {Create as CreateComponent} from './Create';

import {Constants} from '~/ContentEditor.constants';
import {cmGoto} from '~/ContentManager.redux-actions';

const mapDispatchToProps = dispatch => ({
    setUrl: gotoParams => dispatch(cmGoto(gotoParams))
});

const mapStateToProps = (state, ownProps) => {
    const contentEditorUiLang = Constants.supportedLocales.includes(state.uiLang) ?
        state.uiLang :
        Constants.defaultLocale;

    return {
        path: ownProps.path || state.path,
        lang: ownProps.language || state.language,
        uiLang: ownProps.uiLang || state.uiLang,
        site: ownProps.site || state.site,
        siteDisplayableName: ownProps.siteDisplayableName || state.siteDisplayableName,
        formQuery: FormQuery,
        formQueryParams: {
            path: ownProps.path || state.path,
            parentPath: ownProps.path || state.path,
            language: ownProps.language || state.language,
            uiLang: contentEditorUiLang,
            primaryNodeType: ownProps.contentType || state.params.contentType
        }
    };
};

export const Create = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withApollo,
    withNotifications(),
    withSiteInfo
)(CreateComponent);
Create.displayName = 'CreateContainer';
