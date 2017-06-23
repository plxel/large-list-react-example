import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'
import Snackbar from 'material-ui/Snackbar'
import Link from 'next/link'
import Layout from '../components/Layout'
import VirtualList from '../components/VirtualList'
import UsersList from '../components/UsersList'
import CreateUserForm from '../components/CreateUserForm'
import groupBy from '../components/utils/groupBy'
import 'isomorphic-fetch'

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 15
  },
  row: {
    border: '1px solid gray'
  },
  btn: {
    margin: 5
  },
  dialog: {
    width: 300
  }
}

const VirtualDataList = VirtualList()(UsersList)

const fieldToGroup = "group";

const apiUrl = 'http://demo5663279.mockable.io/api/users/';

class Main extends Component {
  static async getInitialProps ({ req }) {
    try {
      const res = await fetch(apiUrl);
      const users = await res.json()
      return { users }
    }
    catch(e) {
      console.error(e)
      return { users : [] }
    }
  }

  constructor (props, context) {
    super(props, context)
    let defaultSort = {
      field : "firstName",
      order: 1 // 1 == asc, -1 == desc
    }
    this.state = {
      open: false,
      users : this.sortUsers(props.users, defaultSort),
      sortBy : defaultSort,
      withGrouping : false,
      snackOpen : false,
      snackMessage : ""
    }
  }

  closeAddUserDialog = () => {
    this.setState({ open: false })
  }

  openAddUserDialog = () => {
    this.setState({ open: true })
  }

  onAddUser = ({ firstName, lastName, group }) => {
    fetch(apiUrl, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify({ firstName, lastName, group })
    })
    .then((response) => response.text())
    .then((__) => {
      // here response can contains real id, for now use just length
      const { users, sortBy, withGrouping } = this.state;
      this.refreshUsersList(
        [...users, { firstName, lastName, group, _id : users.length }],
        sortBy,
        withGrouping,
        () => this.setState({snackOpen : true, snackMessage : "User added"})
      )

    })
    .catch((err) => {
      this.setState({ open: false, snackOpen : true, snackMessage : "Error while adding user" })
    });

  }

  sortGroupedUsers = (grouped, sort) => {
    return grouped.map(g => this.sortUsers(g, sort)).reduce((acc, g) => acc.concat(g), [])
  }

  sortUsers = (users, sort) => {
    return [...users].sort((u1, u2) => {
      if (sort.order === 1)
        return u1[sort.field].toLowerCase().localeCompare(u2[sort.field].toLowerCase())
      else {
        return u2[sort.field].toLowerCase().localeCompare(u1[sort.field].toLowerCase())
      }
    })
  }

  refreshUsersList = (users, newSort, withGrouping, onDone) => {
    const sortedUsers = withGrouping ? this.sortGroupedUsers(groupBy(users, fieldToGroup), newSort) : this.sortUsers(users, newSort)
    this.setState({
      sortBy : newSort,
      users : sortedUsers,
      withGrouping,
      open : false
    }, () => onDone ? onDone() : {})
  }

  onListHeadClick = (field) => {
    const { sortBy, withGrouping, users } = this.state
    const newSort = sortBy.field === field ? { ...sortBy, order : -1 * sortBy.order } : { field, order: 1 }
    this.refreshUsersList(users, newSort, withGrouping)
  }

  handleSwitchView = () => {
    const { sortBy, withGrouping, users } = this.state;
    this.refreshUsersList(users, sortBy, !withGrouping)
  }

  render () {

    return (
      <Layout>
        <div style={styles.container}>
          <Dialog
            open={this.state.open}
            title='Create user'
            onRequestClose={this.handleRequestClose}
            contentStyle={styles.dialog}
          >
            <CreateUserForm onAdd={this.onAddUser} onCancel={this.closeAddUserDialog}/>
          </Dialog>
          <h1>Project example</h1>
          <h2>{`Users list ${ this.state.withGrouping ? "(Grouped by Group)" : "" }`}</h2>
          <Link href="/">
            <RaisedButton
              label="Back to index"
              secondary={Boolean(true)}
              style={styles.btn}
            />
          </Link>

          <RaisedButton
            label="Add new user"
            secondary={Boolean(true)}
            onTouchTap={this.openAddUserDialog}
            style={styles.btn}
          />

          <RaisedButton
            label="Switch view"
            secondary={Boolean(true)}
            onTouchTap={this.handleSwitchView}
            style={styles.btn}
          />

          <div className="container">
            <VirtualDataList
              items={this.state.users}
              itemHeight={50}
              onHeadClick={this.onListHeadClick}
              sortBy={this.state.sortBy}
              sortableFields={["firstName", "lastName"]}
              groupBy={fieldToGroup}
              withGrouping={this.state.withGrouping}
            />
          </div>

          <style jsx>{`
            .container {
              position: relative;
              min-height: 1px;
              padding-right: 15px;
              padding-left: 15px;
              margin: 0 auto;
              max-width: 970px;
            }
            @media (max-width: 767px) {
              .container  {
                padding: 0px;
              }
            }
          `}</style>
        </div>
        <Snackbar
          open={this.state.snackOpen}
          message={this.state.snackMessage}
          autoHideDuration={2000}
        />
      </Layout>
    )
  }
}

export default Main
