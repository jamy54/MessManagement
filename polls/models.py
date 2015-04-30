from django.db import models

# Create your models here.
'''
class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField('date published')

class Choice(models.Model):
    question = models.ForeignKey(Question)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)
'''
class Catagory(models.Model):
    def __unicode__(self):
        return self.name
    name = models.CharField(max_length=200)

class User(models.Model):
    def __unicode__(self):
        return self.name
    name = models.CharField(max_length=200)

class Transaction(models.Model):
    def __unicode__(self):
        return str(self.date.strftime('%m/%d/%Y'))
    date = models.DateField('Day')
    catagoryId = models.ForeignKey(Catagory)

class Expenditure(models.Model):
    def __unicode__(self):
        return str(self.id)
    transactionId = models.ForeignKey(Transaction)
    userId = models.ForeignKey(User)
    expenditure = models.IntegerField(default=0)
    quantity = models.IntegerField(default=0)