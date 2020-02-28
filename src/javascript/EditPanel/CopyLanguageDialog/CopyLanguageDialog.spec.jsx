import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {CopyLanguageDialog} from './';

describe('CopyLanguageDialog', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            isOpen: false,
            language: 'en',
            availableLanguages: [{
                displayName: 'Deutsch',
                language: 'de',
                activeInEdit: true
            },
            {
                displayName: 'English',
                language: 'en',
                activeInEdit: true
            }],
            t: jest.fn(key => 'translated_' + key),
            onCloseDialog: jest.fn(),
            formik: {}
        };
    });

    it('should hide dialog when open is false', () => {
        const cmp = shallowWithTheme(
            <CopyLanguageDialog {...defaultProps}/>,
            {},
            dsGenericTheme
        ).dive();

        expect(cmp.props().open).toBe(false);
    });
});
