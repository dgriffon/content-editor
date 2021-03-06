import gql from 'graphql-tag';
import {NodeDataFragment} from '~/NodeData/NodeData.gql-queries';

export const FormQuery = gql`
    query editForm($uilang:String!, $language:String!, $path: String!) {
        forms {
            editForm(uiLocale: $uilang, locale: $language, nodePath : $path) {
                name
                displayName
                description
                sections {
                    name
                    displayName
                    description
                    fieldSets {
                        name
                        displayName
                        description
                        dynamic
                        activated
                        fields {
                            name
                            displayName
                            description
                            errorMessage
                            mandatory
                            i18n
                            multiple
                            readOnly
                            requiredType
                            selectorType
                            selectorOptions {
                                name
                                value
                            }
                            valueConstraints {
                                value {
                                    type
                                    string
                                }
                                displayValue
                                properties {
                                    name
                                    value
                                }
                            }
                            defaultValues {
                                string
                            }
                        }
                    }
                }
            }
        }
        jcr {
            ...NodeData
        }
    }
    ${NodeDataFragment.nodeData.gql}
`;
