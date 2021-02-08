import React, {  useContext, useEffect, useState } from 'react'
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import { ActivityFormValues } from '../../../app/models/activity'
import ActivityStore from '../../../app/stores/ActivityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router'
import { Form as FinalForm, Field } from 'react-final-form';
import TextInput from '../../../app/Common/Form/TextInput'
import TextAreaInput from '../../../app/Common/Form/TextAreaInput'
import SelectInput from '../../../app/Common/Form/SelectInput'
import { category } from '../../../app/Common/Options/CategoryOptions'
import DateInput from '../../../app/Common/Form/DateInput'
import { combinedDatesAndTime } from '../../../app/Common/util/util'
import { v4 as uuid } from 'uuid'
import { combineValidators, isRequired, composeValidators, hasLengthGreaterThan } from 'revalidate'

const validate = combineValidators({
    title: isRequired({ message: 'The event title is required' }),
    category: isRequired({ message: 'The event category is required' }),
    description: composeValidators(
        isRequired,
        hasLengthGreaterThan(4)({ message: 'Description needs to be at least 5 characters' })
    )('description'),
    city: isRequired({ message: 'The event City is required' }),
    venue: isRequired({ message: 'The event venue is required' }),
    date: isRequired({ message: 'The event date is required' }),
    time: isRequired({ message: 'The event time is required' })

})

interface DetailParams {
    id: string
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
    match,
    history
}) => {
    const activityStore = useContext(ActivityStore);
    const { createActivity,
        editActivity,
        submitting,
        loadActivity,
    } = activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues())
    const [loading, setloading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setloading(true);
            loadActivity(match.params.id).then(
                (activity) => setActivity(new ActivityFormValues(activity))
            ).finally(() => setloading(false));
        }
    }, [loadActivity,
        match.params.id,
    ]);

    const handleFinalFormSubmit = (values: any) => {

        const dateAndTime = combinedDatesAndTime(values.date, values.time)
        const { date, time, ...activity } = values
        activity.date = dateAndTime;
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        validate={validate}
                        initialValues={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit,invalid,pristine }) => (
                            <Form onSubmit={handleSubmit} loading={loading}>
                                <Field
                                    name='title'
                                    placeholder='Title'
                                    value={activity.title}
                                    component={TextInput}
                                />
                                <Field
                                    name='description'
                                    placeholder='Description'
                                    rows={3}
                                    value={activity.description}
                                    component={TextAreaInput}

                                />
                                <Field
                                    name='category'
                                    options={category}
                                    placeholder='Category'
                                    value={activity.category}
                                    component={SelectInput}

                                />
                                <Form.Group widths='equal'>
                                    <Field
                                        component={DateInput}
                                        name='date'
                                        date={true}
                                        placeholder='Date'
                                        value={activity.date}

                                    />
                                    <Field
                                        component={DateInput}
                                        name='time'
                                        time={true}
                                        placeholder='Time'
                                        value={activity.time}

                                    />
                                </Form.Group>

                                <Field
                                    name='city' placeholder='City'
                                    value={activity.city}
                                    component={TextInput}
                                />
                                <Field
                                    name='venue'
                                    placeholder='Venue'
                                    value={activity.venue}
                                    component={TextInput}
                                />
                                <Button loading={submitting}
                                    disabled={loading||invalid||pristine}
                                    floated='right'
                                    positive type='submit'
                                    content='Submit' />
                                <Button
                                    disabled={loading}
                                    onClick={activity.id ? () => history.push(`/activities/${activity.id}`) : () => history.push('/activities')}
                                    floated='right'
                                    type='button'
                                    content='Cancel' />
                            </Form>
                        )}
                    />

                </Segment>
            </Grid.Column>
        </Grid>

    )
}

export default observer(ActivityForm)