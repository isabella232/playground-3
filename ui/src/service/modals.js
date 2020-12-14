import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';

import {connect} from 'react-redux';

import {PlaygroundFormModal} from '../shared/modal';
import {
    ServiceConfigurationForm, ServiceEnvironmentForm,
    ServiceForm} from './forms';
import {ServicePorts} from './ports';
import {ServiceReadme} from './readme';


export class BaseServiceFormModal extends React.PureComponent {
    static propTypes = exact({
        status: PropTypes.string.isRequired,
        form: PropTypes.object.isRequired,
        service_types: PropTypes.object.isRequired,
        onUpdate: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired,
    });

    get activityMessages () {
        const {form} = this.props;
        const {name} = form;
        return {
            default: [10, <span>Creating service ({name})...</span>],
            pull_start: [50, <span>Pulling service image ({name})...</span>],
            volume_create: [80, <span>Creating volumes for service ({name})...</span>],
            start: [90, <span>Starting service container ({name})...</span>],
            success: [100, <span>Service has started ({name})!</span>]};
    }

    get tabs () {
        const {dispatch, form, service_types} = this.props;
        const {errors, name='', service_type} = form;
        const tabs = {
            Service: (
                <ServiceForm
                  service_types={service_types}
                  form={form}
                />)};
        if (service_type && service_type !== undefined) {
            const service_config = service_types[service_type];
            const {image, labels={}} = service_config;
            if (name.length > 2 && !errors.name) {
                const configPath  = labels['envoy.playground.config.path'];
                if (configPath) {
                    tabs.Configuration = (
                        <ServiceConfigurationForm
                          service_types={service_types}
                          form={form}
                          dispatch={dispatch}
                        />);
                }
                tabs.Environment = (
                    <ServiceEnvironmentForm
                      service_type={service_type}
                      service_types={service_types}
                      form={form}
                      dispatch={dispatch}
                    />)
                ;
                const ports = labels['envoy.playground.ports'];
                if (ports) {
                    tabs.Ports = (
                        <ServicePorts
                          labels={labels}
                          ports={ports} />);
                }
                if (labels['envoy.playground.readme']) {
                    tabs.README = (
                        <ServiceReadme
                          readme={labels['envoy.playground.readme']}
                          title={labels['envoy.playground.service']}
                          description={labels['envoy.playground.description']}
                          image={image}
                          service_type={service_type}
                          logo={labels['envoy.playground.logo']} />);
                }
            }
        }
        return tabs;
    }

    render () {
        const {form, service_types} = this.props;
        const {name, service_type} = form;
        return (
            <PlaygroundFormModal
              icon={(service_types[service_type] || {}).icon}
              messages={this.activityMessages}
              failMessage={"Failed starting Envoy proxy (" + name  + "). See logs for errors."}
              success='start'
              fail={['exited', 'destroy', 'die']}
              tabs={this.tabs} />
        );
    }
}


const mapModalStateToProps = function(state, other) {
    return {
        service_types: state.service_type.value,
        form: state.form.value,
    };
};

const ServiceFormModal = connect(mapModalStateToProps)(BaseServiceFormModal);
export {ServiceFormModal};
