import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';

import {connect} from 'react-redux';

import APIResources from '../shared/resources';
import ServiceLogo from '../images/service.png';

import {ServiceModal} from './modals';


export class BaseServiceResources extends React.PureComponent {
    static propTypes = exact({
        dispatch: PropTypes.func.isRequired,
        services: PropTypes.object.isRequired,
        service_types: PropTypes.object.isRequired,
        modals: PropTypes.object.isRequired,
    });

    getLogo = (service_type) => {
        const {service_types={}} = this.props;
        if (!service_type) {
            return ServiceLogo;
        }
        const _service_type = service_types[service_type] || {};
        const {icon} = _service_type;
        return icon;
    };

    modalTitle = (name) => {
        return "Create a service";
    }

    render () {
        const {modals, services} = this.props;
        return (
            <APIResources
              api="service"
              title="Services"
              logo={this.getLogo}
              resources={services}
              modal={ServiceModal}
              modalTitle={this.modalTitle}
              modalAction="Create service"
              modals={modals} />);
    }
}


const mapStateToProps = function(state) {
    return {
        services: state.service.value,
        service_types: state.service_type.value,
    };
}

const ServiceResources = connect(mapStateToProps)(BaseServiceResources);
export default ServiceResources;
