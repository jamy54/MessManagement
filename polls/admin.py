from django.contrib import admin
from polls.models import Catagory, User, Transaction, Expenditure

admin.site.register(Catagory)
admin.site.register(User)
admin.site.register(Transaction)
admin.site.register(Expenditure)
