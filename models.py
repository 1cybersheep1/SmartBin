import datetime

from peewee import *

from customfields import ListField

DATABASE = SqliteDatabase('database.db')


class SmartBin(Model):
    bin_type = CharField()
    percentage = IntegerField(default=0)
    latitude = DoubleField() # deviam de ser unicas
    longitude = DoubleField()
    last_update = DateTimeField(default=datetime.datetime.now)

    class Meta:
        database = DATABASE

    @classmethod
    def create_bin(cls, bin_type, latitude, longitude):
        try:
            cls.select().where(cls.bin_type==bin_type, cls.latitude==latitude, cls.longitude==longitude).get()
        except cls.DoesNotExist:
            return cls.create(bin_type=bin_type, latitude=latitude, longitude=longitude)
        else:
            raise Exception('Bin already exists')


class Route(Model):
    car = IntegerField(unique=True)
    bins = ListField(default=[])
    created_at = DateTimeField(default=datetime.datetime.now)

    class Meta:
        database = DATABASE

    @classmethod
    def create_route(cls, car, bin_list):
        try:
            cls.create(car=latitude, bins=bin_list)
        except:
            raise Exception("Route already defined")

            
    
  
    
  
def initialize():
    DATABASE.connect()
    DATABASE.create_tables([SmartBin, Route], safe=True)
    DATABASE.close()
