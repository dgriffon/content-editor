import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const FormQuery = gql`
    query createForm($uilang:String!, $language:String!, $parentPath:String!, $path:String!, $primaryNodeType:String!) {
        forms {
            createForm(primaryNodeType: $primaryNodeType, uiLocale: $uilang, locale: $language, parentPath: $parentPath) {
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
            result:nodeByPath(path: $path) {
                ...NodeCacheRequiredFields
                lockedAndCannotBeEdited
                displayableNode {
                    path
                    isFolder:isNodeType(type: {multi: ANY, types: ["jnt:contentFolder", "jnt:folder"]})
                }
                displayName(language: $language)
                mixinTypes {
                    name
                }
                parent {
                    displayName(language: $language)
                    path
                }
                primaryNodeType {
                    name
                    displayName(language: $uilang)
                    properties {
                        name
                        requiredType
                    }
                    supertypes {
                        name
                    }
                    hasOrderableChildNodes
                }
            }
            nodeTypeByName(name: $primaryNodeType) {
                displayName(language: $uilang)
            }
        }
       
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
