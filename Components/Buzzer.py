from Component import Component
from Enums import ComponentType, AnswerType, PinType
from QA import Question, Answer

class Buzzer(Component):
    def __init__(self, id, board):
        super().__init__(id, board)
        self.name = "Buzzer"
        self.device_type = ComponentType.OUTPUT_DEVICE
        follow_up_melody = Question(self.parameter, "notes", "What notes should the buzzer play? Please input the val", AnswerType.TEXT) # could ask users to input?
        self.question = Question(self.parameter, "mode", "What should be the behavior of the buzzer?",
                                 AnswerType.MULTI_OPTION,
                                 [
                                    Answer("Basic buzzing (one constant note)", "basic"),
                                    Answer("Complex melody", "complex") # ask sarah
                                 ]
                                 )
        
        self.question_analog = Question(self.paramter, "mode", "What should be the behavior of the buzzer?", 
                                AnswerType.MULTI_OPTION, 
                                 [
                                    Answer("Buzzing where the frequency is controlled by the input component value", "basic")
                                 ])
    
        self._buzzer = "buzzer" + str(id)
        self._analog_max = 32767 # does it make sense to span the entire frequency range?
        
    def get_global_var(self, state_num = 0):
        ret = self.str_init_variable("int", self._buzzer, "9") # Hardcoded pin value for now
        if self.states[state_num]["mode"] == "complex":
            ret = "#include 'pitches.h'\n" + ret
            ret += "int melody[] = {NOTE_C4, NOTE_G3, NOTE_G3, NOTE_A3, NOTE_G3, 0, NOTE_B3, NOTE_C4};\nint noteDurations[] = {4, 8, 8, 4, 4, 4, 4, 4};\n" # need to include separate file found here: https://docs.arduino.cc/built-in-examples/digital/toneMelody/
        return ret

    def get_setup(self):
        return "pinMode(" + self._buzzer + ", OUTPUT);/n" 
    
    def get_loop_logic_analog(self, state_num, param: str, param_max: int) -> str: 
        # has built in delay times, can remove
        ret = [f"tone({self._buzzer}, map({param}, 0, {str(param_max)}, 0, {str(self._analog_max)}));", "delay(1000)", "noTone(buzzer)", "delay(1000)"]
        
        return ret 
    def get_loop_logic(self, state_num = 0):
        state = self.states[state_num]
        match state["mode"]:
            case "basic":
                ret = [f"tone({self._buzzer}, 1000);", "delay(1000)", "noTone(buzzer)", "delay(1000)"]
            case "complex":
                ret = ["for (int thisNote = 0; thisNote < 8; thisNote++) {", "int noteDuration = 1000 / noteDurations[thisNote]", f"tone({self._buzzer}, melody[thisNote], noteDuration)", "int pauseBetweenNotes = noteDuration * 1.30", "delay(pauseBetweenNotes)", "noTone(8)"]
        return ret