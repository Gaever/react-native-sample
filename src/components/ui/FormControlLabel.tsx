import {FormControl} from 'native-base';

export interface FormControlLabelProps extends React.PropsWithChildren {}

function FormControlLabel(props: FormControlLabelProps) {
  return (
    <FormControl.Label top={2} _text={{fontSize: 12, color: 'gray.400'}}>
      {props.children}
    </FormControl.Label>
  );
}

export default FormControlLabel;
