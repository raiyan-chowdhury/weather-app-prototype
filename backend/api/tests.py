from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

class AuthenticationTests(TestCase):
    def setUp(self):
        """Create a user for testing"""
        self.user = get_user_model().objects.create_user(
            username='testuser',
            password='testpassword'
        )

    def test_register(self):
        """Validate user registration"""
        url = reverse('signup')
        data = {'username': 'newuser', 'password': 'newpassword'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['success'], True)
        self.assertEqual(response.json()['message'], 'User registered and logged in successfully')

    def test_login(self):
        """Authenticate user login"""
        url = reverse('login')
        data = {'username': 'testuser', 'password': 'testpassword'}
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['success'], True)
        self.assertEqual(response.json()['message'], 'User logged in successfully')

    def test_change_user_details(self):
        """Modify user details and confirm changes"""
        url = reverse('edit_user_details')
        data = {'currentUsername': 'testuser', 'newUsername': 'newusername', 'newPassword': 'newpassword'}
        response = self.client.put(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['success'], True)
        self.assertEqual(response.json()['message'], 'User details updated successfully')
