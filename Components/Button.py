from Component import Component
from Enums import ComponentType

class Button(Component):
    def __init__(self):
        super().__init__()
        self.name = "button"
        self.device_type = ComponentType.OUTPUT_DEVICE_DIGITAL
        self.library = None

        self._pin_name = "button" + str(id) + "_pin"
        self._val_name = "button" + str(id) + "_val"
        
    def get_global_var(self):
        ret = self.str_init_variable("int", self._pin_name, '2') #TEMP
        ret = self.str_init_variable("int", self._val_name, '0')
        return ret
    
    def get_setup(self):
        return self.str_pinMode(self._pin_name, 'o')
    
    def get_loop_start(self):
        ret = self.str_assign_variable(self._val_name, 'digitalRead(' + self._pin_name + ');')
        return ret