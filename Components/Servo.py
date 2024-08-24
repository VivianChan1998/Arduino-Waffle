from Component import Component
from Enums import ComponentType, AnswerType, PinType
from QA import Question, Answer

class Servo(Component):
    def __init__(self, id, board):
        super().__init__(id, board)
        self.name = "Servo"
        self.device_type = ComponentType.OUTPUT_DEVICE
        follow_up_pwm = Question(self.parameter, "pwm", "What should the PWM (pulse width modulation) be? The range of expected values is 0 - 255.", AnswerType.NUMERCIAL)
        follow_up_position = Question(self.parameter, "position", "What should the position of the servo be? The range of expected values is 0 - 180.", AnswerType.NUMERCIAL, follow_up_question=follow_up_pwm)
        
        # question for digital, notice that they have to specify both pwm and position in the follow up questions
        self.question = Question(self.parameter, "mode", "What do you want to use your servo for?",
                                    AnswerType.MULTI_OPTION,
                                    [
                                        Answer("Shift to fixed position", "position", follow_up_position),
                                        Answer("180 degree sweep", "sweep", follow_up_pwm)
                                    ]
                                )
        
        # question for analog, notic
        self.question_analog = Question(self.parameter, "mode", "What do you want to use your servo for?", 
                                    AnswerType.MULTI_OPTION, 
                                    [
                                        Answer("Shift to position dependent on analog input", "position")
                                        # How to add pwm/give both as options? 
                                    ])

        self._servo = "servo_" + str(id)
        self._pos = "pos_" + str(id)
        self.analog_max = 180

    def get_global_var(self, state_num = 0):
        ret = ["Servo " + self._servo]
        if self.states[self.state_num]["mode"] == "sweep":
            ret.append("int " + self._pos + " = 0")
        return ret 

    def get_setup(self):
        return [f"{self._servo}.attach(9)"] # 9 is a hardcoded pin
    
    def get_loop_logic_analog(self, state_num, param: str, param_max: int) -> str: 
        ret = [f"{self._servo}.write(map({param}, 0, {str(param_max)}, 0, {self.analog_max}))", "delay(15)"]
        return ret
    
    def get_loop_logic(self, state_num = 0):
        state = self.states[state_num]
        match state["mode"]:
            case "position": 
                ret = [f"{self._servo}.write({self.state["position"]})", "delay(15)"]
            case "sweep":
                ret = [f"for ({self._pos} = 0; {self._pos} <= 180; {self.pos} += 1)" + "{", self._servo + f"write({self._pos})", "delay(15)", "}"], f"for ({self._pos} = 180; {self._pos} >= 0; {self.pos} -= 1)" + "{", self._servo + f"write({self._pos})", "delay(15)", "}"

        return ret 