import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { DateTimePicker } from 'react-widgets';
import { FormFieldProps, Label, Form } from 'semantic-ui-react';


interface IProps extends FieldRenderProps<Date, HTMLElement>,
    FormFieldProps { id?: string };
const DateInput: React.FC<IProps> = ({
    input,
    width,
    date=false,
    time=false,    
    placeholder,
    meta: { touched, error },
    messages,
    ...rest
}) => {
    return (
        
        <Form.Field error={touched && !!error} >

            <DateTimePicker
                date={date}
                time={time}
                onBlur={input.onBlur}
                messages={messages}
                onKeyDown={(e)=>e.preventDefault()}
                placeholder={placeholder!}
                value={input.value || null}
                onChange={input.onChange}               
                {...rest}
            />
            {touched && error && (
                <Label basic color='red'>
                    {error}
                </Label>
            )}
        </Form.Field>
    )
}

export default DateInput