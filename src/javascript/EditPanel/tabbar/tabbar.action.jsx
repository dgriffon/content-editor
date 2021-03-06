import {composeActions} from '@jahia/react-material';
import {editRestrictedAction} from '~/actions/editRestricted.action';

export default composeActions(
    editRestrictedAction,
    {
        init: context => {
            context.disabled = context.value === context.activeTab;
        },
        onClick: context => {
            context.setActiveTab(context.value);
        }
    }
);
