from Component import Component
from Enums import ComponentType, AnswerType, PinType
from QA import Question, Answer

class DCMotor(Component):
    def __init__(self, id, board):
        super().__init__(id, board)
        self.name = "DCMotor"
        self.device_type = ComponentType.OUTPUT_DEVICE
        follow_up = Question(self.parameter, "pwm", "What should the PWM (pulse width modulation) be? The range of expected values is 0 - 255.", AnswerType.NUMERCIAL)
        self.question = Question(self.parameter, "rotation", "Which direction do you want the DC motor to rotate?",
                                    AnswerType.MULTI_OPTION,
                                    [
                                        Answer("clockwise", 1, follow_up),
                                        Answer("counterclockwise", 0, follow_up)
                                    ]
                                )
        self._dir_pin = "directionPin_" + str(id)
        self._pwm_pin = "pwnPin_" + str(id)
        self._brake_pin = "brakePin_" + str(id)
        
    def get_global_var(self, state_num = 0):
        ret = self.str_init_variable("int", self._dir_pin, "12") # Hardcoded pin value for now
        ret += self.str_init_variable("int", self._pwm_pin, "3") # Hardcoded pin value for now, must be 11, 10, 9, 6, 5, 3
        ret += self.str_init_variable("int", self._brake_pin, "9") # Hardcoded pin value for now
        return ret

    def get_setup(self):
        return ["pinMode(" + self._dir_pin + ", OUTPUT)", "pinMode(" + self._pwm_pin + ", OUTPUT)", "pinMode(" + self._brake_pin + ", OUTPUT)"]
    
    def get_loop_logic(self, state_num = 0):
        state = self.states[state_num]
        match state["rotation"]:
            case "clockwise":
                ret = [f"digitalWrite({self._dir_pin}, LOW)"]
            case "counterclockwise":
                ret = [f"digitalWrite({self._dir_pin}, HIGH)"]

        # has built in delay times, can remove to make the motor always rotate one direction
        ret.extend([f"digitalWrite({self._brake_pin}, LOW)", f"analogWrite({self._pwm_pin}, {state["pwm"]})", "delay(2000)", f"digitalWrite({self._brake_pin}, HIGH)", "analogWrite(pwmPin, 0)", "delay(2000)"])
        
        return ret 