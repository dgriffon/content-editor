import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import FormBuilder from './FormBuilder';

jest.mock('~/ContentEditor.context', () => {
    let contextmock;
    return {
        useContentEditorContext: () => {
            return contextmock;
        },
        setContext: c => {
            contextmock = c;
        }
    };
});
import {setContext} from '~/ContentEditor.context';

describe('FormBuilder component', () => {
    let context;

    beforeEach(() => {
        context = {
            sections: [
                {displayName: 'content'},
                {displayName: 'Layout'}
            ],
            nodeData: {
                isPage: true,
                primaryNodeType: {hasOrderableChildNodes: true}
            }
        };
    });

    it('should display each section', () => {
        setContext(context);
        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).find('section');

        context.sections.forEach(section => {
            expect(cmp.find({section}).exists()).toBe(true);
            if (section.displayName === 'content') {
                expect(cmp.props()['data-sel-mode']).toBe('create');
            }
        });
    });
});
