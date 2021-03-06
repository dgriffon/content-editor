import {adaptFormData} from './FormData.adapter';

jest.mock('~/EditPanel/EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes.utils', () => {
    return {
        resolveSelectorType: ({selectorType}) => {
            if (selectorType === 'Checkbox') {
                return {
                    adaptValue: (field, property) => {
                        return field.multiple ? property.values.map(value => value === 'true') : property.value === 'true';
                    }
                };
            }

            return {};
        }
    };
});

jest.mock('~/date.config', () => {
    return date => {
        return {
            locale() {
                return {
                    format(format) {
                        return `formatted date: ${date} format: ${format}`;
                    }
                };
            }
        };
    };
});

const t = val => val;

describe('adaptFormData', () => {
    let graphqlResponse;
    beforeEach(() => {
        graphqlResponse = {
            forms: {
                editForm: {
                    sections: [
                        {
                            fieldSets: [
                                {
                                    fields: [
                                        {
                                            name: 'field1',
                                            displayName: 'labelled',
                                            selectorType: 'ContentPicker',
                                            currentValues: [
                                                {
                                                    string: '2019-05-07T11:33:31.056'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            jcr: {
                result: {
                    uuid: 'uuid1',
                    path: '/site/digitall/home',
                    displayName: 'nameOfNode',
                    primaryNodeType: {
                        displayName: 'ContentType',
                        name: 'jcr:contentType',
                        hasOrderableChildNodes: false,
                        properties: [
                            {name: 'field1', primaryNodeType: true}
                        ]
                    },
                    properties: [
                        {name: 'field1', properties: true, value: '2019-05-07T11:33:31.056'}
                    ],
                    mixinTypes: [
                        {name: 'Mixin1'},
                        {name: 'Mixin2'}
                    ],
                    lockInfo: {
                        details: []
                    },
                    children: {
                        nodes: []
                    }
                }
            }
        };
    });

    it('should return map adapt create', () => {
        graphqlResponse = {
            forms: {
                createForm: graphqlResponse.forms.editForm
            },
            jcr: graphqlResponse.jcr
        };
        // Delete properties
        delete graphqlResponse.jcr.result.properties;
        const adaptedData = adaptFormData(graphqlResponse, 'fr', t);
        expect(adaptedData.sections).toEqual(graphqlResponse.forms.createForm.sections);
        expect(adaptedData.initialValues).toEqual({});
        expect(adaptedData.details).toEqual({});
        expect(adaptedData.technicalInfo).toEqual({});
    });

    it('should return initialValues', () => {
        graphqlResponse.forms.editForm.sections = [];
        expect(adaptFormData(graphqlResponse, 'fr', t).initialValues).toEqual({});
    });

    it('should extract initialValues from fields', () => {
        const adaptedForm = adaptFormData(graphqlResponse, 'fr', t);

        expect(adaptedForm.initialValues).toEqual({field1: '2019-05-07T11:33:31.056'});
    });

    it('should extract initialValues with selectorType own logic', () => {
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].selectorType = 'Checkbox';
        const initialValues = adaptFormData(graphqlResponse, 'fr', t).initialValues;

        expect(initialValues).toEqual({field1: false});
    });

    it('should set values and no value as initialValue when multiple is at true', () => {
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].multiple = true;
        graphqlResponse.jcr.result.properties = [{
            name: 'field1',
            values: ['value1', 'value2']
        }];

        const initialValues = adaptFormData(graphqlResponse, 'fr', t).initialValues;

        expect(initialValues).toEqual({
            field1: ['value1', 'value2']
        });
    });

    it('should add details object with data needed', () => {
        graphqlResponse.forms.editForm.sections[0].name = 'metadata';
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].readOnly = true;
        expect(adaptFormData(graphqlResponse, 'fr', t).details).toEqual([
            {
                label: 'labelled',
                value: '2019-05-07T11:33:31.056'
            }
        ]);
    });

    it('should display the date according to user preference', () => {
        graphqlResponse.forms.editForm.sections[0].name = 'metadata';
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].selectorType = 'DatePicker';
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].readOnly = true;
        expect(adaptFormData(graphqlResponse, 'fr', t).details).toEqual([
            {
                label: 'labelled',
                value: 'formatted date: 2019-05-07T11:33:31.056 format: L HH:mm'
            }
        ]);
    });

    it('should add technicalInfo object', () => {
        expect(adaptFormData(graphqlResponse, 'fr', t).technicalInfo).toEqual([
            {
                label: 'content-editor:label.contentEditor.details.contentType',
                value: 'ContentType'
            },
            {
                label: 'content-editor:label.contentEditor.details.mixinTypes',
                value: 'jcr:contentType; Mixin1; Mixin2'
            },
            {
                label: 'content-editor:label.contentEditor.details.path',
                value: '/site/digitall/home'
            },
            {
                label: 'content-editor:label.contentEditor.details.uuid',
                value: 'uuid1'
            }
        ]);
    });

    it('should adapt sections ', () => {
        graphqlResponse.forms.editForm.sections[0].name = 'metadata';
        graphqlResponse.forms.editForm.sections[0].fieldSets[0].fields[0].readOnly = true;

        expect(adaptFormData(graphqlResponse, 'fr', t).sections).toEqual([]);
    });

    it('should return the nodeData name when editing', () => {
        expect(adaptFormData(graphqlResponse, 'fr', t).title).toEqual('nameOfNode');
    });

    it('should return the content type name when Creating', () => {
        graphqlResponse.jcr.nodeTypeByName = {
            displayName: 'nodeType'
        };

        expect(adaptFormData(graphqlResponse, 'fr', t).title).toEqual('content-editor:label.contentEditor.create.title');
    });

    it('should add ChildrenOrder field when we are not on a page and hasOrderableChildNodes', () => {
        graphqlResponse.jcr.result.isPage = false;
        graphqlResponse.jcr.result.primaryNodeType.hasOrderableChildNodes = true;

        expect(adaptFormData(graphqlResponse, 'fr', t).initialValues['Children::Order']).toEqual([]);
    });

    it('shouldn\'t add ChildrenOrder field when we are not on a page', () => {
        graphqlResponse.jcr.result.isPage = true;

        expect(adaptFormData(graphqlResponse, 'fr', t).initialValues['Children::Order']).not.toEqual([]);
    });
});
