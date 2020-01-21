import {connect} from 'react-redux';
import {compose, withApollo} from 'react-apollo';
import {withNotifications} from '@jahia/react-material';
import {withSiteInfo} from '~/SiteData';

import {FormQuery} from './EditForm.gql-queries';
import {Edit as EditComponent} from './Edit';

import {Constants} from '~/ContentEditor.constants';

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
            language: ownProps.language || state.language,
            uiLang: contentEditorUiLang
        }
    };
};

export const Edit = compose(
    connect(mapStateToProps),
    withApollo,
    withNotifications(),
    withSiteInfo
)(EditComponent);
Edit.displayName = 'EditContainer';
