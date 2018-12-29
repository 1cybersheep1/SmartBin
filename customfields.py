from peewee import TextField

class ListField(TextField):    
    def db_value(self, value):
        if value:
            value = ','.join(list(map(str, value)))
        else:
            value = ''
        return value

    def python_value(self, value):
        return value.split(',') if value else []