import React, {Component} from 'react'
import PropTypes from 'prop-types'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

const defaultRequiredMessage = "This field is required"

class CreateUserForm extends Component {
  static propTypes = {
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      firstNameError : "",
      lastNameError : "",
    }
  }

  onAdd = () => {
    const { firstName, lastName, group } = this.state;
    let firstNameError, lastNameError
    if (!firstName)
      firstNameError = defaultRequiredMessage
    if (!lastName)
      lastNameError = defaultRequiredMessage
    if (firstNameError || lastNameError)
      this.setState({ firstNameError, lastNameError })
    else
      this.props.onAdd({ firstName, lastName, group })
  }

  handleChange = (event) => {
    let newState = {};
    newState[[event.target.name]] = event.target.value;
    this.setState(newState)
  }

  render() {
    const { firstName, lastName } = this.state
    return (
      <div>
        <TextField
          hintText="Your first name"
          floatingLabelText="First name"
          name="firstName"
          onChange={this.handleChange}
          value={this.state.firstName}
          errorText={this.state.firstNameError}
        /><br />
        <TextField
          hintText="Your last name"
          floatingLabelText="Last name"
          name="lastName"
          onChange={this.handleChange}
          value={this.state.lastName}
          errorText={this.state.lastNameError}
        /><br />
        <TextField
          hintText="Group"
          floatingLabelText="Group"
          name="group"
          onChange={this.handleChange}
          value={this.state.group}
        /><br /><br />

        <div className="form-actions">
          <RaisedButton
            label='Add'
            primary={Boolean(true)}
            onTouchTap={this.onAdd}
            disabled={!firstName || !lastName}
          />
          <FlatButton
            label='Cancel'
            primary={Boolean(true)}
            onTouchTap={this.props.onCancel}
          />
          <style jsx>{`
            .form-actions {
              text-align: right;
            }
          `}</style>
        </div>
      </div>
    )
  }
}

export default CreateUserForm
