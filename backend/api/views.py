from django.http import JsonResponse
import json
from django.db import transaction
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from .models import MyUser, Location

@csrf_exempt
def signup(request):
    """Handle user registration"""
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        try:
            # Create a new user and log in
            user = MyUser.objects.create_user(username=username, password=password)
            login(request, user)
            return JsonResponse({'success': True, 'message': 'User registered and logged in successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)

@csrf_exempt
def user_login(request):
    """Handle user login"""
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        # Authenticate user and log in if successful
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'message': 'User logged in successfully'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid username or password'}, status=400)

@csrf_exempt
def user_logout(request):
    """Handle user logout"""
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'success': True, 'message': 'User logged out successfully'})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)

@csrf_exempt
def check_authentication(request):
    """Check user authentication status"""
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True})
    else:
        return JsonResponse({'authenticated': False}, status=401)

@csrf_exempt
def edit_user_details(request):
    """Modify user details"""
    if request.method == 'PUT':
        data = json.loads(request.body)
        current_username = data.get('currentUsername')
        new_username = data.get('newUsername')
        new_password = data.get('newPassword')

        try:
            # Find the user with the current username
            user = MyUser.objects.get(username=current_username)

            # Update username and password if provided
            if new_username:
                user.username = new_username
            if new_password:
                user.password = make_password(new_password)

            # Save the changes
            user.save()

            return JsonResponse({'success': True, 'message': 'User details updated successfully', 'currentUsername' : user.username})
        except MyUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)

@csrf_exempt
def delete_user_account(request):
    """Remove user details"""
    if request.method == 'DELETE':
        data = json.loads(request.body)
        username = data.get('username')
        
        try:
            # Find the user with the current username
            user = MyUser.objects.get(username=username)

            # Delete the user account
            user.delete()

            return JsonResponse({'success': True, 'message': 'User account deleted successfully'})
        except MyUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)

@csrf_exempt
def list_favourite_locations(request):
    """Retrieve user's favorite locations"""
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')

        try:
            # Find the user with the current username
            user = MyUser.objects.get(username=username)

            # Get user's favorite locations
            favourite_locations = user.favourite_locations.all()
            
            # Create a list of location names
            locations_list = [{'name': loc.name} for loc in favourite_locations]

            return JsonResponse({'success': True, 'favourite_locations': locations_list})
        except MyUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})

@csrf_exempt
def add_favourite_location(request):
    """Add location to user's favorites"""
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        location_name = data.get('name')

        try:
            with transaction.atomic():
                # Find the user with the current username
                user = MyUser.objects.get(username=username)

                # Check if the location with the given name already exists in the user's favourites
                if user.favourite_locations.filter(name=location_name).exists():
                    return JsonResponse({'success': False, 'message': 'Location already in favourites'})

                # If the location does not exist, create it and add to the user's favourites
                new_location = Location.objects.create(name=location_name)
                user.favourite_locations.add(new_location)

                return JsonResponse({'success': True, 'message': 'Location added to favourites'})
        except MyUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})

@csrf_exempt
def delete_favourite_location(request):
    """Delete location from user's favorites"""
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        location_name = data.get('name')

        try:
            with transaction.atomic():
                # Find the user with the current username
                user = MyUser.objects.get(username=username)

                # Find the location with the given name
                location_to_remove = user.favourite_locations.filter(name=location_name).first()
                
                # Remove the location from the user's favourites
                user.favourite_locations.remove(location_to_remove)

                return JsonResponse({'success': True, 'message': 'Location removed from favourites'})
        except MyUser.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})
