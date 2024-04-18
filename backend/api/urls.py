from django.urls import path

from .views import signup, user_login, user_logout, check_authentication, edit_user_details, delete_user_account
from .views import list_favourite_locations, add_favourite_location, delete_favourite_location

urlpatterns = [
    path('signup/', signup, name="signup"),
    path('login/', user_login, name="login"),
    path('logout/', user_logout, name="logout"),
    path('check-authentication/', check_authentication, name='check-authentication'),
    path('edit-user-details/', edit_user_details, name='edit_user_details'),
    path('delete-user-account/', delete_user_account, name='delete_user_account'),
    path('list-favourite-locations/', list_favourite_locations, name='list_favourite_locations'),
    path('add-favourite-location/', add_favourite_location, name='add_favourite_location'),
    path('delete-favourite-location/', delete_favourite_location, name='delete_favourite_location'),
]
