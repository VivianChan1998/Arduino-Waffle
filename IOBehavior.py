class IOBehavior():
    def __init__(self, input_obj):
        self.input_obj = input_obj
        self.output_obj = []
        self.output_obj_state_num = []
        self.use_analog = False
        self.input_analog_max = 0
        pass
    
    def add_output(self, output_obj, state_num):
        self.output_obj.append(output_obj)
        self.output_obj_state_num.append(state_num)

    def get_output_loop(self):
        ret = []
        for n, o in enumerate(self.output_obj):
            state_num = self.output_obj_state_num[n]
            ret.append(o.get_loop_logic(state_num))
        return ret
    
    def set_analog(self):
        self.use_analog = True
        self.input_analog_max = self.input_obj.analog_max
        self.param_name = self.input_obj.analog_param_name

    def get_output_loop_analog(self):
        ret = []
        for n, o in enumerate(self.output_obj):
            state_num = self.output_obj_state_num[n]
            ret.append(o.get_loop_logic_analog(state_num, self.param_name, self.input_analog_max))
        return ret