import React from 'react';
import { Container, Tab, Dimmer, Loader } from 'semantic-ui-react';
import { graphql, compose } from 'react-apollo';
import { singleLenderQuery, editLenderMutation } from '../../../graphql/lender';
import {
  addLoanMutation,
  editLoanMutation,
  deleteLoanMutation
} from '../../../graphql/loan';

import FormLender from '../../../components/Form/FormLender';
import AdminNavbar from '../../../components/Navbar/AdminNavbar';
import Table from '../../../components/LoanTable/Table';

class EditLender extends React.Component {
  submitEdit = async (values) => {
    try {
      await this.props.editLenderMutation({
        variables: {
          id: values.id,
          ...values
        }
        /* update: (store, { data: { updateProduct } }) => {
          const data = store.readQuery({ query: singleLenderQuery });
          data.products = data.products.map(x => (x.id === updateProduct.id ? updateProduct : x));
          store.writeQuery({ query: singleLenderQuery, data });
        } */
      });
    } catch (err) {
      console.log(err);
      return;
    }

    this.props.history.push('/dashboard/lender');
  };

  submitLoan = async (values) => {
    if (!values.id) {
      try {
        await this.props.addLoanMutation({
          variables: {
            ...values
          }
          /* update: (store, { data: { updateProduct } }) => {
            const data = store.readQuery({ query: singleLenderQuery });
            data.products = data.products.map(x => (x.id === updateProduct.id ? updateProduct : x));
            store.writeQuery({ query: singleLenderQuery, data });
          } */
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await this.props.editLoanMutation({
          variables: {
            ...values
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  deleteLoan = async (values) => {
    if (values.id) {
      try {
        await this.props.deleteLoanMutation({
          variables: {
            id: values.id
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    const { singleLenderQuery: { loading, lenderById } } = this.props;

    if (loading || !lenderById) {
      return (
        <Dimmer active>
          <Loader>Loading</Loader>
        </Dimmer>
      );
    }

    const { data } = lenderById;
    const { loans } = data;

    return (
      <div>
        <AdminNavbar />
        <Container style={{ paddingTop: '20px' }}>
          <h3>Edit - {data.name}</h3>
          <Tab
            menu={{ pointing: true }}
            panes={[
              {
                menuItem: 'Edit',
                render: () => (
                  <Tab.Pane attached={false}>
                    <FormLender data={data} submit={this.submitEdit} />
                  </Tab.Pane>
                )
              },
              {
                menuItem: 'Loans',
                render: () => (
                  <Tab.Pane attached={false}>
                    <Table
                      loans={loans}
                      submitLoan={this.submitLoan}
                      deleteLoan={this.deleteLoan}
                    />
                  </Tab.Pane>
                )
              }
            ]}
          />
        </Container>
      </div>
    );
  }
}

export default compose(
  graphql(editLenderMutation, {
    name: 'editLenderMutation',
    options: { fetchPolicy: 'no-cache' }
  }),
  graphql(singleLenderQuery, {
    name: 'singleLenderQuery',
    options: (props) => ({
      fetchPolicy: 'network-only',
      variables: {
        id: props.match.params.id
      }
    })
  }),
  graphql(addLoanMutation, {
    name: 'addLoanMutation',
    options: (props) => ({
      variables: {
        fetchPolicy: 'no-cache',
        lenderId: props.match.params.id
      }
    })
  }),
  graphql(editLoanMutation, {
    name: 'editLoanMutation',
    options: (props) => ({
      variables: {
        fetchPolicy: 'no-cache',
        lenderId: props.match.params.id
      }
    })
  }),
  graphql(deleteLoanMutation, {
    name: 'deleteLoanMutation',
    options: {
      fetchPolicy: 'no-cache'
    }
  })
)(EditLender);
