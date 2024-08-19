class IOBehavior():
    def __init__(self, input_obj):
        self.input_obj = input_obj
        self.output_obj = []
        self.output_obj_state_num = []
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