import React, { Component, PropTypes } from 'react';
import { fetch } from '@jenkins-cd/design-language';
import Table from './Table';
import Runs from './Runs';
import { ActivityRecord, ChangeSetRecord } from './records';

const { object, array } = PropTypes;

export class Activity extends Component {
    render() {
        const { pipeline, data } = this.props;
        // early out
        if (!data || !pipeline) {
            return null;
        }
        const headers = [
            'Status',
            'Build',
            'Commit',
            { label: 'Branch', className: 'branch' },
            { label: 'Message', className: 'message' },
            { label: 'Duration', className: 'duration' },
            { label: 'Completed', className: 'completed' },
        ];

        let latestRecord = {};
        return (<main>
            <article>
                <Table className="activity-table" headers={headers}>
                    { data.map((run, index) => {
                        const changeset = run.changeSet;
                        if (changeset && changeset.length > 0) {
                            latestRecord = new ChangeSetRecord(changeset[
                                Object.keys(changeset)[0]
                            ]);
                        }
                        const props = {
                            ...pipeline,
                            key: index,
                            changeset: latestRecord,
                            result: new ActivityRecord(run),
                        };
                        return (<Runs {...props} />);
                    })}
                </Table>
            </article>
        </main>);
    }
}

Activity.propTypes = {
    pipeline: object,
    data: array,
};

// Decorated for ajax as well as getting pipeline from context
export default fetch(Activity, ({ pipeline }, config) => {
    if (!pipeline) return null;
    const baseUrl = `${config.getAppURLBase()}/rest/organizations/jenkins` +
        `/pipelines/${pipeline.name}`;
    return `${baseUrl}/runs`;
});