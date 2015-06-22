var TeamPortal = React.createClass({
  loadTeamFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    return (
      <div className="TeamPortal">
        <table>
          <UserListHeaders />
          <UserList />
          <UserForm />
        </table>
      </div>
    );
  }
});

var UserListHeaders = React.createClass({
  render: function(){
    return (
      <tr>
        <td>FirstName</td>
        <td>LastName</td>
        <td>Email</td>
        <td>Active</td>
        <td>Admin</td>
        <td>Dev</td>
        <td>Password</td>
      </tr>
    );
  }
});

var UserForm = React.createClass({
  render: function() {
    return (
      <tr>
        <form>
          <td><input type="text" placeholder="first name"/></td>
          <td><input type="text" placeholder="last name"/></td>
          <td><input type="text" placeholder="email"/></td>
          <td><input type="checkbox"/>Active</td>
          <td><input type="checkbox"/>Dev</td>
          <td><input type="checkbox"/>Admin</td>
          <td><input type="submit"/></td>
        </form>
      </tr>
    );
  }

});

var UserList = React.createClass({
  render: function() {
    var userNodes = this.props.data.map(function (comment) {
    return (
            <User />
      );
  });

  return (
      {userNodes}
  );

var User = React.createClass({
  render: function() {
    return (
      <tr>
        <td>George</td>
        <td>Washington</td>
        <td>george@gmail.com</td>
        <td>isActive</td>
        <td>isDev</td>
        <td>isAdmin</td>
        <td>Password</td>
      </tr>
    );
  }
});

React.render(
  <TeamPortal />,
document.getElementById('team-portal')
);
