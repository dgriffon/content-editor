import React from 'react';

import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Typography
} from '@jahia/design-system-kit';
import {connect} from 'formik';
import {compose} from 'react-apollo';
import {translate} from 'react-i18next';
import * as PropTypes from 'prop-types';
import {FormGroup, withStyles} from '@material-ui/core';
import {ExpandMore} from '@material-ui/icons';
import EditNodeProperty from './EditNodeProperty';
import {FieldsPropTypes} from '../../../FormDefinitions';

let styles = theme => ({
    inputLabel: {
        color: theme.palette.font.alpha
    },
    formGroup: {
        width: '100%'
    },
    form: {}
});

export const FormBuilder = ({classes, fields, formik, siteInfo}) => {
    // Get fields name
    let targetsName = new Set();
    fields.forEach(field => field.targets.forEach(target => targetsName.add(target.name)));
    return (
        <form className={classes.form} onSubmit={formik.handleSubmit}>
            {Array.from(targetsName).map((target, index) => {
                let fieldsByTarget = fields.filter(field => field.targets.filter(t => t.name === target).length > 0);
                return (
                    <ExpansionPanel key={target} variant="normal" defaultExpanded={index === 0} data-sel-content-editor-fields-group={target}>
                        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
                            <Typography variant="gamma" color="alpha">{target}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <FormGroup variant="normal" className={classes.formGroup}>
                                {fieldsByTarget.map(field => {
                                    return <EditNodeProperty key={field.formDefinition.name} field={field} siteInfo={siteInfo}/>;
                                })}
                            </FormGroup>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                );
            })}
        </form>
    );
};

FormBuilder.propTypes = {
    classes: PropTypes.object.isRequired,
    fields: FieldsPropTypes.isRequired,
    formik: PropTypes.object.isRequired,
    siteInfo: PropTypes.object.isRequired
};

export default compose(
    translate(),
    withStyles(styles),
    connect
)(FormBuilder);
