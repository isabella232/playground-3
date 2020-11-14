import React from 'react';
import PropTypes from 'prop-types';
import exact from 'prop-types-exact';

import {
    Button, Col, CustomInput, Input, Row } from 'reactstrap';

import {updateForm} from '../../app/store';
import EdgeLogo from '../../images/edge.svg';
import EnvoyLogo from '../../images/envoy.svg';
import {ActionRemove} from '../actions';
import {PlaygroundForm, PlaygroundFormGroup, PlaygroundFormGroupRow} from './base';


export class PortMappingListForm extends React.PureComponent {
    static propTypes = exact({
        port_mappings: PropTypes.array,
    });

    render () {
        const {port_mappings=[]} = this.props;
        const onDelete = null;
        const title = '';

        if (port_mappings.length === 0) {
            return '';
        }
        return (
            <Row className="mt-2 pb-3">
              <Col>
                <Row className="pl-5 pr-5">
                  <Col sm={1} className="m-0 p-0">
                    <div className="p-1 bg-dark">
                      <span>&nbsp;</span>
                    </div>
                  </Col>
                  <Col sm={4} className="m-0 p-0">
                    <div className="p-1 bg-dark">
                      <img
                        alt={title}
                        src={EdgeLogo}
                        width="24px"
                        className="ml-1 mr-2"  />
                      External port
                    </div>
                  </Col>
                  <Col sm={3} className="m-0 p-0">
                    <div className="p-1 bg-dark">
                      <img
                        alt={title}
                        src={EnvoyLogo}
                        width="24px"
                        className="ml-1 mr-2"  />
                      Internal port
                    </div>
                  </Col>
                  <Col sm={4} className="m-0 p-0">
                    <div className="p-1 bg-dark">
                      Endpoint type
                    </div>
                  </Col>
                </Row>
                {port_mappings.map((mapping, index) => {
                    const {mapping_from, mapping_to, mapping_type} = mapping;
                    return (
                        <Row key={index} className="pl-5 pr-5">
                          <Col sm={1} className="m-0 p-0 border-bottom">
                            <div className="p-2 bg-white">
                              <ActionRemove
                                title={mapping_from}
                                name={mapping_from}
                                remove={evt => this.onDelete(evt, onDelete)} />
                            </div>
                          </Col>
                          <Col sm={4} className="m-0 p-0 border-bottom">
                            <div className="p-2 bg-white">
                              {mapping_from}
                            </div>
                          </Col>
                          <Col sm={3} className="m-0 p-0 border-bottom">
                            <div className="p-2 bg-white">
                              {mapping_to}
                            </div>
                          </Col>
                          <Col sm={4} className="m-0 p-0 border-bottom">
                            <div className="p-2 bg-white">
                              {(mapping_type || 'TCP/UDP').toUpperCase()}
                            </div>
                          </Col>
                        </Row>);
                })}
              </Col>
            </Row>);
    }
}


export class BasePortMappingForm extends React.Component {
    static propTypes = exact({
        dispatch: PropTypes.func,
        form: PropTypes.object.isRequired,
    });

    state = {
        mapping_from: undefined,
        mapping_to: undefined,
        mapping_type: undefined};

    onClick = (evt) => {
        const {mapping_from, mapping_to, mapping_type} = this.state;
        const {dispatch, form} = this.props;
        const {port_mappings=[]} = form;
        const newMappings = [...port_mappings, {mapping_from, mapping_to, mapping_type}];
        this.setState({mapping_from: undefined, mapping_to: undefined, mapping_type: undefined});
        dispatch(updateForm({port_mappings: newMappings}));
    }

    onChange = (evt) => {
        const {name, value} = evt.target;
        const state = {};
        state[name] = value;
        this.setState(state);
    }

    get messages () {
        return [
            "Expose ports from your container to localhost.",
            "Type hint is used to create links only."
        ];
    }

    render () {
        const {mapping_from, mapping_to, mapping_type} = this.state;
        const {form} = this.props;
        const {port_mappings=[]} = form;
        return (
            <PlaygroundForm messages={this.messages}>
              <PlaygroundFormGroup>
                <PlaygroundFormGroupRow
                  label="ports"
                  title="Port mapping">
                  <Col sm={2}>
                    <Input
                      type="number"
                      onChange={this.onChange}
                      id="mapping_from"
                      name="mapping_from"
                      value={mapping_from || ''}
                      placeholder="From" />
                  </Col>
                  <Col sm={2}>
                    <Input
                      type="number"
                      onChange={this.onChange}
                      id="mapping_to"
                      name="mapping_to"
                      value={mapping_to || ''}
                      placeholder="To" />
                  </Col>
                  <Col sm={3}>
                    <CustomInput
                      type="select"
                      id="mapping_type"
                      onChange={this.onChange}
                      value={mapping_type }
                      name="mapping_type">
                      <option>Type hint...</option>
                      <option>Generic TCP/UDP (default)</option>
                      <option value="http">HTTP</option>
                      <option value="https">HTTPS</option>
                    </CustomInput>
                  </Col>
                  <Col sm={2}>
                    <Button
                      color="success"
                      onClick={this.onClick}>+</Button>
                  </Col>
                </PlaygroundFormGroupRow>
                <PortMappingListForm port_mappings={[...port_mappings]} />
              </PlaygroundFormGroup>
            </PlaygroundForm>
        );
    }
}
