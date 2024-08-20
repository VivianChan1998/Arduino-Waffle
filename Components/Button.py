from Component import Component
from Enums import ComponentType, AnswerType
from QA import Question, Answer

class Button(Component):
    def __init__(self, id, board):
        super().__init__(id, board)
        self.name = "button"
        self.device_type = ComponentType.INPUT_DEVICE_ONLY_DIGITAL
        self.question = Question(self.init, "mode", "What kind of input does the button take?",
                                 AnswerType.MULTI_OPTION,
                                 [
                                     Answer("when button is pressed for once", "press"),
                                     Answer("when button is held down", "held"),
                                     Answer("when button is not pressed", "not")
                                 ]
                                 )
        self._pin = "button" + str(id) + "_pin"
        self._val = "button" + str(id) + "_val"
        self._prev = "button" + str(id) + "_prev"
        
    def get_global_var(self):
        ret = self.str_init_variable("const int", self._pin, '2') #TEMP
        ret += self.str_init_variable("int", self._val, '0')
        if self.init["mode"] is "press":
            ret += self.str_init_variable("int", self._prev, '0')
        return ret
    
    def get_setup(self):
        return self.str_pinMode(self._pin, 'o')
    
    def get_loop_start(self):
        ret = ''
        if self.init["mode"] == "press":
            ret += self.str_assign_variable(self._prev, self._val)
        ret += self.str_assign_variable(self._val, 'digitalRead(' + self._pin + ');')
        return ret
    
    def get_loop_logic(self, state_num = 0):
        print(self.init)
        print(self.states[state_num])
        print(self.init["mode"])
        match self.init["mode"]:
            case "press":
                ret = self._prev + " == 0 &&" + self._val + " == 1"
            case "held":
                ret = self._val + " == 1"
            case "not":
                ret = self._val + " == 0"
            case _:
                ret = ""
            
        return ret