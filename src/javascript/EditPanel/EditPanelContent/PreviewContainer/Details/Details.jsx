import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {InfoPanel} from '~/DesignSystem/InfoPanel';
import {withStyles} from '@material-ui/core';
import {useTranslation} from 'react-i18next';
import {ContentEditorContext} from '~/ContentEditor.context';

const styles = theme => ({
    container: {
        padding: theme.spacing.unit * 2,
        backgroundColor: theme.palette.ui.alpha,
        overflowY: 'auto'
    }
});

export const DetailsCmp = ({classes}) => {
    const {t} = useTranslation();
    const editorContext = useContext(ContentEditorContext);

    return (
        <section data-sel-details-section className={classes.container}>
            <InfoPanel
        panelTitle={t('content-editor:label.contentEditor.details.details')}
        infos={editorContext.details}
      />
            <InfoPanel
        panelTitle={t(
          'content-editor:label.contentEditor.details.technicalInfo'
        )}
        variant="oneColumn"
        infos={editorContext.technicalInfo}
      />
        </section>
    );
};

DetailsCmp.propTypes = {
    classes: PropTypes.object.isRequired
};

export const Details = withStyles(styles)(DetailsCmp);
Details.displayName = 'Details';
