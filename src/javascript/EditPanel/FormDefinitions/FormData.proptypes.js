import PropTypes from 'prop-types';

const LabelledValue = PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string
});

export const DetailsPropTypes = PropTypes.arrayOf(LabelledValue);
export const TechnicalInfoPropTypes = PropTypes.arrayOf(LabelledValue);

export const NodeDataPropTypes = PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    primaryNodeType: PropTypes.shape({
        displayName: PropTypes.string
    }).isRequired,
    aggregatedPublicationInfo: PropTypes.shape({
        publicationStatus: PropTypes.string.isRequired
    }).isRequired
});

export const FieldPropTypes = PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string.isRequired,
    multiple: PropTypes.bool,
    i18n: PropTypes.bool,
    selectorType: PropTypes.string,
    mandatory: PropTypes.bool,
    readOnly: PropTypes.bool,
    requiredType: PropTypes.string
});
export const FieldSetPropTypes = PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(FieldPropTypes)
});
export const SectionPropTypes = PropTypes.shape({
    name: PropTypes.string,
    displayName: PropTypes.string.isRequired,
    fieldSets: PropTypes.arrayOf(FieldSetPropTypes)
});
export const SectionsPropTypes = PropTypes.arrayOf(SectionPropTypes);