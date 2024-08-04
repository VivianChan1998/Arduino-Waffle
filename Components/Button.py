from Component import Component
from Enums import ComponentType

class Button(Component):
    def __init__(self, id):
        super().__init__(id)
        self.name = "button"
        self.device_type = ComponentType.OUTPUT_DEVICE_DIGITAL
        self.library = None
        self.state_names = ["when button is pressed for once", "when button is pressed down",
                            "when button is not pressed"]
        self.parameter = [None, None, None]

        self._pin = "button" + str(id) + "_pin"
        self._val = "button" + str(id) + "_val"
        self._prev = "button" + str(id) + "_prev"
        
    def get_global_var(self):
        ret = self.str_init_variable("const int", self._pin, '2') #TEMP
        ret += self.str_init_variable("int", self._val, '0')
        if self.state is "when button is pressed for once":
            ret += self.str_init_variable("int", self._prev, '0')
        return ret
    
    def get_setup(self):
        return self.str_pinMode(self._pin, 'o')
    
    def get_loop_start(self):
        ret = ''
        if self.state is "when button is pressed for once":
            ret += self.str_assign_variable(self._prev, self._val)
        ret += self.str_assign_variable(self._val, 'digitalRead(' + self._pin + ');')
        return ret
    
    def get_loop_logic(self):
        print(self.state)
        match self.state:
            case "when button is pressed for once":
                ret = self._prev + " == 0 &&" + self._val + " == 1"
            case "when button is pressed down":
                ret = self._val + " == 1"
            case "when button is not pressed":
                ret = self._val + " == 0"
            case _:
                ret = ""
            
        return ret