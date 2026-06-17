/*
  Demo user data for the login app.

  Not connected to a real database!
  It is only used so we can PRACTICE automated login testing.
*/
const users = [
  {
    username: 'qa_user',
    password: 'Password123!',
    displayName: 'QA Tester',
    locked: false
  },
  {
    username: 'locked_user',
    password: 'Password123!',
    displayName: 'Locked User',
    locked: true
  }
];

/*
  DOM element references.

  These variables connect the JavaScript logic to elements on the page.
*/
const loginCard = document.querySelector('#login-card');
const dashboard = document.querySelector('#dashboard');
const form = document.querySelector('#login-form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const message = document.querySelector('#message');
const welcomeMessage = document.querySelector('#welcome-message');
const logoutButton = document.querySelector('#logout-button');

/*
  Displays a message on the page.

  text = the message to display
  type = the CSS class, such as "error" or "success"
*/
function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

/*
  Shows the dashboard after a successful login.

  This hides the login card, shows the dashboard,
  and displays a welcome message for the user.
*/
function showDashboard(user) {
  loginCard.classList.add('hidden');
  dashboard.classList.remove('hidden');
  welcomeMessage.textContent = `Welcome, ${user.displayName}!`;
}

/*
  Shows the login form after logout.

  This hides the dashboard, clears the form fields,
  clears any old messages, and focuses the username field.
*/
function showLogin() {
  dashboard.classList.add('hidden');
  loginCard.classList.remove('hidden');
  form.reset();
  showMessage('', '');
  usernameInput.focus();
}

/*
  Handles the login form submission.

  This function checks:
  1. Empty username or password
  2. Invalid username or password
  3. Locked account
  4. Successful login
*/
form.addEventListener('submit', (event) => {
  /*
    Prevents the page from refreshing when the form is submitted.
    This allows JavaScript to handle the login process.
  */
  event.preventDefault();

  /*
    Gets the values entered by the user.
    trim() removes extra spaces before and after the username.
  */
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  /*
    Validation check for empty fields.
  */
  if (!username || !password) {
    showMessage('Username and password are required.', 'error');
    return;
  }

  /*
    Looks for a user account with the matching username.
  */
  const user = users.find((account) => account.username === username);

  /*
    Checks if the username exists and if the password is correct.
  */
  if (!user || user.password !== password) {
    showMessage('Invalid username or password.', 'error');
    return;
  }

  /*
    Checks if the account is locked.
  */
  if (user.locked) {
    showMessage('This account is locked. Contact an administrator.', 'error');
    return;
  }

  /*
    If all checks pass, login is successful.
  */
  showMessage('Login successful.', 'success');
  showDashboard(user);
});

/*
  Handles logout button clicks.
*/
logoutButton.addEventListener('click', showLogin);