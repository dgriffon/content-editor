import React from 'react';
import {registry} from '@jahia/ui-extender';
import {connect} from 'react-redux';
import {registerCEActions} from './registerCEActions';
import {Constants} from '~/ContentEditor.constants';
import {useI18nCENamespace} from '~/useI18n';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import ContentEditorApi from '~/Api/ContentEditor.api';
import ContentEditorRedux from './ContentEditor.redux';

/* eslint-disable-next-line no-undef, camelcase */
__webpack_public_path__ = `${window.contextJsParameters.contextPath}/modules/content-editor/javascript/apps/`;

// Register i18n loadNamespaces through a empty react component until extender solve the injection issue
const DependenciesInjector = () => {
    useI18nCENamespace();
    return '';
};

registry.add('app', 'content-editor-dependencies-injector', {
    targets: ['root:0.5'],
    render: next => <><DependenciesInjector/>{next}</>
});

const mapStateToProps = state => {
    return {
        path: state.jcontent.path || '/',
        siteDisplayableName: state.site
    };
};

const AlertDialogCmp = ({path, siteDisplayableName}) => {
    const [open, setOpen] = React.useState(false);

    window.testCE = {
        open: () => setOpen(true),
        close: () => setOpen(false)
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={handleClose}
        >
            <DialogTitle id="alert-dialog-title">Sample box on site {siteDisplayableName}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Redux path is {path}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleClose}>
                    X
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const AlertDialog = connect(mapStateToProps)(AlertDialogCmp);

registry.add('app', 'content-editor-component', {
    targets: ['root:20'],
    render: next => <><AlertDialog/>{next}</>
});

registry.add('app', 'content-editor-api', {
    targets: ['root:16.5'],
    render: next => <><ContentEditorApi/>{next}</>
});

registry.add('callback', 'content-editor', {
    targets: ['jahiaApp-init:2'],
    callback: () => {
        registerCEActions(registry);

        registry.add('route', 'edit-route', {
            targets: ['jcontent:0.1'],
            path: `/jcontent/:siteKey/:lang/${Constants.routes.baseEditRoute}`,
            render: () => <ContentEditorRedux mode={Constants.routes.baseEditRoute}/>
        });

        registry.add('route', 'create-route', {
            targets: ['jcontent:0.1'],
            path: `/jcontent/:siteKey/:lang/${Constants.routes.baseCreateRoute}`,
            render: () => <ContentEditorRedux mode="create"/>
        });
    }
});

console.debug('%c Content Editor is activated', 'color: #3c8cba');
