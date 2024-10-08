from enum import Enum

class PinMode(Enum):
    INPUT = 0
    OUTPUT = 1

class PinType(Enum):
    GND = 0
    DIGITAL = 1
    ANALOG = 2
    PWM = 3
    I2C_SDA = 4
    I2C_SCL = 5
    SERIAL_RX = 6
    SERIAL_TX = 7
    SPI_MISO = 8
    SPI_MOSI = 9
    SPI_SS = 10
    VIN = 11
    POWER_3V3 = 12
    POWER_5V = 13
    UNAVAILABLE = 99

class ComponentType(Enum):
    INPUT_DEVICE_ONLY_DIGITAL = 0
    OUTPUT_DEVICE_ONLY_DIGITAL = 1
    INPUT_DEVICE = 2
    OUTPUT_DEVICE = 3

class AnswerType(Enum):
    BOOL = 0
    NUMERCIAL = 1
    MULTI_OPTION = 2
    TEXT = 3