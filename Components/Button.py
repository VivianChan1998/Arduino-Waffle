from Component import Component
from Enums import ComponentType, AnswerType
from QA import Question, Answer

class Button(Component):
    def __init__(self, id):
        super().__init__(id)
        self.name = "button"
        self.device_type = ComponentType.OUTPUT_DEVICE_DIGITAL
        self.library = None
        self.question = Question(self, "state", "What kind of input does the button take?",
                                 AnswerType.MULTI_OPTION,
                                 [
                                     Answer("when button is pressed for once", "press"),
                                     Answer("when button is held down", "held"),
                                     Answer("when button is not pressed", "not")
                                 ]
                                 )
        self.parameter = {"state": "press"}
        self._pin = "button" + str(id) + "_pin"
        self._val = "button" + str(id) + "_val"
        self._prev = "button" + str(id) + "_prev"
        
    def get_global_var(self):
        ret = self.str_init_variable("const int", self._pin, '2') #TEMP
        ret += self.str_init_variable("int", self._val, '0')
        if self.parameter["state"] is "press":
            ret += self.str_init_variable("int", self._prev, '0')
        return ret
    
    def get_setup(self):
        return self.str_pinMode(self._pin, 'o')
    
    def get_loop_start(self):
        ret = ''
        if self.parameter["state"] == "press":
            ret += self.str_assign_variable(self._prev, self._val)
        ret += self.str_assign_variable(self._val, 'digitalRead(' + self._pin + ');')
        return ret
    
    def get_loop_logic(self):
        print(self.parameter["state"])
        match self.parameter["state"]:
            case "press":
                ret = self._prev + " == 0 &&" + self._val + " == 1"
            case "held":
                ret = self._val + " == 1"
            case "not":
                ret = self._val + " == 0"
            case _:
                ret = ""
            
        return ret