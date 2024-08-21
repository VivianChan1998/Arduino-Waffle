from Component import Component
from Enums import ComponentType, AnswerType, PinType
from QA import Question, Answer

class Servo(Component):
    def __init__(self, id, board):
        super().__init__(id, board)
        self.name = "Servo"
        self.device_type = ComponentType.OUTPUT_DEVICE
        follow_up = Question(self.parameter, "pwm", "What should the PWM (pulse width modulation) be? The range of expected values is 0 - 255.", AnswerType.NUMERCIAL)
        self.question = Question(self.parameter, "mode", "What do you want to use your servo for?",
                                    AnswerType.MULTI_OPTION,
                                    [
                                        Answer("Shift to fixed position according to scaled input", "fixed position", follow_up),
                                        Answer("180 degree sweep", "sweep", follow_up)
                                    ]
                                )
        self._servo = "servo_" + str(id)
        self._pos = "pos_" + str(id)
        
    def get_global_var(self, state_num = 0):
        ret = ["Servo " + self._servo]
        if self.states[self.state_num]["mode"] == "sweep":
            ret.append("int " + self._pos + " = 0")
        return ["Servo " + self._servo]

    def get_setup(self):
        return [f"{self._servo}.attach(9)"] # 9 is a hardcoded pin
    
    def get_loop_logic(self, state_num = 0):
        state = self.states[state_num]
        match state["mode"]:
            case "fixed position": # Requires analog user input to directly scale, OR for conditional, they should declare the states individually
                # Things that need to be done 
                # 1) find the range of analog values (is it always 1023?)
                # 2) find way to find the input variable name
                ret = [f"{self._servo}.write(map({INPUT VALUE}, 0, 1023, 0, 180))", "delay(15)"]
            case "sweep":
                ret = [f"for ({self._pos} = 0; {self._pos} <= 180; {self.pos} += 1)" + "{", self._servo + f"write({self._pos})", "delay(15)", "}"], f"for ({self._pos} = 180; {self._pos} >= 0; {self.pos} -= 1)" + "{", self._servo + f"write({self._pos})", "delay(15)", "}"

        return ret 