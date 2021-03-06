import dayjs from '~/date.config';
import {getDynamicFieldSets, getFields} from '~/EditPanel/EditPanel.utils';
import {resolveSelectorType} from '~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes.utils';

const getInitialValues = (nodeData, sections) => {
    // Retrieve dynamic fieldSets
    const dynamicFieldSets = getDynamicFieldSets(sections);

    // Retrieve fields and the return object contains the field name as the key and the field value as the value
    const fields = getFields(sections)
        .reduce((result, field) => ({...result, ...getFieldValues(field, nodeData)}), {});

    const childrenOrderingFields = getChildrenOrderingFields(nodeData);

    // Return object contains fields and dynamic fieldSets
    return {...fields, ...dynamicFieldSets, ...childrenOrderingFields};
};

const getFieldValues = (field, nodeData) => {
    const property = nodeData.properties.find(prop => prop.name === field.name);
    const selectorType = resolveSelectorType(field);
    const formFields = {};

    if (!property) {
        // Init value
        if (selectorType && selectorType.initValue) {
            formFields[field.name] = selectorType.initValue(field);
        }
    } else if (selectorType) {
        let adaptedPropertyValue;
        if (selectorType.adaptValue) {
            adaptedPropertyValue = selectorType.adaptValue(field, property);
        } else {
            adaptedPropertyValue = field.multiple ? property.values : property.value;
        }

        formFields[field.name] = adaptedPropertyValue;
    }

    return formFields;
};

const getDetailsValue = (sections = [], nodeData = {}, lang = 'en') => {
    // Retrieve only fields inside the metadata section
    const fields = getFields(sections, 'metadata');

    if (!fields) {
        return [];
    }

    return fields
        .filter(field => field.readOnly)
        .map(field => {
            const jcrDefinition = nodeData.properties.find(
                prop => prop.name === field.name
            );

            if (field.selectorType.includes('Date')) {
                return {
                    label: field.displayName,
                    value: jcrDefinition &&
                        jcrDefinition.value &&
                        dayjs(jcrDefinition.value).locale(lang).format('L HH:mm')
                };
            }

            return {
                label: field.displayName,
                value: jcrDefinition && jcrDefinition.value
            };
        });
};

const getTechnicalInfo = (nodeData, t) => {
    return [
        {
            label: t('content-editor:label.contentEditor.details.contentType'),
            value: nodeData.primaryNodeType.displayName
        },
        {
            label: t('content-editor:label.contentEditor.details.mixinTypes'), value: [
                nodeData.primaryNodeType.name,
                ...nodeData.mixinTypes.map(m => m.name)
            ].filter(v => v).join('; ')
        },
        {label: t('content-editor:label.contentEditor.details.path'), value: nodeData.path},
        {label: t('content-editor:label.contentEditor.details.uuid'), value: nodeData.uuid}
    ];
};

const adaptSections = sections => {
    const cloneSections = JSON.parse(JSON.stringify(sections));

    return cloneSections
        .reduce((result, section) => {
            if (section.name === 'metadata') {
                section.fieldSets = section.fieldSets.reduce((fieldSetsField, fieldSet) => {
                    if (fieldSet.fields.find(f => f.readOnly)) {
                        return [...fieldSetsField];
                    }

                    return [...fieldSetsField, fieldSet];
                }, []);
            }

            return [...result, section];
        }, [])
        .filter(section => (section.fieldSets && section.fieldSets.length > 0));
};

const getChildrenOrderingFields = nodeData => {
    if (!nodeData.isPage && nodeData.primaryNodeType.hasOrderableChildNodes) {
        return {
            // The name of this field contain :: because it's forbiden in JCR. With this we avoid collision :)
            'Children::Order': nodeData.children.nodes
        };
    }

    return {};
};

export const adaptFormData = (data, lang, t) => {
    const isEdit = Boolean(data.forms.editForm);
    const nodeData = data.jcr.result;
    const sections = isEdit ? data.forms.editForm.sections : data.forms.createForm.sections;

    return {
        sections: adaptSections(sections),
        initialValues: isEdit ? getInitialValues(nodeData, sections) : {},
        nodeData,
        details: isEdit ? getDetailsValue(sections, nodeData, lang) : {},
        technicalInfo: isEdit ? getTechnicalInfo(nodeData, t) : {},
        title: data.jcr.nodeTypeByName ?
            t('content-editor:label.contentEditor.create.title', {type: data.jcr.nodeTypeByName.displayName}) :
            nodeData.displayName
    };
};
