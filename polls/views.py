# Create your views here.

from django.http import HttpResponse, HttpRequest, QueryDict
from django.template import RequestContext, loader
from django.views.decorators.csrf import csrf_exempt, csrf_protect
import json
import ast
from polls.models import Catagory, User, Transaction, Expenditure


@csrf_exempt
def htmlRander(request):
    template = loader.get_template('polls/index.html')
    context = RequestContext(request, {
    })
    return HttpResponse(template.render(context))

def features(request):
    template = loader.get_template('polls/features.html')
    context = RequestContext(request, {
    })
    return HttpResponse(template.render(context))

def news(request):
    template = loader.get_template('polls/news.html')
    context = RequestContext(request, {
    })
    return HttpResponse(template.render(context))

def post(request):
    template = loader.get_template('polls/post.html')
    context = RequestContext(request, {
    })
    return HttpResponse(template.render(context))


def contact(request):
    template = loader.get_template('polls/contact.html')
    context = RequestContext(request, {
    })
    return HttpResponse(template.render(context))

def about(request):
    template = loader.get_template('polls/about.html')
    context = RequestContext(request, {
    })
    return HttpResponse(template.render(context))

def detail(request, poll_i):
    return HttpResponse("You're looking at the details of poll %s." % poll_i)

@csrf_exempt
def getName(request):
    if request.method == 'POST':
        try:
            u = User.objects.all()
            data = {}
            for i in u:
                data[i.id] = i.name
            return HttpResponse(json.dumps(data))
        except Exception as e:
            return HttpResponse('')
    else:
        return HttpResponse("nothing")

def getNameById(id):
    Name = None
    try:
        u = User.objects.all()
        data = {}
        for i in u:
            if i.id == id:
                return i.name
        return None
    except Exception as e:
        return None

@csrf_exempt
def addcatagory(request):
    if request.method == 'POST':
        catagoryName = request.POST['catagoryName']

        try:
            c = Catagory(name=catagoryName)
            c.save()
            return HttpResponse(json.dumps({'status': 'OK'}))
        except Exception as e:
            return HttpResponse(json.dumps({'status': e.message}))
    else:
        return HttpResponse("nothing")

@csrf_exempt
def getcatagory(request):
    if request.method == 'POST':
        try:
            c = Catagory.objects.all()
            data = {}
            for i in c:
                data[i.id] = i.name
            return HttpResponse(json.dumps({'data': data}))
        except Exception as e:
            return HttpResponse(json.dumps({'status': e.message}))
    else:
        return HttpResponse("nothing")

def catagoryName(catId = None):
    try:
        if catId == 0:
            c = Catagory.objects.all()
        else:
            c = Catagory.objects.filter(id = catId)
        data = []
        for i in c:
            d={}
            d['id'] = i.id
            d['name'] = i.name
            data.append(d)
        return data
    except Exception as e:
        return e.message

def getTransactionDate(catId,year=None,month=None):
    try:
        if month:
            td = Transaction.objects.filter(catagoryId = catId,date__year=year,date__month=month)
        else:
            from datetime import date
            year = date.today().year
            month = date.today().month
            td = Transaction.objects.filter(catagoryId = catId,date__year=year,date__month=month)
        data=[]
        for t in td:
            data.append(t.date)
        return data
    except Exception as e:
        return e.message

@csrf_exempt
def insertMeal(request):
    from datetime import date
    q = request.POST.keys()[0]
    data = ast.literal_eval(q)

    catId = int(data['cat'])
    dateToday = date.today()

    transIfExist = Transaction.objects.filter(date=dateToday,catagoryId = catId)
    if len(list(transIfExist.values())) >0:
        try:
            allEx = Expenditure.objects.filter(transactionId=transIfExist)
            for ex in allEx:
                ex.expenditure = int(data['data'][str(ex.userId_id)]['expenditure'])
                ex.quantity = int(data['data'][str(ex.userId_id)]['quantity'])
                ex.save()
            return HttpResponse(json.dumps({'status': 'ok','message':'upadated successfully'}))
        except Exception as e:
            return HttpResponse(json.dumps({'status': 'error','message':'cant able to update'}))
    else:
        try:
            catIns = Catagory.objects.get(id=catId)
            t = Transaction(date=dateToday,catagoryId = catIns)
            t.save()
            uallIns = User.objects.all()
            for uins in uallIns:
                ex = int(data['data'][str(uins.id)]['expenditure'])
                qu = int(data['data'][str(uins.id)]['quantity'])
                x = Expenditure(transactionId=t, userId=uins, expenditure=ex, quantity=qu)
                x.save()
            return HttpResponse(json.dumps({'status': 'ok','message':'inserted successflly'}))
        except Exception as e:
            return HttpResponse(json.dumps({'status': 'error','message':'cant able to insert'}))

@csrf_exempt
def get_info(request):
    from datetime import date
    catId = None
    if request.POST:
        q = request.POST.keys()
        postData = request.POST
        catId = None
        if postData.has_key('catId'):
            catId = int(postData['catId'])

    totalDataDict = []
    catNames = catagoryName(catId)

    for catName in catNames:
        catDict = {}
        catDict['catagoryName'] = catName['name']
        dayData = []
        allDates = getTransactionDate(catName['id'],postData['year'],postData['month'])
        for day in allDates:
            dateDict = {}
            dateDict['date'] = day.strftime('%m/%d/%Y')
            trans = Transaction.objects.filter(date=day,catagoryId = catName['id'])
            # if len(list(trans.values())) >0:
            allEx = Expenditure.objects.filter(transactionId=trans)
            personalData = []
            for ex in allEx:
                personalDict = {}
                personalDict['name'] = str(ex.userId)
                personalDict['expenditure'] = ex.expenditure
                personalDict['quantity'] = ex.quantity
                personalData.append(personalDict)
            dateDict['personalData'] = personalData
            dayData.append(dateDict)
            # if len(dayData) == 3:
            #     return HttpResponse(json.dumps(str(dayData)))
        catDict['dayData'] = dayData
        totalDataDict.append(catDict)

    return HttpResponse(json.dumps(totalDataDict))



def index(request):
    try:
        return HttpResponse('vodai')
    except Exception as e:
        return HttpResponse(e.message)

