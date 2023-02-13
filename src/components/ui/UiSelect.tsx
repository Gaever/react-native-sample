import {Select as NBSelect, ISelectProps, Icon} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export interface UiSelectProps extends ISelectProps {}

function UiSelect(props: UiSelectProps) {
  return (
    <NBSelect
      dropdownIcon={
        <Icon as={MaterialIcons} name="expand-more" size={7} color="black" />
      }
      {...props}>
      {props.children}
    </NBSelect>
  );
}

export default UiSelect;
