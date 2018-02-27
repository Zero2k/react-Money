import React from 'react';
import {
  Container,
  Menu,
  Input,
  Tab,
  Dimmer,
  Loader
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { singleLenderQuery } from '../graphql/lender';

import FormLender from '../components/Form/FormLender';

const EditLender = ({ singleLenderQuery: { loading, lenderByName } }) => {
  if (loading || !lenderByName) {
    return (
      <Dimmer active>
        <Loader>Loading</Loader>
      </Dimmer>
    );
  }

  const { data } = lenderByName;

  return (
    <div>
      <Menu pointing>
        <Container>
          <Menu.Item name="Start" onClick={this.handleItemClick} />
          <Menu.Item name="Lenders" />
          <Menu.Menu position="right">
            <Menu.Item>
              <Input icon="search" placeholder="Search..." />
            </Menu.Item>
            <Menu.Item name="logout" onClick={this.handleItemClick} />
          </Menu.Menu>
        </Container>
      </Menu>
      <Container style={{ paddingTop: '20px' }}>
        <h3>Edit - {data.name}</h3>
        <Tab
          menu={{ pointing: true }}
          panes={[
            {
              menuItem: 'Edit',
              render: () => (
                <Tab.Pane attached={false}>
                  <FormLender data={data} />
                </Tab.Pane>
              )
            },
            {
              menuItem: 'Loans',
              render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane>
            }
          ]}
        />
      </Container>
    </div>
  );
};

export default compose(
  // graphql(coinQuery, { name: 'coinQuery', options: { fetchPolicy: 'cache-and-network' } }),
  graphql(singleLenderQuery, {
    name: 'singleLenderQuery',
    options: props => ({
      variables: {
        name: props.match.params.name
      }
    })
  }))(EditLender);