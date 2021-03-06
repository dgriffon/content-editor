export const selectAllAction = {
    init: context => {
        if (context.field.multiple) {
            if (context.field.readOnly || !context.field.valueConstraints || context.field.valueConstraints.length === 0) {
                context.enabled = false;
                return;
            }

            context.mappedValueConstraints = context.field.valueConstraints.map(valueConstraint => valueConstraint.value.string);
            const values = context.formik.values[context.field.name];

            if (values && Array.isArray(values)) {
                context.enabled = !context.mappedValueConstraints.every(i => values.includes(i));
            }
        } else {
            // This action should not be displayed for single choice list
            context.isVisible = false;
        }
    },
    onClick: context => {
        if (context.enabled) {
            context.formik.setFieldValue(
                context.field.name,
                context.mappedValueConstraints,
                true
            );
            context.formik.setFieldTouched(context.field.name, context.field.multiple ? [true] : true);
        }
    }
};
