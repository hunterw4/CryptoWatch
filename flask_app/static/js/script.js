document.addEventListener('DOMContentLoaded', function() {
    var signupForm = document.getElementById('myform');
    var loginForm = document.getElementById('loginForm');

    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateForm();
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateLogin();
        });
    }
});

function validateForm() {
    var formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirm_password: document.getElementById('confirm_password').value
    };

    // AJAX call to validate
    fetch('/validate-signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        
        if (data.errors) {
            Object.keys(data.errors).forEach(key => {
                document.getElementById(key + '-error').textContent = data.errors[key];
            });
        } else {
            console.log('Form is valid')
            createUser(formData);
        }
    })
    .catch(error => console.error('Validation Error:', error));
}

function createUser(formData) {
    fetch('/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            console.log('Unexpected response:', response);
            return response.json(); // Return JSON if no redirect
        }
    })
    .then(data => {
        if (data && data.success) {
            console.log('User created successfully');
        } else {
            console.error('User creation failed:', data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function validateLogin() {
    var formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };

    // AJAX call to validate
    fetch('/validate-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            // Parse the JSON even if it's not OK, so we can display server errors
            return response.json().then(err => {
                throw err; // Now 'err' will contain the JSON errors if any
            });
        }
        return response.json();
    })
    .then(data => {
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        
        if (data.errors) {
            Object.keys(data.errors).forEach(key => {
                document.getElementById(key + '-error').textContent = data.errors[key];
            });
        } else if (data.redirect) {
            // Redirect to the URL specified in the JSON response
            window.location.href = data.redirect;
        } else {
            console.log('Unexpected response:', data);
            // Handle unexpected responses if needed
        }
    })
    .catch(error => {
        console.error('Login Error:', error);
        
        // If the error is from our server (like validation errors), we can display them
        if (error.errors) {
            Object.keys(error.errors).forEach(key => {
                var errorElement = document.getElementById(key + '-error');
                if (errorElement) {
                    errorElement.textContent = error.errors[key];
                }
            });
        } else {
            // For other types of errors (network, etc.), show a generic message
            var generalErrorElement = document.getElementById('general-error');
            if (!generalErrorElement) {
                generalErrorElement = document.createElement('span');
                generalErrorElement.id = 'general-error';
                document.querySelector('.form-group').appendChild(generalErrorElement);
            }
            generalErrorElement.textContent = 'An error occurred during login. Please try again.';
        }
    });
}