<?php
// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // If an `action` parameter is present, handle auth actions (login/signup)
    if (isset($_POST['action']) && in_array($_POST['action'], ['login','signup'])) {
        header('Content-Type: application/json');
        $action = $_POST['action'];
        $email = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
        $password = $_POST['password'] ?? '';

        if (!$email || !$password) {
            echo json_encode(['success' => false, 'message' => 'Email and password are required.']);
            exit;
        }

        // NOTE: This is a mock implementation. Replace with real auth logic.
        if ($action === 'login') {
            // Mock check: accept any password of length >= 6
            if (strlen($password) >= 6) {
                echo json_encode(['success' => true, 'message' => 'Login successful (mock)']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid credentials (mock)']);
            }
            exit;
        }

        if ($action === 'signup') {
            // Mock signup: pretend success
            echo json_encode(['success' => true, 'message' => 'Signup successful (mock)']);
            exit;
        }
    }

    // Default behavior: contact form handling (backwards compatible)
    // Get form data
    $name = $_POST["name"] ?? '';
    $email = $_POST["email"] ?? '';
    $message = $_POST["message"] ?? '';
    
    // Send email
    $to = "info@nestori.com";
    $subject = "Contact Form Submission";
    $body = "Name: $name\nEmail: $email\nMessage: $message";
    $headers = "From: $email";
    
    if (mail($to, $subject, $body, $headers)) {
        echo "Thank you for contacting us. We will get back to you soon!";
    } else {
        echo "Oops! Something went wrong. Please try again later.";
    }
} else {
    // Redirect to contact page if accessed directly
    header("Location: contact.html");
    exit;
}
?>
