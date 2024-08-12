from Enums import PinType

class Board():
    def __init__(self, name: str):
        self.name = name
        self.pins = [
            Pin(0, [PinType.UNAVAILABLE]), # Dummy pin to match index of list with pin num
            Pin(1, [PinType.SERIAL_RX]),
            Pin(2, [PinType.SERIAL_TX]),
            Pin(3, [PinType.DIGITAL]),
            Pin(4, [PinType.DIGITAL]),
            Pin(5, [PinType.DIGITAL]),
            Pin(6, [PinType.DIGITAL]),
            Pin(7, [PinType.DIGITAL]),
            Pin(8, [PinType.DIGITAL]),
            Pin(9, [PinType.DIGITAL]),
            Pin(10, [PinType.DIGITAL]),
            Pin(11, [PinType.DIGITAL]),
            Pin(12, [PinType.DIGITAL]),
            Pin(13, [PinType.DIGITAL]),
            Pin(14, [PinType.DIGITAL]),
            Pin(15, [PinType.DIGITAL]),
            Pin(16, [PinType.DIGITAL]),
            Pin(17, [PinType.DIGITAL, PinType.I2C_SDA]),
            Pin(18, [PinType.DIGITAL, PinType.I2C_SCL]),
            Pin(22, [PinType.DIGITAL, PinType.POWER_3V3]),
            Pin(23, [PinType.DIGITAL, PinType.POWER_5V])
            # ... 
        ]
        self.pins_ref = {
            "Serial": [1, 2],
            "I2C": [17, 18]
        }

        # all available pins on a board with its functionalitis
        # https://www.electronicshub.org/arduino-uno-pinout/ 
        # TODO initiate pins from reading in a file...

    def register_device(self, device_name, pin_spec) -> list:
        ret = []
        for p in pin_spec:
            n = self.register_one_pin(device_name, p)
            ret.append(n)
        return ret
        
    def register_one_pin(self, device_name:str, required_pin_type: PinType):
        # TODO: find which pin is available for required pin type
        pin_num = 8

        self.pins[pin_num].set_in_use(required_pin_type, device_name)
        return pin_num
    
    def loop_delay(self):
        # TODO: figure out delay
        return 100
    
    def __str__(self):
        print("------------------------")
        print("name: " + self.name)
        for p in self.pins:
            print(p)
        print("------------------------\n")
        return ""



class Pin():
    def __init__(self, pin_number, pin_types:list[PinType], in_use:bool=False):
        self.pin_number = pin_number
        self.pin_types = pin_types
        self.in_use = in_use

        self.used_as = None
        self.device_name = ""


    def set_in_use(self, used_as: PinType, device_name: str):
        self.in_use = True
        self.used_as = used_as
        self.device_name = device_name

    def __str__(self):
        return str(self.pin_number) + "  " + str(self.used_as) + "  " + str(self.in_use)



