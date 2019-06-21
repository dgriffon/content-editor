import {dsGenericTheme} from '@jahia/design-system-kit';
import {shallowWithTheme} from '@jahia/test-framework';
import React from 'react';
import {DatePickerInput, getMaskOptions} from './DatePickerInput';

describe('DatePickerInput', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            lang: 'fr'
        };
    });

    it('should display datepicker on button click', () => {
        const cmp = shallowWithTheme(
            <DatePickerInput {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.dive().find('WithStyles(Popover)').props().open).toBe(false);

        // Simulate click on date picker icon
        // expect(cmp.dive().find('WithStyles(Popover)').props().open).toBe(true);
    });

    it('it should generate the good input mask', () => {
        let maskOptions = getMaskOptions(null, true);
        expect(maskOptions.mask).toBe('99/99/9999 99:99');
        expect(maskOptions.empty).toBe('__/__/____ __:__');

        maskOptions = getMaskOptions(null, false);
        expect(maskOptions.mask).toBe('99/99/9999');
        expect(maskOptions.empty).toBe('__/__/____');

        maskOptions = getMaskOptions('yyyy-MM-dd', false);
        expect(maskOptions.mask).toBe('9999-99-99');
        expect(maskOptions.empty).toBe('____-__-__');

        maskOptions = getMaskOptions('yyyy-MM-dd HH:mm', false);
        expect(maskOptions.mask).toBe('9999-99-99 99:99');
        expect(maskOptions.empty).toBe('____-__-__ __:__');
    });
});